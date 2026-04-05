const { useEffect, useMemo, useState } = React;

const API_BASE = '';

const fallbackData = {
  name: 'Jose Danilo Narvaez Arias',
  role: 'Systems Engineer | Cloud & Telephony Infrastructure | DevOps',
  location: 'Bogotá, Colombia',
  bio: 'Systems Engineer specializing in Cloud & Telephony Infrastructure and DevOps Automation. 6+ years at Emtelco building scalable VoIP systems with Asterisk, Kamailio, and SIP. Fluent in Python, Bash, and containerized deployments.',
  avatarUrl: '/IMG_2164.jpg?v=7',
  experience: [],
  education: [],
  certifications: [],
  badges: [],
  projects: [],
  skills: {},
  languages: [],
  achievements: [],
  repositories: [],
  contact: {
    text: 'Open to collaborations in telephony, DevOps, and AI automation.',
    email: 'jnarvaar@icloud.com',
    linkedin: 'https://www.linkedin.com/in/jose-danilo-narvaez-arias-26488025a/',
    github: 'https://github.com/dny1020'
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

function useRoute() {
  const getRoute = () => window.location.pathname;
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const onPop = () => setRoute(getRoute());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return route;
}

const SKILL_CATEGORY_META = {
  languages: { label: 'Languages & Scripting', icon: 'code', color: 'var(--teal)' },
  infrastructure: { label: 'Infrastructure', icon: 'server', color: 'var(--amber)' },
  telephony: { label: 'Telephony & VoIP', icon: 'phone', color: 'var(--coral)' },
  cloud_devops: { label: 'Cloud & DevOps', icon: 'cloud', color: 'var(--teal)' },
  ai_data: { label: 'AI & Data', icon: 'brain', color: 'var(--amber)' },
  tools: { label: 'Tools & Platforms', icon: 'tool', color: 'var(--coral)' }
};

function Icon({ name, className = '' }) {
  const paths = {
    code: 'M16.2 4.7 8.9 12l7.3 7.3-1.9 1.9L5 12l9.3-9.2 1.9 1.9Zm3.8 0 9.3 9.2-9.3 9.2-1.9-1.9 7.3-7.3-7.3-7.3 1.9-1.9Z',
    server: 'M5 4.5h22v6H5v-6Zm0 9.5h22v6H5v-6Zm0 9.5h22v6H5v-6Zm3 2.5h4v2H8v-2Zm0-9.5h4v2H8v-2Zm0-9.5h4v2H8v-2Z',
    phone: 'M10.2 6.4 7.9 4.1 4.5 7.6c-1.2 1.2-1.6 3-1.1 4.6 1.6 5.1 5.8 9.4 10.9 11 1.6.5 3.4.1 4.6-1.1l3.5-3.5-2.3-2.3-2.9 1.2c-.8.3-1.7.1-2.3-.5l-3.9-3.9c-.6-.6-.8-1.5-.5-2.3l1.2-2.9Z',
    cloud: 'M9 21h12a5 5 0 0 0 0-10 7 7 0 0 0-13.4-2.2A5.5 5.5 0 0 0 9 21Z',
    brain: 'M9.5 20a4.5 4.5 0 0 1-4.5-4.5 4.3 4.3 0 0 1 1.1-2.9A4.5 4.5 0 0 1 9 5.1 4.5 4.5 0 0 1 14 3.5a4.6 4.6 0 0 1 4 2.3 4.5 4.5 0 0 1 5.5 4.4 4.3 4.3 0 0 1-1.1 2.9A4.5 4.5 0 0 1 19 20h-1.5',
    tool: 'M21.7 6.9a5 5 0 0 1-6.8 6.8l-8 8-2.1-2.1 8-8a5 5 0 0 1 6.8-6.8l-3.2 3.2 2.1 2.1 3.2-3.2Z',
    pin: 'M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7Zm0 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
    link: 'M10.5 13.5a4 4 0 0 1 0-5.7l3.3-3.3a4 4 0 1 1 5.7 5.7l-1.5 1.5m-4 6.8a4 4 0 0 1-5.7 0 4 4 0 0 1 0-5.7l1.5-1.5m3.2 5.5 5.8-5.8',
    mail: 'M4 7h24v18H4V7Zm2 2v2l10 6 10-6V9H6Zm20 14V13l-10 6-10-6v10h20Z',
    linkedin: 'M6 10h4v14H6V10Zm2-6a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm6 6h4v2.2c.9-1.4 2.5-2.5 4.7-2.5 4 0 5.3 2.6 5.3 6.4V24h-4v-6.6c0-1.6-.1-3.7-2.3-3.7-2.3 0-2.7 1.8-2.7 3.6V24h-4V10Z',
    github: 'M12 2.5a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.2-3.5-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.5 2.4 1.1 3 .8.1-.7.3-1.1.6-1.4-2.3-.3-4.7-1.1-4.7-5a4 4 0 0 1 1-2.8 3.7 3.7 0 0 1 .1-2.8s.9-.3 2.9 1a10 10 0 0 1 5.2 0c2-1.3 2.9-1 2.9-1a3.7 3.7 0 0 1 .1 2.8 4 4 0 0 1 1 2.8c0 3.9-2.4 4.7-4.7 5 .3.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2.5Z',
    certificate: 'M6 4h20v12H6V4Zm4 16h12v2H10v-2Zm2.5-7 3.5 2 3.5-2V6.5h-7v6.5Z',
    award: 'M12 4a6 6 0 0 1 6 6c0 2.4-1.4 4.6-3.5 5.5V28l-2.5-1.6L9.5 28V15.5A6 6 0 0 1 6 10a6 6 0 0 1 6-6Z'
  };

  const d = paths[name];
  if (!d) return null;
  return (
    <svg className={`icon ${className}`} viewBox="0 0 32 32" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function App() {
  const [data, setData] = useState(fallbackData);
  const [widgets, setWidgets] = useState({ time: null, timezone: null, city: null, weather: null });
  const [navOpen, setNavOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [avatarOk, setAvatarOk] = useState(true);
  const route = useRoute();
  const isServices = route.startsWith('/bot-ai');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/info`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const payload = await response.json();
        if (mounted) {
          const merged = { ...fallbackData, ...payload };
          if (!payload.avatarUrl) {
            merged.avatarUrl = fallbackData.avatarUrl;
          }
          setData(merged);
        }
      } catch (error) {
        if (mounted) {
          setData(fallbackData);
        }
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    let timer;
    const loadWidgets = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/widgets`);
        if (!response.ok) throw new Error('Failed to fetch widgets');
        const payload = await response.json();
        if (mounted) {
          setWidgets(payload);
        }
      } catch (error) {
        if (mounted) {
          setWidgets((prev) => ({ ...prev, weather: null }));
        }
      }
    };
    loadWidgets();
    timer = setInterval(loadWidgets, 10 * 60 * 1000);
    return () => {
      mounted = false;
      if (timer) clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      setShowTop(y > 600);

      if (isServices) return;
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
  }, [isServices]);

  useRevealOnScroll([data, isServices]);

  useEffect(() => {
    setAvatarOk(true);
  }, [data.avatarUrl]);

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
          <a className="nav-logo" href="/" onClick={handleNavClick}>
            <div className="nav-avatar">
              {data.avatarUrl && avatarOk ? (
                <img src={data.avatarUrl} alt={`${data.name} avatar`} onError={() => setAvatarOk(false)} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <span className="nav-name">{data.name?.split(' ').slice(0, 2).join(' ')}</span>
          </a>

          <div className={`nav-links ${navOpen ? 'active' : ''}`}>
            {isServices ? (
              <>
                <a href="/" className="nav-link" onClick={handleNavClick}>Home</a>
                <a href="#services" className="nav-link" onClick={handleNavClick}>Services</a>
                <a href="#process" className="nav-link" onClick={handleNavClick}>Process</a>
                <a href="#cases" className="nav-link" onClick={handleNavClick}>Use Cases</a>
                <a href="#contact" className="nav-link" onClick={handleNavClick}>Contact</a>
              </>
            ) : (
              <>
                {[
                  { id: 'about', label: 'About' },
                  { id: 'experience', label: 'Experience' },
                  { id: 'education', label: 'Education' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'skills', label: 'Skills' }
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
                <a href="/bot-ai" className="nav-link" onClick={handleNavClick}>Services</a>
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
                      { id: 'certifications', label: 'Certifications' },
                      { id: 'achievements', label: 'Achievements' },
                      { id: 'repositories', label: 'Repositories' },
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
              </>
            )}
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

      {isServices ? (
        <ServicesPage data={data} />
      ) : (
        <HomePage
          data={data}
          initials={initials}
          avatarOk={avatarOk}
          setAvatarOk={setAvatarOk}
          widgets={widgets}
        />
      )}

      <footer className="footer">
        <div className="footer-content">
          <p>{data.footer || `© ${new Date().getFullYear()} ${data.name}. All rights reserved.`}</p>
          <div className="footer-links">
            {data.contact?.linkedin ? (
              <a href={data.contact.linkedin} target="_blank" rel="noopener" className="footer-link">LinkedIn</a>
            ) : null}
            {data.contact?.github ? (
              <a href={data.contact.github} target="_blank" rel="noopener" className="footer-link">GitHub</a>
            ) : null}
          </div>
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
        aria-label="Chat on WhatsApp"
      >
        <span className="whatsapp-icon">WA</span>
        <span className="whatsapp-text">WhatsApp</span>
      </a>
    </div>
  );
}

function HomePage({ data, initials, avatarOk, setAvatarOk, widgets }) {
  const skills = data.skills || {};
  const certifications = data.certifications || [];
  const badges = data.badges || [];
  const languages = data.languages || [];
  const achievements = data.achievements || [];
  const repositories = data.repositories || [];

  const hasSkills = typeof skills === 'object' && Object.keys(skills).length > 0;

  const yearsExp = useMemo(() => {
    const start = 2012;
    return new Date().getFullYear() - start;
  }, []);

  const stats = Array.isArray(data.stats) && data.stats.length
    ? data.stats
    : [
      { label: 'Years in IT', value: `${yearsExp}+` },
      { label: 'Years Telephony', value: '6+' },
      { label: 'GitHub Repos', value: '16' }
    ];

  const weatherLabel = (code) => {
    if (code === null || code === undefined) return 'Weather unavailable';
    const map = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Rain showers',
      81: 'Rain showers',
      82: 'Violent showers',
      95: 'Thunderstorm'
    };
    return map[code] || 'Mixed conditions';
  };

  const timeLabel = useMemo(() => {
    if (!widgets?.time) return null;
    const date = new Date(widgets.time);
    return new Intl.DateTimeFormat('es-CO', {
      timeZone: widgets.timezone || 'America/Bogota',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
      month: 'short',
      day: '2-digit'
    }).format(date);
  }, [widgets?.time, widgets?.timezone]);

  return (
    <main className="container">
      {/* Hero / About */}
      <section id="about" className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy reveal">
            <p className="hero-eyebrow">Cloud · Telephony · DevOps</p>
            <h1 className="hero-title">{data.name}</h1>
            <p className="hero-subtitle">{data.role}</p>
            <p className="hero-location"><Icon name="pin" /> {data.location}</p>
            <p className="hero-bio">{data.bio}</p>
            <div className="hero-buttons">
              <a href="#contact" className="btn btn-primary">Let's Connect</a>
              <a href="#projects" className="btn btn-ghost">View Projects</a>
            </div>
          </div>

          <div className="hero-card reveal">
            <div className="hero-avatar">
              {data.avatarUrl && avatarOk ? (
                <img src={data.avatarUrl} alt={`${data.name} profile`} onError={() => setAvatarOk(false)} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="hero-card-content">
              <h3>Profile Overview</h3>
              <p>{data.profileOverview || 'Systems Engineer specializing in scalable VoIP infrastructure, cloud automation, and AI.'}</p>
              <div className="stats-row">
                {stats.map((stat, index) => (
                  <div key={`${stat.label}-${index}`} className="stat">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="widget-row">
                <div className="widget-card">
                  <span className="widget-label">Bogotá time</span>
                  <span className="widget-value">{timeLabel || 'Loading...'}</span>
                  <span className="widget-meta">{widgets?.timezone || 'America/Bogota'}</span>
                </div>
                <div className="widget-card">
                  <span className="widget-label">Weather</span>
                  <span className="widget-value">
                    {widgets?.weather?.temperature !== null && widgets?.weather?.temperature !== undefined
                      ? `${Math.round(widgets.weather.temperature)}${widgets.weather.temperature_unit || '°C'}`
                      : 'Loading...'}
                  </span>
                  <span className="widget-meta">
                    {widgets?.weather ? weatherLabel(widgets.weather.weather_code) : 'No data'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="section">
        <div className="section-header">
          <h2 className="section-title">Professional Experience</h2>
          <p className="section-kicker">A career arc from support to engineering — always in telecommunications.</p>
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

      {/* Education */}
      <section id="education" className="section">
        <div className="section-header">
          <h2 className="section-title">Education & Certifications</h2>
          <p className="section-kicker">Continuous learning in engineering, cybersecurity, cloud, and AI.</p>
        </div>
        <div className="education-grid">
          {(data.education || []).map((edu, index) => (
            <div key={`${edu.degree}-${index}`} className="education-item reveal">
              <h3 className="education-degree">{edu.degree}</h3>
              <p className="education-school">{edu.school}</p>
              <p className="education-period">{edu.period}</p>
              {edu.description ? <p className="education-description">{edu.description}</p> : null}
              {edu.skills ? (
                <div className="education-skills">
                  {edu.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-kicker">Real-world solutions from telephony platforms to monitoring APIs.</p>
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
                {project.demo && project.demo !== '#' ? (
                  <a href={project.demo} className="project-link" target="_blank" rel="noopener"><Icon name="link" /> Live</a>
                ) : null}
                {project.github ? (
                  <a href={project.github} className="project-link" target="_blank" rel="noopener"><Icon name="code" /> Code</a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      {hasSkills ? (
        <section id="skills" className="section">
          <div className="section-header">
            <h2 className="section-title">Technical Skills</h2>
            <p className="section-kicker">A comprehensive toolkit spanning infrastructure, development, and operations.</p>
          </div>
          <div className="skills-categories">
            {Object.entries(skills).map(([category, items]) => {
              const meta = SKILL_CATEGORY_META[category] || { label: category, icon: 'award', color: 'var(--teal)' };
              if (!Array.isArray(items) || !items.length) return null;
              return (
                <div key={category} className="skill-category reveal">
                  <div className="skill-category-header">
                    <span className="skill-category-icon"><Icon name={meta.icon} /></span>
                    <h3 className="skill-category-title">{meta.label}</h3>
                  </div>
                  <div className="skill-category-pills">
                    {items.map((skill) => (
                      <span key={skill} className="skill-pill" style={{ borderColor: meta.color + '44', background: meta.color + '18' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {languages.length > 0 ? (
            <div className="languages-section reveal">
              <h3 className="languages-title">Languages</h3>
              <div className="languages-grid">
                {languages.map((lang) => (
                  <div key={lang.language} className="language-card">
                    <span className="language-name">{lang.language}</span>
                    <span className="language-level">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* Certifications */}
      {certifications.length > 0 ? (
        <section id="certifications" className="section">
          <div className="section-header">
            <h2 className="section-title">Licenses & Certifications</h2>
            <p className="section-kicker">Industry certifications validating cloud, security, and leadership competencies.</p>
          </div>
          <div className="certifications-grid">
            {certifications.map((cert, index) => (
              <div key={`${cert.name}-${index}`} className="certification-card reveal">
                <div className="certification-icon"><Icon name="certificate" /></div>
                <div className="certification-info">
                  <h3 className="certification-name">{cert.name}</h3>
                  <p className="certification-issuer">{cert.issuer}</p>
                  <span className="certification-date">{cert.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Badges */}
      {badges.length > 0 ? (
        <section id="badges" className="section">
          <div className="section-header">
            <h2 className="section-title">Digital Badges</h2>
            <p className="section-kicker">Verified credentials and skill endorsements.</p>
          </div>
          <div className="badges-grid">
            {badges.map((badge, index) => (
              <a
                key={`${badge.name}-${index}`}
                className="badge-card reveal"
                href={badge.url || '#'}
                target="_blank"
                rel="noopener"
              >
                <div className="badge-image">
                  {badge.image ? <img src={badge.image} alt={badge.name} /> : <span>Badge</span>}
                </div>
                <div className="badge-info">
                  <h3 className="badge-title">{badge.name}</h3>
                  <p className="badge-issuer">{badge.issuer}</p>
                  {badge.issued ? <span className="badge-date">{badge.issued}</span> : null}
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {/* Achievements */}
      {achievements.length ? (
        <section id="achievements" className="section">
          <div className="section-header">
            <h2 className="section-title">Key Achievements</h2>
            <p className="section-kicker">Impact highlights from recent engineering work.</p>
          </div>
          <div className="achievements-grid">
            {achievements.map((item, index) => (
              <div key={`${item.title}-${index}`} className="achievement-card reveal">
                <div className="achievement-icon"><Icon name="award" /></div>
                <div>
                  <h3 className="achievement-title">{item.title}</h3>
                  <p className="achievement-description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Repositories */}
      {repositories.length ? (
        <section id="repositories" className="section">
          <div className="section-header">
            <h2 className="section-title">Open Source</h2>
            <p className="section-kicker">Public repositories and technical experiments on GitHub.</p>
          </div>
          <div className="repositories-grid">
            {repositories.map((repo, index) => (
              <a
                key={`${repo.name}-${index}`}
                className="repo-card reveal"
                href={repo.url || '#'}
                target="_blank"
                rel="noopener"
              >
                <div className="repo-header">
                  <span className="repo-name">{repo.name}</span>
                  <span className="repo-language">{repo.language}</span>
                </div>
                <p className="repo-description">{repo.description}</p>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {/* Contact */}
      <section id="contact" className="section contact-section">
        <div className="glass-card contact-card reveal">
          <h2 className="section-title">Let's Connect</h2>
          <p className="contact-text">{data.contact?.text}</p>
          <div className="contact-info">
            {data.contact?.email ? (
              <a href={`mailto:${data.contact.email}`} className="contact-item"><Icon name="mail" /> {data.contact.email}</a>
            ) : null}
            {data.contact?.linkedin ? (
              <a href={data.contact.linkedin} className="contact-item" target="_blank" rel="noopener"><Icon name="linkedin" /> LinkedIn</a>
            ) : null}
            {data.contact?.github ? (
              <a href={data.contact.github} className="contact-item" target="_blank" rel="noopener"><Icon name="github" /> GitHub</a>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function ServicesPage({ data }) {
  return (
    <main className="container services-page">
      <section className="services-hero" id="services">
        <div className="services-hero-content reveal">
          <p className="hero-eyebrow">Automation + AI</p>
          <h1 className="hero-title">Bots + AI for sales, support, and operations</h1>
          <p className="hero-subtitle">WhatsApp bots, voice automation, SIP, and CRM integrations.</p>
          <p className="hero-bio">
            Build intelligent assistants for customer support, lead qualification, and operational workflows.
            From SIP telephony to AI voicebots, I deliver full-stack automation that is reliable and measurable.
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="btn btn-primary">Request a Demo</a>
            <a href="#cases" className="btn btn-ghost">See Use Cases</a>
          </div>
        </div>
        <div className="services-hero-panel reveal">
          <div className="panel-card">
            <h3>Response Time</h3>
            <p className="panel-value">&lt; 2s</p>
            <span>Customer-grade SLA support.</span>
          </div>
          <div className="panel-card">
            <h3>Availability</h3>
            <p className="panel-value">24/7</p>
            <span>Always-on automation.</span>
          </div>
          <div className="panel-card">
            <h3>Deploy Time</h3>
            <p className="panel-value">2-4 wks</p>
            <span>From scope to production.</span>
          </div>
        </div>
      </section>

      <section className="section" id="services-list">
        <div className="section-header">
          <h2 className="section-title">Core Services</h2>
          <p className="section-kicker">End-to-end automation services aligned with your business goals.</p>
        </div>
        <div className="services-grid">
          {[
            {
              title: 'WhatsApp & Chatbots',
              description: 'Conversational flows, escalation, and integrations with CRM and ticketing systems.'
            },
            {
              title: 'Voicebots & IVR',
              description: 'Natural language voice flows for call deflection and faster service resolution.'
            },
            {
              title: 'SIP & Asterisk',
              description: 'Reliable VoIP infrastructure, routing, and monitoring with enterprise stability.'
            },
            {
              title: 'CRM & Workflow Automation',
              description: 'Connect customer data, automate follow-ups, and improve response time.'
            },
            {
              title: 'Observability & Analytics',
              description: 'Dashboards and telemetry for quality monitoring, SLA performance, and ROI.'
            },
            {
              title: 'Custom Integrations',
              description: 'Tailored APIs and data synchronization to fit your stack.'
            }
          ].map((item) => (
            <div key={item.title} className="service-card reveal">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="process">
        <div className="section-header">
          <h2 className="section-title">Delivery Process</h2>
          <p className="section-kicker">A professional, transparent process from discovery to scaling.</p>
        </div>
        <div className="process-grid">
          {[
            { step: '01', title: 'Discovery', text: 'Map objectives, constraints, and success metrics.' },
            { step: '02', title: 'Blueprint', text: 'Define architecture, flows, and integrations.' },
            { step: '03', title: 'Build', text: 'Implementation with weekly demos and QA.' },
            { step: '04', title: 'Launch', text: 'Production rollout, training, and monitoring.' }
          ].map((item) => (
            <div key={item.step} className="process-card reveal">
              <span className="process-step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="cases">
        <div className="section-header">
          <h2 className="section-title">Use Cases</h2>
          <p className="section-kicker">Examples of automation that move the needle.</p>
        </div>
        <div className="cases-grid">
          {[
            {
              title: 'ISP Support Automation',
              text: 'Deflect 40% of tier-1 tickets with guided troubleshooting and ticket escalation.'
            },
            {
              title: 'Sales Qualification Bot',
              text: 'Capture leads, qualify intent, and notify sales with structured data.'
            },
            {
              title: 'Voice IVR Modernization',
              text: 'Replace legacy IVR with conversational voice flows and call analytics.'
            }
          ].map((item) => (
            <div key={item.title} className="case-card reveal">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="glass-card contact-card reveal">
          <h2 className="section-title">Ready to automate?</h2>
          <p className="contact-text">{data.contact?.text || 'Lets build an automation roadmap tailored to your business.'}</p>
          <div className="contact-info">
            {data.contact?.email ? (
              <a href={`mailto:${data.contact.email}`} className="contact-item"><Icon name="mail" /> {data.contact.email}</a>
            ) : null}
            {data.contact?.linkedin ? (
              <a href={data.contact.linkedin} className="contact-item" target="_blank" rel="noopener"><Icon name="linkedin" /> LinkedIn</a>
            ) : null}
            <a
              href="https://wa.me/573238037419?text=Hola%20necesito%20ayuda"
              className="contact-item"
              target="_blank"
              rel="noopener"
            >
              <Icon name="phone" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
