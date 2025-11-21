"use client";

import { Copy, Info, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { LogoUploadDialog } from "@/components/branding/logo-upload-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import WarningModal from "@/components/warning-modal";
import { useUploadThing } from "@/lib/uploadthing";
import { api } from "@/trpc/react";

interface LogoLibraryProps {
	agencyId: string;
}

const formatFileSize = (size?: number | null) => {
	if (!size || size <= 0) return "—";
	const units = ["B", "KB", "MB", "GB"];
	let index = 0;
	let value = size;

	while (value >= 1024 && index < units.length - 1) {
		value /= 1024;
		index++;
	}

	return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

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
			const uploadResponse = result?.[0];
			const url = uploadResponse?.url;
			const uploadthingKey = uploadResponse?.key;

			if (url) {
				createLogo.mutate({
					agencyId,
					type: "LOGO",
					url,
					size: files[0]?.size,
					uploadthingKey,
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
				uploadthingKey: undefined,
			});
		} catch {
			toast.error("Please enter a valid URL");
		}
	};

	const handleDelete = (logoId: string) => {
		deleteLogo.mutate({ mediaAssetId: logoId });
	};

	const handleCopyUrl = async (url: string) => {
		if (typeof navigator === "undefined" || !navigator.clipboard) {
			toast.error("Clipboard access is not available in this environment.");
			return;
		}

		try {
			await navigator.clipboard.writeText(url);
			toast.success("Logo URL copied");
		} catch (error) {
			console.error(error);
			toast.error("Unable to copy logo URL");
		}
	};

	const totalUsage = useMemo(
		() =>
			logos?.reduce((sum, logo) => sum + (logo._count?.templateLogo ?? 0), 0) ??
			0,
		[logos],
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div className="flex items-center gap-2 font-medium text-sm">
						<Info className="size-4 text-primary" />
						<span>Agency Logo Library</span>
					</div>
					<p className="text-muted-foreground text-sm">
						Upload SVG or high-resolution PNG logos once and reuse them across
						every template and builder project.
					</p>
				</div>
				<Button
					onClick={() => setUploadDialogOpen(true)}
					size="sm"
					variant="secondary"
				>
					<Plus className="mr-2 size-4" />
					Upload Logo
				</Button>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-lg border bg-card p-4 shadow-sm">
					<p className="font-medium text-sm">Total logos</p>
					<p className="font-semibold text-2xl">{logos?.length ?? 0}</p>
				</div>
				<div className="rounded-lg border bg-card p-4 shadow-sm">
					<p className="font-medium text-sm">Templates using logos</p>
					<p className="font-semibold text-2xl">{totalUsage}</p>
				</div>
			</div>

			{isLoading ? (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{["logo-skeleton-a", "logo-skeleton-b", "logo-skeleton-c"].map(
						(key) => (
							<div
								className="rounded-lg border bg-card p-4 shadow-sm"
								key={key}
							>
								<Skeleton className="mb-4 h-32 w-full rounded" />
								<Skeleton className="mb-2 h-4 w-32" />
								<Skeleton className="h-4 w-24" />
							</div>
						),
					)}
				</div>
			) : logos && logos.length === 0 ? (
				<div className="rounded-lg border border-dashed p-8 text-center">
					<p className="mb-4 text-muted-foreground">
						No logos yet. Upload your first logo so your team can reuse it
						anywhere.
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
						const usageCount = logo._count?.templateLogo ?? 0;
						const uploaderName =
							logo.uploader?.name ?? logo.uploader?.email ?? "Unknown";

						return (
							<div
								className="relative flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm"
								key={logo.id}
							>
								<div className="flex items-center justify-between text-muted-foreground text-xs">
									<Badge variant="secondary">LOGO</Badge>
									<span>{formatFileSize(logo.size)}</span>
								</div>
								<div className="relative aspect-video w-full overflow-hidden rounded border bg-muted">
									<Image
										alt={`Logo uploaded by ${uploaderName}`}
										className="object-contain p-2"
										fill
										loading="lazy"
										src={logo.url}
										unoptimized={requiresUnoptimized}
									/>
								</div>
								<div className="flex flex-col gap-1 text-sm">
									<span className="font-medium">
										Uploaded {new Date(logo.createdAt).toLocaleDateString()}
									</span>
									<span className="text-muted-foreground">
										by {uploaderName}
									</span>
									<span className="text-muted-foreground text-xs">
										Used in {usageCount} template{usageCount === 1 ? "" : "s"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<Button
										onClick={() => handleCopyUrl(logo.url)}
										size="sm"
										variant="outline"
									>
										<Copy className="mr-2 size-4" />
										Copy URL
									</Button>
									<Button
										disabled={deleteLogo.isPending}
										onClick={() => setDeleteDialogOpen(logo.id)}
										size="sm"
										variant="destructive"
									>
										{deleteLogo.isPending ? (
											<Loader2 className="mr-2 size-4 animate-spin" />
										) : (
											<Trash2 className="mr-2 size-4" />
										)}
										Delete
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
