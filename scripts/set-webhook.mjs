const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const VERCEL_ENV = process.env.VERCEL_ENV;

// Use custom production URL or fall back to VERCEL_PROJECT_PRODUCTION_URL
const PRODUCTION_URL = process.env.PRODUCTION_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;

async function setWebhook() {
  // Only set webhook for production deployments
  if (VERCEL_ENV !== 'production') {
    console.log('⏭️  Skipping webhook setup for non-production environment');
    return;
  }

  if (!TELEGRAM_BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN not set');
    process.exit(1);
  }

  if (!PRODUCTION_URL) {
    console.error('❌ PRODUCTION_URL or VERCEL_PROJECT_PRODUCTION_URL not set');
    console.log('💡 Add PRODUCTION_URL=little-blush.vercel.app to your environment variables');
    process.exit(1);
  }

  const webhookUrl = `https://${PRODUCTION_URL}/api/telegram/webhook`;
  const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;

  console.log(`🔗 Setting webhook to: ${webhookUrl}`);

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.ok) {
      console.log('✅ Webhook set successfully!');
    } else {
      console.error('❌ Failed to set webhook:', data.description);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error setting webhook:', error);
    process.exit(1);
  }
}

setWebhook();
