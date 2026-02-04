import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const WHOLESOME_MESSAGES = [
  "💕 She said YES! You're officially the luckiest person in the world! 🎉",
  "🥰 Someone just made your Valentine's Day extra special by saying YES!",
  "💖 Love is in the air! She clicked YES and made magic happen! ✨",
  "🌹 Breaking news: You have a Valentine! She said YES! 💝",
  "💗 The stars aligned! She pressed YES and the universe is celebrating! 🎊",
];

async function sendTelegramMessage(text: string, chatId?: string | null): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !chatId) {
    console.error("Telegram credentials not configured (Token or Chat ID missing)");
    return false;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "HTML",
        }),
      }
    );

    const data = await response.json();
    if (!data.ok) {
        console.error("Telegram API Error:", data);
        return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, message, targetChatId } = body;

    let telegramMessage: string;

    if (type === "yes_click" || type === "yes_clicked") { // Handle both just in case
      // grab a random cute message
      const randomIndex = Math.floor(Math.random() * WHOLESOME_MESSAGES.length);
      telegramMessage = WHOLESOME_MESSAGES[randomIndex];
    } else if (type === "message_sent" && message) {
      telegramMessage = `💌 <b>A sweet message from your Valentine:</b>\n\n"${message}"`;
    } else {
      return NextResponse.json(
        { error: "Invalid request type" },
        { status: 400 }
      );
    }

    const success = await sendTelegramMessage(telegramMessage, targetChatId);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
