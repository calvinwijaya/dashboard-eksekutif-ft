import React, { useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, Building2, ChevronDown, 
  ExternalLink, FileText, Filter, Network, Search, 
  Sparkles, Users, X, HeartPulse, Leaf, Cpu, Factory, Shield, Layers, Zap, Anchor
} from "lucide-react";
import "./styles.css";
import ResearchData from "../data/ResearchData.json";

const { departments, kbkExpertise, researches, publications, scientists, nationalPriorities } = ResearchData;

const iconMap = {
  HeartPulse: HeartPulse,
  Leaf: Leaf,
  Cpu: Cpu,
  Factory: Factory,
  Shield: Shield,
  Layers: Layers,
  Zap: Zap,
  Anchor: Anchor
};

function ResearchPage({ onBack }) {
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [departmentFilter, setDepartmentFilter] = useState("Semua Departemen");
  const [kbkFilter, setKbkFilter] = useState("Semua KBK");
  const [search, setSearch] = useState("");
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [opportunityQuery, setOpportunityQuery] = useState("");

  const allKbks = departments.flatMap((d) => d.kbks.map((k) => ({ ...k, department: d.name })));

  const opportunityMatches = useMemo(() => {
    const query = opportunityQuery.trim().toLowerCase();

    if (!query) return [];

    const queryTerms = query
      .split(/\s+/)
      .filter(Boolean);

    return allKbks
      .map((kbk) => {
        const expertise = kbkExpertise[kbk.name]?.keywords || [];

        let score = 0;

        queryTerms.forEach((term) => {
          expertise.forEach((keyword) => {
            if (
              keyword.includes(term) ||
              term.includes(keyword)
            ) {
              score += keyword === term ? 30 : 15;
            }
          });

          if (kbk.name.toLowerCase().includes(term)) {
            score += 40;
          }
        });

        return {
          ...kbk,
          score: Math.min(score, 100),
          expertise,
        };
      })
      .filter((kbk) => kbk.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [opportunityQuery, allKbks]);

  const filtered = useMemo(() => {
    return researches.filter((r) => {
      const matchesStatus = statusFilter === "Semua" || r.status === statusFilter;
      const matchesDepartment = departmentFilter === "Semua Departemen" || r.department === departmentFilter;
      const matchesKbk = kbkFilter === "Semua KBK" || r.kbks.includes(kbkFilter);
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || [r.title, r.lead, r.department, ...r.kbks, ...r.topics].join(" ").toLowerCase().includes(q);
      return matchesStatus && matchesDepartment && matchesKbk && matchesSearch;
    });
  }, [statusFilter, departmentFilter, kbkFilter, search]);

  return (
    <main className="main-content">
      <section className="module-hero">
        <button className="back-button dark" onClick={onBack}>
          <ArrowLeft size={15} /> Executive Overview
        </button>
        <div className="module-title-row">
          <div className="module-title-copy">
            <div className="eyebrow">01 · RESEARCH INTELLIGENCE</div>
            <h2>Penelitian & Riset</h2>
            <p>Melihat portofolio riset Fakultas Teknik, kekuatan KBK, dan peluang kolaborasi lintas departemen.</p>
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
          <div className="kpi-card" key={label}>
            <div className="kpi-value">{value}</div>
            <div className="kpi-label">{label}</div>
            <div className="kpi-sub">{sub}</div>
          </div>
        ))}
      </section>

      <section className="national-priorities-section">
        <div className="section-heading compact-heading">
          <div>
            <div className="eyebrow">NATIONAL STRATEGIC ALIGNMENT</div>
            <h3>8 Prioritas Riset Nasional (STEM 2026)</h3>
          </div>
          <p>
            Pemetaan portofolio riset dan kepakaran Fakultas Teknik UGM dalam 
            merespons serta mendukung agenda pembangunan industri strategis nasional.
          </p>
        </div>

        <div className="priorities-grid">
          {nationalPriorities.map((p) => {
            const Icon = iconMap[p.iconName]
            return (
              <div className="priority-card" key={p.id}>
                <div className="priority-card-header">
                  <div className="priority-icon">
                    {Icon ? <Icon size={18} /> : <span>?</span>}
                  </div>
                  <strong>{p.title}</strong>
                </div>
                <p>{p.desc}</p>
                <div className="priority-metric">
                  <strong>{p.count}</strong> riset terkait
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="research-tabs">
        <button className={activeTab === "portfolio" ? "active" : ""} onClick={() => setActiveTab("portfolio")}><BookOpen size={16} /> Research Portfolio</button>
        <button className={activeTab === "kbk" ? "active" : ""} onClick={() => setActiveTab("kbk")}><Building2 size={16} /> Departemen & KBK</button>
        <button className={activeTab === "matrix" ? "active" : ""} onClick={() => setActiveTab("matrix")}><Network size={16} /> Collaboration Matrix</button>
      </div>

      {activeTab === "portfolio" && (
        <>
          <section className="panel filter-panel">
            <div className="filter-heading"><div><div className="eyebrow">CATALOG FILTER</div><h3>Katalog Riset</h3></div><Filter size={17} className="muted" /></div>
            <div className="filters">
              <div className="search-box"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari judul, peneliti, KBK, topik..." /></div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option>Semua</option><option>Aktif</option><option>Selesai</option><option>Direncanakan</option>
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
              <div className="list-meta"><strong>{filtered.length}</strong> riset ditampilkan <span>· klik kartu untuk melihat detail</span></div>
              {filtered.map((r) => (
                <button key={r.id} className="research-card" onClick={() => setSelectedResearch(r)}>
                  <div className="research-card-top">
                    <span className={`status-badge ${r.status.toLowerCase()}`}>{r.status}</span>
                    <span className="research-id">{r.id}</span>
                  </div>
                  <h3>{r.title}</h3>
                  <p>{r.abstract}</p>
                  <div className="research-meta"><span><Building2 size={13} /> {r.department}</span><span><Users size={13} /> {r.lead}</span><span><FileText size={13} /> {r.period}</span></div>
                  <div className="tag-row">{r.kbks.map((k) => <span key={k} className="tag">{k}</span>)}</div>
                  <div className="research-card-bottom"><span>{r.funding}</span><span>{r.output}</span><ArrowRight size={16} /></div>
                </button>
              ))}
              {filtered.length === 0 && <div className="empty-state">Tidak ada riset yang sesuai dengan filter.</div>}
            </div>

            <aside className="research-side">
              <div className="panel opportunity-panel kbk-finder-panel">
                <div className="eyebrow">STRATEGIC INTELLIGENCE</div>

                <h3>
                  Find Potential KBK
                </h3>

                <p>
                  Masukkan topik, teknologi, atau bidang riset untuk menemukan
                  KBK yang berpotensi dilibatkan lintas departemen.
                </p>

                <div className="kbk-search-box">
                  <Search size={17} />

                  <input
                    value={opportunityQuery}
                    onChange={(e) => setOpportunityQuery(e.target.value)}
                    placeholder="Contoh: kelistrikan, AI, energi..."
                  />

                  {opportunityQuery && (
                    <button onClick={() => setOpportunityQuery("")}>
                      <X size={15} />
                    </button>
                  )}
                </div>

                {!opportunityQuery ? (
                  <div className="finder-empty">
                    <Sparkles size={20} />

                    <strong>Research Opportunity Finder</strong>

                    <span>
                      Ketik sebuah topik untuk melihat KBK yang
                      memiliki kompetensi terkait.
                    </span>

                    <div className="suggestion-row">
                      {["Kelistrikan", "AI", "Energi", "Digital Twin"].map((item) => (
                        <button
                          key={item}
                          onClick={() => setOpportunityQuery(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="kbk-match-list">

                    <div className="match-heading">
                      <span>
                        Potential KBK
                      </span>

                      <strong>
                        {opportunityMatches.length} matches
                      </strong>
                    </div>

                    {opportunityMatches.length > 0 ? (
                      opportunityMatches.map((kbk) => (
                        <div
                          className="kbk-match-card"
                          key={kbk.id}
                        >
                          <div className="kbk-match-main">

                            <span className={`kbk-dot ${kbk.color}`} />

                            <div>
                              <strong>{kbk.name}</strong>

                              <small>
                                {kbk.department}
                              </small>
                            </div>

                          </div>

                          <div className="match-score">
                            <strong>{kbk.score}%</strong>

                            <span>match</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="finder-no-result">
                        Tidak ditemukan KBK yang relevan.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="panel recent-panel">
                <div className="panel-heading"><div><div className="eyebrow">LATEST OUTPUT</div><h3>Riset & Publikasi Terbaru</h3></div></div>
                {publications.slice(0, 3).map((p) => (
                  <div className="mini-publication" key={p.rank}><span>0{p.rank}</span><div><strong>{p.title}</strong><small>{p.journal} · {p.year}</small></div></div>
                ))}
              </div>
            </aside>
          </section>
        </>
      )}

      {activeTab === "kbk" && <DepartmentKbkView />}
      {activeTab === "matrix" && <CollaborationMatrix />}

      <section className="research-bottom-grid">
        <div className="panel publications-panel">
          <div className="panel-heading"><div><div className="eyebrow">RESEARCH OUTPUT</div><h3>Top 5 Publikasi Terbaru / Strategis</h3></div><span className="panel-chip">Dummy dataset</span></div>
          <div className="publication-table">
            {publications.map((p) => (
              <div className="publication-row" key={p.rank}>
                <b>#{p.rank}</b><div><strong>{p.title}</strong><span>{p.author} · {p.journal}</span></div><small>{p.year}</small><em>{p.citations} cites</em>
              </div>
            ))}
          </div>
        </div>
        <div className="panel scientists-panel">
          <div className="panel-heading"><div><div className="eyebrow">RESEARCH RECOGNITION</div><h3>Top 5% Scientists</h3></div><Sparkles size={18} className="muted" /></div>
          {scientists.map((s) => (
            <div className="scientist-row" key={s.name}><div className="scientist-avatar">{s.name.split(" ").slice(-1)[0].slice(0,2).toUpperCase()}</div><div><strong>{s.name}</strong><span>{s.field}</span></div><em>{s.impact}</em></div>
          ))}
        </div>
      </section>

      {selectedResearch && (
        <div className="modal-backdrop" onClick={() => setSelectedResearch(null)}>
          <div className="research-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedResearch(null)}><X size={18} /></button>
            <div className="eyebrow">RESEARCH DETAIL · {selectedResearch.id}</div>
            <span className={`status-badge ${selectedResearch.status.toLowerCase()}`}>{selectedResearch.status}</span>
            <h2>{selectedResearch.title}</h2>
            <p className="modal-abstract">{selectedResearch.abstract}</p>
            <div className="detail-grid">
              <div><span>Lead Researcher</span><strong>{selectedResearch.lead}</strong></div>
              <div><span>Department</span><strong>{selectedResearch.department}</strong></div>
              <div><span>Period</span><strong>{selectedResearch.period}</strong></div>
              <div><span>Funding</span><strong>{selectedResearch.funding}</strong></div>
            </div>
            <div className="eyebrow modal-subhead">INVOLVED KBK</div>
            <div className="tag-row large">{selectedResearch.kbks.map((k) => <span className="tag" key={k}>{k}</span>)}</div>
            <div className="eyebrow modal-subhead">RESEARCH THEMES</div>
            <div className="tag-row large">{selectedResearch.topics.map((k) => <span className="tag soft" key={k}>{k}</span>)}</div>
            <div className="modal-footer"><button className="primary-small">Open full research record <ExternalLink size={14} /></button></div>
          </div>
        </div>
      )}
    </main>
  );
}

function DepartmentKbkView() {
  const [expanded, setExpanded] = useState("geodesi");
  return (
    <section className="kbk-section">
      <div className="section-heading compact-heading">
        <div><div className="eyebrow">KNOWLEDGE STRUCTURE</div><h3>Departemen & Kelompok Bidang Keahlian</h3></div>
        <p>Contoh struktur data yang dapat diperluas saat KBK lain dimasukkan.</p>
      </div>
      <div className="department-grid">
        {departments.map((d) => (
          <div className={`department-card ${expanded === d.id ? "expanded" : ""}`} key={d.id}>
            <button className="department-head" onClick={() => setExpanded(expanded === d.id ? "" : d.id)}>
              <div className="dept-code">{d.short}</div>
              <div><strong>{d.name}</strong><span>{d.kbks.length} KBK terdaftar</span></div>
              <ChevronDown size={18} />
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
  // Matriks Strategis 8x8 yang mewakili 8 Departemen
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
      <div className="panel-heading">
        <div>
          <div className="eyebrow">CROSS-DISCIPLINARY INTELLIGENCE</div>
          <h3>Matriks Kolaborasi Antar-KBK Strategis</h3>
        </div>
        <span className="panel-chip">Representative Top KBKs</span>
      </div>
      <p className="matrix-intro">
        Menampilkan sampel irisan kolaborasi riset antar-KBK unggulan dari 8 Departemen. 
        Semakin kuat indikator, semakin tinggi potensi atau histori kolaborasi.
      </p>
      <div className="matrix-wrap">
        <table className="matrix-table">
          <thead>
            <tr>
              <th>Top KBK per Dept.</th>
              {headers.map((h) => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={row[0]}>
                <th>{row[0]}</th>
                {row.slice(1).map((cell, j) => (
                  <td key={j}>
                    <button 
                      className={`matrix-cell ${cell === "●" ? "strong" : cell === "○" ? "potential" : "none"}`} 
                      title={cell === "●" ? "Kolaborasi aktif / kuat" : cell === "○" ? "Potensi kolaborasi" : "Self"}
                    >
                      {cell}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="matrix-legend">
        <span><i className="legend-strong" /> Strong / existing</span>
        <span><i className="legend-potential" /> Potential</span>
        <span><i className="legend-none" /> Self / none</span>
      </div>
    </section>
  );
}

export default ResearchPage;
