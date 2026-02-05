const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const VERCEL_URL = process.env.VERCEL_URL;
const VERCEL_ENV = process.env.VERCEL_ENV;

async function setWebhook() {
  // Only set webhook for production deployments
  if (VERCEL_ENV !== 'production') {
    console.log('⏭️  Skipping webhook setup for non-production environment');
    return;
  }

  if (!TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not set');
    process.exit(1);
  }

  if (!VERCEL_URL) {
    console.error('VERCEL_URL not available');
    process.exit(1);
  }

  const webhookUrl = `https://${VERCEL_URL}/api/telegram/webhook`;
  const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;

  console.log(`Setting webhook to: ${webhookUrl}`);

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.ok) {
      console.log('Webhook set successfully!');
    } else {
      console.error('Failed to set webhook:', data.description);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error setting webhook:', error);
    process.exit(1);
  }
}

setWebhook();
