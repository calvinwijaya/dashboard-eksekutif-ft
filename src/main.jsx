import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight, BarChart3, ChevronDown, ChevronLeft, ChevronRight,
  GraduationCap, HeartPulse, Home, LayoutDashboard, LogOut,
  Menu, X, Microscope, Network, Settings, Users,
  Factory, Building2, Rocket, Coins
} from "lucide-react";
import "./styles.css";
import CommunityPage from "./CommunityPage";
import WelfarePage from "./WelfarePage";
import TeachingPage from "./TeachingPage";
import ResearchPage from "./ResearchPage";

const PROFESSOR = "Prof. Ir. Trias Aditya K.M., S.T., M.Sc., Ph.D., IPU., ASEAN Eng.";

const modules = [
  {
    id: "research",
    number: "01",
    title: "Penelitian & Riset",
    short: "Research Intelligence",
    description:
      "Katalog riset, portofolio KBK, kolaborasi lintas departemen, dan peluang pengembangan riset strategis.",
    icon: Microscope,
    tone: "blue",
    metrics: ["1,248 Riset", "326 Aktif", "94 Multi-KBK"],
  },
  {
    id: "community",
    number: "02",
    title: "Pengabdian kepada Masyarakat",
    short: "Community Impact",
    description:
      "Pemantauan program pengabdian, mitra, wilayah, keterlibatan departemen, serta dampak dan keberlanjutan.",
    icon: Users,
    tone: "green",
    metrics: ["186 Program", "72 Mitra", "34 Wilayah"],
  },
  {
    id: "teaching",
    number: "03",
    title: "Pengajaran",
    short: "Academic Intelligence",
    description:
      "Analitik akademik, program studi, mahasiswa, kurikulum, beban pengajaran, dan capaian pembelajaran.",
    icon: GraduationCap,
    tone: "gold",
    metrics: ["29 Prodi", "8,420 Mahasiswa", "365 Dosen"],
  },
  {
    id: "welfare",
    number: "04",
    title: "Kesejahteraan",
    short: "People & Wellbeing",
    description:
      "Indikator kesejahteraan sivitas akademika, pengembangan SDM, fasilitas, dan lingkungan kerja.",
    icon: HeartPulse,
    tone: "purple",
    metrics: ["365 Dosen", "322 Tendik", "24 Fasilitas"],
  },
];

const sdgs = [
  { id: 4, label: "Quality Education", value: 82 },
  { id: 5, label: "Gender Equality", value: 66 },
  { id: 7, label: "Affordable & Clean Energy", value: 71 },
  { id: 9, label: "Industry, Innovation & Infrastructure", value: 88 },
  { id: 11, label: "Sustainable Cities", value: 79 },
  { id: 13, label: "Climate Action", value: 74 },
  { id: 17, label: "Partnerships for the Goals", value: 91 },
];

const gesi = [
  { label: "Gender representation", value: 58 },
  { label: "Accessibility & disability inclusion", value: 76 },
  { label: "Inclusive learning environment", value: 84 },
  { label: "Staff development access", value: 69 },
];

const strategicPillars = [
  { id: "education", number: "01", title: "Pendidikan Transformatif", english: "Transformative Education", description: "Pembelajaran adaptif, kurikulum relevan, dan penguatan kompetensi lulusan untuk menghadapi perubahan teknologi dan kebutuhan industri." },
  { id: "research", number: "02", title: "Riset Berdampak", english: "Impactful Research", description: "Riset unggul yang menghasilkan pengetahuan, inovasi, teknologi, dan solusi yang memberi dampak nyata bagi masyarakat dan industri." },
  { id: "community", number: "03", title: "Pengabdian Solutif", english: "Solution-Oriented Engagement", description: "Pengabdian yang berbasis kebutuhan, terukur dampaknya, dan berkelanjutan melalui kemitraan dengan masyarakat serta pemangku kepentingan." },
  { id: "global", number: "04", title: "Keterlibatan Global", english: "Global Engagement", description: "Perluasan jejaring internasional melalui kolaborasi akademik, mobilitas, joint research, partnership, dan pengakuan global." },
  { id: "governance", number: "05", title: "Tata Kelola Lincah", english: "Agile Governance", description: "Pengambilan keputusan berbasis data, proses yang adaptif, transparan, dan terintegrasi untuk meningkatkan responsivitas organisasi." },
];

