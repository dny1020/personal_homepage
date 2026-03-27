const { useEffect, useMemo, useState } = React;

const API_BASE = '';

const fallbackData = {
  name: 'Danilo',
  role: 'Software Developer',
  location: 'Bogota, Colombia',
  bio: 'Builder of thoughtful, resilient software. I focus on clean architecture, high-performance interfaces, and reliable delivery from concept to production.',
  avatarUrl: 'IMG_2164.jpg',
  stats: [
    { label: 'Years Experience', value: '6+' },
    { label: 'Projects Delivered', value: '40+' },
    { label: 'Teams Supported', value: '8' }
  ],
  experience: [
    {
      title: 'Senior Developer',
      company: 'Tech Company',
      period: '2022 - Present',
      description: 'Leading delivery of modern web platforms, mentoring engineers, and raising quality with pragmatic architecture.'
    },
    {
      title: 'Full Stack Developer',
      company: 'StartUp Inc',
      period: '2019 - 2022',
      description: 'Built end-to-end products with a focus on UX, performance, and analytics-driven iteration.'
    }
  ],
  education: [
    {
      degree: 'B.S. Computer Science',
      school: 'University Name',
      period: '2015 - 2019',
      description: 'Software engineering, data structures, and applied product design.'
    }
  ],
  projects: [
    {
      name: 'Client Ops Dashboard',
      description: 'Unified operational tooling with real-time insights, access control, and workflow automation.',
      tags: ['React', 'Node.js', 'PostgreSQL'],
      demo: '#',
      github: '#'
    },
    {
      name: 'Commerce Studio',
      description: 'Composable commerce stack with scalable API layer and conversion-optimized UX.',
      tags: ['Next.js', 'TypeScript', 'Stripe'],
      demo: '#',
      github: '#'
    }
  ],
  skills: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'System Design'
  ],
  testimonials: [
    {
      name: 'Andrea R.',
      role: 'Product Lead',
      quote: 'Danilo balances design detail with engineering rigor. Delivery has always been on time and on point.'
    },
    {
      name: 'Luis M.',
      role: 'CTO',
      quote: 'A reliable partner who improves the team around him. Strong ownership and calm under pressure.'
    }
  ],
  awards: [
    'Top Performer - 2023',
    'Customer Impact Award - 2022',
    'Tech Lead Recognition - 2021'
  ],
  contact: {
    text: 'Lets build something elegant and durable together.',
    email: 'your.email@example.com',
    linkedin: 'https://linkedin.com/in/yourprofile',
    github: 'https://github.com/yourusername'
  },
  footer: ''
};

function useRevealOnScroll(deps = []) {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, deps);
}

