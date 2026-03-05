// ── Shared Data & State ───────────────────────────────────────────────────────

const TEACHERS = [
  {
    id: "t1",
    name: "Nneka Evangelista",
    subject: "Social Science",
    initials: "NE",
    color: "#aaaaff",
    username: "nnekaevangelista",
    password: "123456",
  },
  {
    id: "t2",
    name: "Jax Ramos",
    subject: "Computer Science",
    initials: "JR",
    color: "#aaaaff",
    username: "jaxramos",
    password: "123456",
  },
  {
    id: "t3",
    name: "Cletcher Maxion",
    subject: "Mathematics",
    initials: "CM",
    color: "#aaaaff",
    username: "cletchermaxion",
    password: "123456",
  },
];

const STUDENTS = [
  {
    id: "s1",
    name: "Nathan Agillon",
    initials: "NA",
    color: "#aaffaa",
    username: "nathanagillon",
    password: "123456",
  },
  {
    id: "s2",
    name: "Johan Ramirez",
    initials: "JR",
    color: "#aaffaa",
    username: "johanramirez",
    password: "123456",
  },
  {
    id: "s3",
    name: "Aiden Valderama",
    initials: "AV",
    color: "#aaffaa",
    username: "aidenvalderama",
    password: "123456",
  },
];

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const DURATIONS = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hr" },
];

// ── Persistence helpers ───────────────────────────────────────────────────────
function loadState() {
  try {
    const raw = sessionStorage.getItem("consultState");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function saveState(state) {
  try {
    sessionStorage.setItem("consultState", JSON.stringify(state));
  } catch (e) {}
}

function getDefaultState() {
  return {
    schedules: {
      t1: [
        { id: "a1", day: "Monday", start: "09:00", end: "12:00" },
        { id: "a2", day: "Wednesday", start: "13:00", end: "16:00" },
        { id: "a3", day: "Friday", start: "10:00", end: "12:00" },
      ],
      t2: [
        { id: "b1", day: "Tuesday", start: "08:00", end: "11:00" },
        { id: "b2", day: "Thursday", start: "14:00", end: "17:00" },
      ],
      t3: [
        { id: "c1", day: "Monday", start: "14:00", end: "17:00" },
        { id: "c2", day: "Wednesday", start: "09:00", end: "11:00" },
        { id: "c3", day: "Friday", start: "13:00", end: "15:00" },
      ],
    },
    consultations: [],
    notifs: {},
  };
}

function getAppState() {
  return loadState() || getDefaultState();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function toMin(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function toTime(m) {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}
function fmt(t) {
  const [h, m] = t.split(":").map(Number);
  return `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}
function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function checkOverlap(
  state,
  teacherId,
  day,
  startMin,
  endMin,
  excludeId = null,
) {
  return state.consultations.some((c) => {
    if (
      c.id === excludeId ||
      c.teacherId !== teacherId ||
      c.day !== day ||
      c.status === "rejected"
    )
      return false;
    const cs = toMin(c.start),
      ce = cs + c.duration;
    return startMin < ce && endMin > cs;
  });
}

function getAvailableSlots(state, teacherId) {
  const slots = state.schedules[teacherId] || [];
  const result = [];
  slots.forEach((slot) => {
    WEEKDAYS.forEach((day) => {
      if (slot.day !== day) return;
      const slotStart = toMin(slot.start);
      const slotEnd = toMin(slot.end);
      // Show available 15-min windows
      for (let t = slotStart; t + 15 <= slotEnd; t += 15) {
        const blocked = checkOverlap(state, teacherId, day, t, t + 15);
        if (!blocked) {
          result.push({ day, start: toTime(t), slotId: slot.id });
        }
      }
    });
  });
  return result;
}

function buildScheduleContext(state) {
  const lines = ["=== AVAILABLE TEACHER SCHEDULES ==="];
  TEACHERS.forEach((t) => {
    const slots = state.schedules[t.id] || [];
    lines.push(`\nTeacher: ${t.name} (ID: ${t.id}) — ${t.subject}`);
    if (!slots.length) {
      lines.push("  No availability set.");
      return;
    }
    slots.forEach((s) => {
      lines.push(`  ${s.day}: ${fmt(s.start)} – ${fmt(s.end)}`);
    });
    // Also show what's already booked
    const booked = state.consultations.filter(
      (c) => c.teacherId === t.id && c.status !== "rejected",
    );
    if (booked.length) {
      lines.push("  Already booked:");
      booked.forEach((b) => {
        lines.push(
          `    ${b.day} ${fmt(b.start)} for ${b.duration} min (${b.status})`,
        );
      });
    }
  });
  return lines.join("\n");
}
