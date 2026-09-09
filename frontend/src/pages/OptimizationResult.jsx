function OptimizationResult() {
  return (
    <div className="page optimizer-page">

      {/* PAGE HEADER */}
      <div className="page-header optimizer-header">
        <div>
          <h1 className="page-title">
            AI Optimizer
          </h1>

          <p className="page-subtitle">
            Generate an optimal block plan from operational
            constraints
          </p>
        </div>

        <div className="optimizer-status">
          <span></span>
          AI Engine Ready
        </div>
      </div>

      {/* PLANNING INPUTS */}
      <div className="optimizer-grid">

        <div className="card planning-input-card">

          <div className="card-header">
            <h2 className="card-title">
              Planning Inputs
            </h2>

            <p className="card-subtitle">
              Define the maintenance block requirements
            </p>
          </div>

          <div className="card-body">

            <div className="form-grid">

              {/* PLANNING DATE */}
              <div className="form-group">
                <label>
                  Planning Date
                </label>

                <input
                  type="date"
                  defaultValue="2026-09-09"
                />
              </div>

              {/* STATION */}
              <div className="form-group">
                <label>
                  Station Name
                </label>

                <input
                  type="text"
                  placeholder="Enter station name"
                  defaultValue="Vijayawada"
                />
              </div>

              {/* CATEGORY */}
              <div className="form-group">
                <label>
                  Category of Block
                </label>

                <select defaultValue="Maintenance">
                  <option value="Maintenance">
                    Maintenance
                  </option>

                  <option value="Signal">
                    Signal
                  </option>

                  <option value="OHE">
                    OHE
                  </option>
                </select>
              </div>

              {/* TIME REQUIRED */}
              <div className="form-group">
                <label>
                  Time Required
                </label>

                <select defaultValue="3 hours">
                  <option>1 hour</option>
                  <option>2 hours</option>
                  <option>3 hours</option>
                  <option>4 hours</option>
                  <option>5 hours</option>
                </select>
              </div>

              {/* AVAILABLE FROM */}
              <div className="form-group">
                <label>
                  Available Time From
                </label>

                <input
                  type="time"
                  defaultValue="09:00"
                />
              </div>

              {/* AVAILABLE TO */}
              <div className="form-group">
                <label>
                  Available Time To
                </label>

                <input
                  type="time"
                  defaultValue="16:00"
                />
              </div>

            </div>

            {/* ADDITIONAL CONSTRAINTS */}
            <div className="optimizer-divider"></div>

            <div className="constraint-heading">
              <div>
                <h3>
                  Optimization Goals
                </h3>

                <p>
                  Select what the AI should prioritize
                </p>
              </div>
            </div>

            <div className="goal-list">

              <label className="goal-item">
                <input
                  type="checkbox"
                  defaultChecked
                />

                <span>
                  <strong>
                    Maximize asset availability
                  </strong>

                  <small>
                    Keep railway assets available for
                    operations
                  </small>
                </span>
              </label>

              <label className="goal-item">
                <input
                  type="checkbox"
                  defaultChecked
                />

                <span>
                  <strong>
                    Minimize train delay
                  </strong>

                  <small>
                    Reduce impact on scheduled train
                    movements
                  </small>
                </span>
              </label>

              <label className="goal-item">
                <input
                  type="checkbox"
                  defaultChecked
                />

                <span>
                  <strong>
                    Minimize conflicts
                  </strong>

                  <small>
                    Avoid overlapping blocks and
                    maintenance activities
                  </small>
                </span>
              </label>

            </div>

            <button
              className="btn btn-primary optimizer-generate"
              type="button"
            >
              ✦ Generate Optimal Plan
            </button>

          </div>
        </div>

        {/* AI RECOMMENDATION */}
        <div className="card recommendation-card">

          <div className="card-header recommendation-header">

            <div>
              <h2 className="card-title">
                AI Recommendation
              </h2>

              <p className="card-subtitle">
                Best plan based on current constraints
              </p>
            </div>

            <span className="recommended-badge">
              RECOMMENDED
            </span>

          </div>

          <div className="card-body">

            <div className="plan-title-row">

              <div>
                <span className="plan-label">
                  PLAN A
                </span>

                <h2>
                  Optimal Maintenance Window
                </h2>
              </div>

              <div className="plan-score">
                <strong>
                  94.7
                </strong>

                <small>
                  SCORE
                </small>
              </div>

            </div>

            {/* METRICS */}
            <div className="recommendation-metrics">

              <div>
                <span>
                  Expected Delay
                </span>

                <strong>
                  4.2 min
                </strong>
              </div>

              <div>
                <span>
                  Conflicts
                </span>

                <strong className="metric-success">
                  0
                </strong>
              </div>

              <div>
                <span>
                  Asset Impact
                </span>

                <strong>
                  Low
                </strong>
              </div>

            </div>

            {/* BLOCK DETAILS */}
            <div className="recommended-block">

              <div className="block-icon">
                ⚙
              </div>

              <div className="block-details">

                <span>
                  RECOMMENDED BLOCK
                </span>

                <strong>
                  T-102
                </strong>

                <p>
                  10:00 – 13:00 • Low traffic window
                </p>

              </div>

            </div>

            {/* VALIDATION */}
            <div className="validation-list">

              <div>
                <span className="validation-icon success">
                  ✓
                </span>

                <span>
                  Maintenance team available
                </span>
              </div>

              <div>
                <span className="validation-icon success">
                  ✓
                </span>

                <span>
                  No train overlap
                </span>
              </div>

              <div>
                <span className="validation-icon success">
                  ✓
                </span>

                <span>
                  Minimum operational impact
                </span>
              </div>

            </div>

            {/* ACTIONS */}
            <div className="recommendation-actions">

              <button
                className="btn btn-primary"
                type="button"
              >
                Generate Plan
              </button>

              <button
                className="btn btn-secondary"
                type="button"
              >
                Compare Plans
              </button>

            </div>

            <button
              className="approve-button"
              type="button"
            >
              ✓ Approve Recommended Plan
            </button>

          </div>
        </div>

      </div>

      {/* OPTIMIZATION PROCESS */}
      <div className="optimizer-process">

        <div className="process-title">
          <h2>
            AI Planning Process
          </h2>

          <p>
            How RailOpt AI generates the recommendation
          </p>
        </div>

        <div className="process-steps">

          <div className="process-step active">
            <span>01</span>

            <div>
              <strong>
                INPUT DATA
              </strong>

              <small>
                Trains • Assets • Maintenance
              </small>
            </div>
          </div>

          <div className="process-line"></div>

          <div className="process-step active">
            <span>02</span>

            <div>
              <strong>
                AI OPTIMIZE
              </strong>

              <small>
                OR-Tools • Graph • Prediction
              </small>
            </div>
          </div>

          <div className="process-line"></div>

          <div className="process-step">
            <span>03</span>

            <div>
              <strong>
                COMPARE
              </strong>

              <small>
                Plan A • Plan B • Plan C
              </small>
            </div>
          </div>

          <div className="process-line"></div>

          <div className="process-step">
            <span>04</span>

            <div>
              <strong>
                APPROVE
              </strong>

              <small>
                Planner validates the plan
              </small>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default OptimizationResult;