function App() {
  const [data, setData] = useState(fallbackData);
  const [navOpen, setNavOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/info`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const payload = await response.json();
        if (mounted) {
          setData({ ...fallbackData, ...payload });
        }
      } catch (error) {
        if (mounted) {
          setData(fallbackData);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      setShowTop(y > 600);

      const sections = document.querySelectorAll('section[id]');
      let current = 'about';
      sections.forEach((section) => {
        const top = section.offsetTop - 180;
        if (y >= top) {
          current = section.getAttribute('id');
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useRevealOnScroll([data]);

  const initials = useMemo(() => {
    if (!data?.name) return 'JD';
    return data.name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [data?.name]);

  const handleNavClick = () => {
    setNavOpen(false);
    setSubmenuOpen(false);
  };

  return (
    <div className="app-shell">
      <div className="background-gradient" />
      <div className="noise-layer" />
      <div className="blur-orb orb-1" />
      <div className="blur-orb orb-2" />
      <div className="blur-orb orb-3" />

      <nav className={`navbar glass ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="nav-logo">
            <div className="nav-avatar">
              {data.avatarUrl ? (
                <img src={data.avatarUrl} alt={`${data.name} avatar`} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <span className="nav-name">{data.name}</span>
          </div>

          <div className={`nav-links ${navOpen ? 'active' : ''}`}>
            {[
              { id: 'about', label: 'About' },
              { id: 'experience', label: 'Experience' },
              { id: 'education', label: 'Education' },
              { id: 'projects', label: 'Projects' }
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                {link.label}
              </a>
            ))}

            <div
              className={`nav-dropdown ${submenuOpen ? 'open' : ''}`}
              onMouseLeave={() => setSubmenuOpen(false)}
            >
              <button
                className="nav-link nav-link-button"
                onClick={() => setSubmenuOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={submenuOpen}
              >
                More
                <span className="chevron">▾</span>
              </button>
              <div className="dropdown-menu">
                {[
                  { id: 'skills', label: 'Skills' },
                  { id: 'testimonials', label: 'Testimonials' },
                  { id: 'awards', label: 'Awards' },
                  { id: 'contact', label: 'Contact' }
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={handleNavClick}
                    className={`dropdown-link ${activeSection === item.id ? 'active' : ''}`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <button
            className={`nav-toggle ${navOpen ? 'active' : ''}`}
            aria-label="Toggle navigation"
            onClick={() => setNavOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <main className="container">
        <section id="about" className="hero-section">
          <div className="hero-grid">
            <div className="hero-copy reveal">
              <p className="hero-eyebrow">Design-forward engineering</p>
              <h1 className="hero-title">{data.name}</h1>
              <p className="hero-subtitle">{data.role}</p>
              <p className="hero-location">{data.location}</p>
              <p className="hero-bio">{data.bio}</p>
              <div className="hero-buttons">
                <a href="#contact" className="btn btn-primary">Start a Project</a>
                <a href="#projects" className="btn btn-ghost">View Work</a>
              </div>
            </div>

            <div className="hero-card reveal">
              <div className="hero-avatar">
                {data.avatarUrl ? (
                  <img src={data.avatarUrl} alt={`${data.name} profile`} />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="hero-card-content">
                <h3>Profile Snapshot</h3>
                <p>Focus on product quality, thoughtful UX, and dependable delivery across web stacks.</p>
                <div className="stats-row">
                  {(data.stats || fallbackData.stats).map((stat) => (
                    <div key={stat.label} className="stat">
                      <span className="stat-value">{stat.value}</span>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="section">
          <div className="section-header">
            <h2 className="section-title">Professional Experience</h2>
            <p className="section-kicker">Impact-focused roles with measurable outcomes.</p>
          </div>
          <div className="timeline">
            {(data.experience || []).map((exp, index) => (
              <div key={`${exp.title}-${index}`} className="timeline-item reveal">
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h3 className="timeline-title">{exp.title}</h3>
                    <span className="timeline-period">{exp.period}</span>
                  </div>
                  <p className="timeline-subtitle">{exp.company}</p>
                  <p className="timeline-description">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="education" className="section">
          <div className="section-header">
            <h2 className="section-title">Education</h2>
            <p className="section-kicker">Foundations in computer science and product thinking.</p>
          </div>
          <div className="education-grid">
            {(data.education || []).map((edu, index) => (
              <div key={`${edu.degree}-${index}`} className="education-item reveal">
                <h3 className="education-degree">{edu.degree}</h3>
                <p className="education-school">{edu.school}</p>
                <p className="education-period">{edu.period}</p>
                {edu.description ? <p className="education-description">{edu.description}</p> : null}
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="section">
          <div className="section-header">
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-kicker">Selected work blending craft and scalability.</p>
          </div>
          <div className="projects-grid">
            {(data.projects || []).map((project, index) => (
              <div key={`${project.name}-${index}`} className="project-card reveal">
                <div className="project-header">
                  <h3 className="project-title">{project.name}</h3>
                </div>
                <p className="project-description">{project.description}</p>
                {project.tags ? (
                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                ) : null}
                <div className="project-links">
                  {project.demo ? (
                    <a href={project.demo} className="project-link" target="_blank" rel="noopener">Live</a>
                  ) : null}
                  {project.github ? (
                    <a href={project.github} className="project-link" target="_blank" rel="noopener">Code</a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="skills" className="section">
          <div className="section-header">
            <h2 className="section-title">Skills & Focus</h2>
            <p className="section-kicker">A balance of product, frontend, and systems thinking.</p>
          </div>
          <div className="skills-grid">
            {(data.skills || fallbackData.skills).map((skill) => (
              <div key={skill} className="skill-pill reveal">{skill}</div>
            ))}
          </div>
        </section>

        <section id="testimonials" className="section">
          <div className="section-header">
            <h2 className="section-title">Testimonials</h2>
            <p className="section-kicker">Trusted by teams that value clarity and momentum.</p>
          </div>
          <div className="testimonials-grid">
            {(data.testimonials || fallbackData.testimonials).map((item, index) => (
              <div key={`${item.name}-${index}`} className="testimonial-card reveal">
                <p className="testimonial-quote">\"{item.quote}\"</p>
                <div className="testimonial-author">
                  <span className="author-name">{item.name}</span>
                  <span className="author-role">{item.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="awards" className="section">
          <div className="section-header">
            <h2 className="section-title">Awards & Recognition</h2>
            <p className="section-kicker">Highlights from recent collaborations.</p>
          </div>
          <div className="awards-card reveal">
            <ul className="awards-list">
              {(data.awards || fallbackData.awards).map((award) => (
                <li key={award}>{award}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="glass-card contact-card reveal">
            <h2 className="section-title">Lets Connect</h2>
            <p className="contact-text">{data.contact?.text}</p>
            <div className="contact-info">
              {data.contact?.email ? (
                <a href={`mailto:${data.contact.email}`} className="contact-item">{data.contact.email}</a>
              ) : null}
              {data.contact?.phone ? (
                <a href={`tel:${data.contact.phone}`} className="contact-item">{data.contact.phone}</a>
              ) : null}
              {data.contact?.linkedin ? (
                <a href={data.contact.linkedin} className="contact-item" target="_blank" rel="noopener">LinkedIn</a>
              ) : null}
              {data.contact?.github ? (
                <a href={data.contact.github} className="contact-item" target="_blank" rel="noopener">GitHub</a>
              ) : null}
              {data.contact?.website ? (
                <a href={data.contact.website} className="contact-item" target="_blank" rel="noopener">Website</a>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>{data.footer || `© ${new Date().getFullYear()} ${data.name}. All rights reserved.`}</p>
        </div>
      </footer>

      <button
        className={`scroll-top ${showTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        ↑
      </button>

      <a
        href="https://wa.me/573238037419?text=Hola%20necesito%20ayuda"
        target="_blank"
        rel="noopener"
        className="whatsapp-float"
        aria-label="Chatea por WhatsApp"
      >
        <span className="whatsapp-icon">WA</span>
        <span className="whatsapp-text">WhatsApp</span>
      </a>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
