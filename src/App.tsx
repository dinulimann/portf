import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Braces,
  Check,
  CheckCheck,
  Code2,
  Database,
  Download,
  GitBranch,
  Github,
  GraduationCap,
  Layers3,
  Linkedin,
  Mail,
  Menu,
  Send,
  Server,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { profile, projects, stackGroups } from "./data";
import type { Project } from "./data";
import Scene from "./Scene";

const navigation = [
  ["about", "Tentang"],
  ["work", "Karya"],
  ["stack", "Keahlian"],
];

function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <div className="section-label mono">
      <span>{number}</span>
      <span className="label-line" />
      {children}
    </div>
  );
}

function Dialog({
  open,
  close,
  title,
  children,
}: {
  open: boolean;
  close: () => void;
  title: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    element?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className="detail-dialog"
      aria-label={title}
      onCancel={close}
      onClick={(event) => {
        if (event.target === dialog.current) close();
      }}
    >
      <div className="dialog-inner">
        <button
          className="icon-button dialog-close"
          onClick={close}
          aria-label="Tutup dialog"
          autoFocus
        >
          <X size={21} />
        </button>
        {children}
      </div>
    </dialog>
  );
}

function PayrollVisual() {
  return (
    <div className="payroll-visual" aria-hidden="true">
      <div className="preview-window">
        <div className="preview-toolbar">
          <div className="window-dots">
            <i />
            <i />
            <i />
          </div>
          <span className="mono">payroll.engine</span>
          <span className="preview-live">● System flow</span>
        </div>
        <div className="preview-content">
          <div className="preview-side">
            <Layers3 size={17} />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="preview-main">
            <div className="preview-heading">
              <span>Every detail. Accounted for.</span>
              <CheckCheck size={17} />
            </div>
            <div className="flow-row">
              <div>
                <Database size={16} />
                <span>Employee data</span>
              </div>
              <ArrowRight size={14} />
              <div>
                <Braces size={16} />
                <span>Payroll engine</span>
              </div>
              <ArrowRight size={14} />
              <div>
                <Check size={16} />
                <span>Validated</span>
              </div>
            </div>
            <div className="preview-bars">
              <div>
                <span>Penghasilan & potongan</span>
                <i style={{ "--bar-width": "88%" } as React.CSSProperties} />
                <Check size={12} />
              </div>
              <div>
                <span>Pajak & BPJS</span>
                <i style={{ "--bar-width": "68%" } as React.CSSProperties} />
                <Check size={12} />
              </div>
              <div>
                <span>Simulasi & finalisasi</span>
                <i style={{ "--bar-width": "79%" } as React.CSSProperties} />
                <Check size={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className="visual-caption mono">
        A SMALL VIEW OF A BIGGER SYSTEM
      </span>
    </div>
  );
}

function DataVisual() {
  return (
    <div className="data-visual" aria-hidden="true">
      <div className="data-orbit" />
      <div className="database-node">
        <Database size={43} strokeWidth={1.2} />
      </div>
      <span className="data-pill data-pill-one">
        <span className="status-dot" /> PostgreSQL
      </span>
      <span className="data-pill data-pill-two">
        <span className="oracle-dot" /> Oracle
      </span>
      <span className="data-pill data-pill-three">
        <Workflow size={13} /> Reporting
      </span>
      <svg className="data-lines" viewBox="0 0 400 260">
        <path d="M90 75 200 130 320 72M200 130 290 209M200 130 89 205" />
      </svg>
      <span className="visual-caption mono">
        STRUCTURE. CONNECT. MAKE SENSE.
      </span>
    </div>
  );
}

function ContactForm() {
  const [saved, setSaved] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name"));
    const email = String(data.get("email"));
    const message = String(data.get("message"));
    const body = `Halo Dinul,\n\n${message}\n\n${name}\n${email}`;
    if (profile.email) {
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`Mari berkolaborasi — ${name}`)}&body=${encodeURIComponent(body)}`;
      return;
    }
    const url = URL.createObjectURL(
      new Blob([body], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "brief-untuk-dinul.txt";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
  }
  return (
    <>
      <span className="eyebrow mono">
        <span className="status-dot" /> START A CONVERSATION
      </span>
      <h2>
        A good idea starts
        <br />
        with a <em>hello.</em>
      </h2>
      <p className="dialog-intro">
        {profile.email
          ? "Ceritakan sedikit tentang ide atau tantangan yang sedang kamu kerjakan."
          : "Susun ide proyekmu menjadi brief yang siap dibagikan. Kontak langsung akan ditambahkan segera."}
      </p>
      <form
        className="contact-form"
        onSubmit={submit}
        onChange={() => setSaved(false)}
      >
        <label>
          Nama
          <input
            name="name"
            autoComplete="name"
            placeholder="Nama kamu"
            required
            maxLength={100}
          />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="kamu@email.com"
            required
            maxLength={254}
          />
        </label>
        <label>
          Apa yang ingin kamu bangun?
          <textarea
            name="message"
            placeholder="Ceritakan ide, kebutuhan, atau tantanganmu…"
            required
            rows={4}
            maxLength={4000}
          />
        </label>
        <button className="button button-primary" type="submit">
          {profile.email ? "Lanjutkan ke email" : "Simpan brief proyek"}
          {profile.email ? <Send size={16} /> : <Download size={16} />}
        </button>
        <p className="form-note" role="status">
          {saved
            ? "Brief berhasil disimpan. Belum ada pesan yang dikirim."
            : profile.email
              ? "Pesan akan dibuka di aplikasi email untuk kamu kirim."
              : "Brief diunduh sebagai file .txt. Formulir ini tidak mengirim pesan."}
        </p>
      </form>
    </>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [stack, setStack] = useState("backend");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 760) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const activeStack = stackGroups.find((group) => group.id === stack)!;

  return (
    <>
      <a className="skip-link" href="#main">
        Langsung ke konten
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <a
            href="#home"
            className="brand"
            aria-label="Dinul Iman, kembali ke awal"
          >
            <span className="brand-symbol">
              <Code2 size={25} strokeWidth={2} />
            </span>
            <span>
              dinul<span className="brand-last">iman</span>
              <span className="brand-dot">.</span>
            </span>
          </a>
          <nav
            className={menuOpen ? "main-nav is-open" : "main-nav"}
            aria-label="Navigasi utama"
            id="main-navigation"
          >
            {navigation.map(([id, label]) => (
              <a
                href={`#${id}`}
                key={id}
                className={active === id ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
          <a className="header-contact" href="#contact">
            Let’s talk <ArrowUpRight size={16} />
          </a>
          <button
            className="menu-button icon-button"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero container" id="home">
          <div className="hero-content">
            <div className="eyebrow mono">
              <span className="status-dot" /> DEVELOPER. THINKER. BUILDER.
            </div>
            <p className="hero-intro">
              Halo, saya Dinul Iman{" "}
              <span className="wave" aria-hidden="true">
                ↗
              </span>
            </p>
            <h1>
              Complex logic.
              <br />
              Simple
              <br />
              <span className="hero-highlight">
                experiences<span className="accent-dot">.</span>
              </span>
            </h1>
            <p className="hero-description">
              Saya membangun sistem di balik layar—mengubah logika bisnis yang
              kompleks menjadi solusi yang andal, efisien, dan bermakna.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                Explore my work <ArrowUpRight size={18} />
              </a>
              <a className="button button-text" href="#about">
                Kenalan dulu <ArrowRight size={17} />
              </a>
            </div>
            <div className="hero-footnote">
              <span className="small-line" />
              <span className="mono">
                BACKEND ENGINEERING <span className="muted">×</span> PAYROLL /
                HRIS
              </span>
            </div>
          </div>
          <Scene />
          <div className="hero-bottom">
            <a href="#work" className="scroll-cue mono">
              <span>
                <ArrowDown size={15} />
              </span>
              SCROLL TO EXPLORE
            </a>
            <span className="hero-location mono">
              BASED IN INDONESIA <span>GMT+7</span>
            </span>
          </div>
        </section>

        <div className="tech-strip">
          <div className="container tech-strip-inner">
            <span className="mono strip-label">PART OF MY TOOLKIT</span>
            <div>
              <Code2 />
              <span>PHP</span>
            </div>
            <div>
              <Layers3 />
              <span>Laravel</span>
            </div>
            <div>
              <Database />
              <span>PostgreSQL</span>
            </div>
            <div>
              <Braces />
              <span>TypeScript</span>
            </div>
            <div>
              <Server />
              <span>Docker</span>
            </div>
            <div>
              <GitBranch />
              <span>Git</span>
            </div>
          </div>
        </div>

        <section className="section container work-section" id="work">
          <SectionLabel number="01">SELECTED WORK & EXPLORATIONS</SectionLabel>
          <div className="section-heading">
            <h2>
              Built with logic.
              <br />
              <span className="text-muted">Made for people.</span>
            </h2>
            <p>
              Di balik setiap sistem, ada masalah nyata
              <br className="desktop-break" /> yang layak diselesaikan dengan
              baik.
            </p>
          </div>
          <div className="project-grid">
            {projects.slice(0, 2).map((project) => (
              <article
                className={`project-card project-${project.id}`}
                key={project.id}
              >
                {project.id === "payroll" ? <PayrollVisual /> : <DataVisual />}
                <div className="project-info">
                  <div className="project-eyebrow mono">
                    <span>{project.category}</span>
                    <span>/{project.number}</span>
                  </div>
                  <div className="project-title-row">
                    <h3>{project.title}</h3>
                    <button
                      className="project-open"
                      aria-label={`Lihat detail ${project.title}`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <ArrowUpRight size={24} />
                    </button>
                  </div>
                  <p>{project.subtitle}</p>
                  <div className="tag-list">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
            <article className="project-card project-ai">
              <div className="ai-visual" aria-hidden="true">
                <div className="ai-symbol">
                  <Sparkles size={31} strokeWidth={1.2} />
                </div>
                <div className="ai-code mono">
                  <span>
                    <i>~</i> developer.workflow
                  </span>
                  <span>
                    <b>+</b> context & curiosity
                  </span>
                  <span>
                    <b>→</b> build. review. iterate.
                    <i className="code-cursor" />
                  </span>
                </div>
              </div>
              <div className="project-info">
                <div className="project-eyebrow mono">
                  <span>CURRENTLY EXPLORING</span>
                  <span>/03</span>
                </div>
                <div className="project-title-row">
                  <h3>{projects[2].title}</h3>
                  <button
                    className="project-open"
                    aria-label={`Lihat detail ${projects[2].title}`}
                    onClick={() => setSelectedProject(projects[2])}
                  >
                    <ArrowUpRight size={24} />
                  </button>
                </div>
                <p>{projects[2].subtitle}</p>
                <div className="tag-list">
                  {projects[2].tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          </div>
          <p className="work-note mono">
            <span className="status-dot" /> REAL EXPERIENCE. CONTINUOUS
            EXPLORATION.
          </p>
        </section>

        <section className="about-section" id="about">
          <div className="container about-layout">
            <div className="about-left">
              <SectionLabel number="02">A LITTLE ABOUT ME</SectionLabel>
              <h2>
                Curious mind.
                <br />
                <span className="text-muted">Engineering heart.</span>
              </h2>
              <div className="identity-art" aria-hidden="true">
                <span className="identity-initials">
                  di<span>.</span>
                </span>
                <div className="identity-tag mono">
                  <span className="status-dot" /> ALWAYS A WORK IN PROGRESS
                </div>
              </div>
            </div>
            <div className="about-copy">
              <p className="about-lead">
                Saya menikmati proses memahami{" "}
                <span>bagaimana sesuatu bekerja</span>—lalu membuatnya bekerja
                lebih baik.
              </p>
              <p>
                Lulusan S1 Teknologi Informasi Universitas Sumatera Utara. Kini,
                saya bekerja sebagai Developer di{" "}
                <strong>PT Solusi Integrasi Utama</strong>, dengan banyak
                keterlibatan di proyek Payroll PELNI.
              </p>
              <p>
                Keseharian saya bertemu dengan backend, database, debugging, dan
                aturan bisnis payroll. Buat saya, kode yang baik berawal dari
                pemahaman yang baik terhadap masalahnya.
              </p>
              <div className="experience-list">
                <div>
                  <span className="experience-icon">
                    <Code2 size={20} />
                  </span>
                  <div>
                    <span className="mono small-label">CURRENT CHAPTER</span>
                    <h3>Developer</h3>
                    <p>PT Solusi Integrasi Utama · Payroll PELNI</p>
                  </div>
                  <span className="current-badge mono">NOW</span>
                </div>
                <div>
                  <span className="experience-icon">
                    <GraduationCap size={21} />
                  </span>
                  <div>
                    <span className="mono small-label">THE FOUNDATION</span>
                    <h3>S1 Teknologi Informasi</h3>
                    <p>Universitas Sumatera Utara · IPK ±3,5</p>
                  </div>
                </div>
              </div>
              <div className="about-extra">
                <span className="mono small-label">BEYOND THE CLASSROOM</span>
                <p>
                  Asisten Database Systems & Data Structures and Algorithms.
                  Bertumbuh bersama HIMATIF, Software Research Club, dan
                  kepanitiaan ITFest.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section container stack-section" id="stack">
          <SectionLabel number="03">THE TOOLS BEHIND THE WORK</SectionLabel>
          <div className="section-heading">
            <h2>
              My everyday
              <br />
              <span className="text-muted">building blocks.</span>
            </h2>
            <p>
              Teknologi yang saya gunakan dan eksplorasi.
              <br className="desktop-break" /> Selalu ada hal baru untuk
              dipelajari.
            </p>
          </div>
          <div className="stack-layout">
            <div
              className="stack-tabs"
              role="tablist"
              aria-label="Kategori keahlian"
              aria-orientation="vertical"
            >
              {stackGroups.map((group, index) => (
                <button
                  key={group.id}
                  id={`tab-${group.id}`}
                  role="tab"
                  aria-selected={stack === group.id}
                  aria-controls="stack-panel"
                  tabIndex={stack === group.id ? 0 : -1}
                  className={
                    stack === group.id ? "stack-tab selected" : "stack-tab"
                  }
                  onClick={() => setStack(group.id)}
                  onKeyDown={(event) => {
                    let next: number | undefined;
                    if (event.key === "ArrowDown" || event.key === "ArrowRight")
                      next = (index + 1) % stackGroups.length;
                    if (event.key === "ArrowUp" || event.key === "ArrowLeft")
                      next =
                        (index + stackGroups.length - 1) % stackGroups.length;
                    if (event.key === "Home") next = 0;
                    if (event.key === "End") next = stackGroups.length - 1;
                    if (next !== undefined) {
                      event.preventDefault();
                      setStack(stackGroups[next].id);
                      document
                        .getElementById(`tab-${stackGroups[next].id}`)
                        ?.focus();
                    }
                  }}
                >
                  <span className="mono">0{index + 1}</span>
                  {group.label}
                  <ArrowUpRight size={18} />
                </button>
              ))}
            </div>
            <div
              className="stack-panel"
              id="stack-panel"
              role="tabpanel"
              aria-labelledby={`tab-${stack}`}
              tabIndex={0}
            >
              <p>{activeStack.caption}</p>
              <div className="technology-list">
                {activeStack.technologies.map((technology, index) => (
                  <span className="technology" key={technology}>
                    <span className="technology-icon mono">
                      {["{ }", "</>", "[ ]", "#"][index % 4]}
                    </span>
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="domain-note">
            <span className="domain-symbol">
              <Workflow size={23} />
            </span>
            <p>
              <strong>More than a tech stack.</strong> Memahami domain
              payroll/HRIS—dari PPh 21 dan BPJS hingga simulasi
              penggajian—membantu saya melihat gambaran sistem secara utuh.
            </p>
            <ArrowDownRight size={26} />
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="container">
            <div className="contact-top">
              <SectionLabel number="04">WHAT’S NEXT?</SectionLabel>
              <span className="mono contact-sidenote">
                GOOD THINGS START WITH A CONVERSATION.
              </span>
            </div>
            <div className="contact-content">
              <div>
                <h2>
                  Have something
                  <br />
                  in <span>mind?</span>
                </h2>
                <p>
                  Mari bertukar ide, membahas tantangan,
                  <br />
                  atau membangun sesuatu yang berarti.
                </p>
              </div>
              <button
                className="contact-circle"
                onClick={() => setContactOpen(true)}
                aria-label="Mulai percakapan"
              >
                <ArrowUpRight size={49} strokeWidth={1.3} />
                <span>LET’S TALK</span>
              </button>
            </div>
            <div className="contact-bottom">
              <span className="mono">
                A LITTLE CURIOSITY CAN GO A LONG WAY.
              </span>
              <div className="social-links">
                {profile.email && (
                  <a href={`mailto:${profile.email}`}>
                    <Mail size={16} />
                    Email
                    <ArrowUpRight size={13} />
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer">
                    <Github size={16} />
                    GitHub
                    <ArrowUpRight size={13} />
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer">
                    <Linkedin size={16} />
                    LinkedIn
                    <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer container">
        <a href="#home" className="brand">
          <span>
            dinul<span className="brand-last">iman</span>
            <span className="brand-dot">.</span>
          </span>
        </a>
        <span className="footer-copyright">
          © {new Date().getFullYear()} Dinul Iman. Built with intention.
        </span>
        <a className="back-top mono" href="#home">
          BACK TO TOP <ArrowUp size={14} />
        </a>
      </footer>

      <Dialog
        open={!!selectedProject}
        close={() => setSelectedProject(null)}
        title={selectedProject?.title || "Detail karya"}
      >
        {selectedProject && (
          <>
            <span className="eyebrow mono">
              <span className="status-dot" />
              {selectedProject.category}
            </span>
            <h2>{selectedProject.title}</h2>
            <span className="dialog-role mono">{selectedProject.role}</span>
            <p className="dialog-intro">{selectedProject.description}</p>
            <div className="project-details">
              {selectedProject.details.map(([title, description], index) => (
                <div key={title}>
                  <span className="mono">0{index + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="tag-list">
              {selectedProject.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <p className="project-disclaimer">{selectedProject.note}</p>
            <button
              className="button button-text dialog-return"
              onClick={() => setSelectedProject(null)}
            >
              Kembali ke portofolio <ArrowRight size={17} />
            </button>
          </>
        )}
      </Dialog>
      <Dialog
        open={contactOpen}
        close={() => setContactOpen(false)}
        title="Mulai percakapan dengan Dinul Iman"
      >
        {contactOpen && <ContactForm />}
      </Dialog>
    </>
  );
}
