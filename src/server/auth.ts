import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { db } from "@/server/db";

export type DbUser = Awaited<ReturnType<typeof db.user.findUnique>>;

type AnyKindeUser = KindeUser<Record<string, unknown>>;

const ensureEmail = (user: AnyKindeUser) =>
	user.email ?? `${user.id}@placeholder.kinde`;

const normalizeName = (user: AnyKindeUser) =>
	user.given_name && user.family_name
		? `${user.given_name} ${user.family_name}`.trim()
		: (user.given_name ?? user.family_name ?? user.email ?? user.id);

const syncUserWithDatabase = async (
	identity: AnyKindeUser,
): Promise<DbUser> => {
	const existingUser = await db.user.findUnique({
		where: { kindeId: identity.id },
	});

	if (!existingUser) {
		return db.user.create({
			data: {
				kindeId: identity.id,
				email: ensureEmail(identity),
				name: normalizeName(identity),
				imageUrl: identity.picture ?? undefined,
			},
		});
	}

	return db.user.update({
		where: { id: existingUser.id },
		data: {
			email: ensureEmail(identity),
			name:
				existingUser.name && existingUser.name.trim().length > 0
					? existingUser.name
					: normalizeName(identity),
			imageUrl:
				existingUser.imageUrl && existingUser.imageUrl.trim().length > 0
					? existingUser.imageUrl
					: (identity.picture ?? existingUser.imageUrl ?? undefined),
		},
	});
};

export const resolveCurrentUser = async () => {
	const session = getKindeServerSession();
	const isAuthenticated = await session.isAuthenticated();

	if (!isAuthenticated) {
		return { session, kindeUser: null, user: null as DbUser };
	}

	const kindeUser = (await session.getUser()) as AnyKindeUser | null;

	if (!kindeUser) {
		return { session, kindeUser: null, user: null as DbUser };
	}

	const user = await syncUserWithDatabase(kindeUser);

	return { session, kindeUser, user };
};
