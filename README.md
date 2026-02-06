# The Brass Console - This is UNDER CONSTRUCTION

A steampunk‑themed developer dashboard that turns your local dev environment into a brass and steam–powered control room.

Each service is a **boiler**, CPU & memory are **pressure gauges**, errors show up as **steam leaks**, and successful builds feel like **valves opening**.

---

## Features

- **Service Control**
  - Start / stop predefined dev services (“boilers”)
  - Executes real commands via a Node.js backend

- **Live Metrics**
  - CPU and memory usage visualized as animated gauges
  - Real‑time updates over WebSockets

- **Centralized Logs**
  - Boiler room log panel streaming stdout / stderr
  - Clear visual cues for errors (steam leaks)

- **Steampunk UI**
  - Brass, iron, and leather–inspired interface
  - CSS‑driven gauges, glow, and steam animations

---

## Tech Stack

- **Frontend**
  - React + Vite (TypeScript)
  - Modern, component‑based architecture
  - CSS for theming and animations

- **Backend**
  - Node.js + TypeScript
  - Express REST API
  - `ws` WebSocket server for live metrics and logs

---

## Project Structure

SteamConsole/
  README.md
  LICENSE
  package.json          # root scripts
  client/               # Vite + React frontend
    index.html
    vite.config.ts
    src/
      main.tsx
      App.tsx
      components/
        BrassLayout.tsx
        BoilerCard.tsx
        PressureGauge.tsx
        SteamLeak.tsx
        LogPanel.tsx
      styles/
        brass.css
  server/               # Node + TypeScript backend
    index.ts
    services.ts
    tsconfig.json
