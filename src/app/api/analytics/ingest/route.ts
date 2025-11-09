import { NextResponse } from "next/server";

export async function POST() {
	// TODO: capture visit and conversion events before persisting to Postgres/PostHog
	return NextResponse.json({ accepted: true });
}
