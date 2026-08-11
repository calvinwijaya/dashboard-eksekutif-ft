import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, Building2, Filter, MapPin, Users,
  Handshake, TrendingUp, Leaf, X, Cpu, Droplet, Home
} from "lucide-react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import CommunityData from "../data/CommunityData.json";
const { communityPrograms, komuniversitas, impactIndicators, partners, departmentMatrix, departmentHeaders } = CommunityData;

// Icon Map untuk Komuniversitas
const iconMap = {
  Leaf: Leaf,
  Cpu: Cpu,
  Droplet: Droplet,
  Home: Home
};

// Komponen Pagination
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

// Helpers GeoJSON
function getFeatureName(properties = {}) {
  return properties.Kabupaten || properties.Kab_Kota || properties.kabupaten || properties.WADMKK || "Wilayah";
}
function getFeatureCount(properties = {}) {
  const candidates = [properties.Jumlah_Pengabdian, properties.jumlah_pengabdian, properties.jumlah, properties.count];
  const value = candidates.find((v) => v !== undefined && v !== null && v !== "");
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

// Peta Komunitas
function CommunityMap({ onSelectRegion }) {
  const [geojson, setGeojson] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/sebaran_pengabdian.geojson")
      .then((res) => { if (!res.ok) throw new Error("GeoJSON tidak dimuat"); return res.json(); })
      .then((data) => setGeojson(data))
      .catch((err) => setError(err.message));
  }, []);

  const maxCount = useMemo(() => {
    if (!geojson?.features?.length) return 1;
    return Math.max(...geojson.features.map((f) => getFeatureCount(f.properties)), 1);
  }, [geojson]);

  const getColor = (count) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return "#14532d";
    if (ratio > 0.6) return "#2f7d4f";
    if (ratio > 0.4) return "#5f9f70";
    if (ratio > 0.2) return "#91bd8f";
    return "#d8e8d3";
  };

  const style = (feature) => ({ fillColor: getColor(getFeatureCount(feature?.properties)), weight: 1.2, opacity: 1, color: "#ffffff", fillOpacity: 0.78 });

  const onEachFeature = (feature, layer) => {
    const name = getFeatureName(feature.properties);
    const count = getFeatureCount(feature.properties);
    layer.bindTooltip(`${name}<br/><strong>${count} kegiatan</strong>`, { sticky: true, direction: "top" });
    layer.on({
      mouseover: (e) => e.target.setStyle({ weight: 2.2, color: "#16324f", fillOpacity: 0.9 }),
      mouseout: (e) => e.target.setStyle(style(feature)),
      click: () => onSelectRegion({ name, count }),
    });
  };

  if (error) return <div className="map-error"><MapPin size={20} /><strong>Error</strong><span>{error}</span></div>;

  return (
    <MapContainer center={[-7.7956, 110.3695]} zoom={10} scrollWheelZoom={true} className="community-map">
      <TileLayer attribution='&copy; OSM' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {geojson && <GeoJSON data={geojson} style={style} onEachFeature={onEachFeature} />}
    </MapContainer>
  );
}

