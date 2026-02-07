# CV Portfolio Website

![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow.svg)
![HTML5](https://img.shields.io/badge/html5-latest-orange.svg)

A modern, elegant single-page CV portfolio website featuring glassmorphism design with fuchsia and blue tones. Built with FastAPI backend and vanilla HTML/CSS/JS frontend.

## Features

- Glassmorphism Design - Modern Apple-like aesthetic with blurred glass effects
- Fuchsia & Blue Theme - Vibrant color scheme with smooth gradients
- Fully Responsive - Optimized for desktop, tablet, and mobile devices
- Dynamic Content - All content loaded from environment variables via API
- Fast Performance - Lightweight and optimized for production
- Security Headers - Built-in security best practices

## Architecture

- Frontend: HTML5, CSS3, Vanilla JavaScript with Nginx
- Backend: FastAPI + Gunicorn with Uvicorn workers
- Styling: Glassmorphism with CSS animations and transitions

## Sections

- Hero/About
- Professional Experience (Timeline)
- Education
- Achievements
- Featured Projects
- Repositories
- Contact Information

## Quick Start

### Prerequisites

- Python 3.8+
- Nginx
- systemd

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd cv_project
   ```

2. Configure environment variables
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your information
   nano .env
   ```

3. Install Python dependencies
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. Configure Nginx
   ```bash
   sudo cp frontend/nginx.conf /etc/nginx/sites-available/cv-portfolio
   sudo ln -s /etc/nginx/sites-available/cv-portfolio /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Development Mode

For local development:

1. Backend
   ```bash
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. Frontend
   - Open `frontend/index.html` in your browser
   - Or use a simple HTTP server:
     ```bash
     cd frontend
     python -m http.server 3000
     ```

## Configuration

Edit `backend/.env` to customize your portfolio:

### Basic Information
```env
NAME="Your Name"
ROLE="Your Professional Role"
LOCATION="Your Location"
BIO="Brief description about yourself"
```

### Experience (JSON Array)
```env
EXPERIENCE='[
  {
    "title": "Job Title",
    "company": "Company Name",
    "period": "2021 - Present",
    "description": "Job description"
  }
]'
```

### Education (JSON Array)
```env
EDUCATION='[
  {
    "degree": "Degree Name",
    "school": "School Name",
    "period": "2015 - 2019",
    "description": "Additional info"
  }
]'
```

### Achievements (JSON Array)
```env
ACHIEVEMENTS='[
  {
    "icon": "🏆",
    "title": "Achievement Title",
    "description": "Achievement description"
  }
]'
```

### Projects (JSON Array)
```env
PROJECTS='[
  {
    "name": "Project Name",
    "description": "Project description",
    "tags": ["Tech1", "Tech2"],
    "demo": "https://demo-url.com",
    "github": "https://github.com/user/repo"
  }
]'
```

### Repositories (JSON Array)
```env
REPOSITORIES='[
  {
    "name": "repo-name",
    "description": "Repo description",
    "url": "https://github.com/user/repo",
    "stars": 42,
    "forks": 12,
    "language": "JavaScript"
  }
]'
```

### Contact (JSON Object)
```env
CONTACT='{"text": "Contact message", "email": "email@example.com", "linkedin": "https://linkedin.com/in/profile", "github": "https://github.com/user"}'
```

## systemd Deployment

### Create systemd Service

1. Create backend service file:
   ```bash
   sudo nano /etc/systemd/system/cv-backend.service
   ```

2. Add service configuration:
   ```ini
   [Unit]
   Description=CV Portfolio Backend
   After=network.target

   [Service]
   Type=notify
   User=www-data
   Group=www-data
   WorkingDirectory=/path/to/cv_project/backend
   Environment="PATH=/path/to/venv/bin"
   ExecStart=/path/to/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

3. Enable and start service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable cv-backend
   sudo systemctl start cv-backend
   ```

### Service Management

```bash
# Start service
sudo systemctl start cv-backend

# Stop service
sudo systemctl stop cv-backend

# Restart service
sudo systemctl restart cv-backend

# View status
sudo systemctl status cv-backend

# View logs
sudo journalctl -u cv-backend -f
```

## Updating Content

After editing your `.env` file:

```bash
sudo systemctl restart cv-backend
```

Then refresh your browser (hard refresh with Ctrl+F5 or Cmd+Shift+R to clear cache).

## Project Structure

```
cv_project/
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Glassmorphism styles
│   ├── script.js           # Dynamic content loader
│   └── nginx.conf          # Nginx configuration
├── backend/
│   ├── main.py             # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Environment variables (private)
│   └── .env.example       # Environment template
└── README.md              # Documentation
```

## Customization

### Colors
Edit CSS variables in `frontend/styles.css`:
```css
:root {
  --fuchsia: #d946ef;
  --blue: #3b82f6;
  --cyan: #06b6d4;
}
```

## Animations
Modify animation timings in `frontend/styles.css` keyframes and transitions.

### Content Sections
Add or remove sections by editing `frontend/index.html` and updating the API in `backend/main.py`.

## Production Deployment

### Environment Variables
- Store sensitive data in `.env` file (not committed to Git)
- Use Docker secrets or environment management tools in production

### HTTPS/SSL
- Add SSL certificate configuration to Nginx
- Use Let's Encrypt for free SSL certificates
- Update nginx.conf to redirect HTTP to HTTPS

### Performance
- Enable Nginx gzip compression (already configured)
- Use CDN for static assets if needed
- Implement caching strategies

### Security
- Keep dependencies updated
- Use environment-specific .env files
- Implement rate limiting if needed
- Regular security audits

## License

This project is open source and available under the MIT License.

## Contributing

Contributions, issues, and feature requests are welcome!


---

Built with FastAPI, Python, JavaScript, HTML5, and modern web technologies.



