import React, { useState } from 'react';

/**
 * Helper to compute SVG arc path for Pie/Donut slices
 */
function getArcPath(cx, cy, radius, innerRadius, startAngle, endAngle) {
  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);

  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);

  const x3 = cx + innerRadius * Math.cos(endRad);
  const y3 = cy + innerRadius * Math.sin(endRad);
  const x4 = cx + innerRadius * Math.cos(startRad);
  const y4 = cy + innerRadius * Math.sin(startRad);

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${x1} ${y1}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
    'Z'
  ].join(' ');
}

/**
 * 1. Donut / Pie Chart:
 * Shows the 5 Metabolic Criteria status OR NHANES Cohort Prevalence
 */
export function RiskPieChart({ formData, criteriaList = [] }) {
  const [chartMode, setChartMode] = useState('patient'); // 'patient' | 'nhanes'
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Compute how many criteria are met
  const metCount = criteriaList.filter(c => c.met).length;
  const unmetCount = criteriaList.length - metCount;

  // Patient slices (5 diagnostic criteria segments of equal base size)
  const patientSlices = criteriaList.map((crit, idx) => ({
    id: `crit-${idx}`,
    label: crit.name,
    value: 1,
    status: crit.met ? 'Elevated Risk' : 'Normal / Safe',
    color: crit.met ? '#f43f5e' : '#10b981',
    metricValue: crit.value,
    threshold: crit.threshold,
    isMet: crit.met
  }));

  // NHANES Population Prevalence distribution slices
  const nhanesSlices = [
    {
      id: 'nhanes-met',
      label: 'Metabolic Syndrome Cohort',
      value: 34.2,
      percentage: '34.2%',
      color: '#f43f5e',
      desc: 'Participants meeting ≥ 3 clinical criteria in NHANES'
    },
    {
      id: 'nhanes-normal',
      label: 'Non-Metabolic Baseline',
      value: 65.8,
      percentage: '65.8%',
      color: '#0ea5e9',
      desc: 'Participants with < 3 risk criteria'
    }
  ];

  // Choose data based on mode
  const currentSlices = chartMode === 'patient' ? patientSlices : nhanesSlices;
  const totalVal = currentSlices.reduce((acc, s) => acc + s.value, 0);

  // Calculate arc angles
  let currentAngle = 0;
  const sliceAngles = currentSlices.map(slice => {
    const angle = (slice.value / totalVal) * 360;
    const start = currentAngle;
    const end = currentAngle + angle;
    currentAngle += angle;
    return { ...slice, startAngle: start, endAngle: end };
  });

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h4 className="chart-title">
            {chartMode === 'patient' ? 'Diagnostic Criteria Risk Breakdown' : 'NHANES Population Distribution'}
          </h4>
          <p className="chart-subtitle">
            {chartMode === 'patient'
              ? 'Proportion of active metabolic risk markers (≥ 3 indicates elevated risk)'
              : 'CDC NHANES 2021–2023 dataset operational target baseline'}
          </p>
        </div>

        <div className="chart-mode-toggles">
          <button
            type="button"
            className={`chart-toggle-btn ${chartMode === 'patient' ? 'active' : ''}`}
            onClick={() => setChartMode('patient')}
          >
            Patient Factors
          </button>
          <button
            type="button"
            className={`chart-toggle-btn ${chartMode === 'nhanes' ? 'active' : ''}`}
            onClick={() => setChartMode('nhanes')}
          >
            NHANES Baseline
          </button>
        </div>
      </div>

      <div className="pie-chart-body">
        {/* SVG Donut / Pie Chart */}
        <div className="donut-wrapper">
          <svg viewBox="0 0 240 240" className="donut-svg">
            <defs>
              <filter id="glow-rose" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f43f5e" floodOpacity="0.5" />
              </filter>
              <filter id="glow-safe" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10b981" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Slices */}
            {sliceAngles.map(slice => {
              const isHovered = hoveredSlice === slice.id;
              const radius = isHovered ? 104 : 98;
              const innerRadius = 64;
              const path = getArcPath(120, 120, radius, innerRadius, slice.startAngle, slice.endAngle);

              return (
                <path
                  key={slice.id}
                  d={path}
                  fill={slice.color}
                  stroke="#0a0f1d"
                  strokeWidth="2.5"
                  className="donut-slice"
                  onMouseEnter={() => setHoveredSlice(slice.id)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  style={{
                    opacity: isHovered ? 1 : 0.9,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                />
              );
            })}

            {/* Center Readout Text */}
            <text x="120" y="112" textAnchor="middle" className="donut-center-main">
              {chartMode === 'patient' ? `${metCount}/5` : '34.2%'}
            </text>
            <text x="120" y="132" textAnchor="middle" className="donut-center-sub">
              {chartMode === 'patient' ? 'Criteria Met' : 'Metabolic Rate'}
            </text>
          </svg>
        </div>

        {/* Legend / Breakdown List */}
        <div className="pie-legend">
          {chartMode === 'patient' ? (
            <div className="legend-items">
              <div className="legend-summary-badge">
                <span className={`summary-pill ${metCount >= 3 ? 'risk' : 'safe'}`}>
                  {metCount >= 3 ? '⚠️ Clinical Risk Threshold Reached (≥ 3)' : '✅ Below Risk Threshold (< 3)'}
                </span>
              </div>
              {criteriaList.map((crit, idx) => (
                <div
                  key={idx}
                  className={`legend-item ${hoveredSlice === `crit-${idx}` ? 'highlighted' : ''}`}
                  onMouseEnter={() => setHoveredSlice(`crit-${idx}`)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <span className="legend-dot" style={{ backgroundColor: crit.met ? '#f43f5e' : '#10b981' }}></span>
                  <div className="legend-info">
                    <span className="legend-label">{crit.name}</span>
                    <span className="legend-threshold">{crit.threshold}</span>
                  </div>
                  <div className="legend-status">
                    <strong className={crit.met ? 'text-danger' : 'text-safe'}>{crit.value}</strong>
                    <span className="legend-tag">{crit.met ? 'MET' : 'NORMAL'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="legend-items">
              {nhanesSlices.map(slice => (
                <div
                  key={slice.id}
                  className={`legend-item ${hoveredSlice === slice.id ? 'highlighted' : ''}`}
                  onMouseEnter={() => setHoveredSlice(slice.id)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <span className="legend-dot" style={{ backgroundColor: slice.color }}></span>
                  <div className="legend-info">
                    <span className="legend-label">{slice.label}</span>
                    <span className="legend-threshold">{slice.desc}</span>
                  </div>
                  <strong className="legend-percentage" style={{ color: slice.color }}>
                    {slice.percentage}
                  </strong>
                </div>
              ))}
              <div className="nhanes-note">
                ℹ️ Data derived from NCHS NHANES 2021–2023 pre-pandemic and post-pandemic laboratory examination files.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 2. Biomarkers vs Clinical Normal Thresholds (Comparative Bar Graph)
 */
export function BiomarkerBarChart({ formData }) {
  const markers = [
    {
      name: 'Fasting Glucose',
      unit: 'mg/dL',
      value: Number(formData.glucose),
      threshold: 100,
      maxScale: 250,
      isHighRisk: Number(formData.glucose) >= 100,
      clinicalDesc: 'Criteria: ≥ 100 mg/dL'
    },
    {
      name: 'Triglycerides',
      unit: 'mg/dL',
      value: Number(formData.triglycerides),
      threshold: 150,
      maxScale: 400,
      isHighRisk: Number(formData.triglycerides) >= 150,
      clinicalDesc: 'Criteria: ≥ 150 mg/dL'
    },
    {
      name: 'Total Cholesterol',
      unit: 'mg/dL',
      value: Number(formData.total_cholesterol),
      threshold: 200,
      maxScale: 350,
      isHighRisk: Number(formData.total_cholesterol) >= 200,
      clinicalDesc: 'Desirable: < 200 mg/dL'
    },
    {
      name: 'Systolic BP',
      unit: 'mmHg',
      value: Number(formData.systolic_bp),
      threshold: 130,
      maxScale: 200,
      isHighRisk: Number(formData.systolic_bp) >= 130,
      clinicalDesc: 'Elevated: ≥ 130 mmHg'
    },
    {
      name: 'Diastolic BP',
      unit: 'mmHg',
      value: Number(formData.diastolic_bp),
      threshold: 85,
      maxScale: 130,
      isHighRisk: Number(formData.diastolic_bp) >= 85,
      clinicalDesc: 'Elevated: ≥ 85 mmHg'
    },
    {
      name: 'HDL (Protective)',
      unit: 'mg/dL',
      value: Number(formData.hdl),
      threshold: formData.sex === 1 ? 40 : 50,
      maxScale: 100,
      isHighRisk: Number(formData.hdl) < (formData.sex === 1 ? 40 : 50),
      invertSafe: true, // for HDL, higher is safer
      clinicalDesc: `Low risk if ≥ ${formData.sex === 1 ? '40 (M)' : '50 (F)'}`
    }
  ];

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h4 className="chart-title">Patient Biomarkers vs. Clinical Thresholds</h4>
          <p className="chart-subtitle">
            Visual comparison of patient blood chemistry against international clinical cutoffs
          </p>
        </div>
        <div className="chart-benchmark-legend">
          <span className="benchmark-line-sample"></span>
          <span className="benchmark-text">Dashed line = Risk Cutoff</span>
        </div>
      </div>

      <div className="bar-chart-list">
        {markers.map((item, idx) => {
          const pctValue = Math.min(100, Math.max(5, (item.value / item.maxScale) * 100));
          const pctThreshold = (item.threshold / item.maxScale) * 100;
          const isDanger = item.invertSafe ? item.value < item.threshold : item.value >= item.threshold;

          return (
            <div key={idx} className="bar-row">
              <div className="bar-info-col">
                <span className="bar-marker-name">{item.name}</span>
                <span className="bar-marker-desc">{item.clinicalDesc}</span>
              </div>

              <div className="bar-track-col">
                <div className="bar-track">
                  {/* Fill Bar */}
                  <div
                    className={`bar-fill ${isDanger ? 'bar-danger' : 'bar-safe'}`}
                    style={{ width: `${pctValue}%` }}
                  >
                    <span className="bar-val-badge">
                      {item.value} {item.unit}
                    </span>
                  </div>

                  {/* Threshold Marker Pin */}
                  <div
                    className="threshold-marker"
                    style={{ left: `${pctThreshold}%` }}
                    title={`Cutoff: ${item.threshold} ${item.unit}`}
                  >
                    <span className="threshold-label">{item.threshold}</span>
                  </div>
                </div>
              </div>

              <div className="bar-status-col">
                <span className={`bar-status-badge ${isDanger ? 'badge-danger' : 'badge-safe'}`}>
                  {isDanger ? '⚠️ Elevated' : '✓ Normal'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 3. Feature Importance Bar Graph (XGBoost Research Insights)
 */
export function FeatureImportanceChart() {
  const featureWeights = [
    { feature: 'Body Roundness Index (BRI)', weight: 0.28, desc: 'Central visceral adiposity geometric score' },
    { feature: 'Fasting Blood Glucose', weight: 0.19, desc: 'Glycemic regulation biomarker' },
    { feature: 'Triglycerides', weight: 0.16, desc: 'Circulating lipid particle volume' },
    { feature: 'HDL Cholesterol', weight: 0.12, desc: 'Cardioprotective high-density lipoprotein' },
    { feature: 'Systolic Blood Pressure', weight: 0.08, desc: 'Vascular resistance and arterial stiffness' },
    { feature: 'Age (Years)', weight: 0.05, desc: 'Cumulative metabolic exposure' },
    { feature: 'Diastolic Blood Pressure', weight: 0.04, desc: 'Peripheral hemodynamic load' },
    { feature: 'Body Mass Index (BMI)', weight: 0.03, desc: 'Total body mass indexation' },
    { feature: 'Total Cholesterol', weight: 0.02, desc: 'Overall serum sterol concentration' },
    { feature: 'LDL Cholesterol', weight: 0.02, desc: 'Low-density atherogenic lipoprotein' },
    { feature: 'Biological Sex', weight: 0.01, desc: 'Sexual dimorphic metabolic baseline' }
  ];

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h4 className="chart-title">XGBoost Relative Feature Importance</h4>
          <p className="chart-subtitle">
            Normalized Gini split-gain contribution across 200 gradient boosted decision trees
          </p>
        </div>
        <span className="pill-badge badge-info">Model Gain Weights</span>
      </div>

      <div className="importance-list">
        {featureWeights.map((item, idx) => (
          <div key={idx} className="importance-row">
            <div className="importance-label-col">
              <span className="importance-rank">#{idx + 1}</span>
              <div>
                <strong>{item.feature}</strong>
                <span className="importance-desc">{item.desc}</span>
              </div>
            </div>

            <div className="importance-bar-col">
              <div className="importance-track">
                <div
                  className="importance-fill"
                  style={{ width: `${(item.weight / 0.28) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="importance-val-col">
              {(item.weight * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 4. Session History Trend Chart
 */
export function SessionTrendChart({ history = [] }) {
  if (!history || history.length < 2) {
    return (
      <div className="chart-card empty-chart">
        <p>Run at least 2 predictions in this session to see the comparative probability trend.</p>
      </div>
    );
  }

  // Reverse so chronological order from left to right
  const chronological = [...history].reverse();
  const maxPoints = chronological.length;

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h4 className="chart-title">Session Prediction Probability Trend</h4>
          <p className="chart-subtitle">
            Trajectory of model confidence across queries tested in this session
          </p>
        </div>
      </div>

      <div className="trend-timeline">
        {chronological.map((item, idx) => {
          const prob = parseFloat(item.probability);
          const isHigh = item.prediction === 1;

          return (
            <div key={item.id} className="trend-point-col">
              <div className="trend-bar-wrapper">
                <div
                  className={`trend-bar ${isHigh ? 'trend-high' : 'trend-low'}`}
                  style={{ height: `${Math.max(10, prob)}%` }}
                  title={`${item.result} (${item.probability}%)`}
                >
                  <span className="trend-bar-val">{item.probability}%</span>
                </div>
              </div>
              <span className="trend-timestamp">Run #{idx + 1}</span>
              <span className={`trend-dot-status ${isHigh ? 'text-danger' : 'text-safe'}`}>
                {isHigh ? 'Metabolic' : 'Normal'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
