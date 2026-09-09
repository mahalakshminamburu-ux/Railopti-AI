function Analytics() {
  const metrics = [
    {
      label: "Asset Availability",
      value: "+12%",
      description: "Compared with manual planning",
      type: "positive",
    },
    {
      label: "Average Delay",
      value: "-28%",
      description: "Reduction in train delays",
      type: "positive",
    },
    {
      label: "Conflicts",
      value: "-41%",
      description: "Fewer operational conflicts",
      type: "positive",
    },
    {
      label: "Blocks Optimized",
      value: "36",
      description: "This month",
      type: "normal",
    },
  ];

  const trend = [
    { week: "W1", value: 78 },
    { week: "W2", value: 81 },
    { week: "W3", value: 84 },
    { week: "W4", value: 87 },
    { week: "W5", value: 89 },
    { week: "W6", value: 91 },
  ];

  return (
    <div className="page analytics-page">

      {/* HEADER */}
      <div className="page-header analytics-header">
        <div>
          <h1 className="page-title">
            Analytics
          </h1>

          <p className="page-subtitle">
            Measure whether AI planning actually improves
            operations
          </p>
        </div>

        <select
          className="analytics-period"
          defaultValue="Last 6 Weeks"
        >
          <option>Last 6 Weeks</option>
          <option>This Month</option>
          <option>Last 3 Months</option>
        </select>
      </div>

      {/* KPI CARDS */}
      <div className="analytics-kpis">

        {metrics.map((metric) => (
          <div
            className="analytics-kpi"
            key={metric.label}
          >
            <span>
              {metric.label}
            </span>

            <strong
              className={
                metric.type === "positive"
                  ? "analytics-positive"
                  : ""
              }
            >
              {metric.value}
            </strong>

            <small>
              {metric.description}
            </small>
          </div>
        ))}

      </div>

      {/* MAIN ANALYTICS */}
      <div className="analytics-grid">

        {/* TREND */}
        <div className="card analytics-chart-card">

          <div className="card-header">
            <h2 className="card-title">
              Asset Availability Trend
            </h2>

            <p className="card-subtitle">
              Weekly asset availability after optimized
              planning
            </p>
          </div>

          <div className="analytics-chart">

            <div className="chart-y-axis">
              <span>100%</span>
              <span>90%</span>
              <span>80%</span>
              <span>70%</span>
            </div>

            <div className="chart-area">

              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>

              <div className="chart-bars">

                {trend.map((item) => (
                  <div
                    className="chart-column"
                    key={item.week}
                  >
                    <div
                      className="chart-bar"
                      style={{
                        height: `${item.value - 65}%`,
                      }}
                    >
                      <span>
                        {item.value}%
                      </span>
                    </div>

                    <small>
                      {item.week}
                    </small>
                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

        {/* PLANNER SUMMARY */}
        <div className="card planner-summary-card">

          <div className="card-header">
            <h2 className="card-title">
              Planner Summary
            </h2>

            <p className="card-subtitle">
              Current operational performance
            </p>
          </div>

          <div className="planner-summary-list">

            <div className="planner-summary-item">
              <div className="summary-icon blue">
                ▣
              </div>

              <div>
                <strong>12</strong>
                <span>Blocks completed</span>
              </div>
            </div>

            <div className="planner-summary-item">
              <div className="summary-icon green">
                ✓
              </div>

              <div>
                <strong>0</strong>
                <span>Critical conflicts</span>
              </div>
            </div>

            <div className="planner-summary-item">
              <div className="summary-icon green">
                ↗
              </div>

              <div>
                <strong>91%</strong>
                <span>Asset availability</span>
              </div>
            </div>

            <div className="planner-summary-item">
              <div className="summary-icon blue">
                ↓
              </div>

              <div>
                <strong>28%</strong>
                <span>Delay reduction</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* AI IMPACT */}
      <div className="ai-impact">

        <div className="ai-impact-icon">
          ✦
        </div>

        <div className="ai-impact-content">
          <h2>
            AI Planning Impact
          </h2>

          <p>
            AI-optimized schedules are improving asset
            availability while reducing train delays and
            operational conflicts.
          </p>
        </div>

        <div className="ai-impact-score">
          <span>Overall Improvement</span>
          <strong>+24%</strong>
        </div>

      </div>

    </div>
  );
}

export default Analytics;