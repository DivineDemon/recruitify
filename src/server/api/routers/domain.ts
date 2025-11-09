import { randomUUID } from "node:crypto";

import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { $Enums, type Prisma } from "@/server/db";

const { DomainStatus, DomainType } = $Enums;

const hostnameRegex = /^(?=.{3,255}$)(?!-)(?!.*--)[a-z0-9-]+(\.[a-z0-9-]+)+$/;

const registerDomainInput = z.object({
	agencyId: z.string().cuid(),
	templateId: z.string().cuid().optional(),
	hostname: z
		.string()
		.min(3)
		.max(255)
		.regex(hostnameRegex, "Invalid hostname."),
	type: z.nativeEnum(DomainType),
});

const listDomainsInput = z.object({
	agencyId: z.string().cuid(),
	templateId: z.string().cuid().optional(),
});

const updateDomainStatusInput = z.object({
	domainId: z.string().cuid(),
	status: z.nativeEnum(DomainStatus),
	error: z.string().max(512).optional(),
	lastCheckedAt: z.date().optional(),
	dnsRecords: z.record(z.any()).optional(),
});

const deleteDomainInput = z.object({
	domainId: z.string().cuid(),
});

export const domainRouter = createTRPCRouter({
	register: publicProcedure
		.input(registerDomainInput)
		.mutation(async ({ ctx, input }) => {
			const data = registerDomainInput.parse(input);
			const verificationToken =
				data.type === DomainType.CUSTOM ? randomUUID() : null;

			return ctx.db.domain.create({
				data: {
					agencyId: data.agencyId,
					templateId: data.templateId,
					hostname: data.hostname.toLowerCase(),
					type: data.type,
					status:
						data.type === DomainType.SUBDOMAIN
							? DomainStatus.ACTIVE
							: DomainStatus.PENDING,
					verificationToken,
					dnsRecords:
						data.type === DomainType.SUBDOMAIN
							? {
									aRecord: "edge.recruitify.dev",
								}
							: undefined,
				},
			});
		}),

	list: publicProcedure
		.input(listDomainsInput)
		.query(async ({ ctx, input }) => {
			const data = listDomainsInput.parse(input);
			const where: Prisma.DomainWhereInput = {
				agencyId: data.agencyId,
				templateId: data.templateId,
			};

			return ctx.db.domain.findMany({
				where,
				orderBy: { createdAt: "desc" },
			});
		}),

	updateStatus: publicProcedure
		.input(updateDomainStatusInput)
		.mutation(async ({ ctx, input }) => {
			const data = updateDomainStatusInput.parse(input);
			return ctx.db.domain.update({
				where: { id: data.domainId },
				data: {
					status: data.status,
					lastCheckedAt: data.lastCheckedAt ?? new Date(),
					dnsRecords: data.dnsRecords,
				},
			});
		}),

	remove: publicProcedure
		.input(deleteDomainInput)
		.mutation(async ({ ctx, input }) => {
			const data = deleteDomainInput.parse(input);
			return ctx.db.domain.delete({
				where: { id: data.domainId },
			});
		}),
});
