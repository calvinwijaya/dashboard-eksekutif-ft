import React, { useMemo, useState } from "react";
import { ArrowLeft, Briefcase, Lightbulb, Trophy, BrainCircuit, Target, BookOpen, X, ChevronRight } from "lucide-react";
import TeachingData from "../data/TeachingData.json";

const { programs, courses, workload, outcomes, technoKarsa, technoTalenta, studentCommunities, transformativeIndicators, metricsBreakdown } = TeachingData;

const iconMap = { Briefcase, Lightbulb, Trophy };

const card = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, boxShadow: "0 4px 16px rgba(15,23,42,.05)" };
const muted = { color: "#64748b", fontSize: 13 };

const scrollStyle = { maxHeight: "420px", overflowY: "auto", paddingRight: "10px", scrollbarWidth: "thin" };

function Progress({ value, max = 100, color = "#2563eb", trackColor = "#e2e8f0" }) {
  return (
    <div style={{ height: 8, background: trackColor, borderRadius: 99, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, Math.max(0, value / max * 100))}%`, height: "100%", background: color, borderRadius: 99 }} />
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="kpi-card">
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

export default function TeachingPage({ onBack }) {
  const [programFilter, setProgramFilter] = useState("Semua");
  const [searchMK, setSearchMK] = useState("");
  const [mkProdiFilter, setMkProdiFilter] = useState("Semua Prodi");
  const [deptFilter, setDeptFilter] = useState("Semua Departemen");
  
  // Modals state
  const [course, setCourse] = useState(null);
  const [program, setProgram] = useState(null);
  const [selectedTalenta, setSelectedTalenta] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);

  const filteredPrograms = useMemo(() => {
    if (programFilter === "Semua") return programs;
    return programs.filter(p => p.level === programFilter);
  }, [programFilter]);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchProdi = mkProdiFilter === "Semua Prodi" || c.program === mkProdiFilter;
      const matchSearch = !searchMK || `${c.code} ${c.name} ${c.program}`.toLowerCase().includes(searchMK.toLowerCase());
      return matchProdi && matchSearch;
    });
  }, [mkProdiFilter, searchMK]);

  const filteredWorkload = useMemo(() => {
    if (deptFilter === "Semua Departemen") return workload;
    return workload.filter(w => w.department === deptFilter);
  }, [deptFilter]);

  const totalStudents = programs.reduce((a, p) => a + p.students, 0);
  const totalCourses = programs.reduce((a, p) => a + p.courses, 0);
  
  const s1Programs = programs.filter(p => p.level === "Sarjana (S1)");
  const s1Lecturers = s1Programs.reduce((a, p) => a + p.lecturers, 0);
  const s1NewStudents = s1Programs.reduce((a, p) => a + p.newStudents, 0);

  const uniqueProgramsForMK = ["Semua Prodi", ...new Set(courses.map(c => c.program))];
  
  // Hardcode 8 Departemen agar selalu muncul di Filter Dropdown Beban Mengajar
  const uniqueDepts = [
    "Semua Departemen",
    "Departemen Teknik Geodesi",
    "Departemen Teknik Arsitektur dan Perencanaan",
    "Departemen Teknik Elektro dan Teknologi Informasi",
    "Departemen Teknik Nuklir dan Teknik Fisika",
    "Departemen Teknik Geologi",
    "Departemen Teknik Kimia",
    "Departemen Teknik Mesin dan Industri",
    "Departemen Teknik Sipil dan Lingkungan"
  ];

  // Hitung jumlah dosen geodesi yang overload
  const overloadDosen = workload.filter(d => d.sks > 16).length;

  return (
    <main className="main-content">
      <section className="module-hero">
        <button className="back-button dark" onClick={onBack}>
          <ArrowLeft size={15} /> Executive Overview
        </button>
        <div className="module-title-row">
          <div className="module-title-copy">
            <div className="eyebrow">03 · ACADEMIC INTELLIGENCE</div>
            <h2>Pengajaran & Pendidikan Transformatif</h2>
            <p>Analitik akademik, pengembangan karakter unggul, serta integrasi capstone design dalam ekosistem inovasi Fakultas Teknik.</p>
          </div>
          <div className="module-hero-kpi">
            <span style={{ textTransform: "none", letterSpacing: "normal" }}>Academic Snapshot</span>
            <strong style={{ fontSize: "22px", marginTop: "4px" }}>Genap 25/26</strong>
          </div>
        </div>
      </section>

      <section className="kpi-grid cols-5">
        <Stat label="Total Program Studi" value={programs.length} sub="S1, S2, S3, & Profesi" />
        <Stat label="Total Mahasiswa FT" value={totalStudents.toLocaleString("id-ID")} sub="Aktif terdaftar" />
        <Stat label="Total Mata Kuliah" value={totalCourses} sub="Diampu semester ini" />
        <Stat label="Partisipasi Capstone" value={`${transformativeIndicators.capstoneParticipation}%`} sub="Rasio mahasiswa S1 akhir" />
        <Stat label="Rasio Intake S1-Dosen" value={(s1NewStudents / s1Lecturers).toFixed(1)} sub="Beban mhs baru per dosen" />
      </section>

      {/* TECHNO-KARSA & TECHNO-TALENTA */}
      <section style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18, marginBottom: 24 }}>
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, background: "#eef2ff", color: "#4f46e5", borderRadius: 10, display: "grid", placeItems: "center" }}><BookOpen size={18} /></div>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, color: "#1e3a8a" }}>Techno-Karsa (MK Unggulan)</h2>
              <p style={{ ...muted, margin: "2px 0 0", fontSize: 12 }}>Kelas transformatif berbasis kurikulum adaptif & studi kasus industri.</p>
            </div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {technoKarsa.map(tk => (
              <div key={tk.id} style={{ padding: 14, border: "1px solid #e2e8f0", borderRadius: 12, background: "#f8fafc" }}>
                <strong style={{ fontSize: 14, color: "#0f172a" }}>{tk.name}</strong>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{tk.dept} · {tk.students} mahasiswa mengambil kelas ini</div>
                <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                  {tk.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 10, background: "#fff", border: "1px solid #cbd5e1", padding: "4px 8px", borderRadius: 6, color: "#334155", fontWeight: 600 }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...card, background: "linear-gradient(145deg, #102a43, #0a1929)", color: "#fff", borderColor: "transparent" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.1)", color: "#93c5fd", borderRadius: 10, display: "grid", placeItems: "center" }}><Target size={18} /></div>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, color: "#fff" }}>Techno-Talenta & Inovasi</h2>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>Ekosistem rantai pasok talenta dan pembinaan prestasi.</p>
            </div>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {technoTalenta.map(tt => {
              const Icon = iconMap[tt.iconName];
              return (
                <button 
                  key={tt.id} 
                  onClick={() => setSelectedTalenta(tt)}
                  className="talenta-card"
                  style={{ display: "flex", gap: 12, padding: 14, background: "rgba(255,255,255,0.05)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", textAlign: "left", cursor: "pointer", width: "100%" }}
                >
                  <div style={{ flexShrink: 0, color: "#60a5fa" }}>{Icon && <Icon size={20} />}</div>
                  <div>
                    <strong style={{ fontSize: 13, color: "#f8fafc", display: "block", marginBottom: 4 }}>{tt.title}</strong>
                    <p style={{ fontSize: 11, color: "#cbd5e1", margin: 0, lineHeight: 1.5 }}>{tt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* TABEL PROGRAM STUDI */}
      <section style={{ ...card, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 19 }}>Program Studi di Fakultas Teknik</h2>
            <p style={{ ...muted, margin: "5px 0 0" }}>Snapshot kapasitas akademik setiap program studi.</p>
          </div>
          <select value={programFilter} onChange={e => setProgramFilter(e.target.value)} style={{ padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: 9, fontSize: 13, background: "#f8fafc" }}>
            <option value="Semua">Semua Jenjang</option>
            <option value="Sarjana (S1)">Sarjana (S1)</option>
            <option value="Magister (S2)">Magister (S2)</option>
            <option value="Doktor (S3)">Doktor (S3)</option>
            <option value="Profesi">Profesi</option>
          </select>
        </div>
        <div style={scrollStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead style={{ position: "sticky", top: 0, background: "#fff", zIndex: 10 }}>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                {["Program Studi", "Jenjang", "Mahasiswa", "Mhs Baru '26", "Dosen", "Rasio Intake", "Implementasi OBE"].map(h => <th key={h} style={{ padding: "11px 8px", color: "#64748b", fontSize: 12 }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredPrograms.map(p => {
                const intakeRatio = +(p.newStudents / p.lecturers).toFixed(1);
                return (
                  <tr key={p.name} onClick={() => setProgram(p)} style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}>
                    <td style={{ padding: "14px 8px", fontWeight: 600, color: "#0f172a" }}>{p.name}</td>
                    <td style={{ fontSize: 13, color: "#475569" }}>{p.level}</td>
                    <td>{p.students.toLocaleString("id-ID")}</td>
                    <td style={{ color: "#0b5ea8", fontWeight: 700 }}>{p.newStudents}</td>
                    <td>{p.lecturers}</td>
                    <td style={{ fontWeight: 800, color: intakeRatio > 8 ? "#dc2626" : "#059669" }}>{intakeRatio} : 1</td>
                    <td>
                      <div style={{ width: 100 }}>
                        <Progress value={p.curriculum} />
                        <small style={{ ...muted, display: "block", marginTop: 4 }}>{p.curriculum}%</small>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {(() => {
              const totalMhs = filteredPrograms.reduce((acc, p) => acc + p.students, 0);
              const totalNewMhs = filteredPrograms.reduce((acc, p) => acc + p.newStudents, 0);
              const totalDosen = filteredPrograms.reduce((acc, p) => acc + p.lecturers, 0);
              const totalRasio = totalDosen > 0 ? (totalNewMhs / totalDosen).toFixed(1) : 0;
              return (
                <tfoot style={{ position: "sticky", bottom: 0, background: "#f8fafc", zIndex: 10 }}>
                  <tr style={{ borderTop: "2px solid #cbd5e1", fontWeight: 700, color: "#0f172a" }}>
                    <td style={{ padding: "12px 8px" }}>Total / Akumulasi</td>
                    <td style={{ fontSize: 12, color: "#64748b" }}>{filteredPrograms.length} prodi</td>
                    <td style={{ color: "#0f172a" }}>{totalMhs.toLocaleString("id-ID")}</td>
                    <td style={{ color: "#0b5ea8" }}>{totalNewMhs.toLocaleString("id-ID")}</td>
                    <td>{totalDosen}</td>
                    <td style={{ fontSize: 15, color: "#0b5ea8" }}>{totalRasio} : 1</td>
                    <td></td>
                  </tr>
                </tfoot>
              );
            })()}
          </table>
        </div>
      </section>

      {/* INDIKATOR PENDIDIKAN TRANSFORMATIF (OCEAN & CAPSTONE) */}
      <section style={{ ...card, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 36, height: 36, background: "#f0fdf4", color: "#166534", borderRadius: 10, display: "grid", placeItems: "center" }}><BrainCircuit size={18} /></div>
          <div>
            <h2 style={{ margin: 0, fontSize: 19 }}>Indikator Pendidikan Transformatif</h2>
            <p style={{ ...muted, margin: "2px 0 0", fontSize: 13 }}>Pengukuran perkembangan karakter mahasiswa (OCEAN Scores 0-10) dan indikator keberhasilan pasca-kampus.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 28 }}>
          <div style={{ padding: 20, background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <strong style={{ fontSize: 14, color: "#0f172a", display: "block", marginBottom: 16 }}>Perkembangan Karakter (OCEAN Scores)</strong>
            <div style={{ display: "grid", gap: 16 }}>
              {transformativeIndicators.ocean.map(o => {
                const isNeuro = o.trait === "Neuroticism";
                const isImproved = isNeuro ? o.post < o.pre : o.post > o.pre;
                
                return (
                  <div key={o.trait}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
                      <strong style={{ color: "#334155" }}>{o.trait} <span style={{ fontWeight: 400, color: "#64748b" }}>— {o.desc}</span></strong>
                      <span style={{ fontWeight: 700, color: isImproved ? "#059669" : "#64748b" }}>
                        {isImproved ? "Lebih baik" : "Tetap"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 50, fontSize: 10, color: "#64748b", textAlign: "right" }}>Pre (Masuk)</div>
                      <div style={{ flex: 1 }}>
                        <Progress value={o.pre} max={10} color="#94a3b8" trackColor="#f1f5f9" />
                      </div>
                      <div style={{ width: 25, fontSize: 11, color: "#475569" }}>{o.pre}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                      <div style={{ width: 50, fontSize: 10, fontWeight: 700, color: "#0f172a", textAlign: "right" }}>Post (Lulus)</div>
                      <div style={{ flex: 1 }}>
                        <Progress value={o.post} max={10} color={isNeuro ? "#10b981" : "#2563eb"} trackColor="#e2e8f0" />
                      </div>
                      <div style={{ width: 25, fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{o.post}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <button className="metric-hover-card" onClick={() => setSelectedMetric({ id: 'capstone', title: "Rasio Partisipasi Capstone Fair", val: transformativeIndicators.capstoneParticipation, suffix: "%" })}>
              <div style={{ ...muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 4 }}>EXECUTIVE METRICS</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#0b5ea8" }}>{transformativeIndicators.capstoneParticipation}%</div>
              <strong style={{ fontSize: 13, color: "#0f172a", display: "block", marginTop: 4 }}>Rasio Partisipasi Capstone Fair</strong>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Mahasiswa S1 tingkat akhir yang terlibat penuh dalam pameran purwarupa.</div>
            </button>
            <button className="metric-hover-card" onClick={() => setSelectedMetric({ id: 'masaTunggu', title: "Rata-rata Masa Tunggu Lulusan", val: transformativeIndicators.masaTunggu, suffix: " Bulan" })}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#059669" }}>{transformativeIndicators.masaTunggu} Bulan</div>
              <strong style={{ fontSize: 13, color: "#0f172a", display: "block", marginTop: 4 }}>Rata-rata Masa Tunggu Lulusan</strong>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Dari yudisium hingga mendapatkan pekerjaan pertama (Target: {'<'} 3 bulan).</div>
            </button>
            <button className="metric-hover-card" onClick={() => setSelectedMetric({ id: 'kesesuaianBidang', title: "Kesesuaian Bidang Kerja Lulusan", val: transformativeIndicators.kesesuaianBidang, suffix: "%" })}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#d97706" }}>{transformativeIndicators.kesesuaianBidang}%</div>
              <strong style={{ fontSize: 13, color: "#0f172a", display: "block", marginTop: 4 }}>Kesesuaian Bidang Kerja</strong>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Lulusan yang bekerja pada sektor keteknikan dan relevan.</div>
            </button>
          </div>
        </div>
      </section>

      {/* KURIKULUM & CAPAIAN */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>
        <div style={card}>
          <h2 style={{ margin: 0, fontSize: 19 }}>Kurikulum di Prodi FT</h2>
          <p style={{ ...muted, margin: "5px 0 16px" }}>Indikator pemetaan kurikulum berjalan.</p>
          <div style={scrollStyle}>
            {programs.map(p => (
              <div key={p.name} style={{ marginBottom: 16, paddingRight: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({p.level})</span></span>
                  <strong style={{ fontSize: 13, color: "#0b5ea8" }}>{p.curriculum}%</strong>
                </div>
                <Progress value={p.curriculum} color="#059669" />
              </div>
            ))}
          </div>
        </div>
        
        <div style={card}>
          <h2 style={{ margin: 0, fontSize: 19 }}>Capaian Pembelajaran (CPL)</h2>
          <p style={{ ...muted, margin: "5px 0 16px" }}>Persentase CPL terukur dan tercapai per prodi.</p>
          <div style={scrollStyle}>
            {outcomes.map(([name, ach, ass]) => (
              <div key={name} style={{ marginBottom: 16, paddingRight: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{name}</span>
                  <span style={{ fontSize: 12, ...muted }}>{ach}% tercapai / {ass}% diukur</span>
                </div>
                <Progress value={ach} color="#0b5ea8" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RASIO INTAKE DOSEN MAHASISWA (CARD VIEW) */}
      <section style={{ ...card, marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 19 }}>Rasio Intake (Mahasiswa Baru : Dosen)</h2>
        <p style={{ ...muted, margin: "5px 0 18px" }}>Indikator daya tampung pengajaran untuk evaluasi redistribusi kuota mahasiswa baru S1.</p>
        <div style={{ ...scrollStyle, maxHeight: "300px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14 }}>
            {programs.filter(p => p.level === "Sarjana (S1)").map(p => {
              const r = +(p.newStudents / p.lecturers).toFixed(1);
              const status = r > 10 ? "Perlu perhatian" : r > 6 ? "Monitor" : "Sehat";
              const statusColor = r > 10 ? "#dc2626" : r > 6 ? "#d97706" : "#059669";
              
              return (
                <div key={p.name} style={{ padding: 18, border: "1px solid #e2e8f0", borderRadius: 12, background: "#f8fafc" }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>{p.level}</div>
                  <strong style={{ fontSize: 13, color: "#0f172a", lineHeight: 1.3, display: "block", minHeight: 34 }}>{p.name}</strong>
                  <div style={{ fontSize: 26, fontWeight: 800, marginTop: 12, color: "#1e293b" }}>{r}:1</div>
                  <div style={{ ...muted, marginTop: 6, fontSize: 11 }}>{p.newStudents} mhs baru · {p.lecturers} dosen</div>
                  <div style={{ marginTop: 12, fontSize: 11, fontWeight: 700, color: statusColor, background: "#fff", padding: "4px 8px", borderRadius: 6, display: "inline-block", border: `1px solid ${statusColor}33` }}>
                    {status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BEBAN PENGAJARAN DOSEN */}
      <section style={{ ...card, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 17 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 19 }}>Beban Pengajaran Dosen</h2>
            <p style={{ ...muted, margin: "5px 0 0" }}>Terhubung konseptual dengan metrik Kesejahteraan.</p>
          </div>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{ padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: 9, fontSize: 13 }}>
            {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 28 }}>
          <div style={scrollStyle}>
            {filteredWorkload.length === 0 ? (
               <div style={{ padding: "20px", textAlign: "center", color: "#64748b", background: "#f8fafc", borderRadius: 10 }}>
                 Data detail dosen untuk departemen ini belum tersedia di versi demo.
               </div>
            ) : (
              filteredWorkload.map((d, idx) => {
                // Logika Status BKD (Tri Dharma):
                // Pengajaran saja > 16 SKS = Overload
                // Pengajaran < 9 SKS = Diasumsikan sisa BKD dipenuhi dari Riset/Pengabdian
                const isOverload = d.sks > 16;
                const isResearchFocused = d.sks < 9;
                
                // Warna: Merah/Orange (Overload), Abu-abu (Fokus Riset), Biru (Dominan Pengajaran)
                const barColor = isOverload ? "#d97706" : isResearchFocused ? "#94a3b8" : "#2563eb";
                const textColor = isOverload ? "#9a3412" : isResearchFocused ? "#475569" : "#0f172a";

                return (
                  <div key={idx} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <strong style={{ fontSize: 14, color: textColor }}>{d.name}</strong>
                        <div style={{ ...muted, marginTop: 4 }}>{d.department} · {d.classes} kelas · {d.students} mhs</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <strong style={{ fontSize: 14, color: textColor }}>{d.sks} SKS</strong>
                        <div style={{ ...muted, marginTop: 4 }}>Maksimal 16 SKS</div>
                      </div>
                    </div>
                    {/* Progress Bar (Maksimal Dihitung Berdasarkan 16 SKS) */}
                    <Progress value={(d.sks / 16) * 100} max={100} color={barColor} />
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                      <span style={{ fontSize: 11, color: barColor, fontWeight: 700 }}>
                        {isOverload ? "Overload Pengajaran (>16 SKS)" : isResearchFocused ? "Fokus Riset / Lainnya (<9 SKS)" : "Dominan Pengajaran (9-16 SKS)"}
                      </span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>
                        {((d.sks / 16) * 100).toFixed(1)}% dari batas maksimal
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ background: "#f8fafc", borderRadius: 13, padding: 22, height: "fit-content" }}>
            <div style={{ ...muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>EXECUTIVE INSIGHT</div>
            <h3 style={{ margin: "8px 0 12px" }}>Evaluasi Beban Pengajaran</h3>
            <p style={{ color: "#475569", lineHeight: 1.6, fontSize: 13 }}>
              Sesuai aturan BKD, total beban ideal adalah 12-16 SKS (mencakup Pendidikan, Penelitian, Pengabdian, dan Penunjang), dengan komponen Pendidikan + Penelitian minimal 9 SKS. Dosen dengan beban pengajaran yang rendah diekspektasikan memiliki porsi capaian riset atau pengabdian yang tinggi.
            </p>
            
            {/* Hitung Insight Berdasarkan Filter yang Aktif */}
            {(() => {
              const overloadCount = filteredWorkload.filter(d => d.sks > 16).length;
              const researchCount = filteredWorkload.filter(d => d.sks < 9).length;
              const teachingCount = filteredWorkload.length - overloadCount - researchCount;

              return (
                <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
                  <div style={{ background: "#fff", padding: 14, borderRadius: 10, border: "1px solid #e2e8f0" }}>
                    <strong style={{ fontSize: 16, color: "#059669" }}>{teachingCount} dosen</strong>
                    <div style={muted}>Dominan Pengajaran (9 - 16 SKS)</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ background: "#fff", padding: 14, borderRadius: 10, border: "1px solid #e2e8f0" }}>
                      <strong style={{ fontSize: 16, color: "#d97706" }}>{overloadCount} dosen</strong>
                      <div style={muted}>Overload ({'>'}16 SKS)</div>
                    </div>
                    <div style={{ background: "#fff", padding: 14, borderRadius: 10, border: "1px solid #e2e8f0" }}>
                      <strong style={{ fontSize: 16, color: "#64748b" }}>{researchCount} dosen</strong>
                      <div style={muted}>Fokus Riset ({'<'}9 SKS)</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* MATA KULIAH */}
      <section style={{ ...card, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 19 }}>Katalog Mata Kuliah Fakultas Teknik</h2>
            <p style={{ ...muted, margin: "5px 0 0" }}>Distribusi kelas dan SKS.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <select value={mkProdiFilter} onChange={e => setMkProdiFilter(e.target.value)} style={{ padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: 9, fontSize: 13 }}>
              {uniqueProgramsForMK.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input value={searchMK} onChange={e => setSearchMK(e.target.value)} placeholder="Cari kode / nama MK..." style={{ width: 220, padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: 9, fontSize: 13 }} />
          </div>
        </div>
        <div style={scrollStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
            {filteredCourses.map(c => (
              <button key={c.code} onClick={() => setCourse(c)} style={{ textAlign: "left", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, cursor: "pointer" }}>
                <div style={{ color: "#2563eb", fontSize: 12, fontWeight: 750 }}>{c.code}</div>
                <div style={{ marginTop: 6, fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{c.name}</div>
                <div style={{ ...muted, marginTop: 4, fontSize: 12 }}>{c.program}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 12, color: "#475569", borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
                  <span>{c.sks} SKS</span><span>{c.students} mhs</span><span>{c.classes} kelas</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MODALS */}
      {course && (
        <div className="modal-backdrop" onClick={() => setCourse(null)}>
          <div className="research-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setCourse(null)}>✕</button>
            <div className="eyebrow">COURSE DETAIL · {course.code}</div>
            <h2>{course.name}</h2>
            <p className="modal-abstract">Mata kuliah ini diajarkan pada program studi {course.program} dengan beban {course.sks} SKS.</p>
            <div className="detail-grid">
              <div><span>Program Studi</span><strong>{course.program}</strong></div>
              <div><span>Beban SKS</span><strong>{course.sks} SKS</strong></div>
              <div><span>Total Mahasiswa</span><strong>{course.students} mahasiswa</strong></div>
              <div><span>Jumlah Kelas</span><strong>{course.classes} kelas aktif</strong></div>
            </div>
          </div>
        </div>
      )}

      {program && (
        <div className="modal-backdrop" onClick={() => setProgram(null)}>
          <div className="research-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setProgram(null)}>✕</button>
            <div className="eyebrow">{program.level}</div>
            <h2>{program.name}</h2>
            <p className="modal-abstract">Tinjauan kapasitas akademik dan rasio pengajaran untuk program studi {program.name}.</p>
            <div className="detail-grid">
              <div><span>Mahasiswa Aktif</span><strong>{program.students.toLocaleString("id-ID")} orang</strong></div>
              <div><span>Mahasiswa Baru</span><strong style={{color: "#0b5ea8"}}>{program.newStudents} orang</strong></div>
              <div><span>Total Dosen</span><strong>{program.lecturers} dosen</strong></div>
              <div><span>Mata Kuliah Aktif</span><strong>{program.courses} MK</strong></div>
              <div><span>Capaian Kurikulum</span><strong>{program.curriculum}%</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EXECUTIVE METRICS */}
      {selectedMetric && (
        <div className="modal-backdrop" onClick={() => setSelectedMetric(null)} style={{ zIndex: 1000 }}>
          <div className="research-modal" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMetric(null)}>✕</button>
            <div className="eyebrow" style={{ color: "#059669" }}>BREAKDOWN METRIK</div>
            <h2 style={{ fontSize: 24, margin: "8px 0" }}>{selectedMetric.title}</h2>
            
            {/* KETERANGAN SUMBER DATA DINAMIS */}
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: 6, fontWeight: 600 }}>
                Sumber: {selectedMetric.id === "capstone" ? "Presensi Mahasiswa saat Capstone Fair" : "Survei Alumni / Tracer Study"}
              </span>
            </div>
            
            <div style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>
              {selectedMetric.val}{selectedMetric.suffix}
            </div>
            
            <div style={{ display: "grid", gap: 14 }}>
              {metricsBreakdown[selectedMetric.id].map((mb, idx) => (
                <div key={idx} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#334155" }}>
                    <span>{mb.label}</span>
                    <span>{mb.value}{selectedMetric.id === "masaTunggu" ? "% responden" : "%"}</span>
                  </div>
                  <Progress value={mb.value} color="#059669" trackColor="#e2e8f0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL TECHNO-TALENTA (REKA VENTURA LINK & KOMUNITAS LOMBA) */}
      {selectedTalenta && (
        <div className="modal-backdrop" onClick={() => setSelectedTalenta(null)} style={{ zIndex: 1000 }}>
          <div className="research-modal" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTalenta(null)}>✕</button>
            <div className="eyebrow" style={{ color: "#0284c7" }}>REKA VENTURA · TALENT & INNOVATION LINK</div>
            <h2 style={{ fontSize: 24, margin: "8px 0" }}>{selectedTalenta.title}</h2>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
              {selectedTalenta.desc}
            </p>
            
            {selectedTalenta.id === "lomba" && (
              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <strong style={{ fontSize: 13, color: "#102a43", display: "block", marginBottom: 10 }}>Direktori Komunitas Lomba FT UGM:</strong>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {studentCommunities.map((c, idx) => (
                    <div key={idx} style={{ background: "#f8fafc", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                      <strong style={{ fontSize: 13, color: "#0b5ea8" }}>{c.name}</strong>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ background: "#f0f9ff", padding: 16, borderRadius: 12, border: "1px solid #bae6fd", marginTop: 10 }}>
              <strong style={{ fontSize: 13, color: "#0369a1", display: "block", marginBottom: 12 }}>Peluang Sinergi Mitra Industri & Investor</strong>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ background: "#fff", padding: 16, borderRadius: 8, border: "1px solid #7dd3fc" }}>
                  <div style={{ color: "#0369a1", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>KETERLIBATAN DUDI</div>
                  <strong style={{ fontSize: 16, color: "#0ea5e9" }}>Sponsorship & Rekrutmen</strong>
                </div>
                <div style={{ background: "#fff", padding: 16, borderRadius: 8, border: "1px solid #7dd3fc" }}>
                  <div style={{ color: "#0369a1", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>HILIRISASI KARYA</div>
                  <strong style={{ fontSize: 16, color: "#0ea5e9" }}>Co-Creation / Spin-off Startup</strong>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <button style={{ background: "#0ea5e9", color: "#fff", padding: "10px 16px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>Kirim Undangan Mitra</button>
              <button style={{ background: "#fff", color: "#0ea5e9", padding: "10px 16px", borderRadius: 8, border: "1px solid #7dd3fc", fontWeight: 700, cursor: "pointer" }}>Lihat Portofolio Karya</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}