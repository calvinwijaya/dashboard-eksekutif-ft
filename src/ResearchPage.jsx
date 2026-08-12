import React, { useMemo, useState, useEffect } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, Building2, ChevronDown, 
  ExternalLink, FileText, Filter, Network, Search, 
  Sparkles, Users, X, HeartPulse, Leaf, Cpu, Factory, Shield, Layers, Zap, Anchor,
  Sprout, Stethoscope, CloudRain, BadgeCheck, Lightbulb, FileBadge
} from "lucide-react";
import "./styles.css";
import ResearchData from "../data/ResearchData.json";

const { departments, kbkExpertise, researches, publications, scientists, nationalPriorities, ugmFlagships } = ResearchData;

const iconMap = {
  HeartPulse, Leaf, Cpu, Factory, Shield, Layers, Zap, Anchor,
  Sprout, Stethoscope, CloudRain, Users
};

// Komponen Pagination Sederhana
function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;
  return (
    <div className="pagination-bar">
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        <ArrowLeft size={14} /> Prev
      </button>
      <span>Halaman {currentPage} dari {totalPages}</span>
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Next <ArrowRight size={14} />
      </button>
    </div>
  );
}

function ResearchPage({ onBack }) {
  const [typeFilter, setTypeFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [departmentFilter, setDepartmentFilter] = useState("Semua Departemen");
  const [kbkFilter, setKbkFilter] = useState("Semua KBK");
  const [search, setSearch] = useState("");
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [opportunityQuery, setOpportunityQuery] = useState("");

  // Pagination States
  const [portPage, setPortPage] = useState(1);
  const [pubPage, setPubPage] = useState(1);
  const [sciPage, setSciPage] = useState(1);
  const [showPitchModal, setShowPitchModal] = useState(false);

  // Reset pagination jika filter Karsa-Teknika diubah
  useEffect(() => { setPortPage(1); }, [typeFilter, statusFilter, departmentFilter, kbkFilter, search]);

  const allKbks = departments.flatMap((d) => d.kbks.map((k) => ({ ...k, department: d.name })));

  const opportunityMatches = useMemo(() => {
    const query = opportunityQuery.trim().toLowerCase();
    if (!query) return [];
    const queryTerms = query.split(/\s+/).filter(Boolean);

    return allKbks.map((kbk) => {
      const expertise = kbkExpertise[kbk.name]?.keywords || [];
      let score = 0;
      queryTerms.forEach((term) => {
        expertise.forEach((keyword) => {
          if (keyword.includes(term) || term.includes(keyword)) score += keyword === term ? 30 : 15;
        });
        if (kbk.name.toLowerCase().includes(term)) score += 40;
      });
      return { ...kbk, score: Math.min(score, 100), expertise };
    }).filter((kbk) => kbk.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
  }, [opportunityQuery, allKbks]);

  const filteredPortfolio = useMemo(() => {
    return researches.filter((r) => {
      const matchesType = typeFilter === "Semua" || r.type === typeFilter;
      const matchesStatus = statusFilter === "Semua" || r.status === statusFilter;
      const matchesDept = departmentFilter === "Semua Departemen" || r.department === departmentFilter;
      const matchesKbk = kbkFilter === "Semua KBK" || r.kbks.includes(kbkFilter);
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || [r.title, r.lead, r.department, ...r.kbks, ...(r.topics||[]), ...(r.flagships||[])].join(" ").toLowerCase().includes(q);
      return matchesType && matchesStatus && matchesDept && matchesKbk && matchesSearch;
    });
  }, [typeFilter, statusFilter, departmentFilter, kbkFilter, search]);

  // Paginated Data
  const paginatedPortfolio = filteredPortfolio.slice((portPage - 1) * 5, portPage * 5);
  const paginatedPubs = publications.slice((pubPage - 1) * 5, pubPage * 5);
  const paginatedSci = scientists.slice((sciPage - 1) * 5, sciPage * 5);

  return (
    <main className="main-content">
      <section className="module-hero">
        <button className="back-button dark" onClick={onBack}><ArrowLeft size={15} /> Executive Overview</button>
        <div className="module-title-row">
          <div className="module-title-copy">
            <div className="eyebrow">01 · RESEARCH INTELLIGENCE</div>
            <h2>Penelitian & Riset</h2>
            <p>Portofolio riset Fakultas Teknik, kekuatan KBK, dan peluang kolaborasi lintas departemen.</p>
          </div>
          <div className="module-hero-kpi">
            <strong>1,248</strong>
            <span>Total Research Portfolio</span>
          </div>
        </div>
      </section>

      <section className="kpi-grid cols-5">
        {[
          ["326", "Sedang Berlangsung", "Active research"],
          ["587", "Telah Selesai", "Completed"],
          ["335", "Akan Berlangsung", "Planned / pipeline"],
          ["94", "Multi-KBK", "Cross-disciplinary"],
          ["42", "Lintas Departemen", "Cross-department"],
        ].map(([value, label, sub]) => (
          <div className="kpi-card" key={label}><div className="kpi-value">{value}</div><div className="kpi-label">{label}</div><div className="kpi-sub">{sub}</div></div>
        ))}
      </section>

      {/* 8 PRIORITAS NASIONAL */}
      <section className="national-priorities-section">
        <div className="section-heading compact-heading">
          <div><div className="eyebrow">NATIONAL STRATEGIC ALIGNMENT</div><h3>8 Prioritas Riset Nasional (STEM 2026)</h3></div>
          <p>Pemetaan portofolio riset dan kepakaran Fakultas Teknik UGM dalam mendukung agenda pembangunan industri strategis nasional.</p>
        </div>
        <div className="priorities-grid">
          {nationalPriorities.map((p) => {
            const Icon = iconMap[p.iconName];
            return (
              <div className="priority-card" key={p.id}>
                <div className="priority-card-header"><div className="priority-icon">{Icon ? <Icon size={18} /> : <span>?</span>}</div><strong>{p.title}</strong></div>
                <p>{p.desc}</p>
                <div className="priority-metric"><strong>{p.count}</strong> riset terkait</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5 FLAGSHIP UGM */}
      <section className="flagship-section">
        <div className="section-heading compact-heading">
          <div><div className="eyebrow">UNIVERSITY EXCELLENCE</div><h3>5 Research Flagships UGM</h3></div>
          <p>Fokus area riset unggulan untuk penyelesaian masalah bangsa dan kemanusiaan.</p>
        </div>
        <div className="priorities-grid cols-5">
          {ugmFlagships.map((f) => {
            const Icon = iconMap[f.iconName];
            return (
              <div className="priority-card" key={f.id}>
                <div className="priority-card-header"><div className="priority-icon">{Icon && <Icon size={18} />}</div><strong>{f.title}</strong></div>
                <p>{f.desc}</p>
                <div className="priority-metric"><strong>{f.count}</strong> inovasi terkait</div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="research-tabs">
        <button className={activeTab === "portfolio" ? "active" : ""} onClick={() => setActiveTab("portfolio")}><BookOpen size={16} /> Karsa-Teknika (Katalog)</button>
        <button className={activeTab === "kbk" ? "active" : ""} onClick={() => setActiveTab("kbk")}><Building2 size={16} /> Departemen & KBK</button>
        <button className={activeTab === "matrix" ? "active" : ""} onClick={() => setActiveTab("matrix")}><Network size={16} /> Collaboration Matrix</button>
      </div>

      {activeTab === "portfolio" && (
        <>
          <section className="panel filter-panel">
            <div className="filter-heading"><div><div className="eyebrow">PORTFOLIO FILTER</div><h3>Karsa-Teknika</h3></div><Filter size={17} className="muted" /></div>
            <div className="filters">
              <div className="search-box"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari judul, peneliti, KBK..." /></div>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option>Semua Output</option><option value="Penelitian">Penelitian</option><option value="HKI">HKI</option><option value="Paten">Paten</option>
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option>Semua Status</option><option>Aktif</option><option>Selesai</option><option>Direncanakan</option>
              </select>
              <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
                <option>Semua Departemen</option>
                {departments.map((d) => <option key={d.id}>{d.name}</option>)}
              </select>
              <select value={kbkFilter} onChange={(e) => setKbkFilter(e.target.value)}>
                <option>Semua KBK</option>
                {allKbks.map((k) => <option key={k.id}>{k.name}</option>)}
              </select>
            </div>
          </section>

          <section className="portfolio-layout">
            <div className="research-list">
              <div className="list-meta"><strong>{filteredPortfolio.length}</strong> inovasi ditemukan <span>· klik kartu untuk melihat detail</span></div>
              
              {paginatedPortfolio.map((r) => (
                <button key={r.id} className="research-card" onClick={() => setSelectedResearch(r)}>
                  <div className="research-card-top">
                    <div style={{display: 'flex', gap: 8}}>
                      <span className={`status-badge ${r.status.toLowerCase()}`}>{r.status}</span>
                      <span className={`type-badge type-${r.type.toLowerCase()}`}>{r.type === 'Penelitian' ? <Lightbulb size={12}/> : <FileBadge size={12}/>} {r.type}</span>
                    </div>
                    <span className="research-id">{r.id}</span>
                  </div>
                  <h3>{r.title}</h3>
                  <p>{r.abstract}</p>
                  <div className="research-meta"><span><Building2 size={13} /> {r.department}</span><span><Users size={13} /> {r.lead}</span><span><FileText size={13} /> {r.period}</span></div>
                  
                  {/* Tampilkan Tag KBK dan Flagship */}
                  <div className="tag-row">
                    {r.flagships?.map((f) => <span key={f} className="tag flagship-tag"><BadgeCheck size={11}/> {f}</span>)}
                    {r.kbks.map((k) => <span key={k} className="tag">{k}</span>)}
                  </div>
                  
                  <div className="research-card-bottom"><span>{r.funding}</span><span>{r.output}</span><ArrowRight size={16} /></div>
                </button>
              ))}
              {filteredPortfolio.length === 0 && <div className="empty-state">Tidak ada data yang sesuai dengan filter.</div>}
              
              <Pagination currentPage={portPage} totalItems={filteredPortfolio.length} itemsPerPage={5} onPageChange={setPortPage} />
            </div>

            <aside className="research-side">
              <div className="panel opportunity-panel kbk-finder-panel">
                <div className="eyebrow">STRATEGIC INTELLIGENCE</div><h3>Find Potential KBK</h3>
                <p>Masukkan topik, teknologi, atau bidang riset untuk menemukan KBK yang berpotensi dilibatkan lintas departemen.</p>
                <div className="kbk-search-box">
                  <Search size={17} /><input value={opportunityQuery} onChange={(e) => setOpportunityQuery(e.target.value)} placeholder="Contoh: kelistrikan, material..." />
                  {opportunityQuery && <button onClick={() => setOpportunityQuery("")}><X size={15} /></button>}
                </div>
                {!opportunityQuery ? (
                  <div className="finder-empty"><Sparkles size={20} /><strong>Research Opportunity Finder</strong><span>Ketik sebuah topik untuk melihat KBK.</span>
                    <div className="suggestion-row">{["Material", "AI", "Air", "Bencana"].map((item) => <button key={item} onClick={() => setOpportunityQuery(item)}>{item}</button>)}</div>
                  </div>
                ) : (
                  <div className="kbk-match-list">
                    <div className="match-heading"><span>Potential KBK</span><strong>{opportunityMatches.length} matches</strong></div>
                    {opportunityMatches.map((kbk) => (
                      <div className="kbk-match-card" key={kbk.id}>
                        <div className="kbk-match-main"><span className={`kbk-dot ${kbk.color}`} /><div><strong>{kbk.name}</strong><small>{kbk.department}</small></div></div>
                        <div className="match-score"><strong>{kbk.score}%</strong><span>match</span></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </section>
        </>
      )}

      {activeTab === "kbk" && <DepartmentKbkView />}
      {activeTab === "matrix" && <CollaborationMatrix />}

      {/* INDIKATOR RISET BERDAMPAK */}
      <section className="impactful-research-section">
        <div className="section-heading compact-heading">
          <div><div className="eyebrow">HILIRISASI & PARTNERSHIP</div><h3>Indikator Riset Berdampak</h3></div>
          <p>Tinjauan strategis terhadap hilirisasi inovasi, pemanfaatan HKI, dan kolaborasi industri bernilai tinggi.</p>
        </div>
        <div className="kpi-grid">
          <div className="kpi-card"><div className="kpi-value" style={{color:'#1e3a8a'}}>Rp 128 Jt</div><div className="kpi-label">Rasio Dana per Dosen</div><div className="kpi-sub">Baseline FT: Target Rp 150 Juta/dosen</div></div>
          <div className="kpi-card"><div className="kpi-value" style={{color:'#059669'}}>+24.5%</div><div className="kpi-label">Kenaikan Royalti HKI</div><div className="kpi-sub">Dibandingkan tahun 2025 (12%)</div></div>
          <div className="kpi-card"><div className="kpi-value" style={{color:'#d97706'}}>12 Kontrak</div><div className="kpi-label">Jumlah PKS di atas Rp 1 M</div><div className="kpi-sub">Naik 3 kontrak dari tahun sebelumnya</div></div>
          <div className="kpi-card"><div className="kpi-value" style={{color:'#4338ca'}}>Rp 85.4 M</div><div className="kpi-label">Total Nilai PKS Industri</div><div className="kpi-sub">Akumulasi dari 85 kontrak aktif</div></div>
        </div>
      </section>

      <section className="research-bottom-grid">
        <div className="panel publications-panel">
          <div className="panel-heading"><div><div className="eyebrow">RESEARCH OUTPUT</div><h3>Top Publikasi Terbaru / Strategis</h3></div><span className="panel-chip">Scopus Q1/Q2</span></div>
          <div className="publication-table">
            {paginatedPubs.map((p) => (
              <div className="publication-row" key={p.title}>
                <b>#{p.rank}</b><div><strong>{p.title}</strong><span>{p.author} · {p.journal}</span></div><small>{p.year}</small><em>{p.citations} cites</em>
              </div>
            ))}
          </div>
          <div style={{marginTop: 15, borderTop: '1px solid #e2e8f0', paddingTop: 10}}>
             <Pagination currentPage={pubPage} totalItems={publications.length} itemsPerPage={5} onPageChange={setPubPage} />
          </div>
        </div>

        <div className="panel scientists-panel">
          <div className="panel-heading"><div><div className="eyebrow">RESEARCH RECOGNITION</div><h3>Top 5% Scientists</h3></div><Sparkles size={18} className="muted" /></div>
          {paginatedSci.map((s) => (
            <div className="scientist-row" key={s.name}><div className="scientist-avatar">{s.name.split(" ").slice(-1)[0].slice(0,2).toUpperCase()}</div><div style={{flex: 1}}><strong>{s.name}</strong><span>{s.field}</span></div><em>{s.impact}</em></div>
          ))}
          <div style={{marginTop: 15, borderTop: '1px solid #e2e8f0', paddingTop: 10}}>
             <Pagination currentPage={sciPage} totalItems={scientists.length} itemsPerPage={5} onPageChange={setSciPage} />
          </div>
        </div>
      </section>

      {selectedResearch && (
        <div className="modal-backdrop" onClick={() => setSelectedResearch(null)}>
          <div className="research-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedResearch(null)}><X size={18} /></button>
            <div className="eyebrow">PORTFOLIO DETAIL · {selectedResearch.id}</div>
            
            <div style={{display: 'flex', gap: 8, marginTop: 6}}>
              <span className={`status-badge ${selectedResearch.status.toLowerCase()}`}>{selectedResearch.status}</span>
              <span className={`type-badge type-${selectedResearch.type.toLowerCase()}`}>{selectedResearch.type}</span>
            </div>
            
            <h2>{selectedResearch.title}</h2>
            <p className="modal-abstract">{selectedResearch.abstract}</p>
            <div className="detail-grid">
              <div><span>Lead / Inventor</span><strong>{selectedResearch.lead}</strong></div>
              <div><span>Department</span><strong>{selectedResearch.department}</strong></div>
              <div><span>Period</span><strong>{selectedResearch.period}</strong></div>
              <div><span>Output / Ref</span><strong>{selectedResearch.output}</strong></div>
            </div>
            
            {selectedResearch.flagships && selectedResearch.flagships.length > 0 && (
              <>
                <div className="eyebrow modal-subhead">UGM RESEARCH FLAGSHIPS</div>
                <div className="tag-row large">{selectedResearch.flagships.map((f) => <span className="tag flagship-tag" key={f}><BadgeCheck size={12}/> {f}</span>)}</div>
              </>
            )}

            <div className="eyebrow modal-subhead">INVOLVED KBK</div>
            <div className="tag-row large">{selectedResearch.kbks.map((k) => <span className="tag" key={k}>{k}</span>)}</div>
            <div className="modal-footer" style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16, marginTop: 16 }}>
              <button 
                onClick={() => setShowPitchModal(true)}
                style={{ width: "100%", background: "#0b5ea8", color: "#fff", padding: "12px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}
              >
                Prospect to Reka Ventura <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REKA VENTURA (PITCHING TO MITRA) */}
      {showPitchModal && selectedResearch && (
        <div className="modal-backdrop" onClick={() => setShowPitchModal(false)} style={{ zIndex: 1000 }}>
          <div className="research-modal" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPitchModal(false)}><X size={18} /></button>
            <div className="eyebrow" style={{ color: "#059669" }}>REKA VENTURA · COMMERCIAL PROSPECT</div>
            <h2 style={{ fontSize: 24, margin: "8px 0" }}>{selectedResearch.title}</h2>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
              Riset ini telah mencapai tingkat kematangan teknologi (TRL) tingkat lanjut. Kami membuka peluang <strong>Hilirisasi Riset</strong> menjadi lisensi komersial untuk hilirisasi produk bersama mitra DUDI.
            </p>
            
            <div style={{ background: "#f8fafc", padding: 16, borderRadius: 12, border: "1px solid #e2e8f0", marginTop: 20 }}>
              <strong style={{ fontSize: 13, color: "#102a43", display: "block", marginBottom: 12 }}>Potensi Valuasi & Dampak Industri</strong>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ background: "#fff", padding: 16, borderRadius: 8, border: "1px solid #cbd5e1" }}>
                  <div style={{ color: "#64748b", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>ESTIMASI ROI / EFISIENSI</div>
                  <strong style={{ fontSize: 24, color: "#16a34a" }}>Up to 35%</strong>
                </div>
                <div style={{ background: "#fff", padding: 16, borderRadius: 8, border: "1px solid #cbd5e1" }}>
                  <div style={{ color: "#64748b", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>STATUS HKI</div>
                  <strong style={{ fontSize: 18, color: "#ea580c" }}>{selectedResearch.type === 'Paten' ? 'Paten Granted' : 'Drafting Paten'}</strong>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <button style={{ background: "#102a43", color: "#fff", padding: "10px 16px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>Generate Pitch Deck (PDF)</button>
              <button style={{ background: "#fff", color: "#102a43", padding: "10px 16px", borderRadius: 8, border: "1px solid #cbd5e1", fontWeight: 700, cursor: "pointer" }}>Hubungi Inventor</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function DepartmentKbkView() {
  const [expanded, setExpanded] = useState("dtap");
  return (
    <section className="kbk-section">
      <div className="section-heading compact-heading"><div><div className="eyebrow">KNOWLEDGE STRUCTURE</div><h3>Departemen & Kelompok Bidang Keahlian</h3></div></div>
      <div className="department-grid">
        {departments.map((d) => (
          <div className={`department-card ${expanded === d.id ? "expanded" : ""}`} key={d.id}>
            <button className="department-head" onClick={() => setExpanded(expanded === d.id ? "" : d.id)}>
              <div className="dept-code">{d.short}</div><div><strong>{d.name}</strong><span>{d.kbks.length} KBK terdaftar</span></div><ChevronDown size={18} />
            </button>
            {expanded === d.id && (
              <div className="kbk-list">
                {d.kbks.map((k) => <div className="kbk-item" key={k.id}><span className={`kbk-dot ${k.color}`} /><div><strong>{k.name}</strong><small>Research portfolio · dummy</small></div><ArrowRight size={15} /></div>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function CollaborationMatrix() {
  const matrix = [
    ["Desain Arsitektur", "—", "●", "○", "○", "●", "○", "○", "○"],
    ["Energi Listrik Cerdas", "●", "—", "●", "●", "○", "●", "○", "●"],
    ["Integrasi Manufaktur", "○", "●", "—", "●", "●", "○", "○", "○"],
    ["Struktur & Infrastruktur", "○", "●", "●", "—", "○", "●", "●", "○"],
    ["Advanced Material", "●", "○", "●", "○", "—", "●", "○", "●"],
    ["Geoinformatika", "○", "●", "○", "●", "●", "—", "●", "○"],
    ["Eksplorasi Panas Bumi", "○", "○", "○", "●", "○", "●", "—", "●"],
    ["Energi Nuklir", "○", "●", "○", "○", "●", "○", "●", "—"]
  ];
  const headers = ["Arsitektur", "Elektro", "Mesin", "Sipil", "Kimia", "Geodesi", "Geologi", "Nuklir"];

  return (
    <section className="panel matrix-panel">
      <div className="panel-heading"><div><div className="eyebrow">CROSS-DISCIPLINARY INTELLIGENCE</div><h3>Matriks Kolaborasi Antar-KBK Strategis</h3></div><span className="panel-chip">Top KBKs</span></div>
      <p className="matrix-intro">Menampilkan sampel irisan kolaborasi riset antar-KBK unggulan dari 8 Departemen.</p>
      <div className="matrix-wrap">
        <table className="matrix-table">
          <thead><tr><th>Top KBK per Dept.</th>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {matrix.map((row) => (
              <tr key={row[0]}>
                <th>{row[0]}</th>
                {row.slice(1).map((cell, j) => (<td key={j}><button className={`matrix-cell ${cell === "●" ? "strong" : cell === "○" ? "potential" : "none"}`}>{cell}</button></td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ResearchPage;