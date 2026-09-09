function Network() {
  return (
    <div className="page settings-page">

      {/* HEADER */}

      <div className="page-header settings-header">

        <div>
          <h1 className="page-title">
            Settings
          </h1>

          <p className="page-subtitle">
            Manage your account, security and system preferences
          </p>
        </div>

      </div>


      {/* PROFILE */}

      <section className="settings-profile">

        <div className="profile-avatar">
          BN
        </div>

        <div className="profile-info">

          <span className="profile-label">
            USER ACCOUNT
          </span>

          <h2>
            Borra Naresh
          </h2>

          <p>
            Railway Operations Planner
          </p>

          <span className="profile-email">
            planner@railopt.ai
          </span>

        </div>

        <button className="settings-outline-btn">
          Edit Profile
        </button>

      </section>


      {/* SETTINGS GRID */}

      <div className="settings-grid">

        {/* ACCOUNT */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon blue">
              👤
            </div>

            <div>
              <h2>
                Account
              </h2>

              <p>
                Personal account information
              </p>
            </div>

          </div>


          <div className="settings-row">

            <div>
              <strong>
                Full Name
              </strong>

              <span>
                Borra Naresh
              </span>
            </div>

            <button>
              Edit
            </button>

          </div>


          <div className="settings-row">

            <div>
              <strong>
                Email Address
              </strong>

              <span>
                planner@railopt.ai
              </span>
            </div>

            <button>
              Change
            </button>

          </div>


          <div className="settings-row">

            <div>
              <strong>
                Role
              </strong>

              <span>
                Railway Operations Planner
              </span>
            </div>

            <span className="role-badge">
              PLANNER
            </span>

          </div>

        </section>


        {/* SECURITY */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon red">
              🔐
            </div>

            <div>
              <h2>
                Security
              </h2>

              <p>
                Protect your RailOpt AI account
              </p>
            </div>

          </div>


          <div className="settings-row">

            <div>
              <strong>
                Password
              </strong>

              <span>
                Last changed 30 days ago
              </span>
            </div>

            <button>
              Change
            </button>

          </div>


          <div className="settings-row">

            <div>
              <strong>
                Two-Factor Authentication
              </strong>

              <span>
                Add an extra layer of security
              </span>
            </div>

            <label className="toggle">

              <input type="checkbox" />

              <span></span>

            </label>

          </div>


          <div className="settings-row">

            <div>
              <strong>
                Login Activity
              </strong>

              <span>
                Review recent account activity
              </span>
            </div>

            <button>
              View
            </button>

          </div>

        </section>


        {/* NOTIFICATIONS */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon orange">
              🔔
            </div>

            <div>
              <h2>
                Notifications
              </h2>

              <p>
                Choose what alerts you receive
              </p>
            </div>

          </div>


          <div className="settings-row">

            <div>
              <strong>
                Conflict Alerts
              </strong>

              <span>
                Notify when operational conflicts are detected
              </span>
            </div>

            <label className="toggle">

              <input
                type="checkbox"
                defaultChecked
              />

              <span></span>

            </label>

          </div>


          <div className="settings-row">

            <div>
              <strong>
                Maintenance Alerts
              </strong>

              <span>
                Upcoming maintenance notifications
              </span>
            </div>

            <label className="toggle">

              <input
                type="checkbox"
                defaultChecked
              />

              <span></span>

            </label>

          </div>


          <div className="settings-row">

            <div>
              <strong>
                Train Delay Alerts
              </strong>

              <span>
                Notify when trains may be impacted
              </span>
            </div>

            <label className="toggle">

              <input
                type="checkbox"
                defaultChecked
              />

              <span></span>

            </label>

          </div>

        </section>


        {/* SYSTEM */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon purple">
              ⚙
            </div>

            <div>
              <h2>
                System Preferences
              </h2>

              <p>
                Customize the planning workspace
              </p>
            </div>

          </div>


          <div className="settings-row">

            <div>
              <strong>
                Planning Period
              </strong>

              <span>
                Default planning view
              </span>
            </div>

            <select defaultValue="Weekly">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>

          </div>


          <div className="settings-row">

            <div>
              <strong>
                Default Station
              </strong>

              <span>
                Primary station for planning
              </span>
            </div>

            <select defaultValue="Central">
              <option>Central Station</option>
              <option>Vijayawada Station</option>
              <option>Guntur Station</option>
            </select>

          </div>


          <div className="settings-row">

            <div>
              <strong>
                AI Recommendations
              </strong>

              <span>
                Automatically show optimization suggestions
              </span>
            </div>

            <label className="toggle">

              <input
                type="checkbox"
                defaultChecked
              />

              <span></span>

            </label>

          </div>

        </section>

      </div>


      {/* SESSION */}

      <section className="settings-session">

        <div>

          <span className="session-label">
            ACCOUNT SESSION
          </span>

          <h2>
            Sign out of RailOpt AI
          </h2>

          <p>
            Sign out from this device and return to the login screen.
          </p>

        </div>

        <button className="logout-btn">
          ↪ Logout
        </button>

      </section>

    </div>
  );
}

export default Network;