export default function CommunityPage({ onBack }) {
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [departmentFilter, setDepartmentFilter] = useState("Semua Departemen");
  const [search, setSearch] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [portPage, setPortPage] = useState(1);
  const [selectedKomuniv, setSelectedKomuniv] = useState(null);
  const [showPitchModal, setShowPitchModal] = useState(false);

  // Reset pagination saat filter diubah
  useEffect(() => { setPortPage(1); }, [statusFilter, departmentFilter, search]);

  const filteredPrograms = useMemo(() => {
    const q = search.trim().toLowerCase();
    return communityPrograms.filter((program) => {
      const matchesStatus = statusFilter === "Semua" || program.status === statusFilter;
      const matchesDepartment = departmentFilter === "Semua Departemen" || program.department === departmentFilter;
      const matchesSearch = !q || [program.title, program.department, program.location, program.partner, program.category].join(" ").toLowerCase().includes(q);
      return matchesStatus && matchesDepartment && matchesSearch;
    });
  }, [statusFilter, departmentFilter, search]);

  // Data yang dipotong untuk Pagination (Per 10)
  const paginatedPrograms = filteredPrograms.slice((portPage - 1) * 10, portPage * 10);

  return (
    <main className="main-content">
      <section className="module-hero">
        <button className="back-button dark" onClick={onBack}><ArrowLeft size={15} /> Executive Overview</button>
        <div className="module-title-row">
          <div className="module-title-copy">
            <div className="eyebrow">02 · COMMUNITY IMPACT INTELLIGENCE</div>
            <h2>Pengabdian kepada Masyarakat</h2>
            <p>Memantau portofolio pengabdian, keterlibatan departemen, kemitraan strategis, sebaran wilayah, serta dampak program Komuniversitas.</p>
          </div>
          <div className="module-hero-kpi">
            <strong>186</strong>
            <span>Total Community Programs</span>
          </div>
        </div>
      </section>

      <section className="kpi-grid cols-4">
        {[
          ["186", "Total Program", "Community programs"],
          ["72", "Mitra", "Strategic partners"],
          ["34", "Wilayah", "Areas reached"],
          ["48", "Sedang Berlangsung", "Active programs"],
        ].map(([value, label, sub]) => (
          <div className="kpi-card" key={label}><div className="kpi-value">{value}</div><div className="kpi-label">{label}</div><div className="kpi-sub">{sub}</div></div>
        ))}
      </section>

      {/* KOMUNIVERSITAS (PROGRAM UNGGULAN) */}
      <section className="flagship-section" style={{ background: "linear-gradient(145deg, #f0fdf4, #f0f9ff)", padding: "28px", borderRadius: "20px", border: "1px solid #bbf7d0", marginTop: "35px" }}>
        <div className="section-heading compact-heading" style={{ marginBottom: 20 }}>
          <div>
            <div className="eyebrow" style={{ color: "#059669" }}>PROGRAM UNGGULAN</div>
            <h3 style={{ color: "#102a43" }}>Komuniversitas FT UGM</h3>
          </div>
          <p style={{ color: "#047857" }}>Sinergi kampus dan komunitas sekitar untuk menyelesaikan masalah riil masyarakat kampung secara berkelanjutan.</p>
        </div>
        
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {komuniversitas.map((k) => {
            const Icon = iconMap[k.iconName] || Home;
            return (
              <button 
                className="kpi-card komuniv-card" 
                key={k.id} 
                onClick={() => setSelectedKomuniv(k)}
                style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'flex-start', textAlign: 'left', cursor: 'pointer', border: '1px solid #bae6fd', background: '#fff' }}
              >
                <div className="flagship-icon" style={{ width: 44, height: 44, background: '#e0f2fe', color: '#0284c7', borderRadius: 12, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: 15, color: '#102a43', display: 'block' }}>{k.title}</strong>
                  <span style={{ fontSize: 11, color: '#0284c7', fontWeight: 600, display: 'block', margin: '4px 0 6px' }}>📍 {k.location}</span>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>{k.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* KATALOG PORTFOLIO */}
      <section className="panel community-filter-panel" style={{ marginTop: 35 }}>
        <div className="filter-heading">
          <div><div className="eyebrow">COMMUNITY PORTFOLIO</div><h3>Katalog Kegiatan Pengabdian</h3></div><Filter size={17} className="muted" />
        </div>
        <div className="filters">
          <div className="search-box"><MapPin size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari program, lokasi, mitra..." /></div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>Semua Status</option><option>Aktif</option><option>Selesai</option><option>Direncanakan</option>
          </select>
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
            <option>Semua Departemen</option>
            {[...new Set(communityPrograms.map((p) => p.department))].map((d) => (<option key={d} value={d}>{d}</option>))}
          </select>
        </div>
      </section>

      <section className="community-portfolio-layout">
        <div className="community-list">
          <div className="list-meta"><strong>{filteredPrograms.length}</strong> kegiatan ditemukan <span>· klik kartu untuk melihat detail</span></div>

          {paginatedPrograms.map((program) => (
            <button key={program.id} className="community-card" onClick={() => setSelectedProgram(program)}>
              <div className="community-card-top"><span className={`status-badge ${program.status.toLowerCase()}`}>{program.status}</span><span className="community-id">{program.id}</span></div>
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <div className="community-meta">
                <span><Building2 size={13} /> {program.department}</span><span><MapPin size={13} /> {program.location}</span><span><Handshake size={13} /> {program.partner}</span>
              </div>
              <div className="tag-row"><span className="tag">{program.category}</span><span className="tag soft">{program.year}</span></div>
              <div className="community-card-bottom"><span>Impact {program.impact}</span><span>Sustainability {program.sustainability}</span><ArrowRight size={16} /></div>
            </button>
          ))}
          {filteredPrograms.length === 0 && <div className="empty-state">Tidak ada data yang sesuai dengan filter.</div>}
          
          <Pagination currentPage={portPage} totalItems={filteredPrograms.length} itemsPerPage={10} onPageChange={setPortPage} />
        </div>

        <aside className="community-side">
          <div className="panel community-snapshot">
            <div className="panel-heading"><div><div className="eyebrow">PROGRAM SNAPSHOT</div><h3>Status Pengabdian</h3></div><TrendingUp size={18} className="muted" /></div>
            {[["Aktif", 48, "green"], ["Selesai", 91, "blue"], ["Direncanakan", 47, "gold"]].map(([label, value, tone]) => (
              <div className="snapshot-row" key={label}><div><strong>{label}</strong><span>{value} program</span></div><div className={`snapshot-number ${tone}`}>{value}</div></div>
            ))}
          </div>
          <div className="panel">
            <div className="panel-heading"><div><div className="eyebrow">STRATEGIC PARTNERS</div><h3>Mitra Utama</h3></div><Handshake size={18} className="muted" /></div>
            {partners.slice(0, 4).map((partner) => (
              <div className="partner-mini-row" key={partner.name}>
                <div className="partner-icon"><Users size={14} /></div>
                <div><strong>{partner.name}</strong><span>{partner.type}</span></div><em>{partner.programs}</em>
              </div>
            ))}
          </div>
        </aside>
      </section>

      {/* INDIKATOR PENGABDIAN BERDAMPAK */}
      <section className="impactful-research-section">
        <div className="section-heading compact-heading">
          <div><div className="eyebrow">SUSTAINABLE ENGAGEMENT</div><h3>Indikator Pengabdian Berdampak</h3></div>
          <p>Tinjauan strategis terhadap kebermanfaatan program, dukungan alumni, dan kepuasan masyarakat lokal sekitar kampus.</p>
        </div>
        <div className="kpi-grid">
          {impactIndicators.map((item, idx) => (
             <div className="kpi-card" key={idx}>
               <div className="kpi-value" style={{color: item.color}}>{item.value}</div>
               <div className="kpi-label">{item.label}</div>
               <div className="kpi-sub">{item.sub}</div>
             </div>
          ))}
        </div>
      </section>

      {/* PETA SEBARAN */}
      <section className="community-map-section">
        <div className="section-heading compact-heading">
          <div><div className="eyebrow">SPATIAL DISTRIBUTION</div><h3>Sebaran Wilayah Pengabdian</h3></div>
          <p>Klik wilayah untuk melihat jumlah kegiatan pengabdian.</p>
        </div>
        <div className="community-map-layout">
          <div className="panel map-panel">
            <CommunityMap onSelectRegion={setSelectedRegion} />
            <div className="map-gradient-legend"><span>Rendah</span><div className="gradient-bar" /><span>Tinggi</span></div>
          </div>
          <div className="panel region-panel">
            <div className="panel-heading"><div><div className="eyebrow">REGION INSIGHT</div><h3>{selectedRegion?.name || "Pilih wilayah"}</h3></div><MapPin size={18} className="muted" /></div>
            {selectedRegion ? (
              <><div className="region-big-number">{selectedRegion.count}</div><span className="region-label">kegiatan pengabdian</span><div className="region-divider" /><div className="region-detail"><span>Wilayah</span><strong>{selectedRegion.name}</strong></div></>
            ) : (
              <div className="region-empty"><MapPin size={22} /><span>Klik salah satu kabupaten / kota pada peta.</span></div>
            )}
          </div>
        </div>
      </section>

      <section className="panel community-department-panel">
        <div className="panel-heading"><div><div className="eyebrow">CROSS-DEPARTMENT ENGAGEMENT</div><h3>Keterlibatan Antar Departemen</h3></div><span className="panel-chip">Dummy data</span></div>
        <div className="matrix-wrap">
          <table className="matrix-table">
            <thead><tr><th>Departemen</th>{departmentHeaders.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {departmentMatrix.map((row) => (
                <tr key={row[0]}>
                  <th>{row[0]}</th>
                  {row.slice(1).map((cell, idx) => (<td key={idx}><button className={`matrix-cell ${cell === "●" ? "strong" : cell === "○" ? "potential" : "none"}`}>{cell}</button></td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="matrix-legend"><span><i className="legend-strong" /> Strong</span><span><i className="legend-potential" /> Potential</span><span><i className="legend-none" /> None</span></div>
      </section>

      <section className="panel impact-panel">
        <div className="panel-heading"><div><div className="eyebrow">IMPACT INTELLIGENCE</div><h3>Impact × Sustainability</h3></div><div className="impact-legend"><span><Leaf size={13} />Sustainability</span><span><TrendingUp size={13} />Impact</span></div></div>
        <div className="impact-grid">
          <div className="impact-axis-y">HIGH<br />SUSTAINABILITY</div>
          <div className="impact-chart">
            <div className="impact-grid-line horizontal one" /><div className="impact-grid-line horizontal two" /><div className="impact-grid-line vertical one" /><div className="impact-grid-line vertical two" />
            {communityPrograms.map((program) => (
              <button key={program.id} className="impact-point" style={{ left: `${program.impact}%`, bottom: `${program.sustainability}%` }} title={`${program.title}`} onClick={() => setSelectedProgram(program)}>
                <span /><strong>{program.id.replace("PKM-", "")}</strong>
              </button>
            ))}
            <div className="quadrant-label top-left">Sustainable</div><div className="quadrant-label top-right">Strategic Priority</div><div className="quadrant-label bottom-left">Monitor</div><div className="quadrant-label bottom-right">High Impact</div>
          </div>
          <div className="impact-axis-x"><span>LOW IMPACT</span><span>HIGH IMPACT</span></div>
        </div>
      </section>

      {/* MODAL DETAIL */}
      {selectedProgram && (
        <div className="modal-backdrop" onClick={() => setSelectedProgram(null)}>
          <div className="community-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProgram(null)}><X size={18} /></button>
            <div className="eyebrow">COMMUNITY PROGRAM · {selectedProgram.id}</div>
            <span className={`status-badge ${selectedProgram.status.toLowerCase()}`}>{selectedProgram.status}</span>
            <h2>{selectedProgram.title}</h2>
            <p className="modal-abstract">{selectedProgram.description}</p>
            <div className="detail-grid">
              <div><span>Departemen</span><strong>{selectedProgram.department}</strong></div>
              <div><span>Wilayah</span><strong>{selectedProgram.location}</strong></div>
              <div><span>Mitra</span><strong>{selectedProgram.partner}</strong></div>
              <div><span>Periode</span><strong>{selectedProgram.year}</strong></div>
            </div>
            
            {/* INI BAGIAN YANG DIPERBESAR TULISANNYA MELALUI CSS */}
            <div className="community-modal-metrics">
              <div><span>Impact Score</span><strong>{selectedProgram.impact} / 100</strong></div>
              <div><span>Sustainability Score</span><strong>{selectedProgram.sustainability} / 100</strong></div>
            </div>
            {/* Tombol Reka Ventura Pengabdian */}
            <div className="modal-footer" style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16, marginTop: 16 }}>
              <button 
                onClick={() => setShowPitchModal(true)}
                style={{ width: "100%", background: "#059669", color: "#fff", padding: "12px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}
              >
                Partnership Prospect <Handshake size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PETA KOMUNIVERSITAS */}
      {selectedKomuniv && (
        <div className="modal-backdrop" onClick={() => setSelectedKomuniv(null)} style={{ zIndex: 1000 }}>
          <div className="community-modal" style={{ maxWidth: 800, padding: 0, overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: 24, borderBottom: "1px solid #e2e8f0" }}>
              <button className="modal-close" onClick={() => setSelectedKomuniv(null)}><X size={18} /></button>
              <div className="eyebrow" style={{ color: "#0b5ea8" }}>PROGRAM KOMUNIVERSITAS</div>
              <h2 style={{ fontSize: 22, margin: "8px 0" }}>{selectedKomuniv.title}</h2>
              <p style={{ fontSize: 14, color: "#475569", margin: 0 }}>{selectedKomuniv.desc}</p>
            </div>
            
            {/* Peta Interaktif Komuniversitas & Batas FT */}
            <div style={{ height: 350, width: "100%", background: "#e2e8f0", position: "relative" }}>
              <MapContainer center={[selectedKomuniv.lat, selectedKomuniv.lng]} zoom={14} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
                {/* GeoJSON Batas FT UGM (Harus dipastikan fetch berhasil jika file ada) */}
                <GeoJSON data={null} /> 

                {/* Titik Lokasi Program */}
                <CircleMarker center={[selectedKomuniv.lat, selectedKomuniv.lng]} radius={10} color="#fff" fillColor="#0b5ea8" fillOpacity={1} weight={2}>
                  <Popup><strong>{selectedKomuniv.title}</strong><br/>{selectedKomuniv.location}</Popup>
                </CircleMarker>
              </MapContainer>
              <div style={{ position: "absolute", bottom: 10, left: 10, zIndex: 1000, background: "rgba(255,255,255,0.9)", padding: "4px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                📍 {selectedKomuniv.location}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PITCH REKA VENTURA PENGABDIAN */}
      {showPitchModal && selectedProgram && (
        <div className="modal-backdrop" onClick={() => setShowPitchModal(false)} style={{ zIndex: 1000 }}>
          <div className="community-modal" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPitchModal(false)}><X size={18} /></button>
            <div className="eyebrow" style={{ color: "#059669" }}>CSR & CSR PARTNERSHIP PROSPECT</div>
            <h2 style={{ fontSize: 24, margin: "8px 0" }}>{selectedProgram.title}</h2>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
              Program ini telah terbukti memberikan dampak signifikan ({selectedProgram.impact}/100) bagi masyarakat. Kami membuka pintu bagi mitra DUDI dan CSR untuk melakukan <i>scale-up</i> (pemberdayaan skala luas) bersama Fakultas Teknik UGM.
            </p>
            
            <div style={{ background: "#f0fdf4", padding: 16, borderRadius: 12, border: "1px solid #bbf7d0", marginTop: 20 }}>
              <strong style={{ fontSize: 13, color: "#166534", display: "block", marginBottom: 12 }}>Potensi Sinergi Pendanaan</strong>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ background: "#fff", padding: 16, borderRadius: 8, border: "1px solid #bbf7d0" }}>
                  <div style={{ color: "#166534", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>TARGET PENERIMA MANFAAT</div>
                  <strong style={{ fontSize: 24, color: "#059669" }}>+2.500 Jiwa</strong>
                </div>
                <div style={{ background: "#fff", padding: 16, borderRadius: 8, border: "1px solid #bbf7d0" }}>
                  <div style={{ color: "#166534", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>SUSTAINABILITY INDEX</div>
                  <strong style={{ fontSize: 18, color: "#d97706" }}>Tinggi ({selectedProgram.sustainability}%)</strong>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <button style={{ background: "#059669", color: "#fff", padding: "10px 16px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>Generate Proposal (PDF)</button>
              <button style={{ background: "#fff", color: "#059669", padding: "10px 16px", borderRadius: 8, border: "1px solid #bbf7d0", fontWeight: 700, cursor: "pointer" }}>Hubungi Tim Pengabdi</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}