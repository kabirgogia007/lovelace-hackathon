import csv

# Cache for loaded data
_WALLET_DATA = []

def load_data():
    """Loads wallet scores from CSV into a list of dicts."""
    global _WALLET_DATA
    wallet_scores = []
    try:
        with open("wallet_scores.csv", "r", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Convert numeric fields
                # We need to handle potential missing values or strings safely
                try:
                    row["wallet_score"] = float(row.get("wallet_score", 0))
                    row["illicit_ratio"] = float(row.get("illicit_ratio", 0))
                    row["max_score"] = float(row.get("max_score", 0))
                    
                    # New behavioral fields might not exist if CSV isn't upgraded yet, 
                    # but we expect it to be. Handle gracefully.
                    if "avg_gas_paid" in row:
                        row["avg_gas_paid"] = float(row["avg_gas_paid"])
                        row["gas_volatility"] = float(row["gas_volatility"])
                        row["gas_overpay_ratio"] = float(row["gas_overpay_ratio"])
                        row["tx_time_entropy"] = float(row["tx_time_entropy"])
                        row["automation_score"] = float(row["automation_score"])
                except ValueError:
                    pass # Keep as string or 0 if conversion fails
                
                wallet_scores.append(row)
    except FileNotFoundError:
        print("Error: wallet_scores.csv not found.")
        return []
    
    _WALLET_DATA = wallet_scores
    return _WALLET_DATA

def get_all_wallets():
    if not _WALLET_DATA:
        load_data()
    return _WALLET_DATA

def get_top_wallets(n=5):
    data = get_all_wallets()
    # Sort by wallet_score descending
    sorted_data = sorted(data, key=lambda x: x.get("wallet_score", 0), reverse=True)
    return sorted_data[:n]

def get_wallet_by_id(wallet_id: str):
    data = get_all_wallets()
    for w in data:
        if w["wallet_id"] == wallet_id:
            return w
    return None
