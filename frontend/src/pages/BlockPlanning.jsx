import React, { useState } from "react";

export default function BlockPlanning({ onScheduleClick }) {
  const [filter, setFilter] = useState("All");

  const assets = [
    {
      asset: "T-102",
      type: "Track",
      status: "Available",
      utilization: 82,
      maintenance: "12 Sep",
    },
    {
      asset: "T-103",
      type: "Track",
      status: "Blocked",
      utilization: 96,
      maintenance: "10 Sep",
    },
    {
      asset: "P-204",
      type: "Platform",
      status: "Available",
      utilization: 68,
      maintenance: "20 Sep",
    },
    {
      asset: "S-301",
      type: "Signal",
      status: "Warning",
      utilization: 74,
      maintenance: "10 Sep",
    },
    {
      asset: "T-104",
      type: "Track",
      status: "Available",
      utilization: 79,
      maintenance: "18 Sep",
    },
    {
      asset: "S-302",
      type: "Signal",
      status: "Available",
      utilization: 61,
      maintenance: "20 Sep",
    },
  ];

  // Dynamic filtering logic
  const filteredAssets = assets.filter((item) => {
    if (filter === "Tracks") return item.type === "Track";
    if (filter === "Signals") return item.type === "Signal";
    if (filter === "Platforms") return item.type === "Platform";
    return true; // "All"
  });

  return (
    <div className="page assets-page">
      {/* HEADER */}
      <div className="page-header assets-header">
        <div>
          <h1 className="page-title">Assets & Blocks</h1>
          <p className="page-subtitle">
            Monitor tracks, signals, platforms, and maintenance resources
          </p>
        </div>

        <button className="btn btn-primary" onClick={onScheduleClick}>
          + Schedule Maintenance
        </button>
      </div>

      {/* SUMMARY STATS */}
      <div className="asset-summary-grid">
        <div className="asset-summary-card">
          <div className="asset-summary-icon blue">▣</div>
          <div className="asset-summary-info">
            <span>ACTIVE BLOCKS</span>
            <strong>18</strong>
            <small>Currently scheduled</small>
          </div>
        </div>

        <div className="asset-summary-card">
          <div className="asset-summary-icon green">✓</div>
          <div className="asset-summary-info">
            <span>AVAILABLE ASSETS</span>
            <strong>24</strong>
            <small>Ready for planning</small>
          </div>
        </div>

        <div className="asset-summary-card">
          <div className="asset-summary-icon red">!</div>
          <div className="asset-summary-info">
            <span>BLOCKED ASSETS</span>
            <strong>03</strong>
            <small>Require attention</small>
          </div>
        </div>

        <div className="asset-summary-card">
          <div className="asset-summary-icon purple">◷</div>
          <div className="asset-summary-info">
            <span>MAINTENANCE DUE</span>
            <strong>07</strong>
            <small>Upcoming windows</small>
          </div>
        </div>
      </div>

      {/* ASSETS TABLE */}
      <section className="assets-table-panel">
        <div className="assets-panel-header">
          <div>
            <h2>Railway Assets</h2>
            <p>Current status and upcoming maintenance schedule</p>
          </div>

          <div className="asset-filter">
            {["All", "Tracks", "Signals", "Platforms"].map((category) => (
              <button
                key={category}
                className={filter === category ? "filter-active" : ""}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="assets-table-wrapper">
          <table className="assets-table">
            <thead>
              <tr>
                <th>ASSET</th>
                <th>TYPE</th>
                <th>STATUS</th>
                <th>UTILIZATION</th>
                <th>NEXT MAINTENANCE</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredAssets.map((item) => (
                <tr key={item.asset}>
                  <td>
                    <div className="asset-name">
                      <div className="asset-mini-icon">
                        {item.type === "Track" && "═"}
                        {item.type === "Signal" && "●"}
                        {item.type === "Platform" && "▰"}
                      </div>
                      <strong>{item.asset}</strong>
                    </div>
                  </td>

                  <td>
                    <span className="asset-type">{item.type}</span>
                  </td>

                  <td>
                    <span
                      className={`asset-status ${
                        item.status === "Available"
                          ? "available"
                          : item.status === "Blocked"
                          ? "blocked"
                          : "warning"
                      }`}
                    >
                      <i></i>
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <div className="utilization-cell">
                      <div className="utilization-bar">
                        <span style={{ width: `${item.utilization}%` }}></span>
                      </div>
                      <strong>{item.utilization}%</strong>
                    </div>
                  </td>

                  <td>
                    <span className="maintenance-date">{item.maintenance}</span>
                  </td>

                  <td>
                    <button className="asset-view-btn">View →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="assets-table-footer">
          <span>Showing {filteredAssets.length} of 45 assets</span>
          <div className="pagination">
            <button>‹</button>
            <button className="page-active">1</button>
            <button>2</button>
            <button>3</button>
            <button>›</button>
          </div>
        </div>
      </section>

      {/* MAINTENANCE OVERVIEW */}
      <section className="maintenance-overview">
        <div className="maintenance-overview-header">
          <div>
            <span className="section-label">MAINTENANCE OVERVIEW</span>
            <h2>Upcoming maintenance windows</h2>
          </div>
          <span className="maintenance-count">07 due</span>
        </div>

        <div className="maintenance-cards">
          <div className="maintenance-card">
            <div className="maintenance-date-box">
              <strong>10</strong>
              <span>SEP</span>
            </div>
            <div className="maintenance-info">
              <strong>S-301 Signal Inspection</strong>
              <span>Signal · 09:00 – 11:00</span>
            </div>
            <span className="maintenance-high">HIGH</span>
          </div>

          <div className="maintenance-card">
            <div className="maintenance-date-box">
              <strong>12</strong>
              <span>SEP</span>
            </div>
            <div className="maintenance-info">
              <strong>T-102 Track Maintenance</strong>
              <span>Track · 10:00 – 13:00</span>
            </div>
            <span className="maintenance-medium">MEDIUM</span>
          </div>

          <div className="maintenance-card">
            <div className="maintenance-date-box">
              <strong>18</strong>
              <span>SEP</span>
            </div>
            <div className="maintenance-info">
              <strong>T-104 Track Inspection</strong>
              <span>Track · 14:00 – 16:00</span>
            </div>
            <span className="maintenance-low">LOW</span>
          </div>
        </div>
      </section>
    </div>
  );
}