function WeeklyPlan() {
  const days = [
    { day: "MON", date: "7" },
    { day: "TUE", date: "8" },
    { day: "WED", date: "9" },
    { day: "THU", date: "10" },
    { day: "FRI", date: "11" },
    { day: "SAT", date: "12" },
    { day: "SUN", date: "13" },
  ];

  const tracks = ["T-101", "T-102", "T-103", "T-104"];

  const blocks = [
    {
      day: 0,
      track: 1,
      start: 1,
      span: 2,
      type: "maintenance",
      title: "Track Maintenance",
      asset: "T-102",
    },
    {
      day: 1,
      track: 2,
      start: 3,
      span: 2,
      type: "signal",
      title: "Signal Inspection",
      asset: "S-301",
    },
    {
      day: 2,
      track: 0,
      start: 1,
      span: 2,
      type: "ohe",
      title: "OHE Maintenance",
      asset: "OHE-21",
    },
    {
      day: 3,
      track: 3,
      start: 4,
      span: 2,
      type: "maintenance",
      title: "Track Maintenance",
      asset: "T-104",
    },
    {
      day: 4,
      track: 1,
      start: 2,
      span: 2,
      type: "conflict",
      title: "Train Conflict",
      asset: "T-102",
    },
    {
      day: 5,
      track: 2,
      start: 1,
      span: 2,
      type: "maintenance",
      title: "Inspection",
      asset: "T-103",
    },
    {
      day: 6,
      track: 0,
      start: 3,
      span: 2,
      type: "signal",
      title: "Signal Check",
      asset: "S-302",
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
    <div className="page weekly-page">

      <div className="page-header weekly-header">
        <div>
          <h1 className="page-title">Weekly Plan</h1>
          <p className="page-subtitle">
            Detailed block scheduling by day and track
          </p>
        </div>

        <button className="btn btn-primary">
          ✦ Generate Optimal Week
        </button>
      </div>

      <div className="weekly-toolbar">
        <div>
          <strong>September 7 – 13, 2026</strong>
          <span>Weekly Maintenance Schedule</span>
        </div>

        <div className="weekly-legend">
          <span>
            <i className="legend-dot maintenance"></i>
            BLOCK
          </span>

          <span>
            <i className="legend-dot free"></i>
            FREE
          </span>

          <span>
            <i className="legend-dot conflict"></i>
            CONFLICT
          </span>
        </div>
      </div>

      <div className="weekly-calendar">

        <div className="calendar-corner">
          <span>TRACK</span>
        </div>

        {days.map((day) => (
          <div className="calendar-day" key={day.day}>
            <strong>{day.day}</strong>
            <span>{day.date}</span>
          </div>
        ))}

        {tracks.map((track, trackIndex) => (
          <div className="calendar-track-row" key={track}>

            <div className="track-label">
              <strong>{track}</strong>
              <span>Track</span>
            </div>

            {days.map((_, dayIndex) => (
              <div
                className="calendar-cell"
                key={`${track}-${dayIndex}`}
              >
                <div className="cell-lines">
                  {times.map((time) => (
                    <span key={time}></span>
                  ))}
                </div>

                {blocks
                  .filter(
                    (block) =>
                      block.day === dayIndex &&
                      block.track === trackIndex
                  )
                  .map((block, index) => (
                    <div
                      className={`calendar-block ${block.type}`}
                      style={{
                        left: `${(block.start / 6) * 100}%`,
                        width: `${(block.span / 6) * 100}%`,
                      }}
                      key={index}
                    >
                      <strong>{block.title}</strong>
                      <span>{block.asset}</span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="weekly-footer">
        <div>
          <span className="footer-number">18</span>
          <span>Active Blocks</span>
        </div>

        <div>
          <span className="footer-number green">91%</span>
          <span>Asset Availability</span>
        </div>

        <div>
          <span className="footer-number red">04</span>
          <span>Conflicts</span>
        </div>

        <div>
          <span className="footer-number blue">07</span>
          <span>Trains Impacted</span>
        </div>
      </div>

    </div>
  );
}

export default WeeklyPlan;