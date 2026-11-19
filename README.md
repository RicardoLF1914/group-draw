# 🎲 Group Draw

A simple web app to randomly split a list of people into balanced groups, with optional leaders — built with pure HTML, CSS, and JavaScript, no frameworks, no dependencies.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 📋 Overview

Group Draw helps you divide people into teams in a fair and quick way. It works for classroom projects, workshops, sports teams, game nights, or anything that needs a random split. You only need names: add the people, choose how many groups you want, decide how leaders are defined, and draw.

---

## ✨ Features

- Register people by name only (duplicate names are blocked)
- Configurable number of groups
- Optional maximum number of members per group
- Three leader modes:
  - **No leaders**: just splits people into groups
  - **Manual**: you pick the leaders, one per group
  - **Random**: leaders are drawn randomly
- Balanced groups: the size difference between the largest and the smallest group is at most 1 person
- Input validation with clear error messages (more groups than people, members that don't fit the limit, wrong number of leaders)
- One-click copy of the result as plain text, ready to paste into a chat
- People and settings saved automatically in the browser
- Clear list button with confirmation
- Stale results are cleared whenever the data changes
- Responsive design

---

## ⚙️ How the Draw Works

1. The input is validated (groups, member limit, leaders).
2. Leaders are defined according to the selected mode.
3. The remaining people are shuffled with the **Fisher-Yates** algorithm and dealt one by one across the groups, which keeps the groups balanced.

---

## 🔒 Privacy

Nothing is sent to any server. Names and settings are stored only in your own browser's `localStorage`, so the data is not shared between devices and may be erased when you clear your browsing data.

---

## 📁 Project Structure

```
group-draw/
├── index.html    # Page structure
├── favicon.svg   # Site icon
├── style.css     # Styles and layout
├── script.js     # Registration, draw logic, and rendering
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| **HTML5** | Semantic page structure |
| **CSS3** | Custom styling with nested selectors |
| **JavaScript** | Draw logic, DOM manipulation, and `localStorage` persistence |
| **Claude** | Development assistance |

---

## 👨‍💻 Author

**Ricardo Linhares**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ricardo-linhares-0a914a287/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RicardoLF1914)

---

<p align="center">Made by Ricardo Linhares</p>