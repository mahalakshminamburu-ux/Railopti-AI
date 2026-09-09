export const railwayStations = [
  "Vijayawada",
  "Ongole",
  "Nellore",
  "Chennai",
  "Guntur",
];

export const blockCategories = [
  "Maintenance",
  "Signal",
  "OHE",
];

export const blockRequests = [
  {
    id: "BLK-001",
    date: "2026-09-09",
    station: "Ongole",
    category: "Maintenance",
    duration: 120,
    from: "02:00",
    to: "04:00",
    status: "Optimized",
  },
  {
    id: "BLK-002",
    date: "2026-09-10",
    station: "Nellore",
    category: "Signal",
    duration: 90,
    from: "01:00",
    to: "03:00",
    status: "Pending",
  },
  {
    id: "BLK-003",
    date: "2026-09-11",
    station: "Vijayawada",
    category: "OHE",
    duration: 150,
    from: "12:00",
    to: "04:00",
    status: "Optimized",
  },
];

export const trainData = [
  {
    train: "12711",
    route: "Vijayawada → Chennai",
    time: "10:30 AM",
    status: "On Time",
  },
  {
    train: "12840",
    route: "Chennai → Hyderabad",
    time: "11:15 AM",
    status: "Delayed",
  },
  {
    train: "17209",
    route: "Machilipatnam → Secunderabad",
    time: "12:00 PM",
    status: "On Time",
  },
];