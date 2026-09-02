const { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } = React;

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

/* Jumper wire, 25-pair ring colours. The only chromatic system on the frame. */
const PAIRS = [
  { name: 'Blue', colour: '#1b4fa0' },
  { name: 'Orange', colour: '#c9550f' },
  { name: 'Green', colour: '#1d6f3f' },
  { name: 'Brown', colour: '#7a4a22' },
  { name: 'Slate', colour: '#5c6a74' }
];

const EQUIPMENT_GROUPS = {
  telephony: 'Telephony',
  infrastructure: 'Infrastructure',
  cloud_devops: 'Cloud & DevOps',
  languages: 'Languages',
  ai_data: 'AI & Data',
  tools: 'Tools'
};

const BLOCKS = [
  { id: 'frame', designation: '00', title: 'Frame', clause: 'Identification' },
  { id: 'cross-connect', designation: '01', title: 'Cross-connect', clause: 'Record against stack' },
  { id: 'in-service', designation: '02', title: 'In service', clause: 'Open source' },
  { id: 'qualification', designation: '03', title: 'Qualification', clause: 'Schooling and certification' },
  { id: 'termination', designation: '04', title: 'Termination', clause: 'Reach the frame' }
];

const fallbackData = {
  name: '', role: '', location: '', bio: '', avatarUrl: '', resumeUrl: '',
  experience: [], education: [], certifications: [], badges: [], projects: [],
  skills: {}, languages: [], achievements: [], stats: [], contact: {}, footer: ''
};

function Icon({ name }) {
  const paths = {
    download: 'M12 3v12m0 0-5-5m5 5 5-5M4 20h16',
    code: 'm9 7-6 5 6 5M15 7l6 5-6 5',
    link: 'M10 13a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6L11 6M14 11a4 4 0 0 0-5.6 0l-3 3A4 4 0 0 0 11 19.6L13 18',
    mail: 'M3 6h18v12H3zM3 6l9 7 9-7',
    pin: 'M12 22s7-7.6 7-12a7 7 0 1 0-14 0c0 4.4 7 12 7 12ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
    up: 'M12 20V4m0 0-6 6m6-6 6 6'
  };
  const d = paths[name];
  if (!d) return null;
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>;
}

/* Which equipment a role actually terminated on, derived from the role's own
   words. Nothing is asserted here that the CV does not already say. */
function crossConnect(experience, skills) {
  const inventory = [];
  Object.keys(EQUIPMENT_GROUPS).forEach((key) => {
    (skills[key] || []).forEach((name) => inventory.push({ name, group: key }));
  });

  const map = experience.map((role) => {
    const haystack = `${role.title} ${role.description || ''}`.toLowerCase();
    return inventory
      .filter((item) => haystack.includes(item.name.toLowerCase()))
      .map((item) => item.name);
  });

  return { inventory, map };
}

