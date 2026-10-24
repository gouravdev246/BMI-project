import os
import time
import threading
import datetime
import urllib.request
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from xgboost import XGBClassifier
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load XGBoost model from native JSON format
model = XGBClassifier()
model.load_model("final_expanded_xgboost_model.json")

# Load feature list
features = joblib.load("final_expanded_model_features.pkl")

# Path to built React frontend assets (if present)
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend", "dist")


# --- Automated 10-Minute Keep-Alive Background Thread ---
def keep_alive_worker():
    """
    Sends an automated HTTP request to /health every 10 minutes (600 seconds)
    to keep the application awake on hosting platforms like Render.
    """
    time.sleep(15)  # Initial delay to allow the server to start up
    port = int(os.environ.get("PORT", 5001))
    
    while True:
        try:
            # Check if Render provided its public URL, otherwise fallback to local port
            external_url = os.environ.get("RENDER_EXTERNAL_URL")
            target_url = f"{external_url}/health" if external_url else f"http://127.0.0.1:{port}/health"
            
            req = urllib.request.Request(
                target_url,
                headers={"User-Agent": "Render-KeepAlive-Heartbeat/1.0"}
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                status_code = response.getcode()
                timestamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
                print(f"[Keep-Alive] Pinged {target_url} - Status: {status_code} at {timestamp}")
        except Exception as err:
            print(f"[Keep-Alive] Warning: Self-ping attempt returned: {err}")
            
        time.sleep(600)  # Wait 10 minutes (600 seconds)

# Start keep-alive daemon thread
keep_alive_thread = threading.Thread(target=keep_alive_worker, daemon=True)
keep_alive_thread.start()


# --- API Routes ---
@app.route("/health")
def health():
    return jsonify({
        "status": "ok",
        "message": "BMI and Health Indicator Analysis API is running",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    })

@app.route("/ping")
def ping():
    return jsonify({
        "status": "alive",
        "service": "BMI and Health Indicator Analysis API",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    })

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    missing = [feature for feature in features if feature not in data]
    if missing:
        return jsonify({
            "error": f"Missing required features: {', '.join(missing)}"
        }), 400

    try:
        input_data = pd.DataFrame([{
            feature: float(data[feature])
            for feature in features
        }])

        prediction = int(model.predict(input_data)[0])
        probability = float(model.predict_proba(input_data)[0][1])

        result = (
            "Metabolic Syndrome"
            if prediction == 1
            else "No Metabolic Syndrome"
        )

        return jsonify({
            "prediction": prediction,
            "probability": round(probability, 4),
            "result": result
        })
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


# --- Frontend Static Files Serving ---
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    # Serve static assets (CSS, JS, images) from frontend/dist
    if path != "" and os.path.exists(os.path.join(FRONTEND_DIST, path)):
        return send_from_directory(FRONTEND_DIST, path)
    # Serve index.html for root or SPA client-side routes
    if os.path.exists(os.path.join(FRONTEND_DIST, "index.html")):
        return send_from_directory(FRONTEND_DIST, "index.html")
    # Fallback when running without built frontend
    return jsonify({
        "message": "BMI and Health Indicator Analysis API is running"
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=False,
        use_reloader=False
    )