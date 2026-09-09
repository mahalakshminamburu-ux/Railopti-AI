function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Weekly Plan", icon: "▤" },
    { name: "Monthly Plan", icon: "▣" },
    { name: "Assets & Blocks", icon: "▥" },
    { name: "Conflicts", icon: "⚠" },
    { name: "AI Optimizer", icon: "✦" },
    { name: "Analytics", icon: "▥" },
    { name: "Settings", icon: "⚙" },
  ];

  return (
    <aside className="sidebar">
      {/* LOGO */}
      <div className="logo">
        <div className="logo-icon">R</div>

        <div className="logo-text">
          <h2>RAILOPT AI</h2>
          <p>Railway Operations</p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`menu-item ${
              activePage === item.name ? "active" : ""
            }`}
            onClick={() => setActivePage(item.name)}
          >
            <span className="menu-icon">{item.icon}</span>

            <span className="menu-label">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* BOTTOM STATUS */}
      <div className="sidebar-bottom">
        <div className="system-status">
          <span className="status-dot"></span>

          <div>
            <strong>System Online</strong>
            <small>AI Engine Ready</small>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;