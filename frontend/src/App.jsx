import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import WelcomePage from './components/WelcomePage';
import {
  RiskPieChart,
  BiomarkerBarChart,
  FeatureImportanceChart,
  SessionTrendChart
} from './components/Charts';
import {
  Activity,
  HeartPulse,
  Brain,
  BarChart3,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  TrendingUp,
  FlaskConical,
  Layers,
  ArrowRight
} from 'lucide-react';

// Preset demonstration profiles for presentation and evaluation
const PRESET_PROFILES = [
  {
    name: 'Healthy Baseline',
    desc: 'Normal BMI, healthy BP, optimal lipids',
    data: {
      age: 26,
      sex: 2, // Female
      height: 165,
      weight: 58,
      waist: 72,
      systolic_bp: 114,
      diastolic_bp: 72,
      glucose: 88,
      hdl: 62,
      triglycerides: 85,
      total_cholesterol: 165,
      ldl: 86
    }
  },
  {
    name: 'Metabolic Risk Profile',
    desc: 'High waist/BRI, elevated glucose, high triglycerides, low HDL, hypertension',
    data: {
      age: 56,
      sex: 1, // Male
      height: 175,
      weight: 98,
      waist: 104,
      systolic_bp: 144,
      diastolic_bp: 92,
      glucose: 126,
      hdl: 36,
      triglycerides: 215,
      total_cholesterol: 238,
      ldl: 159
    }
  },
  {
    name: 'Borderline Profile',
    desc: 'Pre-hypertensive, intermediate lipid & BRI levels',
    data: {
      age: 44,
      sex: 1, // Male
      height: 172,
      weight: 81,
      waist: 91,
      systolic_bp: 128,
      diastolic_bp: 83,
      glucose: 104,
      hdl: 44,
      triglycerides: 152,
      total_cholesterol: 205,
      ldl: 130
    }
  }
];

const INITIAL_FORM = {
  age: 35,
  sex: 1, // 1: Male, 2: Female
  height: 172, // cm
  weight: 75, // kg
  waist: 86, // cm
  systolic_bp: 122,
  diastolic_bp: 80,
  glucose: 98,
  hdl: 48,
  triglycerides: 135,
  total_cholesterol: 195,
  ldl: 120
};

// Dynamic API Base URL: Uses http://127.0.0.1:5001 in local Vite dev on 5173, and relative '' in production/Docker on Render
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL !== undefined
    ? import.meta.env.VITE_API_BASE_URL
    : typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
      window.location.port !== '5001'
    ? 'http://127.0.0.1:5001'
    : '';

