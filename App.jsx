import { useState, useRef, useEffect } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────

const DRUG_CLASSES = [
  // ─────────────────────────────────────────────
  // 🩸 ANTICOAGULANTS
  // ─────────────────────────────────────────────
  {
    id: "anticoagulants",
    name: "Anticoagulants",
    icon: "🩸",
    color: "#e05c5c",
    mnemonic: "🧠 MNEMONIC: Think of anticoagulants as 'clot prevention agents.' They don't break clots — they STOP NEW ONES from forming. Remember: 'A-P-I-W' → Antithrombin activators (Heparin, Enoxaparin), Prothrombinase inhibitors (Rivaroxaban), INR drugs (Warfarin).",
    overview: "Anticoagulants prevent blood clots from forming or getting bigger. They are NOT clot busters (that's thrombolytics). Every anticoagulant has a REVERSAL AGENT — know them cold for NCLEX.",
    drugs: [
      {
        name: "Heparin (Unfractionated UFH)",
        mechanism: "Activates antithrombin III → stops clotting factors — think of it as 'turbocharging your body's own clot-stopper'",
        indications: "DVT/PE treatment & prevention, ACS, during cardiac surgery, bridge therapy",
        antidote: "🔴 Protamine Sulfate — 'P for Protamine, P for Pigs' (it comes from fish/pig sperm — memorable!)",
        monitoring: "aPTT (goal: 60–100 sec — 'aPTT for Heparin'). Check platelets every 2–3 days for HIT.",
        nursingPearls: "🔑 NEVER give IM (hematoma risk). SubQ for prevention, IV drip for treatment. HIT = Heparin-Induced Thrombocytopenia: platelets DROP but patient CLOTS more (paradox!). Happens days 5–10. If platelets drop >50% → STOP heparin immediately.",
        mnemonic: "💡 HIT mnemonic: 'The Heparin HIT you and now you CLOT instead of bleed' — thrombocytopenia + new thrombosis. Days 5–10. Stop heparin → switch drugs.",
        sideEffects: "Bleeding (main risk), HIT (days 5–10), osteoporosis with long-term use",
      },
      {
        name: "Warfarin (Coumadin)",
        mechanism: "Blocks Vitamin K → can't make clotting factors II, VII, IX, X. Think: 'Warfarin Kills Vitamin K' → clotting factories shut down.",
        indications: "A-fib, mechanical heart valves, long-term DVT/PE prevention",
        antidote: "🔴 Vitamin K (slow, 24–48 hrs) | FFP or 4-factor PCC (fast, for active bleeding)",
        monitoring: "INR — target 2–3 (valves: 2.5–3.5). 'INR = I Need to check the Ratio.'",
        nursingPearls: "🔑 Takes 3–5 days to work (plan ahead!). TONS of food and drug interactions. Vitamin K-rich foods (leafy greens) LOWER INR — don't eliminate them, keep intake CONSISTENT. Teach patient: don't eat a salad for dinner every day this week then stop next week.",
        mnemonic: "💡 '1279' mnemonic for Warfarin's clotting factors: factors 1, 2, 7, 9, 10 — Warfarin blocks all the ones with a '2, 7, 9, 10.' Or: 'It Takes Two People (II, VII, IX, X) To Warf-dance.'",
        sideEffects: "Bleeding (check INR!), skin necrosis (rare, early in therapy), purple toe syndrome",
      },
      {
        name: "Rivaroxaban (Xarelto)",
        mechanism: "Directly blocks Factor Xa — 'Xa-relto blocks Xa.' No middleman needed (unlike heparin which needs antithrombin).",
        indications: "A-fib stroke prevention, DVT/PE treatment and prevention, post-surgery clot prevention",
        antidote: "🔴 Andexanet alfa (AndeXXa) — 'AndeXXa reverses Xarelto's Xa block'",
        monitoring: "No routine lab monitoring needed! (That's the beauty of DOACs.) Still check renal function periodically.",
        nursingPearls: "🔑 Take WITH EVENING MEAL — food increases absorption by 39%. Do NOT crush (affects coating). Renal dose adjustment needed. Part of the DOAC family (Direct Oral AntiCoagulants) — newer, more convenient than warfarin.",
        mnemonic: "💡 'Xa-relto = blocks Xa.' All Factor Xa inhibitors end in -xaban: rivaroxaban, apixaban, edoxaban. Think: '-xaban = Xa-ban (banning Factor Xa).'",
        sideEffects: "Bleeding, GI upset — fewer interactions than warfarin",
      },
      {
        name: "Enoxaparin (Lovenox)",
        mechanism: "Low Molecular Weight Heparin (LMWH) — works like heparin but more predictable. Blocks Factor Xa more than thrombin. Think: 'Lovenox loves blocking Xa.'",
        indications: "DVT/PE prevention & treatment, ACS, bridge therapy while starting warfarin",
        antidote: "🔴 Protamine sulfate (only ~60% reversal — not complete like UFH)",
        monitoring: "Usually no routine monitoring needed. Check anti-Xa levels in special populations (obese, renal failure, pregnant). CONTRAINDICATED if CrCl <30.",
        nursingPearls: "🔑 SubQ injection ONLY. DO NOT expel the air bubble before injecting — the air bubble helps push the full dose in and seals the needle track. Pinch the skin. Rotate sites. Do NOT rub after injection (bruising).",
        mnemonic: "💡 'Love-nox loves the belly' — always SubQ, usually abdomen, keep that air bubble! Compare: UFH = unpredictable (needs aPTT), LMWH = more predictable (weight-based, less monitoring).",
        sideEffects: "Bleeding, injection site bruising, thrombocytopenia (lower HIT risk than UFH)",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 💊 ANTIPLATELETS
  // ─────────────────────────────────────────────
  {
    id: "antiplatelets",
    name: "Antiplatelets",
    icon: "💊",
    color: "#5c8de0",
    mnemonic: "🧠 MNEMONIC: 'Antiplatelets = Anti-sticky.' Platelets are sticky; these drugs make them less sticky. They prevent platelets from clumping. Think heart attacks and strokes — that's when you need these.",
    overview: "Antiplatelets prevent platelets from sticking together and forming clots. Used mainly for heart attacks, strokes, and stents. Key point: NO specific antidote for most — platelet transfusion is the only option.",
    drugs: [
      {
        name: "Aspirin (ASA)",
        mechanism: "Blocks COX-1 forever (irreversible) → no thromboxane A2 → platelets can't clump. That platelet is disabled for its ENTIRE life (7–10 days).",
        indications: "Heart attack prevention, post-stent, stroke prevention, ACS",
        antidote: "🔴 No specific antidote — platelet transfusion if severe bleeding",
        monitoring: "Watch for GI bleeding and tinnitus (ringing in ears = toxicity sign)",
        nursingPearls: "🔑 81mg = cardioprotection (baby aspirin). 325mg = pain/fever/acute MI. Give WITH FOOD to protect stomach. NEVER give to children with viral illness — Reye's syndrome (rare but deadly brain + liver damage).",
        mnemonic: "💡 'ASA Attacks platelets for life — 7 to 10 days they can't clump.' Toxicity: 'RINGING ears = too much ASA (tinnitus).' Reye's: 'Kids + Virus + Aspirin = Never.'",
        sideEffects: "GI bleeding/ulcers, tinnitus (overdose), Reye's syndrome in children with viral illness",
      },
      {
        name: "Clopidogrel (Plavix)",
        mechanism: "Blocks the P2Y12 receptor on platelets permanently → platelets can't get the 'clump' signal. BUT it's a prodrug — needs the liver to activate it.",
        indications: "Post-stent (dual therapy with aspirin), ACS, stroke/TIA prevention",
        antidote: "🔴 No specific antidote — platelet transfusion",
        monitoring: "Signs of bleeding. Ask about PPI use (omeprazole reduces effectiveness).",
        nursingPearls: "🔑 PRODRUG — needs liver enzyme CYP2C19 to activate it. Poor metabolizers (genetic) get less benefit. Omeprazole (Prilosec) competes for same enzyme → reduces clopidogrel's power. Hold 5–7 days before surgery. Often paired with aspirin ('DAPT' = Dual AntiPlatelet Therapy).",
        mnemonic: "💡 'Plavix PLAYS with your liver first — it's a PRODRUG.' Omeprazole + Plavix = Bad combo (competing for CYP2C19). 'Omeprazole blocks the activation of Plavix.'",
        sideEffects: "Bleeding, rare TTP (thrombotic thrombocytopenic purpura — emergency), rash",
      },
      {
        name: "Ticagrelor (Brilinta)",
        mechanism: "Also blocks P2Y12 (like clopidogrel) BUT reversible AND doesn't need liver activation — works directly. Faster and more reliable.",
        indications: "ACS (NSTEMI/STEMI), post-PCI stent, prevention of recurrent MI/stroke",
        antidote: "🔴 No specific antidote — platelet transfusion less effective (reversible binding)",
        monitoring: "Watch for SOB/dyspnea (unique side effect!), bleeding, bradycardia",
        nursingPearls: "🔑 TWICE DAILY — very important (short half-life). Unique side effect: SHORTNESS OF BREATH in ~15% — NOT bronchospasm, NOT an allergy. It goes away. Reassure the patient. Do NOT use high-dose aspirin with this (>100mg blunts it). Hold 5 days before surgery.",
        mnemonic: "💡 'Brilinta makes you BREATHLESS — but it's fine!' Dyspnea is unique to ticagrelor. Compare to clopidogrel: 'Ticagrelor = Turbo Plavix — no liver needed, works faster, twice a day, but causes breathlessness.'",
        sideEffects: "Bleeding, DYSPNEA (unique — not bronchospasm), bradycardia, hyperuricemia",
      },
      {
        name: "Abciximab (ReoPro)",
        mechanism: "Blocks the GP IIb/IIIa receptor — the FINAL LOCK that fibrinogen uses to cross-link platelets. Blocks the last step of platelet clumping.",
        indications: "High-risk PCI (cath lab only), refractory unstable angina",
        antidote: "🔴 No specific antidote — platelet transfusion",
        monitoring: "Platelets at 2–4 hrs and 24 hrs after starting (profound thrombocytopenia can happen FAST). Watch for bleeding at all sites.",
        nursingPearls: "🔑 CATH LAB DRUG — IV only, specialty setting. Acute profound thrombocytopenia within hours is possible. Minimize all punctures and invasive procedures. Hold if platelets <100,000 or serious bleeding.",
        mnemonic: "💡 'GP IIb/IIIa = the FINAL DOOR for platelet clumping. Abciximab SLAMS that door shut.' Think: the more endings (-mab, -fibatide, -ban) you see in this class, the more specialty the drug.",
        sideEffects: "Bleeding (main risk), severe acute thrombocytopenia, hypotension",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // ⚡ THROMBOLYTICS
  // ─────────────────────────────────────────────
  {
    id: "thrombolytics",
    name: "Thrombolytics",
    icon: "⚡",
    color: "#e0a85c",
    mnemonic: "🧠 MNEMONIC: 'Thrombolytics = CLOT BUSTERS.' They break clots that already exist — unlike anticoagulants which only PREVENT new ones. Time is everything: 'TIME IS BRAIN, TIME IS MUSCLE.' Remember the suffix: -PLASE (alteplase, tenecteplase, reteplase).",
    overview: "These drugs dissolve existing blood clots. Used in emergencies: stroke, massive PE, heart attack. They work FAST but carry HIGH RISK of major bleeding. Antidote = Aminocaproic Acid (Amicar).",
    drugs: [
      {
        name: "Alteplase (tPA)",
        mechanism: "Activates plasminogen → becomes plasmin → dissolves fibrin clots. Think: 'tPA = Turn Plasminogen Active → it eats the clot.'",
        indications: "Ischemic stroke (within 3–4.5 hrs of symptoms), massive PE, STEMI, clogged IV catheters",
        antidote: "🔴 Aminocaproic Acid (Amicar) — stops fibrinolysis",
        monitoring: "Neuro checks every 15 min during stroke infusion. BP must stay <180/105 during infusion. Watch ALL sites for bleeding.",
        nursingPearls: "🔑 TIME IS BRAIN for stroke — every minute counts. After tPA: NO antiplatelets or anticoagulants for 24 hours. Absolute contraindications: hemorrhagic stroke, active bleeding, recent surgery. ONE dedicated IV line. Pad side rails. Minimize sticks.",
        mnemonic: "💡 'tPA = Time-sensitive Plasminogen Activator.' Stroke: 3–4.5 hour window. After giving: '24-hour NO-GO zone' for blood thinners. If patient bleeds: AMICAR is the antidote.",
        sideEffects: "Intracranial hemorrhage (most feared), major bleeding from any site, angioedema",
      },
      {
        name: "Tenecteplase (TNKase)",
        mechanism: "Modified tPA — more fibrin-specific and longer half-life than alteplase. Single IV bolus instead of an infusion.",
        indications: "STEMI (preferred in many EMS systems — fast single bolus)",
        antidote: "🔴 Aminocaproic Acid (Amicar)",
        monitoring: "Bleeding signs, BP, cardiac rhythm, ST-segment changes (watch for reperfusion)",
        nursingPearls: "🔑 BIG ADVANTAGE over alteplase: single weight-based IV BOLUS (vs. 60-minute infusion) → faster, simpler in field/ER settings. Same contraindications as alteplase. Reperfusion arrhythmias after giving (normal — sign that the clot is dissolving).",
        mnemonic: "💡 'TNKase = ONE and DONE.' Single bolus for STEMI — easy to remember because the 'T' stands for 'Tnke-and-go.' All thrombolytics end in -PLASE or have 'tPA' in the name.",
        sideEffects: "Bleeding (intracranial hemorrhage most serious), reperfusion arrhythmias, hypotension",
      },
      {
        name: "Aminocaproic Acid (Amicar)",
        mechanism: "ANTIFIBRINOLYTIC — it STOPS fibrin clots from dissolving. The opposite of a thrombolytic. Blocks plasminogen activation → clots stay intact.",
        indications: "Antidote/reversal for thrombolytic overdose or excessive bleeding, post-surgical bleeding, hemophilia-related bleeding",
        antidote: "N/A — this IS the antidote for thrombolytics",
        monitoring: "Watch for thrombosis (DVT/PE) — this drug PROMOTES clotting. Check coagulation studies, renal function, CPK (myopathy).",
        nursingPearls: "🔑 Remember: Amicar is the ANTIDOTE to clot busters. If tPA causes a bleed → Amicar stops the fibrinolysis. THROMBOSIS risk — use with caution in patients prone to clots. Infuse IV slowly (hypotension with rapid infusion).",
        mnemonic: "💡 'AMICAR = Anti-Melt-I-Can-Acar' — it stops clots from melting. When thrombolytics go too far, Amicar reins them in. Think: thrombolytics and Amicar are opposites on a seesaw.",
        sideEffects: "Thrombosis (DVT/PE — drug promotes clotting), hypotension with rapid IV, nausea, myopathy with prolonged use",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // ❤️ ACE INHIBITORS
  // ─────────────────────────────────────────────
  {
    id: "ace-inhibitors",
    name: "ACE Inhibitors · -pril",
    icon: "❤️",
    color: "#e05ca0",
    suffix: "-pril",
    suffixNote: "All ACE inhibitors end in -PRIL: lisinopril, enalapril, captopril, ramipril, benazepril. Memory tip: 'ACE = A Cough Ensues' — dry cough is the #1 side effect.",
    mnemonic: "🧠 MNEMONIC: 'ACE = A Cough Ensues.' The dry cough is caused by bradykinin buildup (ACE normally breaks it down). No cough with ARBs (-sartan) because ARBs don't block ACE. Also: 'ACEI = Always Check Electrolytes & creatIne' — hyperkalemia and renal changes are expected.",
    overview: "ACE inhibitors lower blood pressure by blocking the enzyme that makes angiotensin II (a powerful vasoconstrictor). Used for HTN, heart failure, and kidney protection in diabetics. Hallmark: DRY COUGH.",
    drugs: [
      {
        name: "Lisinopril (Zestril/Prinivil)",
        mechanism: "Blocks the ACE enzyme → angiotensin I can't become angiotensin II → vessels relax → BP drops. Also blocks aldosterone → less sodium/water retention. Bradykinin builds up (causes cough).",
        indications: "HTN (first-line), heart failure (reduces deaths), post-MI, diabetic kidney disease",
        antidote: "🔴 No specific antidote. Icatibant for life-threatening angioedema. Stop the drug.",
        monitoring: "BP, potassium (hyperkalemia risk), creatinine (mild rise is OK — expected), persistent dry cough",
        nursingPearls: "🔑 DRY COUGH in 10–15% — caused by bradykinin, not allergy. If unbearable → switch to ARB (losartan). ANGIOEDEMA: rare but life-threatening (swelling of tongue/throat) — most common in Black patients, can appear months or years after starting. First dose hypotension especially if patient is dehydrated. NEVER in pregnancy (Category X — damages fetal kidneys).",
        mnemonic: "💡 'Lisinopril = Listen to the cough.' Dry cough = bradykinin buildup. Angioedema = rare but STOP THE DRUG. Ends in -PRIL. 'Hyper-K, hyper-Cr, hypo-BP' — the three labs to watch.",
        sideEffects: "Dry cough (most common), hyperkalemia, first-dose hypotension, angioedema (rare — life-threatening), kidney impairment, AVOID in pregnancy",
      },
      {
        name: "Enalapril (Vasotec)",
        mechanism: "PRODRUG ACE inhibitor — liver converts it to enalaprilat (the active form). Same mechanism as lisinopril once activated.",
        indications: "HTN, heart failure, asymptomatic LV dysfunction, diabetic kidney disease",
        antidote: "🔴 No specific antidote; supportive care",
        monitoring: "BP (especially with IV form — continuous monitoring), potassium, creatinine, cough",
        nursingPearls: "🔑 PRODRUG — needs the liver to work (unlike lisinopril which is already active). IV form = enalaprilat — used for hypertensive urgency. Twice-daily oral dosing. All same warnings as all ACE inhibitors: no pregnancy, watch K⁺ and creatinine, expect cough, watch for angioedema.",
        mnemonic: "💡 'Enalapril = Ena-PRO-pril.' Prodrug that PROLATES in the liver. Same class, same cough, same precautions as all -prils. If you see -PRIL, think: cough, K⁺, creatinine, no pregnancy.",
        sideEffects: "Dry cough, hyperkalemia, hypotension, angioedema, renal impairment",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 🫀 ARBs
  // ─────────────────────────────────────────────
  {
    id: "arbs",
    name: "ARBs · -sartan",
    icon: "🫀",
    color: "#c05ce0",
    suffix: "-sartan",
    suffixNote: "All ARBs end in -SARTAN: losartan, valsartan, irbesartan, olmesartan, candesartan. Memory tip: 'SARTAN-ly no cough' — ARBs give you the same benefits as ACE inhibitors WITHOUT the dry cough.",
    mnemonic: "🧠 MNEMONIC: 'ARBs = ACE inhibitors without the cough.' They block the angiotensin II receptor directly (instead of blocking production). No bradykinin buildup = NO COUGH. But still: no pregnancy, watch K⁺ and creatinine. Think: 'ARBs = Alternate Route to Block vasoconstriction.'",
    overview: "ARBs block angiotensin II from binding its receptor. Same benefits as ACE inhibitors — lower BP, protect kidneys, help heart failure — but WITHOUT causing a dry cough. Use ARBs when patients can't tolerate ACE inhibitors due to cough.",
    drugs: [
      {
        name: "Losartan (Cozaar)",
        mechanism: "Blocks the AT1 receptor — angiotensin II is made but can't bind and cause vasoconstriction. No ACE blockade = no bradykinin buildup = NO COUGH.",
        indications: "HTN, heart failure (ACE inhibitor intolerant), diabetic kidney disease, stroke prevention in HTN with LVH",
        antidote: "🔴 No specific antidote",
        monitoring: "BP, potassium (same hyperkalemia risk as ACE inhibitors), creatinine, uric acid (losartan lowers it — useful in gout patients)",
        nursingPearls: "🔑 Best choice when patient has ACE inhibitor cough. Same big contraindication: NO PREGNANCY (fetotoxic just like ACE inhibitors). Bonus: losartan lowers uric acid → good for patients with gout. Do NOT combine with ACE inhibitors (dual RAAS blockade = worse kidney outcomes).",
        mnemonic: "💡 'Losartan = Lost the cough.' It's the ACE inhibitor's quieter cousin — same job, no cough. SARTAN = blocks Sartan (angiotensin) receptor. Still avoid in pregnancy. Still watch K⁺.",
        sideEffects: "Hyperkalemia, hypotension, renal impairment, dizziness — notably NO COUGH (key difference from ACE inhibitors), teratogenic",
      },
      {
        name: "Valsartan (Diovan)",
        mechanism: "Selectively blocks AT1 angiotensin II receptors → vasodilation, reduced aldosterone → lower BP. Same as losartan, different molecule.",
        indications: "HTN, heart failure (reduces hospitalizations and death), post-MI LV dysfunction",
        antidote: "🔴 No specific antidote",
        monitoring: "BP, potassium, creatinine, sodium",
        nursingPearls: "🔑 Well-studied in heart failure. Combined with sacubitril → Entresto (sacubitril/valsartan) — now first-line for HFrEF. This combination blocks both RAAS and neprilysin. Same class rules: no pregnancy, watch K⁺ and creatinine, no combo with ACE inhibitors.",
        mnemonic: "💡 'Val-sartan = Valuable in heart failure.' Entresto = sacubitril + VALsartan — the power combo for HFrEF. All -SARTANs = block angiotensin receptor. No cough. No pregnancy.",
        sideEffects: "Hyperkalemia, hypotension, renal impairment, dizziness, teratogenic",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // ⏱️ BETA BLOCKERS
  // ─────────────────────────────────────────────
  {
    id: "beta-blockers",
    name: "Beta Blockers · -olol",
    icon: "⏱️",
    color: "#5c7de0",
    suffix: "-olol",
    suffixNote: "Most beta blockers end in -OLOL: metoprolol, atenolol, carvedilol, propranolol, labetalol, bisoprolol. Memory tip: 'Beta blockers = OH-LOW — lower HR, lower BP, lower cardiac demand.' Ends in -olol = SLOW things down.",
    mnemonic: "🧠 MNEMONIC: 'Beta Blockers BLOCK the stress response.' Beta-1 = heart (1 heart). Beta-2 = lungs (2 lungs). Selective beta-1 blockers (-olol selective) are safer in asthma. Non-selective block BOTH. Remember: 'NEVER stop beta blockers suddenly — TAPER or risk rebound MI.' Antidote = Glucagon.",
    overview: "Beta blockers slow the heart, lower BP, and reduce cardiac workload. Think of them as putting the heart in 'eco mode.' Critical rule: NEVER stop abruptly — always taper. Hold if HR <60 or BP <90/60.",
    drugs: [
      {
        name: "Metoprolol (Lopressor/Toprol XL)",
        mechanism: "Selective β1 blocker (heart-selective) → slows HR, reduces contractility and BP, decreases cardiac oxygen demand. β1 = heart rate down, BP down.",
        indications: "HTN, angina, heart failure (reduces death!), post-MI, A-fib rate control, migraines",
        antidote: "🔴 Glucagon (bypasses the beta receptor — stimulates heart directly)",
        monitoring: "HR before every dose — HOLD if <60. BP — HOLD if <90/60. Blood glucose in diabetics (masks hypoglycemia tachycardia).",
        nursingPearls: "🔑 NEVER stop abruptly — rebound tachycardia and possible MI. TAPER over 1–2 weeks. Masks tachycardia of hypoglycemia (sweating still occurs — check blood sugar). Lopressor = IR (twice daily). Toprol XL = extended release (once daily — don't crush). Caution in asthma/COPD but β1-selective so safer than propranolol.",
        mnemonic: "💡 'Metoprolol slows the Metro (heart) — it's β1 selective (1 heart).' Hold rule: '60/90' — hold if HR <60 or BP <90. NEVER stop suddenly. 'Metoprolol Meticulously Monitors the heart.'",
        sideEffects: "Bradycardia, hypotension, fatigue, depression, sexual dysfunction, bronchospasm (at high doses), MASKS hypoglycemia tachycardia",
      },
      {
        name: "Carvedilol (Coreg)",
        mechanism: "Non-selective β1 + β2 blocker AND α1 blocker → slows heart AND dilates blood vessels. More BP lowering than pure beta blockers.",
        indications: "Heart failure (first-line — proven mortality benefit), post-MI LV dysfunction, HTN",
        antidote: "🔴 Glucagon",
        monitoring: "HR (hold if <60), BP — extra caution for orthostatic hypotension (α-block causes vasodilation). Daily weight for fluid retention.",
        nursingPearls: "🔑 Take WITH FOOD — reduces peak plasma level, decreases orthostatic hypotension risk. HIGH orthostatic hypotension: tell patient to rise slowly. One of three beta blockers proven to reduce death in heart failure (with metoprolol succinate and bisoprolol). Double duty: blocks β AND α.",
        mnemonic: "💡 'COReg = CORe heart failure drug.' It's the triple blocker: β1 + β2 + α1. 'Carvedilol Covers everything — beta AND alpha.' Take with food. Rise slowly. Ends in -olol.",
        sideEffects: "Orthostatic hypotension (more than other beta blockers), bradycardia, fatigue, weight gain, dizziness",
      },
      {
        name: "Propranolol (Inderal)",
        mechanism: "Non-selective β1 + β2 blocker — slows heart AND blocks lung β2 receptors → bronchospasm risk. Also reduces renin → additional BP lowering.",
        indications: "HTN, angina, A-fib rate control, essential tremor, migraine prevention, performance anxiety, hyperthyroidism symptoms, pheochromocytoma (after alpha blocker first!)",
        antidote: "🔴 Glucagon",
        monitoring: "HR, BP, respiratory status (bronchospasm risk!), blood glucose (masks hypoglycemia), triglycerides",
        nursingPearls: "🔑 NON-SELECTIVE = CONTRAINDICATED in asthma/COPD (blocks β2 = bronchospasm). Use metoprolol instead in those patients. For pheochromocytoma: ALWAYS give an alpha blocker FIRST — giving propranolol alone can trigger hypertensive crisis (unopposed alpha stimulation). Used for stage fright — blocks the physical symptoms of anxiety.",
        mnemonic: "💡 'Propranolol = PRO-panic stopper' — used for anxiety/tremor/migraines. BUT 'PROP-STOP for asthma patients' — don't use (non-selective). Pheo rule: 'Alpha before Beta — A before B.' Ends in -olol.",
        sideEffects: "Bronchospasm (AVOID in asthma/COPD), bradycardia, fatigue, depression, cold extremities, masks hypoglycemia",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 💗 CALCIUM CHANNEL BLOCKERS
  // ─────────────────────────────────────────────
  {
    id: "calcium-channel-blockers",
    name: "Calcium Channel Blockers",
    icon: "💗",
    color: "#e07b5c",
    suffix: "-dipine (DHP) or non-DHP (verapamil, diltiazem)",
    suffixNote: "Dihydropyridines (DHPs) end in -DIPINE: amlodipine, nifedipine, nicardipine — primarily lower BP (vascular). Non-DHPs (verapamil, diltiazem) — slow heart rate AND lower BP. Think: '-dipine = BP, non-DHP = rate + BP.'",
    mnemonic: "🧠 MNEMONIC: 'CCBs = Calcium Can't flow → vessels relax, heart slows.' Two types: DHP (-dipine) = mostly VESSELS. Non-DHP (verapamil/diltiazem) = VESSELS + HEART RATE. Non-DHPs CONTRAINDICATED in heart failure (depress the heart). All CCBs: avoid grapefruit juice (CYP3A4 — increases drug levels).",
    overview: "Calcium channel blockers prevent calcium from entering heart and vessel cells → relaxation and vasodilation. DHPs are vascular-selective (BP). Non-DHPs also slow HR and AV conduction (rate control). Do NOT combine non-DHPs with beta blockers IV — risk of fatal heart block.",
    drugs: [
      {
        name: "Amlodipine (Norvasc)",
        mechanism: "DHP — blocks calcium channels in blood vessels ONLY (vascular-selective) → vessels relax → BP drops. Minimal effect on heart rate.",
        indications: "HTN (first-line), chronic stable angina, Prinzmetal (vasospastic) angina",
        antidote: "🔴 Calcium gluconate/chloride (high-dose), glucagon, vasopressors for severe overdose",
        monitoring: "BP (primary), peripheral edema (most common complaint), HR (minimal change expected)",
        nursingPearls: "🔑 PERIPHERAL EDEMA is the #1 complaint — not a sign of heart failure, just vasodilation pooling fluid in legs. Elevate legs, use compression socks. Long half-life = once daily dosing = gradual, steady BP control. Safe in asthma/COPD. GRAPEFRUIT JUICE increases drug levels via CYP3A4 — avoid.",
        mnemonic: "💡 'Amlodipine = Amps up your legs with EDEMA.' DHP = vessels only = -dipine. 'AMLO = A Most Lovely drug for BP — no heart rate change, just edema.' Grapefruit = forbidden with CCBs.",
        sideEffects: "Peripheral edema (most common), flushing, headache, reflex tachycardia (more with nifedipine), gingival hyperplasia (gum overgrowth with long-term use)",
      },
      {
        name: "Diltiazem (Cardizem)",
        mechanism: "Non-DHP — blocks calcium in BOTH blood vessels AND the heart's conduction system → vasodilation + slowed HR + slowed AV conduction (rate control for A-fib).",
        indications: "A-fib/flutter rate control, SVT, stable and vasospastic angina, HTN",
        antidote: "🔴 Calcium gluconate, glucagon, atropine for bradycardia, pacemaker if needed",
        monitoring: "HR (hold if <60), BP, ECG (watch PR interval — AV block), LFTs",
        nursingPearls: "🔑 NON-DHP = rate + BP. DO NOT combine with IV beta blockers — additive bradycardia and heart block risk. CONTRAINDICATED in heart failure with reduced EF (HFrEF) — negative inotropy worsens pumping. IV form for acute A-fib rate control. Many drug interactions via CYP3A4.",
        mnemonic: "💡 'DiLTIazem = Dilutes the rate AND the BP.' Non-DHP = Diltiazem and verapamil = heart rate AND vessels. Think: 'D and V = Diltiazem and Verapamil = rate + BP (Double duty).' AVOID in HF and with IV beta blockers.",
        sideEffects: "Bradycardia, AV block, hypotension, constipation, edema, elevated LFTs",
      },
      {
        name: "Verapamil (Calan/Isoptin)",
        mechanism: "Non-DHP — MOST cardio-selective CCB → strongest heart rate slowing and AV node suppression + vasodilation. Strongest negative inotropy of all CCBs.",
        indications: "A-fib/flutter rate control, SVT (IV — drug of choice if adenosine fails), HTN, angina, hypertrophic cardiomyopathy, cluster headache prevention",
        antidote: "🔴 Calcium gluconate (IV), glucagon, atropine, pacemaker",
        monitoring: "HR (hold if <60), BP, PR interval (AV block), constipation, LFTs",
        nursingPearls: "🔑 CONSTIPATION is almost universal — most constipating of all CCBs. CONTRAINDICATED in HFrEF (most negative inotrope — will worsen HF). CONTRAINDICATED in WPW + A-fib (can trigger V-fib via accessory pathway). NEVER give IV verapamil + IV beta blockers simultaneously — fatal heart block. Have resuscitation ready when giving IV.",
        mnemonic: "💡 'VERApamil VERy Constipating.' Remember VERApamil: Ventricular WPW = DANGER (contraindicated). EF reduced = DANGER (contraindicated). Rate control A-fib = GOOD. 'VERA = Very bradycardic, Very constipating, Very dangerous in HF.'",
        sideEffects: "Bradycardia, AV block, hypotension, CONSTIPATION (most of all CCBs), HF exacerbation, flushing",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // ⚡ ANTIARRHYTHMICS & NITRATES
  // ─────────────────────────────────────────────
  {
    id: "antiarrhythmics",
    name: "Antiarrhythmics & Nitrates",
    icon: "⚡",
    color: "#e0c05c",
    mnemonic: "🧠 MNEMONIC for Antiarrhythmics by class: 'Some Block Potassium Channels' → Class I (Na⁺ blockers — lidocaine, quinidine), Class II (Beta blockers — -olol), Class III (K⁺ blockers — amiodarone, sotalol), Class IV (CCBs — diltiazem, verapamil). For nitrates: 'NTG = No-Tight-Guys (vessels)' — it relaxes vessels and reduces cardiac workload.",
    overview: "Antiarrhythmics correct abnormal heart rhythms. Nitrates relax blood vessels to relieve angina and reduce cardiac workload. Most important NCLEX drugs here: Amiodarone (multi-organ toxicity) and Nitroglycerin (no PDE-5 inhibitors!).",
    drugs: [
      {
        name: "Amiodarone (Cordarone/Pacerone)",
        mechanism: "Class III — mainly blocks K⁺ channels (prolongs QT/repolarization). ALSO has Class I, II, and IV properties. It does EVERYTHING. Think of amiodarone as the 'swiss army knife of antiarrhythmics.'",
        indications: "Life-threatening V-fib and V-tach, A-fib rate/rhythm control, ACLS protocol (cardiac arrest)",
        antidote: "🔴 No specific antidote — supportive care, stop the drug",
        monitoring: "📋 Annual: TFTs (thyroid), LFTs (liver), PFTs + CXR (lungs), ophthalmology (eyes). QTc interval. Skin changes.",
        nursingPearls: "🔑 TOXICITY IS EVERYWHERE — lung (most serious), thyroid (hypo AND hyper — has 37% iodine), liver, eyes (corneal deposits — benign), skin (blue-gray discoloration — irreversible). Half-life = 40–55 DAYS — effects persist long after stopping. Increases warfarin dramatically → reduce warfarin dose 30–50%. Teach: wear sunscreen every day.",
        mnemonic: "💡 'AMIODARONE = PALE + PROBLEMS': Pulmonary toxicity, Arrhythmias (QT), Liver toxicity, Eyes (corneal deposits), thyroid (hypo/hyper). 'PALE skin from blue-gray discoloration.' Annual monitoring on all 5 organs. Half-life = 40–55 days — it lingers forever.",
        sideEffects: "Pulmonary toxicity (most serious), hypo/hyperthyroidism, hepatotoxicity, QT prolongation, corneal deposits, blue-gray skin, photosensitivity, bradycardia",
      },
      {
        name: "Adenosine (Adenocard)",
        mechanism: "Briefly stops the AV node → resets a short-circuit (reentrant SVT) → normal rhythm restores. Half-life = <10 seconds. It's like rebooting the heart.",
        indications: "SVT/PSVT (first-line IV), diagnostic tool to expose A-flutter or A-fib",
        antidote: "🔴 Theophylline/caffeine block its effects. Self-limiting — wears off in seconds.",
        monitoring: "Continuous cardiac monitoring. BP. IV site patency (must be a large vein with fast flush).",
        nursingPearls: "🔑 Must be given as RAPID IV PUSH into antecubital or above — followed immediately by 20mL saline rapid flush (drug degrades in seconds). WARN patient: 'You will feel chest pressure, flushing, and a sense of doom — it lasts only seconds and is NORMAL.' Brief asystole = expected (AV node resets). Caffeine and theophylline block it (ask about recent coffee intake).",
        mnemonic: "💡 'Adenosine = ADENO-STOP the heart (briefly).' 10-second half-life. 'FLUSH it FAST.' Doom feeling = normal. 'REBOOT for SVT.' Caffeine = enemy of adenosine.",
        sideEffects: "Transient asystole (EXPECTED — normal), chest tightness, flushing, dyspnea, sense of doom (all last seconds only)",
      },
      {
        name: "Digoxin (Lanoxin)",
        mechanism: "Blocks Na/K pump → calcium builds up inside heart cells → heart squeezes stronger (positive inotropy). Also stimulates vagus nerve → slows heart rate (negative chronotropy). Think: 'Digoxin = Dig-in deeper squeeze + slow rate.'",
        indications: "Heart failure (improves symptoms — does NOT reduce mortality), A-fib rate control",
        antidote: "🔴 Digoxin Immune Fab (Digibind / DigiFab) — binds digoxin molecules and removes them",
        monitoring: "Serum digoxin level (therapeutic: 0.5–2 ng/mL; HF: target 0.5–0.9). Potassium (CRITICAL — hypokalemia = toxicity). Renal function. Apical pulse 1 full minute.",
        nursingPearls: "🔑 NARROW THERAPEUTIC INDEX — tiny margin between therapeutic and toxic. HOLD if apical HR <60 (always count for full minute). Hypokalemia + digoxin = TOXICITY (furosemide washes out K⁺ → digoxin toxicity cascade). Toxicity signs = 'Bad GI + Yellow Vision + Slow Heart': nausea/vomiting (first sign), yellow-green halos, bradycardia, dysrhythmias.",
        mnemonic: "💡 'Dig-it-out toxicity: Nausea, Yellow vision, Slow HR — DIG triad.' Antidote = DigiBIND (binds digoxin). Furosemide steals K⁺ → low K⁺ → digoxin toxicity. Remember: 'LOW K⁺ = HIGH dig toxicity risk.' Narrow therapeutic index — check the level!",
        sideEffects: "TOXICITY: bradycardia (first cardiac sign), GI nausea/vomiting (first overall sign), yellow-green visual halos, life-threatening dysrhythmias",
      },
      {
        name: "Nitroglycerin (NTG)",
        mechanism: "Converts to nitric oxide (NO) → vessel smooth muscle relaxes → veins dilate (reduces preload) + coronary arteries dilate (more O₂ to heart). Think: 'NTG = No Tightness in chest (nitric oxide opens vessels).'",
        indications: "Acute angina (SL tablets), ACS, IV for HTN emergency and acute HF with pulmonary edema",
        antidote: "🔴 No antidote. ABSOLUTE contraindication: PDE-5 inhibitors (sildenafil/Viagra, tadalafil/Cialis, vardenafil/Levitra) — profound life-threatening hypotension.",
        monitoring: "BP (hold if systolic <90 — hypotension is the main risk). HR. Headache. Pain relief.",
        nursingPearls: "🔑 SL: up to 3 tablets, 5 min apart — if no relief after 3 doses → call 911 (likely MI). HEADACHE is expected and very common (vasodilation) — NOT a reason to stop. Store in original DARK GLASS bottle (light and heat degrade NTG). Nitrate tolerance with patches — use nitrate-FREE interval 8–12 hrs/day (remove patch at night). IV: use non-PVC tubing (NTG absorbs into plastic).",
        mnemonic: "💡 'NTG = No Tight Vessels, NO Viagra combo.' 3-5-911 rule: 3 tablets, 5 min apart, call 911. Headache = expected. Dark bottle = required. 'NTG + Viagra = BP CRASH.' Non-PVC tubing for IV.",
        sideEffects: "Headache (most common — expected), hypotension, reflex tachycardia, dizziness, flushing, nitrate tolerance with continuous use",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 💧 DIURETICS
  // ─────────────────────────────────────────────
  {
    id: "diuretics",
    name: "Diuretics",
    icon: "💧",
    color: "#5cc4e0",
    mnemonic: "🧠 MNEMONIC: Diuretics = 'pee drugs.' They remove excess fluid. Three main types: Loop (furosemide — most powerful, wastes K⁺), Thiazide (HCTZ — mild, wastes K⁺), Potassium-sparing (spironolactone — keeps K⁺). 'Loop Loses potassium. Spiro Saves it.' Never combine potassium-sparing with K⁺ supplements without watching labs.",
    overview: "Diuretics increase urine output to reduce fluid overload and lower BP. The most important thing to remember: potassium! Loop and thiazide diuretics waste K⁺ (hypokalemia risk). Potassium-sparing diuretics KEEP K⁺ (hyperkalemia risk).",
    drugs: [
      {
        name: "Furosemide (Lasix)",
        mechanism: "Loop diuretic — blocks Na/K/2Cl transporter in the kidney's Loop of Henle → massive water excretion. Most powerful diuretic. Think: 'Lasix = Lasts 6 hours, Loses potassium.'",
        indications: "Edema (heart failure, renal disease, liver disease), hypertensive emergency, acute pulmonary edema, hypercalcemia",
        antidote: "🔴 No specific antidote — replace fluids and electrolytes",
        monitoring: "Potassium (hypokalemia!), sodium, magnesium, BUN/creatinine, urine output, daily weights",
        nursingPearls: "🔑 Give in MORNING (or early afternoon) — avoids nocturia and interrupted sleep. POTASSIUM WASTING — supplement K⁺ or combine with potassium-sparing diuretic. Sulfa allergy cross-reactivity possible. IV high doses → ototoxicity (ringing/hearing loss). Weigh patient daily — 1 kg weight loss = ~1 L of fluid removed.",
        mnemonic: "💡 'LASIX = Lasts About 6-hours, X-pells water, K lost.' Three E's of Lasix side effects: Electrolyte loss, Ear damage (ototoxicity), Extra urination. Daily WEIGHT is your best fluid monitoring tool: 1 kg = 1 L.",
        sideEffects: "Hypokalemia (most common!), hyponatremia, dehydration/hypotension, ototoxicity (high IV doses), hyperuricemia (gout risk)",
      },
      {
        name: "Spironolactone (Aldactone)",
        mechanism: "Blocks aldosterone receptors in collecting duct → kidney KEEPS potassium and LOSES sodium. Opposite of furosemide. Think: 'Spiro SPARES potassium.'",
        indications: "Heart failure (reduces death — RALES trial), hyperaldosteronism, edema from liver cirrhosis/ascites, HTN, preventing hypokalemia",
        antidote: "🔴 No specific antidote — stop drug, correct K⁺",
        monitoring: "POTASSIUM (hyperkalemia risk — very important!), creatinine, BP, watch for gynecomastia in men",
        nursingPearls: "🔑 POTASSIUM SPARING = do NOT add K⁺ supplements or eat loads of K⁺-rich foods unless directed. Avoid NSAIDs (reduce effectiveness AND raise K⁺). GYNECOMASTIA in men (anti-androgenic — mimics estrogen). Takes several weeks to see full heart failure benefit.",
        mnemonic: "💡 'Spiro SPARES K⁺ — so Spare the K⁺ supplements!' Gynecomastia in men = anti-androgen effect. 'Spiro = Saves Potassium, Shrinks testosterone effects.' Opposite of furosemide: Lasix Loses, Spiro Saves.",
        sideEffects: "Hyperkalemia (KEY risk), gynecomastia/breast tenderness in men, menstrual irregularities in women, hypotension",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 🦠 ANTIBIOTICS
  // ─────────────────────────────────────────────
  {
    id: "antibiotics",
    name: "Antibiotics",
    icon: "🦠",
    color: "#7ec87e",
    mnemonic: "🧠 MNEMONIC: 'Antibiotics = Match the Bug.' Always culture before giving if possible. Key nursing concerns: allergies (penicillin cross-reacts with cephalosporins ~10%), C. diff risk with any antibiotic, and completing the full course. Remember: '-mycin' = often ototoxic/nephrotoxic (aminoglycosides). '-floxacin' = tendon rupture risk. 'Van' (vancomycin) = Red Man if given too fast.",
    overview: "Antibiotics kill or slow the growth of bacteria. Each class has a specific mechanism. NCLEX focuses on: allergy cross-reactivity, monitoring for toxicity, patient teaching (complete the course!), and recognizing antibiotic-specific dangers.",
    drugs: [
      {
        name: "Vancomycin",
        mechanism: "Blocks cell wall building in gram-positive bacteria by binding to the peptidoglycan chain's building blocks. Only works on gram-POSITIVE bugs (MRSA, MRSE, C. diff orally).",
        indications: "MRSA infections (IV), C. difficile colitis (oral — stays in gut), serious gram-positive infections when penicillin is contraindicated",
        antidote: "🔴 No specific antidote — supportive care, dialysis for severe toxicity",
        monitoring: "Vancomycin trough levels (10–20 mcg/mL) OR AUC monitoring. BUN/creatinine (nephrotoxicity — especially with aminoglycosides). Hearing (ototoxicity). Infusion site.",
        nursingPearls: "🔑 Infuse over AT LEAST 60 MINUTES — faster infusion causes RED MAN SYNDROME (flushing, rash, itching, hypotension — NOT an allergy — it's histamine release). Treat Red Man by slowing/stopping infusion + diphenhydramine. Narrow therapeutic index. Most nephrotoxic when combined with aminoglycosides.",
        mnemonic: "💡 'Vancomycin: VAN = Very Attentive Nursing needed.' RED MAN = rate-related (not allergy) — slow the infusion. 'Van kills gram-positive bugs (MRSA). Goes SLOW (60 min). Watch kidneys and ears.' Nephrotoxic + ototoxic = the toxic duo.",
        sideEffects: "Red Man Syndrome (rate-related, not allergy!), nephrotoxicity, ototoxicity, thrombophlebitis at IV site",
      },
      {
        name: "Ciprofloxacin (Cipro)",
        mechanism: "Fluoroquinolone — jams bacterial DNA-copying enzymes (DNA gyrase, topoisomerase IV) → bacteria can't replicate. Broad-spectrum, especially gram-negative coverage.",
        indications: "UTIs, respiratory infections, GI infections, bone/joint infections, anthrax prophylaxis, traveler's diarrhea",
        antidote: "🔴 No specific antidote",
        monitoring: "Renal function, tendon pain/swelling (especially Achilles), blood glucose in diabetics (can cause dysglycemia), QTc interval",
        nursingPearls: "🔑 BLACK BOX WARNING: tendinitis and tendon RUPTURE (especially Achilles) — tell patient to stop and report joint pain. Also: peripheral neuropathy and CNS effects (dizziness, seizures). AVOID in children <18 (damages growing cartilage). Separate from dairy, antacids, calcium, iron by 2 hours (chelation reduces absorption). Fluoroquinolones end in -FLOXACIN.",
        mnemonic: "💡 'Cipro Cuts Tendons' — BBW for tendon rupture. '-FLOXACIN = FLEXion problems (tendons!).' Cipro + dairy = less absorbed (take 2 hrs apart). 'Cipro Considers: no kids, no tendons, no dairy at same time.' QT prolongation — another reason to check the ECG.",
        sideEffects: "Tendon rupture (BBW), peripheral neuropathy (BBW), QT prolongation, photosensitivity, dysglycemia, C. diff risk",
      },
      {
        name: "Metronidazole (Flagyl)",
        mechanism: "Enters anaerobic bacteria/protozoa → creates toxic free radicals → destroys DNA. Only works in low-oxygen environments (anaerobes, parasites).",
        indications: "C. difficile (mild-moderate), anaerobic infections, H. pylori (triple therapy), Trichomonas, bacterial vaginosis, amoebiasis",
        antidote: "🔴 No specific antidote — supportive care",
        monitoring: "Liver function (hepatic metabolism), CBC with long use, neurological symptoms (peripheral neuropathy), alcohol use history",
        nursingPearls: "🔑 NO ALCOHOL during treatment AND 48–72 HOURS AFTER — disulfiram-like reaction (severe nausea, vomiting, flushing, tachycardia — feels like the worst hangover). Metallic taste is common and normal. Urine may turn DARK REDDISH-BROWN — reassure patient (harmless). Crosses blood-brain barrier (useful for brain abscesses).",
        mnemonic: "💡 'Flagyl = FLAG the alcohol — no drinking!' DISULFIRAM reaction = violent illness with alcohol. 'Metal mouth + dark pee + no booze = Flagyl.' 48–72 hrs AFTER last dose too — must warn. 'Flagyl FLAGGED alcohol for 3 days after stopping.'",
        sideEffects: "Metallic taste, nausea, disulfiram-like reaction with alcohol (MAJOR teaching point!), dark urine (harmless), peripheral neuropathy (long-term)",
      },
      {
        name: "Amoxicillin-Clavulanate (Augmentin)",
        mechanism: "Amoxicillin (penicillin) kills bacteria by blocking cell wall building. Clavulanate is a 'bodyguard' — it blocks beta-lactamase enzymes that resistant bacteria use to destroy amoxicillin.",
        indications: "Sinusitis, ear infections (otitis media), bite wounds, skin infections, pneumonia, UTIs",
        antidote: "🔴 No specific antidote — stop drug for severe reactions",
        monitoring: "Allergic reactions (especially first dose — anaphylaxis risk). Diarrhea (C. diff risk). Liver function (cholestatic hepatitis — rare).",
        nursingPearls: "🔑 PENICILLIN ALLERGY: cross-reactivity with cephalosporins (~10%) and carbapenems (<1%). ALWAYS ask about penicillin allergy before giving. Take WITH FOOD — reduces GI upset and improves absorption. Diarrhea is common — probiotics may help. Full course must be completed even if patient feels better.",
        mnemonic: "💡 'Augmentin = AUGMENTED penicillin (with clavulanate bodyguard).' Clavulanate = the shield against beta-lactamase resistance. Penicillin allergy cross-reacts: 'Pen → Ceph cross 10%, Pen → Carbapenem cross <1%.' Take with food. Complete the course.",
        sideEffects: "Diarrhea (very common!), nausea, rash, C. difficile, cholestatic jaundice (rare), anaphylaxis (allergy)",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 🎯 PAIN & OPIOIDS
  // ─────────────────────────────────────────────
  {
    id: "analgesics",
    name: "Pain & Opioids",
    icon: "🎯",
    color: "#c47ee0",
    mnemonic: "🧠 MNEMONIC: 'Opioids = ABC side effects: Altered mental status, Bowel issues (constipation), Constricted pupils.' Antidote = NALOXONE (Narcan). If RR <12 and hard to arouse → give Narcan NOW. Constipation is ALWAYS treated prophylactically — don't wait for it. Tolerance ≠ addiction (different concepts!).",
    overview: "Opioids bind pain receptors in the brain and spinal cord to relieve severe pain. They are effective but have serious risks: respiratory depression (the killer), constipation (universal), and dependence. The reversal agent is Naloxone (Narcan) — always have it available.",
    drugs: [
      {
        name: "Morphine Sulfate",
        mechanism: "Binds to mu (μ) opioid receptors in the CNS → blocks pain signals, causes sedation and euphoria. Also causes histamine release → itching.",
        indications: "Moderate-to-severe pain, acute pulmonary edema (reduces preload and anxiety), MI pain, palliative/end-of-life dyspnea",
        antidote: "🔴 Naloxone (Narcan) — competitive opioid antagonist",
        monitoring: "Respiratory rate (hold if <12/min). Sedation level. Pain score. Bowel function. O₂ saturation.",
        nursingPearls: "🔑 ALWAYS assess respiratory rate BEFORE giving. Have Narcan at bedside. CONSTIPATION = universal — start bowel regimen (stool softener + stimulant laxative) from day one, don't wait. ITCHING (pruritus) = histamine release, NOT allergy — treat with diphenhydramine. URINARY RETENTION = can't pee. Causes miosis (pinpoint pupils).",
        mnemonic: "💡 'Morphine = DOSE: Decrease RR, Obstipation (constipation), Sedation, Eyes pinpoint (miosis).' Constipation is 100% of patients — treat before it starts. Itching ≠ allergy. Antidote = Narcan.",
        sideEffects: "Respiratory depression (most dangerous!), constipation (most common — universal), urinary retention, nausea, sedation, pruritus (itching — not allergy), miosis (pinpoint pupils), hypotension",
      },
      {
        name: "Naloxone (Narcan)",
        mechanism: "Kicks opioids off their receptors (competitive antagonist) → REVERSES respiratory depression, sedation, and analgesia — fast. Works in minutes.",
        indications: "Opioid overdose reversal, opioid-induced respiratory depression, opioid reversal at end of surgery",
        antidote: "N/A — THIS IS the antidote for opioids",
        monitoring: "Respiratory rate and LOC after giving — watch for RE-NARCOTIZATION (opioid outlasts naloxone!). Pain level (reversal of analgesia). Withdrawal signs in dependent patients.",
        nursingPearls: "🔑 HALF-LIFE = 30–90 MIN — SHORTER than most opioids → patient can relapse into overdose after Narcan wears off! Monitor closely and repeat doses as needed. In opioid-dependent patients: Narcan triggers ACUTE WITHDRAWAL (agitation, hypertension, tachycardia, vomiting, seizures). Nasal spray available for community use.",
        mnemonic: "💡 'Narcan = NARCs Can't work anymore.' But: 'Narcan wears off BEFORE the opioid — keep watching!' RE-NARCOTIZATION is the trap. 'Give Narcan → feel better → Narcan wears off → opioid comes back.' Monitor 2–4 hours.",
        sideEffects: "Acute opioid withdrawal in dependent patients (very distressing), reversal of all analgesia (pain returns), pulmonary edema (rare), hypertension, tachycardia",
      },
      {
        name: "Ketorolac (Toradol)",
        mechanism: "NSAID — blocks COX-1 and COX-2 → less prostaglandin → less pain and inflammation. No opioid receptor activity — no sedation, no respiratory depression.",
        indications: "Short-term moderate-to-severe acute pain (post-op, renal colic), opioid-sparing strategy",
        antidote: "🔴 No specific antidote",
        monitoring: "Renal function (BUN/creatinine), GI symptoms, bleeding signs, BP",
        nursingPearls: "🔑 MAX 5 DAYS — GI and renal toxicity increases with longer use. CONTRAINDICATED: active GI bleeding, renal impairment, coagulopathy, CABG surgery. No sedation or respiratory depression = great for post-op pain without dulling the patient. Still inhibits platelets — watch for bleeding.",
        mnemonic: "💡 'Toradol = Total 5 days only — then STOP.' 5-day limit. No opioid side effects. But same NSAID rules: GI bleed risk, kidney risk, no combining with other NSAIDs. 'Toradol = Tough on pain, Tough on kidneys after 5 days.'",
        sideEffects: "GI bleeding/ulceration, renal impairment, bleeding (platelet inhibition), HTN, edema — NO sedation/respiratory depression",
      },
      {
        name: "Acetaminophen (Tylenol)",
        mechanism: "Blocks prostaglandins in the CNS → reduces pain and fever. Does NOT reduce inflammation peripherally (unlike NSAIDs). Works in the brain, not the body.",
        indications: "Mild-to-moderate pain, fever, adjunct for moderate-severe pain (reduces opioid needs), safe in pregnancy",
        antidote: "🔴 N-Acetylcysteine (NAC / Mucomyst) — most effective within 8 hours of overdose",
        monitoring: "Total daily dose from ALL sources (hidden in combo drugs!). Liver function.",
        nursingPearls: "🔑 MAX 4g/day healthy adults. MAX 2g/day in elderly, liver disease, or heavy alcohol users. HIDDEN IN COMBINATION PRODUCTS: Percocet, Vicodin, NyQuil, DayQuil, many cold medicines — always add up ALL sources of acetaminophen. Overdose = #1 cause of acute liver failure in the US. NAC most effective within 8–10 hours.",
        mnemonic: "💡 '4 grams = your daily LIMIT for Tylenol.' '2 grams if you drink or have liver issues.' HIDDEN TYLENOL in combo drugs = the danger. 'NAC = N-Acetylcysteine reverses the damage if given early.' SAFE in pregnancy (unlike NSAIDs).",
        sideEffects: "Hepatotoxicity (overdose — dose-dependent), rare rash — extremely well-tolerated at therapeutic doses",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 🧠 PSYCH MEDS
  // ─────────────────────────────────────────────
  {
    id: "psych",
    name: "Psych Meds",
    icon: "🧠",
    color: "#e0c05c",
    mnemonic: "🧠 MNEMONIC for psych meds: 'HALT before giving.' H = Hold parameters (lithium levels, HR for beta blockers). A = Antidotes and reversals (flumazenil for benzos, leucovorin for MTX). L = Lab monitoring (lithium, clozapine CBC, etc.). T = Teach patient about withdrawal (never stop benzos or antidepressants abruptly). Key danger drugs: Lithium (narrow index), Benzodiazepines (dependence + withdrawal seizures), SSRIs (suicidal ideation in youth).",
    overview: "Psychiatric medications treat mental health conditions but require careful monitoring. Many have narrow therapeutic windows (lithium), serious withdrawal risks (benzodiazepines, antidepressants), and important drug interactions. Always ask about suicidal ideation when starting antidepressants.",
    drugs: [
      {
        name: "Lithium Carbonate",
        mechanism: "Exact mechanism unknown — stabilizes mood by modulating multiple neurotransmitters (serotonin, norepinephrine) and intracellular signaling. Gold standard for bipolar.",
        indications: "Bipolar disorder (mania AND maintenance), augmentation of antidepressants",
        antidote: "🔴 No specific antidote — hemodialysis for severe toxicity. Stop the drug.",
        monitoring: "Lithium level (therapeutic: 0.6–1.2 mEq/L — check 12 hrs after last dose). TSH (thyroid). BUN/Cr (renal). ECG. Levels q3–6 months when stable.",
        nursingPearls: "🔑 NARROW THERAPEUTIC INDEX — tiny margin. Early toxicity: fine tremor, nausea, polyuria, mild confusion. Severe toxicity: coarse tremor, ataxia, seizures, coma. Dehydration = toxicity (sodium depletion causes lithium retention). NSAIDs raise lithium levels (dangerous). Keep salt and fluid CONSISTENT. Teach: report tremor, diarrhea, confusion.",
        mnemonic: "💡 'Lithium levels Low = not effective. Lithium levels High = TOXIC.' Toxicity mnemonic: 'DRAIN' — Diarrhea, Reduced coordination (ataxia), Altered mental status, Irregular tremor (coarse), Nausea. DEHYDRATION increases toxicity — drink consistent fluids. NSAIDs are the enemy.",
        sideEffects: "Tremor, polyuria/polydipsia (peeing and drinking a lot), weight gain, hypothyroidism (long-term), acne, Ebstein's anomaly (teratogen in first trimester)",
      },
      {
        name: "Haloperidol (Haldol)",
        mechanism: "Typical (first-generation) antipsychotic — blocks D2 dopamine receptors → reduces psychosis but also blocks dopamine in motor pathways → movement side effects (EPS).",
        indications: "Schizophrenia, acute psychosis/agitation, Tourette syndrome, delirium (ICU)",
        antidote: "🔴 No specific antidote. EPS treated with benztropine (Cogentin) or diphenhydramine (Benadryl).",
        monitoring: "EPS symptoms (muscle stiffness, restlessness, shuffling gait). QTc interval (especially IV). Vital signs for NMS.",
        nursingPearls: "🔑 EPS (Extrapyramidal Symptoms) — the big side effect group: (1) Acute dystonia = sudden muscle spasm/torticollis — TREAT with benztropine or diphenhydramine. (2) Akathisia = can't sit still, constant restless movement. (3) Pseudoparkinsonism = shuffling gait, pill-rolling tremor, rigidity. (4) Tardive dyskinesia = late-onset involuntary movements — IRREVERSIBLE. NMS = Neuroleptic Malignant Syndrome: high fever + rigidity + altered LOC + autonomic instability — LIFE-THREATENING EMERGENCY.",
        mnemonic: "💡 'HALDOL = High Alert for EPS.' EPS mnemonic: 'ADAPT' — Acute dystonia, Drug-induced parkinsonism, Akathisia, Persistent tardive dyskinesia, Tardive = irreversible. NMS = 'FEVER + FREEZE + ALTERED' — hyperthermia, rigidity, confusion. Antidote for EPS = Benzo or Benztropine.",
        sideEffects: "EPS (dystonia, akathisia, pseudoparkinsonism, tardive dyskinesia), NMS (life-threatening), QT prolongation, sedation, orthostatic hypotension",
      },
      {
        name: "Sertraline (Zoloft)",
        mechanism: "SSRI — blocks the reuptake pump for serotonin → serotonin stays in the synapse longer → mood improves. Takes 2–6 weeks to feel the full effect.",
        indications: "Major depression, OCD, panic disorder, PTSD, social anxiety, PMDD, generalized anxiety",
        antidote: "🔴 No specific antidote. Serotonin syndrome: stop drug, supportive care, cyproheptadine.",
        monitoring: "Suicidal ideation (especially first 1–4 weeks, especially patients <25). Weight. Sexual dysfunction. Serotonin syndrome signs if combined with other serotonergic drugs.",
        nursingPearls: "🔑 BLACK BOX WARNING: increased suicidal thinking in children, teens, and young adults — monitor closely in first weeks, especially at dose changes. Takes 2–6 weeks for full antidepressant effect — patient may feel worse before better. NEVER stop abruptly — discontinuation syndrome (dizziness, shock-like sensations, flu-like symptoms). SEROTONIN SYNDROME if combined with MAOIs (14-day washout needed), tramadol, linezolid, triptans.",
        mnemonic: "💡 'Zoloft = SLOW to work (2–6 weeks) but STOP slowly too.' BBW: suicidal ideation in young patients — MONITOR week 1–4. 'Serotonin Syndrome = STOP + Too much Serotonin → tremor, hyperthermia, clonus, agitation.' MAOI + SSRI = deadly combination — 2-week washout required.",
        sideEffects: "Sexual dysfunction (very common), nausea (early, improves), insomnia or sedation, weight changes, serotonin syndrome (overdose/interactions), discontinuation syndrome if stopped abruptly",
      },
      {
        name: "Lorazepam (Ativan)",
        mechanism: "Benzodiazepine — enhances GABA-A receptors → chloride floods into neurons → CNS slows down → anxiety, seizures, and agitation decrease. Think: 'GABAjam — open the chloride door.'",
        indications: "Anxiety, status epilepticus (first-line IV — 0.1 mg/kg), alcohol withdrawal, procedural sedation, acute agitation",
        antidote: "🔴 Flumazenil (Romazicon) — use CAUTIOUSLY (can precipitate withdrawal seizures in dependent patients)",
        monitoring: "Respiratory rate and sedation level. LOC. Dependence and withdrawal signs. Fall risk (especially elderly).",
        nursingPearls: "🔑 HIGH DEPENDENCE POTENTIAL — Schedule IV. NEVER stop abruptly in dependent patients — can cause LIFE-THREATENING WITHDRAWAL SEIZURES (worse than alcohol withdrawal). TAPER slowly. Elderly: high fall risk, confusion (on BEERS criteria — avoid if possible). Paradoxical excitation in children and elderly (patient becomes MORE agitated instead of calmer).",
        mnemonic: "💡 'Ativan = ATTach to GABA, Addictive, stop Abruptly = seizures.' Status epilepticus = FIRST LINE IV. Withdrawal = seizure risk (opposite of what you'd expect — now brain is TOO excitable without GABA enhancement). Flumazenil reverses but use with caution — don't use in dependent patients.",
        sideEffects: "Sedation, respiratory depression (especially with opioids), anterograde amnesia, dependence, withdrawal seizures if stopped abruptly, paradoxical excitation in elderly/children",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // ⚗️ ENDOCRINE
  // ─────────────────────────────────────────────
  {
    id: "endocrine",
    name: "Endocrine",
    icon: "⚗️",
    color: "#e07e5c",
    mnemonic: "🧠 MNEMONIC for Insulin types: 'CRISP' — Clear = Regular & Glargine (clear-ish), Regular = insulin you can give IV, Insulin Glargine = peakless 24-hr coverage, Short-acting = Regular (Clear), Peak = 2–4 hrs for Regular. For Metformin: 'Hold before Contrast and Surgery.' For Levothyroxine: 'Empty stomach, 30 min before breakfast, wait 4 hrs for supplements.'",
    overview: "Endocrine drugs manage diabetes (insulins, metformin), thyroid conditions (levothyroxine), and other hormonal imbalances. Key NCLEX focus: insulin types and timing, hypoglycemia management, and levothyroxine administration rules.",
    drugs: [
      {
        name: "Regular Insulin (Humulin R / Novolin R)",
        mechanism: "Short-acting insulin — binds insulin receptors → moves glucose from blood into cells → blood sugar drops. Also pushes K⁺ into cells (used for hyperkalemia treatment).",
        indications: "Type 1 & 2 DM (mealtime coverage), DKA, hyperkalemia (with dextrose), IV insulin drips, sliding scale",
        antidote: "🔴 Dextrose (D50 IV) for hypoglycemia. Glucagon IM if no IV access.",
        monitoring: "Blood glucose before giving AND 1–2 hrs after (peak time). Potassium level (shifts K⁺ intracellularly). Signs of hypoglycemia.",
        nursingPearls: "🔑 ONLY insulin that can be given IV. CLEAR appearance (don't confuse with NPH which is cloudy). Onset 30–60 min, PEAK 2–4 hrs (highest hypoglycemia risk at peak). For hyperkalemia: regular insulin + D50 together — insulin drives K⁺ in, D50 prevents hypoglycemia.",
        mnemonic: "💡 'Regular = Real-time mealtime insulin.' ONSET: 30–60 min. PEAK: 2–4 hrs (watch patient at peak!). DURATION: 6–8 hrs. CLEAR = Regular and Glargine. IV = only Regular. 'The 30-2-6 rule: 30 min onset, 2-hr peak, 6-hr duration.' CLOUDY = NPH or mixtures.",
        sideEffects: "Hypoglycemia (most critical — especially at peak), hypokalemia (shifts K⁺ into cells), weight gain, lipodystrophy at injection sites",
      },
      {
        name: "Insulin Glargine (Lantus / Basaglar)",
        mechanism: "Long-acting (24-hr) basal insulin — released slowly with NO peak. Provides a steady, background level of insulin all day. Like a slow drip vs. a splash.",
        indications: "Basal insulin coverage for Type 1 & 2 diabetes (given once daily)",
        antidote: "🔴 Dextrose for hypoglycemia, glucagon if no IV access",
        monitoring: "Fasting blood glucose (reflects basal insulin — goal 80–130 mg/dL). HbA1c every 3 months. Injection sites for lipodystrophy.",
        nursingPearls: "🔑 PEAKLESS — gives 24-hr flat coverage. Give at the SAME TIME every day. NEVER mix with other insulins (different pH → clumping). CLEAR to slightly cloudy depending on formulation — do NOT shake (roll gently). 1 injection per day. Does NOT cover meals — needs a rapid-acting insulin for that.",
        mnemonic: "💡 'Glargine = Giant flat line — no peak, no valley.' ONCE DAILY, SAME TIME. 'NEVER MIX — it's a one-drug syringe.' CLEAR appearance. Basal = Background insulin. Compare: Regular = mealtime spike. Glargine = steady background.",
        sideEffects: "Hypoglycemia (lower risk than NPH because no peak), weight gain, lipodystrophy, injection site reactions",
      },
      {
        name: "Levothyroxine (Synthroid)",
        mechanism: "Synthetic T4 thyroid hormone → replaces what the thyroid isn't making. Body converts T4 to active T3. Regulates metabolism, energy, heart rate, temperature.",
        indications: "Hypothyroidism (primary treatment), thyroid cancer suppression, myxedema coma",
        antidote: "🔴 No specific antidote — reduce dose. Beta blockers for symptomatic tachycardia from over-replacement.",
        monitoring: "TSH (primary lab — normal 0.4–4.0 mIU/L). Free T4. HR and BP. Weight. Symptoms of over or under-replacement.",
        nursingPearls: "🔑 EMPTY STOMACH — take 30–60 minutes BEFORE breakfast. Antacids, calcium supplements, iron supplements, and cholestyramine all reduce absorption — separate by 4 HOURS. TSH takes 4–6 weeks to stabilize after dose change (be patient!). Start LOW, go SLOW in elderly and cardiac patients — too fast can trigger angina or MI.",
        mnemonic: "💡 'Synthroid = SOLO on an Empty stomach.' 30–60 min before breakfast. '4-hour rule' for supplements (antacids, calcium, iron). TSH = your accuracy check (target 0.4–4.0). 'TSH UP = underreplaced (add more). TSH DOWN = overreplaced (reduce dose).' TSH is INVERSELY proportional to thyroid hormone levels.",
        sideEffects: "Over-replacement signs: palpitations, tachycardia, weight loss, insomnia, tremor, heat intolerance, sweating, diarrhea, bone loss (long-term excess)",
      },
      {
        name: "Metformin (Glucophage)",
        mechanism: "Biguanide — tells the liver to STOP overproducing glucose (gluconeogenesis), and makes muscles more sensitive to insulin. Does not stimulate insulin secretion = NO hypoglycemia when used alone.",
        indications: "Type 2 DM (first-line drug of choice), prediabetes, PCOS",
        antidote: "🔴 No specific antidote. Dialysis for severe lactic acidosis.",
        monitoring: "Blood glucose, HbA1c, renal function (eGFR — HOLD if <30 mL/min), vitamin B12 (depleted with long-term use), lactic acid if symptomatic.",
        nursingPearls: "🔑 HOLD BEFORE contrast dye (CT/MRI) and surgery — IV contrast can cause acute kidney injury → metformin accumulates → lactic acidosis (life-threatening). Hold 48 hrs post-contrast, recheck kidneys before restarting. DOES NOT cause hypoglycemia alone (key NCLEX fact!). Take WITH FOOD to reduce GI upset. Monitor B12 with long-term use.",
        mnemonic: "💡 'Metformin = Must Hold before contrast or surgery.' 'No hypo-glycemia with Metformin alone.' Take with food = less nausea. 'Lactic Acidosis = rare but deadly — watch for muscle pain and hyperventilation.' HOLD when kidneys at risk. B12 deficiency with long use.",
        sideEffects: "GI upset/diarrhea (most common — improves with time and food), lactic acidosis (rare but serious — especially in renal impairment), B12 deficiency with long-term use",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 🫁 RESPIRATORY
  // ─────────────────────────────────────────────
  {
    id: "respiratory",
    name: "Respiratory",
    icon: "🫁",
    color: "#5ce0c4",
    mnemonic: "🧠 MNEMONIC for asthma/COPD drugs: 'SAVE then CONTROL.' SABA (albuterol) = rescue — use when needed for acute symptoms. ICS (fluticasone) = controller — use every day for maintenance. LAMA (tiotropium) = COPD controller. Rule: 'If using rescue inhaler >2x/week → not controlled → need controller.' Rinse mouth after ICS → prevents thrush.",
    overview: "Respiratory drugs treat asthma and COPD by opening airways. The #1 concept: rescue vs. controller. Albuterol = rescue (fast but short). Fluticasone = controller (slow but prevents attacks). Never use a rescue inhaler as a substitute for a controller in persistent asthma.",
    drugs: [
      {
        name: "Albuterol (ProAir, Ventolin, Proventil)",
        mechanism: "Short-acting beta-2 agonist (SABA) — stimulates β2 receptors in bronchial smooth muscle → muscle relaxes → airway opens. Fast onset (5 min), short duration (4–6 hrs).",
        indications: "Acute bronchospasm (asthma attack, COPD exacerbation), exercise-induced bronchospasm, hyperkalemia (adjunct — shifts K⁺ into cells)",
        antidote: "🔴 No specific antidote",
        monitoring: "HR (tachycardia), potassium (hypokalemia with high doses), O₂ saturation, peak flow, breath sounds before and after",
        nursingPearls: "🔑 RESCUE inhaler = for IMMEDIATE symptoms only. Using >2 days/week for symptoms = INADEQUATELY CONTROLLED asthma → need a controller (ICS). Shake before use. Spacer improves drug delivery (especially in children). Tachycardia and tremor are expected side effects — not dangerous at standard doses.",
        mnemonic: "💡 'Albuterol = ALarming symptoms → use me NOW!' SABA = Short-Acting Beta-Agonist = fast rescue. '2-Day rule: >2x/week = not controlled.' Tremor + tachycardia = expected (it's a beta stimulant). SABA for ACUTE, ICS for ALWAYS.",
        sideEffects: "Tachycardia, tremor, hypokalemia (high doses), nervousness, insomnia, paradoxical bronchospasm (rare — stop and use different inhaler)",
      },
      {
        name: "Fluticasone (Flovent, Flonase)",
        mechanism: "Inhaled corticosteroid (ICS) — reduces inflammation in airways, decreases mucus production and bronchial hyperresponsiveness. Works slowly over days to weeks — not for acute attacks.",
        indications: "Persistent asthma maintenance (controller), allergic rhinitis (nasal spray form)",
        antidote: "🔴 No specific antidote",
        monitoring: "Growth in children (long-term use — monitor height). Oral candidiasis (thrush). HPA axis suppression with high doses. Bone density with long-term high doses.",
        nursingPearls: "🔑 CONTROLLER medication — NOT for acute attacks. ALWAYS rinse mouth and gargle with water after using → prevents oral thrush (candidiasis from steroid deposit in mouth). Takes DAYS TO WEEKS for full effect. If switching from oral/systemic steroids to ICS: taper the systemic steroid slowly (adrenal suppression risk).",
        mnemonic: "💡 'Fluticasone = Fights inflammation EVERY DAY.' ICS = controller = daily use. RINSE mouth = prevents THRUSH. 'Fluti = Fluticasone = Prevent, not rescue. Rinse after every puff!' If you see -SONE or inhaled steroid = rinse mouth.",
        sideEffects: "Oral candidiasis/thrush (preventable with mouth rinsing!), dysphonia (hoarse voice), HPA suppression (high doses), growth suppression in children",
      },
      {
        name: "Tiotropium (Spiriva)",
        mechanism: "Long-acting muscarinic antagonist (LAMA) — blocks M3 cholinergic receptors in bronchial smooth muscle → sustained bronchodilation (~24 hrs). Anticholinergic mechanism = also dries secretions.",
        indications: "COPD maintenance (first-line), asthma (add-on therapy)",
        antidote: "🔴 No specific antidote",
        monitoring: "Urinary symptoms (urinary retention risk — especially in BPH), intraocular pressure (angle-closure glaucoma risk), dry mouth, renal function",
        nursingPearls: "🔑 ONCE DAILY — maintenance only, NOT rescue. ANTICHOLINERGIC side effects: dry mouth (most common), urinary retention (caution in BPH), constipation, blurred vision. HandiHaler capsules are for INHALATION — NEVER SWALLOW them. Avoid spraying mist in eyes (glaucoma risk).",
        mnemonic: "💡 'Tiotropium = COPD's daily Shield.' LAMA = Long-Acting Muscarinic Antagonist = anticholinergic = DRY everything (dry mouth, can't pee, constipated). 'DUMB side effects: Dry mouth, Urinary retention, Mydriasis (blurred vision), Bowel constipation.' ONCE DAILY. Never swallow the capsule!",
        sideEffects: "Dry mouth (most common), urinary retention, constipation, blurred vision, paradoxical bronchospasm (rare)",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 🍽️ GI DRUGS
  // ─────────────────────────────────────────────
  {
    id: "gi",
    name: "GI Drugs",
    icon: "🍽️",
    color: "#c4e05c",
    mnemonic: "🧠 MNEMONIC for GI drugs: 'POP = PPIs, Ondansetron, Polyethylene glycol.' PPIs (omeprazole -prazole) → 30 min before meals. Ondansetron → QT prolongation risk IV. MiraLax → osmotic, gentle, takes 1–3 days. For PPIs: 'Long-term = Sneaky risks (B12, magnesium, C. diff, bones).' Omeprazole + Clopidogrel = bad combo (CYP2C19).",
    overview: "GI drugs reduce acid (PPIs), prevent nausea (antiemetics), and manage constipation (laxatives). Key NCLEX points: give PPIs BEFORE meals, watch for QT prolongation with IV ondansetron, and know the long-term risks of PPIs.",
    drugs: [
      {
        name: "Omeprazole (Prilosec)",
        mechanism: "Proton pump inhibitor (PPI) — irreversibly blocks the H⁺/K⁺-ATPase pump on stomach parietal cells → dramatically reduces acid production. Like turning off the acid factory.",
        indications: "GERD, peptic ulcer disease, H. pylori (triple therapy), Zollinger-Ellison syndrome, NSAID-induced ulcer prevention",
        antidote: "🔴 No specific antidote",
        monitoring: "Magnesium (hypomagnesemia with long-term use), vitamin B12, bone density, C. diff risk, clopidogrel interaction",
        nursingPearls: "🔑 Take 30–60 MIN BEFORE MEALS — the pump must be ACTIVE (stimulated by food) to be blocked. Long-term risks are sneaky: low magnesium, low B12, increased C. diff, osteoporosis, possible kidney disease. AVOID combining with clopidogrel (especially omeprazole — use pantoprazole instead). Do NOT crush delayed-release capsules — open and sprinkle on applesauce only.",
        mnemonic: "💡 'Omeprazole = -PRAZOLE = pump blocker.' All PPIs end in -PRAZOLE (omeprazole, pantoprazole, lansoprazole, esomeprazole). '30 min BEFORE eating — feed the pump first so drug can block it.' Long-term: 'BOMB risks = B12 low, Osteoporosis, Magnesium low, Bad C. diff.'",
        sideEffects: "Headache, diarrhea (short-term); long-term: hypomagnesemia, B12 deficiency, fractures, C. diff colitis, possible CKD",
      },
      {
        name: "Ondansetron (Zofran)",
        mechanism: "5-HT3 serotonin receptor blocker — blocks serotonin receptors in the gut and chemoreceptor trigger zone in the brain → stops nausea/vomiting signals. Doesn't cause sedation like older antiemetics.",
        indications: "Chemotherapy-induced nausea/vomiting (CINV), post-operative nausea (PONV), nausea from various causes",
        antidote: "🔴 No specific antidote",
        monitoring: "QTc interval (especially with IV — QT prolongation risk), electrolytes, bowel sounds (constipation is common)",
        nursingPearls: "🔑 IV DOSE: infuse slowly over at least 15 minutes — rapid IV push can cause QT prolongation and arrhythmia. CONSTIPATION is very common — monitor bowel movements. ODT (orally dissolving tablet) available for patients who can't swallow. Serotonin syndrome risk if combined with other serotonergic drugs.",
        mnemonic: "💡 'Zofran = Zero nausea, but Zero bowel movements too.' QT prolongation = 'Q-Tee problem with fast IV.' CONSTIPATION = almost universal. 'Zofran works FAST on nausea, SLOWS the bowels.' ODT for people who can't swallow (dissolves on tongue).",
        sideEffects: "Constipation (most common!), headache, QT prolongation (especially with rapid IV push), serotonin syndrome (with serotonergic drugs)",
      },
      {
        name: "Polyethylene Glycol (MiraLax)",
        mechanism: "Osmotic laxative — PEG molecules hold onto water in the colon → stool stays soft and moist → easier to pass. Gentle. No electrolyte shifts at normal doses.",
        indications: "Occasional constipation, bowel prep for colonoscopy, opioid-induced constipation (maintenance)",
        antidote: "🔴 No specific antidote",
        monitoring: "Bowel function (1–3 days for effect — set realistic expectations). Electrolytes with prolonged use. Rule out bowel obstruction BEFORE giving.",
        nursingPearls: "🔑 NOT immediate — takes 1–3 days (set patient expectations). Mix powder in 8 oz of any beverage until fully dissolved. NEVER give if bowel obstruction suspected — perforation risk. Good for long-term opioid-induced constipation. Combine with stimulant laxative (senna) for opioids (two mechanisms = better coverage).",
        mnemonic: "💡 'MiraLax = Miracle LAXative — but not FAST (1–3 days).' 'PEG = Pulls water into gut (keeps stool soft).' No electrolyte problems at normal doses. Obstruction = CONTRAINDICATED. For opioid constipation: MiraLax + Senna = dynamic duo.",
        sideEffects: "Bloating, cramping, nausea; electrolyte imbalance with excessive/prolonged use",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 🦴 MUSCULOSKELETAL
  // ─────────────────────────────────────────────
  {
    id: "musculoskeletal",
    name: "Musculoskeletal",
    icon: "🦴",
    color: "#d4a06a",
    mnemonic: "🧠 MNEMONIC for MSK drugs: 'CALM BAM' — Cyclobenzaprine (anticholinergic, BEERS list), Allopurinol (gout prevention, NOT during flare), Leflunomide/methotrexate (DMARDs), Methocarbamol (safer relaxant), Baclofen (never stop abruptly — seizure risk!), Alendronate (UPRIGHT 30 min after!), Methotrexate (WEEKLY not daily!). Big NCLEX traps: alendronate posture, methotrexate weekly dosing, baclofen withdrawal.",
    overview: "Musculoskeletal drugs treat muscle spasms (relaxants), osteoporosis (bisphosphonates), gout (colchicine, allopurinol), and inflammatory arthritis (DMARDs like methotrexate). NCLEX loves alendronate administration technique, methotrexate dosing frequency, and baclofen withdrawal.",
    drugs: [
      {
        name: "Cyclobenzaprine (Flexeril)",
        mechanism: "Acts on brainstem to reduce muscle spasm signals. Structurally similar to tricyclic antidepressants (TCAs) → anticholinergic side effects.",
        indications: "Acute musculoskeletal pain and spasm (short-term — 2–3 weeks ONLY)",
        antidote: "🔴 No specific antidote; physostigmine for severe anticholinergic toxicity",
        monitoring: "Sedation level, HR (anticholinergic tachycardia), fall risk (especially elderly), urinary retention",
        nursingPearls: "🔑 SHORT-TERM ONLY (2–3 weeks) — no evidence of benefit beyond that. On BEERS Criteria (avoid in elderly — falls, confusion). Strong anticholinergic effects: dry mouth, blurry vision, constipation, urinary retention. CNS depression + alcohol = dangerous sedation. NO MAOIs (serotonin syndrome risk — TCA structure).",
        mnemonic: "💡 'CycloBENZaprine = BENZO-like sedation + TCA anticholinergic effects.' BEERS = elderly risk. ANTICHOLINERGIC = 'Can't see, can't spit, can't pee, can't poop' (blurred vision, dry mouth, urinary retention, constipation). Max 2–3 weeks only.",
        sideEffects: "Drowsiness (most common), dry mouth, dizziness, blurred vision, urinary retention, constipation, tachycardia",
      },
      {
        name: "Methocarbamol (Robaxin)",
        mechanism: "Centrally-acting muscle relaxant — general CNS depression reduces spasm. Less anticholinergic than cyclobenzaprine → safer option, especially in elderly.",
        indications: "Acute musculoskeletal pain and spasm, adjunct to rest and physical therapy, tetanus (IV form)",
        antidote: "🔴 No specific antidote — supportive care",
        monitoring: "Sedation, BP (hypotension with IV form), urine color (harmless discoloration), liver function",
        nursingPearls: "🔑 URINE may turn brown, black, or GREEN — HARMLESS but WARN THE PATIENT or they'll panic. IV form can cause hypotension and bradycardia — monitor closely and infuse slowly. Less anticholinergic than cyclobenzaprine → preferred in elderly and patients with urinary issues.",
        mnemonic: "💡 'Robaxin = Robotic color urine (brown/black/green) — WARN them!' Safer muscle relaxant than Flexeril. 'METHOCARBAMOL = My Urine Turns Odd Colors' — harmless reassurance needed. IV = watch BP and HR.",
        sideEffects: "Drowsiness, dizziness, urine discoloration (harmless!), hypotension (IV), nausea, blurred vision",
      },
      {
        name: "Baclofen (Lioresal)",
        mechanism: "GABA-B receptor agonist — activates inhibitory receptors in the spinal cord → reduces excitatory signals to muscles → decreases spasticity and muscle tone.",
        indications: "Spasticity from MS, spinal cord injury, cerebral palsy; chronic hiccups; intrathecal pump for severe spasticity",
        antidote: "🔴 No specific antidote — supportive care. Intrathecal pump failure = medical emergency.",
        monitoring: "Spasticity level, sedation, seizure activity (WITHDRAWAL!), BP, renal function (renally excreted)",
        nursingPearls: "🔑 NEVER STOP ABRUPTLY — withdrawal is LIFE-THREATENING: hallucinations, fever, rebound severe spasticity, and SEIZURES. Must TAPER slowly. Intrathecal pump failure → immediate withdrawal → emergency. Renally cleared — dose reduce in renal impairment. Potentiates alcohol and CNS depressants.",
        mnemonic: "💡 'Baclofen BACKS you up with GABA — but BACK OFF slowly (taper!).' Abrupt stop = SEIZURES and hallucinations and hyperthermia. 'BAClofen = BAd withdrawal if Abrupt Cessation.' Intrathecal pump alarm = EMERGENCY — treat like a code.",
        sideEffects: "Sedation, muscle weakness, dizziness, hypotonia, nausea, urinary frequency — and WITHDRAWAL SEIZURES if stopped abruptly",
      },
      {
        name: "Alendronate (Fosamax)",
        mechanism: "Bisphosphonate — gets absorbed into bone, then poisons osteoclasts (cells that break down bone) → bone resorption slows → bone density preserved or increased.",
        indications: "Osteoporosis prevention and treatment, Paget's disease of bone, glucocorticoid-induced osteoporosis",
        antidote: "🔴 No specific antidote; calcium-rich foods may reduce absorption if given immediately after",
        monitoring: "Bone mineral density (DEXA scan), calcium, vitamin D, renal function (hold if CrCl <35), jaw pain (osteonecrosis), thigh pain (atypical femur fracture)",
        nursingPearls: "🔑 ADMINISTRATION IS THE NCLEX TRAP: ① Empty stomach. ② 8 oz PLAIN WATER ONLY (no juice, coffee, milk). ③ Sit or stand UPRIGHT for 30 MIN after. ④ No food, other drinks, or meds for 30 min. If patient lies down → esophageal ulceration/erosion. WEEKLY dosing (70mg) is the standard. Complete dental work BEFORE starting (osteonecrosis of jaw risk).",
        mnemonic: "💡 'Fosamax = FIRST thing in morning, FULL glass water, FREEZE upright 30 min.' The 3 Fs. OSTEONECROSIS of jaw = 'Jawsome risk with Fosamax.' ATYPICAL femur fracture with long-term use. Drug holiday considered after 3–5 years.",
        sideEffects: "Esophageal irritation/ulceration (if not upright!), hypocalcemia, musculoskeletal pain, osteonecrosis of the jaw (rare), atypical femur fractures (long-term)",
      },
      {
        name: "Colchicine (Colcrys)",
        mechanism: "Blocks neutrophil migration to the joint by disrupting microtubule formation → less inflammation from uric acid crystals. Does NOT lower uric acid — it just calms the inflammatory fire.",
        indications: "Acute gout attack (first-line — most effective if started within 12–36 hrs), gout prophylaxis, familial Mediterranean fever, pericarditis",
        antidote: "🔴 No specific antidote — stop drug, supportive care",
        monitoring: "GI symptoms (dose-limiting!), renal function (dose adjust if CrCl <30), CBC (bone marrow suppression with toxicity), neuromuscular symptoms",
        nursingPearls: "🔑 START EARLY — most effective within first 12–36 hours of gout flare. Diarrhea and nausea = DOSE-LIMITING — signal to reduce the dose (don't push through!). Does NOT lower uric acid (that's allopurinol's job). Grapefruit juice increases toxicity. Drug interactions: statins, clarithromycin increase colchicine levels → toxicity.",
        mnemonic: "💡 'Colchicine Calms the Gout Fire — fast or not at all (start within 36 hrs!).' GI = early warning = REDUCE DOSE. 'Colchi-SINE = GI SIGNal to back off.' Does NOT lower uric acid. Grapefruit = forbidden.",
        sideEffects: "Diarrhea (most common — dose-limiting!), nausea/vomiting, bone marrow suppression (toxicity), myopathy, neuropathy",
      },
      {
        name: "Allopurinol (Zyloprim)",
        mechanism: "Xanthine oxidase inhibitor → blocks the enzyme that converts purines into uric acid → less uric acid produced → fewer gout crystals over time.",
        indications: "Chronic gout PREVENTION (NOT acute attacks), hyperuricemia from chemotherapy (tumor lysis syndrome), recurrent uric acid kidney stones",
        antidote: "🔴 No specific antidote — stop drug for severe reactions",
        monitoring: "Serum uric acid (goal <6 mg/dL), BUN/creatinine (dose adjust in renal impairment), CBC, LFTs, skin (SJS/TEN/DRESS risk), urine output",
        nursingPearls: "🔑 DO NOT START during an acute gout attack — mobilizing urate crystals can WORSEN or prolong the flare. Wait until attack fully resolves (2–4 weeks). Drink 2–3 L of water daily (prevents kidney stones). LIFE-THREATENING RASH: Stevens-Johnson Syndrome/DRESS — especially in Asian patients with HLA-B*5801 gene. Increases toxicity of azathioprine/6-MP by 3–4× (reduce those doses 67–75%).",
        mnemonic: "💡 'Allopurinol = ALL-STOP uric acid production.' NEVER during a flare (wait for the fire to cool first!). 'SJS rash = STOP the drug immediately.' Drink water to flush kidneys. 'Allopurinol Lowers uric acid LONG-TERM — not NOW during an attack.'",
        sideEffects: "Rash (can progress to SJS/TEN/DRESS — life-threatening!), GI upset, gout flare on initiation, hepatotoxicity, bone marrow suppression (rare)",
      },
      {
        name: "Methotrexate (Rheumatrex)",
        mechanism: "DMARD — blocks folate metabolism → immune cells can't replicate as fast → inflammation and joint destruction slow. At low RA doses = anti-inflammatory. At high cancer doses = kills rapidly dividing cells.",
        indications: "Rheumatoid arthritis (first-line DMARD), psoriasis, psoriatic arthritis, ectopic pregnancy, certain cancers",
        antidote: "🔴 Leucovorin (folinic acid) — bypasses the folate block (aka 'leucovorin rescue')",
        monitoring: "CBC (bone marrow suppression — monthly at first), LFTs (hepatotoxicity), BUN/creatinine, CXR/PFTs (lung toxicity), pregnancy test",
        nursingPearls: "🔑 WEEKLY DOSING FOR RA — NOT DAILY. This is one of the most dangerous medication errors in nursing — daily dosing causes FATAL bone marrow suppression and mucositis. ALWAYS verify frequency. Supplement FOLIC ACID (reduces side effects). TERATOGEN — Category X, contraception required during and 3 months after. Avoid alcohol, NSAIDs, and live vaccines. Hold during active infections.",
        mnemonic: "💡 'Methotrexate = WEEKLY (say it 3x: weekly, weekly, weekly).' Daily = FATAL. 'MTX = Must Take folic acid Xtra.' Leucovorin = rescue antidote. 'MTX is MEAN to: Marrow (CBC), Mucosa (mouth sores), Liver (LFTs), Lungs (CXR), Mamas (teratogen).'",
        sideEffects: "Nausea (take with food), mucositis (mouth sores), bone marrow suppression, hepatotoxicity, pulmonary toxicity (pneumonitis), TERATOGENIC (Category X)",
      },
    ],
  },
];

const QUIZ_QUESTIONS = [
  {
    q: "A patient on heparin has a platelet count that drops from 220,000 to 85,000 on day 8 of therapy. What is the priority nursing action?",
    options: ["Increase the heparin dose", "Discontinue heparin immediately and notify provider", "Monitor platelets daily and continue therapy", "Administer protamine sulfate"],
    answer: 1,
    explanation: "This presentation is classic HIT (Heparin-Induced Thrombocytopenia) — platelet drop >50% between days 5–10. HIT is paradoxically prothrombotic (not hemorrhagic). Heparin must be stopped immediately and a non-heparin anticoagulant started. Protamine is used for heparin overdose, not HIT.",
    class: "Anticoagulants",
  },
  {
    q: "A patient on warfarin has an INR of 5.8 with no active bleeding. Which intervention is most appropriate?",
    options: ["Administer fresh frozen plasma (FFP)", "Hold warfarin and monitor; administer oral Vitamin K if needed", "Give protamine sulfate", "Continue warfarin at current dose"],
    answer: 1,
    explanation: "For supratherapeutic INR (>5) without bleeding: hold warfarin. Oral Vitamin K can be given for faster reversal. FFP/4-factor PCC is reserved for serious or life-threatening bleeding. Protamine reverses heparin, not warfarin.",
    class: "Anticoagulants",
  },
  {
    q: "Before administering digoxin, the nurse assesses an apical pulse of 58 bpm. The patient's potassium level is 3.1 mEq/L. What should the nurse do?",
    options: ["Administer the digoxin as ordered", "Hold the digoxin and notify the provider of both findings", "Administer the digoxin and recheck potassium in 2 hours", "Give supplemental potassium then administer digoxin"],
    answer: 1,
    explanation: "Two concerns here: HR <60 (hold parameter for digoxin) AND hypokalemia (K⁺ <3.5), which dramatically increases risk of digoxin toxicity. Both findings must be reported to the provider before giving the drug.",
    class: "Cardiac Drugs",
  },
  {
    q: "A patient received tPA for ischemic stroke 6 hours ago. The nurse notes the patient is requesting aspirin for a headache. What is the correct response?",
    options: ["Administer aspirin 325mg as it treats both pain and prevents re-stroke", "Administer acetaminophen instead; hold antiplatelet therapy for 24 hours post-tPA", "Hold all analgesics for 24 hours", "Administer the aspirin but document the administration"],
    answer: 1,
    explanation: "Antiplatelet agents (aspirin, clopidogrel) and anticoagulants are contraindicated for 24 hours post-tPA administration due to hemorrhagic conversion risk. Acetaminophen is safe for pain/fever management during this window.",
    class: "Thrombolytics",
  },
  {
    q: "Which electrolyte imbalance puts a patient on furosemide at greatest risk for digoxin toxicity?",
    options: ["Hypernatremia", "Hypokalemia", "Hypercalcemia", "Hypermagnesemia"],
    answer: 1,
    explanation: "Furosemide is a potassium-wasting diuretic. Hypokalemia (low K⁺) increases myocardial sensitivity to digoxin by competing for the same Na/K-ATPase binding site — meaning digoxin levels may appear therapeutic but toxicity still occurs.",
    class: "Diuretics",
  },
  {
    q: "A patient on clopidogrel is scheduled for a non-emergency CABG in 3 days. What should the nurse anticipate?",
    options: ["Proceed with surgery; clopidogrel has no surgical implications", "Recommend holding clopidogrel for 5–7 days before surgery", "Switch to aspirin immediately and proceed in 3 days", "Administer platelet transfusion the day before surgery"],
    answer: 1,
    explanation: "Clopidogrel irreversibly inhibits platelets for their lifespan (~7–10 days). Guidelines recommend holding it 5–7 days pre-CABG to reduce excessive surgical bleeding. The surgeon and cardiologist must weigh thrombotic vs. bleeding risk.",
    class: "Antiplatelets",
  },
  {
    q: "A nurse is teaching a patient newly started on metoprolol succinate (Toprol XL) for heart failure. Which statement by the patient indicates understanding?",
    options: ["'I can stop this medication if my heart rate feels normal.'", "'I should take my pulse before each dose and call if it's below 60.'", "'This medication will help my blood sugar stay stable.'", "'I can take ibuprofen for pain while on this medication.'"],
    answer: 1,
    explanation: "Patients should monitor HR and hold metoprolol (calling provider) if HR <60. Beta blockers must NEVER be abruptly stopped — rebound can cause MI. They can mask hypoglycemia symptoms and NSAIDs can reduce antihypertensive effectiveness.",
    class: "Cardiac Drugs",
  },
  {
    q: "A patient on spironolactone calls to report they've been taking potassium supplements their friend gave them. The nurse's priority is to:",
    options: ["Reassure the patient that extra potassium is always beneficial", "Instruct the patient to stop the supplements and check their potassium level", "Tell the patient to take half the spironolactone dose", "Document and monitor at the next scheduled appointment"],
    answer: 1,
    explanation: "Spironolactone is a potassium-SPARING diuretic — it already retains potassium. Adding K⁺ supplements can cause dangerous hyperkalemia (peaked T-waves, bradycardia, cardiac arrest). This requires immediate intervention.",
    class: "Diuretics",
  },
  {
    q: "A patient is receiving IV vancomycin and develops sudden flushing, erythema of the face and neck, and hypotension during the infusion. What is the nurse's best action?",
    options: ["Stop the infusion and administer epinephrine for anaphylaxis", "Slow the infusion rate and administer diphenhydramine as ordered", "Discontinue vancomycin permanently and notify the provider", "Continue the infusion and monitor vital signs every 15 minutes"],
    answer: 1,
    explanation: "This is Red Man Syndrome — a rate-related infusion reaction (not a true allergy) caused by histamine release. It is NOT anaphylaxis. Management: slow or stop the infusion, give diphenhydramine, and resume at a slower rate (infuse over at least 60 min). Epinephrine is for true anaphylaxis.",
    class: "Antibiotics",
  },
  {
    q: "A nurse is discharging a patient treated with metronidazole for a C. difficile infection. Which instruction is most important?",
    options: ["'Take this medication with a full glass of milk.'", "'Avoid all alcohol for at least 48-72 hours after completing therapy.'", "'This medication may cause your vision to become blurred temporarily.'", "'You may take ibuprofen if you experience abdominal discomfort.'"],
    answer: 1,
    explanation: "Metronidazole causes a severe disulfiram-like reaction with alcohol — nausea, vomiting, flushing, tachycardia. Patients must avoid alcohol DURING treatment AND for 48-72 hours after the last dose. Milk is not required. Vision changes and NSAIDs are not primary concerns here.",
    class: "Antibiotics",
  },
  {
    q: "A patient received morphine 4mg IV 20 minutes ago and now has a respiratory rate of 8 breaths/min and is difficult to arouse. What is the priority nursing action?",
    options: ["Reposition the patient and apply a non-rebreather mask", "Administer naloxone (Narcan) as ordered and prepare to repeat dosing", "Notify the provider and document the finding", "Withhold the next scheduled dose of morphine"],
    answer: 1,
    explanation: "RR <12 with sedation indicates opioid-induced respiratory depression — a medical emergency requiring immediate naloxone administration. Naloxone's half-life (30-90 min) is shorter than morphine's, so repeat doses may be needed and the patient must be monitored for re-narcotization. Repositioning alone is inadequate.",
    class: "Pain & Opioids",
  },
  {
    q: "A patient with bipolar disorder on lithium presents with coarse tremors, confusion, and ataxia. His lithium level is 2.1 mEq/L. Which intervention is the priority?",
    options: ["Administer an extra dose of lithium to stabilize the level", "Hold the next lithium dose and increase sodium intake", "Notify the provider immediately — lithium toxicity requires urgent intervention", "Administer activated charcoal orally"],
    answer: 2,
    explanation: "Lithium level >1.5 mEq/L with neurological symptoms (confusion, ataxia, coarse tremor) indicates moderate-to-severe toxicity. This is a medical emergency — the provider must be notified immediately. Severe toxicity may require hemodialysis. Lithium has NO antidote. The immediate priority is provider notification and stopping the drug.",
    class: "Psych Meds",
  },
  {
    q: "A patient with Type 2 diabetes on metformin is scheduled for a CT scan with IV contrast tomorrow. What should the nurse do?",
    options: ["Administer metformin as scheduled on the morning of the procedure", "Hold metformin before and for 48 hours after contrast; reassess renal function before restarting", "Switch the patient to insulin for the day of the procedure only", "Double the metformin dose the day before to maintain glycemic control"],
    answer: 1,
    explanation: "IV contrast can cause acute kidney injury. If renal function deteriorates, metformin accumulates and causes potentially fatal lactic acidosis. Guidelines recommend holding metformin before contrast and for 48 hours after, then rechecking renal function before resuming.",
    class: "Endocrine",
  },
  {
    q: "A patient uses an albuterol inhaler 4-5 times per week for asthma symptoms. What does this pattern indicate?",
    options: ["The patient is correctly using their rescue inhaler as directed", "Asthma is inadequately controlled and a controller medication should be initiated or adjusted", "The patient is overusing the inhaler and should limit use to once weekly", "This frequency is normal during allergy season and requires no action"],
    answer: 1,
    explanation: "Albuterol use >2 days per week for symptom relief indicates inadequately controlled asthma per NAEPP guidelines. This patient needs step-up therapy, typically initiation or increase of an inhaled corticosteroid (ICS). Overuse of rescue inhalers is associated with increased asthma mortality.",
    class: "Respiratory",
  },
  {
    q: "A patient taking clopidogrel after stent placement also takes omeprazole daily. The nurse's best response is to:",
    options: ["Reassure the patient that both medications are safe to take together", "Notify the provider — omeprazole reduces clopidogrel's antiplatelet effectiveness via CYP2C19 competition", "Instruct the patient to take both medications at the same time each morning", "Tell the patient to discontinue omeprazole immediately without consulting the provider"],
    answer: 1,
    explanation: "Both omeprazole and clopidogrel are metabolized by CYP2C19. Omeprazole competitively inhibits this enzyme, reducing conversion of clopidogrel (prodrug) to its active form. This is a significant drug-drug interaction in post-stent patients. The provider should consider an alternative PPI (e.g., pantoprazole) with less CYP2C19 interaction.",
    class: "GI Drugs",
  },
  {
    q: "A patient is prescribed alendronate (Fosamax) for osteoporosis. Which instruction is most important for the nurse to include?",
    options: ["Take the medication with a full glass of orange juice to improve absorption", "Remain upright for at least 30 minutes after taking the medication and take with plain water only", "Take the medication with food to reduce GI upset", "Crush the tablet and mix with yogurt if swallowing is difficult"],
    answer: 1,
    explanation: "Alendronate must be taken on an empty stomach with 8 oz of plain water ONLY (no juice, coffee, or food). The patient must remain upright (sitting or standing) for at least 30 minutes to prevent esophageal ulceration. Crushing or taking with food significantly reduces absorption and increases GI risk.",
    class: "Musculoskeletal",
  },
  {
    q: "A patient with a spinal cord injury has been on intrathecal baclofen via pump for 2 years. The pump alarm sounds and the patient reports sudden increase in muscle spasms and begins having a seizure. The nurse recognizes this as:",
    options: ["Expected worsening of the underlying spinal cord injury", "Baclofen toxicity from pump overdose", "Baclofen withdrawal from pump failure — a medical emergency", "An unrelated new-onset seizure disorder"],
    answer: 2,
    explanation: "Abrupt baclofen discontinuation — especially from intrathecal pump failure — causes life-threatening withdrawal: rebound severe spasticity, hyperthermia, altered mental status, and seizures. This is a medical emergency requiring immediate intervention. Baclofen toxicity (overdose) presents with CNS/respiratory depression, not seizures from spasticity.",
    class: "Musculoskeletal",
  },
  {
    q: "A patient with gout asks when they should start taking allopurinol. They are currently having a gout flare. The nurse correctly responds:",
    options: ["'Start allopurinol immediately — it will shorten the current attack'", "'Wait until the acute attack fully resolves (2–4 weeks) before starting allopurinol'", "'Take a double dose now to bring uric acid levels down faster'", "'Allopurinol is only used for kidney stones, not gout prevention'"],
    answer: 1,
    explanation: "Allopurinol should NOT be started during an acute gout attack. Rapid lowering of uric acid levels mobilizes urate crystals from deposits, which can paradoxically worsen or prolong the flare. Wait until the attack fully resolves (typically 2–4 weeks) before initiating. Colchicine or NSAIDs are used to treat the acute attack.",
    class: "Musculoskeletal",
  },
  {
    q: "A nurse is preparing to administer weekly methotrexate to a patient with rheumatoid arthritis. The order reads 'methotrexate 15mg daily.' What is the nurse's priority action?",
    options: ["Administer the medication as ordered since the dose is within normal range", "Hold the medication and clarify the order — methotrexate for RA is given weekly, not daily", "Reduce the dose by half and administer daily as a compromise", "Administer the medication and notify the provider after administration"],
    answer: 1,
    explanation: "This is a HIGH-ALERT medication error. Methotrexate for rheumatoid arthritis is dosed WEEKLY — daily dosing causes fatal bone marrow suppression and mucositis. The nurse must HOLD the medication and clarify with the prescriber before administering. This is one of the most dangerous and documented prescribing errors in rheumatology.",
    class: "Musculoskeletal",
  },
  {
    q: "A patient with acute gout is given colchicine and develops severe diarrhea and nausea after the second dose. What is the most appropriate nursing response?",
    options: ["Administer an antiemetic and continue colchicine as scheduled", "Recognize these as dose-limiting side effects and notify the provider to reduce or hold the dose", "Encourage the patient to push fluids and continue therapy", "Administer loperamide and continue colchicine at the same dose"],
    answer: 1,
    explanation: "GI symptoms (diarrhea, nausea, vomiting) are the primary dose-limiting toxicity of colchicine and indicate the maximum tolerable dose has been reached. The dose should be reduced or held and the provider notified. Continuing full-dose colchicine despite GI toxicity can progress to bone marrow suppression and multi-organ failure.",
    class: "Musculoskeletal",
  },

  // ── ACE INHIBITORS ──
  {
    q: "A patient newly started on lisinopril develops a persistent dry cough 2 weeks into therapy. The nurse's best response is:",
    options: ["Advise the patient this is a sign of a serious allergic reaction and to stop the medication immediately", "Explain that dry cough is a common side effect caused by bradykinin accumulation and notify the provider to consider switching to an ARB", "Tell the patient to take an antihistamine to suppress the cough and continue the medication", "Document the cough and reassure the patient it will resolve within a few days"],
    answer: 1,
    explanation: "Dry cough is the most common side effect of ACE inhibitors (10–15% of patients), caused by bradykinin accumulation — NOT an allergy. The provider should be notified; switching to an ARB (e.g., losartan) provides the same cardiac benefits without the cough. Antihistamines do not treat bradykinin-mediated cough.",
    class: "ACE Inhibitors · -pril",
  },
  {
    q: "A patient on lisinopril calls the clinic reporting sudden swelling of the lips and tongue that began 30 minutes ago. She has no known allergies. What is the priority action?",
    options: ["Advise the patient to take diphenhydramine and monitor at home", "Instruct the patient to call 911 immediately — this is angioedema, a medical emergency", "Tell the patient to hold the next dose and come in for an appointment tomorrow", "Reassure the patient that mild facial swelling is a known side effect of ACE inhibitors"],
    answer: 1,
    explanation: "Angioedema is a rare but life-threatening side effect of ACE inhibitors that can cause airway obstruction. It can occur at any time, even years after starting the medication. It is most common in Black patients. This is a 911 emergency — airway must be secured immediately. ACE inhibitors are permanently contraindicated after angioedema.",
    class: "ACE Inhibitors · -pril",
  },

  // ── ARBs ──
  {
    q: "A patient asks why her provider switched her from lisinopril to losartan. The nurse's best explanation is:",
    options: ["'Losartan is stronger and more effective at lowering blood pressure than lisinopril.'", "'Losartan works differently — it blocks the receptor instead of the enzyme, so it gives the same benefits without causing a dry cough.'", "'Losartan is safer in pregnancy, so your provider is being cautious.'", "'ACE inhibitors are only short-term medications; ARBs are meant for long-term use.'"],
    answer: 1,
    explanation: "ARBs block the AT1 receptor directly rather than inhibiting ACE, so bradykinin does not accumulate — meaning no cough. They provide equivalent cardiovascular benefits. Both ACE inhibitors and ARBs are contraindicated in pregnancy. Neither is inherently stronger than the other for most indications.",
    class: "ARBs · -sartan",
  },
  {
    q: "Which combination is CONTRAINDICATED and should never be prescribed together?",
    options: ["Lisinopril + furosemide", "Losartan + metoprolol", "Lisinopril + losartan (dual RAAS blockade)", "Valsartan + amlodipine"],
    answer: 2,
    explanation: "Combining an ACE inhibitor with an ARB (dual RAAS blockade) was once thought beneficial but clinical trials showed it significantly increases risk of hypotension, hyperkalemia, and renal failure without additional benefit. This combination is now contraindicated. Lisinopril + furosemide and valsartan + amlodipine are commonly used combinations.",
    class: "ARBs · -sartan",
  },

  // ── BETA BLOCKERS ──
  {
    q: "A patient with newly diagnosed heart failure is started on carvedilol. She calls 3 days later reporting dizziness when standing up. The nurse should:",
    options: ["Instruct the patient to stop carvedilol immediately — dizziness indicates the heart failure is worsening", "Explain that orthostatic hypotension is common with carvedilol due to its alpha-blocking properties and advise rising slowly", "Tell the patient to double her fluid intake to raise blood pressure", "Reassure her that dizziness is unrelated to carvedilol and schedule a neurology referral"],
    answer: 1,
    explanation: "Carvedilol is both a beta and alpha blocker — the alpha-1 blockade causes vasodilation and orthostatic hypotension, especially early in therapy. Advise patients to rise slowly from sitting/lying positions, take the medication with food, and report severe symptoms. This is expected and manageable, not a reason to stop.",
    class: "Beta Blockers · -olol",
  },
  {
    q: "A patient with asthma and newly diagnosed hypertension asks the nurse if they can take propranolol prescribed by another provider. The nurse's best response is:",
    options: ["'Yes, propranolol is a safe antihypertensive for all patients.'", "'Propranolol blocks beta-2 receptors in the lungs and can cause severe bronchospasm in asthma — notify your provider before taking it.'", "'You can take propranolol as long as you keep your rescue inhaler nearby.'", "'Propranolol is only a problem for patients with COPD, not asthma.'"],
    answer: 1,
    explanation: "Propranolol is a non-selective beta blocker — it blocks both β1 (cardiac) and β2 (pulmonary) receptors. Blocking β2 in the lungs causes bronchoconstriction and can trigger life-threatening bronchospasm in asthmatic patients. A cardioselective beta blocker (metoprolol, atenolol) should be used if a beta blocker is truly needed.",
    class: "Beta Blockers · -olol",
  },

  // ── CALCIUM CHANNEL BLOCKERS ──
  {
    q: "A patient on verapamil for A-fib is also prescribed metoprolol by a different provider. The nurse recognizes this combination as:",
    options: ["Safe and commonly used for rate control in A-fib", "Potentially dangerous — both drugs slow the heart and combining them can cause severe bradycardia or heart block", "Appropriate since verapamil and metoprolol work on different receptors", "Fine as long as the doses are low"],
    answer: 1,
    explanation: "Verapamil (non-DHP CCB) and metoprolol (beta blocker) both decrease heart rate and AV conduction. Combining them can cause life-threatening bradycardia, complete heart block, or cardiac arrest — especially IV administration. This combination is generally avoided or used with extreme caution and monitoring.",
    class: "Calcium Channel Blockers · -dipine / -verapamil / -diltiazem",
  },
  {
    q: "A patient on amlodipine for hypertension complains of ankle swelling that is worse in the evenings. The nurse explains:",
    options: ["This is heart failure developing as a side effect of amlodipine and the drug must be stopped", "Peripheral edema is a common side effect of dihydropyridine CCBs caused by vasodilation — elevating the legs and wearing compression stockings may help", "The patient should reduce salt intake since the edema is caused by sodium retention", "Ankle swelling with amlodipine indicates kidney damage and requires immediate lab work"],
    answer: 1,
    explanation: "Peripheral (dependent) edema is the most common side effect of DHP calcium channel blockers like amlodipine, caused by vasodilation of arterioles without compensatory venodilation — fluid shifts into interstitial tissues. It is worse with prolonged standing and in the evening. It is NOT caused by sodium retention or heart failure; diuretics are minimally effective. Leg elevation helps.",
    class: "Calcium Channel Blockers · -dipine / -verapamil / -diltiazem",
  },

  // ── ANTIARRHYTHMICS & NITRATES ──
  {
    q: "A patient takes sildenafil (Viagra) for erectile dysfunction and presents to the ED with chest pain. The nurse prepares to give sublingual nitroglycerin. What is the priority assessment before administration?",
    options: ["Ask when he last ate a meal", "Determine when he last took sildenafil — nitroglycerin is absolutely contraindicated with PDE-5 inhibitors", "Check his oxygen saturation before giving any cardiac medications", "Assess whether the chest pain is crushing or pressure-like"],
    answer: 1,
    explanation: "Nitroglycerin combined with PDE-5 inhibitors (sildenafil/Viagra, tadalafil/Cialis, vardenafil/Levitra) causes profound, potentially fatal hypotension. This is an absolute contraindication. If the patient took a PDE-5 inhibitor within 24–48 hours (tadalafil up to 48 hrs), nitroglycerin must be withheld and alternative pain management used.",
    class: "Antiarrhythmics & Nitrates",
  },
  {
    q: "When administering adenosine IV for PSVT, the nurse pushes the drug and the patient's monitor shows a 5-second flat line before normal sinus rhythm resumes. The nurse should:",
    options: ["Begin CPR immediately — cardiac arrest has occurred", "Call a code blue and prepare the defibrillator", "Reassure the patient — transient asystole is the expected therapeutic mechanism of adenosine", "Document the rhythm as a complication and hold future doses"],
    answer: 2,
    explanation: "Transient asystole (flat line for seconds) is the expected and therapeutic mechanism of adenosine — it briefly blocks AV conduction to 'reset' the reentrant circuit causing PSVT. This is not cardiac arrest. Warn the patient beforehand that they will feel chest tightness and sense of doom for a few seconds. Normal rhythm typically resumes within 10–15 seconds.",
    class: "Antiarrhythmics & Nitrates",
  },
  {
    q: "A patient on long-term amiodarone therapy reports gradually increasing shortness of breath on exertion over the past month. The nurse's priority action is:",
    options: ["Reassure the patient that dyspnea is expected with cardiac disease and continue monitoring", "Notify the provider immediately — new exertional dyspnea in a patient on amiodarone raises concern for pulmonary toxicity", "Increase the patient's diuretic and recheck in 2 weeks", "Obtain an ECG to evaluate for new arrhythmia causing the dyspnea"],
    answer: 1,
    explanation: "Pulmonary toxicity (amiodarone-induced pneumonitis/pulmonary fibrosis) is the most serious and potentially fatal side effect of amiodarone. New or worsening dyspnea in a patient on amiodarone must be evaluated urgently with CXR and PFTs. Early detection is critical — the drug may need to be discontinued. Amiodarone's 40–55 day half-life means toxicity can persist even after stopping.",
    class: "Antiarrhythmics & Nitrates",
  },

  // ── ANTICOAGULANTS ──
  {
    q: "A patient on warfarin for A-fib tells the nurse she has been eating large salads with spinach, kale, and broccoli every day since starting her diet. Her INR has dropped from 2.5 to 1.4. The nurse explains:",
    options: ["She must eliminate all green vegetables from her diet while on warfarin", "Vitamin K in green vegetables competes with warfarin — she needs to maintain CONSISTENT intake, not eliminate vegetables", "The low INR means warfarin is not working and she needs a higher dose regardless of diet", "Green vegetables have no effect on warfarin and another cause must be investigated"],
    answer: 1,
    explanation: "Warfarin inhibits Vitamin K-dependent clotting factors. A sudden increase in dietary Vitamin K (dark leafy greens) competes with warfarin and lowers INR. The key teaching is CONSISTENCY — not elimination. If intake is consistent, the dose can be adjusted accordingly. Eliminating vegetables then reintroducing them causes dangerous INR swings.",
    class: "Anticoagulants",
  },
  {
    q: "A patient is receiving a heparin infusion for DVT treatment. The aPTT comes back at 35 seconds (therapeutic range 60–100 seconds). The nurse should anticipate:",
    options: ["Decreasing the heparin infusion rate — the patient is at risk for bleeding", "Increasing the heparin infusion rate — the aPTT is subtherapeutic and the patient is not adequately anticoagulated", "Stopping the heparin infusion and switching to oral warfarin", "No change — an aPTT of 35 seconds is within normal limits for heparin therapy"],
    answer: 1,
    explanation: "A therapeutic aPTT for heparin is 60–100 seconds (approximately 1.5–2.5x normal of ~25–35 sec). An aPTT of 35 seconds is subtherapeutic — the patient is not adequately anticoagulated and remains at risk for clot extension or new clots. The infusion rate should be increased per the heparin protocol.",
    class: "Anticoagulants",
  },

  // ── DIURETICS ──
  {
    q: "A patient with heart failure is prescribed both furosemide and digoxin. The nurse's priority monitoring parameter is:",
    options: ["Blood pressure — furosemide can cause dangerous hypotension with digoxin", "Serum potassium — furosemide causes hypokalemia which dramatically increases digoxin toxicity risk", "Urine output — the combination can cause urinary retention", "Blood glucose — furosemide can cause hyperglycemia that affects digoxin metabolism"],
    answer: 1,
    explanation: "Furosemide causes potassium wasting (hypokalemia). Hypokalemia dramatically increases the risk of digoxin toxicity by enhancing digoxin binding to Na/K-ATPase. This is one of the most important and tested drug interactions in nursing pharmacology. Potassium levels must be monitored closely and supplemented as needed.",
    class: "Diuretics",
  },
  {
    q: "A patient on furosemide reports ringing in both ears (tinnitus) after receiving a large IV dose. The nurse recognizes this as:",
    options: ["An anxiety reaction from the IV administration", "Ototoxicity — a dose-related side effect of loop diuretics that requires immediate provider notification", "Normal sensory changes expected with diuretic therapy", "A sign of hyponatremia caused by fluid shifts"],
    answer: 1,
    explanation: "Ototoxicity (tinnitus, hearing loss) is a dose-related side effect of loop diuretics like furosemide, especially with high-dose IV administration or when combined with other ototoxic drugs (aminoglycosides, vancomycin). It can be irreversible. The provider must be notified immediately and the dose re-evaluated.",
    class: "Diuretics",
  },

  // ── ANTIBIOTICS ──
  {
    q: "A patient is prescribed ciprofloxacin for a UTI. She also takes calcium supplements. The nurse's instructions should include:",
    options: ["Take the ciprofloxacin and calcium at the same time for convenience", "Separate ciprofloxacin from calcium by at least 2 hours — calcium binds the antibiotic and reduces absorption significantly", "Stop calcium supplements for the duration of antibiotic therapy", "Take ciprofloxacin with milk to reduce GI side effects"],
    answer: 1,
    explanation: "Ciprofloxacin (and all fluoroquinolones) chelate divalent cations — calcium, magnesium, iron, aluminum, zinc. Taking them together reduces antibiotic absorption by up to 50–90%, potentially causing treatment failure. Separate by at least 2 hours before or 6 hours after these products. Milk also contains calcium and should be avoided at the time of dosing.",
    class: "Antibiotics",
  },
  {
    q: "A patient on ciprofloxacin for a respiratory infection calls to report sudden sharp pain in his Achilles tendon. He is 62 years old and also takes prednisone. The nurse should:",
    options: ["Advise the patient to apply ice and continue the antibiotic as prescribed", "Instruct the patient to stop weight-bearing on the affected leg, stop ciprofloxacin, and seek immediate evaluation — tendon rupture is a serious risk", "Tell the patient tendon pain is a minor side effect and to take ibuprofen and continue the medication", "Recommend physical therapy for Achilles tendinopathy"],
    answer: 1,
    explanation: "Fluoroquinolones carry a BLACK BOX WARNING for tendinitis and tendon rupture, especially in patients >60, on corticosteroids, or with renal/transplant history. Achilles tendon pain in this patient is a red flag — he should stop weight-bearing, discontinue ciprofloxacin, and be evaluated immediately. Ibuprofen does not address the underlying tendon damage risk.",
    class: "Antibiotics",
  },

  // ── PAIN & OPIOIDS ──
  {
    q: "A nurse is preparing to give a patient acetaminophen 1,000mg for pain. On reviewing the MAR, she notices the patient also received Percocet (oxycodone/acetaminophen 5/325mg) two doses ago. What is the priority concern?",
    options: ["Opioid toxicity from the oxycodone component", "Acetaminophen toxicity — the patient may exceed the maximum daily dose due to hidden acetaminophen in combination products", "Drug interaction between oxycodone and acetaminophen", "Renal toxicity from NSAIDs"],
    answer: 1,
    explanation: "Percocet contains 325mg of acetaminophen per tablet. If the patient received two doses, they already have 650mg from Percocet. Adding 1,000mg = 1,650mg for just those doses. The maximum daily dose is 4g/day (2g in elderly/liver disease). Nurses must always calculate total acetaminophen from ALL sources — combination products are the #1 source of hidden acetaminophen overdose.",
    class: "Pain & Opioids",
  },
  {
    q: "A post-operative patient asks for ketorolac (Toradol) for pain but their chart shows they had a CABG 5 days ago. The nurse should:",
    options: ["Administer the ketorolac — it is a non-opioid and safer than morphine post-cardiac surgery", "Hold ketorolac and notify the provider — NSAIDs are contraindicated perioperatively for CABG patients", "Give half the ordered dose to reduce cardiovascular risk", "Administer the ketorolac and monitor for bleeding"],
    answer: 1,
    explanation: "Ketorolac (an NSAID) is contraindicated for perioperative pain in CABG patients due to increased risk of cardiovascular events, bleeding, and renal impairment. NSAIDs inhibit prostaglandins needed for vascular homeostasis post-cardiac surgery. The prescribing error must be caught before administration — hold and notify the provider.",
    class: "Pain & Opioids",
  },

  // ── PSYCH MEDS ──
  {
    q: "A patient on haloperidol develops sudden involuntary twisting of the neck and upward deviation of the eyes 2 hours after their first dose. The nurse recognizes this as:",
    options: ["A seizure requiring immediate anticonvulsant therapy", "Acute dystonia — an extrapyramidal side effect treatable with benztropine or diphenhydramine", "Neuroleptic Malignant Syndrome requiring immediate ICU transfer", "Tardive dyskinesia from long-term antipsychotic use"],
    answer: 1,
    explanation: "Acute dystonia (involuntary muscle spasms — torticollis, oculogyric crisis) is an acute EPS that occurs within hours to days of starting a typical antipsychotic like haloperidol. It is treated with anticholinergics (benztropine IM/IV) or diphenhydramine. It is NOT tardive dyskinesia (which develops after months/years) and NOT NMS (which involves hyperthermia, rigidity, and altered LOC).",
    class: "Psych Meds",
  },
  {
    q: "A nurse is teaching a patient newly started on sertraline for depression. Which statement about the medication timeline is most accurate?",
    options: ["'You should feel better within 24–48 hours of starting sertraline.'", "'Sertraline works immediately to boost serotonin levels and improve mood.'", "'It typically takes 2–6 weeks to experience the full antidepressant effect — do not stop if you feel no change in the first week.'", "'If sertraline doesn't work within 3 days, it is not the right medication for you.'"],
    answer: 2,
    explanation: "SSRIs like sertraline require 2–6 weeks to achieve full therapeutic antidepressant effect due to the time needed for neuroadaptation (receptor downregulation). Patients often feel no improvement or even increased anxiety in the first 1–2 weeks — this is normal and critical patient teaching. Abrupt discontinuation during this window is common and dangerous (relapse risk + discontinuation syndrome).",
    class: "Psych Meds",
  },
  {
    q: "A patient on lorazepam for anxiety has been taking it daily for 6 months. The provider wants to discontinue it. The nurse knows the safest approach is to:",
    options: ["Stop lorazepam immediately since it has been prescribed by a physician", "Taper the dose gradually over weeks — abrupt discontinuation of long-term benzodiazepines can cause life-threatening seizures", "Switch immediately to an SSRI with no taper needed", "Reduce the dose by half for one day then stop completely"],
    answer: 1,
    explanation: "Abrupt discontinuation of benzodiazepines in physically dependent patients can cause withdrawal seizures, which can be fatal. Long-term use (even at therapeutic doses) causes physical dependence. Tapering must be done gradually — often over weeks to months depending on the dose and duration. This is one of the most dangerous medication errors involving benzodiazepines.",
    class: "Psych Meds",
  },

  // ── ENDOCRINE ──
  {
    q: "A nurse is preparing to give insulin glargine (Lantus) and notices another nurse is mixing it with regular insulin in the same syringe to save time. The nurse should:",
    options: ["Allow it if both insulins are clear", "Intervene immediately — insulin glargine must NEVER be mixed with any other insulin", "Allow it since both are long-acting insulins", "Check with pharmacy before intervening"],
    answer: 1,
    explanation: "Insulin glargine (Lantus) has a pH of 4 and works by precipitating at neutral tissue pH to form a depot for slow absorption. Mixing it with another insulin changes the pH, disrupts the precipitation mechanism, and alters both insulins' pharmacokinetics unpredictably. Glargine must always be given as a separate injection.",
    class: "Endocrine",
  },
  {
    q: "A patient is being discharged on levothyroxine. Which instruction is most critical for the nurse to include?",
    options: ["'Take levothyroxine with breakfast to improve absorption.'", "'Take levothyroxine on an empty stomach 30–60 minutes before breakfast with water only, and separate from calcium, iron, and antacids by 4 hours.'", "'You can take levothyroxine at any time of day as long as it is consistent.'", "'Take levothyroxine with a high-protein meal for best absorption.'"],
    answer: 1,
    explanation: "Levothyroxine absorption is significantly reduced by food and many medications. It must be taken on an empty stomach with water only, 30–60 minutes before the first meal. Calcium, iron supplements, antacids, and cholestyramine reduce absorption by binding the drug — separate by at least 4 hours. TSH takes 4–6 weeks to stabilize after dose changes.",
    class: "Endocrine",
  },

  // ── RESPIRATORY ──
  {
    q: "A patient using a fluticasone/salmeterol (Advair) inhaler calls reporting white patches in her mouth and sore throat. The nurse recognizes this as:",
    options: ["An allergic reaction to the inhaler propellant requiring epinephrine", "Oral candidiasis (thrush) — a common side effect of inhaled corticosteroids preventable by rinsing the mouth after each use", "Strep throat unrelated to the inhaler", "Angioedema requiring immediate discontinuation of the inhaler"],
    answer: 1,
    explanation: "Oral candidiasis (thrush — Candida overgrowth) is a common side effect of inhaled corticosteroids (ICS) caused by local immunosuppression from deposited steroid in the oropharynx. It is prevented by rinsing the mouth and gargling with water after EVERY use and spitting it out. Using a spacer device also reduces oropharyngeal deposition. Treat with antifungal (nystatin or fluconazole).",
    class: "Respiratory",
  },
  {
    q: "A patient with COPD is prescribed tiotropium (Spiriva). He also has benign prostatic hypertrophy (BPH). The nurse should:",
    options: ["Administer tiotropium without concern since it is inhaled and has no systemic effects", "Alert the provider — tiotropium's anticholinergic effects can worsen urinary retention in patients with BPH", "Hold tiotropium until urinary symptoms are fully resolved", "Switch to albuterol since it has no anticholinergic properties"],
    answer: 1,
    explanation: "Tiotropium is a long-acting anticholinergic (LAMA). Anticholinergic drugs block muscarinic receptors including M3 receptors in the bladder, causing urinary retention — a significant concern in patients with BPH who already have impaired bladder emptying. The provider should be alerted and the patient monitored for urinary symptoms. Tiotropium can be used cautiously but requires close monitoring.",
    class: "Respiratory",
  },

  // ── GI DRUGS ──
  {
    q: "A patient is prescribed IV ondansetron for nausea. The nurse is about to administer it as a rapid IV push over 10 seconds. A colleague stops her. Why?",
    options: ["IV ondansetron must be diluted and given orally for safety", "Rapid IV push of ondansetron can cause QT prolongation and potentially fatal arrhythmias — it must be given slowly over at least 15 minutes", "Ondansetron is only safe as an IM injection", "IV ondansetron should only be given by a physician"],
    answer: 1,
    explanation: "Rapid IV push of ondansetron (over <30 seconds) is associated with QT prolongation and potentially fatal cardiac arrhythmias (torsades de pointes). IV ondansetron must be diluted and infused over at least 15 minutes. This is a critical administration safety point — the FDA has issued warnings about IV ondansetron and QT prolongation.",
    class: "GI Drugs",
  },
  {
    q: "A patient with STEMI receives tenecteplase (TNKase). 90 minutes later the ST elevation resolves and the patient develops multiple PVCs on the monitor. The nurse recognizes this as:",
    options: ["A dangerous complication requiring immediate defibrillation", "Reperfusion arrhythmias — an expected sign the thrombolytic has restored coronary blood flow", "Tenecteplase toxicity requiring reversal with aminocaproic acid", "Ventricular fibrillation requiring CPR"],
    answer: 1,
    explanation: "Reperfusion arrhythmias (PVCs, accelerated idioventricular rhythm) are an expected and reassuring sign that thrombolytic therapy has successfully restored coronary blood flow. They typically resolve spontaneously without treatment. This differs from ventricular fibrillation, which requires immediate defibrillation.",
    class: "Thrombolytics",
  },
  {
    q: "A patient started on ticagrelor (Brilinta) after a NSTEMI reports shortness of breath climbing stairs. O2 sat is 98% and there is no wheezing. The nurse should:",
    options: ["Tell her to go to the ED immediately — this indicates a pulmonary embolism", "Reassure her that dyspnea is a known side effect of ticagrelor unrelated to bronchospasm — notify the provider", "Advise her to use her albuterol inhaler since ticagrelor is causing bronchospasm", "Instruct her to stop ticagrelor immediately"],
    answer: 1,
    explanation: "Dyspnea occurs in ~15% of patients on ticagrelor and is its most unique side effect. It is NOT bronchospasm — O2 saturation remains normal with no wheezing. The mechanism may be related to adenosine accumulation. Albuterol will not help. The provider should be notified but the medication is typically continued as benefits outweigh this side effect.",
    class: "Antiplatelets",
  },
  {
    q: "A patient on long-term omeprazole reports muscle cramps and tingling in his hands. Labs show magnesium of 1.2 mEq/L (normal 1.5–2.5 mEq/L). The nurse connects this finding to:",
    options: ["The GERD itself causing electrolyte loss through frequent vomiting", "Hypomagnesemia — a known complication of long-term PPI use requiring supplementation and provider notification", "A dietary deficiency completely unrelated to his medications", "Omeprazole causing renal wasting of magnesium through nephrotoxicity"],
    answer: 1,
    explanation: "Long-term PPI use (>1 year) can cause hypomagnesemia by impairing intestinal magnesium absorption. Severe cases cause tetany, seizures, and cardiac arrhythmias. The FDA issued a safety warning about this in 2011. Magnesium should be monitored in patients on chronic PPI therapy, and switching to an H2 blocker may be necessary.",
    class: "GI Drugs",
  },
];

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function DrugCard({ drug, isFlipped, onFlip }) {
  return (
    <div className="drug-card-wrapper" onClick={onFlip}>
      <div className={`drug-card ${isFlipped ? "flipped" : ""}`}>
        <div className="card-face card-front">
          <div className="card-hint">TAP TO REVEAL</div>
          <h3>{drug.name}</h3>
          <div className="card-prompt">What is the mechanism, antidote, and key nursing pearls?</div>
          <div className="card-icon">💊</div>
        </div>
        <div className="card-face card-back">
          <div className="card-hint">TAP TO FLIP BACK</div>
          <h3>{drug.name}</h3>
          <div className="back-section">
            <span className="label">MECHANISM</span>
            <p>{drug.mechanism}</p>
          </div>
          <div className="back-section">
            <span className="label">ANTIDOTE</span>
            <p className="antidote">{drug.antidote}</p>
          </div>
          <div className="back-section">
            <span className="label">NURSING PEARLS</span>
            <p>{drug.nursingPearls}</p>
          </div>
          <div className="back-section">
            <span className="label">MONITOR</span>
            <p>{drug.monitoring}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudyGuide() {
  const [activeClass, setActiveClass] = useState(null);
  const [activeDrug, setActiveDrug] = useState(null);
  const [search, setSearch] = useState("");

  // Flatten all drugs with their class info for search
  const allDrugsFlat = DRUG_CLASSES.flatMap((dc) =>
    dc.drugs.map((drug) => ({ drug, dc }))
  );

  const searchActive = search.trim().length > 0;
  const searchResults = searchActive
    ? allDrugsFlat.filter(({ drug, dc }) => {
        const q = search.toLowerCase();
        return (
          drug.name.toLowerCase().includes(q) ||
          drug.indications.toLowerCase().includes(q) ||
          drug.mechanism.toLowerCase().includes(q) ||
          drug.nursingPearls.toLowerCase().includes(q) ||
          dc.name.toLowerCase().includes(q)
        );
      })
    : [];

  const currentClass = activeClass || DRUG_CLASSES[0];
  const displayDrugs = searchActive
    ? searchResults
    : currentClass.drugs.map((drug) => ({ drug, dc: currentClass }));

  const DrugRow = ({ drug, dc, idx }) => {
    const key = searchActive ? drug.name : idx;
    const isOpen = activeDrug === key;
    return (
      <div
        className={`drug-item ${isOpen ? "expanded" : ""}`}
        style={{ "--accent": dc.color }}
      >
        <div className="drug-header" onClick={() => setActiveDrug(isOpen ? null : key)}>
          <div className="drug-name-row">
            <h3>{drug.name}</h3>
            <span className="drug-class-tag" style={{ background: dc.color + "22", color: dc.color }}>
              {dc.name}
            </span>
          </div>
          <div className="expand-icon">{isOpen ? "−" : "+"}</div>
        </div>
        {isOpen && (
          <div className="drug-details">
            <div className="detail-grid">
              <div className="detail-block">
                <div className="detail-label">MECHANISM</div>
                <p>{drug.mechanism}</p>
              </div>
              <div className="detail-block">
                <div className="detail-label">INDICATIONS</div>
                <p>{drug.indications}</p>
              </div>
              <div className="detail-block antidote-block">
                <div className="detail-label">⚠️ ANTIDOTE / REVERSAL</div>
                <p>{drug.antidote}</p>
              </div>
              <div className="detail-block">
                <div className="detail-label">MONITORING</div>
                <p>{drug.monitoring}</p>
              </div>
              <div className="detail-block pearl-block">
                <div className="detail-label">🔑 NURSING PEARLS</div>
                <p>{drug.nursingPearls}</p>
              </div>
              {drug.mnemonic && (
                <div className="detail-block mnemonic-block">
                  <div className="detail-label">💡 MNEMONIC</div>
                  <p>{drug.mnemonic}</p>
                </div>
              )}
              <div className="detail-block">
                <div className="detail-label">SIDE EFFECTS</div>
                <p>{drug.sideEffects}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="study-guide">
      {/* Search bar */}
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          placeholder="Search drugs, conditions, mechanisms…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setActiveDrug(null); }}
        />
        {search && (
          <button className="search-clear" onClick={() => { setSearch(""); setActiveDrug(null); }}>✕</button>
        )}
      </div>

      {/* Class filter pills — hidden during search */}
      {!searchActive && (
        <div className="class-nav">
          {DRUG_CLASSES.map((dc) => (
            <button
              key={dc.id}
              className={`class-btn ${currentClass.id === dc.id ? "active" : ""}`}
              style={{ "--accent": dc.color }}
              onClick={() => { setActiveClass(dc); setActiveDrug(null); }}
            >
              <span>{dc.icon}</span>
              <span>{dc.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Results label during search */}
      {searchActive && (
        <div className="search-results-label">
          {searchResults.length > 0
            ? `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${search}"`
            : `No results for "${search}"`}
        </div>
      )}

      {/* Class overview banner */}
      {!searchActive && (currentClass.mnemonic || currentClass.overview) && (
        <div className="class-overview-banner">
          {currentClass.overview && (
            <p className="class-overview-text">{currentClass.overview}</p>
          )}
          {currentClass.mnemonic && (
            <p className="class-mnemonic-text">{currentClass.mnemonic}</p>
          )}
        </div>
      )}

      {/* Suffix banner — show when a class is selected (not searching) and has suffix info */}
      {!searchActive && currentClass.suffixNote && (
        <div className="suffix-banner">
          <span className="suffix-pill">{currentClass.suffix}</span>
          <p>{currentClass.suffixNote}</p>
        </div>
      )}

      <div className="drug-list">
        {displayDrugs.length > 0
          ? displayDrugs.map(({ drug, dc }, i) => (
              <DrugRow key={drug.name} drug={drug} dc={dc} idx={i} />
            ))
          : searchActive && (
              <div className="no-results">
                <p>Try a drug name, brand name, or condition</p>
              </div>
            )}
      </div>
    </div>
  );
}

function FlashCards() {
  const [activeClass, setActiveClass] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const drugs = activeClass
    ? activeClass.drugs
    : DRUG_CLASSES.flatMap((dc) => dc.drugs);

  const current = drugs[cardIndex];

  return (
    <div className="flashcards">
      <div className="fc-controls">
        <button
          className={`fc-filter ${!activeClass ? "active" : ""}`}
          onClick={() => { setActiveClass(null); setCardIndex(0); setFlipped(false); }}
        >All</button>
        {DRUG_CLASSES.map((dc) => (
          <button
            key={dc.id}
            className={`fc-filter ${activeClass?.id === dc.id ? "active" : ""}`}
            onClick={() => { setActiveClass(dc); setCardIndex(0); setFlipped(false); }}
          >
            {dc.icon} {dc.name}
          </button>
        ))}
      </div>

      <div className="fc-progress">
        <span>{cardIndex + 1} of {drugs.length}</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((cardIndex + 1) / drugs.length) * 100}%` }} />
        </div>
      </div>

      <DrugCard drug={current} isFlipped={flipped} onFlip={() => setFlipped(!flipped)} />

      <div className="fc-nav">
        <button
          className="nav-btn"
          disabled={cardIndex === 0}
          onClick={() => { setCardIndex(cardIndex - 1); setFlipped(false); }}
        >← Previous</button>
        <button
          className="nav-btn primary"
          disabled={cardIndex === drugs.length - 1}
          onClick={() => { setCardIndex(cardIndex + 1); setFlipped(false); }}
        >Next →</button>
      </div>
    </div>
  );
}

function Quiz() {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);

  const q = QUIZ_QUESTIONS[qIndex];

  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setShowExplanation(true);
    const correct = i === q.answer;
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, { correct, selected: i, answer: q.answer }]);
  };

  const handleNext = () => {
    if (qIndex < QUIZ_QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setDone(true);
    }
  };

  const restart = () => {
    setQIndex(0); setSelected(null); setScore(0);
    setDone(false); setShowExplanation(false); setAnswers([]);
  };

  if (done) {
    const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    return (
      <div className="quiz-done">
        <div className="score-circle">
          <span className="score-num">{pct}%</span>
          <span className="score-label">{score}/{QUIZ_QUESTIONS.length} correct</span>
        </div>
        <h2>{pct >= 80 ? "🎉 Excellent work!" : pct >= 60 ? "📚 Keep studying!" : "💪 Review the material and try again!"}</h2>
        <p className="score-message">
          {pct >= 80 ? "You're well-prepared for NCLEX-style pharmacology questions." :
           pct >= 60 ? "Good foundation — focus on the topics you missed." :
           "Revisit the Study Guide and Flashcards, then try again."}
        </p>
        <div className="results-breakdown">
          {QUIZ_QUESTIONS.map((question, i) => (
            <div key={i} className={`result-item ${answers[i]?.correct ? "correct" : "wrong"}`}>
              <span>{answers[i]?.correct ? "✓" : "✗"}</span>
              <span>{question.class}</span>
              <span className="result-q">{question.q.slice(0, 60)}...</span>
            </div>
          ))}
        </div>
        <button className="restart-btn" onClick={restart}>Retake Quiz</button>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz-meta">
        <span className="quiz-class-tag">{q.class}</span>
        <span className="quiz-counter">Question {qIndex + 1} of {QUIZ_QUESTIONS.length}</span>
      </div>
      <div className="progress-bar" style={{ marginBottom: "1.5rem" }}>
        <div className="progress-fill" style={{ width: `${((qIndex) / QUIZ_QUESTIONS.length) * 100}%` }} />
      </div>

      <h2 className="quiz-question">{q.q}</h2>

      <div className="options">
        {q.options.map((opt, i) => {
          let cls = "option";
          if (selected !== null) {
            if (i === q.answer) cls += " correct";
            else if (i === selected && selected !== q.answer) cls += " wrong";
            else cls += " dimmed";
          }
          return (
            <button key={i} className={cls} onClick={() => handleSelect(i)}>
              <span className="option-letter">{["A","B","C","D"][i]}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="explanation">
          <div className="exp-title">{selected === q.answer ? "✓ Correct!" : "✗ Incorrect"}</div>
          <p>{q.explanation}</p>
        </div>
      )}

      {selected !== null && (
        <button className="next-btn" onClick={handleNext}>
          {qIndex < QUIZ_QUESTIONS.length - 1 ? "Next Question →" : "See Results"}
        </button>
      )}
    </div>
  );
}

const PROMPT_CATEGORIES = [
  {
    label: "Drug Classes",
    prompts: ["Explain all beta blocker types and differences", "ACE inhibitors vs ARBs — when to use each", "Loop vs potassium-sparing diuretics", "DHP vs non-DHP calcium channel blockers"],
  },
  {
    label: "Mechanisms",
    prompts: ["How does heparin work vs warfarin?", "Explain the RAAS system and how drugs target it", "How do SSRIs cause serotonin syndrome?", "Why does hypokalemia worsen digoxin toxicity?"],
  },
  {
    label: "NCLEX Scenarios",
    prompts: ["Patient on warfarin has INR of 6 — what do I do?", "Priority nursing action for opioid overdose", "Give me a NCLEX question about vancomycin", "When do I hold a medication before giving it?"],
  },
  {
    label: "Drug Interactions",
    prompts: ["Dangerous drug combos I must memorize", "Why can't you take metronidazole with alcohol?", "Drugs that prolong QT interval", "NSAIDs interactions with cardiac drugs"],
  },
  {
    label: "Mnemonics",
    prompts: ["Give me mnemonics for cardiac drugs", "How to remember anticoagulant antidotes", "Mnemonic for digoxin toxicity signs", "Memory tricks for insulin types"],
  },
  {
    label: "Patient Teaching",
    prompts: ["What do I teach a patient starting warfarin?", "Alendronate administration — what's critical?", "Signs of lithium toxicity to report", "When to call 911 on nitroglycerin"],
  },
];

function AITutor() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your StudentRX AI — your on-demand pharmacology expert — your on-demand pharmacology expert. I can answer ANY pharmacology question: drug mechanisms, interactions, NCLEX scenarios, patient teaching, dosage calculations, side effect comparisons, mnemonics, and more.\n\nI cover all drug classes — not just what's in the study guide. Ask me about antibiotics, chemotherapy, psych meds, hormones, antivirals, or any drug you're encountering in clinical. What do you want to master?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    const userMsg = { role: "user", content: msg.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are StudentRX AI — a comprehensive pharmacology tutor for nursing students at all levels, from foundations through NCLEX prep and clinical practice.

YOUR SCOPE — you answer ALL pharmacology questions including:
• Any drug class: cardiac, antibiotics, psych, endocrine, oncology, antivirals, immunosuppressants, respiratory, GI, neuro, renal, OB/GYN, pediatric dosing, and beyond
• Drug mechanisms, receptor pharmacology, pharmacokinetics (ADME), pharmacodynamics
• Drug-drug interactions, drug-food interactions, drug-disease contraindications
• NCLEX-style clinical reasoning: priority setting, safety checks, hold parameters
• Nursing-specific skills: what to assess before/during/after giving a drug, patient teaching, monitoring labs
• Antidotes and reversal agents for any drug
• Dosage calculation concepts and logic
• Mnemonics, memory aids, visual associations
• Comparing similar drugs within a class
• Black box warnings and high-alert medications
• Pregnancy categories and safety in special populations
• Therapeutic drug monitoring and lab interpretation

YOUR STYLE:
• Nurse-educator tone — confident, practical, clinically grounded
• Lead with the most NCLEX-relevant points
• Use ⚠️ for warnings/contraindications, 🔑 for key nursing pearls, 💡 for memory tips
• Use bullet points and short sections for scannability
• Give concrete examples and real clinical scenarios
• Compare drugs when it clarifies understanding
• Never be vague — give specific numbers, labs, timeframes when relevant
• If asked for a mnemonic or memory trick, always provide one

IMPORTANT: You cover ALL pharmacology — do not limit yourself to only the drugs in the study guide. If a student asks about chemotherapy, HIV antivirals, anticonvulsants, biologics, or any other drug, answer fully and expertly.

You are NOT a replacement for clinical judgment or a licensed provider. For patient care decisions, always defer to current clinical references and institutional protocols.`,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div className="ai-tutor">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            {m.role === "assistant" && <div className="avatar">Rx</div>}
            <div className="bubble">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="avatar">Rx</div>
            <div className="bubble loading">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Ask any pharmacology question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
          {loading ? "…" : "→"}
        </button>
      </div>

      <div className="prompt-browser">
        <div className="prompt-category-tabs">
          {PROMPT_CATEGORIES.map((cat, i) => (
            <button
              key={i}
              className={`prompt-cat-tab ${activeCategory === i ? "active" : ""}`}
              onClick={() => setActiveCategory(i)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="prompt-chips-row">
          {PROMPT_CATEGORIES[activeCategory].prompts.map((p) => (
            <button key={p} className="prompt-chip" onClick={() => sendMessage(p)}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "study", label: "Study Guide", icon: "📖" },
  { id: "cards", label: "Flashcards", icon: "🃏" },
  { id: "quiz", label: "Quiz", icon: "✏️" },
  { id: "tutor", label: "AI Tutor", icon: "🤖" },
];

export default function App() {
  const [tab, setTab] = useState("study");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy: #0d1b2a;
          --navy-mid: #162435;
          --navy-light: #1e3248;
          --navy-border: #2a4560;
          --cream: #f5f0e8;
          --cream-dim: #e8e2d8;
          --gold: #c9a84c;
          --gold-light: #e0c070;
          --red: #e05c5c;
          --green: #4caf7d;
          --blue: #5c8de0;
          --text: #dce8f5;
          --text-dim: #8ba5c0;
          --text-dimmer: #4a6a85;
        }

        body {
          background: var(--navy);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .app {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 0 6rem;
          min-height: 100vh;
        }

        /* HEADER */
        .header {
          padding: 2rem 1.5rem 1rem;
          border-bottom: 1px solid var(--navy-border);
          background: linear-gradient(180deg, #0a1520 0%, var(--navy) 100%);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .logo-row {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.8rem;
          color: var(--cream);
          letter-spacing: -0.02em;
        }

        .logo span {
          color: var(--gold);
        }

        .logo-rx {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          color: var(--gold);
          background: var(--gold)18;
          border: 1px solid var(--gold)44;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          letter-spacing: 0.1em;
          margin-left: 0.25rem;
        }

        .subtagline {
          font-size: 0.82rem;
          color: var(--gold);
          font-style: italic;
          margin-top: 0.15rem;
          letter-spacing: 0.01em;
        }

        .tagline {
          font-size: 0.75rem;
          color: var(--text-dim);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* TABS */
        .tab-bar {
          display: flex;
          gap: 0;
          margin-top: 1rem;
          border-radius: 0;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .tab-bar::-webkit-scrollbar { display: none; }

        .tab-btn {
          flex: 1;
          min-width: 80px;
          padding: 0.65rem 0.5rem;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--text-dim);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .tab-btn .tab-icon { font-size: 1rem; }

        .tab-btn.active {
          color: var(--gold);
          border-bottom-color: var(--gold);
        }

        .tab-btn:hover:not(.active) {
          color: var(--text);
        }

        /* CONTENT */
        .content { padding: 1.5rem; }

        /* SEARCH */
        .search-wrap {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          background: var(--navy-mid);
          border: 1px solid var(--navy-border);
          border-radius: 12px;
          padding: 0 1rem;
          transition: border-color 0.2s;
        }

        .search-wrap:focus-within {
          border-color: var(--gold)88;
        }

        .search-icon {
          font-size: 0.9rem;
          margin-right: 0.6rem;
          opacity: 0.5;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 0.85rem 0;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
        }

        .search-input::placeholder { color: var(--text-dimmer); }

        .search-clear {
          background: none;
          border: none;
          color: var(--text-dimmer);
          font-size: 0.8rem;
          cursor: pointer;
          padding: 0.2rem 0.3rem;
          border-radius: 4px;
          transition: color 0.2s;
        }

        .search-clear:hover { color: var(--text); }

        .search-results-label {
          font-size: 0.72rem;
          color: var(--text-dim);
          letter-spacing: 0.04em;
          margin-bottom: 0.75rem;
          padding-left: 0.25rem;
        }

        .class-overview-banner {
          background: var(--navy-mid);
          border: 1px solid var(--navy-border);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          margin-bottom: 0.75rem;
        }

        .class-overview-text {
          font-size: 0.82rem;
          line-height: 1.6;
          color: var(--text);
          margin-bottom: 0.6rem;
        }

        .class-mnemonic-text {
          font-size: 0.82rem;
          line-height: 1.6;
          color: var(--gold);
          background: var(--gold)0d;
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
          border-left: 3px solid var(--gold);
          margin: 0;
        }

        .mnemonic-block {
          background: #2a1f0a !important;
          border: 1px solid var(--gold)44 !important;
          grid-column: 1 / -1;
        }

        .mnemonic-block p {
          color: var(--gold) !important;
          font-size: 0.82rem;
        }

        .suffix-banner {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          background: var(--navy-mid);
          border: 1px solid var(--gold)33;
          border-left: 3px solid var(--gold);
          border-radius: 0 10px 10px 0;
          padding: 0.85rem 1rem;
          margin-bottom: 1rem;
        }

        .suffix-pill {
          background: var(--gold)22;
          color: var(--gold);
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          border: 1px solid var(--gold)44;
          white-space: nowrap;
          margin-top: 0.1rem;
        }

        .suffix-banner p {
          font-size: 0.78rem;
          line-height: 1.55;
          color: var(--text-dim);
        }

        .no-results {
          text-align: center;
          padding: 2rem;
          color: var(--text-dimmer);
          font-size: 0.85rem;
        }

        /* STUDY GUIDE */
        .class-nav {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .class-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.8rem;
          background: var(--navy-light);
          border: 1px solid var(--navy-border);
          border-radius: 100px;
          color: var(--text-dim);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .class-btn.active {
          background: var(--accent)18;
          border-color: var(--accent);
          color: var(--accent);
        }

        .drug-item {
          background: var(--navy-mid);
          border: 1px solid var(--navy-border);
          border-radius: 12px;
          margin-bottom: 0.75rem;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .drug-item.expanded {
          border-color: var(--accent);
        }

        .drug-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          cursor: pointer;
        }

        .drug-name-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .drug-name-row h3 {
          font-family: 'DM Serif Display', serif;
          font-size: 1rem;
          color: var(--cream);
        }

        .drug-class-tag {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          text-transform: uppercase;
        }

        .expand-icon {
          color: var(--text-dim);
          font-size: 1.25rem;
          font-weight: 300;
          line-height: 1;
        }

        .drug-details {
          padding: 0 1.25rem 1.25rem;
          border-top: 1px solid var(--navy-border);
          padding-top: 1rem;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .detail-block {
          background: var(--navy);
          border-radius: 8px;
          padding: 0.75rem;
        }

        .antidote-block {
          background: var(--red)0d;
          border: 1px solid var(--red)33;
        }

        .pearl-block {
          background: var(--gold)0d;
          border: 1px solid var(--gold)33;
          grid-column: 1 / -1;
        }

        .detail-label {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-dimmer);
          margin-bottom: 0.4rem;
        }

        .detail-block p {
          font-size: 0.82rem;
          line-height: 1.55;
          color: var(--text);
        }

        /* FLASHCARDS */
        .fc-controls {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .fc-filter {
          padding: 0.3rem 0.75rem;
          background: var(--navy-light);
          border: 1px solid var(--navy-border);
          border-radius: 100px;
          color: var(--text-dim);
          font-size: 0.72rem;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }

        .fc-filter.active {
          background: var(--gold)18;
          border-color: var(--gold);
          color: var(--gold);
        }

        .fc-progress {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.75rem;
          color: var(--text-dim);
        }

        .progress-bar {
          flex: 1;
          height: 3px;
          background: var(--navy-light);
          border-radius: 100px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--gold), var(--gold-light));
          border-radius: 100px;
          transition: width 0.4s ease;
        }

        .drug-card-wrapper {
          perspective: 1200px;
          cursor: pointer;
          margin-bottom: 1.5rem;
          min-height: 340px;
        }

        .drug-card {
          position: relative;
          width: 100%;
          min-height: 340px;
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .drug-card.flipped { transform: rotateY(180deg); }

        .card-face {
          position: absolute;
          width: 100%;
          min-height: 340px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .card-front {
          background: linear-gradient(135deg, var(--navy-mid), var(--navy-light));
          border: 1px solid var(--navy-border);
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .card-back {
          background: var(--navy-mid);
          border: 1px solid var(--gold)44;
          transform: rotateY(180deg);
          justify-content: flex-start;
          gap: 0.75rem;
          overflow-y: auto;
        }

        .card-hint {
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-dimmer);
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        .card-front h3, .card-back h3 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.3rem;
          color: var(--cream);
          margin-bottom: 0.5rem;
        }

        .card-prompt {
          color: var(--text-dim);
          font-size: 0.85rem;
          max-width: 260px;
        }

        .card-icon { font-size: 2.5rem; margin-top: 1rem; opacity: 0.3; }

        .back-section { }

        .back-section .label {
          display: block;
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.2rem;
        }

        .back-section p {
          font-size: 0.8rem;
          line-height: 1.5;
          color: var(--text);
        }

        .back-section .antidote {
          color: var(--red);
          font-weight: 600;
        }

        .fc-nav {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }

        .nav-btn {
          padding: 0.6rem 1.5rem;
          background: var(--navy-light);
          border: 1px solid var(--navy-border);
          border-radius: 8px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .nav-btn.primary {
          background: var(--gold);
          border-color: var(--gold);
          color: var(--navy);
          font-weight: 600;
        }

        /* QUIZ */
        .quiz-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .quiz-class-tag {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--gold);
          background: var(--gold)18;
          border: 1px solid var(--gold)33;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
        }

        .quiz-counter {
          font-size: 0.75rem;
          color: var(--text-dim);
        }

        .quiz-question {
          font-family: 'DM Serif Display', serif;
          font-size: 1.15rem;
          line-height: 1.6;
          color: #ffffff;
          background: var(--navy-light);
          border: 1px solid var(--navy-border);
          border-left: 3px solid var(--gold);
          border-radius: 0 10px 10px 0;
          padding: 1.25rem 1.25rem 1.25rem 1rem;
          margin-bottom: 1.5rem;
        }

        .options {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 1rem;
        }

        .option {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.9rem 1rem;
          background: var(--navy-mid);
          border: 1px solid var(--navy-border);
          border-radius: 10px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          color: var(--text);
          line-height: 1.45;
        }

        .option:hover:not(.correct):not(.wrong):not(.dimmed) {
          border-color: var(--gold)66;
          background: var(--navy-light);
        }

        .option.correct {
          background: var(--green)18;
          border-color: var(--green);
          color: var(--green);
          cursor: default;
        }

        .option.wrong {
          background: var(--red)18;
          border-color: var(--red);
          color: var(--red);
          cursor: default;
        }

        .option.dimmed { opacity: 0.4; cursor: default; }

        .option-letter {
          width: 22px;
          height: 22px;
          min-width: 22px;
          border-radius: 50%;
          background: var(--navy-light);
          border: 1px solid var(--navy-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 600;
          font-family: 'DM Mono', monospace;
        }

        .option.correct .option-letter { background: var(--green)33; border-color: var(--green); }
        .option.wrong .option-letter { background: var(--red)33; border-color: var(--red); }

        .explanation {
          background: var(--navy-light);
          border-left: 3px solid var(--gold);
          border-radius: 0 8px 8px 0;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .exp-title {
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 0.4rem;
          color: var(--gold);
        }

        .explanation p {
          font-size: 0.82rem;
          line-height: 1.6;
          color: var(--text);
        }

        .next-btn {
          width: 100%;
          padding: 0.85rem;
          background: var(--gold);
          border: none;
          border-radius: 10px;
          color: var(--navy);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
        }

        /* QUIZ DONE */
        .quiz-done {
          text-align: center;
          padding: 1rem 0;
        }

        .score-circle {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: conic-gradient(var(--gold) 0%, var(--navy-light) 0%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          border: 3px solid var(--gold);
        }

        .score-num {
          font-family: 'DM Serif Display', serif;
          font-size: 2.2rem;
          color: var(--cream);
        }

        .score-label {
          font-size: 0.7rem;
          color: var(--text-dim);
        }

        .quiz-done h2 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.4rem;
          color: var(--cream);
          margin-bottom: 0.5rem;
        }

        .score-message {
          color: var(--text-dim);
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .results-breakdown {
          text-align: left;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .result-item {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.75rem;
        }

        .result-item.correct { background: var(--green)18; color: var(--green); }
        .result-item.wrong { background: var(--red)18; color: var(--red); }

        .result-q { color: var(--text-dim); flex: 1; }

        .restart-btn {
          padding: 0.8rem 2rem;
          background: transparent;
          border: 1px solid var(--gold);
          border-radius: 8px;
          color: var(--gold);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
        }

        /* AI TUTOR */
        .ai-tutor {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 200px);
          min-height: 500px;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-bottom: 1rem;
          scrollbar-width: thin;
          scrollbar-color: var(--navy-border) transparent;
        }

        .message {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .avatar {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: 50%;
          background: var(--gold);
          color: var(--navy);
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bubble {
          max-width: 80%;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          font-size: 0.85rem;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .message.assistant .bubble {
          background: var(--navy-light);
          border: 1px solid var(--navy-border);
          color: var(--text);
          border-radius: 4px 12px 12px 12px;
        }

        .message.user .bubble {
          background: var(--gold);
          color: var(--navy);
          font-weight: 500;
          border-radius: 12px 4px 12px 12px;
        }

        .bubble.loading {
          display: flex;
          gap: 5px;
          align-items: center;
          padding: 1rem;
        }

        .bubble.loading span {
          width: 6px; height: 6px;
          background: var(--text-dim);
          border-radius: 50%;
          animation: pulse 1.2s infinite;
        }

        .bubble.loading span:nth-child(2) { animation-delay: 0.2s; }
        .bubble.loading span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        .chat-input-row {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .chat-input {
          flex: 1;
          padding: 0.75rem 1rem;
          background: var(--navy-mid);
          border: 1px solid var(--navy-border);
          border-radius: 10px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input:focus { border-color: var(--gold)66; }
        .chat-input::placeholder { color: var(--text-dimmer); }

        .send-btn {
          padding: 0.75rem 1.25rem;
          background: var(--gold);
          border: none;
          border-radius: 10px;
          color: var(--navy);
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .prompt-browser {
          margin-top: 0.75rem;
          background: var(--navy-mid);
          border: 1px solid var(--navy-border);
          border-radius: 12px;
          overflow: hidden;
        }

        .prompt-category-tabs {
          display: flex;
          overflow-x: auto;
          scrollbar-width: none;
          border-bottom: 1px solid var(--navy-border);
        }

        .prompt-category-tabs::-webkit-scrollbar { display: none; }

        .prompt-cat-tab {
          padding: 0.55rem 0.9rem;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--text-dimmer);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .prompt-cat-tab.active {
          color: var(--gold);
          border-bottom-color: var(--gold);
          background: var(--gold)08;
        }

        .prompt-cat-tab:hover:not(.active) { color: var(--text-dim); }

        .prompt-chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          padding: 0.65rem 0.75rem;
        }

        .suggested-prompts {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-top: 0.75rem;
        }

        .prompt-chip {
          padding: 0.3rem 0.7rem;
          background: var(--navy-light);
          border: 1px solid var(--navy-border);
          border-radius: 100px;
          color: var(--text-dim);
          font-size: 0.7rem;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .prompt-chip:hover {
          border-color: var(--gold)55;
          color: var(--gold);
        }

        @media (max-width: 600px) {
          .detail-grid { grid-template-columns: 1fr; }
          .pearl-block { grid-column: 1; }
          .bubble { max-width: 90%; }
        }
      `}</style>

      <div className="app">
        <header className="header">
          <div className="logo-row">
            <div className="logo">Student<span>RX</span></div>
            <div className="logo-rx">NCLEX PREP</div>
          </div>
          <div className="tagline">Pharmacology Study App for Nursing Students</div>
          <div className="subtagline">Everything you need to master and pass pharmacology.</div>
          <nav className="tab-bar">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`tab-btn ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                <span className="tab-icon">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
        </header>

        <main className="content">
          {tab === "study" && <StudyGuide />}
          {tab === "cards" && <FlashCards />}
          {tab === "quiz" && <Quiz />}
          {tab === "tutor" && <AITutor />}
        </main>
      </div>
    </>
  );
}
