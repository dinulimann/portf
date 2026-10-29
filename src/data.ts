export const profile = {
  name: "Dinul Iman",
  role: "Developer",
  company: "PT Solusi Integrasi Utama",
  email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || "",
  github:
    import.meta.env.VITE_GITHUB_URL?.trim() || "https://github.com/dinulimann",
  linkedin: import.meta.env.VITE_LINKEDIN_URL?.trim() || "",
  splineScene:
    import.meta.env.VITE_SPLINE_SCENE_URL?.trim() ||
    "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode",
};

export const projects = [
  {
    id: "payroll",
    number: "01",
    category: "PROFESSIONAL WORK",
    title: "Payroll PELNI",
    subtitle: "Logika yang kompleks. Perhitungan yang presisi.",
    description:
      "Terlibat dalam pengembangan sistem payroll di PT Solusi Integrasi Utama: menghubungkan data kepegawaian, aturan penghasilan, perpajakan, dan proses penggajian.",
    tags: ["Backend", "Payroll / HRIS", "Business Logic"],
    role: "Developer · PT Solusi Integrasi Utama",
    details: [
      [
        "Payroll & pajak",
        "Menangani logika PPh 21 TER dan progresif, PTKP, biaya jabatan, BPJS, serta opening balance pajak.",
      ],
      [
        "Data kepegawaian",
        "Mengolah keterkaitan absensi, prorate, mutasi pegawai, dan komponen penghasilan maupun potongan.",
      ],
      [
        "Proses penggajian",
        "Terlibat dalam alur simulasi dan final payroll, debugging, serta pemeriksaan konsistensi hasil perhitungan.",
      ],
    ],
    note: "Ringkasan kontribusi profesional. Visual merupakan ilustrasi konseptual, bukan tampilan atau data internal perusahaan.",
  },
  {
    id: "database",
    number: "02",
    category: "ENGINEERING FOCUS",
    title: "Data, connected.",
    subtitle: "Dari database ke keputusan yang lebih jelas.",
    description:
      "Area pekerjaan sehari-hari yang meliputi database, performance, reporting, dan deployment untuk mendukung kebutuhan operasional.",
    tags: ["PostgreSQL", "Oracle", "Reporting"],
    role: "Area kontribusi · Backend & Database",
    details: [
      [
        "Database & performance",
        "Menelusuri aliran data dan query, melakukan debugging, serta menangani kebutuhan performa pada aplikasi.",
      ],
      [
        "Reporting",
        "Bekerja dengan kebutuhan laporan menggunakan JasperReports dan Crystal Reports.",
      ],
      [
        "Deployment",
        "Terlibat dalam proses deployment dan penggunaan Git/GitLab serta Docker dalam alur pengembangan.",
      ],
    ],
    note: "Bagian ini merangkum area pengalaman, bukan proyek terpisah atau klaim metrik performa.",
  },
  {
    id: "ai",
    number: "03",
    category: "CURRENTLY EXPLORING",
    title: "A better way to build.",
    subtitle: "Eksplorasi AI dalam workflow developer.",
    description:
      "Mengeksplorasi bagaimana AI coding tools, agent, dan skills dapat membantu proses memahami codebase, implementasi, dan debugging di VS Code.",
    tags: ["Claude Code", "Codex", "Agents & Skills"],
    role: "Eksplorasi mandiri · Developer tooling",
    details: [
      [
        "AI coding tools",
        "Mempelajari Claude Code dan Codex sebagai pendamping dalam pekerjaan pengembangan perangkat lunak.",
      ],
      [
        "Agents & skills",
        "Mengeksplorasi instruksi, konteks, dan alur kerja agent agar bantuan AI lebih sesuai dengan kebutuhan proyek.",
      ],
      [
        "Editor workflow",
        "Mencoba integrasi tools tersebut dengan VS Code, dengan tetap meninjau kode dan hasil implementasi.",
      ],
    ],
    note: "Eksplorasi yang sedang berjalan; bukan produk yang telah dirilis.",
  },
];

export type Project = (typeof projects)[number];

export const stackGroups = [
  {
    id: "backend",
    label: "Backend & languages",
    caption: "Menerjemahkan kebutuhan menjadi logika.",
    technologies: [
      "PHP",
      "CodeIgniter",
      "Laravel",
      "JavaScript",
      "TypeScript",
      "Node.js",
      "Express",
      "NestJS",
      "Go",
      "Python",
    ],
  },
  {
    id: "data",
    label: "Data & reporting",
    caption: "Data yang terstruktur, informasi yang berguna.",
    technologies: [
      "PostgreSQL",
      "Oracle",
      "Redis",
      "JasperReports",
      "Crystal Reports",
    ],
  },
  {
    id: "workflow",
    label: "Tools & workflow",
    caption: "Membangun, menelusuri, dan terus belajar.",
    technologies: [
      "Docker",
      "Git",
      "GitLab",
      "VS Code",
      "Postman",
      "Claude Code",
      "Codex",
      "Agents & Skills",
    ],
  },
];
