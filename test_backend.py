import json
from app import app

def test_api():
    client = app.test_client()

    # 1. Test root endpoint
    res_root = client.get("/")
    assert res_root.status_code == 200, f"Root failed: {res_root.status_code}"
    root_data = res_root.get_json()
    assert "message" in root_data
    print("PASS: GET / returns 200 OK")

    # 2. Test health endpoint
    res_health = client.get("/health")
    assert res_health.status_code == 200, f"Health failed: {res_health.status_code}"
    health_data = res_health.get_json()
    assert health_data.get("status") == "ok"
    print("PASS: GET /health returns 200 OK")

    # 3. Test missing body
    res_empty = client.post("/predict", data="", content_type="application/json")
    assert res_empty.status_code == 400
    print("PASS: POST /predict with empty body returns 400 Bad Request")

    # 4. Test missing feature
    res_incomplete = client.post(
        "/predict",
        data=json.dumps({"Age": 45}),
        content_type="application/json"
    )
    assert res_incomplete.status_code == 400
    print("PASS: POST /predict with missing features returns 400 Bad Request")

    # 5. Test high risk sample (metabolic syndrome)
    high_risk_payload = {
        "Age": 55.0,
        "Sex": 1.0,
        "BMI": 33.5,
        "BRI": 5.8,
        "Systolic_BP": 145.0,
        "Diastolic_BP": 92.0,
        "BloodGlucose": 125.0,
        "HDL": 38.0,
        "Triglycerides": 210.0,
        "Total_Cholesterol": 240.0,
        "LDL": 160.0
    }
    res_high = client.post(
        "/predict",
        data=json.dumps(high_risk_payload),
        content_type="application/json"
    )
    assert res_high.status_code == 200
    high_data = res_high.get_json()
    assert high_data["prediction"] == 1
    assert high_data["result"] == "Metabolic Syndrome"
    assert 0.0 <= high_data["probability"] <= 1.0
    print(f"PASS: High-risk prediction returns {high_data['result']} with prob={high_data['probability']}")

    # 6. Test low risk sample (healthy)
    low_risk_payload = {
        "Age": 24.0,
        "Sex": 2.0,
        "BMI": 21.5,
        "BRI": 3.2,
        "Systolic_BP": 110.0,
        "Diastolic_BP": 70.0,
        "BloodGlucose": 85.0,
        "HDL": 65.0,
        "Triglycerides": 80.0,
        "Total_Cholesterol": 160.0,
        "LDL": 80.0
    }
    res_low = client.post(
        "/predict",
        data=json.dumps(low_risk_payload),
        content_type="application/json"
    )
    assert res_low.status_code == 200
    low_data = res_low.get_json()
    assert low_data["prediction"] == 0
    assert low_data["result"] == "No Metabolic Syndrome"
    assert 0.0 <= low_data["probability"] <= 1.0
    print(f"PASS: Low-risk prediction returns {low_data['result']} with prob={low_data['probability']}")

    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_api()
