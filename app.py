from flask import Flask, request, jsonify
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

@app.route("/")
def home():
    return jsonify({
        "message": "BMI and Health Indicator Analysis API is running"
    })
@app.route("/health")
def health():
    return jsonify({
        "status": "ok",
        "message": "BMI and Health Indicator Analysis API is running"
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


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5001,
        debug=False,
        use_reloader=False
    )