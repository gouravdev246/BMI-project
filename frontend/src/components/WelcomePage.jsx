import React from 'react';
import {
  Activity,
  HeartPulse,
  Brain,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Dna,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Stethoscope,
  Sparkles,
  TrendingUp,
  Layers,
  Database,
  Users
} from 'lucide-react';

export default function WelcomePage({ onNavigate, onSelectPreset, presets = [] }) {
  return (
    <div className="welcome-container">
      {/* 1. Hero Section */}
      <section className="welcome-hero">
        {/* <div className="welcome-hero-badge fade-in-up stagger-1">
          <Sparkles className="icon-sm text-safe" />
          <span>CDC NHANES 2021–2023 Research Cohort • XGBoost Clinical Ensemble</span>
        </div> */}

        <h1 className="welcome-hero-title fade-in-up stagger-2">
          Metabolic Syndrome & Clinical Risk Intelligence
        </h1>

        <p className="welcome-hero-subtitle fade-in-up stagger-3">
          An evidence-based diagnostic decision-support system analyzing 11 critical clinical indicators,
          Body Roundness Index (BRI) geometry, and lipid hemodynamics using native gradient-boosted decision trees.
        </p>

        <div className="welcome-hero-actions fade-in-up stagger-4">
          <button
            type="button"
            className="shadcn-btn shadcn-btn-primary"
            onClick={() => onNavigate('dashboard')}
          >
            <Stethoscope className="icon-sm" />
            <span>Launch Clinical Predictor</span>
            <ArrowRight className="icon-sm" />
          </button>

          <button
            type="button"
            className="shadcn-btn shadcn-btn-outline"
            onClick={() => onNavigate('analytics')}
          >
            <BarChart3 className="icon-sm text-cyan" />
            <span>Explore Visual Analytics</span>
          </button>

          <button
            type="button"
            className="shadcn-btn shadcn-btn-ghost"
            onClick={() => onNavigate('methodology')}
          >
            <Brain className="icon-sm text-muted" />
            <span>Model & Architecture</span>
          </button>
        </div>

        {/* Hero KPI Stat Cards */}
        <div className="welcome-kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon-wrap bg-primary-soft">
              <ShieldCheck className="kpi-icon text-primary-light" />
            </div>
            <div className="kpi-content">
              <span className="kpi-val">97.42%</span>
              <span className="kpi-label">Test Set Accuracy</span>
              <span className="kpi-sub">Stratified 80:20 evaluation</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap bg-cyan-soft">
              <TrendingUp className="kpi-icon text-cyan" />
            </div>
            <div className="kpi-content">
              <span className="kpi-val">99.72%</span>
              <span className="kpi-label">ROC-AUC Score</span>
              <span className="kpi-sub">High discriminative power</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap bg-purple-soft">
              <Dna className="kpi-icon text-purple" />
            </div>
            <div className="kpi-content">
              <span className="kpi-val">11</span>
              <span className="kpi-label">Clinical Features</span>
              <span className="kpi-sub">Lipids, BP, BRI & BMI</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap bg-green-soft">
              <Brain className="kpi-icon text-safe" />
            </div>
            <div className="kpi-content">
              <span className="kpi-val">200</span>
              <span className="kpi-label">Decision Trees</span>
              <span className="kpi-sub">Ensemble gradient boosting</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Pillars / Feature Capabilities */}
      <section className="welcome-section">
        <div className="section-title-wrap">
          <span className="section-pill">Core Capabilities</span>
          <h2 className="section-heading">Multi-Dimensional Metabolic Assessment</h2>
          <p className="section-subheading">
            Combining traditional anthropometric indices with advanced bio-statistical modeling to identify cardiometabolic vulnerabilities.
          </p>
        </div>

        <div className="capabilities-grid">
          <div className="capability-card">
            <div className="capability-icon bg-cyan-soft">
              <Activity className="icon-md text-cyan" />
            </div>
            <h3>Anthropometric Geometry (BMI & BRI)</h3>
            <p>
              Simultaneous calculation of Body Mass Index (BMI) and Thomas et al.'s Body Roundness Index (BRI). While BMI measures mass per height, BRI models human body shape as an ellipse to quantify visceral central adiposity.
            </p>
            <div className="capability-footer">
              <span className="tag-pill">Thomas et al. Formula</span>
              <span className="tag-pill">Visceral Adiposity</span>
            </div>
          </div>

          <div className="capability-card">
            <div className="capability-icon bg-rose-soft">
              <AlertTriangle className="icon-md text-rose" />
            </div>
            <h3>Metabolic Syndrome Criteria Mapping</h3>
            <p>
              Evaluates the 5 classic NCEP ATP III / IDF criteria in real-time: elevated waist circumference, high fasting glucose, reduced HDL cholesterol, hypertriglyceridemia, and hypertension.
            </p>
            <div className="capability-footer">
              <span className="tag-pill">5 Clinical Markers</span>
              <span className="tag-pill">NCEP ATP III</span>
            </div>
          </div>

          <div className="capability-card">
            <div className="capability-icon bg-primary-soft">
              <Brain className="icon-md text-primary-light" />
            </div>
            <h3>XGBoost Machine Learning Classifier</h3>
            <p>
              Trained on validated CDC NHANES epidemiological cohorts. Employs 200 gradient boosted trees with native JSON inference to predict metabolic risk probability with 97.42% accuracy and 99.72% ROC-AUC.
            </p>
            <div className="capability-footer">
              <span className="tag-pill">Gradient Boosted Trees</span>
              <span className="tag-pill">Native JSON Model</span>
            </div>
          </div>

          <div className="capability-card">
            <div className="capability-icon bg-emerald-soft">
              <BarChart3 className="icon-md text-safe" />
            </div>
            <h3>Visual Analytics & Feature Importance</h3>
            <p>
              Interactive SVG donut charts for diagnostic criteria, comparative biomarker threshold bar graphs with clinical cutoff lines, and Gini split-gain feature importance rankings (BRI leading at 28%).
            </p>
            <div className="capability-footer">
              <span className="tag-pill">Interactive SVG</span>
              <span className="tag-pill">Cutoff Benchmarks</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Workflow Pipeline */}
      <section className="welcome-section welcome-pipeline-section">
        <div className="section-title-wrap">
          <span className="section-pill">Clinical Workflow</span>
          <h2 className="section-heading">How the Screening Pipeline Operates</h2>
          <p className="section-subheading">
            From raw clinical measurements to structured decision-support inference in milliseconds.
          </p>
        </div>

        <div className="pipeline-steps-grid">
          <div className="pipeline-step-card">
            <div className="step-num">01</div>
            <h4>Patient Biometrics</h4>
            <p>Enter patient age, biological sex, height, weight, and waist circumference.</p>
          </div>

          <div className="pipeline-connector">
            <ChevronRight className="connector-icon" />
          </div>

          <div className="pipeline-step-card">
            <div className="step-num">02</div>
            <h4>Hemodynamics & Lipids</h4>
            <p>Provide systolic & diastolic blood pressure, fasting glucose, triglycerides, HDL, and LDL.</p>
          </div>

          <div className="pipeline-connector">
            <ChevronRight className="connector-icon" />
          </div>

          <div className="pipeline-step-card">
            <div className="step-num">03</div>
            <h4>Feature Synthesis</h4>
            <p>System computes dynamic BMI & Body Roundness Index (BRI) using body geometry algorithms.</p>
          </div>

          <div className="pipeline-connector">
            <ChevronRight className="connector-icon" />
          </div>

          <div className="pipeline-step-card">
            <div className="step-num">04</div>
            <h4>ML Classification</h4>
            <p>XGBoost evaluates the 11-dimensional feature vector and returns risk probability.</p>
          </div>
        </div>
      </section>

      {/* 4. Quick Demonstration Profiles */}
      <section className="welcome-section">
        <div className="section-title-wrap">
          <span className="section-pill">Quick Demonstration</span>
          <h2 className="section-heading">Ready-to-Test Clinical Profiles</h2>
          <p className="section-subheading">
            Click any curated profile below to instantly populate the form and evaluate the model's classifications.
          </p>
        </div>

        <div className="demo-profiles-grid">
          {presets.map((preset, idx) => (
            <div key={idx} className="demo-profile-card">
              <div className="profile-card-header">
                <div>
                  <h3 className="profile-title">{preset.name}</h3>
                  <p className="profile-desc">{preset.desc}</p>
                </div>
                <span className={`profile-badge ${idx === 1 ? 'badge-danger' : idx === 2 ? 'badge-warn' : 'badge-safe'}`}>
                  {idx === 1 ? 'High Risk' : idx === 2 ? 'Borderline' : 'Low Risk'}
                </span>
              </div>

              <div className="profile-metrics-summary">
                <div className="profile-stat">
                  <span className="stat-label">Waist</span>
                  <span className="stat-val">{preset.data.waist} cm</span>
                </div>
                <div className="profile-stat">
                  <span className="stat-label">BP</span>
                  <span className="stat-val">{preset.data.systolic_bp}/{preset.data.diastolic_bp}</span>
                </div>
                <div className="profile-stat">
                  <span className="stat-label">Glucose</span>
                  <span className="stat-val">{preset.data.glucose} mg/dL</span>
                </div>
                <div className="profile-stat">
                  <span className="stat-label">Triglycerides</span>
                  <span className="stat-val">{preset.data.triglycerides} mg/dL</span>
                </div>
              </div>

              <button
                type="button"
                className="shadcn-btn shadcn-btn-secondary shadcn-btn-full"
                onClick={() => {
                  if (onSelectPreset) onSelectPreset(preset.data);
                  onNavigate('dashboard');
                }}
              >
                <span>Load Profile in Predictor</span>
                <ChevronRight className="icon-sm" />
              </button>
            </div>
          ))}
        </div>
      </section>



      {/* 6. Call To Action Footer Banner */}
      <section className="welcome-cta-banner">
        <div className="cta-content">
          <HeartPulse className="cta-icon text-rose" />
          <div>
            <h2>Ready to Analyze Patient Health Indicators?</h2>
            <p>Experience instant machine-learning classification with full criteria breakdown.</p>
          </div>
        </div>
        <button
          type="button"
          className="shadcn-btn shadcn-btn-primary shadcn-btn-lg"
          onClick={() => onNavigate('dashboard')}
        >
          <span>Open Clinical Predictor</span>
          <ArrowRight className="icon-md" />
        </button>
      </section>
    </div>
  );
}
