import React, { useState, useEffect } from "react";
import { api } from "./api";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // --- Auth Form State ---
  const [loginForm, setLoginForm] = useState({
    username: "naresh",
    password: "password123",
  });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // --- Profile State ---
  const [user, setUser] = useState({
    username: "naresh",
    full_name: "Borra Naresh",
    role: "Railway Operations Planner",
    department: "Operations",
    email: "planner@railopt.ai",
  });

  // --- Dashboard Clean State (Starts at ZERO) ---
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      active_blocks: 0,
      delayed_trains: 0,
      delay_reduction_pct: 0,
      network_utilization_pct: 0,
      avg_delay_saved_min: 0,
      total_corridors_monitored: 5,
    },
    corridor_status: [
      { section: "S1-S2", status: "STANDBY", headway: "—", speed_limit: "110 km/h" },
      { section: "S2-S3", status: "STANDBY", headway: "—", speed_limit: "130 km/h" },
      { section: "S2-S5", status: "STANDBY", headway: "—", speed_limit: "90 km/h" },
      { section: "S4-S5", status: "STANDBY", headway: "—", speed_limit: "120 km/h" },
      { section: "S4-S1", status: "STANDBY", headway: "—", speed_limit: "130 km/h" },
    ],
    recent_activity: [],
  });

  // --- Schedules (Starts Empty) ---
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [monthlySchedule, setMonthlySchedule] = useState([]);

  // --- Conflicts ---
  const [networkData, setNetworkData] = useState({ nodes: [], edges: [] });
  const [trainsList, setTrainsList] = useState([]);

  // --- Optimizer Form ---
  const [blockForm, setBlockForm] = useState({
    block_id: "B001",
    section: "S1-S2",
    department: "Engineering",
    maintenance_type: "Track Repair",
    date: "2026-09-12",
    preferred_time: "10:00",
    duration_hours: 2,
    priority: 3,
  });

  const [optimizerLoading, setOptimizerLoading] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [approvalSuccess, setApprovalSuccess] = useState(false);

  // Sync helpers
  const fetchDashboardData = async () => {
    try {
      const data = await api.getDashboardStats();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  const fetchWeeklySchedule = async () => {
    try {
      const plan = await api.getWeeklyPlan();
      setWeeklySchedule(plan);
    } catch (err) {
      console.error("Weekly schedule error:", err);
    }
  };

  const fetchMonthlySchedule = async () => {
    try {
      const plan = await api.getMonthlyPlan();
      setMonthlySchedule(plan);
    } catch (err) {
      console.error("Monthly schedule error:", err);
    }
  };

  const fetchConflictData = async () => {
    try {
      const [net, trs] = await Promise.all([
        api.getNetworkTopology().catch(() => ({ nodes: [], edges: [] })),
        api.getTrains().catch(() => []),
      ]);
      setNetworkData(net);
      setTrainsList(trs);
    } catch (err) {
      console.error("Conflict data error:", err);
    }
  };

  // Sync active view on tab change
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === "Dashboard") fetchDashboardData();
      if (activeTab === "Weekly Plan") fetchWeeklySchedule();
      if (activeTab === "Monthly Plan") fetchMonthlySchedule();
      if (activeTab === "Conflicts") fetchConflictData();
    }
  }, [activeTab, isAuthenticated]);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const response = await api.login(loginForm.username, loginForm.password);
      localStorage.setItem("token", response.access_token);
      if (response.user) {
        setUser({ ...response.user, email: "planner@railopt.ai" });
      }
      setIsAuthenticated(true);
      fetchDashboardData();
      fetchWeeklySchedule();
      fetchMonthlySchedule();
      fetchConflictData();
    } catch (err) {
      setLoginError(err.message || "Invalid username or password");
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setOptimizationResult(null);
    setApprovalSuccess(false);
  };

  const handleRunOptimizer = async (e) => {
    if (e) e.preventDefault();
    setOptimizerLoading(true);
    setApprovalSuccess(false);

    try {
      const result = await api.optimizeBlock({
        ...blockForm,
        duration_hours: parseFloat(blockForm.duration_hours),
        priority: parseInt(blockForm.priority, 10),
      });
      setOptimizationResult(result);
    } catch (err) {
      alert("Optimization failed: " + err.message);
    } finally {
      setOptimizerLoading(false);
    }
  };

  const handleApproveBlock = async () => {
    if (!optimizationResult) return;
    try {
      await api.approveBlock({
        block_id: optimizationResult.block_id,
        selected_plan_id: optimizationResult.best_plan.plan_id,
        status: "APPROVED",
        section: optimizationResult.section,
        department: blockForm.department,
        time_window: `${optimizationResult.best_plan.recommended_start} - ${optimizationResult.best_plan.recommended_end}`,
        day: "SAT",
        date: blockForm.date,
      });

      setApprovalSuccess(true);
      await fetchWeeklySchedule();
      await fetchMonthlySchedule();
      await fetchDashboardData();
      await fetchConflictData();
      alert("Plan approved! Metrics, weekly plan, and monthly plan are now updated.");
    } catch (err) {
      alert("Failed to approve block: " + err.message);
    }
  };

  // ==========================================
  // VIEW 1: AUTHENTICATION SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", marginBottom: "20px" }}>
            <div style={styles.logoIcon}>R</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: "bold", fontSize: "18px", color: "#fff" }}>RAILOPT AI</div>
              <div style={{ fontSize: "12px", color: "#7a889b" }}>Railway Operations Login</div>
            </div>
          </div>

          <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "20px" }}>
            Sign in with your Railway Planner credentials to access real-time conflict analysis and track scheduling.
          </p>

          {loginError && <div style={styles.errorBanner}>{loginError}</div>}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "left" }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Username</label>
              <input
                style={styles.input}
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" disabled={loginLoading} style={{ ...styles.primaryBtn, marginTop: "8px" }}>
              {loginLoading ? "Authenticating..." : "SIGN IN TO RAILOPT"}
            </button>
          </form>

          <div style={{ marginTop: "20px", fontSize: "12px", color: "#64748b" }}>
            Default Demo: <span style={{ color: "#38bdf8" }}>naresh</span> / <span style={{ color: "#38bdf8" }}>password123</span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: OPERATIONS PORTAL
  // ==========================================
  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>R</div>
          <div>
            <div style={{ fontWeight: "bold", fontSize: "15px", color: "#fff" }}>RAILOPT AI</div>
            <div style={{ fontSize: "11px", color: "#7a889b" }}>Railway Operations</div>
          </div>
        </div>

        <nav style={styles.navMenu}>
          {["Dashboard", "Weekly Plan", "Monthly Plan", "AI Optimizer", "Conflicts", "Settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.navItem,
                backgroundColor: activeTab === tab ? "#185ee0" : "transparent",
                color: activeTab === tab ? "#ffffff" : "#94a3b8",
                fontWeight: activeTab === tab ? "600" : "normal",
              }}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button onClick={handleLogout} style={styles.sidebarLogoutBtn}>
            Sign Out
          </button>
          <div style={styles.systemStatus}>
            <span style={styles.statusDot}></span> System Online
          </div>
        </div>
      </aside>

      {/* Main Section */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div style={{ fontSize: "14px", color: "#64748b" }}>Railway Operations &bull; {activeTab}</div>
          <div style={styles.userBadge}>
            <div style={styles.avatar}>BN</div>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#e2e8f0" }}>{user.full_name || "Borra Naresh"}</span>
          </div>
        </header>

        {/* TAB 1: DASHBOARD */}
        {activeTab === "Dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "24px" }}>
            <div style={styles.gridCards}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Active Maintenance Blocks</div>
                <div style={styles.statVal}>{dashboardData.metrics?.active_blocks ?? 0}</div>
                <div style={{ fontSize: "12px", color: dashboardData.metrics?.active_blocks > 0 ? "#10b981" : "#64748b", marginTop: "4px" }}>
                  {dashboardData.metrics?.active_blocks > 0 ? "↑ Active Corridor Possession" : "No active blocks"}
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Delayed Passenger Trains</div>
                <div style={{ ...styles.statVal, color: dashboardData.metrics?.delayed_trains > 0 ? "#f87171" : "#38bdf8" }}>
                  {dashboardData.metrics?.delayed_trains ?? 0}
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                  {dashboardData.metrics?.delayed_trains > 0 ? "Impacted by track possession" : "All routes clear"}
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>AI Delay Reduction</div>
                <div style={{ ...styles.statVal, color: "#10b981" }}>{dashboardData.metrics?.delay_reduction_pct ?? 0}%</div>
                <div style={{ fontSize: "12px", color: "#38bdf8", marginTop: "4px" }}>
                  {dashboardData.metrics?.delay_reduction_pct > 0 ? "~24 mins saved per block" : "Awaiting optimization plan"}
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Network Capacity Utilization</div>
                <div style={styles.statVal}>{dashboardData.metrics?.network_utilization_pct ?? 0}%</div>
                <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                  {dashboardData.metrics?.network_utilization_pct > 0 ? "Operational threshold" : "Idle standby"}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px" }}>
              <div style={styles.contentCardDashboard}>
                <h3 style={{ ...styles.title, fontSize: "16px", marginBottom: "12px" }}>Track Corridor Status</h3>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={styles.th}>Corridor Section</th>
                      <th style={styles.th}>Operating Status</th>
                      <th style={styles.th}>Headway</th>
                      <th style={styles.th}>Speed Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboardData.corridor_status || []).map((row, idx) => (
                      <tr key={idx} style={styles.tr}>
                        <td style={{ ...styles.td, fontWeight: "bold", color: "#fff" }}>{row.section}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              padding: "3px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: "bold",
                              backgroundColor:
                                row.status === "MAINTENANCE" ? "rgba(239, 68, 68, 0.2)" :
                                row.status === "CONGESTED" ? "rgba(245, 158, 11, 0.2)" :
                                row.status === "NORMAL" ? "rgba(16, 185, 129, 0.2)" : "rgba(148, 163, 184, 0.15)",
                              color:
                                row.status === "MAINTENANCE" ? "#f87171" :
                                row.status === "CONGESTED" ? "#fbbf24" :
                                row.status === "NORMAL" ? "#34d399" : "#94a3b8",
                            }}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td style={styles.td}>{row.headway}</td>
                        <td style={styles.td}>{row.speed_limit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={styles.contentCardDashboard}>
                <h3 style={{ ...styles.title, fontSize: "16px", marginBottom: "12px" }}>Recent Activity Stream</h3>
                {(!dashboardData.recent_activity || dashboardData.recent_activity.length === 0) ? (
                  <div style={{ color: "#64748b", fontSize: "13px", padding: "16px 0", textAlign: "center" }}>
                    No maintenance activity logged yet. Generate & commit an AI plan to schedule blocks.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {dashboardData.recent_activity.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "12px",
                          backgroundColor: "#1e293b",
                          borderRadius: "6px",
                          borderLeft: "3px solid #2563eb",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "13px", color: "#fff" }}>
                            {item.action} &bull; <span style={{ color: "#38bdf8" }}>{item.section}</span>
                          </div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                            Block {item.block_id} ({item.time})
                          </div>
                        </div>
                        <span style={{ fontSize: "11px", backgroundColor: "#0f172a", padding: "4px 8px", borderRadius: "4px", color: "#94a3b8" }}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WEEKLY PLAN */}
        {activeTab === "Weekly Plan" && (
          <div style={styles.contentCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ ...styles.title, margin: 0 }}>Weekly Maintenance Schedule</h2>
              <button onClick={fetchWeeklySchedule} style={styles.secondaryBtn}>Refresh Schedule</button>
            </div>
            {weeklySchedule.length === 0 ? (
              <div style={{ color: "#64748b", fontSize: "14px", padding: "32px 0", textAlign: "center" }}>
                No weekly maintenance blocks scheduled yet. Go to <strong>AI Optimizer</strong> to generate and commit a block.
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Day</th>
                    <th style={styles.th}>Time Window</th>
                    <th style={styles.th}>Block ID</th>
                    <th style={styles.th}>Section</th>
                    <th style={styles.th}>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklySchedule.map((row, idx) => (
                    <tr key={idx} style={styles.tr}>
                      <td style={styles.td}><span style={styles.dayTag}>{row.day}</span></td>
                      <td style={styles.td}>{row.time}</td>
                      <td style={styles.td}>{row.block_id}</td>
                      <td style={styles.td}>{row.section}</td>
                      <td style={styles.td}>{row.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 3: MONTHLY PLAN */}
        {activeTab === "Monthly Plan" && (
          <div style={styles.contentCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h2 style={{ ...styles.title, margin: 0 }}>Monthly Infrastructure Planning</h2>
                <p style={{ ...styles.subtitle, margin: "4px 0 0 0" }}>Long-term major corridor possessions and asset renewal cycles.</p>
              </div>
              <button onClick={fetchMonthlySchedule} style={styles.secondaryBtn}>Refresh Monthly Plan</button>
            </div>
            {monthlySchedule.length === 0 ? (
              <div style={{ color: "#64748b", fontSize: "14px", padding: "32px 0", textAlign: "center" }}>
                No monthly maintenance blocks scheduled yet. Approved blocks will automatically map to this timeline.
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Timeline</th>
                    <th style={styles.th}>Date Range</th>
                    <th style={styles.th}>Block ID</th>
                    <th style={styles.th}>Section</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Activity Description</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlySchedule.map((row, idx) => (
                    <tr key={idx} style={styles.tr}>
                      <td style={styles.td}><span style={styles.dayTag}>{row.week}</span></td>
                      <td style={styles.td}>{row.date}</td>
                      <td style={{ ...styles.td, fontWeight: "bold", color: "#fff" }}>{row.block_id}</td>
                      <td style={styles.td}>{row.section}</td>
                      <td style={styles.td}>{row.department}</td>
                      <td style={styles.td}>{row.activity}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            backgroundColor: "rgba(168, 85, 247, 0.2)",
                            color: "#c084fc",
                          }}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 4: AI OPTIMIZER */}
        {activeTab === "AI Optimizer" && (
          <div style={styles.contentCard}>
            <h2 style={styles.title}>AI Maintenance Window Optimizer</h2>
            <p style={styles.subtitle}>Configure track possession parameters to run NetworkX graph topology and delay reduction checks.</p>

            <form onSubmit={handleRunOptimizer} style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Block ID</label>
                <input
                  style={styles.input}
                  value={blockForm.block_id}
                  onChange={(e) => setBlockForm({ ...blockForm, block_id: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Section</label>
                <select
                  style={styles.input}
                  value={blockForm.section}
                  onChange={(e) => setBlockForm({ ...blockForm, section: e.target.value })}
                >
                  <option value="S1-S2">S1 - S2</option>
                  <option value="S2-S3">S2 - S3</option>
                  <option value="S2-S5">S2 - S5</option>
                  <option value="S4-S5">S4 - S5</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Department</label>
                <select
                  style={styles.input}
                  value={blockForm.department}
                  onChange={(e) => setBlockForm({ ...blockForm, department: e.target.value })}
                >
                  <option value="Engineering">Engineering (Track Repair)</option>
                  <option value="OHE">OHE (Overhead Equipment)</option>
                  <option value="Signalling">Signalling & Telecom</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Preferred Time</label>
                <input
                  type="time"
                  style={styles.input}
                  value={blockForm.preferred_time}
                  onChange={(e) => setBlockForm({ ...blockForm, preferred_time: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Duration (Hours)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={blockForm.duration_hours}
                  onChange={(e) => setBlockForm({ ...blockForm, duration_hours: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Priority</label>
                <select
                  style={styles.input}
                  value={blockForm.priority}
                  onChange={(e) => setBlockForm({ ...blockForm, priority: e.target.value })}
                >
                  <option value="3">High Priority (Level 3)</option>
                  <option value="2">Medium Priority (Level 2)</option>
                  <option value="1">Low Priority (Level 1)</option>
                </select>
              </div>

              <div style={{ gridColumn: "1 / -1", marginTop: "12px" }}>
                <button type="submit" disabled={optimizerLoading} style={styles.primaryBtn}>
                  {optimizerLoading ? "Analyzing Network Capacity..." : "GENERATE OPTIMIZED PLAN"}
                </button>
              </div>
            </form>

            {optimizationResult && (
              <div style={styles.resultBox}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ color: "#38bdf8", margin: 0 }}>
                    Recommended Window: {optimizationResult.best_plan.recommended_start} - {optimizationResult.best_plan.recommended_end}
                  </h3>
                  <span style={styles.badgeScore}>{optimizationResult.best_plan.score}% Reliability Score</span>
                </div>

                <div style={styles.metricRow}>
                  <div><strong>Predicted Network Delay:</strong> {optimizationResult.best_plan.predicted_delay_min} mins</div>
                  <div><strong>Train Route Conflicts:</strong> {optimizationResult.best_plan.conflicts_detected}</div>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <strong>AI Recommendations:</strong>
                  <ul style={{ margin: "6px 0", paddingLeft: "20px", color: "#94a3b8" }}>
                    {optimizationResult.best_plan.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                {approvalSuccess ? (
                  <div style={styles.successBanner}>✓ Plan approved and committed to the weekly & monthly rail schedule!</div>
                ) : (
                  <button onClick={handleApproveBlock} style={styles.approveBtn}>
                    ACCEPT & COMMIT PLAN
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CONFLICTS */}
        {activeTab === "Conflicts" && (
          <div style={styles.contentCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h2 style={{ ...styles.title, margin: 0 }}>Track Occupancy & Section Conflicts</h2>
                <p style={{ ...styles.subtitle, margin: "4px 0 0 0" }}>
                  Real-time network section status and impacted train paths.
                </p>
              </div>
              <button onClick={fetchConflictData} style={styles.secondaryBtn}>Refresh Status</button>
            </div>

            <h3 style={{ color: "#38bdf8", fontSize: "16px", marginTop: "20px", marginBottom: "12px" }}>
              Track Section Integrity
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
              {networkData.edges.map((edge, idx) => {
                const isBlocked = edge.status === "BLOCKED";
                const isCongested = edge.status === "CONGESTED";
                return (
                  <div
                    key={idx}
                    style={{
                      padding: "14px",
                      backgroundColor: "#1e293b",
                      borderRadius: "8px",
                      borderLeft: `4px solid ${isBlocked ? "#ef4444" : isCongested ? "#f59e0b" : "#10b981"}`,
                    }}
                  >
                    <div style={{ fontSize: "15px", fontWeight: "bold", color: "#fff" }}>
                      {edge.source} ⟷ {edge.target}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        marginTop: "4px",
                        color: isBlocked ? "#ef4444" : isCongested ? "#f59e0b" : "#10b981",
                      }}
                    >
                      {edge.status}
                    </div>
                  </div>
                );
              })}
            </div>

            <h3 style={{ color: "#38bdf8", fontSize: "16px", marginTop: "28px", marginBottom: "12px" }}>
              Monitored Trains & Path Interferences
            </h3>
            {trainsList.length === 0 ? (
              <div style={{ color: "#64748b", fontSize: "13px", padding: "16px 0" }}>
                No current trains impacted. Network sections are free from maintenance blocks.
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Train No.</th>
                    <th style={styles.th}>Assigned Route</th>
                    <th style={styles.th}>Priority</th>
                    <th style={styles.th}>Running Status</th>
                    <th style={styles.th}>Delay</th>
                  </tr>
                </thead>
                <tbody>
                  {trainsList.map((trn, idx) => (
                    <tr key={idx} style={styles.tr}>
                      <td style={{ ...styles.td, fontWeight: "bold", color: "#fff" }}>{trn.train_id}</td>
                      <td style={styles.td}>{trn.route}</td>
                      <td style={styles.td}>Level {trn.priority}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            backgroundColor: trn.status === "Delayed" ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)",
                            color: trn.status === "Delayed" ? "#f87171" : "#34d399",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {trn.status}
                        </span>
                      </td>
                      <td style={{ ...styles.td, color: trn.delay_min > 0 ? "#f87171" : "#94a3b8" }}>
                        {trn.delay_min > 0 ? `+${trn.delay_min} mins` : "On Time"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === "Settings" && (
          <div style={styles.contentCard}>
            <h2 style={styles.title}>Settings</h2>
            <p style={styles.subtitle}>Manage your account, security, and operations preferences.</p>

            <div style={styles.profileBox}>
              <div style={styles.profileAvatar}>BN</div>
              <div>
                <h3 style={{ margin: 0, color: "#fff" }}>{user.full_name}</h3>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>{user.role}</p>
                <p style={{ margin: "2px 0 0 0", color: "#64748b", fontSize: "13px" }}>{user.email}</p>
              </div>
            </div>

            <div style={{ marginTop: "32px", borderTop: "1px solid #1f2937", paddingTop: "20px" }}>
              <h4 style={{ color: "#ef4444", margin: "0 0 8px 0" }}>Account Session</h4>
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 16px 0" }}>
                Sign out of RailOpt AI and return to the login screen.
              </p>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { display: "flex", width: "100vw", height: "100vh", backgroundColor: "#0b0f17", color: "#e2e8f0", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  sidebar: { width: "240px", backgroundColor: "#0f172a", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", padding: "16px" },
  logoArea: { display: "flex", alignItems: "center", gap: "12px", paddingBottom: "24px", borderBottom: "1px solid #1e293b" },
  logoIcon: { width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#fff" },
  navMenu: { display: "flex", flexDirection: "column", gap: "6px", marginTop: "16px", flex: 1 },
  navItem: { padding: "10px 14px", border: "none", borderRadius: "6px", textAlign: "left", fontSize: "14px", cursor: "pointer", transition: "0.2s" },
  sidebarLogoutBtn: { padding: "8px 12px", backgroundColor: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: "6px", fontSize: "12px", cursor: "pointer", textAlign: "center" },
  systemStatus: { fontSize: "12px", color: "#10b981", display: "flex", alignItems: "center", gap: "8px" },
  statusDot: { width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" },
  main: { flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", padding: "24px 32px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "20px", borderBottom: "1px solid #1e293b" },
  userBadge: { display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#1e293b", padding: "6px 12px", borderRadius: "20px" },
  avatar: { width: "26px", height: "26px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "bold", color: "#fff" },
  contentCard: { backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "10px", padding: "24px", marginTop: "24px" },
  contentCardDashboard: { backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "10px", padding: "20px" },
  title: { margin: "0 0 8px 0", fontSize: "20px", color: "#f8fafc" },
  subtitle: { margin: "0 0 20px 0", fontSize: "14px", color: "#94a3b8" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", color: "#94a3b8", fontWeight: "500" },
  input: { padding: "10px 12px", backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "6px", color: "#fff", outline: "none", fontSize: "14px" },
  primaryBtn: { width: "100%", padding: "12px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "14px" },
  secondaryBtn: { padding: "8px 14px", backgroundColor: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "6px", fontSize: "13px", cursor: "pointer" },
  resultBox: { marginTop: "24px", padding: "18px", border: "1px solid #0284c7", borderRadius: "8px", backgroundColor: "rgba(2, 132, 199, 0.08)" },
  badgeScore: { backgroundColor: "#0284c7", color: "#fff", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" },
  metricRow: { display: "flex", gap: "24px", marginTop: "12px", fontSize: "14px" },
  approveBtn: { marginTop: "16px", padding: "10px 20px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" },
  successBanner: { marginTop: "14px", color: "#22c55e", fontWeight: "600", fontSize: "14px" },
  logoutBtn: { padding: "10px 18px", backgroundColor: "transparent", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "13px" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "12px" },
  thRow: { borderBottom: "1px solid #374151" },
  th: { textAlign: "left", padding: "12px", fontSize: "13px", color: "#94a3b8" },
  tr: { borderBottom: "1px solid #1f2937" },
  td: { padding: "12px", fontSize: "14px" },
  dayTag: { backgroundColor: "#1e293b", padding: "3px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600" },
  gridCards: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" },
  statCard: { backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", padding: "20px" },
  statLabel: { fontSize: "13px", color: "#94a3b8", marginBottom: "8px" },
  statVal: { fontSize: "28px", fontWeight: "bold", color: "#38bdf8" },
  profileBox: { display: "flex", alignItems: "center", gap: "16px", padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px", width: "fit-content" },
  profileAvatar: { width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold", color: "#fff" },
  loginContainer: { display: "flex", width: "100vw", height: "100vh", backgroundColor: "#0b0f17", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  loginCard: { width: "380px", padding: "32px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", textAlign: "center" },
  errorBanner: { padding: "10px", backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", borderRadius: "6px", color: "#f87171", fontSize: "13px", marginBottom: "14px" },
};
