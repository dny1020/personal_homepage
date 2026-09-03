const { useEffect, useMemo, useRef, useState } = React;

const WIDGET_CONFIG = {
  timezone: 'America/Bogota',
  city: 'Bogotá',
  lat: '4.7110',
  lon: '-74.0721'
};

const WEATHER_LABELS = {
  0: 'CLEAR', 1: 'CLEAR', 2: 'PART CLOUD', 3: 'OVERCAST',
  45: 'FOG', 48: 'FOG', 51: 'DRIZZLE', 53: 'DRIZZLE', 55: 'DRIZZLE',
  61: 'RAIN', 63: 'RAIN', 65: 'HEAVY RAIN', 80: 'SHOWERS', 81: 'SHOWERS',
  82: 'HEAVY SHOWERS', 95: 'STORM', 96: 'STORM', 99: 'STORM'
};

const SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'homelab', label: 'Homelab' },
  { id: 'credentials', label: 'Credentials' }
];

/* The homelab is the strongest evidence on this CV and the one thing that
   cannot be linked — both service subdomains are NXDOMAIN in public DNS. So it
   is drawn, from the achievement's own words, and never turned into a link. */
const LAB_CONTAINERS = ['Forgejo', 'Vaultwarden', 'Immich', 'MinIO', 'AdGuard', 'Uptime Kuma', 'PostgreSQL'];

const fallbackData = {
  name: '', role: '', headline: null, location: '', bio: '', avatarUrl: '', resumeUrl: '',
  experience: [], education: [], certifications: [], badges: [], projects: [],
  skills: {}, capabilities: [], languages: [], achievements: [], stats: [], contact: {}, footer: ''
};

const ICON_PATHS = {
  download: 'M12 4v12m0 0-5-5m5 5 5-5M5 20h14',
  arrowRight: 'M5 12h13m0 0-5-5m5 5-5 5',
  arrowUpRight: 'M7 17 17 7m0 0H8m9 0v9',
  mail: 'M3 6h18v12H3zM3 6l9 7 9-7',
  pin: 'M12 22s7-7.6 7-12a7 7 0 1 0-14 0c0 4.4 7 12 7 12ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  shield: 'M12 3l7 3v6c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6l7-3Z'
};

/* Which way the chevron travels on hover is the link's own promise: down for a
   download, out for anything that leaves the site, along for an internal jump. */
const ICON_DRIFT = { download: 'icon--down', arrowUpRight: 'icon--diag' };

function Icon({ name }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  const drift = ICON_DRIFT[name] || '';
  return <svg className={`icon ${drift}`} viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>;
}

function Button({ href, variant = 'primary', icon = 'arrowRight', external, download, children }) {
  const rel = external ? 'noopener noreferrer' : undefined;
  return (
    <a
      className={`btn btn--${variant}`}
      href={href}
      target={external ? '_blank' : undefined}
      rel={rel}
      download={download ? '' : undefined}
    >
      {children}
      <span className="btn__well" aria-hidden="true"><Icon name={icon} /></span>
    </a>
  );
}

function Tags({ items, limit }) {
  if (!items || !items.length) return null;
  const shown = limit ? items.slice(0, limit) : items;
  return (
    <ul className="tags">
      {shown.map((item) => <li className="tag" key={item}>{item}</li>)}
    </ul>
  );
}

function SectionHeader({ eyebrow, headline, emphasis, lede }) {
  return (
    <div className="stack-4 section-head">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="h2">
        {headline}
        {emphasis ? <> <span className="em">{emphasis}</span></> : null}
      </h2>
      {lede ? <p className="body">{lede}</p> : null}
    </div>
  );
}

/* Fade-up on entry. The hidden state lives behind .js-reveal on <html>, which
   this only sets once it knows it can put the content back. */
