# Project Prompt: BMI and Health Indicator Analysis — Full-Stack AI/ML Website

I am a B.Tech CSE (AI & Data Science) student developing my Project-Based Learning (PBL) project titled **“Body Mass Index and Health Indicator Analysis.”**

I already have a working machine learning model and a basic full-stack website. I now want to improve the frontend design, verify the integration, and make the project professional enough for my college demonstration and final presentation.

## 1. Project Objective

Build a professional, responsive healthcare research dashboard that accepts user-provided health indicators, calculates BMI and Body Roundness Index (BRI), and uses a trained XGBoost machine learning model to produce a research prediction related to metabolic syndrome.

The website must clearly state that it is an educational research prototype and is not a medical diagnosis or a replacement for professional medical advice.

## 2. Technologies Used

**Frontend**
- React
- Vite
- JavaScript and CSS

**Backend**
- Python
- Flask
- Flask-CORS

**Machine Learning**
- XGBoost classifier
- Pandas
- NumPy
- Joblib

**Dataset**
- NHANES 2021–2023-derived health data, currently built using NHANES 2021 files.
- Dataset includes demographic information, body measurements, blood pressure, glucose, and lipid indicators.
- The target label is an operational research label derived from measured metabolic-syndrome criteria.

## 3. Current Project Status

I have already completed these parts:

1. Downloaded and merged relevant NHANES data files using the participant identifier `SEQN`.
2. Created a cleaned dataset containing height, weight, BMI, waist circumference, blood pressure, blood glucose, HDL, triglycerides, total cholesterol, LDL, and BRI.
3. Created an operational target label using five measured criteria.
4. Trained and evaluated multiple machine learning models.
5. Selected an XGBoost classifier.
6. Saved the model in native JSON format because loading the serialized pickle model caused an error.
7. Created a Flask API that loads the JSON model and feature list.
8. Created a React + Vite frontend.
9. Successfully connected the frontend to the Flask backend.
10. Tested a prediction through the website.
11. Started redesigning the frontend using new files named `App_new.jsx` and `App_new.css`.

### Existing project folders

Backend:
`C:\Users\user\Desktop\python\bmi-backend`

Frontend:
`C:\Users\user\Desktop\python\bmi-health-website`

The frontend's `src` folder currently contains:
- `App.jsx`
- `App_new.jsx`
- `App_new.css`
- `index.css`
- `main.jsx`

Do not assume that the redesigned files are already active. First inspect the existing code and imports.

## 4. Machine Learning Results

The current XGBoost model was evaluated on a stratified 80:20 train-test split.

Reported test metrics:
- Accuracy: 97.42%
- Precision: 94.26%
- Recall: 97.52%
- F1-score: 95.86%
- ROC-AUC: 99.72%

These are the existing reported results. Do not fabricate or improve these metrics. Explain that they require careful interpretation because the target label is constructed from measured health criteria that overlap with some model inputs, including waist-related information represented by BRI. This may cause target leakage or circularity and can inflate performance. Recommend appropriate validation and a leakage-aware evaluation before claiming clinical predictive ability.

## 5. Features Used by the Current Model

The backend expects exactly these 11 features:

1. `Age`
2. `Sex`
3. `BMI`
4. `BRI`
5. `Systolic_BP`
6. `Diastolic_BP`
7. `BloodGlucose`
8. `HDL`
9. `Triglycerides`
10. `Total_Cholesterol`
11. `LDL`

The frontend should collect the required raw measurements, calculate BMI and BRI, and send the exact expected feature names to the backend.

BMI formula:

BMI = weight in kilograms / (height in metres)²

BRI must use the same formula already implemented in my project. Inspect the current code before changing it.

Do not change the feature names, target mapping, model-loading format, or API contract without explaining the reason and getting my approval.

## 6. Existing Backend API

The Flask endpoint is:

`http://127.0.0.1:5001/predict`

It accepts a JSON POST request containing the 11 model features and returns a prediction, probability, and result label.

The backend is started with:

```powershell
cd C:\Users\user\Desktop\python\bmi-backend
python app.py
```

The frontend is started separately with:

```powershell
cd C:\Users\user\Desktop\python\bmi-health-website
npm.cmd run dev
```

The website has previously run at `http://localhost:5173/`.

Preserve the current working backend and API integration unless a genuine bug is found.

## 7. Frontend Design Requirements

Create a modern, professional, healthcare-focused AI dashboard.

The design should include:

- A clear project title and short description.
- A clean navigation/header section.
- A responsive layout for desktop, tablet, and mobile.
- Well-organized input sections:
  - Personal Information
  - Body Measurements
  - Blood Pressure
  - Blood and Lipid Indicators
- Clearly labeled fields with appropriate units.
- BMI and BRI calculated automatically.
- Input validation and understandable error messages.
- A loading indicator while a prediction is being generated.
- A results dashboard showing:
  - BMI
  - BRI
  - Predicted research label
  - Model-estimated probability
- Attractive but readable result cards, progress indicators, and charts where they genuinely improve understanding.
- A reset/clear form option.
- A clear educational/research disclaimer.
- Accessible colors, good contrast, readable text, and responsive styling.

Do not use fake patient records, fabricated predictions, or charts that imply data was measured when it was not.

## 8. Integration and Error Handling

Verify that:

- React imports the correct active component and CSS file.
- The frontend sends a POST request to the correct Flask endpoint.
- The JSON payload uses the exact 11 feature names expected by the model.
- BMI and BRI calculations are correct and handle invalid inputs.
- Missing or invalid values are rejected with clear messages.
- The frontend handles backend errors and unavailable-server situations.
- The probability is formatted consistently as a percentage.
- The displayed prediction label matches the backend response.
- No unrelated Vite internal files are modified.
- No additional dependencies are added unless necessary.

## 9. Scientific and Ethical Limitations

The website is a research prototype, not a clinically validated diagnostic tool.

The target label is constructed from measured criteria, so using overlapping indicators to predict that label can create target leakage. The current test metrics must not be presented as proof of real-world diagnostic accuracy.

Please recommend a leakage-aware experiment, a clear explanation of the label-generation procedure, appropriate validation, and a limitation section for the project report.

Do not claim that the system diagnoses metabolic syndrome or predicts future disease unless this is independently established.

## 10. What I Need You to Do

Work with me step by step.

**Step 1:** Inspect the current React component, CSS, `main.jsx`, and `package.json`. Identify which files are active and whether the redesigned files have the correct imports.

**Step 2:** Fix the frontend file/import issue without deleting my existing working code.

**Step 3:** Complete the frontend redesign while preserving the existing Flask endpoint, BMI/BRI calculations, and 11-feature model payload.

**Step 4:** Check the frontend-backend integration and provide exact instructions for testing a prediction.

**Step 5:** Suggest useful improvements such as prediction history during the current session, model-performance visualizations based on actual evaluation results, and a project information/about section. Ask before implementing features that require changing the backend or model.

**Step 6:** Help prepare the project report, system architecture, flowchart, methodology, model-comparison table, limitations, and final presentation.

### Important instructions

- I am still learning, so explain everything in beginner-friendly language.
- Give me exact filenames and complete replacement code when needed.
- Provide one or two steps at a time instead of overwhelming me with many instructions.
- Do not assume a file exists or that a change worked; ask me to verify it.
- Do not rewrite the entire project unnecessarily.
- Do not replace my working backend with a different implementation.
- Preserve a backup before suggesting file renames or replacements.
- If you need to inspect my code, ask me to share the actual source files rather than guessing their contents.

Start by helping me resolve the current frontend file/import issue and activate the redesigned interface safely.