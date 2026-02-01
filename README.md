# 🛡️ AML Guardian - Behavioral Forensics Platform

A hackathon-ready, explainable AI system for detecting blockchain money laundering using behavioral heuristics and graph risk scoring.

## 🚀 Features
- **Behavioral Analysis**: Detects automation (bots), urgency (gas overpaying), and timing patterns.
- **Explainable AI**: Deterministic, human-readable reasons for every risk score.
- **Real-time Scoring**: Weighted model combining Graph Risk + Illicit Exposure + User Behavior.
- **Premium Dashboard**: React-based dark mode UI for analysts.

## 📂 Folder Structure
```
/
├── main.py              # FastAPI Backend Entrypoint
├── data.py              # Data Loading Logic (No Pandas dependency)
├── generate_data.py     # Script to simulate behavioral data
├── wallet_scores.csv    # The database (upgraded schema)
├── README.md            # You are here
└── frontend/            # React + Vite Frontend Application
    ├── src/
    │   ├── App.jsx      # Main Dashboard Component
    │   └── index.css    # Premium Styling
    └── package.json
```

## 🛠️ Setup & Run

### Prerequisites
- Python 3.8+
- Node.js & npm (for Frontend)

### 1. Data Processing (Optional)
The system comes with `wallet_scores.csv` pre-loaded. To regenerate simulation data:
```bash
python generate_data.py
```

### 2. Start Backend (FastAPI)
Run the backend server on port 8000:
```bash
uvicorn main:app --reload --port 8000
```
*API Docs available at: http://localhost:8000/docs*

### 3. Start Frontend (React)
Open a new terminal:
```bash
cd frontend
npm install  # (If not already installed)
npm run dev
```
*Access Dashboard at: http://localhost:5173* (or URL shown in terminal)

## 🧪 Demo Instructions
1. Open the Frontend.
2. You will see a list of **Top Risky Wallets** on the dashboard.
3. Click any row (e.g., `WALLET_12`) or search for an ID.
4. Observe the **Risk Score**, **Badge**, and **Forensic Analysis** panel.
5. Notes:
   - **High Entropy** (>0.8) = Likely Human.
   - **Low Entropy** (<0.3) = Suspected Bot.
   - **Gas Overpay** (>2.0x) = Potentially Front-running/Urgent laundering.