function Reveal({ children, index = 0, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;

    document.documentElement.classList.add('js-reveal');

    const observer = new IntersectionObserver(
      (entries, self) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          self.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -5% 0px', threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ '--i': Math.min(index, 5) }}>
      {children}
    </div>
  );
}

function LocalReading({ reading }) {
  if (!reading || !reading.time) return null;

  const clock = new Intl.DateTimeFormat('en-GB', {
    timeZone: reading.timezone || WIDGET_CONFIG.timezone,
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(reading.time));

  const parts = [WIDGET_CONFIG.city.toUpperCase(), clock];
  if (reading.temperature !== null && reading.temperature !== undefined) {
    parts.push(`${Math.round(reading.temperature)}°C`);
  }
  const sky = WEATHER_LABELS[reading.weatherCode];
  if (sky) parts.push(sky);

  return (
    <span className="reading">
      <span className="dot" aria-hidden="true" />
      {parts.join('  ·  ')}
    </span>
  );
}

function TopNav({ name, resumeUrl, current }) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = SECTIONS.map((section) => (
    <a
      className="header__link"
      key={section.id}
      href={`#${section.id}`}
      aria-current={current === section.id ? 'true' : undefined}
    >
      {section.label}
    </a>
  ));

  return (
    <header className={`header ${stuck ? 'is-stuck' : ''}`}>
      <div className="wrap header__inner">
        <a className="header__mark" href="#top">
          <span className="header__name">{name || 'Danilo Narvaez'}</span>
          <span className="header__domain">danilocloud.me</span>
        </a>
        <nav className="header__nav" aria-label="Sections">{links}</nav>
        {resumeUrl ? (
          <Button href={resumeUrl} icon="download" download>Download CV</Button>
        ) : null}
      </div>
      <nav className="header__rail" aria-label="Sections">{links}</nav>
    </header>
  );
}

function Hero({ data, reading, avatarOk, onAvatarError }) {
  const headline = data.headline;

  return (
    <section className="band band--canvas hero-band" id="top">
      <div className="wrap stack-16">
        <div className="hero">
          <div className="stack-8">
            <div className="stack-6">
              <p className="eyebrow">
                {[data.role ? data.role.split('|')[0].trim() : '', data.location]
                  .filter(Boolean)
                  .join('  ·  ')}
              </p>
              <h1 className="display">
                {headline ? headline.text : data.name}
                {headline && headline.emphasis ? (
                  <> <span className="em">{headline.emphasis}</span></>
                ) : null}
              </h1>
              {data.bio ? <p className="lead">{data.bio}</p> : null}
            </div>
            <div className="hero__actions">
              {data.resumeUrl ? (
                <Button href={data.resumeUrl} icon="download" download>Download CV</Button>
              ) : null}
              {data.contact && data.contact.github ? (
                <Button href={data.contact.github} variant="secondary" icon="arrowUpRight" external>
                  View on GitHub
                </Button>
              ) : null}
            </div>
          </div>

          {data.avatarUrl && avatarOk ? (
            <figure className="media">
              <img src={data.avatarUrl} alt={data.name} onError={onAvatarError} />
            </figure>
          ) : null}
        </div>

        {(data.stats || []).length || reading ? (
          <div className="signals">
            {(data.stats || []).map((stat) => (
              <div key={stat.label}>
                <div className="signal__value">{stat.value}</div>
                <div className="signal__label">{stat.label}</div>
              </div>
            ))}
            <LocalReading reading={reading} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Capabilities({ capabilities, skills }) {
  if (!capabilities.length) return null;

  return (
    <section className="band band--tint">
      <div className="wrap stack-16">
        <SectionHeader
          eyebrow="What I work on"
          headline="Three stacks, one"
          emphasis="operator"
          lede="Six years of telephony underneath, automation and AI on top, and the infrastructure to run both. The tags are the same skill list the CV carries."
        />
        <div className="grid-3">
          {capabilities.map((capability, index) => {
            const groups = (capability.groups || []).map((key) => skills[key] || []);
            const tags = [];
            for (let row = 0; tags.length < 6; row += 1) {
              const picked = groups.map((group) => group[row]).filter(Boolean);
              if (!picked.length) break;
              picked.forEach((name) => { if (tags.length < 6) tags.push(name); });
            }
            return (
              <Reveal key={capability.title} index={index}>
                <article className="card card--hoverable" style={{ height: '100%' }}>
                  <div className="capability">
                    <span className="capability__rule" aria-hidden="true" />
                    <h3 className="h3">{capability.title}</h3>
                    <p className="body">{capability.description}</p>
                    <Tags items={tags} />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Projects({ projects }) {
  if (!projects.length) return null;

  return (
    <section className="band band--canvas" id="work">
      <div className="wrap stack-16">
        <SectionHeader
          eyebrow="Selected work"
          headline="Open source, and"
          emphasis="readable"
          lede="Every project below is a public repository. The source is the proof — there is nothing here you cannot go and read."
        />
        <div className="grid-3">
          {projects.map((project, index) => (
            <Reveal key={project.name} index={index}>
              <article className="card card--hoverable" style={{ height: '100%' }}>
                <div className="project">
                  <div className="project__head">
                    <span className="project__index">{String(index + 1).padStart(2, '0')}</span>
                    {index === 0 ? <span className="tag tag--accent">Featured</span> : null}
                  </div>
                  <div className="project__body">
                    <h3 className="h3">{project.name}</h3>
                    <p className="body">{project.description}</p>
                  </div>
                  <Tags items={project.tags} />
                  {project.github ? (
                    <div className="project__foot">
                      <a
                        className="project__link"
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {project.github.split('//').pop()}
                        <Icon name="arrowUpRight" />
                      </a>
                    </div>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience({ experience }) {
  if (!experience.length) return null;

  return (
    <section className="band band--tint" id="experience">
      <div className="wrap stack-16">
        <SectionHeader
          eyebrow="Experience"
          headline="Thirteen years in IT, most of them"
          emphasis="at one operator"
          lede="Depth in one domain rather than breadth across many. Every role below is at the same telephony operator unless stated otherwise."
        />
        <Reveal>
          <div className="list-card">
            {experience.map((role, index) => {
              const running = (role.period || '').includes('Present');
              return (
                <article className="xp" key={`${role.title}-${index}`}>
                  <div className="xp__period">{role.period}</div>
                  <div className="stack-3">
                    <h3 className="h4">{role.title}</h3>
                    <p className="xp__org">{role.company}</p>
                    {role.description ? <p className="body">{role.description}</p> : null}
                  </div>
                  {running ? (
                    <span className="pill-now">
                      <span className="dot" aria-hidden="true" /> Current
                    </span>
                  ) : <span />}
                </article>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Homelab({ achievements }) {
  if (!achievements.length) return null;
  const lab = achievements[0];

  return (
    <section className="band band--canvas" id="homelab">
      <div className="wrap stack-16">
        <SectionHeader
          eyebrow="Infrastructure"
          headline="The site is deployed by the same hands that"
          emphasis="run the rack"
          lede="Nothing here is publicly reachable, by design — every vhost is guarded and the only way in is the tunnel. So it is drawn rather than linked."
        />
        <div className="lab">
          <Reveal>
            <div className="stack-4">
              <h3 className="h3">{lab.title}</h3>
              <p className="body">{lab.description}</p>
              <p className="small">
                TLS is a Let&rsquo;s Encrypt wildcard for the domain, renewed by certbot over
                the Cloudflare DNS-01 challenge. The public apex you are reading now is a
                separate path: S3 behind Cloudflare, provisioned with Terraform and deployed
                by GitHub Actions.
              </p>
            </div>
          </Reveal>

          <Reveal index={1}>
            <div className="card lab__diagram">
              <div className="lab__boundary">
                <p className="lab__boundary-label">
                  <Icon name="shield" /> WireGuard — the only way in
                </p>

                <div className="lab__node">
                  <span className="lab__node-name">Raspberry Pi 4</span>
                  <span className="lab__node-role">arm64 · 8 GB · Ubuntu 22.04</span>
                </div>

                <span className="lab__link" aria-hidden="true" />

                <div className="lab__node">
                  <span className="lab__node-name">nginx</span>
                  <span className="lab__node-role">reverse proxy · allow 10.0.5.0/24, deny all</span>
                </div>

                <div className="lab__containers">
                  {LAB_CONTAINERS.map((name) => <span className="tag" key={name}>{name}</span>)}
                  <span className="tag">+8 more</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Credentials({ education, certifications, badges, languages }) {
  const hasAny = education.length || certifications.length || badges.length || languages.length;
  if (!hasAny) return null;

  return (
    <section className="band band--tint" id="credentials">
      <div className="wrap stack-16">
        <SectionHeader
          eyebrow="Credentials"
          headline="Schooling, certification and"
          emphasis="the receipts"
          lede="Every badge below links to its issuer. English is B1, stated as such."
        />

        <div className="stack-12">
          {education.length ? (
            <div className="grid-3">
              {education.map((edu, index) => (
                <Reveal key={edu.degree} index={index}>
                  <article className="card" style={{ height: '100%' }}>
                    <div className="cred">
                      <h3 className="h4">{edu.degree}</h3>
                      <p className="cred__org">{edu.school}</p>
                      <p className="cred__period">{edu.period}</p>
                      {edu.description ? (
                        <p className="body" style={{ marginTop: 'var(--s-2)' }}>{edu.description}</p>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : null}

          {certifications.length ? (
            <Reveal>
              <div className="list-card">
                {certifications.map((cert) => (
                  <article className="xp" key={cert.name}>
                    <div className="xp__period">{cert.date}</div>
                    <div className="stack-3">
                      <h3 className="h4">{cert.name}</h3>
                      <p className="xp__org">{cert.issuer}</p>
                    </div>
                    <span />
                  </article>
                ))}
              </div>
            </Reveal>
          ) : null}

          {badges.length ? (
            <Reveal>
              <div className="badges">
                {badges.map((badge) => (
                  <a
                    className="badge"
                    key={badge.name}
                    href={badge.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {badge.image ? (
                      <img className="badge__img" src={badge.image} alt="" loading="lazy" />
                    ) : null}
                    <span>
                      <span className="badge__name">{badge.name}</span>
                      <span className="badge__meta">{badge.issuer} · {badge.issued}</span>
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>
          ) : null}

          {languages.length ? (
            <Reveal>
              <div className="stack-4">
                <p className="eyebrow">Languages</p>
                <div className="langs">
                  {languages.map((lang) => (
                    <div key={lang.language}>
                      <span className="lang__name">{lang.language}</span>
                      <span className="lang__level">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ContactBand({ contact, location }) {
  if (!contact || !contact.email) return null;

  return (
    <section className="band band--canvas" id="contact">
      <div className="wrap">
        <div className="cta">
          <div className="stack-8" style={{ alignItems: 'center' }}>
            <div className="stack-4" style={{ alignItems: 'center' }}>
              <h2 className="h2">
                Open to work in telephony,<br />DevOps and <span className="em">AI automation</span>
              </h2>
              {contact.text ? <p className="lead">{contact.text}</p> : null}
              {location ? <p className="mono">{location}</p> : null}
            </div>
            <div className="cta__actions">
              <Button href={`mailto:${contact.email}`} icon="mail">{contact.email}</Button>
              {contact.linkedin ? (
                <Button href={contact.linkedin} variant="secondary" icon="arrowUpRight" external>
                  LinkedIn
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ data }) {
  const year = new Date().getFullYear();
  return (
    <footer className="band foot" style={{ paddingBlock: 'var(--s-12)' }}>
      <div className="wrap foot__inner">
        <span className="mono">{data.footer || `© ${year} ${data.name}`}</span>
        <div className="foot__links">
          {data.contact && data.contact.github ? (
            <a className="foot__link" href={data.contact.github} target="_blank" rel="noopener noreferrer">
              github.com/dny1020
            </a>
          ) : null}
          {data.resumeUrl ? <a className="foot__link" href={data.resumeUrl} download>resume.pdf</a> : null}
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [data, setData] = useState(fallbackData);
  const [reading, setReading] = useState(null);
  const [avatarOk, setAvatarOk] = useState(true);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    fetch('data.json')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.status))))
      .then((json) => setData({ ...fallbackData, ...json }))
      .catch(() => setData(fallbackData));
  }, []);

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${WIDGET_CONFIG.lat}`
      + `&longitude=${WIDGET_CONFIG.lon}&current=temperature_2m,weather_code&timezone=auto`;
    fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.status))))
      .then((json) => setReading({
        time: new Date().toISOString(),
        timezone: WIDGET_CONFIG.timezone,
        temperature: json && json.current ? json.current.temperature_2m : undefined,
        weatherCode: json && json.current ? json.current.weather_code : undefined
      }))
      .catch(() => setReading({ time: new Date().toISOString(), timezone: WIDGET_CONFIG.timezone }));
  }, []);

  useEffect(() => {
    const sections = SECTIONS
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);
    if (!sections.length || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [data]);

  const skills = data.skills || {};
  const capabilities = useMemo(
    () => (data.capabilities || []).filter((item) => item && item.title),
    [data.capabilities]
  );

  return (
    <React.Fragment>
      <a className="skip" href="#work">Skip to the work</a>
      <TopNav name={data.name} resumeUrl={data.resumeUrl} current={current} />
      <main>
        <Hero
          data={data}
          reading={reading}
          avatarOk={avatarOk}
          onAvatarError={() => setAvatarOk(false)}
        />
        <Capabilities capabilities={capabilities} skills={skills} />
        <Projects projects={data.projects || []} />
        <Experience experience={data.experience || []} />
        <Homelab achievements={data.achievements || []} />
        <Credentials
          education={data.education || []}
          certifications={data.certifications || []}
          badges={data.badges || []}
          languages={data.languages || []}
        />
        <ContactBand contact={data.contact} location={data.location} />
      </main>
      <Footer data={data} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
