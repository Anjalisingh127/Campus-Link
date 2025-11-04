# 🎓 CampusConnect

> A modern platform that aggregates events, hackathons, coding challenges, and internship opportunities specifically for college students.

This project is being built from the ground up with React and Vite, with a focus on a clean user experience and, eventually, intelligent recommendations.

## 🎯 The Problem

CampusConnect aims to solve the problem of scattered event information for students:

* **Information Scattered:** Events are posted across dozens of platforms (Facebook, Discord, college emails, notice boards).
* **Missed Opportunities:** Students frequently miss relevant events, hackathons, and deadlines due to low visibility.
* **Time Wastage:** Students spend hours searching for suitable opportunities instead of applying.
* **Lack of Personalization:** Generic listings don't match individual student interests, skills, or career goals.

---

## ✨ Current Features (As of Part 7)

The project foundation is complete. The application currently supports:

* **Multi-Page Navigation:** A fully functional single-page application (SPA) using `react-router-dom` to navigate between pages without reloading.
* **Component-Based UI:** The app is built with reusable React components, including a `Header`, `Footer`, and a responsive `EventCard`.
* **Dynamic Event Lists:** Separate, routed pages for:
    * All Opportunities
    * Hackathons
    * Internships
* **Live Search Filtering:** A real-time search bar on all pages that filters events by title, organization, or description.
* **Responsive Design:** A modern CSS Grid layout that responsively arranges event cards to fit any screen size.
* **Mock Data:** The app is currently powered by a `mockData.js` file, simulating a real data source for rapid UI development.

---

## 🛠️ Tech Stack

* **Frontend:** React 18
* **Bundler:** Vite
* **Routing:** React Router DOM
* **Styling:** Plain CSS3 (with CSS Grid & Flexbox)

---

## 🚀 How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Anjalisingh127/Campus-Link.git](https://github.com/Anjalisingh127/Campus-Link.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd Campus-Link
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.
