function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div>
          <h1>Railway Operations</h1>
          <p>AI-powered automatic block planning</p>
        </div>
      </div>

      <div className="header-right">
        <div className="planner-status">
          <span className="planner-dot"></span>
          <span>3 Planner</span>
        </div>

        <div className="header-divider"></div>

        <button className="notification-button" type="button">
          <span>♢</span>
          <span className="notification-badge">4</span>
        </button>

        <div className="user-profile">
          <div className="user-avatar">P</div>

          <div className="user-info">
            <strong>Planner</strong>
            <small>Operations</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;