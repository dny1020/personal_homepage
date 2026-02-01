# Bot-AI Landing Page - Deployment Instructions

## Changes Made

### 1. New Landing Page
- Created `frontend/bot-ai.html` - Landing page for Bots+AI services
- Created `frontend/bot-ai.css` - Custom styles for the landing page
- Added "Bots+AI" button to main portfolio (index.html)

### 2. Features of the Landing Page
- **Hero Section** with badge and CTA buttons
- **Stats Section** showcasing key metrics (response time, availability, accuracy)
- **Features Grid** highlighting 6 core features:
  - WhatsApp Integration
  - Webchat Bot
  - AI-Powered RAG
  - Fast LLM Response
  - Conversation Memory
  - Intent Detection
  
- **Demo Section** with live chat preview showing WhatsApp bot conversation
- **Tech Stack** showcasing technologies used (Python, Llama 3, Twilio, PostgreSQL, etc.)
- **Use Cases** for Technical Support, Sales & Lead Gen, and Customer Service
- **CTA Section** with contact buttons

### 3. Design
- Uses the same glassmorphism design and color scheme (fuchsia, blue, cyan)
- Fully responsive for mobile, tablet, and desktop
- Maintains consistent branding with main portfolio

## Nginx Configuration

To enable the `/bot-ai` route on your production server, add this to your Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/cv_project/frontend;
    index index.html;

    # Main portfolio
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Bot-AI landing page
    location /bot-ai {
        try_files /bot-ai.html =404;
    }
    
    # Static assets
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Alternative: Simple File Serving

If you prefer to keep it simple, the button currently opens `bot-ai.html` in a new tab, which will work with your existing Nginx configuration.

To use the `/bot-ai` route instead, change line 46 in `frontend/index.html`:

```html
<!-- Current (opens in new tab) -->
<a href="bot-ai.html" class="btn btn-accent" target="_blank">Bots+AI</a>

<!-- Alternative (same window with route) -->
<a href="/bot-ai" class="btn btn-accent">Bots+AI</a>
```

## Testing Locally

1. Start a local HTTP server:
   ```bash
   cd /Users/Dny/cv_project/frontend
   python3 -m http.server 8080
   ```

2. Open browser:
   - Main portfolio: http://localhost:8080/
   - Bot-AI page: http://localhost:8080/bot-ai.html

## Customization

### Update GitHub Link
In `bot-ai.html` line 271, replace with your actual GitHub repository:
```html
<a href="https://github.com/YOUR_USERNAME/bot_whatsapp" ...>
```

### Add Demo Video or Screenshots
To add a demo video in the chat preview section (line ~153 in bot-ai.html):

```html
<div class="demo-showcase glass-card">
  <!-- Add video before or after chat preview -->
  <video autoplay loop muted playsinline style="width: 100%; border-radius: 12px; margin-bottom: 20px;">
    <source src="demo-video.mp4" type="video/mp4">
  </video>
  
  <!-- Or add an image -->
  <img src="bot-screenshot.png" alt="Bot Demo" style="width: 100%; border-radius: 12px; margin-bottom: 20px;">
</div>
```

### Update Content
All text content can be customized directly in `bot-ai.html`:
- Hero title and description (lines 41-48)
- Stats (lines 55-72)
- Features (lines 83-136)
- Use cases (lines 213-260)
- Tech stack (lines 177-202)

## Files Created

```
cv_project/frontend/
├── bot-ai.html          # Landing page
├── bot-ai.css           # Custom styles
└── BOT_AI_DEPLOYMENT.md # This file
```

## Next Steps

1. Upload files to production server
2. Update Nginx configuration (or use current simple approach)
3. Reload Nginx: `sudo systemctl reload nginx`
4. Test the new page
5. (Optional) Add screenshots/videos from /Users/Dny/bot_whatsapp/
6. (Optional) Update GitHub link in CTA section

---

Built with the same love and attention to detail as the main portfolio! 🚀
