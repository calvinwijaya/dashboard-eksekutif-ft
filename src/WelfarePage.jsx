import React, { useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BarChart3, BriefcaseBusiness, Building2,
  ChevronRight, Clock3, GraduationCap, HeartPulse, ShieldCheck,
  Sparkles, TrendingDown, TrendingUp, Users, Wrench,
} from "lucide-react";
import "./styles.css";

import WelfareData from "../data/WelfareData.json";
const { 
  staffGroups, workloadData, workloadInterventions, 
  facilities, academicRanks, welfareIndicators, sdmActions,
  socialGuarantees 
} = WelfareData;

const iconMap = {
  GraduationCap: GraduationCap,
  BriefcaseBusiness: BriefcaseBusiness,
  Users: Users
};

const priorityStyle = {
  "Prioritas tinggi": { bg: "#fff1f2", color: "#be123c" },
  "Prioritas sedang": { bg: "#fffbeb", color: "#a16207" },
};

function ProgressBar({ value, max = 100, tone = "navy", height = 8 }) {
  const colors = { navy: "#102a43", green: "#2f7d4f", gold: "#b7791f", blue: "#2b6cb0", red: "#c2410c" };
  return (
    <div style={{ height, borderRadius: 999, background: "#edf2f7", overflow: "hidden", width: "100%" }}>
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: "100%", borderRadius: 999, background: colors[tone] || colors.navy, transition: "width .35s ease" }} />
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, sub, tone = "navy" }) {
  const colors = { navy: "#102a43", green: "#2f7d4f", gold: "#a16207", blue: "#2563a6", red: "#b42318" };
  return (
    <div className="kpi-card">
      <div style={{ display: "flex", marginBottom: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", background: "#f5f8fb", color: colors[tone] }}>
          <Icon size={18} />
        </div>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-sub">{sub}</div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, description, icon: Icon }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, marginBottom: 18 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 11, fontWeight: 800, letterSpacing: ".14em" }}>{Icon && <Icon size={14} />}{eyebrow}</div>
        <h3 style={{ margin: "7px 0 0", fontSize: 23, color: "#102a43" }}>{title}</h3>
        {description && <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13, lineHeight: 1.55 }}>{description}</p>}
      </div>
    </div>
  );
}