function LocalReading({ reading }) {
  if (!reading || !reading.time) return null;

  const clock = new Intl.DateTimeFormat('en-GB', {
    timeZone: reading.timezone || WIDGET_CONFIG.timezone,
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(reading.time));

  const temp = reading.temperature;
  const sky = WEATHER_LABELS[reading.weatherCode];
  const parts = [WIDGET_CONFIG.city.toUpperCase(), clock];
  if (temp !== null && temp !== undefined) parts.push(`${Math.round(temp)}°C`);
  if (sky) parts.push(sky);

  return <span className="foot-reading">{parts.join('  ·  ')}</span>;
}

function Strip({ index, designation, title, clause, count }) {
  return (
    <div className="strip" style={{ '--i': index }}>
      <span className="strip-designation">{designation}</span>
      <span className="strip-title">{title}</span>
      {clause ? <span className="strip-clause">— {clause}</span> : null}
      {count ? <span className="strip-count">{count}</span> : null}
    </div>
  );
}

function CrossConnect({ experience, skills }) {
  const { inventory, map } = useMemo(
    () => crossConnect(experience, skills),
    [experience, skills]
  );

  const running = useMemo(
    () => experience.findIndex((role) => (role.period || '').includes('Present')),
    [experience]
  );
  const atRest = running >= 0 ? running : null;
  const [hover, setHover] = useState(null);
  const [pinned, setPinned] = useState(null);
  const active = hover !== null ? hover : (pinned !== null ? pinned : atRest);
  const [paths, setPaths] = useState([]);
  const fieldRef = useRef(null);
  const circuitRefs = useRef({});
  const terminalRefs = useRef({});

  const live = active === null ? [] : map[active] || [];

  const draw = useCallback(() => {
    if (active === null || !fieldRef.current) {
      setPaths([]);
      return;
    }
    const field = fieldRef.current.getBoundingClientRect();
    const from = circuitRefs.current[active];
    if (!from) return;
    const a = from.getBoundingClientRect();
    const x1 = a.right - field.left;
    const y1 = a.top + a.height / 2 - field.top;

    const next = [];
    (map[active] || []).forEach((name, i) => {
      const node = terminalRefs.current[name];
      if (!node) return;
      const b = node.getBoundingClientRect();
      const x2 = b.left - field.left;
      const y2 = b.top + b.height / 2 - field.top;
      const bend = Math.max(40, (x2 - x1) * 0.55);
      next.push({
        d: `M${x1},${y1} C${x1 + bend},${y1} ${x2 - bend},${y2} ${x2},${y2}`,
        colour: PAIRS[i % PAIRS.length].colour,
        key: name
      });
    });
    setPaths(next);
  }, [active, map]);

  useLayoutEffect(draw, [draw]);

  useEffect(() => {
    if (active === null) return undefined;
    // Redraw on the next frame so the measurement happens after layout settles,
    // and observe the field itself: a window resize is not the only thing that
    // moves these boxes (font swap, image load, viewport change on capture).
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    const observer = new ResizeObserver(schedule);
    if (fieldRef.current) observer.observe(fieldRef.current);
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule);
    };
  }, [active, draw]);

  return (
    <div className="xconnect" ref={fieldRef}>
      <p className="xconnect-legend">
        Line side carries the dated record. Equipment side carries the stack. The circuit
        still in service is traced at rest; focus any other to trace what it terminated on.
        Every jumper is drawn from that role&rsquo;s own description.
      </p>

      <svg className="jumpers" aria-hidden="true">
        {paths.map((p) => (
          <path key={p.key} className="jumper is-live" d={p.d} stroke={p.colour} />
        ))}
      </svg>

      <div className="side">
        <h3 className="side-head">LINE SIDE — RECORD</h3>
        {experience.map((role, index) => {
          const running = (role.period || '').includes('Present');
          const pairs = (map[index] || []).length;
          return (
            <article
              key={`${role.title}-${index}`}
              className={`circuit ${active === index ? 'is-active' : ''}`}
              ref={(el) => { circuitRefs.current[index] = el; }}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(null)}
            >
              <div className="circuit-row">
                <button
                  type="button"
                  className={`state ${running ? 'state--active' : 'state--terminated'}`}
                  aria-pressed={pinned === index}
                  aria-label={`Trace the ${role.title} circuit`}
                  onClick={() => setPinned(pinned === index ? null : index)}
                  onFocus={() => setHover(index)}
                  onBlur={() => setHover(null)}
                >
                  {running ? 'Active' : 'Terminated'}
                </button>
                <h4 className="circuit-title">{role.title}</h4>
                <span className="circuit-period">{role.period}</span>
              </div>
              <p className="circuit-pairs">
                {pairs ? `${pairs} pair${pairs === 1 ? '' : 's'} cross-connected` : 'Line side only — predates this stack'}
              </p>
              <p className="circuit-org">{role.company}</p>
              <p className="circuit-note">{role.description}</p>
            </article>
          );
        })}
      </div>

      <div aria-hidden="true" />

      <div className="blocks-eq">
        <h3 className="side-head">EQUIPMENT SIDE — STACK</h3>
        {Object.entries(EQUIPMENT_GROUPS).map(([key, label]) => {
          const items = inventory.filter((item) => item.group === key);
          if (!items.length) return null;
          return (
            <div className="eq-group" key={key}>
              <p className="eq-group-label">
                {label} <span className="eq-group-count">{items.length}</span>
              </p>
              <div className="terminals">
                {items.map((item) => {
                  const isLive = live.includes(item.name);
                  const dimmed = active !== null && !isLive;
                  return (
                    <span
                      key={item.name}
                      ref={(el) => { terminalRefs.current[item.name] = el; }}
                      className={`terminal ${isLive ? 'is-live' : ''} ${dimmed ? 'is-dimmed' : ''}`}
                    >
                      {item.name}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="pair-legend">
          <p className="pair-legend-title">JUMPER — 25-PAIR CODE</p>
          <div className="pair-legend-row">
            {PAIRS.map((pair) => (
              <span className="pair-key" key={pair.name}>
                <span className="pair-swatch" style={{ background: pair.colour }} />
                {pair.name}
              </span>
            ))}
          </div>
          <p className="pair-legend-foot">
            {inventory.length} terminals across {Object.keys(EQUIPMENT_GROUPS).length} blocks.
            Wire is assigned per pair, in order, from the circuit under trace.
          </p>
        </div>

        <p className="eq-note">
          Inked terminals are the ones the traced circuit terminated on. Tap any circuit&rsquo;s
          state chip on the line side to trace it.
        </p>
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState(fallbackData);
  const [reading, setReading] = useState(null);
  const [avatarOk, setAvatarOk] = useState(true);
  const [current, setCurrent] = useState('frame');
  const [showTop, setShowTop] = useState(false);

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
        temperature: json?.current?.temperature_2m,
        weatherCode: json?.current?.weather_code
      }))
      .catch(() => setReading({ time: new Date().toISOString(), timezone: WIDGET_CONFIG.timezone }));
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = BLOCKS
      .map((b) => document.getElementById(b.id))
      .filter(Boolean);
    if (!sections.length) return undefined;

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
  const terminalCount = Object.keys(EQUIPMENT_GROUPS)
    .reduce((total, key) => total + ((data.skills || {})[key] || []).length, 0);
  const counts = {
    'cross-connect': `${(data.experience || []).length} circuits`,
    'in-service': `${(data.projects || []).length} circuits`,
    qualification: `${(data.education || []).length + (data.badges || []).length + (data.certifications || []).length} records`,
    termination: `${(data.languages || []).length} languages`
  };
  const badges = data.badges || [];
  const certifications = data.certifications || [];

  return (
    <div className="frame landing">
      <nav className="upright" aria-label="Frame blocks">
        <span className="upright-mark">MDF</span>
        {BLOCKS.map((block) => (
          <a
            key={block.id}
            className="upright-link"
            href={`#${block.id}`}
            aria-current={current === block.id ? 'true' : undefined}
            title={block.title}
          >
            {block.designation}
          </a>
        ))}
        <div className="upright-foot">
          {showTop ? (
            <a className="upright-link" href="#frame" aria-label="Back to frame head">
              <Icon name="up" />
            </a>
          ) : null}
        </div>
      </nav>

      <section className="block" id="frame">
        <div className="strip strip--head" style={{ '--i': 0 }}>
          <h1 className="head-name">{data.name}</h1>
          <p className="head-discipline">{data.role}</p>
          {(data.stats || []).length ? (
            <p className="head-counts">
              {data.stats.map((stat) => `${stat.value} ${stat.label}`).join('  ·  ')}
            </p>
          ) : null}
        </div>
        <div className="block-body">
          <div className="head">
            <div>
              <p className="head-bio">{data.bio}</p>
              <div className="head-actions">
                {data.resumeUrl ? (
                  <a className="tag tag--live" href={data.resumeUrl} download>
                    <Icon name="download" /> Record copy
                  </a>
                ) : null}
                {data.contact?.github ? (
                  <a className="tag" href={data.contact.github} target="_blank" rel="noopener">
                    <Icon name="code" /> Source
                  </a>
                ) : null}
                {data.location ? (
                  <span className="tag"><Icon name="pin" /> {data.location}</span>
                ) : null}
              </div>
            </div>

            <div className="frame-data">
              <h2 className="side-head">FRAME DATA</h2>
              <dl className="data-list">
                <div className="data-row">
                  <dt>Location</dt>
                  <dd>{data.location}</dd>
                </div>
                <div className="data-row">
                  <dt>Circuits</dt>
                  <dd>{(data.experience || []).length}</dd>
                </div>
                <div className="data-row">
                  <dt>Terminals</dt>
                  <dd>{terminalCount}</dd>
                </div>
                <div className="data-row">
                  <dt>Record issued</dt>
                  <dd>{new Date().getFullYear()}</dd>
                </div>
              </dl>
              {(data.achievements || []).map((item) => (
                <p className="frame-note" key={item.title}>
                  <strong>{item.title}.</strong> {item.description}
                </p>
              ))}
            </div>

            {data.avatarUrl && avatarOk ? (
              <figure className="plate">
                <img src={data.avatarUrl} alt={data.name} onError={() => setAvatarOk(false)} />
                <figcaption className="plate-caption">ID PLATE</figcaption>
              </figure>
            ) : null}
          </div>
        </div>
      </section>

      <section className="block" id="cross-connect">
        <Strip
          index={1}
          designation="01"
          title="Cross-connect" clause="Record against stack"
          count={counts['cross-connect']}
        />
        <div className="block-body">
          <CrossConnect experience={data.experience || []} skills={skills} />
        </div>
      </section>

      <section className="block" id="in-service">
        <Strip
          index={2}
          designation="02"
          title="In service" clause="Open source"
          count={counts['in-service']}
        />
        <div className="block-body">
          <div className="circuits-grid">
            {(data.projects || []).map((project, index) => (
              <article className="service" key={project.name}>
                <div className="service-head">
                  <span className="service-designation">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="service-name">{project.name}</h3>
                </div>
                <p className="service-note">{project.description}</p>
                <div className="terminals">
                  {(project.tags || []).map((tag) => (
                    <span className="terminal" key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="service-foot">
                  {project.github ? (
                    <a className="tag" href={project.github} target="_blank" rel="noopener">
                      <Icon name="code" /> Source
                    </a>
                  ) : null}
                  {project.demo ? (
                    <a className="tag" href={project.demo} target="_blank" rel="noopener">
                      <Icon name="link" /> Live
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="qualification">
        <Strip
          index={3}
          designation="03"
          title="Qualification" clause="Schooling and certification"
          count={counts.qualification}
        />
        <div className="block-body">
          <div className="qual-grid">
            {(data.education || []).map((edu) => (
              <div className="qual" key={edu.degree}>
                <h3 className="qual-title">{edu.degree}</h3>
                <p className="qual-org">{edu.school}</p>
                <p className="qual-period">{edu.period}</p>
                {edu.description ? <p className="qual-note">{edu.description}</p> : null}
              </div>
            ))}
            {certifications.map((cert) => (
              <div className="qual" key={cert.name}>
                <h3 className="qual-title">{cert.name}</h3>
                <p className="qual-org">{cert.issuer}</p>
                <p className="qual-period">{cert.date}</p>
              </div>
            ))}
            {badges.map((badge) => (
              <a
                className="badge-row"
                key={badge.name}
                href={badge.url}
                target="_blank"
                rel="noopener"
              >
                {badge.image ? (
                  <img className="badge-img" src={badge.image} alt="" loading="lazy" />
                ) : null}
                <span>
                  <span className="badge-name">{badge.name}</span>
                  <span className="badge-meta">{badge.issuer} · {badge.issued}</span>
                </span>
              </a>
            ))}
          </div>

        </div>
      </section>

      <section className="block" id="termination">
        <Strip index={4} designation="04" title="Termination" clause="Reach the frame" />
        <div className="block-body">
          <div className="termination">
            <div>
              {data.contact?.text ? <p className="term-note">{data.contact.text}</p> : null}
              <div className="term-list">
                {data.contact?.email ? (
                  <a className="term-link" href={`mailto:${data.contact.email}`}>
                    <Icon name="mail" /> {data.contact.email}
                  </a>
                ) : null}
                {data.contact?.github ? (
                  <a className="term-link" href={data.contact.github} target="_blank" rel="noopener">
                    <Icon name="code" /> github.com/dny1020
                  </a>
                ) : null}
                {data.contact?.linkedin ? (
                  <a className="term-link" href={data.contact.linkedin} target="_blank" rel="noopener">
                    <Icon name="link" /> LinkedIn
                  </a>
                ) : null}
              </div>
            </div>

            {(data.languages || []).length ? (
              <div>
                <h3 className="side-head">LANGUAGES</h3>
                <div className="lang-row">
                  {data.languages.map((lang) => (
                    <div className="lang" key={lang.language}>
                      <span className="lang-name">{lang.language}</span>
                      <span className="lang-level">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <h3 className="side-head">BLOCK ELEVATION</h3>
              <div className="elevation-key">
                {BLOCKS.map((block) => (
                  <a className="elevation-row" href={`#${block.id}`} key={block.id}>
                    <span>{block.designation}</span>
                    <span>{block.title}</span>
                    <span className="elevation-count">{counts[block.id] || ''}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="foot">
        <span>{data.footer || `© ${new Date().getFullYear()} ${data.name}`}</span>
        <LocalReading reading={reading} />
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
