// Mock Patient Data Database
const patientsDb = {
    "PT-842-991": {
        id: "PT-842-991",
        name: "James Robertson",
        age: 62,
        gender: "M",
        history: ["Type 2 Diabetes", "Hypertension", "Former Smoker (quit 5y ago)"],
        vitals: { bp: "155/95", hr: "105", temp: "38.2°C", spo2: "93%" },
        presentingSymptoms: ["Shortness of breath", "Productive cough", "Fatigue", "Chills"],
        diagnoses: [
            { name: "Community-Acquired Pneumonia", confidence: 88, icd: "J15.9", evidence: ["Fever", "Productive cough", "SpO2 93%", "Elevated HR"], nextSteps: "Order Chest X-ray, Sputum culture, start empiric antibiotics." },
            { name: "Acute Exacerbation of COPD", confidence: 65, icd: "J44.1", evidence: ["Former smoker", "Shortness of breath", "Cough"], nextSteps: "Arterial blood gas, order spirometry post-recovery." }
        ],
        advocateHtml: `
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;" class="fade-in">
                Actively attempting to disprove <strong>Community-Acquired Pneumonia</strong>:
            </p>
            <div class="counter-point fade-in" style="animation-delay: 0.1s">
                <h4>Missing Classic Sign</h4>
                <p>Patient lacks pleuritic chest pain; consider pulmonary embolism rule-out given age and immobility risks.</p>
            </div>
            <div class="counter-point fade-in" style="animation-delay: 0.2s; border-left-color: var(--danger)">
                <h4 style="color: var(--danger)">Atypical Presentation Check</h4>
                <p>Given diabetes history, silent myocardial infarction could present as dyspnea and fatigue without chest pain. <strong>Action: Order prompt ECG and Troponin.</strong></p>
            </div>
        `,
        radarHtml: `
            <div class="metric-row fade-in" style="animation-delay: 0.6s">
                <span>Sepsis Vector Risk</span>
                <span style="color: var(--danger); font-weight: 600;">85% High</span>
            </div>
            <div class="metric-bar-bg"><div class="metric-bar-fill red" style="width:85%"></div></div>
            
            <div class="metric-row fade-in" style="animation-delay: 0.7s">
                <span>Respiratory Failure Vector</span>
                <span style="color: var(--warning); font-weight: 600;">60% Mod</span>
            </div>
            <div class="metric-bar-bg"><div class="metric-bar-fill orange" style="width:60%"></div></div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 1rem; line-height: 1.4;">
                <span class="material-icons-round" style="font-size: 0.875rem; vertical-align: middle;">info</span>
                AI projects a <strong>high probability of rapid deterioration</strong> within 4-6 hours if antibiotics and fluid resuscitation are not initiated.
            </p>
        `,
        nodes: [
            { id: "central", label: "Pneumonia", type: "central", x: 50, y: 50 },
            { id: "s1", label: "Fever", type: "symptom", x: 20, y: 30 },
            { id: "s2", label: "Cough", type: "symptom", x: 80, y: 30 },
            { id: "s3", label: "Low SpO2", type: "symptom", x: 80, y: 70 },
            { id: "s4", label: "Tachycardia", type: "symptom", x: 20, y: 70 }
        ]
    },
    "PT-112-402": {
        id: "PT-112-402",
        name: "Sarah Connor",
        age: 34,
        gender: "F",
        history: ["Migraines", "G2P2"],
        vitals: { bp: "110/70", hr: "115", temp: "37.1°C", spo2: "99%" },
        presentingSymptoms: ["Palpitations", "Dizziness", "Anxiety"],
        diagnoses: [
            { name: "Supraventricular Tachycardia (SVT)", confidence: 92, icd: "I47.1", evidence: ["HR 115", "Palpitations", "Sudden onset"], nextSteps: "Vagal maneuvers, Adenosine 6mg IV push if persistent." },
            { name: "Panic Attack", confidence: 45, icd: "F41.0", evidence: ["Anxiety", "Dizziness", "Tachycardia"], nextSteps: "Reassurance, Lorazepam 1mg if SVT ruled out." }
        ],
        advocateHtml: `
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;" class="fade-in">
                Actively attempting to disprove <strong>SVT</strong>:
            </p>
            <div class="counter-point fade-in" style="animation-delay: 0.1s; border-left-color: var(--danger)">
                <h4 style="color: var(--danger)">Structural Heart Disease?</h4>
                <p>If WPW is present, Adenosine could induce atrial fibrillation. Check baseline ECG for delta waves before administration.</p>
            </div>
            <div class="counter-point fade-in" style="animation-delay: 0.2s">
                <h4>Thyrotoxicosis</h4>
                <p>Unexplained tachycardia could be thyroid storm. Order TSH and free T4.</p>
            </div>
        `,
        radarHtml: `
            <div class="metric-row fade-in" style="animation-delay: 0.6s">
                <span>Hemodynamic Instability</span>
                <span style="color: var(--warning); font-weight: 600;">45% Mod</span>
            </div>
            <div class="metric-bar-bg"><div class="metric-bar-fill orange" style="width:45%"></div></div>
            
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 1rem; line-height: 1.4;">
                <span class="material-icons-round" style="font-size: 0.875rem; vertical-align: middle;">info</span>
                Patient is currently perfusing well, but extended SVT may lead to decompensation. Monitor BP closely.
            </p>
        `,
        nodes: [
            { id: "central", label: "SVT", type: "central", x: 50, y: 50 },
            { id: "s1", label: "Palpitations", type: "symptom", x: 30, y: 20 },
            { id: "s2", label: "HR > 110", type: "symptom", x: 70, y: 20 },
            { id: "s3", label: "Dizziness", type: "symptom", x: 50, y: 80 }
        ]
    }
};