const pentahelixData = [
  { id: "dudi", label: "Dunia Usaha & Industri", icon: Factory, color: "#d97706", desc: "Kemitraan strategis, hilirisasi produk, dan pendanaan riset industri.", metrics: [ { value: "120+", title: "Mitra Aktif" }, { value: "Rp 85 M", title: "Pendanaan Industri" } ] },
  { id: "gov", label: "Regulator / Pemerintah", icon: Building2, color: "#059669", desc: "Perumusan kebijakan, standar nasional, dan proyek strategis pemerintah.", metrics: [ { value: "25", title: "Policy Briefs" }, { value: "18", title: "Proyek Nasional" } ] },
  { id: "pt", label: "Perguruan Tinggi", icon: GraduationCap, color: "#2563eb", desc: "Kolaborasi akademik lintas benua, joint research, dan pertukaran pakar.", metrics: [ { value: "15", title: "Joint Degrees" }, { value: "45", title: "Visiting Scholars" } ] },
  { id: "com", label: "Masyarakat Umum", icon: Users, color: "#4f46e5", desc: "Pemberdayaan desa, aplikasi teknologi tepat guna, dan komuniversitas.", metrics: [ { value: "14", title: "Desa Binaan" }, { value: "12.5K", title: "Penerima Manfaat" } ] },
  { id: "exp", label: "Expert & Media", icon: Network, color: "#be123c", desc: "Diseminasi publik, sertifikasi keahlian, dan advokasi media massa.", metrics: [ { value: "85", title: "Sertifikasi Profesi" }, { value: "40+", title: "Opini Publik" } ] }
];


