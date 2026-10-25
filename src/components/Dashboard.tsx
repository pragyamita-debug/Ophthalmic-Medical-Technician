import { useScrollSpy } from '../hooks/useScrollSpy';
import type { Resume } from '../lib/types';
import { NAV, NavBar } from './NavBar';
import { AboutSection, ContactBand, ExperienceSection, Footer, Hero, ProjectsSection, ResultsSection, SkillsSection, splitHeadline } from './Sections';
import './Dashboard.css';

const IDS = NAV.map((n) => n.id);

export function Dashboard({ resume }: { resume: Resume }) {
  const active = useScrollSpy(IDS, 140);
  const [role] = splitHeadline(resume.headline);

  return (
    <>
      <NavBar
        name={resume.name}
        tagline={role || resume.headline}
        email={resume.email}
        goals={resume.goals}
        active={active}
      />
      <main>
        <Hero resume={resume} />
        <SkillsSection resume={resume} />
        <ProjectsSection resume={resume} />
        <AboutSection resume={resume} />
        <ExperienceSection resume={resume} />
        <ResultsSection resume={resume} />
        <ContactBand resume={resume} />
      </main>
      <Footer resume={resume} />
    </>
  );
}
