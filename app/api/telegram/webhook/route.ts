import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Session expires after 10 minutes
const SESSION_TTL = 600;

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();

    // Handle /start command with session ID
    if (update.message?.text?.startsWith("/start ")) {
      const sessionId = update.message.text.replace("/start ", "").trim();
      const chatId = update.message.chat.id.toString();
      const firstName = update.message.from?.first_name || "";
      const username = update.message.from?.username || "";

      if (sessionId) {
        // Store session -> chat mapping
        await redis.set(
          `session:${sessionId}`,
          JSON.stringify({ chatId, firstName, username }),
          { ex: SESSION_TTL }
        );

        // Send welcome message with the proposal link
        if (TELEGRAM_BOT_TOKEN) {
          const proposalLink = `https://little-blush.vercel.app/?id=${chatId}`;
          
          await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: chatId,
                text: `Hey ${firstName}! 💖\n\nYou're all set! Here's your special Valentine's proposal link:\n\n🔗 ${proposalLink}\n\nShare it with your special someone and wait for the magic to happen! 🌹✨`,
                parse_mode: "HTML",
              }),
            }
          );
        }
      }
    } else if (update.message?.text === "/start") {
      // Handle plain /start without session
      const chatId = update.message.chat.id;
      const firstName = update.message.from?.first_name || "there";

      if (TELEGRAM_BOT_TOKEN) {
        await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: `Hey ${firstName}! 💕\n\nTo create your Valentine's proposal link, visit our website and click "Connect Telegram"!\n\n🌐 https://little-blush.vercel.app`,
              parse_mode: "HTML",
            }),
          }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}
