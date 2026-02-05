<div align="center">

  <img src=".github/assets/kitten.gif" alt="adorable kitten" width="140" height="auto" />
  <h1>Little Blush 💕</h1>
  
  <p>
     A wholesome way to ask someone to be your Valentine.<br/>
     <i>Because asking the big question should feel special.</i>
  </p>
   
<!-- Badges -->
<p>
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&style=flat" alt="deployed on vercel" />
  <img src="https://img.shields.io/badge/Made%20with-Love-ff69b4?logo=heart&style=flat" alt="made with love" />
  <img src="https://img.shields.io/github/last-commit/NethminaGunasekara/little-blush?style=flat&color=ff69b4" alt="last commit" />
  <img src="https://img.shields.io/github/license/NethminaGunasekara/little-blush?style=flat&color=ff69b4" alt="license" />
  <img src="https://img.shields.io/github/languages/top/NethminaGunasekara/little-blush?style=flat&color=ff69b4" alt="top language" />
</p>
   
<h4>
    <a href="#star2-what-is-this">What's This?</a>
  <span> · </span>
    <a href="#link-how-to-use">How to Use</a>
  <span> · </span>
    <a href="#rocket-deploy-your-own">Deploy</a>
  <span> · </span>
    <a href="https://little-blush.vercel.app/">Try It!</a>
  </h4>
</div>

<br />

## :star2: What Is This?

Texting "will you be my valentine?" is fine, but sometimes you want to make a bit more of an effort. 

**Little Blush** is a simple, animated web page designed to make asking that special question feel a little warmer. Plus, it notifies you on Telegram the moment they say yes, so you aren't left refreshing your screen ✨

<br />

## :link: How to Use
 
1. **Connect Your Telegram**  
   Visit the app and click "Connect Telegram". You'll be redirected to start the bot.

2. **Press Start**  
   In Telegram, press **Start** on [@mochidispachbot](https://t.me/mochidispachbot). That's it!

3. **Get Your Link**  
   Go back to the website - your unique proposal link is ready! ✨

4. **Share the Love**  
   Send the link to your special someone. When they say yes, you'll get a Telegram notification! 💕

## :camera: Preview

<div align="center">
  <img src=".github/assets/preview.gif" alt="preview" width="400" />
</div>

<br />

## :rocket: Deploy Your Own

### Prerequisites

1. **A Telegram Bot**
   - Message [@BotFather](https://t.me/BotFather) on Telegram.
   - Send `/newbot` and give it a name.
   - Copy the **API Token** it gives you.

2. **Upstash Redis Database**
   - Create a free account at [upstash.com](https://upstash.com)
   - Or add the Upstash integration from Vercel Marketplace

<br />

### Option 1: Deploy on Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/NethminaGunasekara/little-blush&env=TELEGRAM_BOT_TOKEN,UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN)

1. Click the deploy button above.
2. Connect your GitHub account.
3. Add Environment Variables:
   | Variable | Value |
   |----------|-------|
   | `TELEGRAM_BOT_TOKEN` | Token from BotFather |
   | `UPSTASH_REDIS_REST_URL` | Your Upstash Redis URL |
   | `UPSTASH_REDIS_REST_TOKEN` | Your Upstash Redis Token |
4. Click **Deploy**.
5. **Set up the Telegram Webhook** (important!):
   ```
   https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=https://your-domain.vercel.app/api/telegram/webhook
   ```

<br />

### Option 2: Run Locally

```bash
# Clone the repository
git clone https://github.com/NethminaGunasekara/little-blush.git
cd little-blush

# Install dependencies
npm install

# Set up environment variables
cp .env.template .env.local
```

Open `.env.local` and add your credentials:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

Start the server:
```bash
npm run dev
```

> **Note:** For local development, you'll need to use a tool like [ngrok](https://ngrok.com/) to expose your localhost and set up the webhook.

<br />

## :gear: Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | ✅ Yes | Your bot token from BotFather |
| `UPSTASH_REDIS_REST_URL` | ✅ Yes | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ Yes | Upstash Redis REST Token |

<br />

## :art: Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database:** [Upstash Redis](https://upstash.com/)
- **Deployment:** [Vercel](https://vercel.com/)

<br />

## :heart: Credits

- **Mochi the Kitten**: For being adorable.
- **You**: For putting in the effort to make someone smile.

<br />

## :memo: License

This project is [MIT](./LICENSE) licensed.

---

<div align="center">
  <p>Made with 💕 and probably too much coffee</p>
  <p>Now go get yourself a Valentine! 🌹</p>
</div>
