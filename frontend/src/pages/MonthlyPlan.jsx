function MonthlyPlan() {
  const days = [
    { date: 30, muted: true },
    { date: 31, muted: true },
    { date: 1 },
    { date: 2 },
    { date: 3 },
    { date: 4 },
    { date: 5 },

    { date: 6 },
    { date: 7 },
    { date: 8 },
    { date: 9 },
    {
      date: 10,
      blocks: [
        { type: "signal", text: "S-301 Signal" },
        { type: "maintenance", text: "T-103 Maint." },
      ],
    },
    { date: 11 },
    {
      date: 12,
      blocks: [
        { type: "maintenance", text: "T-102 Maint." },
      ],
    },

    { date: 13 },
    { date: 14 },
    {
      date: 15,
      blocks: [
        { type: "ohe", text: "OHE-21 OHE" },
      ],
    },
    { date: 16 },
    { date: 17 },
    {
      date: 18,
      blocks: [
        { type: "maintenance", text: "T-104 Maint." },
      ],
    },
    { date: 19 },

    {
      date: 20,
      blocks: [
        { type: "signal", text: "S-302 Signal" },
      ],
    },
    { date: 21 },
    { date: 22 },
    {
      date: 23,
      blocks: [
        { type: "maintenance", text: "T-101 Maint." },
      ],
    },
    { date: 24 },
    { date: 25 },
    { date: 26 },

    {
      date: 27,
      blocks: [
        { type: "ohe", text: "OHE-18 OHE" },
      ],
    },
    { date: 28 },
    { date: 29 },
    { date: 30 },
    { date: 1, muted: true },
    { date: 2, muted: true },
    { date: 3, muted: true },
  ];

  return (
    <div className="page monthly-page">

      <div className="page-header monthly-header">
        <div>
          <h1 className="page-title">Monthly Plan</h1>
          <p className="page-subtitle">
            Railway maintenance and block planning calendar
          </p>
        </div>

        <button className="btn btn-primary">
          ✦ Generate Monthly Plan
        </button>
      </div>

      <div className="monthly-summary">

        <div className="monthly-stat">
          <strong>September 2026</strong>
          <span>Planning Month</span>
        </div>

        <div className="monthly-stat">
          <strong>36</strong>
          <span>Scheduled Blocks</span>
        </div>

        <div className="monthly-stat">
          <strong className="green-text">91%</strong>
          <span>Asset Availability</span>
        </div>

        <div className="monthly-stat">
          <strong className="red-text">07</strong>
          <span>Conflicts</span>
        </div>

      </div>

      <div className="monthly-calendar">

        <div className="month-weekdays">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>

        <div className="month-grid">

          {days.map((day, index) => (
            <div
              key={index}
              className={`month-day ${
                day.muted ? "muted-day" : ""
              } ${
                day.date === 9 && !day.muted
                  ? "today-day"
                  : ""
              }`}
            >

              <div className="month-date">
                {day.date}
              </div>

              <div className="month-blocks">

                {day.blocks?.map((block, blockIndex) => (
                  <div
                    key={blockIndex}
                    className={`month-block ${block.type}`}
                  >
                    <span></span>
                    {block.text}
                  </div>
                ))}

              </div>

            </div>
          ))}

        </div>
      </div>

      <div className="monthly-legend">

        <span>
          <i className="legend-square maintenance"></i>
          Maintenance
        </span>

        <span>
          <i className="legend-square signal"></i>
          Signal
        </span>

        <span>
          <i className="legend-square ohe"></i>
          OHE
        </span>

        <span>
          <i className="legend-square conflict"></i>
          Conflict
        </span>

      </div>

    </div>
  );
}

export default MonthlyPlan;