import { NextResponse } from "next/server";

export async function POST() {
	// TODO: verify Stripe signature and process events
	return NextResponse.json({ status: "pending" });
}
