"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { InviteMemberFormValues } from "@/lib/validations/team";
import { inviteMemberSchema } from "@/lib/validations/team";

interface RoleOption {
	label: string;
	value: InviteMemberFormValues["role"];
	description: string;
}

interface TeamInviteFormProps {
	onSubmit: (
		values: InviteMemberFormValues,
	) => Promise<{ success?: boolean; error?: string }>;
	roleOptions: RoleOption[];
	className?: string;
}

const TeamInviteForm = ({
	onSubmit,
	roleOptions,
	className,
}: TeamInviteFormProps) => {
	const [isPending, startTransition] = useTransition();

	const form = useForm<InviteMemberFormValues>({
		resolver: zodResolver(inviteMemberSchema),
		defaultValues: {
			email: "",
			role: (roleOptions[0]?.value ??
				"EDITOR") as InviteMemberFormValues["role"],
		},
	});

	const handleSubmit = form.handleSubmit((values) => {
		startTransition(async () => {
			const result = await onSubmit(values);

			if (result?.error) {
				toast.error(result.error);
				return;
			}

			toast.success("Teammate added successfully.");
			form.reset({
				email: "",
				role: (roleOptions[0]?.value ??
					values.role) as InviteMemberFormValues["role"],
			});
		});
	});

	return (
		<Form {...form}>
			<form
				className={cn(
					"flex h-full w-full flex-col gap-5 rounded-lg border bg-card p-5 shadow-sm",
					className,
				)}
				onSubmit={handleSubmit}
			>
				<div className="flex w-full flex-col items-center justify-center gap-2.5">
					<h2 className="w-full text-left font-semibold text-[18px] leading-[18px]">
						Invite teammates
					</h2>
					<p className="w-full text-left text-[14px] text-muted-foreground leading-[14px]">
						Only existing Recruitify users can be added right now.
					</p>
				</div>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Work email</FormLabel>
							<FormControl>
								<Input
									autoComplete="email"
									placeholder="teammate@company.com"
									type="email"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Role</FormLabel>
							<Select
								disabled={roleOptions.length === 0 || isPending}
								onValueChange={field.onChange}
								value={field.value}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{roleOptions.map((role) => (
										<SelectItem key={role.value} value={role.value}>
											{role.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
							<p className="text-muted-foreground text-xs">
								{roleOptions.find((role) => role.value === field.value)
									?.description ?? "Choose the level of access to grant."}
							</p>
						</FormItem>
					)}
				/>
				<Button className="mt-auto ml-auto" disabled={isPending} type="submit">
					{isPending ? "Sending invite…" : "Send invite"}
				</Button>
			</form>
		</Form>
	);
};

export default TeamInviteForm;
