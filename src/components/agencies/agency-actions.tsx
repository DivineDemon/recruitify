"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
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
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import WarningModal from "@/components/warning-modal";
import {
	type ArchiveAgencyFormValues,
	type UpdateAgencyFormValues,
	updateAgencySchema,
} from "@/lib/validations/agency";
import type { Prisma } from "@/server/db";

type AgencySummary = Pick<
	Prisma.AgencyGetPayload<{
		select: {
			id: true;
			displayName: true;
			slug: true;
			description: true;
		};
	}>,
	"id" | "displayName" | "slug" | "description"
>;

interface AgencyActionsProps {
	agency: AgencySummary;
	canEdit: boolean;
	onUpdate: (values: UpdateAgencyFormValues) => Promise<{
		success?: boolean;
		error?: string;
	}>;
	onArchive: (values: ArchiveAgencyFormValues) => Promise<{
		success?: boolean;
		error?: string;
	}>;
}

const AgencyActions = ({
	agency,
	canEdit,
	onUpdate,
	onArchive,
}: AgencyActionsProps) => {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [isArchiving, startArchiveTransition] = useTransition();
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);

	const form = useForm<UpdateAgencyFormValues>({
		resolver: zodResolver(updateAgencySchema),
		defaultValues: {
			agencyId: agency.id,
			displayName: agency.displayName,
			slug: agency.slug,
			description: agency.description ?? "",
		},
	});

	useEffect(() => {
		if (open) {
			form.reset({
				agencyId: agency.id,
				displayName: agency.displayName,
				slug: agency.slug,
				description: agency.description ?? "",
			});
		}
	}, [agency, form, open]);

	const handleSubmit = form.handleSubmit((values) => {
		startTransition(async () => {
			const result = await onUpdate(values);

			if (result?.error) {
				toast.error(result.error);
				return;
			}

			toast.success("Agency details updated.");
			setOpen(false);
		});
	});

	const handleArchiveConfirm = () => {
		startArchiveTransition(async () => {
			const result = await onArchive({
				agencyId: agency.id,
			});

			if (result?.error) {
				toast.error(result.error);
				return;
			}

			toast.success("Agency archived.");
			setIsArchiveDialogOpen(false);
			setOpen(false);
		});
	};

	return (
		<Sheet onOpenChange={(nextOpen: boolean) => setOpen(nextOpen)} open={open}>
			<SheetTrigger asChild>
				<Button
					aria-label={`Edit ${agency.displayName}`}
					disabled={!canEdit}
					size="icon"
					type="button"
					variant="ghost"
				>
					{isPending ? <Loader2 className="animate-spin" /> : <Pencil />}
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader className="border-b">
					<SheetTitle>Edit agency</SheetTitle>
					<SheetDescription>
						Update the workspace name, slug, or description. Changes apply
						immediately for all members.
					</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<form
						className="flex h-full flex-col gap-4 px-4 pb-6"
						onSubmit={handleSubmit}
					>
						<FormField
							control={form.control}
							name="agencyId"
							render={({ field }) => (
								<input type="hidden" {...field} value={agency.id} />
							)}
						/>
						<FormField
							control={form.control}
							name="displayName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Agency name</FormLabel>
									<FormControl>
										<Input
											{...field}
											autoComplete="organization"
											placeholder="Acme Recruiting"
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
										<Input {...field} autoComplete="off" placeholder="acme" />
									</FormControl>
									<FormDescription>
										Example:&nbsp;
										<code>yourdomain.com/site/{field.value || "acme"}</code>.
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
											{...field}
											className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
											placeholder="Tell members what this agency focuses on."
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<SheetFooter className="p-0">
							<Button disabled={isPending || !canEdit} type="submit">
								{isPending ? (
									<>
										<Loader2 className="animate-spin" />
										Saving…
									</>
								) : (
									"Save changes"
								)}
							</Button>
						</SheetFooter>
						<div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
							<div className="flex items-start justify-between gap-4">
								<div>
									<h3 className="font-semibold text-destructive">
										Archive agency
									</h3>
									<p className="text-muted-foreground text-sm">
										Owners can archive workspaces they no longer need. Access is
										removed for every member until the workspace is restored.
									</p>
								</div>
								<Button
									disabled={isArchiving || !canEdit}
									onClick={() => {
										if (!canEdit) return;
										setIsArchiveDialogOpen(true);
									}}
									type="button"
									variant="destructive"
								>
									{isArchiving ? "Archiving…" : "Archive"}
								</Button>
							</div>
						</div>
					</form>
				</Form>
				<WarningModal
					cta={handleArchiveConfirm}
					isLoading={isArchiving}
					open={isArchiveDialogOpen}
					setOpen={setIsArchiveDialogOpen}
					text="Members will lose access immediately. Restoring requires support intervention."
					title={`Archive ${agency.displayName}?`}
				/>
			</SheetContent>
		</Sheet>
	);
};

export default AgencyActions;
