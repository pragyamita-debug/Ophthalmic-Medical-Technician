import { useEffect, useState } from 'react';
import hero from '../assets/photos/hero.jpg';
import reception from '../assets/photos/reception.jpg';
import tech from '../assets/photos/tech.jpg';
import { useCountUp } from '../hooks/useCountUp';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { Resume } from '../lib/types';
import { GlowCard, type Accent } from './GlowCard';
import { Icon, type IconName } from './Icon';
import { Logo } from './Logo';
import { NAV } from './NavBar';
import { Reveal } from './Reveal';

/** "Ophthalmic Medical Technician | Diagnostic Imaging" → ["Ophthalmic Medical Technician", "Diagnostic Imaging"] */
export const splitHeadline = (h: string) => h.split(/\s*[|•·–—]\s*/).filter(Boolean);

const initialsOf = (s: string) =>
  s
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

function Head({ label, title, intro, id, center = false }: { label: string; title: React.ReactNode; intro?: string; id: string; center?: boolean }) {
  return (
    <Reveal className={`head ${center ? 'head--center' : ''}`}>
      <span className="label">{label}</span>
      <h2 id={id} className="title">
        {title}
      </h2>
      {intro && <p className="head__intro">{intro}</p>}
    </Reveal>
  );
}

/* ================= hero ================= */

