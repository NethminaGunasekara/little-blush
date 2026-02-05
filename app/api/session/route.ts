import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

const redis = Redis.fromEnv();

// Session expires after 10 minutes
const SESSION_TTL = 600;

// GET: Check if session is linked
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID required" },
      { status: 400 }
    );
  }

  try {
    const data = await redis.get(`session:${sessionId}`);

    if (!data) {
      return NextResponse.json({ linked: false });
    }

    const session = typeof data === "string" ? JSON.parse(data) : data;
    return NextResponse.json({
      linked: true,
      chatId: session.chatId,
      firstName: session.firstName,
      username: session.username,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: "Failed to check session" },
      { status: 500 }
    );
  }
}

// POST: Create new session
export async function POST() {
  try {
    const sessionId = nanoid(12);
    
    // Create empty session placeholder
    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({ pending: true }),
      { ex: SESSION_TTL }
    );

    return NextResponse.json({ sessionId });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
