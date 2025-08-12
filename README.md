# 🛝 Playground Accessibility – Hamburg

An AI-powered map that shows **accessible playgrounds** in Hamburg, Germany.  
Uses **OpenStreetMap data + zero-shot classification** to detect features like wheelchair access, sensory friendliness, and soft surfaces.

Frontend: **React + Vite + Leaflet**  
Backend: **FastAPI + Hugging Face Inference API + smolagents**  

---

## ✨ Features
- Interactive map centered on Hamburg.
- Fetches playground locations from **Overpass API (OSM)**.
- Runs AI zero-shot classification to tag accessibility features.
- Supports **wheelchair access**, **sensory friendly design**, **soft surface**, **ground-level equipment**.
- Ready for deployment to:
  - **GitHub Pages** (frontend)
  - **Hugging Face Spaces** (backend)

---

## 🗂 Project Structure
playground-accessibility-hh/
│
├── backend/ # FastAPI app.py & Dockerfile for Hugging Face Space
├── src/ # React + TypeScript frontend
├── public/ # Static assets
├── vite.config.ts # Vite config
├── package.json
├── README.md
└── .env # API URL for dev

## Roadmap
Add filtering UI for accessibility tags.

Support more cities in Germany.

Image classification for playground equipment.


```
