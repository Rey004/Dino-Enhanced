<div align="center">

<img src="assets/brand/logo-dark.webp" alt="DinoDash Logo" width="120" height="120" style="border-radius:24px;" />

# DinoDash

**An advanced, modern reimagining of the classic Chrome Dino offline game — right in your new tab.**

[![Version](https://img.shields.io/badge/version-1.0-crimson?style=flat-square&logo=google-chrome)](manifest.json)
[![Manifest](https://img.shields.io/badge/Manifest-v3-blue?style=flat-square)](manifest.json)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](#)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-yellow?style=flat-square&logo=googlechrome)](https://developer.chrome.com/docs/extensions/)

</div>

---

## What is DinoDash?

**DinoDash** is a Chrome browser extension that completely transforms your **new tab page** into a premium, feature-rich experience. It replaces the default blank new tab with a beautifully themed environment where you can play an **enhanced version of the classic Chrome Dino game**, track your scores, manage widgets, and personalize everything — all from a sleek popup interface.

Whether you're waiting for a page to load or just opening a new tab, DinoDash turns that moment into something fun and beautiful.

---

## Features

### 🎮 Enhanced Dino Game
- A fully re-engineered version of the classic Chrome offline dinosaur runner
- Smooth physics engine with jump mechanics
- Procedurally generated obstacles and environment
- Particle effects system for visual flair
- Real-time score display with **high-score persistence**

### 🎨 Multi-Theme Support
Choose from handcrafted themes that transform the entire look & feel:

| Theme | Description |
|-------|-------------|
| 🌑 **Dark Valley** | Deep crimson-dark aesthetic with red glows |
| 🌿 **Mystic Forest** | Lush green tones with an earthy, calm atmosphere |

Themes are applied instantly across both the new tab and the popup — no reload needed.

### 🧩 Customizable Widgets
Toggle independent widgets on or off directly from the popup or the new tab settings:

- **Today's Run** — Daily checkpoint quests shown in the top-right corner
- **Statistics** — In-page stats panel with detailed performance data
- **Enhanced Mode Toggle** — Quick shortcut to enable/disable the enhanced experience

### 📊 Game Statistics
Track your full play history:
- 🏆 All-time High Score
- 🎯 Last Score
- 🎮 Games Played
- 📏 Average Score
- 🌍 Total Distance Traveled
- ⏱️ Total Play Time

### ⚙️ Extension Popup Settings
Click the DinoDash icon in your toolbar to quickly access:
- **Enhanced Mode** toggle — turn the experience on/off with one click
- **Theme Selector** — switch themes without opening the new tab
- **Particle Effects** toggle
- **Sound** toggle
- **FPS Counter** toggle
- **Hi-Score badge** — see your best score at a glance
- **Open New Tab** button — launch DinoDash instantly

### 🔊 Audio System
Immersive sound effects that react to gameplay events. Can be enabled or disabled at any time.

### 🔍 Integrated Search Bar
The new tab also includes a **built-in search bar** so you never lose quick access to the web while enjoying the experience.

---

## 🚀 Installation Guide

> DinoDash is a **developer/unpacked extension**. Follow the steps below to install it in Chrome.

### Step 1 — Download the Extension

Clone or download this repository to your local machine:

```bash
git clone https://github.com/your-username/dino-enhanced.git
```

Or download the ZIP and extract it to a folder of your choice.

### Step 2 — Open Chrome Extensions

Open Google Chrome and navigate to:

```
chrome://extensions
```

Or go to **Menu (⋮)** → **Extensions** → **Manage Extensions**.

### Step 3 — Enable Developer Mode

In the top-right corner of the Extensions page, toggle **Developer mode** ON.

### Step 4 — Load the Extension

Click the **"Load unpacked"** button that appears, then select the root folder of this project (the folder containing `manifest.json`).

### Step 5 — Open a New Tab

Open a new tab in Chrome (`Ctrl+T` / `Cmd+T`). DinoDash will replace your default new tab page. 🎉

---

## 🎮 How to Play

| Action | Control |
|--------|---------|
| **Jump** | `Space` or `↑` Arrow Key |
| **Start / Restart** | `Space` |
| **Crouch** | `↓` Arrow Key |

- Press `Space` on the menu screen to start the game
- Avoid cacti and other obstacles
- The game speeds up over time — how far can you go?
- Your **high score is saved automatically** across sessions

---

## ⚙️ Using the Popup

Click the **DinoDash icon** in the Chrome toolbar to open the popup panel:

1. **Enhanced Mode** — Master switch to enable/disable the custom new tab. When off, Chrome's default new tab is shown.
2. **Theme** — Pick your preferred visual theme. Changes apply live.
3. **Particles** — Toggle the particle effects during gameplay.
4. **Sound** — Mute or unmute game audio.
5. **Show FPS** — Display a real-time FPS counter on the new tab.
6. **Hi Score** — Your current all-time best score, always visible.
7. **Open New Tab** — Jump straight to the DinoDash experience.

> Settings sync in real-time between the popup and the open new tab page — no refresh needed.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Extension API | Chrome Manifest v3 |
| UI | Vanilla HTML, CSS, JavaScript (ES Modules) |
| Rendering | HTML5 Canvas |
| Storage | `chrome.storage.local` |
| Fonts | Google Fonts (Inter, Google Sans) |
| Permissions | `storage`, `tabs` |

---

## 🤝 Contributing

Pull requests and suggestions are welcome! If you'd like to add a new theme, widget, or feature:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by Revanshu

*Keep running. Never stop.*

</div>
