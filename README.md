# 🧠 MindJournal – A Mental Health Journal & Mood Tracker

**MindJournal** is a fully responsive and modern web application built with **React.js** and **Vite**, designed to help users log their thoughts, track daily moods, and gain insights into their mental well-being.

## 🚀 Features

- **User Authentication**: Secure login and registration system using **GoogleAuth** and **Context API** for session management  
- **Dashboard Overview**: A centralized dashboard displaying recent journal entries, current mood status, and a quick mood chart  
- **Mood Tracker & Visual Insights**:
  - Log daily moods with emoji-based selection  
  - View **interactive charts** powered by **Recharts** for mood trends over time  
  - Explore detailed mood analytics on the **Insights** page  
- **Calendar View**: Navigate past journal entries and moods using an interactive **calendar component**  
- **Journal Entry Management (CRUD)**:
  - Create, edit, view, and delete personal journal entries  
  - Clean UI for daily reflections and personal notes  
- **Settings Page**:
  - Manage user preferences  
  - Toggle between **Dark and Light themes**  
- **Theme Support**: Responsive dark/light mode with Context-based toggle  
- **Navigation**: Smooth and intuitive routing with **React Router**  
- **Modern UI/UX**:
  - Built using **Tailwind CSS**  
  - Consistent styling with reusable components  
- **Clean Architecture**:
  - Modular React component structure  
  - Efficient use of **React Hooks** and **Context API** for state and theme management



## 📚 Table of Contents

- [🚀 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [💻 Installation](#-installation)
- [📖 Usage](#-usage)
- [📁 Folder Structure](#-folder-structure)
- [📸 Demo](#-demo)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

---

## 🚀 Features

- **User Authentication**: Secure login and registration system using **GoogleAuth** **Context API**
- **Dashboard Overview**: Displays journal entries, mood status, and a mood chart
- **Mood Tracker & Visual Insights**:
  - Emoji-based daily mood logging  
  - Interactive charts powered by **Recharts**
  - Mood analytics on the **Insights** page  
- **Calendar View**: Interactive calendar to browse past entries
- **Journal Entry Management**:
  - Add, edit, view, and delete personal notes  
- **Settings Page**:
  - Manage preferences  
  - Toggle **Dark/Light** themes  
- **Responsive UI/UX**:
  - Built with **Tailwind CSS**  
  - Modular structure and reusable components  
- **Routing**: Smooth navigation via **React Router**


---

## 🛠️ Tech Stack


- **Frontend**: React.js, Vite  
- **Styling**: Tailwind CSS  
- **State Management**: Context API, React Hooks  
- **Routing**: React Router  
- **Charts**: Recharts  
- **Icons**: React Icons
- **Backend**: Node.js, Express.js


## 💻 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

```bash
git clone https://github.com/your-username/MindJournal.git
cd MindJournal
npm install
npm run dev
````

Visit `http://localhost:5173` in your browser.

---

## 📖 Usage

* Log in or register to create an account.
* Use the dashboard to quickly view mood status and past entries.
* Navigate to the calendar to see or edit past logs.
* Head to the **Insights** page to visualize mood trends.
* Switch between light/dark themes from the **Settings** tab.

---

## 📁 Folder Structure

```bash
MindJournal/
├── Backend
├── public/               # Static files
├── src/
│   ├── components/       # Reusable components
│   │   ├── calendar/     # Calendar view
│   │   ├── common/       # Shared UI elements (e.g., ThemeToggle)
│   │   ├── dashboard/    # Dashboard widgets
│   │   └── ...           
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   ├── App.css, index.css
├── index.html
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 📸 Demo

> Add a working demo link and preview screenshots here

![App Preview](public/demo-screenshot.png.png)


---

## 🤝 Contributing

We welcome all kinds of contributions!

### How to Contribute

1. Fork the repository
2. Create your branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a Pull Request

Please refer to our [CONTRIBUTION.md](CONTRIBUTION.md) for detailed guidelines.


---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
You’re free to use, modify, and share under the license terms.

---

## 🙏 Acknowledgments

* Inspired by mental wellness tools like Daylio, Moodpath, and Reflectly
* Built using open-source tools and love 💖
* Thanks to the developer community!

<p align="center">
  <a href="#top" style="font-size: 18px; padding: 8px 16px; display: inline-block; border: 1px solid #ccc; border-radius: 6px; text-decoration: none;">
    ⬆️ Back to Top
  </a>
</p>


---
