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
  const [showFundingModal, setShowFundingModal] = useState(false);

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
          {/* KARTU PENDANAAN RISET YANG BISA DIKLIK */}
          <button 
            className="kpi-card metric-hover-card" 
            onClick={() => setShowFundingModal(true)}
            style={{ textAlign: "left", cursor: "pointer", border: "1px solid #e2e8f0", background: "#fff", display: "block", width: "100%" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div className="kpi-value" style={{ color: '#1e3a8a' }}>Rp {ResearchData.fundingMetrics.faculty.median} Jt</div>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, marginBottom: 8 }}>MEDIAN</div>
            </div>
            <div className="kpi-label" style={{ marginTop: 4 }}>Rasio Dana Riset per Dosen</div>
            <div className="kpi-sub" style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Rata-rata (Mean):</span>
                <strong style={{ color: "#334155" }}>Rp {ResearchData.fundingMetrics.faculty.mean} Jt</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Target FT:</span>
                <strong style={{ color: "#059669" }}>Rp {ResearchData.fundingMetrics.faculty.target} Jt</strong>
              </div>
            </div>
          </button>
          
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

      {/* MODAL RASIONALISASI PENDANAAN RISET */}
      {showFundingModal && (
        <div className="modal-backdrop" onClick={() => setShowFundingModal(false)} style={{ zIndex: 1000, padding: 20 }}>
          <div className="research-modal" style={{ maxWidth: 850, width: "100%", maxHeight: "90vh", overflowY: "auto", background: "#f8fafc", padding: 30 }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowFundingModal(false)}><X size={20} /></button>
            
            <div style={{ marginBottom: 24 }}>
              <div className="eyebrow" style={{ color: "#059669" }}>EVALUASI STRATEGIS & RASIONALISASI</div>
              <h2 style={{ fontSize: 22, color: "#0f172a", margin: "4px 0 8px" }}>Sebaran Dana Riset per Departemen</h2>
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, margin: 0 }}>
                Penggunaan <strong>Nilai Tengah (Median)</strong> memberikan gambaran riil kondisi pendanaan mayoritas dosen, menghilangkan bias dari segelintir hibah bernilai raksasa yang mendistorsi nilai <strong>Rata-rata (Mean)</strong>.
              </p>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left" }}>
                <thead style={{ background: "#f1f5f9" }}>
                  <tr>
                    <th style={{ padding: "14px 16px", borderBottom: "1px solid #cbd5e1", color: "#334155" }}>Departemen</th>
                    <th style={{ padding: "14px 16px", borderBottom: "1px solid #cbd5e1", textAlign: "right", color: "#334155" }}>Rata-rata (Mean)</th>
                    <th style={{ padding: "14px 16px", borderBottom: "1px solid #cbd5e1", textAlign: "right", color: "#1e3a8a", fontWeight: 800 }}>Nilai Tengah (Median)</th>
                    <th style={{ padding: "14px 16px", borderBottom: "1px solid #cbd5e1", textAlign: "right", color: "#334155" }}>Target</th>
                    <th style={{ padding: "14px 16px", borderBottom: "1px solid #cbd5e1", color: "#334155", width: "25%" }}>Capaian (Median vs Target)</th>
                  </tr>
                </thead>
                <tbody>
                  {ResearchData.fundingMetrics.departments.map((d, idx) => {
                    const achievement = Math.min(100, (d.median / d.target) * 100);
                    const statusColor = achievement < 40 ? "#dc2626" : achievement < 60 ? "#d97706" : "#059669";
                    
                    return (
                      <tr key={d.id} style={{ borderBottom: "1px solid #f1f5f9" }} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "12px 16px", fontWeight: 600, color: "#0f172a" }}>
                          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, marginBottom: 2 }}>{d.id}</div>
                          {d.name}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right", color: "#64748b" }}>Rp {d.mean} Jt</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", color: "#1e3a8a", fontWeight: 800, fontSize: 14 }}>Rp {d.median} Jt</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", color: "#059669", fontWeight: 700 }}>Rp {d.target} Jt</td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                              <div style={{ width: `${achievement}%`, height: "100%", background: statusColor, borderRadius: 4 }}></div>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: statusColor, width: 35, textAlign: "right" }}>
                              {achievement.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
  const [useBubbles, setUseBubbles] = useState(true);

  const matrix = [
    ["Desain Arsitektur", 0, 14, 3, 2, 12, 4, 1, 2],
    ["Energi Listrik Cerdas", 14, 0, 8, 16, 5, 9, 3, 18],
    ["Integrasi Manufaktur", 3, 8, 0, 11, 15, 6, 2, 4],
    ["Struktur & Infrastruktur", 2, 16, 11, 0, 4, 14, 10, 5],
    ["Advanced Material", 12, 5, 15, 4, 0, 7, 5, 16],
    ["Geoinformatika", 4, 9, 6, 14, 7, 0, 12, 3],
    ["Eksplorasi Panas Bumi", 1, 3, 2, 10, 5, 12, 0, 14],
    ["Energi Nuklir", 2, 18, 4, 5, 16, 3, 14, 0]
  ];
  
  const headers = ["Arsitektur", "Elektro", "Mesin", "Sipil", "Kimia", "Geodesi", "Geologi", "Nuklir"];

  return (
    <section className="panel matrix-panel">
      <div className="panel-heading" style={{ marginBottom: 16 }}>
        <div>
          <div className="eyebrow">CROSS-DISCIPLINARY INTELLIGENCE</div>
          <h3>Matriks Kolaborasi Antar-KBK Strategis</h3>
        </div>
        
        {/* TOGGLE ON/OFF BUBBLE VISUALIZATION */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Visualisasi Proporsional</span>
          <button 
            onClick={() => setUseBubbles(!useBubbles)}
            style={{ 
              width: 44, height: 24, borderRadius: 20, 
              background: useBubbles ? '#059669' : '#cbd5e1', 
              position: 'relative', border: 'none', cursor: 'pointer', transition: '0.3s' 
            }}
            title="Toggle visualisasi proporsional"
          >
            <div 
              style={{ 
                width: 18, height: 18, borderRadius: '50%', background: '#fff', 
                position: 'absolute', top: 3, left: useBubbles ? 23 : 3, 
                transition: '0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' 
              }} 
            />
          </button>
        </div>
      </div>
      
      <p className="matrix-intro" style={{ marginBottom: 20 }}>
        Menampilkan volume irisan kolaborasi riset antar-KBK unggulan dari 8 Departemen. 
        {useBubbles ? " Semakin besar dan biru lingkaran, semakin intensif kolaborasi yang terjalin." : " Angka menunjukkan jumlah proyek lintas disiplin."}
      </p>
      
      <div className="matrix-wrap" style={{ overflowX: "auto" }}>
        <table className="matrix-table" style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', paddingBottom: 16 }}>Top KBK per Dept.</th>
              {headers.map((h) => <th key={h} style={{ paddingBottom: 16, fontSize: 11, color: '#475569' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={row[0]} style={{ borderTop: "1px solid #f1f5f9" }}>
                <th style={{ textAlign: 'left', whiteSpace: 'nowrap', padding: "12px 16px 12px 0", fontSize: 12, color: '#1e293b' }}>
                  {row[0]}
                </th>
                {row.slice(1).map((val, j) => {
                  const isSelf = i === j;
                  const bubbleSize = val === 0 ? 0 : 16 + (val * 1.3);
                  
                  // Tentukan status kolaborasi untuk pewarnaan
                  const isStrong = val > 10;
                  const bubbleClass = isStrong ? "bubble-strong" : "bubble-potential";
                  const textColor = isStrong ? "#0b5ea8" : "#d97706";
                  
                  return (
                    <td key={j} style={{ height: 48, minWidth: 48, verticalAlign: 'middle' }}>
                      {isSelf ? (
                        <span style={{ color: '#cbd5e1', fontWeight: 800 }}>—</span>
                      ) : useBubbles ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          {val > 0 ? (
                            <div 
                              title={`${row[0]} & ${headers[j]}: ${val} Kolaborasi`}
                              className={`hover-bubble ${bubbleClass}`}
                              style={{
                                width: bubbleSize, 
                                height: bubbleSize, 
                                fontSize: val > 5 ? 11 : 0, 
                                fontWeight: 800,
                              }}
                            >
                              {val > 5 ? val : ''}
                            </div>
                          ) : (
                            <span style={{ color: '#e2e8f0', fontSize: 10 }}>0</span>
                          )}
                        </div>
                      ) : (
                        <strong style={{ color: textColor, fontSize: 13 }}>
                          {val}
                        </strong>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legend Dinamis dengan Warna */}
      {useBubbles && (
        <div className="matrix-legend" style={{ marginTop: 24, padding: "12px 16px", background: "#f8fafc", borderRadius: 8, display: "flex", gap: 20 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(11, 94, 168, 0.15)', border: '1px solid rgba(11, 94, 168, 0.5)' }}/> Kolaborasi Kuat ({'>'}10)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569' }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(217, 119, 6, 0.15)', border: '1px solid rgba(217, 119, 6, 0.5)' }}/> Potensi / Minor (1-10)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569' }}>
            <span style={{ color: '#cbd5e1', fontWeight: 800 }}>—</span> Tidak Ada / Self
          </span>
        </div>
      )}
    </section>
  );
}

export default ResearchPage;