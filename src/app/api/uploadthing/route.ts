import { NextResponse } from "next/server";

export async function POST() {
	// TODO: proxy UploadThing file upload handler
	return NextResponse.json(
		{ message: "Upload endpoint not implemented" },
		{ status: 501 },
	);
}

export async function GET() {
	return NextResponse.json(
		{ message: "UploadThing requires POST requests" },
		{ status: 400 },
	);
}
