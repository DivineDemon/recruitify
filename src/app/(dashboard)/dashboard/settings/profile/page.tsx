import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import ProfileForm from "@/components/settings/profile-form";
import {
	type ProfileFormValues,
	profileSchema,
} from "@/lib/validations/profile";
import { resolveCurrentUser } from "@/server/auth";
import { db } from "@/server/db";

const updateProfile = async (values: ProfileFormValues) => {
	"use server";

	const { user } = await resolveCurrentUser();

	if (!user) {
		redirect("/signin");
	}

	const parsed = profileSchema.parse(values);

	await db.user.update({
		where: { id: user.id },
		data: {
			name: parsed.name,
			imageUrl: parsed.imageUrl ? parsed.imageUrl : null,
		},
	});

	revalidatePath("/dashboard/settings/profile");
};

const ProfileSettingsPage = async () => {
	const { user } = await resolveCurrentUser();

	if (!user) {
		redirect("/signin");
	}

	return (
		<div className="flex h-full w-full flex-col items-start justify-start gap-5 p-5">
			<div className="flex w-full max-w-3xl flex-col items-center justify-center gap-2.5">
				<h1 className="w-full text-left font-semibold text-[24px] leading-[24px] tracking-tight">
					Profile settings
				</h1>
				<p className="w-full text-left text-[14px] text-muted-foreground leading-[14px]">
					Update your personal details and avatar used across the dashboard.
				</p>
			</div>
			<ProfileForm
				onSubmit={updateProfile}
				user={{
					name: user.name ?? "",
					email: user.email ?? "",
					imageUrl: user.imageUrl ?? "",
				}}
			/>
		</div>
	);
};

export default ProfileSettingsPage;
