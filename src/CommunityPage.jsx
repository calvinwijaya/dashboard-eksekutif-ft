import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Filter,
  MapPin,
  Users,
  Handshake,
  TrendingUp,
  Leaf,
  X,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import CommunityData from "../data/CommunityData.json";

const { communityPrograms, partners, departmentMatrix, departmentHeaders } = CommunityData;


// ============================================================
// HELPERS FOR GEOJSON
// ============================================================

function getFeatureName(properties = {}) {
  return (
    properties.Kabupaten ||
    properties.Kab_Kota ||
    properties.kabupaten ||
    properties.KABUPATEN ||
    properties.nama ||
    properties.NAMA ||
    properties.name ||
    properties.NAME ||
    properties.WADMKK ||
    "Wilayah"
  );
}


function getFeatureCount(properties = {}) {
  const candidates = [
    properties.Jumlah_Pengabdian,
    properties.jumlah_pengabdian,
    properties.JUMLAH_PENGABDIAN,
    properties.jumlah,
    properties.JUMLAH,
    properties.count,
    properties.COUNT,
    properties.pengabdian,
    properties.PENGABDIAN,
  ];

  const value = candidates.find(
    (v) => v !== undefined && v !== null && v !== ""
  );

  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}


// ============================================================
// MAP COMPONENT
// ============================================================

