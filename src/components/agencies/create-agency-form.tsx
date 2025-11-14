"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { cn } from "@/lib/utils";
import {
	type CreateAgencyFormValues,
	createAgencySchema,
} from "@/lib/validations/agency";

interface CreateAgencyFormProps {
	onSubmit: (values: CreateAgencyFormValues) => Promise<{
		success?: boolean;
		error?: string;
	}>;
	className?: string;
}

const CreateAgencyForm = ({ onSubmit, className }: CreateAgencyFormProps) => {
	const [isPending, startTransition] = useTransition();

	const form = useForm<CreateAgencyFormValues>({
		resolver: zodResolver(createAgencySchema),
		defaultValues: {
			displayName: "",
			slug: "",
			description: "",
		},
	});

	const handleSubmit = form.handleSubmit((values) => {
		startTransition(async () => {
			const result = await onSubmit(values);
			if (result?.error) {
				toast.error(result.error);
				return;
			}

			toast.success("Agency created successfully.");
			form.reset();
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
						Create a new agency
					</h2>
					<p className="w-full text-left text-[14px] text-muted-foreground leading-[14px]">
						Set up a workspace to manage your own recruitment team.
					</p>
				</div>
				<FormField
					control={form.control}
					name="displayName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Agency name</FormLabel>
							<FormControl>
								<Input
									placeholder="Acme Recruiting"
									{...field}
									autoComplete="organization"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="slug"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Slug</FormLabel>
							<FormControl>
								<Input
									placeholder="acme-recruiting"
									{...field}
									autoComplete="off"
								/>
							</FormControl>
							<FormDescription>
								Example:&nbsp;
								<code>yourdomain.com/site/acme-recruiting</code>.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<textarea
									className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
									placeholder="Tell us about this agency (optional)."
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="mt-auto ml-auto" disabled={isPending} type="submit">
					{isPending ? "Creating…" : "Create agency"}
				</Button>
			</form>
		</Form>
	);
};

export default CreateAgencyForm;
