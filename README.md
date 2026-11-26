# The Lecture Ledger

**The Lecture Ledger** is a lightweight, zero-dependency, client-side web application built to help college and university students calculate, monitor, and plan their class attendance against mandatory institutional thresholds (defaulting to **75%**). 

Developed as a **Web Development Mini-Project at Bennett University**, the application eliminates guesswork by answering two essential questions for any student:
1. *If I am above the attendance threshold, how many upcoming classes can I safely miss without dropping below the limit?*
2. *If I am below the attendance threshold, how many consecutive classes must I attend to recover my eligibility?*

---

## Table of Contents

- [Features](#features)
- [Mathematical Logic & Formulas](#mathematical-logic--formulas)
- [Pages & User Interface](#pages--user-interface)
- [Project Architecture](#project-architecture)
- [Code Reference (`js/script.js`)](#code-reference-jsscriptjs)
- [Validation Rules & Guardrails](#validation-rules--guardrails)
- [Getting Started](#getting-started)
- [Known Limitations & Future Roadmap](#known-limitations--future-roadmap)

---

## Features

- **Single-Course Quick Calculator (`index.html`):** Immediately check attendance standing for one class with customizable target thresholds.
- **Multi-Subject Attendance Tracker (`tracker.html`):**
  - Track an unlimited number of subjects in a single session.
  - Dynamic row rendering with color-coded status feedback (**green** `.good` for safe standing, **red** `.bad` for low attendance).
  - Real-time **Aggregate Overall Attendance** calculation across all logged courses.
  - Individual row deletion and one-click table reset.
- **Client-Side Validated Feedback Form (`feedback.html`):** Collects user ratings and comments with real-time error handling and form reset upon submission.
- **Responsive Mobile-First Layout (`css/style.css`):** Adapts seamlessly across desktop and mobile viewports (`@media (max-width: 700px)`) with horizontally scrollable tables on narrow screens.
- **Zero External Dependencies:** Pure semantic HTML5, CSS3, and ES5-compatible vanilla JavaScript—runs offline directly in any web browser.

---

## Mathematical Logic & Formulas

Let:
- $A$ = Total classes attended
- $H$ = Total classes held so far
- $R$ = Required minimum attendance percentage (e.g., `75`)

### 1. Current Attendance Percentage
$$\text{Attendance \%} = \left( \frac{A}{H} \right) \times 100$$

### 2. Safe Skip Margin (when $\text{Attendance \%} \ge R$)
To find the maximum number of consecutive classes ($x$) a student can miss while maintaining $\frac{A}{H + x} \ge \frac{R}{100}$:
$$\text{Can Skip} = \left\lfloor \frac{100A}{R} - H \right\rfloor$$

*Example:* If $A = 34$, $H = 40$, and $R = 75$:
$$\text{Can Skip} = \left\lfloor \frac{3400}{75} - 40 \right\rfloor = \lfloor 45.33 - 40 \rfloor = 5 \text{ classes}$$

### 3. Recovery Class Count (when $\text{Attendance \%} < R$)
To find the minimum number of consecutive classes ($y$) a student must attend so that $\frac{A + y}{H + y} \ge \frac{R}{100}$:
$$\text{Must Attend} = \left\lceil \frac{R \cdot H - 100A}{100 - R} \right\rceil$$

*Example:* If $A = 20$, $H = 30$ ($66.7\%$), and $R = 75$:
$$\text{Must Attend} = \left\lceil \frac{75(30) - 2000}{25} \right\rceil = \left\lceil \frac{250}{25} \right\rceil = 10 \text{ consecutive classes}$$

---

## Pages & User Interface

| Page | File | Purpose & Components |
| :--- | :--- | :--- |
| **Home** | `index.html` | Displays the hero `75%` badge, value proposition, **Quick Check** calculator form (`held`, `attended`, `required`), and an explanation of the attendance formulas. |
| **Subject Tracker** | `tracker.html` | Provides a global `Required attendance %` field, inputs to add subjects (`Subject name`, `Classes held`, `Classes attended`), action buttons (`Add subject`, `Clear all`), overall percentage summary (`#overall`), and a responsive results table. |
| **Feedback** | `feedback.html` | Contains a validated feedback form with inputs for `Name`, `Email`, `Rating` (1–5 stars), and `Message`, displaying inline error or confirmation banners. |

### Visual Theme (`css/style.css`)
- **Primary Navy (`#1b2a49`):** Header bar, circular hero badge, table headers, and footer.
- **Accent Gold (`#ffd23f`):** Brand logo, hero typography, primary action buttons, and navigation hover states.
- **Status Feedback:** Soft mint green (`#d9f2e3` / `#1c6b3d`) for `.good` standing and soft coral red (`#fbdada` / `#a12c2c`) for `.bad` standing.

---

## Project Architecture

```text
LectureLedger/
├── index.html          # Landing page & single-subject Quick Check calculator
├── tracker.html        # Multi-subject attendance planner & aggregate tracker
├── feedback.html       # User feedback page with client-side validation
├── css/
│   └── style.css       # Shared stylesheet, flexbox layout, status classes, and mobile media queries
├── js/
│   └── script.js       # Core calculation engine, state array, DOM rendering, and form validation
└── README.md           # Project documentation
