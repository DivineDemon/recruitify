"use client";

import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { LogoUploadDialog } from "@/components/branding/logo-upload-dialog";
import { Button } from "@/components/ui/button";
import WarningModal from "@/components/warning-modal";
import { useUploadThing } from "@/lib/uploadthing";
import { api } from "@/trpc/react";

interface LogoLibraryProps {
	agencyId: string;
}

export function LogoLibrary({ agencyId }: LogoLibraryProps) {
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const [logoUrl, setLogoUrl] = useState("");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

	const utils = api.useUtils();
	const { data: logos, isLoading } = api.media.list.useQuery({
		agencyId,
		type: "LOGO",
	});

	const { startUpload, isUploading } = useUploadThing("mediaUploader");

	const createLogo = api.media.create.useMutation({
		onSuccess: () => {
			utils.media.list.invalidate();
			setUploadDialogOpen(false);
			setLogoUrl("");
			toast.success("Logo uploaded successfully");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to upload logo");
		},
	});

	const deleteLogo = api.media.delete.useMutation({
		onSuccess: () => {
			utils.media.list.invalidate();
			setDeleteDialogOpen(null);
			toast.success("Logo deleted");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete logo");
		},
	});

	const handleFileUpload = async (files: FileList | null) => {
		if (!files || files.length === 0) return;

		try {
			const result = await startUpload(Array.from(files));
			const url = result?.[0]?.url;

			if (url) {
				createLogo.mutate({
					agencyId,
					type: "LOGO",
					url,
					size: files[0]?.size,
				});
			} else {
				toast.error("Failed to upload file");
			}
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong while uploading");
		}
	};

	const handleUrlSubmit = () => {
		if (!logoUrl.trim()) {
			toast.error("Please enter a logo URL");
			return;
		}

		try {
			new URL(logoUrl); // Validate URL
			createLogo.mutate({
				agencyId,
				type: "LOGO",
				url: logoUrl.trim(),
			});
		} catch {
			toast.error("Please enter a valid URL");
		}
	};

	const handleDelete = (logoId: string) => {
		deleteLogo.mutate({ mediaAssetId: logoId });
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<p className="text-muted-foreground">Loading logos...</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<p className="text-muted-foreground text-sm">
					{logos?.length ?? 0} logo{logos?.length !== 1 ? "s" : ""}
				</p>
				<Button onClick={() => setUploadDialogOpen(true)} size="sm">
					<Plus className="mr-2 size-4" />
					Upload Logo
				</Button>
			</div>

			{logos && logos.length === 0 ? (
				<div className="rounded-lg border border-dashed p-8 text-center">
					<p className="mb-4 text-muted-foreground">
						No logos yet. Upload your first logo to get started.
					</p>
					<Button onClick={() => setUploadDialogOpen(true)} size="sm">
						<Plus className="mr-2 size-4" />
						Upload Logo
					</Button>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{logos?.map((logo) => {
						const requiresUnoptimized =
							/\.svg($|\?)/i.test(logo.url) || logo.url.includes("utfs.io/");

						return (
							<div
								className="relative rounded-lg border bg-card p-4 shadow-sm"
								key={logo.id}
							>
								<div className="relative mb-3 aspect-video w-full overflow-hidden rounded border bg-muted">
									<Image
										alt={logo.type}
										className="object-contain p-2"
										fill
										loading="lazy"
										src={logo.url}
										unoptimized={requiresUnoptimized}
									/>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<p className="text-muted-foreground text-xs">
											Uploaded {new Date(logo.createdAt).toLocaleDateString()}
										</p>
									</div>
									<Button
										disabled={deleteLogo.isPending}
										onClick={() => setDeleteDialogOpen(logo.id)}
										size="sm"
										variant="destructive"
									>
										<Trash2 className="size-4" />
									</Button>
								</div>
							</div>
						);
					})}
				</div>
			)}

			<LogoUploadDialog
				isSubmitting={createLogo.isPending}
				isUploading={isUploading}
				logoUrl={logoUrl}
				onFileUpload={handleFileUpload}
				onLogoUrlChange={setLogoUrl}
				onOpenChange={setUploadDialogOpen}
				onSubmitUrl={handleUrlSubmit}
				open={uploadDialogOpen}
			/>

			{deleteDialogOpen && (
				<WarningModal
					cta={() => handleDelete(deleteDialogOpen)}
					isLoading={deleteLogo.isPending}
					open={deleteDialogOpen !== null}
					setOpen={(open) =>
						setDeleteDialogOpen(open ? deleteDialogOpen : null)
					}
					text="Are you sure you want to delete this logo? This action cannot be undone."
					title="Delete Logo"
				/>
			)}
		</div>
	);
}
