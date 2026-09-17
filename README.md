# CivicPulse 🏙️

> **Report. Track. Improve Your Community.**  
> A community-driven civic issue reporting and awareness platform.

![CivicPulse Banner](https://via.placeholder.com/1200x400/0f172a/10b981?text=CivicPulse)

## 📖 Overview
CivicPulse empowers citizens to turn everyday civic problems into visible, actionable community data. Whether it's a broken streetlight, a dangerous pothole, or an overflowing public bin, this platform allows users to report issues, confirm others' reports, and track the resolution process.

This project was built from scratch without any heavy frontend frameworks (like React or Vue) or CSS utility libraries (like Tailwind). It demonstrates strong architectural principles using **pure Vanilla HTML, CSS, and JavaScript**.

## ✨ Key Features
- **Issue Reporting Form:** Submit detailed reports with location, category, severity, and image uploads (handled via FileReader API to Base64).
- **Duplicate Detection:** Real-time duplicate checking based on title, category, and location to prevent spam.
- **Community Confirmation System:** "I Have This Problem Too" button allows the community to back an issue and increase its visibility.
- **Advanced Dashboard & Analytics:** Real-time charts (pure CSS/SVG) including category distribution, severity donuts, and an area intelligence heatmap.
- **Admin Moderation Panel:** Access via an admin code (`civicadmin`) to moderate, verify, resolve, or reject community reports.
- **Scroll-Reveal Animations:** Custom Intersection Observer implementation for smooth, staggered element revealing on scroll.
- **Local Persistence:** All data, users, and reports are saved to `localStorage`, allowing the app to retain state across sessions without a backend database.
- **PWA Ready:** Includes a Web App Manifest and Service Worker (`sw.js`) allowing it to be installed as a standalone desktop/mobile app.

## 🛠️ Technology Stack
- **HTML5:** Semantic architecture and structure.
- **CSS3:** Custom design system featuring CSS variables (light/dark mode), flexbox/grid layouts, glassmorphism, and responsive breakpoints.
- **Vanilla JavaScript (ES6+):** Module pattern for clean code separation, state management, event delegation, and DOM manipulation.
- **Font Awesome CDN:** For all iconography.
- **Google Fonts:** `Inter` and `Plus Jakarta Sans`.

## 📂 Architecture & Folder Structure
The app uses a modular structure to keep the code clean and scalable:

```
├── css/
│   ├── variables.css      # Design tokens (colors, fonts, spacing)
│   ├── base.css           # Resets and base HTML styles
│   ├── layout.css         # Grid system, container sizing
│   ├── components.css     # Buttons, cards, badges, nav, toast
│   ├── animations.css     # Scroll reveal classes, skeletons
│   └── [page].css         # Page-specific styles (landing, analytics, etc)
├── js/
│   ├── utils.js           # Debouncing, formatting, duplicate detection
│   ├── storageAdapter.js  # Wrapper for localStorage CRUD ops
│   ├── dataService.js     # Business logic and data aggregation
│   ├── seedData.js        # Initial dummy data generation
│   ├── auth.js            # User state and admin session logic
│   ├── theme.js           # Light/Dark mode toggling
│   ├── router.js          # Navigation active state management
│   ├── components.js      # Reusable UI rendering (Nav, Footer, Toasts, Cards)
│   ├── app.js             # Global bootstrap script (loads on every page)
│   ├── scrollReveal.js    # Intersection Observer engine
│   └── [page].js          # Page-specific controllers
├── sw.js                  # Service Worker for PWA installability
└── *.html                 # The 10 application views
```

## 🚀 How to Run Locally
Since this is a pure front-end application, no build steps (like Webpack or NPM) are required.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/parthcodesss-cloud/CivicPulse.git
   ```
2. **Open the project folder:**
   ```bash
   cd CivicPulse
   ```
3. **Serve the application:**
   You can run this project using any local web server. 
   - **Using VS Code:** Install the "Live Server" extension, right-click `index.html`, and select "Open with Live Server".
   - **Using Python:** Run `python -m http.server 8080` in the terminal, then visit `http://localhost:8080` in your browser.

## 🔐 Admin Access
To test the moderation features, go to the **Settings** page and enter the following admin code:
> **`civicadmin`**

This will unlock the Admin dashboard link in the navigation bar.

## 📝 License
This project is open-source and available under the MIT License.
