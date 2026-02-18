// API base URL - use relative path to work with Nginx proxy
const API_BASE = '';

// DOM Elements
const elements = {
  navName: document.getElementById('nav-name'),
  navToggle: document.querySelector('.nav-toggle'),
  navLinks: document.querySelector('.nav-links'),
  name: document.getElementById('name'),
  role: document.getElementById('role'),
  location: document.getElementById('location'),
  bio: document.getElementById('bio'),
  experienceList: document.getElementById('experience-list'),
  educationList: document.getElementById('education-list'),

  projectsList: document.getElementById('projects-list'),
  reposList: document.getElementById('repos-list'),
  contactText: document.getElementById('contact-text'),
  contactInfo: document.getElementById('contact-info'),
  footerText: document.getElementById('footer-text'),
  scrollTop: document.getElementById('scrollTop')
};

// Fetch data from API
async function fetchData() {
  try {
    const response = await fetch(`${API_BASE}/api/info`);
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();
    populateData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    // Fallback data for development
    populateData(getFallbackData());
  }
}

// Populate page with data
function populateData(data) {
  // Basic Info
  if (data.name) {
    elements.navName.textContent = data.name;
    elements.name.textContent = data.name;
  }
  if (data.role) elements.role.textContent = data.role;
  if (data.location) elements.location.textContent = `⦿ ${data.location}`;
  if (data.bio) elements.bio.textContent = data.bio;

  // Experience
  if (data.experience && Array.isArray(data.experience)) {
    elements.experienceList.innerHTML = data.experience.map(exp => `
      <div class="timeline-item fade-in">
        <div class="timeline-content">
          <div class="timeline-header">
            <h3 class="timeline-title">${exp.title || ''}</h3>
            <span class="timeline-period">${exp.period || ''}</span>
          </div>
          <p class="timeline-subtitle">${exp.company || ''}</p>
          <p class="timeline-description">${exp.description || ''}</p>
        </div>
      </div>
    `).join('');
  }

  // Education
  if (data.education && Array.isArray(data.education)) {
    elements.educationList.innerHTML = data.education.map(edu => `
      <div class="education-item fade-in">
        <h3 class="education-degree">${edu.degree || ''}</h3>
        <p class="education-school">${edu.school || ''}</p>
        <p class="education-period">${edu.period || ''}</p>
        ${edu.description ? `<p class="education-description">${edu.description}</p>` : ''}
      </div>
    `).join('');
  }

  // Projects
  if (data.projects && Array.isArray(data.projects)) {
    elements.projectsList.innerHTML = data.projects.map(project => `
      <div class="project-card fade-in">
        <div class="project-header">
          <h3 class="project-title">${project.name || ''}</h3>
        </div>
        <p class="project-description">${project.description || ''}</p>
        ${project.tags ? `
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
        <div class="project-links">
          ${project.demo ? `<a href="${project.demo}" class="project-link" target="_blank" rel="noopener">🔗 Demo</a>` : ''}
          ${project.github ? `<a href="${project.github}" class="project-link" target="_blank" rel="noopener">💻 Code</a>` : ''}
        </div>
      </div>
    `).join('');
  }

  // Repositories
  if (data.repositories && Array.isArray(data.repositories)) {
    elements.reposList.innerHTML = data.repositories.map(repo => `
      <a href="${repo.url || '#'}" class="repo-card fade-in" target="_blank" rel="noopener">
        <h3 class="repo-name">${repo.name || ''}</h3>
        <p class="repo-description">${repo.description || 'No description available'}</p>
        <div class="repo-stats">
          ${repo.stars !== undefined ? `<span class="repo-stat">⭐ ${repo.stars}</span>` : ''}
          ${repo.forks !== undefined ? `<span class="repo-stat">🔱 ${repo.forks}</span>` : ''}
          ${repo.language ? `<span class="repo-stat">💻 ${repo.language}</span>` : ''}
        </div>
      </a>
    `).join('');
  }

  // Contact
  if (data.contact) {
    if (data.contact.text) {
      elements.contactText.textContent = data.contact.text;
    }
    
    let contactHTML = '';
    if (data.contact.email) {
      contactHTML += `<a href="mailto:${data.contact.email}" class="contact-item">📧 ${data.contact.email}</a>`;
    }
    if (data.contact.phone) {
      contactHTML += `<a href="tel:${data.contact.phone}" class="contact-item">📱 ${data.contact.phone}</a>`;
    }
    if (data.contact.linkedin) {
      contactHTML += `<a href="${data.contact.linkedin}" class="contact-item" target="_blank" rel="noopener">💼 LinkedIn</a>`;
    }
    if (data.contact.github) {
      contactHTML += `<a href="${data.contact.github}" class="contact-item" target="_blank" rel="noopener">💻 GitHub</a>`;
    }
    if (data.contact.website) {
      contactHTML += `<a href="${data.contact.website}" class="contact-item" target="_blank" rel="noopener">🌐 Website</a>`;
    }
    elements.contactInfo.innerHTML = contactHTML;
  }

  // Footer
  if (data.footer) {
    elements.footerText.textContent = data.footer;
  } else {
    elements.footerText.textContent = `© ${new Date().getFullYear()} ${data.name || ''}. All rights reserved.`;
  }

  // Trigger animations
  observeElements();
}

// Fallback data for development/testing
function getFallbackData() {
  return {
    name: "Danilo",
    role: "Software Developer",
    location: "Your Location",
    bio: "Passionate developer with expertise in building modern web applications. Focused on creating elegant solutions to complex problems.",
    experience: [
      {
        title: "Senior Developer",
        company: "Tech Company",
        period: "2021 - Present",
        description: "Leading development of scalable web applications using modern technologies."
      },
      {
        title: "Full Stack Developer",
        company: "StartUp Inc",
        period: "2019 - 2021",
        description: "Developed and maintained full-stack applications with focus on user experience."
      }
    ],
    education: [
      {
        degree: "Computer Science Degree",
        school: "University Name",
        period: "2015 - 2019",
        description: "Focus on software engineering and web technologies."
      }
    ],
    projects: [
      {
        name: "Project One",
        description: "A modern web application built with cutting-edge technologies.",
        tags: ["React", "Node.js", "MongoDB"],
        demo: "#",
        github: "#"
      },
      {
        name: "Project Two",
        description: "Full-stack e-commerce platform with advanced features.",
        tags: ["Next.js", "TypeScript", "PostgreSQL"],
        demo: "#",
        github: "#"
      }
    ],
    repositories: [
      {
        name: "awesome-repo",
        description: "An awesome repository with great code",
        url: "#",
        stars: 42,
        forks: 12,
        language: "JavaScript"
      }
    ],
    contact: {
      text: "Feel free to reach out for collaborations or just a friendly chat!",
      email: "your.email@example.com",
      linkedin: "https://linkedin.com/in/yourprofile",
      github: "https://github.com/yourusername"
    },
    footer: `© ${new Date().getFullYear()} Danilo. All rights reserved.`
  };
}

// Mobile Navigation Toggle
elements.navToggle.addEventListener('click', () => {
  elements.navLinks.classList.toggle('active');
  elements.navToggle.classList.toggle('active');
});

// Close mobile nav when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    elements.navLinks.classList.remove('active');
    elements.navToggle.classList.remove('active');
  });
});

// Scroll behavior for navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Show/hide scroll to top button
  if (currentScroll > 500) {
    elements.scrollTop.classList.add('visible');
  } else {
    elements.scrollTop.classList.remove('visible');
  }

  lastScroll = currentScroll;
});

// Scroll to top functionality
elements.scrollTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const offsetTop = target.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// Intersection Observer for fade-in animations
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Active nav link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinksAll.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  
  // Add loading class initially
  document.body.classList.add('loaded');
});

// Handle page visibility change (refresh data when page becomes visible)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    fetchData();
  }
});

