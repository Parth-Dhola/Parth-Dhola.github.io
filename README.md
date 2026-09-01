# ⚡ Parth Vinodray Dhola — Portfolio & Builder's Log

A production-grade, minimalist developer portfolio and systems engineering showcase built with clean, zero-dependency HTML5, modern CSS3 (Custom Properties & Glassmorphism), and vanilla JavaScript.

🌐 **Live Demo:** [parth-dhola.github.io](https://parth-dhola.github.io/)

---

## 🌟 Key Architecture & Highlights

- **Clean Minimalist Design:** Inspired by Brittany Chiang / Gazi Jarin, tailored specifically for AI & Robotics systems engineering.
- **Interactive Builder's Log:**
  - **Aurora:** 5-step milestone evolutionary journey (Telegram bot $\rightarrow$ Kivy Android/FastAPI $\rightarrow$ Docker/PyTest/CI-CD $\rightarrow$ SQLite Knowledge Graph + Obsidian $\rightarrow$ Self-Reflective CRAG).
  - **Weed LTH:** 4-phase experimental research journey on edge neural network compression (One-Shot vs IMP, Frankle & Carbin $W_0$ reset ablations, Dropout sweep, Knowledge Distillation, and INT8 Quantization down to 25.37 KiB).
- **Interactive Live Simulator:** Client-side LTH model compression simulator with real-time accuracy and parameter calculations.
- **Non-Neon Multi-Palette Theme Engine:** 5 refined matte themes (`Matte Sage Green`, `Warm Amber`, `Nordic Sky`, `Soft Violet`, `Minimal Titanium`) with `localStorage` persistence.
- **WAI-ARIA Accessibility:** Full keyboard navigation support on tabs (`ArrowLeft`, `ArrowRight`, `Home`, `End`), screen-reader friendly landmarks, and focus rings.
- **Performance & SEO:** OpenGraph, Twitter Cards, Schema.org JSON-LD structured data, scalable SVG favicon, and `prefers-reduced-motion` compliance.

---

## 📁 Repository Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml      # Automated GitHub Pages CI/CD workflow
├── index.html              # Semantic HTML5 document with structured data
├── style.css               # Production stylesheet (themes, responsive, print)
├── script.js               # Vanilla JS engine (RAF spotlight, LTH simulator, ARIA tabs)
├── photo.png               # Portrait photograph
├── avatar.jpg              # Companion avatar / co-pilot
└── README.md               # Technical documentation
```

---

## 🚀 Quick Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Parth-Dhola/Parth-Dhola.github.io.git
   cd Parth-Dhola.github.io
   ```

2. **Run locally:**
   Open `index.html` in any browser, or use Python's built-in HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
   Visit `http://localhost:8000`.

---

## 🚢 GitHub Pages Deployment

1. Create a repository named `Parth-Dhola.github.io` on GitHub.
2. Push all files to the `main` branch.
3. In **Repository Settings $\rightarrow$ Pages**:
   - Set **Source** to **GitHub Actions** (or Deploy from branch `main`).
4. The automated GitHub Actions workflow will build and publish your site at `https://parth-dhola.github.io/`.
