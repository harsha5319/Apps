
(() => {
  "use strict";

  const STORAGE_KEY = "dayforge_tracker_v1";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const safeDate = (iso) => {
    const d = new Date(`${iso}T12:00:00`);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  };

  const dateLabel = (iso) =>
    safeDate(iso).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });

  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[ch]));

  // All seven subjects
  const subjects = [
    "OS",
    "Java",
    "AIML",
    "Maths",
    "Frontend",
    "IoT",
    "Cybersecurity"
  ];

  // Daily food, workout, water and productivity tracker
  const routineItems = [
    {
      id: "breakfast",
      icon: "🌅",
      title: "Morning — Breakfast",
      sub: "Choose one balanced option",
      options: [
        "3 eggs + 2–3 chapatis",
        "Idli + sambar + 2 eggs",
        "Dosa + sambar + curd",
        "Oats + milk + banana + nuts"
      ]
    },
    {
      id: "midmorning",
      icon: "🍌",
      title: "Mid-morning",
      sub: "Choose what suits you",
      options: [
        "Banana or apple",
        "Handful of peanuts or other nuts",
        "Milk or curd"
      ]
    },
    {
      id: "lunch",
      icon: "🍛",
      title: "Lunch",
      sub: "Aim for a balanced plate",
      options: [
        "Rice + dal/sambar + vegetables + curd",
        "3–4 chapatis + dal + vegetables + curd",
        "Add eggs, chicken or paneer if available"
      ]
    },
    {
      id: "preworkout",
      icon: "🏋️",
      title: "Pre-workout",
      sub: "About 1–2 hours before exercise",
      options: [
        "Banana + milk",
        "1–2 chapatis + egg",
        "Banana + peanuts",
        "Rest day / no workout planned"
      ]
    },
    {
      id: "postworkout",
      icon: "💪",
      title: "Post-workout",
      sub: "After exercise, if applicable",
      options: [
        "Whey protein according to package serving instructions",
        "Banana or another fruit",
        "Normal meal when hungry",
        "Rest day / no workout planned"
      ]
    },
    {
      id: "dinner",
      icon: "🌙",
      title: "Dinner",
      sub: "Choose a balanced meal",
      options: [
        "Rice + dal + vegetables + curd",
        "Chapatis + dal + vegetables + curd",
        "Eggs, paneer or chicken if available"
      ]
    },
    {
      id: "bedtime",
      icon: "🥛",
      title: "Before bed",
      sub: "Optional — if hungry",
      options: [
        "Glass of milk",
        "Curd",
        "Skip if not hungry"
      ]
    },
    {
      id: "water",
      icon: "💧",
      title: "Water check",
      sub: "Drink regularly through the day",
      options: [
        "Refilled water bottle",
        "Had water regularly",
        "Need to drink more water"
      ]
    },
    {
      id: "studyblock",
      icon: "📚",
      title: "Focused study",
      sub: "One focused block with short breaks",
      options: [
        "25-minute focus session",
        "50-minute focus session",
        "Review / revision session"
      ]
    },
    {
      id: "project",
      icon: "💻",
      title: "Work / project",
      sub: "Move one important task forward",
      options: [
        "College assignment",
        "Coding / project work",
        "Career or portfolio task"
      ]
    },
    {
      id: "movement",
      icon: "🚶",
      title: "Movement",
      sub: "Exercise, walk or stretch",
      options: [
        "Workout completed",
        "Walk or light activity",
        "Stretching / mobility"
      ]
    },
    {
      id: "sleep",
      icon: "😴",
      title: "Sleep routine",
      sub: "Wind down and prepare for tomorrow",
      options: [
        "Prepared tomorrow's plan",
        "Screen-free wind-down",
        "Consistent bedtime"
      ]
    }
  ];

  // Five phases of the AI cybersecurity roadmap
  const phases = [
    {
      id: "phase1",
      name: "Foundations",
      tag: "PHASE 1",
      desc: "Build your base",
      items: [
        ["networking", "Networking & OS", "TCP/IP, DNS, Linux and Windows"],
        ["programming", "Programming (Python, Java)", "Programming fundamentals and scripting"],
        ["basics", "Cybersecurity Basics", "CIA triad, threats, vulnerabilities and risk"],
        ["ai", "AI Fundamentals", "Data, algorithms and machine-learning basics"]
      ]
    },
    {
      id: "phase2",
      name: "Cybersecurity Skills",
      tag: "PHASE 2",
      desc: "Think like a defender",
      items: [
        ["tools", "Hacking Tools", "Kali Linux, Nmap, Wireshark and Metasploit in authorized labs"],
        ["threatmodel", "Threat Modeling", "STRIDE, attack trees and risk prioritization"],
        ["aimlsecurity", "AI/ML for Security", "Pattern detection and anomaly detection"]
      ]
    },
    {
      id: "phase3",
      name: "AI + Security Integration",
      tag: "PHASE 3",
      desc: "Smarter detection, stronger defense",
      items: [
        ["intrusion", "ML Intrusion Detection", "Classification and anomaly detection"],
        ["malware", "Malware Analysis (CNN, RNN)", "Static/dynamic analysis in a safe lab"],
        ["phishing", "Phishing Detection (NLP)", "Email/text analysis and language models"]
      ]
    },
    {
      id: "phase4",
      name: "Advanced Specialization",
      tag: "PHASE 4",
      desc: "Go deeper, build expertise",
      items: [
        ["cloud", "Cloud & AI Security", "AWS, Azure, GCP and identity/access management"],
        ["adversarial", "Adversarial ML", "Evasion, robustness and model security"],
        ["bugbounty", "Bug Bounties", "Authorized programs, scope and report writing"]
      ]
    },
    {
      id: "phase5",
      name: "Career Pathways",
      tag: "PHASE 5",
      desc: "Turn skills into outcomes",
      items: [
        ["portfolio", "Portfolio", "GitHub, projects and a clear résumé"],
        ["projects", "Real-world Projects", "Document practical defensive applications"],
        ["career", "Career Preparation", "Interview practice, certifications and networking"]
      ]
    }
  ];

  // Generate assignments for every subject
  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  function buildTasks() {
    const list = [];

    subjects.forEach(subject => {
      // H.A. 1–6
      for (let n = 1; n <= 6; n++) {
        list.push({
          id: `${slug(subject)}-ha-${n}`,
          subject,
          type: "H.A.",
          title: `H.A. ${n}`,
          week: n
        });
      }

      // ALM 1–6
      for (let n = 1; n <= 6; n++) {
        list.push({
          id: `${slug(subject)}-alm-${n}`,
          subject,
          type: "ALM",
          title: `ALM ${n}`,
          week: Math.min(n + 1, 20)
        });
      }

      // Workbook Weeks 1–20
      for (let n = 1; n <= 20; n++) {
        list.push({
          id: `${slug(subject)}-workbook-${n}`,
          subject,
          type: "Workbook",
          title: `Workbook — Week ${n}`,
          week: n
        });
      }
    });

    // Maths Tutorials 1–20
    for (let n = 1; n <= 20; n++) {
      list.push({
        id: `maths-tutorial-${n}`,
        subject: "Maths",
        type: "Tutorial",
        title: `Tutorial ${n}`,
        week: n
      });
    }

    return list;
  }

  const tasks = buildTasks();

  const defaultState = () => ({
    version: 1,
    routine: {},
    study: {},
    cyber: {},
    createdAt: new Date().toISOString()
  });

  let state = loadState();
  let trackingDate = todayISO();
  let toastTimer;

  // Load saved progress from this browser
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) return defaultState();

      const parsed = JSON.parse(raw);

      return {
        ...defaultState(),
        ...parsed,
        routine: parsed.routine || {},
        study: parsed.study || {},
        cyber: parsed.cyber || {}
      };
    } catch (err) {
      return defaultState();
    }
  }

  // Save progress locally
  function saveState(message) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      showToast("Could not save. Your browser storage may be full.");
      return;
    }

    if (message) showToast(message);
    renderDashboard();
  }

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(
      () => toast.classList.remove("show"),
      2400
    );
  }

  function dayBucket(iso = trackingDate) {
    if (!state.routine[iso]) state.routine[iso] = {};
    return state.routine[iso];
  }

  function studyBucket() {
    return state.study;
  }

  function getStatus(map, id) {
    return map[id]?.status || "Not Started";
  }

  function pct(done, total) {
    return total ? Math.round((done / total) * 100) : 0;
  }

  function setProgress(id, value) {
    const el = $(id);
    if (el) el.style.width = `${value}%`;
  }

  function updateStat(id, barId, subId, done, total, label) {
    const p = pct(done, total);

    if ($(id)) $(id).textContent = `${p}%`;

    setProgress(barId, p);

    if ($(subId)) {
      $(subId).textContent =
        label || `${done} of ${total} completed`;
    }
  }

  // Display daily routine cards
  function renderRoutine() {
    const bucket = dayBucket();

    $("#routineList").innerHTML = routineItems.map(item => {
      const saved = bucket[item.id] || {};
      const selected = saved.choice || "";

      return `
        <article class="routine-card">
          <div class="routine-card-head">
            <div class="meal-icon">${item.icon}</div>
            <div>
              <h3>${item.title}</h3>
              <div class="subline">${item.sub}</div>
            </div>
          </div>

          <select aria-label="${escapeHTML(item.title)} choice"
                  data-routine-choice="${item.id}">
            <option value="">Choose an option…</option>
            ${item.options.map(o => `
              <option value="${escapeHTML(o)}"
                ${selected === o ? "selected" : ""}>
                ${escapeHTML(o)}
              </option>
            `).join("")}
          </select>

          <textarea rows="2"
            placeholder="Notes / what you ate or did…"
            aria-label="${escapeHTML(item.title)} notes"
            data-routine-notes="${item.id}">${escapeHTML(saved.notes || "")}</textarea>

          <div class="routine-bottom">
            <input type="time"
              aria-label="${escapeHTML(item.title)} planned time"
              value="${escapeHTML(saved.time || "")}"
              data-routine-time="${item.id}"/>

            <select aria-label="${escapeHTML(item.title)} status"
                    data-routine-status="${item.id}">
              <option ${getStatus(bucket, item.id) === "Not Started" ? "selected" : ""}>Not Started</option>
              <option ${getStatus(bucket, item.id) === "In Progress" ? "selected" : ""}>In Progress</option>
              <option ${getStatus(bucket, item.id) === "Completed" ? "selected" : ""}>Completed</option>
            </select>
          </div>
        </article>
      `;
    }).join("");

    const done = routineItems.filter(
      x => getStatus(bucket, x.id) === "Completed"
    ).length;

    $("#routineCompletion").textContent =
      `${pct(done, routineItems.length)}% complete`;
  }

  function renderStudyFilters() {
    $("#subjectFilter").innerHTML =
      '<option value="all">All subjects</option>' +
      subjects.map(s => `<option value="${s}">${s}</option>`).join("");

    $("#weekFilter").innerHTML =
      '<option value="all">All weeks</option>' +
      Array.from({ length: 20 }, (_, i) =>
        `<option value="${i + 1}">Week ${i + 1}</option>`
      ).join("");
  }

  // Display searchable study assignments
  function renderStudy() {
    const query = $("#taskSearch").value.trim().toLowerCase();
    const sub = $("#subjectFilter").value;
    const status = $("#statusFilter").value;
    const week = $("#weekFilter").value;

    const visible = tasks.filter(t =>
      (sub === "all" || t.subject === sub) &&
      (status === "all" || getStatus(studyBucket(), t.id) === status) &&
      (week === "all" || String(t.week) === week) &&
      `${t.subject} ${t.type} ${t.title}`.toLowerCase().includes(query)
    );

    $("#taskTable").innerHTML = visible.map(t => {
      const st = getStatus(studyBucket(), t.id);
      const note = studyBucket()[t.id]?.notes || "";
      const cls = st === "Completed"
        ? "completed"
        : st === "In Progress"
          ? "in-progress"
          : "";

      return `
        <tr>
          <td><span class="subject-tag">${escapeHTML(t.subject)}</span></td>
          <td>
            <b>${escapeHTML(t.title)}</b>
            <div class="muted tiny">${escapeHTML(t.type)}</div>
          </td>
          <td>Week ${t.week}</td>
          <td>
            <select class="status-select ${cls}"
                    data-task-status="${t.id}"
                    aria-label="${escapeHTML(t.title)} status">
              <option ${st === "Not Started" ? "selected" : ""}>Not Started</option>
              <option ${st === "In Progress" ? "selected" : ""}>In Progress</option>
              <option ${st === "Completed" ? "selected" : ""}>Completed</option>
            </select>
          </td>
          <td>
            <input class="note-input"
              data-task-note="${t.id}"
              value="${escapeHTML(note)}"
              placeholder="Add a note…"/>
          </td>
        </tr>
      `;
    }).join("");

    $("#taskCount").textContent =
      `Showing ${visible.length} of ${tasks.length} study tasks.`;

    const done = tasks.filter(
      t => getStatus(studyBucket(), t.id) === "Completed"
    ).length;

    const progress = tasks.filter(
      t => getStatus(studyBucket(), t.id) === "In Progress"
    ).length;

    $("#studyCompletion").textContent =
      `${pct(done, tasks.length)}% complete`;

    $("#taskSummary").innerHTML = `
      <span class="summary-pill"><b>${done}</b> completed</span>
      <span class="summary-pill"><b>${progress}</b> in progress</span>
      <span class="summary-pill"><b>${tasks.length - done - progress}</b> not started</span>
      <span class="summary-pill"><b>${tasks.length}</b> total tasks</span>
    `;
  }

  // Display cybersecurity roadmap
  function renderCyber() {
    $("#roadmap").innerHTML = phases.map(phase => {
      const all = phase.items.length;

      const done = phase.items.filter(
        item => state.cyber[item[0]] === true
      ).length;

      const p = pct(done, all);

      return `
        <article class="phase-card">
          <div class="phase-head">
            <div>
              <div class="phase-kicker">${phase.tag}</div>
              <h3>${phase.name}</h3>
              <div class="phase-desc">${phase.desc}</div>
            </div>
            <span class="phase-progress">${done}/${all}</span>
          </div>

          ${phase.items.map(([id, title, desc]) => `
            <div class="roadmap-item ${state.cyber[id] ? "done" : ""}">
              <input type="checkbox"
                id="cyber-${id}"
                data-cyber="${id}"
                ${state.cyber[id] ? "checked" : ""}/>

              <label for="cyber-${id}">
                ${escapeHTML(title)}
                <small>${escapeHTML(desc)}</small>
              </label>
            </div>
          `).join("")}

          <div class="progress-track">
            <span style="width:${p}%"></span>
          </div>
        </article>
      `;
    }).join("");
  }

  // Weekly progress chart
  function renderWeeklyChart() {
    const today = safeDate(trackingDate);
    const day = today.getDay();
    const mondayOffset = (day + 6) % 7;

    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayOffset);

    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    });

    $("#weeklyChart").innerHTML = weekDates.map(iso => {
      const bucket = state.routine[iso] || {};

      const routineDone = routineItems.filter(
        item => bucket[item.id]?.status === "Completed"
      ).length;

      const value = pct(routineDone, routineItems.length);

      return `
        <div class="bar-col"
          title="${dateLabel(iso)}: ${value}% routine complete">
          <span class="bar-value">${value}%</span>
          <div class="bar" style="height:${Math.max(3, value)}%"></div>
        </div>
      `;
    }).join("");

    const routineWeek = weekDates.reduce((sum, iso) =>
      sum + routineItems.filter(
        item => (state.routine[iso] || {})[item.id]?.status === "Completed"
      ).length, 0
    );

    const routineTotal = 7 * routineItems.length;

    const taskWeek = tasks.filter(t => {
      const d = state.study[t.id]?.completedDate;
      return d && weekDates.includes(d);
    }).length;

    const total = routineTotal + Math.max(7, Math.round(tasks.length / 20));

    updateStat(
      "#weekStat",
      "#weekBar",
      "#weekSub",
      routineWeek + taskWeek,
      total,
      `${routineWeek} routine + ${taskWeek} study completions this week`
    );
  }

  // Progress by subject
  function renderSubjectOverview() {
    $("#subjectOverview").innerHTML = subjects.map(subject => {
      const subset = tasks.filter(t => t.subject === subject);

      const done = subset.filter(
        t => getStatus(studyBucket(), t.id) === "Completed"
      ).length;

      const p = pct(done, subset.length);

      return `
        <div class="subject-line">
          <span class="name">${escapeHTML(subject)}</span>
          <div class="progress-track">
            <span style="width:${p}%"></span>
          </div>
          <span class="pct">${p}%</span>
        </div>
      `;
    }).join("");
  }

  // Main dashboard
  function renderDashboard() {
    const bucket = dayBucket();

    const routineDone = routineItems.filter(
      x => getStatus(bucket, x.id) === "Completed"
    ).length;

    updateStat(
      "#routineStat",
      "#routineBar",
      "#routineSub",
      routineDone,
      routineItems.length,
      `${routineDone} of ${routineItems.length} items completed`
    );

    const studyDone = tasks.filter(
      t => getStatus(studyBucket(), t.id) === "Completed"
    ).length;

    updateStat(
      "#studyStat",
      "#studyBar",
      "#studySub",
      studyDone,
      tasks.length,
      `${studyDone} of ${tasks.length} tasks completed`
    );

    const allCyber = phases.flatMap(p => p.items);

    const cyberDone = allCyber.filter(
      item => state.cyber[item[0]] === true
    ).length;

    updateStat(
      "#cyberStat",
      "#cyberBar",
      "#cyberSub",
      cyberDone,
      allCyber.length,
      `${cyberDone} of ${allCyber.length} roadmap tasks completed`
    );

    $("#overviewDate").textContent = dateLabel(trackingDate);

    renderSubjectOverview();
    renderWeeklyChart();
  }

  function renderAll() {
    $("#dateLabel").textContent = dateLabel(trackingDate).toUpperCase();

    renderRoutine();
    renderStudy();
    renderCyber();
    renderDashboard();
  }

  // Navigation
  function goTo(view) {
    $$(".view").forEach(el =>
      el.classList.toggle("active", el.id === `view-${view}`)
    );

    $$(".nav-link").forEach(el =>
      el.classList.toggle("active", el.dataset.view === view)
    );

    const titles = {
      dashboard: "Good progress starts with a plan.",
      routine: "Take care of the basics.",
      study: "Make every study session count.",
      cyber: "Learn the skills. Build the proof."
    };

    $("#pageTitle").textContent = titles[view] || "DAYFORGE";

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.addEventListener("click", e => {
    const nav = e.target.closest("[data-view]");
    if (nav) goTo(nav.dataset.view);

    const go = e.target.closest("[data-go]");
    if (go) goTo(go.dataset.go);
  });

  // Date selection
  $("#trackingDate").value = trackingDate;

  $("#trackingDate").addEventListener("change", e => {
    if (!e.target.value) {
      e.target.value = trackingDate;
      return;
    }

    trackingDate = e.target.value;
    renderAll();
  });

  // Save routine choices and statuses
  $("#routineList").addEventListener("change", e => {
    const el = e.target;
    const bucket = dayBucket();

    const id =
      el.dataset.routineChoice ||
      el.dataset.routineStatus ||
      el.dataset.routineTime;

    if (!id) return;

    if (!bucket[id]) {
      bucket[id] = {
        status: "Not Started",
        choice: "",
        notes: "",
        time: ""
      };
    }

    if (el.dataset.routineChoice) bucket[id].choice = el.value;
    if (el.dataset.routineStatus) bucket[id].status = el.value;
    if (el.dataset.routineTime) bucket[id].time = el.value;

    saveState("Routine updated.");
    renderRoutine();
  });

  // Save routine notes while typing
  $("#routineList").addEventListener("input", e => {
    const el = e.target;
    const id = el.dataset.routineNotes;

    if (!id) return;

    const bucket = dayBucket();

    if (!bucket[id]) {
      bucket[id] = {
        status: "Not Started",
        choice: "",
        notes: "",
        time: ""
      };
    }

    bucket[id].notes = el.value;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {}

    renderDashboard();
  });

  // Save assignment status and notes
  $("#taskTable").addEventListener("change", e => {
    const el = e.target;
    const id = el.dataset.taskStatus || el.dataset.taskNote;

    if (!id) return;

    if (!studyBucket()[id]) {
      studyBucket()[id] = {
        status: "Not Started",
        notes: ""
      };
    }

    if (el.dataset.taskStatus) {
      studyBucket()[id].status = el.value;

      if (el.value === "Completed") {
        studyBucket()[id].completedDate = trackingDate;
      } else {
        delete studyBucket()[id].completedDate;
      }

      saveState("Study progress saved.");
      renderStudy();
    } else {
      studyBucket()[id].notes = el.value;

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {}
    }
  });

  // Search and filters
  $("#taskSearch").addEventListener("input", renderStudy);

  ["subjectFilter", "statusFilter", "weekFilter"].forEach(id => {
    $("#" + id).addEventListener("change", renderStudy);
  });

  // Cybersecurity completion controls
  $("#roadmap").addEventListener("change", e => {
    const id = e.target.dataset.cyber;

    if (!id) return;

    state.cyber[id] = e.target.checked;

    saveState("Roadmap progress saved.");
    renderCyber();
  });

  // Export progress backup
  $("#exportBtn").addEventListener("click", () => {
    const blob = new Blob(
      [JSON.stringify(state, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `dayforge-backup-${todayISO()}.json`;
    a.click();

    URL.revokeObjectURL(url);
    showToast("Backup exported.");
  });

  // Import a saved backup
  $("#importFile").addEventListener("change", async e => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text());

      if (
        !parsed ||
        typeof parsed !== "object" ||
        !parsed.routine ||
        !parsed.study ||
        !parsed.cyber
      ) {
        throw new Error("Invalid backup");
      }

      if (!confirm("Import this backup and replace the current tracker data?")) {
        return;
      }

      state = { ...defaultState(), ...parsed };

      saveState("Backup imported.");
      renderAll();
    } catch (err) {
      alert("That file is not a valid Dayforge JSON backup.");
    } finally {
      e.target.value = "";
    }
  });

  // Reset all progress
  $("#resetBtn").addEventListener("click", () => {
    if (!confirm(
      "Reset all routine, study and cybersecurity progress on this browser? Export a backup first if you want to keep it."
    )) {
      return;
    }

    state = defaultState();

    saveState("All progress reset.");
    renderAll();
  });

  // Start the app
  renderStudyFilters();
  renderAll();
})();
