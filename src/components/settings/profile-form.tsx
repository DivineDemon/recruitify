"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	type ProfileFormValues,
	profileSchema,
} from "@/lib/validations/profile";

interface ProfileFormProps {
	user: {
		name: string;
		email: string;
		imageUrl: string;
	};
	onSubmit: (values: ProfileFormValues) => Promise<void>;
}

const ProfileForm = ({ user, onSubmit }: ProfileFormProps) => {
	const [isPending, startTransition] = useTransition();

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: user.name ?? "",
			imageUrl: user.imageUrl ?? "",
		},
	});

	const handleSubmit = form.handleSubmit((values) => {
		startTransition(async () => {
			try {
				await onSubmit(values);
				toast.success("Profile updated successfully.");
			} catch (error) {
				toast.error(`Unable to update profile. Please try again. ${error}`);
			}
		});
	});

	return (
		<Form {...form}>
			<form
				className="flex h-full w-full max-w-3xl flex-col gap-5 rounded-xl border bg-card p-5"
				onSubmit={handleSubmit}
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>Full Name</FormLabel>
							<FormControl>
								<Input placeholder="Jane Doe" {...field} />
							</FormControl>
							<FormDescription>
								We&apos;ll use this name across the dashboard.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormItem className="w-full">
					<FormLabel>Email</FormLabel>
					<FormControl>
						<Input disabled readOnly value={user.email} />
					</FormControl>
					<FormDescription>
						Your login email can be managed from your Kinde account.
					</FormDescription>
				</FormItem>
				<FormField
					control={form.control}
					name="imageUrl"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>Avatar</FormLabel>
							<FormControl>
								<FileUploader
									accept="image/*"
									endpoint="mediaUploader"
									helperText="Supported formats: JPG, PNG, GIF up to 4MB."
									onChange={(url) => field.onChange(url ?? "")}
									value={field.value}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="mt-auto flex justify-end gap-2">
					<Button
						className="w-full sm:w-auto"
						disabled={isPending}
						type="submit"
					>
						{isPending ? <Loader2 className="animate-spin" /> : "Save changes"}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default ProfileForm;
