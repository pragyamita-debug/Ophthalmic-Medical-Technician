import { useScrollSpy } from '../hooks/useScrollSpy';
import type { StoredProfile } from '../lib/types';
import { NAV, NavBar } from './NavBar';
import { AboutSection, ContactBand, ExperienceSection, Footer, Hero, ProjectsSection, ResultsSection, SkillsSection, splitHeadline } from './Sections';
import './Dashboard.css';

const IDS = NAV.map((n) => n.id);

interface Props {
  profile: StoredProfile;
  isExample: boolean;
  onUploadNew: () => void;
  onEdit: () => void;
  onReset: () => void;
  onDownloadCv: () => void;
}

export function Dashboard({ profile, isExample, onUploadNew, onEdit, onReset, onDownloadCv }: Props) {
  const { resume } = profile;
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
        isExample={isExample}
        onUploadNew={onUploadNew}
        onEdit={onEdit}
        onDownloadCv={onDownloadCv}
        onReset={onReset}
      />
      <main>
        <Hero resume={resume} isExample={isExample} onUpload={onUploadNew} />
        <SkillsSection resume={resume} />
        <ProjectsSection resume={resume} />
        <AboutSection resume={resume} isExample={isExample} onDownloadCv={onDownloadCv} />
        <ExperienceSection resume={resume} />
        <ResultsSection resume={resume} />
        <ContactBand resume={resume} />
      </main>
      <Footer resume={resume} />
    </>
  );
}
