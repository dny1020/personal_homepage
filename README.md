# CV Portfolio Website

A modern, elegant single-page CV portfolio website featuring glassmorphism design with fuchsia and blue tones. Built with FastAPI backend and vanilla HTML/CSS/JS frontend, containerized with Docker.

## Features

- Glassmorphism Design - Modern Apple-like aesthetic with blurred glass effects
- Fuchsia & Blue Theme - Vibrant color scheme with smooth gradients
- Fully Responsive - Optimized for desktop, tablet, and mobile devices
- Dynamic Content - All content loaded from environment variables via API
- Docker Deployment - Easy deployment with Docker Compose
- Fast Performance - Lightweight and optimized for production
- Security Headers - Built-in security best practices

## Architecture

- Frontend: HTML5, CSS3, Vanilla JavaScript with Nginx
- Backend: FastAPI + Gunicorn with Uvicorn workers
- Deployment: Docker Compose with separate containers
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

- Docker
- Docker Compose

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

3. Build and run with Docker Compose
   ```bash
   cd ..
   docker-compose up -d --build
   ```

4. Access the website
   - Open your browser and navigate to `http://localhost:3000`
   - The API is available at `http://localhost:3000/api/info`

### Development Mode

For local development without Docker:

1. Backend
   ```bash
   cd backend
   pip install -r requirements.txt
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

## Docker Commands

```bash
# Build and start containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild after changes
docker-compose up -d --build --force-recreate

# Check container status
docker-compose ps
```

## Updating Content (Without Rebuilding)

After editing your `.env` file, you don't need to rebuild the Docker images. Just reload the configuration:

### Quick Method (Recommended)
```bash
./reload.sh
```

### Manual Method
```bash
docker-compose restart backend
```

Then refresh your browser (hard refresh with Ctrl+F5 or Cmd+Shift+R to clear cache).

Note: Only the backend needs to restart since it reads the .env file. The frontend will automatically display the new data from the API.

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
├── Dockerfile.frontend     # Frontend container
├── Dockerfile.backend      # Backend container
├── docker-compose.yml      # Docker Compose config
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

### Animations
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

## Author

Danilo
- Role: Telephony & DevOps Engineer
- Location: Colombia

---

Built with FastAPI, Docker, and modern web technologies.
