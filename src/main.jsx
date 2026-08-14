import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight, BarChart3, ChevronDown, ChevronLeft, ChevronRight,
  GraduationCap, HeartPulse, Home, LayoutDashboard, LogOut,
  Menu, X, Microscope, Network, Settings, Users,
  Factory, Building2, Rocket, Coins,
  Search
} from "lucide-react";
import "./styles.css";
import CommunityPage from "./CommunityPage";
import WelfarePage from "./WelfarePage";
import TeachingPage from "./TeachingPage";
import ResearchPage from "./ResearchPage";

// IMPORT DATA DARI JSON
import MainData from "../data/MainData.json";
import RekaVenturaData from "../data/RekaVentura.json";
const { PROFESSOR, modules, sdgs, gesi, strategicPillars, pentahelixData } = MainData;

// KAMUS IKON
const iconMap = {
  Microscope, Users, GraduationCap, HeartPulse,
  Factory, Building2, Network
};

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
        <button className="logout-button" onClick={onLogout}>
          <LogOut size={17} /><span>Logout</span>
        </button>
      </div>
    </header>
  );
}

// KOMPONEN 3D PIE CHART
function ProfessionalDonutChart({ data, dataKey, title, valueKey, valuePrefix = "", valueSuffix = "" }) {
  const CIRCUMFERENCE = 2 * Math.PI * 40; 
  let cumulativePercent = 0;
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h4 style={{ textAlign: 'center', marginBottom: 20, color: '#1e293b', fontSize: 14, height: 34, maxWidth: 300 }}>{title}</h4>
      <div style={{ position: "relative", width: 260, height: 260 }}>
        {/* Putaran SVG dimulai dari arah jam 12 (-90deg) */}
        <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%", filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.15))" }}>
          {data.map((item, idx) => {
            const pct = item[dataKey];
            const dashValue = (pct / 100) * CIRCUMFERENCE;
            const gapValue = CIRCUMFERENCE - dashValue;
            const offsetValue = -(cumulativePercent / 100) * CIRCUMFERENCE;
            cumulativePercent += pct;
            
            const isHovered = hoveredIdx === idx;
            
            return (
              <circle 
                key={item.id}
                cx="50" cy="50" r="40"
                fill="none" /* <--- PERBAIKAN 1: Gunakan "none", bukan "transparent" */
                stroke={item.color}
                strokeWidth={isHovered ? "22" : "18"}
                strokeDasharray={`${dashValue} ${gapValue}`}
                strokeDashoffset={offsetValue}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  pointerEvents: "stroke" /* <--- PERBAIKAN 2: Pastikan hanya garis warna yang mendeteksi kursor */
                }}
              />
            );
          })}
        </svg>
        
        {/* Tooltip Dinamis di Tengah Donut */}
        <div style={{ 
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
          textAlign: 'center', pointerEvents: 'none', width: 150,
          opacity: hoveredIdx !== null ? 1 : 0, transition: '0.2s'
        }}>
          {hoveredIdx !== null && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', lineHeight: 1.2 }}>{data[hoveredIdx].label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: data[hoveredIdx].color, marginTop: 4 }}>{data[hoveredIdx][dataKey]}%</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                {valuePrefix}{data[hoveredIdx][valueKey].toLocaleString('id-ID')}{valueSuffix}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ExecutiveHome({ onOpen }) {
  const [selectedSdg, setSelectedSdg] = useState(sdgs[3]);
  const [selectedGesi, setSelectedGesi] = useState(null);
  const [selectedPillar, setSelectedPillar] = useState(strategicPillars[0]);
  const [activeHelix, setActiveHelix] = useState(pentahelixData[0]);
  const [helixYear, setHelixYear] = useState("2026");
  // === STATE REKA VENTURA ===
  const [rvYear, setRvYear] = useState("2025");
  const [showRvModal, setShowRvModal] = useState(false);
  const [hoveredRvYear, setHoveredRvYear] = useState(null); 
  const [showHibahModal, setShowHibahModal] = useState(false);

// === TAMBAHAN STATE UNTUK TABEL RAW DATA ===
  const [searchTable, setSearchTable] = useState("");
  const [filterMitra, setFilterMitra] = useState("Semua Jenis Mitra");
  
  // State untuk Paginasi
  const [tablePage, setTablePage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  // Reset halaman ke 1 setiap kali pimpinan mengetik pencarian atau mengganti filter
  useEffect(() => {
    setTablePage(1);
  }, [searchTable, filterMitra]);

  // Fungsi Pemetaan Kategori Spesifik ke Kategori Umum
  const getKategoriUmum = (jenisSpesifik) => {
    const pt = ["Perguruan Tinggi Swasta", "Perguruan Tinggi Negeri (Institusi Pendidikan DN)"];
    const pem = ["Pemerintah Pusat", "Pemerintah Daerah", "Instansi Pemerintah"];
    const bumn = ["BUMN", "BUMN/BUMD", "Bank/Lembaga Keuangan BUMN"];
    const swasta = ["Industri Swasta", "Institusi Swasta", "Rumah Sakit Swasta", "Perusahaan Swasta"];
    
    if (pt.includes(jenisSpesifik)) return "Perguruan Tinggi Dalam Negeri";
    if (bumn.includes(jenisSpesifik)) return "BUMN dan BUMD";
    if (pem.includes(jenisSpesifik)) return "Pemerintah Pusat dan Daerah";
    if (swasta.includes(jenisSpesifik)) return "Perusahaan dan Institusi Swasta";
    return jenisSpesifik; 
  };

  // Filter Data Tabel Keseluruhan
  const filteredRawProjects = (RekaVenturaData.rawProjects || []).filter(p => {
    const catUmum = getKategoriUmum(p.jenisMitra);
    const matchFilter = filterMitra === "Semua Jenis Mitra" || catUmum === filterMitra;
    const matchSearch = p.judul.toLowerCase().includes(searchTable.toLowerCase()) || p.namaMitra.toLowerCase().includes(searchTable.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Potong Data (Slice) Hanya 50 Baris Sesuai Halaman Saat Ini
  const totalPages = Math.ceil(filteredRawProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredRawProjects.slice((tablePage - 1) * ITEMS_PER_PAGE, tablePage * ITEMS_PER_PAGE);

  // Fungsi Export ke CSV
  const handleExportCSV = () => {
    if (filteredRawProjects.length === 0) return;
    // ... (kode export CSV biarkan sama persis seperti sebelumnya) ...
    const headers = ["No", "Judul Kerja Sama", "Jenis Mitra", "Nama Mitra", "Prodi", "Nominal (Rp)", "Tahun"];
    const csvContent = [
      headers.join(","),
      ...filteredRawProjects.map(p => 
        `"${p.no}","${p.judul.replace(/"/g, '""')}","${p.jenisMitra}","${p.namaMitra}","${p.prodi}","${p.nominal}","${p.tahun}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Kerjasama_PK_LKFT_${filterMitra}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const rvDana = RekaVenturaData.danaKerjasama[rvYear] || { kegiatan: 0, nilai: 0 };
  const rvHibah = RekaVenturaData.hibahPemerintah[rvYear] || { nilai: 0 };
  const rvIndirect = RekaVenturaData.indirectBenefit[rvYear] || { startup: 0, lisensi: 0 };

  // Fungsi format miliar
  const formatMiliar = (val) => `Rp ${(val / 1000000000).toFixed(1)} Miliar`;
  const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  
  // Data array untuk grafik modal
  const sortedYearsAsc = [...RekaVenturaData.years].sort((a, b) => a - b);
  const chartData = sortedYearsAsc.map(y => ({
    year: y,
    keg: RekaVenturaData.danaKerjasama[y].kegiatan,
    val: RekaVenturaData.danaKerjasama[y].nilai
  }));

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
          const Icon = iconMap[module.iconName] || LayoutDashboard;
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
      <section className="innovation-grid" style={{ marginTop: "40px" }}>
        
        {/* PENTAHELIX */}
        <div className="panel pentahelix-panel">
          <div className="panel-heading" style={{ marginBottom: 24 }}>
            <div>
              <div className="eyebrow">COLLABORATION ECOSYSTEM</div>
              <h3>Sinergi Pentahelix</h3>
            </div>
            {/* Tombol Pemilih Tahun */}
            <div style={{ display: "flex", gap: 6, background: "#f1f5f9", padding: 4, borderRadius: 8 }}>
              {["2024", "2025", "2026"].map(year => (
                <button 
                  key={year}
                  onClick={() => setHelixYear(year)}
                  style={{ 
                    padding: "4px 12px", 
                    borderRadius: "6px", 
                    fontSize: "11px", 
                    fontWeight: 800,
                    border: "none",
                    background: helixYear === year ? "#fff" : "transparent",
                    color: helixYear === year ? "#102a43" : "#64748b",
                    boxShadow: helixYear === year ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24, alignItems: "center" }}>
            {/* Grafik Segi Lima Interaktif */}
            <div className="penta-container">
              <svg viewBox="0 0 200 200" className="penta-lines">
                <polygon points="100,10 190,75 155,180 45,180 10,75" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
                <line x1="100" y1="100" x2="100" y2="10" stroke="#cbd5e1" strokeWidth="2"/>
                <line x1="100" y1="100" x2="190" y2="75" stroke="#cbd5e1" strokeWidth="2"/>
                <line x1="100" y1="100" x2="155" y2="180" stroke="#cbd5e1" strokeWidth="2"/>
                <line x1="100" y1="100" x2="45" y2="180" stroke="#cbd5e1" strokeWidth="2"/>
                <line x1="100" y1="100" x2="10" y2="75" stroke="#cbd5e1" strokeWidth="2"/>
                <circle cx="100" cy="100" r="6" fill="#94a3b8" />
              </svg>

              {pentahelixData.map((helix, idx) => {
                const Icon = iconMap[helix.iconName];
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <strong style={{ fontSize: 16, color: "#102a43" }}>{activeHelix.label}</strong>
                <span style={{ fontSize: 10, fontWeight: 800, color: activeHelix.color, background: `${activeHelix.color}22`, padding: "4px 8px", borderRadius: 6 }}>
                  DATA {helixYear}
                </span>
              </div>
              <p style={{ color: "#475569", fontSize: 13, marginBottom: 18, lineHeight: 1.5 }}>
                {activeHelix.desc}
              </p>
              
              {/* Mapping Metrik berdasarkan Tahun yang Dipilih */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {activeHelix.metrics[helixYear].map((metric, idx) => (
                  <div key={idx} style={{ background: "#fff", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: activeHelix.color }}>{metric.value}</div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4, lineHeight: 1.3 }}>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.15)", borderRadius: 12, display: "grid", placeItems: "center" }}>
                <Rocket size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: "#93c5fd" }}>INNOVATION HUB</div>
                <h3 style={{ margin: 0, fontSize: 18, color: "#fff" }}>Reka Ventura</h3>
              </div>
            </div>
            {/* DROPDOWN TAHUN */}
            <select 
              value={rvYear} 
              onChange={e => setRvYear(e.target.value)} 
              className="rv-year-select"
            >
              {[...RekaVenturaData.years].sort((a, b) => b - a).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          
          <p style={{ color: "#bfdbfe", fontSize: 12, lineHeight: 1.5, marginBottom: 20 }}>
            Kendaraan komersialisasi dan hilirisasi inovasi. Klik panel <strong>DIRECT</strong> di bawah ini untuk melihat matriks pertumbuhan komprehensif.
          </p>

          <div style={{ display: "grid", gap: 12 }}>
            {/* DIRECT BENEFITS (CLICKABLE) */}
            <button className="rv-card" onClick={() => setShowRvModal(true)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#93c5fd", fontSize: 10, fontWeight: 800, marginBottom: 6, letterSpacing: "0.05em" }}>
                  <Coins size={14}/> DIRECT: DANA KERJASAMA & HILIRISASI (ERIC → LKFT)
                </div>
                <ArrowRight size={14} color="#93c5fd" />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>{formatMiliar(rvDana.nilai)}</div>
                <div style={{ fontSize: 13, color: "#fcd34d", fontWeight: 700, marginBottom: 4 }}>{rvDana.kegiatan} Kegiatan</div>
              </div>
              <div style={{ fontSize: 11, color: "#bfdbfe", marginTop: 4 }}>Proyek Industri, Lisensi, dan Royalti Tahun {rvYear}</div>
            </button>
            
            <button className="rv-card" onClick={() => setShowHibahModal(true)}>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#93c5fd", fontSize: 10, fontWeight: 800, marginBottom: 6, letterSpacing: "0.05em" }}>
                  <Building2 size={14}/> DIRECT: HIBAH & KERJASAMA PEMERINTAH
                </div>
                <ArrowRight size={14} color="#93c5fd" />
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>{formatMiliar(rvHibah.nilai)}</div>
              <div style={{ fontSize: 11, color: "#bfdbfe", marginTop: 4 }}>DIKTI / LPDP / Lembaga Internasional (LN) Tahun {rvYear}</div>
            </button>

            {/* INDIRECT BENEFITS */}
            <div style={{ background: "rgba(255,255,255,0.05)", padding: 14, borderRadius: 12, border: "1px dashed rgba(255,255,255,0.25)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: 10, fontWeight: 800, marginBottom: 8, letterSpacing: "0.05em" }}>
                INDIRECT BENEFIT ({rvYear})
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc" }}>{rvIndirect.startup} Unit</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Startup / Spin-off</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc" }}>{rvIndirect.lisensi} Paten</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Lisensi Industri</div>
                </div>
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
          
          {/* Kolom Kiri: Deskripsi Pilar */}
          <div className="pillar-info">
            <div className="pillar-detail-index">{selectedPillar.number}</div>
            <div>
              <div className="eyebrow">SELECTED STRATEGIC PILLAR</div>
              <h4>{selectedPillar.title}</h4>
              <p>{selectedPillar.description}</p>
              <span className="pillar-detail-tag">{selectedPillar.english}</span>
            </div>
          </div>

          {/* Kolom Kanan: Bar Chart Indikator Kinerja */}
          <div className="pillar-indicators">
            <div className="eyebrow" style={{ marginBottom: 16 }}>PERFORMANCE LENS & INDICATORS</div>
            <div className="indicator-list">
              {selectedPillar.indicators.map((ind, idx) => {
                const percentage = Math.min(100, (ind.score / ind.target) * 100);
                // Ubah warna bar menjadi warning (oranye) jika di bawah 75, sisanya biru UGM
                const barColor = percentage < 75 ? "#d97706" : "#0b5ea8"; 
                
                return (
                  <div className="indicator-item" key={idx}>
                    <div className="indicator-labels">
                      <span className="indicator-name">{ind.label}</span>
                      <strong className="indicator-score">{ind.score} <small>/ {ind.target}</small></strong>
                    </div>
                    <div className="indicator-track">
                      <div 
                        className="indicator-fill" 
                        style={{ width: `${percentage}%`, background: barColor }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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

      {/* MODAL GRAFIK REKA VENTURA */}
      {showRvModal && (
        <div className="modal-backdrop" onClick={() => setShowRvModal(false)} style={{ zIndex: 1000, padding: 20 }}>
          <div className="research-modal" style={{ maxWidth: 1100, width: "100%", maxHeight: "90vh", overflowY: "auto", background: "#f8fafc", padding: 30 }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowRvModal(false)}><X size={20} /></button>
            
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, color: "#0f172a", margin: 0 }}>Capaian Nilai Kontrak dan Jumlah Kerjasama LKFT</h2>
              <div style={{ fontSize: 14, color: "#64748b", fontWeight: 600, marginTop: 4 }}>Tahun 2018 - 2025</div>
            </div>

            {/* LEGENDA GRAFIK */}
            <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 16, height: 16, background: "#f97316", borderRadius: 4 }}></div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Total Nilai Kontrak (Bar)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 24, height: 3, background: "#2563eb", position: "relative" }}>
                   <div style={{ width: 10, height: 10, background: "#fff", border: "2.5px solid #2563eb", borderRadius: "50%", position: "absolute", top: -3.5, left: 7 }}></div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Jumlah Kegiatan Kerjasama (Garis)</span>
              </div>
            </div>

            {/* MAIN CHART (COMBINED BAR & LINE) DENGAN HOVER EFFECT */}
            <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e2e8f0", marginBottom: 24, position: "relative", height: 350 }}>
              <div style={{ position: "absolute", left: -30, top: "45%", transform: "rotate(-90deg)", fontSize: 11, fontWeight: 800, color: "#f97316" }}>Total Nilai Kontrak (milyar)</div>
              <div style={{ position: "absolute", right: -30, top: "45%", transform: "rotate(-90deg)", fontSize: 11, fontWeight: 800, color: "#2563eb" }}>Jumlah Kegiatan Kerjasama</div>
              
              <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none">
                {/* Garis Grid Horizontal */}
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <line key={i} x1="50" y1={50 + (i*40)} x2="950" y2={50 + (i*40)} stroke="#e2e8f0" strokeWidth="1" />
                ))}
                
                {/* Render Garis Biru Lebih Dulu (Di Background) */}
                {chartData.map((d, i) => {
                  const xBase = 50 + (i * 110) + 55;
                  const lineY = 250 - ((d.keg / 325) * 200);
                  const nextD = chartData[i+1];
                  const nextX = nextD ? 50 + ((i+1) * 110) + 55 : null;
                  const nextY = nextD ? 250 - ((nextD.keg / 325) * 200) : null;
                  
                  if (!nextD) return null;
                  return (
                    <line 
                      key={`line-${d.year}`} 
                      x1={xBase} y1={lineY} x2={nextX} y2={nextY} 
                      stroke="#2563eb" 
                      strokeWidth="3" 
                      style={{ opacity: hoveredRvYear ? 0.3 : 1, transition: "opacity 0.3s" }} 
                    />
                  );
                })}

                {/* Render Bar & Titik (Interaktif) */}
                {chartData.map((d, i) => {
                  const xBase = 50 + (i * 110) + 55;
                  const barHeight = (d.val / 250000000000) * 200; // Skala max 250 Miliar
                  const lineY = 250 - ((d.keg / 325) * 200); // Skala max 325 Kegiatan
                  
                  const isHovered = hoveredRvYear === d.year;
                  const isDimmed = hoveredRvYear && !isHovered;

                  // PERBAIKAN: Hitung lebar dan X secara dinamis agar batang membesar tepat dari tengah
                  const barWidth = isHovered ? 50 : 40;
                  const barX = xBase - (barWidth / 2);

                  return (
                    <g 
                      key={d.year}
                      onMouseEnter={() => setHoveredRvYear(d.year)}
                      onMouseLeave={() => setHoveredRvYear(null)}
                      style={{ 
                        opacity: isDimmed ? 0.3 : 1, 
                        transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: "pointer" 
                      }}
                    >
                      {/* Transparan Hover Area (Agar deteksi kursor lebih responsif) */}
                      <rect x={xBase - 35} y="30" width="70" height="240" fill="transparent" />

                      {/* Bar (Nilai Kontrak) - Menggunakan perhitungan barX dan barWidth */}
                      <rect 
                        x={barX} y={250 - barHeight} width={barWidth} height={barHeight} 
                        fill={isHovered ? "#ea580c" : "#f97316"} rx="2" 
                        style={{ transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)" }} 
                      />
                      
                      {/* Teks Bar (Nilai Rupiah) */}
                      <text x={xBase} y={250 - barHeight - 10} fontSize={isHovered ? "12" : "10"} fontWeight="bold" fill={isHovered ? "#ea580c" : "#0f172a"} textAnchor="middle" style={{ transition: "all 0.2s" }}>
                        Rp{(d.val/1e9).toFixed(0)} M
                      </text>
                      
                      {/* Titik Line (Kegiatan) */}
                      <circle cx={xBase} cy={lineY} r={isHovered ? "7" : "5"} fill="#fff" stroke="#2563eb" strokeWidth={isHovered ? "3" : "2"} style={{ transition: "all 0.2s" }} />
                      
                      {/* Teks Line (Angka Kegiatan) */}
                      <text x={xBase} y={lineY - 14} fontSize={isHovered ? "14" : "12"} fontWeight="bold" fill="#2563eb" textAnchor="middle" style={{ transition: "all 0.2s" }}>
                        {d.keg}
                      </text>
                      
                      {/* Label Tahun (Sumbu X) */}
                      <text x={xBase} y={270} fontSize={isHovered ? "14" : "12"} fontWeight="bold" fill={isHovered ? "#0f172a" : "#64748b"} textAnchor="middle" style={{ transition: "all 0.2s" }}>
                        {d.year}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* BOTTOM SECTION: TABLE & MINI CHARTS */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              
              {/* Data Table */}
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "right" }}>
                  <thead style={{ background: "#f1f5f9" }}>
                    <tr>
                      <th style={{ padding: "12px", borderBottom: "1px solid #cbd5e1", textAlign: "center" }}>Tahun</th>
                      <th style={{ padding: "12px", borderBottom: "1px solid #cbd5e1" }}>Total Keg</th>
                      <th style={{ padding: "12px", borderBottom: "1px solid #cbd5e1" }}>Nilai Kontrak (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((d, idx) => {
                      const isHovered = hoveredRvYear === d.year;
                      return (
                        <tr 
                          key={d.year} 
                          onMouseEnter={() => setHoveredRvYear(d.year)}
                          onMouseLeave={() => setHoveredRvYear(null)}
                          style={{ 
                            background: isHovered ? "#e0f2fe" : (idx % 2 === 0 ? "#fff" : "#f8fafc"),
                            transition: "background 0.2s",
                            cursor: "pointer"
                          }}
                        >
                          <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: isHovered ? 800 : 700, color: isHovered ? "#0b5ea8" : "#000" }}>{d.year}</td>
                          <td style={{ padding: "10px 12px", fontWeight: isHovered ? 700 : 400, color: isHovered ? "#2563eb" : "#000" }}>{d.keg}</td>
                          <td style={{ padding: "10px 12px", fontFamily: "monospace", fontWeight: isHovered ? 700 : 400, color: isHovered ? "#ea580c" : "#000" }}>{formatRupiah(d.val)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 2 Mini Charts Dark Mode DENGAN HOVER EFFECT */}
              <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 16 }}>
                
                {/* Mini Chart 1: Total Dana */}
                <div style={{ background: "linear-gradient(to bottom, #334155, #0f172a)", padding: "16px 20px", borderRadius: 12, color: "#fff" }}>
                  <div style={{ textAlign: "center", fontSize: 13, marginBottom: 16 }}>Total Dana Kerjasama Melalui LKFT</div>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 120 }}>
                    {chartData.map(d => {
                      const isHovered = hoveredRvYear === d.year;
                      const isDimmed = hoveredRvYear && !isHovered;
                      return (
                        <div 
                          key={d.year} 
                          onMouseEnter={() => setHoveredRvYear(d.year)}
                          onMouseLeave={() => setHoveredRvYear(null)}
                          style={{ 
                            display: "flex", flexDirection: "column", alignItems: "center", width: "10%",
                            opacity: isDimmed ? 0.3 : 1,
                            transform: isHovered ? "scale(1.1) translateY(-4px)" : "scale(1)",
                            transition: "all 0.3s ease",
                            cursor: "pointer"
                          }}
                        >
                          <div style={{ fontSize: 9, color: isHovered ? "#bae6fd" : "#cbd5e1", marginBottom: 4, fontWeight: isHovered ? 800 : 400 }}>{(d.val/1e9).toFixed(0)}M</div>
                          <div style={{ width: "100%", height: `${(d.val/250000000000)*100}px`, background: isHovered ? "linear-gradient(to right, #7dd3fc, #0ea5e9)" : "linear-gradient(to right, #38bdf8, #0284c7)", borderTop: "1px solid #fff", borderRight: "1px solid #000", boxShadow: isHovered ? "0 4px 10px rgba(56, 189, 248, 0.4)" : "none" }}></div>
                          <div style={{ fontSize: 10, color: isHovered ? "#fff" : "#fcd34d", marginTop: 6, fontWeight: isHovered ? 800 : 400 }}>{d.year}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Mini Chart 2: Total Kegiatan */}
                <div style={{ background: "linear-gradient(to bottom, #334155, #0f172a)", padding: "16px 20px", borderRadius: 12, color: "#fff" }}>
                  <div style={{ textAlign: "center", fontSize: 13, marginBottom: 16 }}>Jumlah Kegiatan Kerjasama Melalui LKFT</div>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 120 }}>
                    {chartData.map(d => {
                      const isHovered = hoveredRvYear === d.year;
                      const isDimmed = hoveredRvYear && !isHovered;
                      return (
                        <div 
                          key={d.year} 
                          onMouseEnter={() => setHoveredRvYear(d.year)}
                          onMouseLeave={() => setHoveredRvYear(null)}
                          style={{ 
                            display: "flex", flexDirection: "column", alignItems: "center", width: "10%",
                            opacity: isDimmed ? 0.3 : 1,
                            transform: isHovered ? "scale(1.1) translateY(-4px)" : "scale(1)",
                            transition: "all 0.3s ease",
                            cursor: "pointer"
                          }}
                        >
                          <div style={{ fontSize: 10, color: isHovered ? "#93c5fd" : "#fff", marginBottom: 4, fontWeight: 700 }}>{d.keg}</div>
                          <div style={{ width: "100%", height: `${(d.keg/325)*100}px`, background: isHovered ? "linear-gradient(to right, #93c5fd, #2563eb)" : "linear-gradient(to right, #60a5fa, #1d4ed8)", borderTop: "1px solid #fff", borderRight: "1px solid #000", boxShadow: isHovered ? "0 4px 10px rgba(96, 165, 250, 0.4)" : "none" }}></div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL CHART (HIBAH & KERJASAMA PEMERINTAH) */}
      {showHibahModal && (
        <div className="modal-backdrop" onClick={() => setShowHibahModal(false)} style={{ zIndex: 1000, padding: 20 }}>
          <div className="research-modal" style={{ maxWidth: 1000, width: "100%", maxHeight: "90vh", overflowY: "auto", background: "#f8fafc", padding: 30 }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowHibahModal(false)}><X size={20} /></button>
            
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div className="eyebrow" style={{ color: "#059669" }}>ANALISIS KEMITRAAN PK-LKFT</div>
              <h2 style={{ fontSize: 24, color: "#0f172a", margin: "4px 0 0" }}>Distribusi Hibah & Kerjasama Pemerintah (2018 - 2025)</h2>
            </div>

            {/* AREA 2 DONUT CHART BERSEBELAHAN */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 40 }}>
              <ProfessionalDonutChart 
                data={RekaVenturaData.mitraPemerintah} 
                dataKey="pctNilai" 
                valueKey="nilai"
                valuePrefix="Rp "
                title="Besar Nilai Kontrak berdasarkan Jenis Mitra" 
              />
              <ProfessionalDonutChart 
                data={RekaVenturaData.mitraPemerintah} 
                dataKey="pctKegiatan" 
                valueKey="kegiatan"
                valueSuffix=" Kegiatan"
                title="Banyaknya Kegiatan berdasarkan Jenis Mitra" 
              />
            </div>

            {/* LEGENDA WARNA */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px 24px", marginBottom: 30, padding: "16px", background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
              {RekaVenturaData.mitraPemerintah.map(m => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 14, height: 14, background: m.color, borderRadius: 4 }}></div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>{m.label}</span>
                </div>
              ))}
            </div>

            {/* TABEL DATA REKAPITULASI */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                <thead style={{ background: "#f1f5f9" }}>
                  <tr>
                    <th style={{ padding: "14px 16px", borderBottom: "1px solid #cbd5e1", color: "#334155" }}>Jenis Mitra</th>
                    <th style={{ padding: "14px 16px", borderBottom: "1px solid #cbd5e1", textAlign: "right", color: "#334155" }}>Jumlah Kegiatan</th>
                    <th style={{ padding: "14px 16px", borderBottom: "1px solid #cbd5e1", textAlign: "right", color: "#334155" }}>Nilai Kontrak (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {RekaVenturaData.mitraPemerintah.map((m, idx) => (
                    <tr key={m.id} style={{ background: idx % 2 === 0 ? "#fff" : "#f8fafc", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#e0f2fe"} onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#f8fafc"}>
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: "#0f172a" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 12, height: 12, background: m.color, borderRadius: "50%" }}></div>
                          {m.label}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: "#475569", fontWeight: 600 }}>{m.kegiatan}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#ea580c" }}>{formatRupiah(m.nilai)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: "#e2e8f0", fontWeight: 800, color: "#0f172a" }}>
                    <td style={{ padding: "14px 16px" }}>Total Keseluruhan</td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>{RekaVenturaData.mitraTotal.kegiatan}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontFamily: "monospace", color: "#b45309" }}>{formatRupiah(RekaVenturaData.mitraTotal.nilai)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* AREA BREAKDOWN SUB-MITRA (GRAFIK BAR HORIZONTAL) */}
            <div style={{ marginTop: 40, borderTop: "2px dashed #cbd5e1", paddingTop: 30 }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, color: "#0f172a", margin: 0 }}>Rincian Lanjutan per Jenis Mitra</h3>
                <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>Distribusi jumlah kegiatan dan nilai kontrak pada masing-masing sub-kategori mitra.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {RekaVenturaData.mitraPemerintah.map((m) => (
                  <div key={m.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, borderBottom: "1px solid #f1f5f9", paddingBottom: 12 }}>
                      <div style={{ width: 14, height: 14, background: m.color, borderRadius: "50%" }}></div>
                      <strong style={{ fontSize: 15, color: "#0f172a" }}>{m.label}</strong>
                    </div>
                    
                    <div style={{ display: "grid", gap: 16 }}>
                      {m.breakdown.map((sub, sIdx) => {
                        const pctKeg = (sub.kegiatan / m.kegiatan) * 100;
                        const pctVal = (sub.nilai / m.nilai) * 100;
                        return (
                          <div key={sIdx}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                              <strong style={{ color: "#334155" }}>{sub.label}</strong>
                            </div>
                            
                            {/* Bar Kegiatan */}
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                              <span style={{ fontSize: 10, color: "#64748b", width: 65 }}>Kegiatan</span>
                              <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 4 }}>
                                <div style={{ width: `${pctKeg}%`, height: "100%", background: "#2563eb", borderRadius: 4 }}></div>
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", width: 30, textAlign: "right" }}>{sub.kegiatan}</span>
                            </div>

                            {/* Bar Nilai */}
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <span style={{ fontSize: 10, color: "#64748b", width: 65 }}>Nilai (Rp)</span>
                              <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 4 }}>
                                <div style={{ width: `${pctVal}%`, height: "100%", background: "#ea580c", borderRadius: 4 }}></div>
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", width: 110, textAlign: "right" }}>{formatRupiah(sub.nilai)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AREA TABEL RAW DATA (DRILL-DOWN) */}
            <div style={{ marginTop: 50, borderTop: "2px solid #e2e8f0", paddingTop: 30 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 16 }}>
                <div>
                  <h3 style={{ fontSize: 20, color: "#0f172a", margin: 0 }}>Database Master Kerja Sama PK-LKFT</h3>
                  <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
                    Menampilkan <strong>{filteredRawProjects.length}</strong> data dokumen berdasarkan filter pencarian.
                  </p>
                </div>
                
                {/* Search, Filter & Export */}
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ position: "relative" }}>
                    <Search size={14} color="#64748b" style={{ position: "absolute", left: 10, top: 10 }} />
                    <input 
                      type="text" 
                      placeholder="Cari Judul / Nama Mitra..." 
                      value={searchTable}
                      onChange={e => setSearchTable(e.target.value)}
                      style={{ padding: "8px 12px 8px 32px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 12, width: 220, outline: "none" }}
                    />
                  </div>
                  
                  <select 
                    value={filterMitra} 
                    onChange={e => setFilterMitra(e.target.value)}
                    style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 12, outline: "none", cursor: "pointer", background: "#fff" }}
                  >
                    <option value="Semua Jenis Mitra">Semua Jenis Mitra</option>
                    <option value="Perguruan Tinggi Dalam Negeri">Perguruan Tinggi Dalam Negeri</option>
                    <option value="BUMN dan BUMD">BUMN dan BUMD</option>
                    <option value="Pemerintah Pusat dan Daerah">Pemerintah Pusat dan Daerah</option>
                    <option value="Perusahaan dan Institusi Swasta">Perusahaan dan Institusi Swasta</option>
                    <option value="Organisasi">Organisasi</option>
                    <option value="Mitra Luar Negeri">Mitra Luar Negeri</option>
                  </select>

                  <button 
                    onClick={handleExportCSV}
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "#059669", color: "#fff", padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.background = "#047857"} 
                    onMouseOut={e => e.currentTarget.style.background = "#059669"}
                  >
                    <ArrowRight size={14} style={{ transform: "rotate(90deg)" }} /> Export CSV
                  </button>
                </div>
              </div>

              {/* Tabel Scrollable dengan Paginasi */}
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflowX: "auto", display: "flex", flexDirection: "column" }}>
                <div style={{ maxHeight: 400, overflowY: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left", minWidth: 900 }}>
                    <thead style={{ background: "#f8fafc", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                      <tr>
                        <th style={{ padding: "12px", borderBottom: "1px solid #cbd5e1", color: "#334155", width: 40 }}>No</th>
                        <th style={{ padding: "12px", borderBottom: "1px solid #cbd5e1", color: "#334155" }}>Judul Kerja Sama</th>
                        <th style={{ padding: "12px", borderBottom: "1px solid #cbd5e1", color: "#334155", width: 140 }}>Jenis Mitra</th>
                        <th style={{ padding: "12px", borderBottom: "1px solid #cbd5e1", color: "#334155", width: 140 }}>Nama Mitra</th>
                        <th style={{ padding: "12px", borderBottom: "1px solid #cbd5e1", color: "#334155", width: 100 }}>Prodi</th>
                        <th style={{ padding: "12px", borderBottom: "1px solid #cbd5e1", textAlign: "right", color: "#334155", width: 130 }}>Nominal (Rp)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProjects.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>Tidak ada data yang sesuai dengan pencarian atau filter.</td>
                        </tr>
                      ) : (
                        paginatedProjects.map((p, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <td style={{ padding: "10px 12px", color: "#64748b" }}>{p.no}</td>
                            <td style={{ padding: "10px 12px", fontWeight: 600, color: "#0f172a", lineHeight: 1.4 }}>{p.judul}</td>
                            <td style={{ padding: "10px 12px", color: "#475569" }}><span style={{ background: "#e2e8f0", padding: "2px 6px", borderRadius: 4, fontSize: 10 }}>{p.jenisMitra}</span></td>
                            <td style={{ padding: "10px 12px", color: "#0f172a" }}>{p.namaMitra}</td>
                            <td style={{ padding: "10px 12px", color: "#475569" }}>{p.prodi}</td>
                            <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#ea580c" }}>{formatRupiah(p.nominal)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Kontrol Paginasi */}
                {filteredRawProjects.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                      Menampilkan {(tablePage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(tablePage * ITEMS_PER_PAGE, filteredRawProjects.length)} dari total {filteredRawProjects.length} data
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button 
                        disabled={tablePage === 1} 
                        onClick={() => setTablePage(tablePage - 1)} 
                        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #cbd5e1", background: tablePage === 1 ? "#f1f5f9" : "#fff", color: tablePage === 1 ? "#94a3b8" : "#0f172a", cursor: tablePage === 1 ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 600, transition: "0.2s" }}
                      >
                        Sebelumnya
                      </button>
                      <button 
                        disabled={tablePage === totalPages} 
                        onClick={() => setTablePage(tablePage + 1)} 
                        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #cbd5e1", background: tablePage === totalPages ? "#f1f5f9" : "#fff", color: tablePage === totalPages ? "#94a3b8" : "#0f172a", cursor: tablePage === totalPages ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 600, transition: "0.2s" }}
                      >
                        Selanjutnya
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
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
          <input type="text" className="login-input" value={username} onChange={(e) => {setUsername(e.target.value); setError(false);}} placeholder="Masukkan username Anda" />
          <label>Password</label>
          <input type="password" className="login-input" value={password} onChange={(e) => {setPassword(e.target.value); setError(false);}} placeholder="Masukkan password Anda" />
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("auth") === "true";
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("auth", "true");
  };

  const handleConfirmLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
    setActive("home");
    setShowLogoutModal(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [active]);

  const selectPage = (id) => setActive(id);

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar active={active} setActive={selectPage} collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      
      <div className="page-shell">
        <Header onMenu={() => setMobileOpen(true)} collapsed={collapsed} onLogout={() => setShowLogoutModal(true)} />
        
        {active === "home" && <ExecutiveHome onOpen={selectPage} />}
        {active === "research" && <ResearchPage onBack={() => setActive("home")} />}
        {active === "community" && <CommunityPage onBack={() => setActive("home")} />}
        {active === "welfare" && <WelfarePage onBack={() => setActive("home")} />}
        {active === "teaching" && <TeachingPage onBack={() => setActive("home")} />}
        
        <footer className="footer"><span>© {new Date().getFullYear()} Fakultas Teknik Universitas Gadjah Mada</span><span>Executive Data Analytics</span></footer>
      </div>

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