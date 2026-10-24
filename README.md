# Body Mass Index (BMI) and Health Indicator Analysis
**Full-Stack AI/ML Healthcare Research Dashboard**  
*Project-Based Learning (PBL) — B.Tech CSE (AI & Data Science)*

---

## 📌 Project Overview
This project is an educational, interactive healthcare research dashboard that analyzes anthropometric and cardiometabolic health indicators, calculates **Body Mass Index (BMI)** and **Body Roundness Index (BRI)**, and uses a pre-trained **XGBoost machine learning classifier** (derived from the **CDC NHANES 2021–2023** examination dataset) to generate a research prediction regarding metabolic syndrome.

---

## 🏗️ Architecture & Technologies

- **Frontend:** React 19, Vite, Vanilla CSS with custom clinical glassmorphism design tokens, Google Fonts (*Plus Jakarta Sans* & *JetBrains Mono*).
- **Backend:** Python, Flask, Flask-CORS, Pandas, Scikit-learn, Joblib.
- **Machine Learning:** XGBoost Classifier (200 parallel estimators, native JSON format `final_expanded_xgboost_model.json`).
- **Clinical Model Features (11 total):**
  1. `Age` (Years)
  2. `Sex` (1: Male, 2: Female per NHANES)
  3. `BMI` ($weight / [height]^2$)
  4. `BRI` ($364.2 - 365.5 \times \sqrt{1 - [waist / (\pi \times height)]^2}$)
  5. `Systolic_BP` (mmHg)
  6. `Diastolic_BP` (mmHg)
  7. `BloodGlucose` (mg/dL)
  8. `HDL` (mg/dL)
  9. `Triglycerides` (mg/dL)
  10. `Total_Cholesterol` (mg/dL)
  11. `LDL` (mg/dL)

---

## 🚀 How to Run the Project

### 1. Start the Flask Backend (Port 5001)

Open a terminal in the root directory:
```powershell
# Activate virtual environment
.venv\Scripts\activate

# Or install dependencies if setting up on a new machine:
# pip install -r requirements.txt

# Run the Flask API
python app.py
```
*API will run at `http://127.0.0.1:5001/` with endpoints `/health` and `/predict`.*

### 2. Start the React Frontend (Port 5173)

Open a second terminal:
```powershell
cd frontend
npm run dev
```
*Open your browser and navigate to `http://localhost:5173/`.*

---

## 🧪 Automated Testing

To test the backend endpoints and ML model inference automatically:
```powershell
.venv\Scripts\python test_backend.py
```

---

## ⚠️ Academic Disclaimer & Target Leakage Notice
This application is an educational research prototype and is **not intended for medical diagnosis**. The model was evaluated on an 80:20 stratified split (reported 97.42% accuracy, 99.72% ROC-AUC). Because the operational metabolic syndrome label in NHANES was derived from five measured clinical criteria (waist, BP, glucose, triglycerides, HDL) that overlap with the model's feature set, careful interpretation regarding measurement circularity/target leakage is advised.
