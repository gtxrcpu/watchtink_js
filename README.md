# Face Time Attendance Frontend

A modern, responsive frontend for the Facial Attendance System, built with **React**, **Vite**, and **Tailwind CSS**. Designed to integrate with a Python backend on Raspberry Pi 5.

## 🚀 Features

- **Modern Dashboard**: Mental & Physical health tracking with interactive charts.
- **Admin Command Center**: Real-time monitoring of user mental health risks, automated reporting, and live alert feeds.
- **Face Attendance**: Real-time front/back camera integration with capture support.
- **Attendance Management**: Searchable, filterable attendance logs and reporting.
- **Responsive Design**: Mobile-first approach using Tailwind CSS.
- **Performance**: Optimized with code splitting and lazy loading.
- **Real-time**: WebSocket integration ready.

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + clsx
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: Zustand
- **Routing**: React Router v6

## 📦 Installation

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

4.  **Build for Production:**
    ```bash
    npm run build
    ```
    The output will be in the `dist` folder.

5.  **Run Unit Tests:**
    ```bash
    npm run test
    ```

## 📂 Project Structure

```
src/
├── components/
│   ├── layout/       # Layout, Sidebar, Header
│   └── ui/           # Reusable UI components (Loading, Buttons)
├── hooks/            # Custom hooks (useCamera)
├── lib/              # Utilities (cn, helpers)
├── pages/            # Page components
│   ├── camera/       # Camera pages
│   ├── Dashboard.tsx
│   ├── Attendance.tsx
│   ├── MentalHealth.tsx
│   └── ...
├── services/         # API & WebSocket services
└── App.tsx           # Main Router & Lazy Loading
```

## 🔌 Integration Guide

- **WebSocket**: Configure the URL in `src/services/websocket.ts`.
- **API**: Implement Axios calls in `src/services/api.ts` (stub needed if connecting to real backend).

## 📄 License
Private Property.