function AssetImage({ src, alt, className, fallback }) {
  const [failed, setFailed] = useState(false);
  if (failed) return fallback;
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

function Sidebar({ active, setActive, collapsed, setCollapsed, mobileOpen, onClose }) {
  const items = [
    { id: "home", label: "Executive Overview", icon: Home },
    { id: "research", label: "Penelitian & Riset", icon: Microscope },
    { id: "community", label: "Pengabdian", icon: Users },
    { id: "teaching", label: "Pengajaran", icon: GraduationCap },
    { id: "welfare", label: "Kesejahteraan", icon: HeartPulse },
  ];

  return (
    <>
      {mobileOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <AssetImage
            src="/logo_ugm.png"
            alt="Universitas Gadjah Mada"
            className="ugm-logo"
            fallback={<div className="ugm-mark">UGM</div>}
          />
          <div className="brand-text">
            <strong>UNIVERSITAS<br />GADJAH MADA</strong>
            <span>FAKULTAS TEKNIK</span>
          </div>
          <button className="sidebar-close icon-button" onClick={onClose} aria-label="Tutup menu"><X size={18} /></button>
        </div>

        <div className="watermark">FT<br />UGM</div>

        <button className="collapse-button" onClick={() => setCollapsed(!collapsed)} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          <span>{collapsed ? "Expand" : "Collapse"} menu</span>
        </button>

        <nav className="nav">
          <div className="nav-label">EXECUTIVE MENU</div>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${active === item.id ? "active" : ""}`}
                onClick={() => { setActive(item.id); onClose(); }}
                title={collapsed ? item.label : ""}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" title={collapsed ? "System Settings" : ""}>
            <Settings size={18} />
            <span>System Settings</span>
          </button>
          <div className="version">Executive Dashboard v0.2</div>
        </div>
      </aside>
    </>
  );
}

function Header({ onMenu, collapsed, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Buka menu">
          <Menu size={21} />
        </button>
        <div className="title-group">
          <div className="eyebrow">FAKULTAS TEKNIK UNIVERSITAS GADJAH MADA</div>
          <h1>Executive Data Analytics</h1>
          <div className="subtitle">One Gate for Strategic Decision Making</div>
        </div>
      </div>

      <div className="profile-area">
        <AssetImage
          src="/foto_prof_trias3.png"
          alt={PROFESSOR}
          className="profile-avatar-photo"
          fallback={<div className="profile-avatar">TA</div>}
        />
        <div className="profile-copy">
          <strong>{PROFESSOR}</strong>
          <span>Fakultas Teknik</span>
        </div>
        <ChevronDown size={17} className="muted" />
        <div className="header-divider" />
        
        {/* Tombol memanggil onLogout secara langsung */}
        <button className="logout-button" onClick={onLogout}>
          <LogOut size={17} /><span>Logout</span>
        </button>
      </div>
    </header>
  );
}

function ExecutiveHome({ onOpen }) {
  const [selectedSdg, setSelectedSdg] = useState(sdgs[3]);
  const [selectedGesi, setSelectedGesi] = useState(null);
  const [selectedPillar, setSelectedPillar] = useState(strategicPillars[0]);
  const [activeHelix, setActiveHelix] = useState(pentahelixData[0]);

  return (
    <main className="main-content">
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="status-dot" /> EXECUTIVE OVERVIEW</div>
          <h2>Selamat datang,<br /><span>Prof. Trias Aditya</span></h2>
          <p>
            Satu pintu untuk melihat kinerja, portofolio, keterhubungan,
            dan indikator strategis Fakultas Teknik secara terintegrasi.
          </p>
        </div>
        <div className="hero-visual">
          <div className="grid-orb orb-one" />
          <div className="grid-orb orb-two" />
          <Network size={88} strokeWidth={1.15} />
          <div className="visual-caption">
            <strong>ONE GATE</strong>
            <span>Data → Insight → Decision</span>
          </div>
        </div>
      </section>

      <section className="overview-strip">
        <div className="system-status">
            <span className="status-dot"></span>
            <span>System Online</span>
            <span>Last updated: 10 August 2026</span>
        </div>
        <div><span>DATA SOURCES</span><strong>Integrated Faculty Systems</strong></div>
        <div><span>ACTIVE DOMAINS</span><strong>04 Strategic Domains</strong></div>
      </section>

      <section className="section-heading">
        <div>
          <div className="eyebrow">STRATEGIC DOMAINS</div>
          <h3>Empat pintu utama analitik Fakultas</h3>
        </div>
        <p>Pilih domain untuk masuk ke dashboard analitik yang lebih detail.</p>
      </section>

      <section className="module-grid">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <button key={module.id} className={`module-card ${module.tone}`} onClick={() => onOpen(module.id)}>
              <div className="card-top">
                <span className="card-number">{module.number}</span>
                <div className="card-icon"><Icon size={28} strokeWidth={1.8} /></div>
              </div>
              <div className="card-content">
                <div className="card-kicker">{module.short}</div>
                <h4>{module.title}</h4>
                <p>{module.description}</p>
              </div>
              <div className="card-metrics">
                {module.metrics.map((metric) => <span key={metric}>{metric}</span>)}
              </div>
              <div className="card-action"><span>Lihat Dashboard</span><ArrowRight size={19} /></div>
            </button>
          );
        })}
      </section>

      {/* =====================================================
          INNOVATION ECOSYSTEM (PENTAHELIX & REKA VENTURA)
      ===================================================== */}
      {/* =====================================================
          INNOVATION ECOSYSTEM (PENTAHELIX & REKA VENTURA)
      ===================================================== */}
      <section className="innovation-grid" style={{ marginTop: "40px" }}>
        
        {/* PENTAHELIX */}
        <div className="panel pentahelix-panel">
          <div className="panel-heading" style={{ marginBottom: 24 }}>
            <div>
              <div className="eyebrow">COLLABORATION ECOSYSTEM</div>
              <h3>Sinergi Pentahelix</h3>
            </div>
            <span className="panel-chip">Interactive</span>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
            {/* Grafik Segi Lima Interaktif */}
            <div className="penta-container">
              {/* Gambar Jaring/Garis Penghubung Segi Lima */}
              <svg viewBox="0 0 200 200" className="penta-lines">
                <polygon points="100,10 190,75 155,180 45,180 10,75" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
                <line x1="100" y1="100" x2="100" y2="10" stroke="#cbd5e1" strokeWidth="2"/>
                <line x1="100" y1="100" x2="190" y2="75" stroke="#cbd5e1" strokeWidth="2"/>
                <line x1="100" y1="100" x2="155" y2="180" stroke="#cbd5e1" strokeWidth="2"/>
                <line x1="100" y1="100" x2="45" y2="180" stroke="#cbd5e1" strokeWidth="2"/>
                <line x1="100" y1="100" x2="10" y2="75" stroke="#cbd5e1" strokeWidth="2"/>
                <circle cx="100" cy="100" r="6" fill="#94a3b8" />
              </svg>

              {/* Tombol-tombol Pilar */}
              {pentahelixData.map((helix, idx) => {
                const Icon = helix.icon;
                const isActive = activeHelix.id === helix.id;
                return (
                  <button 
                    key={helix.id} 
                    className={`penta-node node-${idx + 1} ${isActive ? "active" : ""}`}
                    style={{ borderColor: isActive ? helix.color : "transparent", color: isActive ? helix.color : "#475569" }}
                    onClick={() => setActiveHelix(helix)}
                  >
                    <Icon size={18} />
                    <span>{helix.id.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>

            {/* Konten Indikator Pentahelix */}
            <div className="helix-content" style={{ borderLeft: `4px solid ${activeHelix.color}`, background: "#f8fafc", padding: "16px 20px", borderRadius: 12 }}>
              <strong style={{ fontSize: 16, color: "#102a43", display: "block", marginBottom: 6 }}>
                {activeHelix.label}
              </strong>
              <p style={{ color: "#475569", fontSize: 13, marginBottom: 18, lineHeight: 1.5 }}>
                {activeHelix.desc}
              </p>
              <div style={{ display: "grid", gap: 14 }}>
                {activeHelix.metrics.map((metric, idx) => (
                  <div key={idx} style={{ background: "#fff", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: activeHelix.color }}>{metric.value}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>
                      {metric.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* REKA VENTURA */}
        <div className="panel rekaventura-panel">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.15)", borderRadius: 12, display: "grid", placeItems: "center" }}>
              <Rocket size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: "#93c5fd" }}>INNOVATION HUB</div>
              <h3 style={{ margin: 0, fontSize: 18, color: "#fff" }}>Reka Ventura</h3>
            </div>
          </div>
          
          <p style={{ color: "#bfdbfe", fontSize: 12, lineHeight: 1.5, marginBottom: 20 }}>
            Hilirisasi riset dan pembentukan perusahaan rintisan (spin-off) berbasis teknologi Fakultas.
          </p>

          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ background: "rgba(255,255,255,0.1)", padding: 14, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#60a5fa", fontSize: 12, fontWeight: 700, marginBottom: 4 }}><Coins size={14}/> Dana Hilirisasi Riset</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>Rp 42.5 Miliar</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "rgba(255,255,255,0.1)", padding: 14, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>12</div>
                <div style={{ fontSize: 11, color: "#bfdbfe", marginTop: 4 }}>Startup / Spin-off</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", padding: 14, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>8</div>
                <div style={{ fontSize: 11, color: "#bfdbfe", marginTop: 4 }}>Lisensi Industri</div>
              </div>
            </div>
          </div>
        </div>

      </section>

      <section className="analytics-grid">
        <div className="panel sdg-panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">SUSTAINABLE DEVELOPMENT GOALS</div>
              <h3>Indikator Capaian SDGs</h3>
            </div>
            <span className="panel-chip">Dummy dataset</span>
          </div>

          <div className="sdg-layout">
            <div className="bar-chart">
              {sdgs.map((item) => (
                <button
                  key={item.id}
                  className={`bar-row ${selectedSdg.id === item.id ? "selected" : ""}`}
                  onClick={() => setSelectedSdg(item)}
                  title={`SDG ${item.id}: ${item.label}`}
                >
                  <div className="bar-label">
                    <strong>SDG {item.id}</strong>
                    <span>{item.label}</span>
                  </div>
                  <div className="bar-track"><span style={{ width: `${item.value}%` }} /></div>
                  <b>{item.value}</b>
                </button>
              ))}
            </div>
            <div className="chart-detail">
              <div className="detail-number">{selectedSdg.value}<small>%</small></div>
              <div className="eyebrow">SELECTED INDICATOR</div>
              <h4>SDG {selectedSdg.id}</h4>
              <p>{selectedSdg.label}</p>
              <div className="mini-trend">
                <span>2024</span><i style={{ height: "42%" }} /><span>2025</span><i style={{ height: "63%" }} /><span>2026</span><i style={{ height: `${selectedSdg.value}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="panel gesi-panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">GENDER EQUALITY, SOCIAL INCLUSION</div>
              <h3>GESI / Inklusivitas</h3>
            </div>
            <span className="panel-chip">Interactive</span>
          </div>

          <div className="gesi-layout">
            <div
              className="donut"
              style={{
                background: `conic-gradient(#385d8a 0 58%, #77a3bd 58% 76%, #b7c99c 76% 84%, #e1c46d 84% 100%)`,
              }}
            >
              <div><strong>72</strong><span>Index</span></div>
            </div>
            <div className="gesi-list">
              {gesi.map((item, i) => (
                <button key={item.label} onClick={() => setSelectedGesi(item)} className={selectedGesi?.label === item.label ? "selected" : ""}>
                  <span className={`legend-dot d${i}`} />
                  <span>{item.label}</span>
                  <b>{item.value}%</b>
                </button>
              ))}
            </div>
          </div>
          {selectedGesi && (
            <div className="gesi-detail">
              <strong>{selectedGesi.label}</strong>
              <span>Current dummy score: {selectedGesi.value}%</span>
            </div>
          )}
        </div>
      </section>

      <section className="strategic-section">
        <div className="section-heading strategic-heading">
          <div>
            <div className="eyebrow">STRATEGIC DIRECTION</div>
            <h3>Strategic Pillars for Global Excellence</h3>
          </div>
          <p>Lima pilar utama yang menjadi fondasi penguatan Fakultas Teknik menuju pengakuan dan daya saing global.</p>
        </div>

        <div className="pillar-roof-wrap">
          <div className="pillar-roof">
            <span className="roof-line left" />
            <div className="roof-cap">
              <span className="roof-kicker">GLOBAL EXCELLENCE</span>
              <strong>QS WUR / International Accreditation</strong>
              <small>Global recognition & institutional excellence</small>
            </div>
            <span className="roof-line right" />
          </div>

          <div className="pillar-floor">
            {strategicPillars.map((pillar) => (
              <button key={pillar.id} className={`strategic-pillar ${selectedPillar.id === pillar.id ? "selected" : ""}`} onClick={() => setSelectedPillar(pillar)} title={pillar.english}>
                <span className="pillar-number">{pillar.number}</span>
                <span className="pillar-column" />
                <span className="pillar-disc">{pillar.number}</span>
                <span className="pillar-title">{pillar.title}</span>
                <span className="pillar-english">{pillar.english}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pillar-detail">
          <div className="pillar-detail-index">{selectedPillar.number}</div>
          <div>
            <div className="eyebrow">SELECTED STRATEGIC PILLAR</div>
            <h4>{selectedPillar.title}</h4>
            <p>{selectedPillar.description}</p>
          </div>
          <span className="pillar-detail-tag">{selectedPillar.english}</span>
        </div>
      </section>

      <section className="decision-banner">
        <div className="decision-icon"><BarChart3 size={24} /></div>
        <div>
          <div className="eyebrow">DESIGN PRINCIPLE</div>
          <h3>From Data to Strategic Decision</h3>
          <p>Dashboard dirancang untuk membantu pimpinan melihat pola, keterhubungan antar-unit, dan peluang intervensi — bukan hanya angka.</p>
        </div>
        <div className="decision-flow"><span>DATA</span><i>→</i><span>INSIGHT</span><i>→</i><strong>DECISION</strong></div>
      </section>
    </main>
  );
}

function PlaceholderPage({ moduleId, onBack }) {
  const module = modules.find((m) => m.id === moduleId);
  const Icon = module?.icon || LayoutDashboard;
  return (
    <main className="main-content">
      <div className={`detail-header ${module?.tone || "blue"}`}>
        <button className="back-button" onClick={onBack}>← Executive Overview</button>
        <div className="detail-title"><div className="detail-icon"><Icon size={32} /></div><div><div className="eyebrow">{module?.short}</div><h2>{module?.title}</h2><p>Modul berikutnya dapat dibangun menggunakan pola executive intelligence yang sama.</p></div></div>
      </div>
      <div className="placeholder-grid">
        <div className="placeholder-card"><div className="eyebrow">NEXT DEVELOPMENT</div><h3>Struktur data & indikator</h3><p>Modul akan berisi KPI, filter, katalog, visualisasi, dan drill-down sesuai domain.</p></div>
        <div className="placeholder-card"><div className="eyebrow">NAVIGATION CONCEPT</div><div className="flow"><span>Fakultas</span><b>→</b><span>Departemen</span><b>→</b><span>Unit / KBK</span><b>→</b><strong>Detail</strong></div></div>
      </div>
    </main>
  );
}

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pengecekan hardcoded username dan password
    if (username === "triasaditya" && password === "geodesi1hati") {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <AssetImage
          src="/logo_ugm.png"
          alt="UGM"
          className="ugm-logo"
          fallback={<div className="ugm-mark" style={{margin: '0 auto 20px', width: 75, height: 75, fontSize: 16}}>UGM</div>}
        />
        <h2>Executive Dashboard</h2>
        <p>Sistem Analitik Strategis<br/>Fakultas Teknik Universitas Gadjah Mada</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">Username atau password salah.</div>}
          
          <label>Username</label>
          <input
            type="text"
            className="login-input"
            value={username}
            onChange={(e) => {setUsername(e.target.value); setError(false);}}
            placeholder="Masukkan username Anda"
          />
          
          <label>Password</label>
          <input
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => {setPassword(e.target.value); setError(false);}}
            placeholder="Masukkan password Anda"
          />
          
          <button type="submit" className="login-button">Masuk ke Sistem</button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [active, setActive] = useState("home");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // State untuk mengontrol munculnya modal logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("auth") === "true";
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("auth", "true");
  };

  // Fungsi yang tereksekusi HANYA jika tombol "Ya, Keluar" diklik
  const handleConfirmLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
    setActive("home");
    setShowLogoutModal(false); // Tutup modal setelah logout
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [active]);

  const selectPage = (id) => setActive(id);

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar active={active} setActive={selectPage} collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      
      <div className="page-shell">
        {/* Header sekarang memerintahkan modal untuk terbuka (true) */}
        <Header onMenu={() => setMobileOpen(true)} collapsed={collapsed} onLogout={() => setShowLogoutModal(true)} />
        
        {active === "home" && <ExecutiveHome onOpen={selectPage} />}
        {active === "research" && <ResearchPage onBack={() => setActive("home")} />}
        {active === "community" && <CommunityPage onBack={() => setActive("home")} />}
        {active === "welfare" && <WelfarePage onBack={() => setActive("home")} />}
        {active === "teaching" && <TeachingPage onBack={() => setActive("home")} />}
        
        <footer className="footer"><span>© {new Date().getFullYear()} Fakultas Teknik Universitas Gadjah Mada</span><span>Executive Data Analytics</span></footer>
      </div>

      {/* TAMPILAN MODAL DI ROOT APP (DI LUAR HEADER) */}
      {showLogoutModal && (
        <div className="modal-backdrop" onClick={() => setShowLogoutModal(false)}>
          <div className="logout-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Konfirmasi Logout</h3>
            <p>Apakah Anda yakin ingin keluar dari Executive Dashboard?</p>
            <div className="logout-actions">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Batal</button>
              <button className="btn-danger" onClick={handleConfirmLogout}>Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