let currentPatientId = "PT-842-991";
let patientData = patientsDb[currentPatientId];

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
});

function setupEventListeners() {
    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-mode');
        const icon = themeToggleBtn.querySelector('.material-icons-round');
        icon.textContent = document.documentElement.classList.contains('light-mode') ? 'dark_mode' : 'light_mode';
    });

    // Print Button
    const printBtn = document.getElementById('print-btn');
    printBtn.addEventListener('click', () => {
        window.print();
    });

    // Patient Switcher
    const patientSelector = document.getElementById('patient-selector');
    patientSelector.addEventListener('change', (e) => {
        currentPatientId = e.target.value;
        patientData = patientsDb[currentPatientId];
        
        // Clear containers and re-init to trigger animations
        document.getElementById('patient-summary').innerHTML = '';
        document.getElementById('diagnoses-list').innerHTML = '';
        document.getElementById('advocate-content').innerHTML = '';
        document.getElementById('radar-metrics').innerHTML = '';
        document.getElementById('graph-container').innerHTML = '';
        
        // Add analyzing state
        document.querySelector('.diagnostic-engine .badge').classList.add('ai-active');
        document.querySelector('.diagnostic-engine .badge').textContent = 'Analyzing...';
        
        setTimeout(() => {
            document.querySelector('.diagnostic-engine .badge').classList.remove('ai-active');
            document.querySelector('.diagnostic-engine .badge').textContent = 'Analysis Complete';
            initApp();
        }, 800); // simulate loading
    });
}

function initApp() {
    initPatientSummary();
    initDiagnosticEngine();
    initDevilsAdvocate();
    initVolatilityRadar();
    initKnowledgeGraph();
}

function initPatientSummary() {
    const container = document.getElementById('patient-summary');
    container.innerHTML = `
        <div class="patient-info fade-in" style="animation-delay: 0.1s">
            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                ${patientData.name} 
                <span style="font-size: 0.875rem; font-weight: 400; color: var(--text-secondary)">ID: ${patientData.id}</span>
            </h2>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">${patientData.age} yr old ${patientData.gender} | Admitted: Today 08:45 AM</p>
            
            <h3 style="font-size: 0.875rem; color: var(--text-muted); text-transform: uppercase;">Medical History</h3>
            <div class="evidence-tags" style="margin-top: 0.5rem;">
                ${patientData.history.map(h => `<span class="tag">${h}</span>`).join('')}
            </div>
            
            <h3 style="font-size: 0.875rem; color: var(--text-muted); text-transform: uppercase; margin-top: 1rem;">Presenting Symptoms</h3>
            <div class="evidence-tags" style="margin-top: 0.5rem;">
                ${patientData.presentingSymptoms.map(s => `<span class="tag" style="border-color: var(--warning); color: #fbbf24">${s}</span>`).join('')}
            </div>
        </div>
        
        <div class="patient-vitals fade-in" style="animation-delay: 0.2s">
            <div class="card-header" style="margin-bottom: 0; padding-bottom: 0.5rem; border-bottom: none;">
                <h3 style="font-size: 1rem; font-weight: 600;"><span class="material-icons-round" style="font-size: 1rem; vertical-align: middle;">monitor_heart</span> Current Vitals</h3>
            </div>
            <div class="vitals-grid">
                <div class="vital-card abnormal">
                    <span>Blood Pres.</span>
                    <strong>${patientData.vitals.bp}</strong>
                </div>
                <div class="vital-card abnormal">
                    <span>Heart Rate</span>
                    <strong>${patientData.vitals.hr} bpm</strong>
                </div>
                <div class="vital-card abnormal">
                    <span>Temperature</span>
                    <strong>${patientData.vitals.temp}</strong>
                </div>
                <div class="vital-card abnormal">
                    <span>SpO2</span>
                    <strong>${patientData.vitals.vitals?.spo2 || patientData.vitals.spo2}</strong>
                </div>
            </div>
        </div>
    `;
}

