function Operations() {
  const conflicts = [
    {
      level: "HIGH",
      title: "Track T-102 overlaps Train 127XX",
      description: "Maintenance block overlaps with scheduled train movement",
      impact: "Expected delay: 18 min",
      asset: "T-102",
      train: "127XX",
      action: "Resolve with AI",
    },
    {
      level: "MEDIUM",
      title: "Maintenance team unavailable",
      description: "Assigned maintenance team is unavailable during the block",
      impact: "Move block or reassign team",
      asset: "Team 4",
      train: "—",
      action: "Resolve with AI",
    },
    {
      level: "RESOLVED",
      title: "Track availability conflict",
      description: "Alternative maintenance slot selected successfully",
      impact: "No train impact",
      asset: "T-104",
      train: "128XX",
      action: "View",
    },
  ];

  return (
    <div className="page conflicts-page">

      {/* HEADER */}

      <div className="page-header conflicts-header">

        <div>
          <h1 className="page-title">
            Conflicts
          </h1>

          <p className="page-subtitle">
            Detect and resolve operational clashes before approval
          </p>
        </div>

        <div className="conflict-status">
          <span></span>
          2 ACTIONS REQUIRED
        </div>

      </div>


      {/* SUMMARY */}

      <div className="conflict-summary">

        <div className="conflict-summary-card">
          <div className="conflict-summary-icon red">!</div>

          <div>
            <span>CRITICAL</span>
            <strong>01</strong>
            <small>Requires immediate action</small>
          </div>
        </div>


        <div className="conflict-summary-card">
          <div className="conflict-summary-icon orange">!</div>

          <div>
            <span>MEDIUM</span>
            <strong>01</strong>
            <small>Planner review required</small>
          </div>
        </div>


        <div className="conflict-summary-card">
          <div className="conflict-summary-icon green">✓</div>

          <div>
            <span>RESOLVED</span>
            <strong>01</strong>
            <small>Successfully optimized</small>
          </div>
        </div>


        <div className="conflict-summary-card">
          <div className="conflict-summary-icon blue">◈</div>

          <div>
            <span>TRAINS AT RISK</span>
            <strong>02</strong>
            <small>Potential delay impact</small>
          </div>
        </div>

      </div>


      {/* CONFLICT TABLE */}

      <section className="conflicts-panel">

        <div className="conflicts-panel-header">

          <div>
            <h2>
              Operational Conflicts
            </h2>

            <p>
              Review detected clashes and available resolutions
            </p>
          </div>

          <div className="conflict-filter">
            <button className="active">All</button>
            <button>High</button>
            <button>Medium</button>
            <button>Resolved</button>
          </div>

        </div>


        <div className="conflicts-table-wrapper">

          <table className="conflicts-table">

            <thead>
              <tr>
                <th>LEVEL</th>
                <th>CONFLICT</th>
                <th>IMPACT</th>
                <th>ASSET</th>
                <th>TRAIN</th>
                <th>ACTION</th>
              </tr>
            </thead>


            <tbody>

              {conflicts.map((conflict, index) => (

                <tr key={index}>

                  <td>
                    <span
                      className={`conflict-level ${
                        conflict.level.toLowerCase()
                      }`}
                    >
                      <i></i>
                      {conflict.level}
                    </span>
                  </td>


                  <td>

                    <div className="conflict-title">

                      <strong>
                        {conflict.title}
                      </strong>

                      <span>
                        {conflict.description}
                      </span>

                    </div>

                  </td>


                  <td>
                    <span className="conflict-impact">
                      {conflict.impact}
                    </span>
                  </td>


                  <td>
                    <span className="conflict-asset">
                      {conflict.asset}
                    </span>
                  </td>


                  <td>
                    <span className="conflict-train">
                      {conflict.train}
                    </span>
                  </td>


                  <td>

                    <button
                      className={
                        conflict.level === "RESOLVED"
                          ? "conflict-view-btn"
                          : "conflict-ai-btn"
                      }
                    >
                      {conflict.action}
                      {conflict.level !== "RESOLVED" && " →"}
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>


      {/* AI RESOLUTION */}

      <section className="conflict-ai-panel">

        <div className="conflict-ai-icon">
          ✦
        </div>

        <div className="conflict-ai-content">

          <span>
            AI CONFLICT RESOLUTION
          </span>

          <h2>
            Let AI find the safest alternative
          </h2>

          <p>
            RailOpt AI evaluates train movements, asset availability,
            maintenance windows and network constraints to suggest
            conflict-free alternatives.
          </p>

        </div>

        <button className="btn btn-primary">
          Resolve All with AI →
        </button>

      </section>

    </div>
  );
}

export default Operations;