export default function WelfarePage({ onBack }) {
  const [activeGroup, setActiveGroup] = useState("dosen");
  const [facilityFilter, setFacilityFilter] = useState("Semua");
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedWorkload, setSelectedWorkload] = useState(null);

  const activeStaff = staffGroups.find((item) => item.id === activeGroup);
  const filteredFacilities = useMemo(() => {
    if (facilityFilter === "Semua") return facilities;
    if (facilityFilter === "Perlu perbaikan") return facilities.filter((x) => x.repair > 0 || x.critical > 0);
    return facilities.filter((x) => x.critical > 0);
  }, [facilityFilter]);

  const totalFacilities = facilities.reduce((sum, x) => sum + x.items, 0);
  const totalCritical = facilities.reduce((sum, x) => sum + x.critical, 0);
  const avgUtilization = Math.round(facilities.reduce((sum, x) => sum + x.utilization, 0) / facilities.length);

  return (
    <main className="main-content">
      <section className="module-hero">
        <button className="back-button dark" onClick={onBack}>
          <ArrowLeft size={15} /> Executive Overview
        </button>
        <div className="module-title-row">
          <div className="module-title-copy">
            <div className="eyebrow">04 · PEOPLE & ORGANIZATIONAL INTELLIGENCE</div>
            <h2>Kesejahteraan Fakultas</h2>
            <p>Kesejahteraan dipandang sebagai hubungan antara beban kerja, kualitas lingkungan kerja, fasilitas, pengembangan karier, dan dukungan institusional — bukan hanya kompensasi.</p>
          </div>
          <div className="module-hero-kpi">
            <strong>81</strong>
            <span>Welfare Index</span>
          </div>
        </div>
      </section>

      <section className="kpi-grid">
        <MetricCard icon={HeartPulse} label="Faculty Welfare Index" value="81 / 100" sub="Composite dummy indicator" tone="green" />
        <MetricCard icon={Clock3} label="Rata-rata beban administratif" value="18%" sub="Target strategis: ≤ 10%" tone="red" />
        <MetricCard icon={Wrench} label="Inventaris fasilitas" value={totalFacilities} sub={`${totalCritical} unit berstatus kritis`} tone="gold" />
        <MetricCard icon={TrendingUp} label="Utilisasi fasilitas" value={`${avgUtilization}%`} sub="Rata-rata 5 laboratorium utama" tone="blue" />
      </section>

      <section style={{ border: "1px solid #e2e8f0", borderRadius: 20, background: "#fff", padding: 22, marginBottom: 24 }}>
        <SectionHeader eyebrow="WELFARE SEGMENTS" title="Kesejahteraan warga Fakultas" description="Bandingkan indikator kesejahteraan pada tiga kelompok utama." icon={Users} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
          {staffGroups.map((item) => {
            const Icon = iconMap[item.iconName]; 
            const active = activeGroup === item.id;
            return (
              <button key={item.id} onClick={() => setActiveGroup(item.id)} style={{ textAlign: "left", border: `1px solid ${active ? "#b7c9d9" : "#e2e8f0"}`, background: active ? "#f5f9fc" : "#fff", borderRadius: 16, padding: 17, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 800, color: "#102a43" }}><Icon size={19} />{item.label}</span><ChevronRight size={17} color="#94a3b8" /></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginTop: 22 }}><div><strong style={{ fontSize: 25, color: "#102a43" }}>{item.count.toLocaleString("id-ID")}</strong><div style={{ color: "#94a3b8", fontSize: 11 }}>populasi</div></div><div style={{ textAlign: "right" }}><strong style={{ color: "#2f7d4f", fontSize: 20 }}>{item.score}</strong><div style={{ color: "#94a3b8", fontSize: 11 }}>welfare score</div></div></div>
                <div style={{ marginTop: 12 }}><ProgressBar value={item.score} tone="green" /></div>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 14, borderRadius: 14, background: "#f8fafc", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div><strong style={{ color: "#102a43" }}>{activeStaff.label}</strong><span style={{ color: "#64748b", marginLeft: 8, fontSize: 12 }}>{activeStaff.count.toLocaleString("id-ID")} orang · skor kesejahteraan {activeStaff.score}/100</span></div>
          <span style={{ color: "#2f7d4f", fontSize: 12, fontWeight: 800 }}>{activeStaff.score >= 80 ? "Kondisi relatif baik" : "Perlu intervensi"}</span>
        </div>
      </section>

      {/* =====================================================
          BASIC WELFARE & COVERAGE (BPJS & KP4)
      ===================================================== */}
      <section style={{ border: "1px solid #e2e8f0", borderRadius: 20, background: "#fff", padding: 22, marginBottom: 24 }}>
        <SectionHeader 
          eyebrow="BASIC WELFARE & COVERAGE" 
          title="Jaminan Sosial & Administratif" 
          description="Pemenuhan hak jaminan sosial dasar (BPJS) dan kelengkapan administrasi tunjangan keluarga (KP4) bagi seluruh sivitas." 
          icon={ShieldCheck} 
        />
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {socialGuarantees.map((item) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 18, padding: 18, borderRadius: 14, background: "#f8fafc", border: "1px solid #edf2f7" }}>
              
              {/* Blok Angka Ketercakupan */}
              <div style={{ textAlign: "center", paddingRight: 18, borderRight: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#2f7d4f", lineHeight: 1, letterSpacing: "-0.03em" }}>
                  {item.coverage}%
                </div>
                <div style={{ fontSize: 10, color: "#64748b", marginTop: 6, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700 }}>
                  Ter-cover
                </div>
              </div>
              
              {/* Blok Judul dan Deskripsi */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <strong style={{ fontSize: 15, color: "#102a43" }}>{item.title}</strong>
                  <span style={{ fontSize: 10, fontWeight: 800, background: "#e7f4ec", color: "#2d7b4b", padding: "4px 8px", borderRadius: 20 }}>
                    {item.status}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>

            </div>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: 18, marginBottom: 24 }}>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 20, background: "#fff", padding: 22 }}>
          <SectionHeader eyebrow="WORKLOAD INTELLIGENCE" title="Beban kerja dosen" description="Fokus utama: meningkatkan kesejahteraan melalui pengurangan beban yang tidak memberi nilai tambah." icon={Clock3} />
          <div style={{ display: "grid", gap: 13 }}>
            {workloadData.map((item) => {
              const selected = selectedWorkload?.name === item.name; const overloaded = item.value > item.target;
              return (
                <button key={item.name} onClick={() => setSelectedWorkload(selected ? null : item)} style={{ border: `1px solid ${selected ? "#cbd5e1" : "transparent"}`, background: selected ? "#f8fafc" : "transparent", borderRadius: 12, padding: "8px 10px", textAlign: "left", cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 7 }}><span style={{ fontWeight: 750, color: "#334155", fontSize: 13 }}>{item.name}</span><span style={{ fontSize: 12, color: overloaded ? "#b42318" : "#64748b", fontWeight: 800 }}>{item.value}% <span style={{ fontWeight: 500 }}>· target {item.target}%</span></span></div>
                  <div style={{ position: "relative" }}><ProgressBar value={item.value} tone={overloaded ? "red" : "navy"} height={9} /><div style={{ position: "absolute", top: -3, bottom: -3, left: `${item.target}%`, width: 2, background: "#64748b", opacity: .55 }} /></div>
                  <div style={{ marginTop: 5, color: overloaded ? "#b42318" : "#64748b", fontSize: 10 }}>{item.note}</div>
                </button>
              );
            })}
          </div>
          {selectedWorkload && <div style={{ marginTop: 12, borderRadius: 14, background: "#fff7ed", border: "1px solid #fed7aa", padding: 14 }}><strong style={{ color: "#9a3412", fontSize: 13 }}>{selectedWorkload.name}: {selectedWorkload.value}% vs target {selectedWorkload.target}%</strong><p style={{ margin: "5px 0 0", color: "#7c2d12", fontSize: 12, lineHeight: 1.5 }}>Area ini dapat menjadi sasaran intervensi untuk menurunkan waktu non-core sehingga dosen memiliki ruang lebih besar untuk pengajaran berkualitas, riset, dan pengembangan diri.</p></div>}
        </div>

        <div style={{ borderRadius: 20, padding: 22, background: "#102a43", color: "#fff", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, fontWeight: 800, letterSpacing: ".14em", opacity: .65 }}><Sparkles size={14} />STRATEGIC PRIORITY</div>
          <h3 style={{ fontSize: 25, lineHeight: 1.2, margin: "15px 0 10px" }}>Kesejahteraan bukan hanya soal kompensasi.</h3>
          <p style={{ margin: 0, color: "#cbd5e1", fontSize: 13, lineHeight: 1.65 }}>Salah satu tuas intervensi yang paling langsung adalah mengurangi pekerjaan administratif, pelaporan berulang, dan distribusi beban yang tidak seimbang.</p>
          <div style={{ marginTop: 24, display: "grid", gap: 10 }}>
            {workloadInterventions.map((item) => { const tone = priorityStyle[item.priority]; return <div key={item.title} style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.08)" }}><div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><strong style={{ fontSize: 12 }}>{item.title}</strong><span style={{ fontSize: 9, fontWeight: 800, padding: "4px 7px", borderRadius: 999, background: tone.bg, color: tone.color, whiteSpace: "nowrap" }}>{item.priority}</span></div><div style={{ marginTop: 5, color: "#cbd5e1", fontSize: 10.5, lineHeight: 1.45 }}>{item.description}</div><div style={{ marginTop: 7, color: "#9ae6b4", fontSize: 10, fontWeight: 800 }}>Expected impact: {item.impact}</div></div>; })}
          </div>
        </div>
      </section>

      <section style={{ border: "1px solid #e2e8f0", borderRadius: 20, background: "#fff", padding: 22, marginBottom: 24 }}>
        <SectionHeader eyebrow="FACILITY SUFFICIENCY" title="Ketercukupan & kondisi fasilitas" description="Identifikasi aset yang sehat, membutuhkan perbaikan, dan berpotensi menghambat kegiatan akademik." icon={Building2} />
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {["Semua", "Perlu perbaikan", "Kritis"].map((filter) => <button key={filter} onClick={() => setFacilityFilter(filter)} style={{ border: "1px solid #dbe4ec", borderRadius: 999, padding: "7px 12px", background: facilityFilter === filter ? "#102a43" : "#fff", color: facilityFilter === filter ? "#fff" : "#475569", cursor: "pointer", fontSize: 11, fontWeight: 750 }}>{filter}</button>)}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}><thead><tr>{["Fasilitas", "Departemen", "Inventaris", "Baik", "Perbaikan", "Kritis", "Utilisasi"].map((head) => <th key={head} style={{ textAlign: head === "Fasilitas" || head === "Departemen" ? "left" : "right", padding: "10px 8px", borderBottom: "1px solid #e2e8f0", color: "#94a3b8", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase" }}>{head}</th>)}</tr></thead><tbody>
            {filteredFacilities.map((item) => <tr key={item.name} onClick={() => setSelectedFacility(item)} style={{ cursor: "pointer" }}><td style={{ padding: "13px 8px", borderBottom: "1px solid #f1f5f9", color: "#102a43", fontWeight: 750, fontSize: 12 }}>{item.name}</td><td style={{ padding: "13px 8px", borderBottom: "1px solid #f1f5f9", color: "#64748b", fontSize: 11 }}>{item.department}</td><td style={{ padding: "13px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right", fontWeight: 750 }}>{item.items}</td><td style={{ padding: "13px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#2f7d4f" }}>{item.good}</td><td style={{ padding: "13px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#a16207" }}>{item.repair}</td><td style={{ padding: "13px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: item.critical ? "#b42318" : "#64748b", fontWeight: item.critical ? 800 : 500 }}>{item.critical}</td><td style={{ padding: "13px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right", minWidth: 120 }}><div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}><div style={{ width: 60 }}><ProgressBar value={item.utilization} tone={item.utilization > 85 ? "gold" : "green"} height={6} /></div><span style={{ fontSize: 11, fontWeight: 750 }}>{item.utilization}%</span></div></td></tr>)}
          </tbody></table>
        </div>
        {selectedFacility && <div style={{ marginTop: 15, display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center", padding: 15, borderRadius: 14, background: "#f8fafc", border: "1px solid #e2e8f0" }}><div><strong style={{ color: "#102a43", fontSize: 13 }}>{selectedFacility.name}</strong><div style={{ marginTop: 5, color: "#64748b", fontSize: 11 }}>{selectedFacility.department} · {selectedFacility.items} aset · {selectedFacility.utilization}% utilisasi</div></div><div style={{ display: "flex", gap: 14, fontSize: 11 }}><span style={{ color: "#2f7d4f" }}><b>{selectedFacility.good}</b> baik</span><span style={{ color: "#a16207" }}><b>{selectedFacility.repair}</b> perbaikan</span><span style={{ color: "#b42318" }}><b>{selectedFacility.critical}</b> kritis</span></div></div>}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 18, marginBottom: 24 }}>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 20, background: "#fff", padding: 22 }}>
          <SectionHeader eyebrow="HUMAN CAPITAL DEVELOPMENT" title="Pipeline pengembangan SDM dosen" description="Distribusi jabatan akademik dan ruang intervensi untuk percepatan pengembangan karier." icon={GraduationCap} />
          <div style={{ display: "grid", gap: 14 }}>{academicRanks.map((item) => { const max = Math.max(...academicRanks.map((x) => x.count)); return <div key={item.rank}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 12, color: "#334155", fontWeight: 700 }}>{item.rank}</span><strong style={{ fontSize: 12, color: "#102a43" }}>{item.count} dosen</strong></div><ProgressBar value={item.count} max={max} tone={item.tone} height={10} /></div>; })}</div>
          <div style={{ marginTop: 20, padding: 14, borderRadius: 14, background: "#f8fafc", display: "flex", alignItems: "center", gap: 11 }}><ShieldCheck size={20} color="#2f7d4f" /><div><strong style={{ display: "block", fontSize: 12, color: "#102a43" }}>Strategic HR signal</strong><span style={{ fontSize: 11, color: "#64748b" }}>Fokus berikutnya dapat diarahkan pada pipeline Lektor Kepala dan Guru Besar.</span></div></div>
        </div>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 20, background: "#fff", padding: 22 }}>
          <SectionHeader eyebrow="DEVELOPMENT PIPELINE" title="Agenda pengembangan" description="Dummy snapshot untuk melihat kebutuhan intervensi SDM." icon={Sparkles} />
          <div style={{ display: "grid", gap: 11 }}>{sdmActions.map((item) => <div key={item.label} style={{ padding: 13, borderRadius: 13, background: "#f8fafc", border: "1px solid #edf2f7" }}><div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span style={{ color: "#334155", fontWeight: 750, fontSize: 12 }}>{item.label}</span><strong style={{ color: "#102a43", fontSize: 16 }}>{item.value}</strong></div><div style={{ marginTop: 4, color: "#94a3b8", fontSize: 10 }}>{item.detail}</div></div>)}</div>
        </div>
      </section>

      <section style={{ border: "1px solid #e2e8f0", borderRadius: 20, background: "#fff", padding: 22, marginBottom: 28 }}>
        <SectionHeader eyebrow="WELFARE INDICATORS" title="Indikator kesejahteraan" description="Contoh indeks komposit yang dapat dikembangkan dari survei, HR system, workload system, dan inventaris fasilitas." icon={BarChart3} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>{welfareIndicators.map((item) => <div key={item.label} style={{ border: "1px solid #edf2f7", borderRadius: 14, padding: 15, background: "#fbfcfe" }}><div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#475569", fontSize: 11, fontWeight: 700 }}>{item.label}</span><span style={{ color: "#2f7d4f", fontSize: 10, fontWeight: 800 }}>{item.trend}</span></div><div style={{ display: "flex", alignItems: "baseline", gap: 7, marginTop: 11 }}><strong style={{ fontSize: 26, color: "#102a43" }}>{item.value}</strong><span style={{ color: "#94a3b8", fontSize: 10 }}>/100</span></div><div style={{ marginTop: 9 }}><ProgressBar value={item.value} tone={item.value >= 80 ? "green" : "gold"} /></div></div>)}</div>
      </section>

      <section style={{ borderRadius: 20, padding: "20px 22px", background: "#f5f8fb", border: "1px solid #dbe4ec", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 42, height: 42, borderRadius: 12, background: "#fff", display: "grid", placeItems: "center", color: "#102a43", border: "1px solid #e2e8f0" }}><TrendingDown size={20} /></div><div><div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".13em", color: "#64748b" }}>EXECUTIVE DECISION</div><strong style={{ display: "block", color: "#102a43", marginTop: 4, fontSize: 15 }}>Kurangi beban yang tidak produktif sebelum menambah beban baru.</strong><span style={{ display: "block", color: "#64748b", marginTop: 3, fontSize: 11 }}>Data kesejahteraan sebaiknya diarahkan menjadi dasar prioritas intervensi organisasi.</span></div></div>
        <button style={{ border: 0, background: "#102a43", color: "#fff", borderRadius: 10, padding: "10px 14px", display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}>Strategic Actions <ArrowRight size={15} /></button>
      </section>
    </main>
  );
}