function CommunityMap({ onSelectRegion }) {
  const [geojson, setGeojson] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/sebaran_pengabdian.geojson")
      .then((response) => {
        if (!response.ok) {
          throw new Error("GeoJSON tidak dapat dimuat.");
        }

        return response.json();
      })
      .then((data) => setGeojson(data))
      .catch((err) => setError(err.message));
  }, []);

  const maxCount = useMemo(() => {
    if (!geojson?.features?.length) return 1;

    return Math.max(
      ...geojson.features.map((feature) =>
        getFeatureCount(feature.properties)
      ),
      1
    );
  }, [geojson]);


  const getColor = (count) => {
    const ratio = count / maxCount;

    if (ratio > 0.8) return "#14532d";
    if (ratio > 0.6) return "#2f7d4f";
    if (ratio > 0.4) return "#5f9f70";
    if (ratio > 0.2) return "#91bd8f";

    return "#d8e8d3";
  };


  const style = (feature) => {
    const count = getFeatureCount(feature?.properties);

    return {
      fillColor: getColor(count),
      weight: 1.2,
      opacity: 1,
      color: "#ffffff",
      fillOpacity: 0.78,
    };
  };


  const onEachFeature = (feature, layer) => {
    const name = getFeatureName(feature.properties);
    const count = getFeatureCount(feature.properties);

    layer.bindTooltip(
      `${name}<br/><strong>${count} kegiatan</strong>`,
      {
        sticky: true,
        direction: "top",
      }
    );

    layer.bindPopup(`
      <div class="map-popup">
        <strong>${name}</strong>
        <span>${count} kegiatan pengabdian</span>
      </div>
    `);

    layer.on({
      mouseover: (event) => {
        event.target.setStyle({
          weight: 2.2,
          color: "#16324f",
          fillOpacity: 0.9,
        });
      },

      mouseout: (event) => {
        event.target.setStyle(style(feature));
      },

      click: () => {
        onSelectRegion({
          name,
          count,
        });
      },
    });
  };


  if (error) {
    return (
      <div className="map-error">
        <MapPin size={20} />
        <strong>GeoJSON tidak dapat dimuat</strong>
        <span>{error}</span>
      </div>
    );
  }


  return (
    <MapContainer
      center={[-7.7956, 110.3695]}
      zoom={10}
      scrollWheelZoom={true}
      className="community-map"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {geojson && (
        <GeoJSON
          data={geojson}
          style={style}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
}


// ============================================================
// MAIN COMMUNITY PAGE
// ============================================================

export default function CommunityPage({ onBack }) {
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [departmentFilter, setDepartmentFilter] = useState("Semua Departemen");
  const [search, setSearch] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);


  const filteredPrograms = useMemo(() => {
    const q = search.trim().toLowerCase();

    return communityPrograms.filter((program) => {
      const matchesStatus =
        statusFilter === "Semua" ||
        program.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "Semua Departemen" ||
        program.department === departmentFilter;

      const matchesSearch =
        !q ||
        [
          program.title,
          program.department,
          program.location,
          program.partner,
          program.category,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      return (
        matchesStatus &&
        matchesDepartment &&
        matchesSearch
      );
    });
  }, [statusFilter, departmentFilter, search]);


  return (
    <main className="main-content">
      <section className="module-hero">
        <button className="back-button dark" onClick={onBack}>
          <ArrowLeft size={15} /> Executive Overview
        </button>
        <div className="module-title-row">
          <div className="module-title-copy">
            <div className="eyebrow">02 · COMMUNITY IMPACT INTELLIGENCE</div>
            <h2>Pengabdian kepada Masyarakat</h2>
            <p>Memantau portofolio pengabdian, keterlibatan departemen, mitra strategis, sebaran wilayah, serta dampak dan keberlanjutan program.</p>
          </div>
          <div className="module-hero-kpi">
            <strong>186</strong>
            <span>Total Community Programs</span>
          </div>
        </div>
      </section>


      {/* =====================================================
          KPI
      ===================================================== */}

      <section className="kpi-grid">
        {[
          ["186", "Total Program", "Community programs"],
          ["72", "Mitra", "Strategic partners"],
          ["34", "Wilayah", "Areas reached"],
          ["48", "Sedang Berlangsung", "Active programs"],
        ].map(([value, label, sub]) => (
          <div className="kpi-card" key={label}>
            <div className="kpi-value">{value}</div>
            <div className="kpi-label">{label}</div>
            <div className="kpi-sub">{sub}</div>
          </div>
        ))}
      </section>


      {/* =====================================================
          PORTFOLIO
      ===================================================== */}

      <section className="panel community-filter-panel">

        <div className="filter-heading">

          <div>
            <div className="eyebrow">
              COMMUNITY PORTFOLIO
            </div>

            <h3>
              Katalog Kegiatan Pengabdian
            </h3>
          </div>

          <Filter
            size={17}
            className="muted"
          />

        </div>


        <div className="filters">

          <div className="search-box">
            <MapPin size={16} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Cari program, lokasi, mitra..."
            />
          </div>


          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option>Semua</option>
            <option>Aktif</option>
            <option>Selesai</option>
            <option>Direncanakan</option>
          </select>


          <select
            value={departmentFilter}
            onChange={(e) =>
              setDepartmentFilter(e.target.value)
            }
          >
            <option>Semua Departemen</option>

            {[...new Set(
              communityPrograms.map(
                (program) => program.department
              )
            )].map((department) => (
              <option
                key={department}
                value={department}
              >
                {department}
              </option>
            ))}

          </select>

        </div>

      </section>


      {/* =====================================================
          PROGRAM LIST + SNAPSHOT
      ===================================================== */}

      <section className="community-portfolio-layout">

        <div className="community-list">

          <div className="list-meta">
            <strong>{filteredPrograms.length} </strong> kegiatan ditampilkan<span>· klik kartu untuk melihat detail</span>
          </div>


          {filteredPrograms.map((program) => (

            <button
              key={program.id}
              className="community-card"
              onClick={() =>
                setSelectedProgram(program)
              }
            >

              <div className="community-card-top">

                <span
                  className={`status-badge ${program.status.toLowerCase()}`}
                >
                  {program.status}
                </span>

                <span className="community-id">
                  {program.id}
                </span>

              </div>


              <h3>
                {program.title}
              </h3>


              <p>
                {program.description}
              </p>


              <div className="community-meta">

                <span>
                  <Building2 size={13} />
                  {program.department}
                </span>

                <span>
                  <MapPin size={13} />
                  {program.location}
                </span>

                <span>
                  <Handshake size={13} />
                  {program.partner}
                </span>

              </div>


              <div className="tag-row">

                <span className="tag">
                  {program.category}
                </span>

                <span className="tag soft">
                  {program.year}
                </span>

              </div>


              <div className="community-card-bottom">

                <span>
                  Impact {program.impact}
                </span>

                <span>
                  Sustainability {program.sustainability}
                </span>

                <ArrowRight size={16} />

              </div>

            </button>

          ))}

        </div>


        <aside className="community-side">

          {/* PROGRAM SNAPSHOT */}

          <div className="panel community-snapshot">

            <div className="panel-heading">

              <div>
                <div className="eyebrow">
                  PROGRAM SNAPSHOT
                </div>

                <h3>
                  Status Pengabdian
                </h3>
              </div>

              <TrendingUp
                size={18}
                className="muted"
              />

            </div>


            {[
              ["Aktif", 48, "green"],
              ["Selesai", 91, "blue"],
              ["Direncanakan", 47, "gold"],
            ].map(([label, value, tone]) => (

              <div
                className="snapshot-row"
                key={label}
              >

                <div>
                  <strong>{label}</strong>
                  <span>
                    {value} program
                  </span>
                </div>

                <div className={`snapshot-number ${tone}`}>
                  {value}
                </div>

              </div>

            ))}

          </div>


          {/* QUICK PARTNERS */}

          <div className="panel">

            <div className="panel-heading">

              <div>
                <div className="eyebrow">
                  STRATEGIC PARTNERS
                </div>

                <h3>
                  Mitra Utama
                </h3>
              </div>

              <Handshake
                size={18}
                className="muted"
              />

            </div>


            {partners.slice(0, 4).map((partner) => (

              <div
                className="partner-mini-row"
                key={partner.name}
              >

                <div className="partner-icon">
                  <Users size={14} />
                </div>

                <div>
                  <strong>
                    {partner.name}
                  </strong>

                  <span>
                    {partner.type}
                  </span>
                </div>

                <em>
                  {partner.programs}
                </em>

              </div>

            ))}

          </div>

        </aside>

      </section>


      {/* =====================================================
          MAP
      ===================================================== */}

      <section className="community-map-section">

        <div className="section-heading compact-heading">

          <div>
            <div className="eyebrow">
              SPATIAL DISTRIBUTION
            </div>

            <h3>
              Sebaran Wilayah Pengabdian
            </h3>
          </div>

          <p>
            Klik wilayah untuk melihat jumlah kegiatan
            pengabdian.
          </p>

        </div>


        <div className="community-map-layout">

          <div className="panel map-panel">

            <CommunityMap
              onSelectRegion={setSelectedRegion}
            />

            <div className="map-gradient-legend">

              <span>Rendah</span>

              <div className="gradient-bar" />

              <span>Tinggi</span>

            </div>

          </div>


          <div className="panel region-panel">

            <div className="panel-heading">

              <div>
                <div className="eyebrow">
                  REGION INSIGHT
                </div>

                <h3>
                  {selectedRegion?.name ||
                    "Pilih wilayah"}
                </h3>
              </div>

              <MapPin
                size={18}
                className="muted"
              />

            </div>


            {selectedRegion ? (

              <>

                <div className="region-big-number">
                  {selectedRegion.count}
                </div>

                <span className="region-label">
                  kegiatan pengabdian
                </span>

                <div className="region-divider" />

                <div className="region-detail">
                  <span>Wilayah</span>
                  <strong>
                    {selectedRegion.name}
                  </strong>
                </div>

              </>

            ) : (

              <div className="region-empty">
                <MapPin size={22} />
                <span>
                  Klik salah satu kabupaten /
                  kota pada peta.
                </span>
              </div>

            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          DEPARTMENT COLLABORATION
      ===================================================== */}

      <section className="panel community-department-panel">

        <div className="panel-heading">

          <div>
            <div className="eyebrow">
              CROSS-DEPARTMENT ENGAGEMENT
            </div>

            <h3>
              Keterlibatan Antar Departemen
            </h3>
          </div>

          <span className="panel-chip">
            Dummy relationship data
          </span>

        </div>


        <p className="matrix-intro">
          Menunjukkan histori dan potensi keterlibatan
          antar departemen dalam kegiatan pengabdian.
        </p>


        <div className="matrix-wrap">

          <table className="matrix-table">

            <thead>

              <tr>
                <th>Departemen</th>

                {departmentHeaders.map(
                  (header) => (
                    <th key={header}>
                      {header}
                    </th>
                  )
                )}

              </tr>

            </thead>


            <tbody>

              {departmentMatrix.map(
                (row) => (

                  <tr key={row[0]}>

                    <th>
                      {row[0]}
                    </th>

                    {row.slice(1).map(
                      (cell, index) => (

                        <td key={index}>

                          <button
                            className={`matrix-cell ${
                              cell === "●"
                                ? "strong"
                                : cell === "○"
                                ? "potential"
                                : "none"
                            }`}
                          >
                            {cell}
                          </button>

                        </td>

                      )
                    )}

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>


        <div className="matrix-legend">

          <span>
            <i className="legend-strong" />
            Strong / existing
          </span>

          <span>
            <i className="legend-potential" />
            Potential
          </span>

          <span>
            <i className="legend-none" />
            Self / none
          </span>

        </div>

      </section>


      {/* =====================================================
          PARTNERS
      ===================================================== */}

      <section className="panel partners-section">

        <div className="panel-heading">

          <div>
            <div className="eyebrow">
              PARTNERSHIP INTELLIGENCE
            </div>

            <h3>
              Daftar Mitra Pengabdian
            </h3>
          </div>

          <span className="panel-chip">
            {partners.length} strategic partners
          </span>

        </div>


        <div className="partners-grid">

          {partners.map((partner) => (

            <div
              className="partner-card"
              key={partner.name}
            >

              <div className="partner-card-icon">
                <Handshake size={18} />
              </div>

              <div>

                <strong>
                  {partner.name}
                </strong>

                <span>
                  {partner.type}
                </span>

              </div>

              <em>
                {partner.programs}
                <small>program</small>
              </em>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          IMPACT × SUSTAINABILITY
      ===================================================== */}

      <section className="panel impact-panel">

        <div className="panel-heading">

          <div>
            <div className="eyebrow">
              IMPACT INTELLIGENCE
            </div>

            <h3>
              Impact × Sustainability
            </h3>
          </div>

          <div className="impact-legend">
            <span>
              <Leaf size={13} />
              Sustainability
            </span>
            <span>
              <TrendingUp size={13} />
              Impact
            </span>
          </div>

        </div>


        <div className="impact-grid">

          <div className="impact-axis-y">
            HIGH<br />
            SUSTAINABILITY
          </div>


          <div className="impact-chart">

            <div className="impact-grid-line horizontal one" />
            <div className="impact-grid-line horizontal two" />
            <div className="impact-grid-line vertical one" />
            <div className="impact-grid-line vertical two" />


            {communityPrograms.map(
              (program) => (

                <button
                  key={program.id}
                  className="impact-point"
                  style={{
                    left: `${program.impact}%`,
                    bottom: `${program.sustainability}%`,
                  }}
                  title={`${program.title} — Impact ${program.impact}, Sustainability ${program.sustainability}`}
                  onClick={() =>
                    setSelectedProgram(program)
                  }
                >
                  <span />
                  <strong>
                    {program.id.replace("PKM-", "")}
                  </strong>
                </button>

              )
            )}


            <div className="quadrant-label top-left">
              Sustainable
            </div>

            <div className="quadrant-label top-right">
              Strategic Priority
            </div>

            <div className="quadrant-label bottom-left">
              Monitor
            </div>

            <div className="quadrant-label bottom-right">
              High Impact
            </div>

          </div>


          <div className="impact-axis-x">
            <span>LOW IMPACT</span>
            <span>HIGH IMPACT</span>
          </div>

        </div>

      </section>


      {/* =====================================================
          DETAIL MODAL
      ===================================================== */}

      {selectedProgram && (

        <div
          className="modal-backdrop"
          onClick={() =>
            setSelectedProgram(null)
          }
        >

          <div
            className="community-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedProgram(null)
              }
            >
              <X size={18} />
            </button>


            <div className="eyebrow">
              COMMUNITY PROGRAM · {selectedProgram.id}
            </div>


            <span
              className={`status-badge ${selectedProgram.status.toLowerCase()}`}
            >
              {selectedProgram.status}
            </span>


            <h2>
              {selectedProgram.title}
            </h2>


            <p className="modal-abstract">
              {selectedProgram.description}
            </p>


            <div className="detail-grid">

              <div>
                <span>Departemen</span>
                <strong>
                  {selectedProgram.department}
                </strong>
              </div>

              <div>
                <span>Wilayah</span>
                <strong>
                  {selectedProgram.location}
                </strong>
              </div>

              <div>
                <span>Mitra</span>
                <strong>
                  {selectedProgram.partner}
                </strong>
              </div>

              <div>
                <span>Periode</span>
                <strong>
                  {selectedProgram.year}
                </strong>
              </div>

            </div>


            <div className="community-modal-metrics">

              <div>
                <span>Impact Score</span>
                <strong>
                  {selectedProgram.impact}
                </strong>
              </div>

              <div>
                <span>Sustainability Score</span>
                <strong>
                  {selectedProgram.sustainability}
                </strong>
              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}