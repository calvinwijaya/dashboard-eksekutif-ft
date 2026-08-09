import React, { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import TeachingData from "../data/TeachingData.json";

const { programs, courses, workload, outcomes } = TeachingData;
const card = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, boxShadow: "0 4px 16px rgba(15,23,42,.05)" };
const muted = { color: "#64748b", fontSize: 13 };

// CSS Inline khusus untuk scrollbar agar terlihat tipis dan elegan
const scrollStyle = {
  maxHeight: "420px", 
  overflowY: "auto", 
  paddingRight: "10px",
  scrollbarWidth: "thin", // Untuk Firefox
};

function Progress({ value, max = 100 }) {
  return (
    <div style={{ height: 8, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, Math.max(0, value / max * 100))}%`, height: "100%", background: "#2563eb", borderRadius: 99 }} />
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
  const [course, setCourse] = useState(null);
  const [program, setProgram] = useState(null);

  // Filter untuk Tabel Prodi
  const filteredPrograms = useMemo(() => {
    if (programFilter === "Semua") return programs;
    return programs.filter(p => p.level === programFilter);
  }, [programFilter]);

  // Filter untuk Mata Kuliah
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchProdi = mkProdiFilter === "Semua Prodi" || c.program === mkProdiFilter;
      const matchSearch = !searchMK || `${c.code} ${c.name} ${c.program}`.toLowerCase().includes(searchMK.toLowerCase());
      return matchProdi && matchSearch;
    });
  }, [mkProdiFilter, searchMK]);

  // Filter untuk Beban Dosen
  const filteredWorkload = useMemo(() => {
    if (deptFilter === "Semua Departemen") return workload;
    return workload.filter(w => w.department === deptFilter);
  }, [deptFilter]);

  const totalStudents = programs.reduce((a, p) => a + p.students, 0);
  const totalCourses = programs.reduce((a, p) => a + p.courses, 0);
  // Menghitung rasio dosen S1 saja untuk KPI
  const s1Programs = programs.filter(p => p.level === "Sarjana (S1)");
  const s1Lecturers = s1Programs.reduce((a, p) => a + p.lecturers, 0);
  const s1Students = s1Programs.reduce((a, p) => a + p.students, 0);

  // Ekstraksi unik untuk Dropdown Filter
  const uniqueProgramsForMK = ["Semua Prodi", ...new Set(courses.map(c => c.program))];
  const uniqueDepts = ["Semua Departemen", ...new Set(workload.map(w => w.department))];

  return (
    <main className="main-content">
      <section className="module-hero">
        <button className="back-button dark" onClick={onBack}>
          <ArrowLeft size={15} /> Executive Overview
        </button>
        <div className="module-title-row">
          <div className="module-title-copy">
            <div className="eyebrow">03 · ACADEMIC INTELLIGENCE</div>
            <h2>Pengajaran</h2>
            <p>Executive Teaching Analytics — Fakultas Teknik UGM</p>
          </div>
          <div className="module-hero-kpi">
            <span style={{ textTransform: "none", letterSpacing: "normal" }}>Academic Snapshot</span>
            <strong style={{ fontSize: "22px", marginTop: "4px" }}>Genap 25/26</strong>
          </div>
        </div>
      </section>

      <section className="kpi-grid">
        <Stat label="Total Program Studi" value={programs.length} sub="Seluruh Jenjang (S1-S3, Profesi, IUP)" />
        <Stat label="Total Mahasiswa FT" value={totalStudents.toLocaleString("id-ID")} sub="Aktif terdaftar" />
        <Stat label="Total Mata Kuliah" value={totalCourses} sub="Diampu semester ini" />
        <Stat label="Rasio Mahasiswa–Dosen S1" value={(s1Students / s1Lecturers).toFixed(1)} sub="Indikatif rata-rata S1" />
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
            <option value="IUP">IUP</option>
            <option value="Profesi">Profesi</option>
          </select>
        </div>
        <div style={scrollStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead style={{ position: "sticky", top: 0, background: "#fff", zIndex: 10 }}>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                {["Program Studi", "Jenjang", "Mahasiswa", "Dosen", "Mata Kuliah", "Kurikulum", "Rasio"].map(h => <th key={h} style={{ padding: "11px 8px", color: "#64748b", fontSize: 12 }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredPrograms.map(p => (
                <tr key={p.name} onClick={() => setProgram(p)} style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}>
                  <td style={{ padding: "14px 8px", fontWeight: 600, color: "#0f172a" }}>{p.name}</td>
                  <td style={{ fontSize: 13, color: "#475569" }}>{p.level}</td>
                  <td>{p.students.toLocaleString("id-ID")}</td>
                  <td>{p.lecturers}</td>
                  <td>{p.courses}</td>
                  <td>
                    <div style={{ width: 100 }}>
                      <Progress value={p.curriculum} />
                      <small style={{ ...muted, display: "block", marginTop: 4 }}>{p.curriculum}%</small>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: "#334155" }}>{(p.students / p.lecturers).toFixed(1)} : 1</td>
                </tr>
              ))}
            </tbody>
          </table>
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
            {filteredWorkload.map(d => (
              <div key={d.name} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <strong style={{ fontSize: 14 }}>{d.name}</strong>
                    <div style={{ ...muted, marginTop: 4 }}>{d.department} · {d.classes} kelas · {d.students} mhs</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <strong style={{ fontSize: 14 }}>{d.sks} SKS</strong>
                    <div style={{ ...muted, marginTop: 4 }}>target {d.target}</div>
                  </div>
                </div>
                <Progress value={d.load} max={150} />
                <div style={{ ...muted, marginTop: 6, fontSize: 11 }}>{d.load}% dari baseline</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 13, padding: 22, height: "fit-content" }}>
            <div style={{ ...muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>EXECUTIVE INSIGHT</div>
            <h3 style={{ margin: "8px 0 12px" }}>Redistribusi beban pengajaran</h3>
            <p style={{ color: "#475569", lineHeight: 1.6, fontSize: 13 }}>Dosen dengan beban tinggi dapat menjadi kandidat redistribusi kelas, team teaching, atau penguatan dosen pengampu lain.</p>
            <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
              <div style={{ background: "#fff", padding: 14, borderRadius: 10, border: "1px solid #e2e8f0" }}>
                <strong style={{ fontSize: 16, color: "#dc2626" }}>4 dosen</strong>
                <div style={muted}>di atas 115% baseline</div>
              </div>
              <div style={{ background: "#fff", padding: 14, borderRadius: 10, border: "1px solid #e2e8f0" }}>
                <strong style={{ fontSize: 16, color: "#059669" }}>2 dosen</strong>
                <div style={muted}>di bawah 80% baseline</div>
              </div>
            </div>
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
                <Progress value={p.curriculum} />
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
                <Progress value={ach} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RASIO DOSEN MAHASISWA */}
      <section style={{ ...card, marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 19 }}>Rasio Dosen–Mahasiswa per Program Studi</h2>
        <p style={{ ...muted, margin: "5px 0 18px" }}>Indikator kapasitas pengajaran untuk redistribusi beban.</p>
        <div style={{ ...scrollStyle, maxHeight: "300px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14 }}>
            {programs.map(p => {
              const r = +(p.students / p.lecturers).toFixed(1);
              const status = r > 25 ? "Perlu perhatian" : r > 18 ? "Monitor" : "Sehat";
              const statusColor = r > 25 ? "#dc2626" : r > 18 ? "#d97706" : "#059669";
              return (
                <div key={p.name} style={{ padding: 18, border: "1px solid #e2e8f0", borderRadius: 12, background: "#f8fafc" }}>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>{p.level}</div>
                  <strong style={{ fontSize: 13, color: "#0f172a", lineHeight: 1.3, display: "block", minHeight: 34 }}>{p.name}</strong>
                  <div style={{ fontSize: 26, fontWeight: 800, marginTop: 12, color: "#1e293b" }}>{r}:1</div>
                  <div style={{ ...muted, marginTop: 6, fontSize: 11 }}>{p.students} mhs · {p.lecturers} dosen</div>
                  <div style={{ marginTop: 12, fontSize: 11, fontWeight: 700, color: statusColor, background: "#fff", padding: "4px 8px", borderRadius: 6, display: "inline-block", border: `1px solid ${statusColor}33` }}>
                    {status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MODAL COURSE */}
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

      {/* MODAL PROGRAM */}
      {program && (
        <div className="modal-backdrop" onClick={() => setProgram(null)}>
          <div className="research-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setProgram(null)}>✕</button>
            <div className="eyebrow">{program.level}</div>
            <h2>{program.name}</h2>
            <p className="modal-abstract">Tinjauan kapasitas akademik dan rasio pengajaran untuk program studi {program.name}.</p>
            <div className="detail-grid">
              <div><span>Total Mahasiswa</span><strong>{program.students.toLocaleString("id-ID")} orang</strong></div>
              <div><span>Total Dosen</span><strong>{program.lecturers} dosen</strong></div>
              <div><span>Mata Kuliah Aktif</span><strong>{program.courses} MK</strong></div>
              <div><span>Capaian Kurikulum</span><strong>{program.curriculum}%</strong></div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}