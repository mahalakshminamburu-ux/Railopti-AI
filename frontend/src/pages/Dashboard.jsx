function Dashboard() {
  const alerts = [
    {
      type: "warning",
      title: "Track T-102 maintenance due",
      info: "Maintenance window approaching in 2 hours",
      time: "2h",
    },
    {
      type: "danger",
      title: "Block B-204 conflict",
      info: "Overlaps with Train 127XX",
      time: "Now",
    },
    {
      type: "warning",
      title: "Train 127XX delayed",
      info: "Expected delay: 18 minutes",
      time: "18m",
    },
    {
      type: "success",
      title: "Team availability changed",
      info: "Maintenance Team 4 is now available",
      time: "5m",
    },
  ];

  const operations = [
    {
      track: "Track 1",
      cells: ["TRAIN 127XX", "", "BLOCK B-201", "", "", ""],
      type: ["train", "", "block", "", "", ""],
    },
    {
      track: "Track 2",
      cells: ["", "TRAIN 172XX", "", "BLOCK B-204", "", ""],
      type: ["", "train", "", "block", "", ""],
    },
    {
      track: "Track 3",
      cells: ["", "", "BLOCK B-205", "CONFLICT", "", ""],
      type: ["", "", "block", "conflict", "", ""],
    },
    {
      track: "Track 4",
      cells: ["", "", "", "TRAIN 128XX", "", "BLOCK B-207"],
      type: ["", "", "", "train", "", "block"],
    },
  ];

  const times = [
    "06:00",
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
  ];

  return (
    <div className="page dashboard-page">

      {/* ================= HEADER ================= */}

      <div className="page-header dashboard-header">

        <div>
          <h1 className="page-title">
            Dashboard
          </h1>

          <p className="page-subtitle">
            Real-time railway operations overview
          </p>
        </div>

        <div className="dashboard-live">
          <span></span>
          LIVE NETWORK
        </div>

      </div>


      {/* ================= KPI CARDS ================= */}

      <div className="dashboard-kpis">

        <div className="dashboard-kpi">

          <div className="kpi-icon blue">
            ▣
          </div>

          <div>
            <span>ACTIVE BLOCKS</span>
            <strong>18</strong>
          </div>

          <small>
            +3 today
          </small>

        </div>


        <div className="dashboard-kpi">

          <div className="kpi-icon green">
            ◈
          </div>

          <div>
            <span>ASSET AVAILABILITY</span>
            <strong>91%</strong>
          </div>

          <small>
            +2.4%
          </small>

        </div>


        <div className="dashboard-kpi">

          <div className="kpi-icon red">
            !
          </div>

          <div>
            <span>CONFLICTS</span>
            <strong>04</strong>
          </div>

          <small>
            2 critical
          </small>

        </div>


        <div className="dashboard-kpi">

          <div className="kpi-icon purple">
            →
          </div>

          <div>
            <span>TRAINS IMPACTED</span>
            <strong>07</strong>
          </div>

          <small>
            Today
          </small>

        </div>

      </div>


      {/* ================= RAILWAY OPERATIONS ================= */}

      <section className="operations-panel">

        <div className="panel-heading operations-heading">

          <div>

            <h4>
              Railway Operations Timeline
            </h4>

            
          </div>


          <div className="timeline-legend">

            <span>
              <i className="legend-train"></i>
              TRAIN
            </span>

            <span>
              <i className="legend-block"></i>
              BLOCK
            </span>

            <span>
              <i className="legend-conflict"></i>
              CONFLICT
            </span>

          </div>

        </div>


        <div className="operations-table-wrapper">

          <table className="operations-table">

            <thead>

              <tr>

                <th>
                  TRACK
                </th>

                {times.map((time) => (
                  <th key={time}>
                    {time}
                  </th>
                ))}

              </tr>

            </thead>


            <tbody>

              {operations.map((row) => (

                <tr key={row.track}>

                  <td className="track-cell">
                    {row.track}
                  </td>


                  {row.cells.map((cell, index) => (

                    <td key={index}>

                      {cell && (

                        <div
                          className={`timeline-item ${row.type[index]}`}
                        >

                          {row.type[index] === "train" && (
                            <span>◆</span>
                          )}

                          {row.type[index] === "block" && (
                            <span>■</span>
                          )}

                          {row.type[index] === "conflict" && (
                            <span>!</span>
                          )}

                          {cell}

                        </div>

                      )}

                    </td>

                  ))}

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        <div className="operations-footer">

          <span>
            ● Network status: Operational
          </span>

          <button>
            View detailed timeline →
          </button>

        </div>

      </section>


      {/* ================= ALERTS ================= */}

      <section className="alerts-panel dashboard-alerts">

        <div className="panel-heading">

          <div>

            <h2>
              Alerts
            </h2>

            <p>
              Items requiring planner attention
            </p>

          </div>


          <div className="alert-count">
            04
          </div>

        </div>


        <div className="alert-list">

          {alerts.map((alert, index) => (

            <div
              className="alert-row"
              key={index}
            >

              <div
                className={`alert-symbol ${alert.type}`}
              >
                {alert.type === "danger" ? "!" : "●"}
              </div>


              <div className="alert-content">

                <strong>
                  {alert.title}
                </strong>

                <span>
                  {alert.info}
                </span>

              </div>


              <div className="alert-time">
                {alert.time}
              </div>


              <div className="alert-arrow">
                ›
              </div>

            </div>

          ))}

        </div>

      </section>


      {/* ================= AI PLANNING WORKSPACE ================= */}

      <section className="planning-workspace">

        <div className="workspace-visual">

          <div className="workspace-icon">
            ✦
          </div>

          <div className="workspace-lines">
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>


        <div className="workspace-content">

          <span>
            AI PLANNING WORKSPACE
          </span>

          <h2>
            Optimize your next maintenance window
          </h2>

          <p>
            Review blocks, detect conflicts and generate an
            optimized railway maintenance plan.
          </p>

        </div>


        <button className="btn btn-primary">
          Open Workspace →
        </button>

      </section>

    </div>
  );
}

export default Dashboard;