function initDiagnosticEngine() {
    const list = document.getElementById('diagnoses-list');
    list.innerHTML = patientData.diagnoses.map((d, index) => `
        <div class="diagnosis-item fade-in" style="animation-delay: ${0.3 + (index * 0.1)}s">
            <div class="diagnosis-header">
                <h3>${d.name} <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 400;">ICD-10: ${d.icd}</span></h3>
                <span style="font-weight: 700; color: ${d.confidence > 70 ? 'var(--success)' : d.confidence > 40 ? 'var(--warning)' : 'var(--text-secondary)'}">${d.confidence}%</span>
            </div>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${d.confidence}%; background: ${d.confidence > 70 ? 'var(--success)' : d.confidence > 40 ? 'var(--warning)' : 'var(--text-muted)'};"></div>
            </div>
            <div class="evidence-tags" style="margin-bottom: 0.75rem;">
                ${d.evidence.map(e => `<span class="tag"><span class="material-icons-round" style="font-size: 0.7rem; vertical-align: middle;">check</span> ${e}</span>`).join('')}
            </div>
            <p style="font-size: 0.8125rem; color: var(--text-secondary);"><strong style="color: var(--text-primary)">Recommended Step:</strong> ${d.nextSteps}</p>
        </div>
    `).join('');
}

function initDevilsAdvocate() {
    const list = document.getElementById('advocate-content');
    setTimeout(() => { list.innerHTML = patientData.advocateHtml; }, 500);
}

function initVolatilityRadar() {
    const metrics = document.getElementById('radar-metrics');
    metrics.innerHTML = patientData.radarHtml;
    
    // adjust gauge color based on patient
    const riskBadge = document.getElementById('risk-score');
    if(currentPatientId === "PT-112-402") {
        riskBadge.className = 'badge warning';
        riskBadge.innerText = 'Moderate Risk';
    } else {
        riskBadge.className = 'badge danger';
        riskBadge.innerText = 'High Risk';
    }
}

