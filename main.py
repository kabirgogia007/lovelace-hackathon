from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from data import get_all_wallets, get_top_wallets, get_wallet_by_id

app = FastAPI(
    title="AML Wallet Risk API",
    description="Explainable backend service for blockchain AML risk scoring",
    version="2.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon demo purposes, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# Helper functions
# --------------------

def risk_label(score: float):
    if score > 35:
        return "High Risk"
    elif score >= 20:
        return "Medium Risk"
    return "Low Risk"

def explain_wallet_logic(wallet):
    reasons = []

    # 1. Illicit Ratio
    illicit = wallet.get("illicit_ratio", 0)
    if illicit > 0.5:
        reasons.append(f"CRITICAL: {illicit*100:.1f}% of funds are from illicit sources")
    elif illicit > 0.1:
        reasons.append(f"Significant exposure to illicit transactions ({illicit*100:.1f}%)")

    # 2. Graph/Network Risk
    max_score = wallet.get("max_score", 0)
    if max_score > 15:
        reasons.append("Directly connected to high-risk criminal clusters")
    elif max_score > 8:
        reasons.append("Wallet is within 2 hops of known illicit entities")

    # 3. Behavioral - Automation
    auto_score = wallet.get("automation_score", 0)
    entropy = wallet.get("tx_time_entropy", 1.0)
    if auto_score > 0.8:
        reasons.append("High probability of automated/bot behavior (Score > 0.8)")
    elif entropy < 0.2:
        reasons.append(f"Low transaction time entropy ({entropy}) suggests programmatic execution")

    # 4. Behavioral - Gas
    overpay = wallet.get("gas_overpay_ratio", 1.0)
    if overpay > 2.0:
        reasons.append(f"Consistently overpays gas ({overpay}x avg), indicating urgency/front-running")
    
    # General High Score
    if wallet.get("wallet_score", 0) > 20 and not reasons:
        reasons.append("Aggregate risk score is high based on combined factors")

    if not reasons:
        reasons.append("Behavior appears consistent with normal human activity")

    return reasons

# --------------------
# Core endpoints
# --------------------

@app.get("/")
def root():
    return {"message": "AML Guardian backend is running"}

@app.get("/health")
def health():
    return {"status": "ok", "service": "AML Backend"}

@app.get("/wallets")
def all_wallets():
    return get_all_wallets()

@app.get("/wallets/top")
def top_wallets_endpoint(n: int = 5):
    wallets = get_top_wallets(n)
    for w in wallets:
        w["risk_level"] = risk_label(w["wallet_score"])
    return wallets

@app.get("/wallet/{wallet_id}")
def wallet_details(wallet_id: str):
    wallet = get_wallet_by_id(wallet_id)
    if wallet is None:
        raise HTTPException(status_code=404, detail="Wallet not found")

    wallet["risk_level"] = risk_label(wallet["wallet_score"])
    return wallet

@app.get("/wallet/{wallet_id}/behavior")
def wallet_behavior(wallet_id: str):
    """Returns detailed behavioral metrics separately."""
    wallet = get_wallet_by_id(wallet_id)
    if wallet is None:
        raise HTTPException(status_code=404, detail="Wallet not found")

    return {
        "wallet_id": wallet_id,
        "metrics": {
            "avg_gas_paid": wallet.get("avg_gas_paid", 0),
            "gas_volatility": wallet.get("gas_volatility", 0),
            "gas_overpay_ratio": wallet.get("gas_overpay_ratio", 0),
            "tx_time_entropy": wallet.get("tx_time_entropy", 0),
            "automation_score": wallet.get("automation_score", 0)
        },
        "analysis": explain_wallet_logic(wallet)
    }

@app.get("/wallet/{wallet_id}/explain")
def wallet_explanation(wallet_id: str):
    wallet = get_wallet_by_id(wallet_id)
    if wallet is None:
        raise HTTPException(status_code=404, detail="Wallet not found")

    return {
        "wallet_id": wallet_id,
        "risk_score": wallet["wallet_score"],
        "risk_level": risk_label(wallet["wallet_score"]),
        "reasons": explain_wallet_logic(wallet)
    }

@app.get("/summary")
def summary():
    wallets = get_all_wallets()
    total = len(wallets)
    high = sum(1 for w in wallets if w["wallet_score"] > 35)
    medium = sum(1 for w in wallets if 20 <= w["wallet_score"] <= 35)
    low = sum(1 for w in wallets if w["wallet_score"] < 20)

    return {
        "total_wallets": total,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low
    }