export function Hero({ resume, isExample, onUpload }: { resume: Resume; isExample: boolean; onUpload: () => void }) {
  const [role, focus] = splitHeadline(resume.headline);
  const words = resume.name.split(/\s+/);
  const first = words.length > 1 ? words.slice(0, -1).join(' ') : words[0];
  const last = words.length > 1 ? words[words.length - 1] : '';
  const goal = resume.goals[1] || resume.goals[0];
  const chipIcons: IconName[] = ['users', 'monitor2', 'heart'];

  return (
    <section id="home" className="hero" aria-label="Introduction">
      <canvas className="hero__net" aria-hidden ref={useNetwork()} />
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="label hero__eyebrow">{focus || resume.tagline || 'Portfolio'}</p>
          <h1 className="hero__title" data-search>
            <span>{first}.</span>
            {last && <span>{last}.</span>}
            <span className="hero__blue">{role || resume.headline}.</span>
          </h1>
          <span className="hero__bar" aria-hidden />
          <p className="hero__intro">{resume.summary ? resume.summary.split(/(?<=[.!?])\s/)[0] : resume.tagline}</p>
          <div className="hero__actions">
            {isExample ? (
              <button className="pill pill--sm hero__btn" onClick={onUpload}>
                Upload your CV <Icon name="arrowRight" size={14} />
              </button>
            ) : (
              <a className="pill pill--sm hero__btn" href={resume.email ? `mailto:${resume.email}` : '#contact'}>
                Get in touch <Icon name="arrowRight" size={14} />
              </a>
            )}
            <a className="pill pill--sm pill--ghost hero__btn" href="#skills">
              Explore skills <Icon name="arrowRight" size={14} />
            </a>
          </div>
          <ul className="hero__chips">
            {resume.skills.slice(0, 3).map((s, i) => (
              <li key={s} style={{ ['--i' as string]: i }} data-search>
                <Icon name={chipIcons[i]} size={15} /> {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__visual">
          <div className="hero__photo" aria-hidden>
            <img src={hero} alt="" />
            <span className="hero__scan" />
          </div>
          {goal && (
            <GlowCard className="hero__card" accent="blue" speed={8} tilt={false}>
              <b>{goal.value}</b>
              <small>{goal.label}{goal.note ? ` · ${goal.note}` : ''}</small>
              <a href="#experience">
                <span>
                  <Icon name="play" size={10} />
                </span>
                View my journey
              </a>
            </GlowCard>
          )}
        </div>
      </div>
    </section>
  );
}

/** A slow constellation of light points and lines behind the hero, like the neural network in the design. */
function useNetwork() {
  const reduced = useReducedMotion();
  const [el, setEl] = useState<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pts = Array.from({ length: 46 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.00025, vy: (Math.random() - 0.5) * 0.00025 }));
    const draw = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (el.width !== w * dpr) {
        el.width = w * dpr;
        el.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (!reduced) {
          p.x = (p.x + p.vx + 1) % 1;
          p.y = (p.y + p.vy + 1) % 1;
        }
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot((a.x - b.x) * w, (a.y - b.y) * h);
          if (d < 130) {
            ctx.strokeStyle = `rgba(80, 150, 255, ${0.16 * (1 - d / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(120, 180, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(a.x * w, a.y * h, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [el, reduced]);
  return setEl;
}

/* ================= skills ("Comprehensive care") ================= */

const SKILL_ICONS: IconName[] = ['scan', 'eye', 'monitor2', 'glasses', 'drop', 'users', 'shield', 'clipboard', 'activity', 'heart'];

export function SkillsSection({ resume }: { resume: Resume }) {
  const [all, setAll] = useState(false);
  const skills = all ? resume.skills : resume.skills.slice(0, 6);
  const notes = [...resume.interests, ...resume.certifications, ...resume.projects.map((p) => p.title)];
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="wrap">
        <Head center label="My skills" id="skills-title" title="Comprehensive Clinical Skills" intro={resume.tagline} />
        <div className="skills">
          {skills.map((s, i) => (
            <Reveal key={s} delay={(i % 6) * 80} className="skills__cell">
              <GlowCard className="skill" accent={(['blue', 'teal', 'purple'] as Accent[])[i % 3]} phase={i * 0.17} speed={6 + (i % 4)} data-search>
                <span className="skill__icon">
                  <Icon name={SKILL_ICONS[i % SKILL_ICONS.length]} size={34} />
                </span>
                <b>{s}</b>
                <small>{notes[i % Math.max(notes.length, 1)] || 'Core skill'}</small>
                <a href="#projects" className="skill__more">
                  Learn more <Icon name="arrowRight" size={12} />
                </a>
              </GlowCard>
            </Reveal>
          ))}
        </div>
        {resume.skills.length > 6 && (
          <button className="more" onClick={() => setAll((a) => !a)}>
            {all ? 'Show fewer skills' : `View all ${resume.skills.length} skills`} <Icon name="arrowRight" size={13} />
          </button>
        )}
      </div>
    </section>
  );
}

/* ================= projects ("Technology that drives better outcomes") ================= */

const PROJECT_ICONS: IconName[] = ['scan', 'activity', 'eye', 'book', 'target', 'monitor2'];

export function ProjectsSection({ resume }: { resume: Resume }) {
  const [open, setOpen] = useState(0);
  const projects = resume.projects.slice(0, 4);
  const p = projects[open];
  return (
    <section id="projects" className="tech" aria-labelledby="tech-title">
      <div className="tech__photo" aria-hidden>
        <img src={tech} alt="" loading="lazy" />
        <span className="tech__pulse" />
      </div>
      <div className="tech__copy">
        <span className="label">My projects</span>
        <h2 id="tech-title" className="title">
          Work That Drives
          <br />
          Better Outcomes
        </h2>
        <p className="tech__desc" key={open} data-search>
          {p ? p.description || p.meta : 'Add projects to the CV to show them here.'}
        </p>
        <ul className="tech__list" role="tablist" aria-label="Projects">
          {projects.map((x, i) => (
            <li key={x.title}>
              <button role="tab" aria-selected={open === i} className={open === i ? 'is-on' : ''} onClick={() => setOpen(i)} onPointerEnter={() => setOpen(i)} data-search>
                <span className="tech__icon">
                  <Icon name={PROJECT_ICONS[i % PROJECT_ICONS.length]} size={16} />
                </span>
                <b>{x.title}</b>
                <small>{x.tags.slice(0, 2).join(', ') || x.meta}</small>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ================= about with counters and the reception photo ================= */

function Count({ icon, value, suffix = '', label, run, delay }: { icon: IconName; value: number; suffix?: string; label: string; run: boolean; delay: number }) {
  const n = useCountUp(value, run, { duration: 2200, delay });
  return (
    <li className="count">
      <span className="count__icon">
        <Icon name={icon} size={17} />
      </span>
      <span>
        <b aria-label={`${value}${suffix}`}>
          <span aria-hidden>
            {Math.round(n)}
            {suffix && <i className={n >= value * 0.98 ? 'is-on' : ''}>{suffix}</i>}
          </span>
        </b>
        <small>{label}</small>
      </span>
    </li>
  );
}

export function AboutSection({ resume, isExample, onDownloadCv }: { resume: Resume; isExample: boolean; onDownloadCv: () => void }) {
  const [ref, inView] = useInView<HTMLUListElement>(0.4);
  const [role, focus] = splitHeadline(resume.headline);
  const { stats } = resume;
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="about__copy">
        <span className="label">About me</span>
        <h2 id="about-title" className="title">
          Compassionate Care.
          <br />
          Clinical Excellence.
        </h2>
        <p data-search>{resume.summary || resume.tagline}</p>
        <ul className="counts" ref={ref}>
          <Count icon="award" value={stats.years} suffix={stats.yearsPlus ? '+' : ''} label="Years of experience" run={inView} delay={0} />
          <Count icon="folder" value={stats.projects} suffix={stats.projectsPlus ? '+' : ''} label="Projects" run={inView} delay={150} />
          <Count icon="activity" value={stats.skills} suffix="+" label="Core skills" run={inView} delay={300} />
          <Count icon="shield" value={resume.certifications.length + resume.achievements.length} label="Awards & certs" run={inView} delay={450} />
        </ul>
        <button className="pill pill--sm pill--ghost" onClick={onDownloadCv}>
          {isExample ? 'Download sample CV' : 'Download CV'} <Icon name="download" size={14} />
        </button>
      </div>
      <div className="about__photo" aria-hidden>
        <img src={reception} alt="" loading="lazy" />
        {/* the candidate's name glowing on the reception wall */}
        <div className="about__sign">
          <Logo size={30} />
          <b>{resume.name}</b>
          <small>{focus || role}</small>
        </div>
      </div>
    </section>
  );
}

/* ================= experience ("Meet our specialists") ================= */

export function ExperienceSection({ resume }: { resume: Resume }) {
  const reduced = useReducedMotion();
  const roles = resume.experience.slice(0, 5);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused || roles.length < 2) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % roles.length), 3000);
    return () => clearInterval(t);
  }, [reduced, paused, roles.length]);

  const r = roles[active];
  return (
    <section id="experience" className="section" aria-labelledby="exp-title" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="wrap">
        <Head center label="My experience" id="exp-title" title="Where I’ve Worked" intro="Each role built on the last — hover a card to see what it involved." />
        <div className="roles">
          {roles.map((x, i) => (
            <Reveal key={x.role + i} delay={i * 90} className="roles__cell">
              <GlowCard className={`role ${i === active ? 'is-current' : ''}`} accent={i === active ? 'teal' : 'blue'} active={i === active} phase={i * 0.25} speed={7} onPointerEnter={() => setActive(i)} data-search>
                <span className="role__badge">{initialsOf(x.company || x.role)}</span>
                <span className="role__text">
                  <b>{x.role}</b>
                  <small>{x.company}</small>
                  <em>{x.period}</em>
                </span>
              </GlowCard>
            </Reveal>
          ))}
          {!roles.length && <p className="empty">No experience section was found in the CV.</p>}
        </div>
        {r && r.bullets.length > 0 && (
          <ul className="role-detail" key={active} data-search>
            {r.bullets.slice(0, 3).map((b, i) => (
              <li key={i}>
                <Icon name="check" size={13} /> {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ================= achievements ("What our patients say") ================= */

export function ResultsSection({ resume }: { resume: Resume }) {
  const reduced = useReducedMotion();
  const items = [...resume.achievements.map((t) => ({ text: t, kind: 'Achievement' })), ...resume.certifications.map((t) => ({ text: t, kind: 'Certification' }))];
  const [start, setStart] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const shown = items.length <= 3 ? items : [0, 1, 2].map((k) => items[(start + k) % items.length]);
  const initials = initialsOf(resume.name);

  useEffect(() => {
    if (reduced || paused || items.length <= 3) return;
    const t = window.setInterval(() => setStart((s) => (s + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [reduced, paused, items.length]);

  return (
    <section id="results" className="section" aria-labelledby="results-title" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="wrap">
        <Head center label="Achievements" id="results-title" title="Milestones & Credentials" />
        <div className={`quotes ${inView ? 'is-on' : ''}`} ref={ref}>
          {items.length > 3 && (
            <button className="quotes__arrow" aria-label="Previous" onClick={() => setStart((s) => (s - 1 + items.length) % items.length)}>
              <Icon name="chevronLeft" size={16} />
            </button>
          )}
          {shown.map((it, i) => (
            <GlowCard key={it.text + start} className="quote" accent={i === 1 ? 'teal' : 'blue'} phase={i * 0.3} speed={8} data-search>
              <span className="stars" aria-hidden>
                {[0, 1, 2, 3, 4].map((s) => (
                  <Icon key={s} name="star" size={13} style={{ ['--s' as string]: s }} />
                ))}
              </span>
              <p>“{it.text}”</p>
              <footer>
                <span className="quote__avatar">{initials}</span>
                <span>
                  <b>{resume.name}</b>
                  <small>{it.kind}</small>
                </span>
              </footer>
            </GlowCard>
          ))}
          {items.length > 3 && (
            <button className="quotes__arrow" aria-label="Next" onClick={() => setStart((s) => (s + 1) % items.length)}>
              <Icon name="chevronRight" size={16} />
            </button>
          )}
          {!items.length && <p className="empty">Add Achievements or Certifications to the CV to show them here.</p>}
        </div>
      </div>
    </section>
  );
}

/* ================= contact band with a sunrise on the horizon ================= */

export function ContactBand({ resume }: { resume: Resume }) {
  const [ref, inView] = useInView<HTMLElement>(0.4);
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const subject = encodeURIComponent(`Hello from ${name || 'your portfolio'}${topic ? ` — ${topic}` : ''}`);
  const href = resume.email ? `mailto:${resume.email}?subject=${subject}` : '#home';
  return (
    <section id="contact" className={`contact ${inView ? 'is-up' : ''}`} ref={ref} aria-labelledby="contact-title">
      <div className="contact__sky" aria-hidden>
        <span className="contact__sun" />
        <span className="contact__horizon" />
      </div>
      <div className="wrap contact__inner">
        <span className="contact__icon" aria-hidden>
          <Icon name="calendar" size={30} />
        </span>
        <div className="contact__copy">
          <h2 id="contact-title">Let’s Talk About Your Team</h2>
          <p>{resume.goals[0] ? `Next up: ${resume.goals[0].value}.` : 'Open to new roles and collaborations.'}</p>
        </div>
        <form
          className="contact__form"
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = href;
          }}
        >
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-label="Your name" />
          <select value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Topic">
            <option value="">Select a topic</option>
            <option>A job opportunity</option>
            <option>A collaboration</option>
            <option>A question</option>
          </select>
          <button className="pill pill--sm" type="submit">
            Email me <Icon name="arrowRight" size={14} />
          </button>
        </form>
      </div>
    </section>
  );
}

/* ================= footer ================= */

export function Footer({ resume }: { resume: Resume }) {
  const [role] = splitHeadline(resume.headline);
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div>
          <span className="footer__brand">
            <Logo size={34} />
            <span>
              <b className="wordmark">{resume.name}</b>
              <small>{role}</small>
            </span>
          </span>
          <p className="footer__motto">{resume.motto || resume.tagline}</p>
          <nav className="footer__social" aria-label="Profiles">
            {resume.links.linkedin && (
              <a href={resume.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Icon name="linkedin" size={15} />
              </a>
            )}
            {resume.links.github && (
              <a href={resume.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <Icon name="github" size={15} />
              </a>
            )}
            {resume.email && (
              <a href={`mailto:${resume.email}`} aria-label="Email">
                <Icon name="mail" size={15} />
              </a>
            )}
          </nav>
        </div>
        <div>
          <h4>Quick links</h4>
          <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`}>{n.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Skills</h4>
          <ul>
            {resume.skills.slice(0, 6).map((s) => (
              <li key={s}>
                <a href="#skills">{s}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul className="footer__contact">
            {resume.phone && (
              <li>
                <Icon name="phone" size={14} /> {resume.phone}
              </li>
            )}
            {resume.email && (
              <li>
                <Icon name="mail" size={14} /> <a href={`mailto:${resume.email}`}>{resume.email}</a>
              </li>
            )}
            {resume.location && (
              <li>
                <Icon name="pin" size={14} /> {resume.location}
              </li>
            )}
          </ul>
        </div>
        <div>
          <h4>Next steps</h4>
          <ul className="footer__goals">
            {resume.goals.slice(0, 2).map((g) => (
              <li key={g.label}>
                <small>{g.label}</small>
                {g.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap footer__base">
        <span>
          © {new Date().getFullYear()} {resume.name}. Built from a CV.
        </span>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  );
}