function initKnowledgeGraph() {
    const container = document.getElementById('graph-container');
    container.innerHTML = '';
    const nodes = patientData.nodes;
    const centralNode = nodes.find(n => n.id === "central");
    
    nodes.forEach(node => {
        if (node.id !== "central") {
            const edge = document.createElement('div');
            edge.className = 'edge fade-in';
            const length = Math.sqrt(Math.pow(centralNode.x - node.x, 2) + Math.pow(centralNode.y - node.y, 2)) * (container.clientWidth / 100);
            const angle = Math.atan2((centralNode.y - node.y), (centralNode.x - node.x)) * 180 / Math.PI;
            edge.style.width = \`\${length}px\`;
            edge.style.left = \`\${node.x}%\`;
            edge.style.top = \`\${node.y}%\`;
            edge.style.transform = \`translate(0, -50%) rotate(\${angle}deg)\`;
            container.appendChild(edge);
        }
    });

    nodes.forEach(node => {
        const el = document.createElement('div');
        el.className = \`node \${node.type} fade-in\`;
        el.innerText = node.label;
        el.style.left = \`\${node.x}%\`;
        el.style.top = \`\${node.y}%\`;
    });
}

// --- HPC Slurm Simulation Logic --- //

let localQueue = 0;
const MAX_LOCAL_NODES = 4;
let cloudNodeCount = 0;

window.switchView = function(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.style.display = 'none');
    document.getElementById('view-' + viewId).style.display = 'grid';
    
    document.querySelectorAll('.nav-links li').forEach(el => el.classList.remove('active'));
    document.getElementById('nav-' + viewId).classList.add('active');
}

window.simulateInferenceJob = function() {
    if(localQueue < MAX_LOCAL_NODES) {
        // Run locally
        let nodeId = localQueue;
        localQueue++;
        document.getElementById('local-capacity-badge').textContent = `Capacity: ${localQueue}/4`;
        
        let nodeEl = document.getElementById(`node-${nodeId}`);
        let statusEl = nodeEl.querySelector('.node-status');
        let barEl = nodeEl.querySelector('.job-bar-fill') || document.createElement('div');
        if(!barEl.classList.contains('job-bar-fill')) {
            barEl.className = 'job-bar-fill';
            nodeEl.querySelector('.job-bar').appendChild(barEl);
        }
        
        statusEl.className = 'node-status busy';
        setTimeout(() => barEl.style.width = '100%', 50);
        
        let jobId = Math.floor(Math.random() * 9000) + 1000;
        logToTerminal(`[LOCAL] Job #${jobId} dispatched to on-premise Node 0${nodeId+1}.`);
        
        setTimeout(() => {
            localQueue--;
            document.getElementById('local-capacity-badge').textContent = `Capacity: ${localQueue}/4`;
            statusEl.className = 'node-status';
            barEl.style.width = '0%';
            logToTerminal(`[SUCCESS] Local Job #${jobId} successfully completed on Node 0${nodeId+1}.`);
        }, 5000 + Math.random() * 3000); 
    } else {
        // Burst to cloud logic
        let jobId = Math.floor(Math.random() * 9000) + 1000;
        logToTerminal(`<span class="log-err">[WARN] Local capacity exceeded (4/4). Triggering SECURE CLOUD BURST for Job #${jobId}...</span>`);
        
        document.getElementById('cloud-status-badge').textContent = 'Bursting';
        document.getElementById('cloud-status-badge').style.color = '#0ea5e9';
        document.getElementById('cloud-status-badge').style.borderColor = '#0ea5e9';
        document.getElementById('burst-bridge').classList.add('active');
        
        cloudNodeCount++;
        let cId = cloudNodeCount;
        
        logToTerminal(`<span class="log-info">[CLOUD] Auto-provisioning AWS EC2 instance (g4dn.xlarge)... Instance AWS-${cId} ready.</span>`);
        
        // Create dynamic cloud node
        let cNode = document.createElement('div');
        cNode.className = 'server-node fade-in';
        cNode.style.borderColor = '#0ea5e9';
        cNode.innerHTML = `<div class="node-status burst"></div><span style="color:#0ea5e9">AWS-${cId}</span><div class="job-bar"><div class="job-bar-fill bursting" style="width:0%"></div></div>`;
        document.getElementById('cloud-cluster').appendChild(cNode);
        
        setTimeout(() => {
             cNode.querySelector('.job-bar-fill').style.width = '100%';
        }, 50);

        setTimeout(() => {
            logToTerminal(`[CLOUD] AWS-${cId} execution of Job #${jobId} complete. Standardizing format and securely transferring results back...`);
            setTimeout(() => {
                cNode.remove();
                if(document.getElementById('cloud-cluster').children.length === 0) {
                    document.getElementById('burst-bridge').classList.remove('active');
                    document.getElementById('cloud-status-badge').textContent = 'Idle';
                    document.getElementById('cloud-status-badge').style.color = 'var(--text-muted)';
                    document.getElementById('cloud-status-badge').style.borderColor = 'var(--text-muted)';
                    logToTerminal('<span style="color:var(--success)">[SYSTEM] Cloud resources spun down. Returned to standard local capacity.</span>');
                }
            }, 1000);
        }, 6000 + (Math.random() * 2000)); 
    }
}

function logToTerminal(msg) {
    const slurmLog = document.getElementById('slurm-log');
    let p = document.createElement('p');
    let time = new Date().toLocaleTimeString();
    p.innerHTML = `<span style="color:var(--text-muted)">[${time}]</span> ${msg}`;
    slurmLog.appendChild(p);
    slurmLog.scrollTop = slurmLog.scrollHeight;
}
