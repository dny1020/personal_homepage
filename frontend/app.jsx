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
  projects: [],
  skills: {},
  languages: [],
  achievements: [],
  repositories: [],
  contact: {
    text: 'Open to collaborations in telephony, DevOps, and AI automation.',
    email: 'jnarvaar@icloud.com',
    linkedin: 'https://www.linkedin.com/in/jose-danilo-narvaez-arias-26488025a/',
    github: 'https://github.com/dny1020',
    website: 'http://coffee.danilocloud.me/api/v1',
    youtube: 'https://www.youtube.com/@iDnyShell-ed7bp'
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
  languages: { label: 'Languages & Scripting', icon: '💻', color: 'var(--teal)' },
  infrastructure: { label: 'Infrastructure', icon: '🏗️', color: 'var(--amber)' },
  telephony: { label: 'Telephony & VoIP', icon: '📞', color: 'var(--coral)' },
  cloud_devops: { label: 'Cloud & DevOps', icon: '☁️', color: 'var(--teal)' },
  ai_data: { label: 'AI & Data', icon: '🧠', color: 'var(--amber)' },
  tools: { label: 'Tools & Platforms', icon: '🔧', color: 'var(--coral)' }
};

function App() {
  const [data, setData] = useState(fallbackData);
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
            {data.contact?.youtube ? (
              <a href={data.contact.youtube} target="_blank" rel="noopener" className="footer-link">YouTube</a>
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

function HomePage({ data, initials, avatarOk, setAvatarOk }) {
  const skills = data.skills || {};
  const certifications = data.certifications || [];
  const languages = data.languages || [];
  const achievements = data.achievements || [];
  const repositories = data.repositories || [];

  const hasSkills = typeof skills === 'object' && Object.keys(skills).length > 0;

  const yearsExp = useMemo(() => {
    const start = 2012;
    return new Date().getFullYear() - start;
  }, []);

  return (
    <main className="container">
      {/* Hero / About */}
      <section id="about" className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy reveal">
            <p className="hero-eyebrow">Cloud · Telephony · DevOps</p>
            <h1 className="hero-title">{data.name}</h1>
            <p className="hero-subtitle">{data.role}</p>
            <p className="hero-location">⦿ {data.location}</p>
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
              <p>Systems Engineer specializing in scalable VoIP infrastructure, cloud automation, and AI.</p>
              <div className="stats-row">
                <div className="stat">
                  <span className="stat-value">{yearsExp}+</span>
                  <span className="stat-label">Years in IT</span>
                </div>
                <div className="stat">
                  <span className="stat-value">6+</span>
                  <span className="stat-label">Years Telephony</span>
                </div>
                <div className="stat">
                  <span className="stat-value">16</span>
                  <span className="stat-label">GitHub Repos</span>
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
                  <a href={project.demo} className="project-link" target="_blank" rel="noopener">🔗 Live</a>
                ) : null}
                {project.github ? (
                  <a href={project.github} className="project-link" target="_blank" rel="noopener">💻 Code</a>
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
              const meta = SKILL_CATEGORY_META[category] || { label: category, icon: '📌', color: 'var(--teal)' };
              if (!Array.isArray(items) || !items.length) return null;
              return (
                <div key={category} className="skill-category reveal">
                  <div className="skill-category-header">
                    <span className="skill-category-icon">{meta.icon}</span>
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
              <h3 className="languages-title">🌐 Languages</h3>
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
                <div className="certification-icon">{cert.icon || '📜'}</div>
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
                <div className="achievement-icon">{item.icon || '★'}</div>
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
              <a href={`mailto:${data.contact.email}`} className="contact-item">📧 {data.contact.email}</a>
            ) : null}
            {data.contact?.linkedin ? (
              <a href={data.contact.linkedin} className="contact-item" target="_blank" rel="noopener">💼 LinkedIn</a>
            ) : null}
            {data.contact?.github ? (
              <a href={data.contact.github} className="contact-item" target="_blank" rel="noopener">💻 GitHub</a>
            ) : null}
            {data.contact?.youtube ? (
              <a href={data.contact.youtube} className="contact-item" target="_blank" rel="noopener">🎬 YouTube</a>
            ) : null}
            {data.contact?.website ? (
              <a href={data.contact.website} className="contact-item" target="_blank" rel="noopener">🌐 Website</a>
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
              <a href={`mailto:${data.contact.email}`} className="contact-item">📧 {data.contact.email}</a>
            ) : null}
            {data.contact?.linkedin ? (
              <a href={data.contact.linkedin} className="contact-item" target="_blank" rel="noopener">💼 LinkedIn</a>
            ) : null}
            <a
              href="https://wa.me/573238037419?text=Hola%20necesito%20ayuda"
              className="contact-item"
              target="_blank"
              rel="noopener"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
