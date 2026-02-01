import csv
import random

def generate_behavioral_data():
    print("Generating 100 stratified wallets (30 Low, 40 Medium, 30 High)...")
    
    fieldnames = [
        "wallet_id", "wallet_score", "illicit_ratio", "max_score",
        "avg_gas_paid", "gas_volatility", "gas_overpay_ratio", 
        "tx_time_entropy", "automation_score"
    ]
    
    rows = []
    
    # We will generate groups to ensure distribution
    # Risk Thresholds: Low < 20, Medium 20-35, High > 35
    
    # Group 1: Low Risk (Target < 20)
    # Strategy: Low illicit, low automation, reasonable gas
    for i in range(30):
        rows.append(generate_wallet(f"WALLET_{i:03d}", "low"))
        
    # Group 2: Medium Risk (Target 20-35)
    # Strategy: Moderate illicit OR moderate behavior
    for i in range(30, 70):
        rows.append(generate_wallet(f"WALLET_{i:03d}", "medium"))
        
    # Group 3: High Risk (Target > 35)
    # Strategy: High illicit OR high automation/gas
    for i in range(70, 100):
        rows.append(generate_wallet(f"WALLET_{i:03d}", "high"))
    
    # Shuffle to mix IDs
    random.shuffle(rows)
    
    # Save
    with open("wallet_scores.csv", "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print("Successfully generated wallet_scores.csv with 100 wallets.")
    
    # Stats
    scores = [r["wallet_score"] for r in rows]
    low = sum(1 for s in scores if s < 20)
    med = sum(1 for s in scores if 20 <= s <= 35)
    high = sum(1 for s in scores if s > 35)
    print(f"Distribution -> Low: {low}, Med: {med}, High: {high}")


def generate_wallet(wallet_id, target_risk):
    # Formulas from our logic:
    # score_illicit = illicit_ratio * 50
    # score_graph = max_score * 0.5
    # score_behavior = (automation_score * 3) + (gas_overpay_ratio * 1.5)
    # total = sum
    
    while True:
        if target_risk == "low":
            illicit = random.uniform(0, 0.1)
            max_s = random.uniform(0, 10)
            auto = random.uniform(0, 0.3)
            entropy = random.uniform(0.6, 1.0)
            gas_base = random.uniform(20, 40)
        elif target_risk == "medium":
            illicit = random.uniform(0.1, 0.35)
            max_s = random.uniform(5, 20)
            auto = random.uniform(0.2, 0.6)
            entropy = random.uniform(0.3, 0.7)
            gas_base = random.uniform(30, 60)
        else: # high
            illicit = random.uniform(0.3, 0.8) if random.random() > 0.3 else random.uniform(0, 0.2)
            max_s = random.uniform(15, 50)
            auto = random.uniform(0.6, 1.0)
            entropy = random.uniform(0.0, 0.4)
            gas_base = random.uniform(50, 150)
            
            # Boost high risk if random illicit was low (behavioral laundering)
            if illicit < 0.2:
                auto = random.uniform(0.8, 1.0)
                gas_base = random.uniform(100, 200)

        # Derived metrics
        avg_gas = round(gas_base, 2)
        gas_vol = round(random.uniform(5, 30), 2)
        gas_overpay = round(avg_gas / 30.0, 2)
        
        # Calculate Score
        score_illicit = illicit * 50.0  # Modified from previous script (was *100*0.5 which is 50)
        score_graph = max_score_val = max_s * 0.5
        score_behavior = (auto * 10) + (gas_overpay * 2.0) # Tweaked weights to hit targets
        
        total_score = score_illicit + score_graph + score_behavior
        
        # Check if fits target
        if target_risk == "low" and total_score < 20: 
            break
        if target_risk == "medium" and 20 <= total_score <= 35:
            break
        if target_risk == "high" and total_score > 35:
            break
            
        # Safety break for edge cases
        if random.random() < 0.05: # Allow slight bleed 5% of time to prevent infinite loops
             break

    return {
        "wallet_id": wallet_id,
        "wallet_score": round(total_score, 2),
        "illicit_ratio": round(illicit, 3),
        "max_score": round(max_s, 2),
        "avg_gas_paid": avg_gas,
        "gas_volatility": gas_vol,
        "gas_overpay_ratio": gas_overpay,
        "tx_time_entropy": round(entropy, 3),
        "automation_score": round(auto, 2)
    }

if __name__ == "__main__":
    generate_behavioral_data()