export default function App() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [errorMessage, setErrorMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('welcome'); // 'welcome' | 'dashboard' | 'analytics' | 'methodology' | 'leakage'

  // Calculate BMI: weight (kg) / (height (m))^2
  const bmi = useMemo(() => {
    const hMeters = Number(formData.height) / 100;
    const wKg = Number(formData.weight);
    if (!hMeters || hMeters <= 0 || !wKg || wKg <= 0) return 0;
    return Number((wKg / (hMeters * hMeters)).toFixed(2));
  }, [formData.height, formData.weight]);

  // Calculate BRI (Thomas et al., 2013)
  // BRI = 364.2 - 365.5 * sqrt(1 - ( (waist / (2 * pi)) / (0.5 * height) )^2 )
  // Simplified: 364.2 - 365.5 * sqrt(1 - (waist / (pi * height))^2 )
  const bri = useMemo(() => {
    const h = Number(formData.height);
    const w = Number(formData.waist);
    if (!h || h <= 0 || !w || w <= 0) return 0;
    const ratio = w / (Math.PI * h);
    const eccentricitySquared = ratio * ratio;
    if (eccentricitySquared >= 1) return 0; // Prevent invalid square root of negative
    const val = 364.2 - 365.5 * Math.sqrt(1 - eccentricitySquared);
    return Number(Math.max(0, val).toFixed(2));
  }, [formData.height, formData.waist]);

  // Periodic health check against Backend API
  useEffect(() => {
    let isMounted = true;
    const checkBackend = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok && isMounted) {
          setBackendStatus('online');
        } else if (isMounted) {
          setBackendStatus('offline');
        }
      } catch (err) {
        if (isMounted) {
          setBackendStatus('offline');
        }
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Automated 10-Minute Keep-Alive Heartbeat to prevent Render free instance sleep
  useEffect(() => {
    const keepAliveTimer = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/ping`);
        if (res.ok) {
          console.log('[Keep-Alive] 10-minute automated client heartbeat sent successfully.');
        }
      } catch (e) {
        console.warn('[Keep-Alive] Heartbeat check:', e);
      }
    }, 600000); // 10 minutes (600,000 ms)

    return () => clearInterval(keepAliveTimer);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: Number(value)
    }));
    setErrorMessage('');
  };

  const handleLoadPreset = (preset) => {
    setFormData(preset.data);
    setPredictionResult(null);
    setErrorMessage('');
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setPredictionResult(null);
    setErrorMessage('');
  };

  // Submit to Flask API
  const handlePredict = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Input validation
    if (formData.height < 100 || formData.height > 250) {
      setErrorMessage('Height must be between 100 cm and 250 cm.');
      return;
    }
    if (formData.weight < 25 || formData.weight > 300) {
      setErrorMessage('Weight must be between 25 kg and 300 kg.');
      return;
    }
    if (formData.waist < 40 || formData.waist > 220) {
      setErrorMessage('Waist circumference must be between 40 cm and 220 cm.');
      return;
    }
    if (formData.age < 18 || formData.age > 100) {
      setErrorMessage('Age must be between 18 and 100 years.');
      return;
    }

    setLoading(true);

    // Exact 11 features matching the model specification:
    // ['Age', 'Sex', 'BMI', 'BRI', 'Systolic_BP', 'Diastolic_BP', 'BloodGlucose', 'HDL', 'Triglycerides', 'Total_Cholesterol', 'LDL']
    const payload = {
      Age: Number(formData.age),
      Sex: Number(formData.sex),
      BMI: Number(bmi),
      BRI: Number(bri),
      Systolic_BP: Number(formData.systolic_bp),
      Diastolic_BP: Number(formData.diastolic_bp),
      BloodGlucose: Number(formData.glucose),
      HDL: Number(formData.hdl),
      Triglycerides: Number(formData.triglycerides),
      Total_Cholesterol: Number(formData.total_cholesterol),
      LDL: Number(formData.ldl)
    };

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setPredictionResult(data);
      setBackendStatus('online');

      // Add to session history
      setHistory(prev => [
        {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          bmi,
          bri,
          result: data.result,
          prediction: data.prediction,
          probability: (data.probability * 100).toFixed(1)
        },
        ...prev.slice(0, 9) // keep last 10
      ]);
    } catch (err) {
      setErrorMessage(
        err.message.includes('Failed to fetch')
          ? 'Cannot connect to Flask backend at http://127.0.0.1:5001. Please make sure "python app.py" is running.'
          : `Prediction error: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // BMI Category Helper
  const getBmiCategory = (val) => {
    if (val < 18.5) return { label: 'Underweight', color: 'warn' };
    if (val < 25.0) return { label: 'Normal Weight', color: 'safe' };
    if (val < 30.0) return { label: 'Overweight', color: 'warn' };
    return { label: 'Obese (Class I+)', color: 'danger' };
  };

  // BP Category Helper
  const getBpCategory = (sys, dia) => {
    if (sys < 120 && dia < 80) return { label: 'Normal BP', color: 'safe' };
    if (sys <= 129 && dia < 80) return { label: 'Elevated BP', color: 'warn' };
    if (sys <= 139 || dia <= 89) return { label: 'Hypertension Stage 1', color: 'warn' };
    return { label: 'Hypertension Stage 2', color: 'danger' };
  };

  const bmiCategory = getBmiCategory(bmi);
  const bpCategory = getBpCategory(formData.systolic_bp, formData.diastolic_bp);

  // 5 Clinical Criteria for Metabolic Syndrome Diagnosis
  const criteriaList = useMemo(() => {
    const isMale = Number(formData.sex) === 1;
    return [
      {
        name: 'Abdominal Adiposity (Waist)',
        value: `${formData.waist} cm`,
        threshold: isMale ? '≥ 102 cm (Male)' : '≥ 88 cm (Female)',
        met: isMale ? Number(formData.waist) >= 102 : Number(formData.waist) >= 88
      },
      {
        name: 'Elevated Triglycerides',
        value: `${formData.triglycerides} mg/dL`,
        threshold: '≥ 150 mg/dL',
        met: Number(formData.triglycerides) >= 150
      },
      {
        name: 'Reduced HDL Cholesterol',
        value: `${formData.hdl} mg/dL`,
        threshold: isMale ? '< 40 mg/dL (Male)' : '< 50 mg/dL (Female)',
        met: isMale ? Number(formData.hdl) < 40 : Number(formData.hdl) < 50
      },
      {
        name: 'Elevated Blood Pressure',
        value: `${formData.systolic_bp}/${formData.diastolic_bp} mmHg`,
        threshold: '≥ 130 / 85 mmHg',
        met: Number(formData.systolic_bp) >= 130 || Number(formData.diastolic_bp) >= 85
      },
      {
        name: 'Elevated Fasting Glucose',
        value: `${formData.glucose} mg/dL`,
        threshold: '≥ 100 mg/dL',
        met: Number(formData.glucose) >= 100
      }
    ];
  }, [formData]);

  return (
    <div className="dashboard-container">
      {/* Top Header */}
      <header className="main-header">
        <div
          className="header-brand"
          onClick={() => setActiveTab('welcome')}
          style={{ cursor: 'pointer' }}
          title="Return to Welcome Overview"
        >
          <div className="brand-icon">
            <HeartPulse className="brand-logo-svg text-primary-light" />
          </div>
          <div>
            <h1 className="project-title">Metabolic Risk Intelligence</h1>
            {/* <p className="project-tagline">
              B.Tech PBL Research Platform • NHANES 2021–2023 Cohort • XGBoost Classifier
            </p> */}
          </div>
        </div>

        <div className="header-actions">
          <nav className="tab-nav">
            <button
              className={`tab-btn ${activeTab === 'welcome' ? 'active' : ''}`}
              onClick={() => setActiveTab('welcome')}
            >
              <Sparkles className="tab-icon" />
              <span>Overview</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <Stethoscope className="tab-icon" />
              <span>Clinical Predictor</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 className="tab-icon" />
              <span>Visual Analytics</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'methodology' ? 'active' : ''}`}
              onClick={() => setActiveTab('methodology')}
            >
              <Brain className="tab-icon" />
              <span>Model & Metrics</span>
            </button>
            {/* <button
              className={`tab-btn ${activeTab === 'leakage' ? 'active' : ''}`}
              onClick={() => setActiveTab('leakage')}
            >
              <AlertTriangle className="tab-icon" />
              <span>Limitations</span>
            </button> */}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="content-layout">
        {/* Tab 0: Welcome / Landing Page */}
        {activeTab === 'welcome' && (
          <WelcomePage
            onNavigate={setActiveTab}
            onSelectPreset={(data) => setFormData(data)}
            presets={PRESET_PROFILES}
          />
        )}

        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            {/* Left Column: Form & Presets */}
            <div className="form-column">
              {/* Presets Bar */}
              <div className="preset-card">
                <span className="preset-title">⚡ Quick Demonstration Profiles:</span>
                <div className="preset-buttons">
                  {PRESET_PROFILES.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="preset-btn"
                      onClick={() => handleLoadPreset(p)}
                      title={p.desc}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handlePredict} className="indicator-form">
                {/* 1. Demographics */}
                <div className="form-section">
                  <div className="section-header">
                    <span className="section-badge">1</span>
                    <h3>Demographics</h3>
                  </div>

                  <div className="inputs-grid-2">
                    <div className="input-group">
                      <label htmlFor="input-age">Age (Years)</label>
                      <input
                        id="input-age"
                        type="number"
                        min="18"
                        max="100"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        required
                      />
                      <span className="input-helper">Range: 18 - 85 years</span>
                    </div>

                    <div className="input-group">
                      <label>Biological Sex</label>
                      <div className="sex-toggle">
                        <button
                          type="button"
                          className={`sex-btn ${formData.sex === 1 ? 'active' : ''}`}
                          onClick={() => handleInputChange('sex', 1)}
                        >
                          👨 Male (1)
                        </button>
                        <button
                          type="button"
                          className={`sex-btn ${formData.sex === 2 ? 'active' : ''}`}
                          onClick={() => handleInputChange('sex', 2)}
                        >
                          👩 Female (2)
                        </button>
                      </div>
                      <span className="input-helper">Encoded per NHANES RIAGENDR</span>
                    </div>
                  </div>
                </div>

                {/* 2. Anthropometric Measurements */}
                <div className="form-section">
                  <div className="section-header">
                    <span className="section-badge">2</span>
                    <h3>Body Measurements & Derived Indices</h3>
                  </div>

                  <div className="inputs-grid-3">
                    <div className="input-group">
                      <label htmlFor="input-height">Height (cm)</label>
                      <input
                        id="input-height"
                        type="number"
                        min="100"
                        max="240"
                        step="0.5"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        required
                      />
                      <span className="input-helper">e.g. 172 cm</span>
                    </div>

                    <div className="input-group">
                      <label htmlFor="input-weight">Weight (kg)</label>
                      <input
                        id="input-weight"
                        type="number"
                        min="30"
                        max="250"
                        step="0.5"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        required
                      />
                      <span className="input-helper">e.g. 75 kg</span>
                    </div>

                    <div className="input-group">
                      <label htmlFor="input-waist">Waist (cm)</label>
                      <input
                        id="input-waist"
                        type="number"
                        min="40"
                        max="200"
                        step="0.5"
                        value={formData.waist}
                        onChange={(e) => handleInputChange('waist', e.target.value)}
                        required
                      />
                      <span className="input-helper">At iliac crest level</span>
                    </div>
                  </div>

                  {/* Dynamic Calculation preview cards */}
                  <div className="derived-indices-row">
                    <div className="derived-card">
                      <div className="derived-title">Calculated BMI</div>
                      <div className="derived-value">{bmi} <span className="unit">kg/m²</span></div>
                      <span className={`pill-badge badge-${bmiCategory.color}`}>
                        {bmiCategory.label}
                      </span>
                    </div>

                    <div className="derived-card">
                      <div className="derived-title">Body Roundness Index (BRI)</div>
                      <div className="derived-value">{bri}</div>
                      <span className="pill-badge badge-info">
                        Thomas et al. Formula
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Blood Pressure */}
                <div className="form-section">
                  <div className="section-header">
                    <span className="section-badge">3</span>
                    <h3>Blood Pressure (Hemodynamics)</h3>
                  </div>

                  <div className="inputs-grid-2">
                    <div className="input-group">
                      <label htmlFor="input-sys">Systolic BP (mmHg)</label>
                      <input
                        id="input-sys"
                        type="number"
                        min="70"
                        max="220"
                        value={formData.systolic_bp}
                        onChange={(e) => handleInputChange('systolic_bp', e.target.value)}
                        required
                      />
                      <span className="input-helper">Upper reading (optimal &lt; 120)</span>
                    </div>

                    <div className="input-group">
                      <label htmlFor="input-dia">Diastolic BP (mmHg)</label>
                      <input
                        id="input-dia"
                        type="number"
                        min="40"
                        max="140"
                        value={formData.diastolic_bp}
                        onChange={(e) => handleInputChange('diastolic_bp', e.target.value)}
                        required
                      />
                      <span className="input-helper">Lower reading (optimal &lt; 80)</span>
                    </div>
                  </div>

                  <div className="status-note">
                    Current Classification: <strong className={`text-${bpCategory.color}`}>{bpCategory.label}</strong>
                  </div>
                </div>

                {/* 4. Blood Glucose & Lipid Indicators */}
                <div className="form-section">
                  <div className="section-header">
                    <span className="section-badge">4</span>
                    <h3>Blood Glucose & Lipid Panel (mg/dL)</h3>
                  </div>

                  <div className="inputs-grid-3">
                    <div className="input-group">
                      <label htmlFor="input-glucose">Fasting Glucose</label>
                      <input
                        id="input-glucose"
                        type="number"
                        min="50"
                        max="350"
                        value={formData.glucose}
                        onChange={(e) => handleInputChange('glucose', e.target.value)}
                        required
                      />
                      <span className="input-helper">Criteria: &ge; 100 mg/dL</span>
                    </div>

                    <div className="input-group">
                      <label htmlFor="input-hdl">HDL Cholesterol</label>
                      <input
                        id="input-hdl"
                        type="number"
                        min="15"
                        max="130"
                        value={formData.hdl}
                        onChange={(e) => handleInputChange('hdl', e.target.value)}
                        required
                      />
                      <span className="input-helper">Protective: &ge; 40(M) / 50(F)</span>
                    </div>

                    <div className="input-group">
                      <label htmlFor="input-trig">Triglycerides</label>
                      <input
                        id="input-trig"
                        type="number"
                        min="30"
                        max="600"
                        value={formData.triglycerides}
                        onChange={(e) => handleInputChange('triglycerides', e.target.value)}
                        required
                      />
                      <span className="input-helper">Criteria: &ge; 150 mg/dL</span>
                    </div>
                  </div>

                  <div className="inputs-grid-2" style={{ marginTop: '1rem' }}>
                    <div className="input-group">
                      <label htmlFor="input-total-chol">Total Cholesterol</label>
                      <input
                        id="input-total-chol"
                        type="number"
                        min="80"
                        max="450"
                        value={formData.total_cholesterol}
                        onChange={(e) => handleInputChange('total_cholesterol', e.target.value)}
                        required
                      />
                      <span className="input-helper">Desirable: &lt; 200 mg/dL</span>
                    </div>

                    <div className="input-group">
                      <label htmlFor="input-ldl">LDL Cholesterol</label>
                      <input
                        id="input-ldl"
                        type="number"
                        min="30"
                        max="300"
                        value={formData.ldl}
                        onChange={(e) => handleInputChange('ldl', e.target.value)}
                        required
                      />
                      <span className="input-helper">Optimal: &lt; 100 mg/dL</span>
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="error-banner">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="submit"
                    className="shadcn-btn shadcn-btn-primary shadcn-btn-lg submit-btn"
                    disabled={loading || backendStatus === 'offline'}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        <span>Evaluating Model...</span>
                      </>
                    ) : (
                      <>
                        <Stethoscope className="icon-sm" />
                        <span>Generate ML Research Prediction</span>
                        <ArrowRight className="icon-sm" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="shadcn-btn shadcn-btn-outline reset-btn"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    <RotateCcw className="icon-sm" />
                    <span>Reset Form</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Prediction Output & History */}
            <div className="results-column">
              {predictionResult ? (
                <>
                  <div className={`result-card ${predictionResult.prediction === 1 ? 'risk-high' : 'risk-low'}`}>
                    <div className="result-header">
                      <span className="result-tag">RESEARCH MODEL OUTPUT</span>
                      <span className="timestamp-tag">Analyzed Just Now</span>
                    </div>

                    <div className="prediction-main">
                      <div className="prediction-badge-large">
                        {predictionResult.prediction === 1 ? '⚠️' : '✅'}
                      </div>
                      <div>
                        <h2 className="prediction-label">
                          {predictionResult.result}
                        </h2>
                        <p className="prediction-sub">
                          Operational Target Prediction (Class {predictionResult.prediction})
                        </p>
                      </div>
                    </div>

                    {/* Probability Meter */}
                    <div className="probability-container">
                      <div className="prob-meta">
                        <span>Model Confidence Probability</span>
                        <span className="prob-val">{(predictionResult.probability * 100).toFixed(1)}%</span>
                      </div>
                      <div className="prob-track">
                        <div
                          className={`prob-fill ${predictionResult.prediction === 1 ? 'fill-high' : 'fill-low'}`}
                          style={{ width: `${Math.max(5, predictionResult.probability * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Clinical Criteria Breakdown for Metabolic Syndrome */}
                    <div className="criteria-breakdown">
                      <h4>Clinical Marker Evaluation:</h4>
                      <ul className="criteria-list">
                        <li className={formData.waist >= (formData.sex === 1 ? 102 : 88) ? 'met' : 'unmet'}>
                          <span>Abdominal Adiposity (Waist &ge; {formData.sex === 1 ? '102cm' : '88cm'}):</span>
                          <strong>{formData.waist} cm</strong>
                        </li>
                        <li className={formData.triglycerides >= 150 ? 'met' : 'unmet'}>
                          <span>Elevated Triglycerides (&ge; 150 mg/dL):</span>
                          <strong>{formData.triglycerides} mg/dL</strong>
                        </li>
                        <li className={formData.hdl < (formData.sex === 1 ? 40 : 50) ? 'met' : 'unmet'}>
                          <span>Reduced HDL (&lt; {formData.sex === 1 ? '40' : '50'} mg/dL):</span>
                          <strong>{formData.hdl} mg/dL</strong>
                        </li>
                        <li className={formData.systolic_bp >= 130 || formData.diastolic_bp >= 85 ? 'met' : 'unmet'}>
                          <span>Elevated Blood Pressure (&ge; 130/85):</span>
                          <strong>{formData.systolic_bp}/{formData.diastolic_bp} mmHg</strong>
                        </li>
                        <li className={formData.glucose >= 100 ? 'met' : 'unmet'}>
                          <span>Elevated Fasting Glucose (&ge; 100 mg/dL):</span>
                          <strong>{formData.glucose} mg/dL</strong>
                        </li>
                      </ul>
                    </div>

                    {/* <div className="disclaimer-callout">
                      ℹ️ <strong>Educational Note:</strong> This output reflects statistical pattern matching from the NHANES operational research definition and should not be used as clinical diagnostic advice.
                    </div> */}
                  </div>

                  {/* Diagnostic Criteria Pie/Donut Chart */}
                  <RiskPieChart formData={formData} criteriaList={criteriaList} />

                  {/* Biomarkers Comparison Bar Chart */}
                  <BiomarkerBarChart formData={formData} />
                </>
              ) : (
                <div className="empty-state-card">
                  <div className="empty-icon">📊</div>
                  <h3>Ready for Health Indicator Analysis</h3>
                  {/* <p>
                    Fill in the patient health indicators on the left, or click a <strong>Quick Demonstration Profile</strong> above to test the XGBoost classification model.
                  </p> */}
                  <div className="empty-checklist">
                    <div>✓ 11 input parameters automatically structured</div>
                    <div>✓ Real-time BMI & Body Roundness Index (BRI) computation</div>
                    <div>✓ Native JSON XGBoost classifier inference</div>
                  </div>
                </div>
              )}

              {/* Session History */}
              {history.length > 0 && (
                <div className="history-card">
                  <div className="history-header">
                    <h4>🕒 Recent Queries (Current Session)</h4>
                    <button
                      className="clear-history-btn"
                      onClick={() => setHistory([])}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="history-list">
                    {history.map((item) => (
                      <div key={item.id} className="history-item">
                        <div className="history-item-left">
                          <span className={`history-dot ${item.prediction === 1 ? 'dot-risk' : 'dot-safe'}`}></span>
                          <div>
                            <strong>{item.result}</strong>
                            <div className="history-meta">
                              BMI: {item.bmi} | BRI: {item.bri} | {item.timestamp}
                            </div>
                          </div>
                        </div>
                        <div className="history-prob">
                          {item.probability}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Research Model Specs Summary */}
              <div className="specs-card">
                <h4>Model Specification & Hyperparameters</h4>
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">Algorithm</span>
                    <span className="spec-val">XGBoost (gbtree)</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Parallel Trees</span>
                    <span className="spec-val">200 Estimators</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Features</span>
                    <span className="spec-val">11 Clinical Indicators</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Backend Format</span>
                    <span className="spec-val">Native JSON Model</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Visual Analytics & Interactive Charts */}
        {activeTab === 'analytics' && (
          <div className="tab-pane analytics-pane">
            <div className="doc-section">
              <div className="analytics-header-banner">
                <div>
                  <h2>Visual Health Data & Predictive Analytics</h2>
                  <p>
                    Interactive visual analytics highlighting active clinical markers, diagnostic metabolic syndrome criteria breakdown, cohort comparison, and XGBoost feature importance rankings.
                  </p>
                </div>
                <button
                  type="button"
                  className="tab-switch-cta-btn"
                  onClick={() => setActiveTab('dashboard')}
                >
                  ← Edit Health Indicators in Predictor
                </button>
              </div>

              <div className="analytics-grid">
                <RiskPieChart formData={formData} criteriaList={criteriaList} />
                <BiomarkerBarChart formData={formData} />
              </div>

              <div className="analytics-grid" style={{ marginTop: '2rem' }}>
                <FeatureImportanceChart />
                <SessionTrendChart history={history} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Model Performance & Architecture */}
        {activeTab === 'methodology' && (
          <div className="tab-pane">
            <div className="doc-section">
              <h2>Model Evaluation & Validation Results</h2>
              <p>
                The model was trained on the cleaned NHANES 2021–2023 health examination dataset merged on the unique participant identifier <code>SEQN</code>, utilizing a stratified 80:20 train-test split.
              </p>

              <div className="metrics-grid">
                <div className="metric-box">
                  <span className="metric-label">Accuracy</span>
                  <span className="metric-value">97.42%</span>
                  <span className="metric-sub">Stratified Test Split</span>
                </div>
                <div className="metric-box">
                  <span className="metric-label">Precision</span>
                  <span className="metric-value">94.26%</span>
                  <span className="metric-sub">Positive Predictive Value</span>
                </div>
                <div className="metric-box">
                  <span className="metric-label">Recall (Sensitivity)</span>
                  <span className="metric-value">97.52%</span>
                  <span className="metric-sub">True Positive Rate</span>
                </div>
                <div className="metric-box">
                  <span className="metric-label">F1-Score</span>
                  <span className="metric-value">95.86%</span>
                  <span className="metric-sub">Harmonic Mean</span>
                </div>
                <div className="metric-box highlight">
                  <span className="metric-label">ROC-AUC</span>
                  <span className="metric-value">99.72%</span>
                  <span className="metric-sub">Discriminative Ability</span>
                </div>
              </div>
            </div>

            <div className="doc-section">
              <h3>System Architecture & Data Flow</h3>
              <div className="architecture-diagram">
                <div className="arch-step">
                  <div className="arch-icon">💻</div>
                  <strong>React + Vite Frontend</strong>
                  <p>Collects raw inputs, calculates BMI & BRI, validates boundaries, formats 11-feature JSON</p>
                </div>
                <div className="arch-arrow">➔</div>
                <div className="arch-step">
                  <div className="arch-icon">⚡</div>
                  <strong>Flask REST API (:5001)</strong>
                  <p><code>POST /predict</code> handles CORS, defensive validation, transforms to Pandas DataFrame</p>
                </div>
                <div className="arch-arrow">➔</div>
                <div className="arch-step">
                  <div className="arch-icon">🧠</div>
                  <strong>XGBoost Model</strong>
                  <p><code>final_expanded_xgboost_model.json</code> outputs probability & binary classification</p>
                </div>
              </div>
            </div>

            <div className="doc-section">
              <h3>Mathematical Formulations</h3>
              <div className="formula-card">
                <strong>1. Body Mass Index (BMI):</strong>
                <pre><code>BMI = weight (kg) / [height (m)]²</code></pre>

                <strong style={{ marginTop: '1rem', display: 'block' }}>2. Body Roundness Index (BRI - Thomas et al., 2013):</strong>
                <pre><code>BRI = 364.2 - 365.5 × √( 1 - [waist (cm) / (π × height (cm))]² )</code></pre>
                <p className="formula-desc">
                  Unlike traditional BMI, BRI accounts for eccentric body shape and central abdominal visceral adiposity, providing a superior geometric representation of metabolic risk.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Scientific Limitations & Leakage Analysis */}
        {activeTab === 'leakage' && (
          <div className="tab-pane">
            <div className="doc-section warning-card">
              <h2>⚠️ Critical Scientific Consideration: Target Leakage & Circularity</h2>
              <p>
                For a rigorous academic PBL presentation and report, it is vital to disclose the relationship between the target label and model features:
              </p>

              <div className="leakage-explanation">
                <h4>Why are the test metrics (&gt;97% accuracy, 99.7% AUC) so high?</h4>
                <p>
                  In this dataset, the ground-truth operational label (Metabolic Syndrome: 0 or 1) was derived algorithmically by checking whether a participant met <strong>at least 3 of 5 clinical criteria</strong>:
                </p>
                <ol>
                  <li>Elevated Waist Circumference (&ge;102 cm for Men, &ge;88 cm for Women)</li>
                  <li>Elevated Triglycerides (&ge;150 mg/dL)</li>
                  <li>Reduced HDL Cholesterol (&lt;40 mg/dL for Men, &lt;50 mg/dL for Women)</li>
                  <li>Elevated Blood Pressure (Systolic &ge;130 or Diastolic &ge;85 mmHg)</li>
                  <li>Elevated Fasting Glucose (&ge;100 mg/dL)</li>
                </ol>
                <p style={{ marginTop: '0.8rem' }}>
                  <strong>The Circularity:</strong> The machine learning model is provided with <code>BRI</code> (which directly derives from waist circumference), <code>Triglycerides</code>, <code>HDL</code>, <code>Systolic_BP</code>, <code>Diastolic_BP</code>, and <code>BloodGlucose</code>.
                </p>
                <p>
                  Because the decision rule defining the label is constructed from these exact variables, the model effectively learns an approximation of the deterministic scoring rule rather than an unobserved biological ground truth. This phenomenon is known in machine learning as <strong>target leakage or measurement circularity</strong>.
                </p>
              </div>

              <div className="recommendations-box">
                <h4>Recommendations for Final Presentation & Viva:</h4>
                <ul>
                  <li><strong>Acknowledge the Leakage:</strong> Clearly explain to professors that this demonstrates the model's capacity to fit complex multivariate decision surfaces from NHANES surveys.</li>
                  <li><strong>Future Work Proposal:</strong> Propose training a "leakage-free" model that predicts future cardiometabolic outcomes (such as 10-year cardiovascular events or HbA1c progression) using only non-invasive measures (Age, Sex, BMI, BRI) without the lab lipid panel.</li>
                  <li><strong>Ethical Prototype Disclaimer:</strong> Emphasize that the web application serves as an educational research prototype for AI exploration and is not approved as medical software.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Academic Disclaimer Footer */}
      <footer className="main-footer">
        {/* <p>
          <strong>Academic Research Prototype:</strong> PBL Project developed for educational and research demonstration purposes. 
          Not intended for medical diagnosis, treatment, or clinical patient management. Always consult a qualified medical professional for health concerns.
        </p> */}
      </footer>
    </div>
  );
}
