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
	return db.user.upsert({
		where: { kindeId: identity.id },
		update: {
			email: ensureEmail(identity),
			name: normalizeName(identity),
			imageUrl: identity.picture ?? undefined,
		},
		create: {
			kindeId: identity.id,
			email: ensureEmail(identity),
			name: normalizeName(identity),
			imageUrl: identity.picture ?? undefined,
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
