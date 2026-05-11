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

  // ══════════════════════════════════════════════
  // ANTICOAGULANTS
  // ══════════════════════════════════════════════
  {
    type: "standard",
    q: "A nurse is caring for a client receiving a continuous heparin infusion for deep vein thrombosis. The morning aPTT result is 38 seconds (therapeutic range 60–100 seconds). Which action should the nurse take FIRST?",
    options: [
      "Discontinue the heparin infusion and notify the provider",
      "Continue the infusion at the current rate and recheck aPTT in 6 hours",
      "Notify the provider and anticipate an order to increase the infusion rate",
      "Administer protamine sulfate per standing order"
    ],
    answer: 2,
    explanation: "An aPTT of 38 seconds is subtherapeutic (therapeutic range 60–100 sec, approximately 1.5–2.5× normal of ~25 sec). The client remains at risk for clot extension. The nurse should notify the provider and anticipate an order to INCREASE the rate. Protamine sulfate reverses heparin overdose, not subtherapeutic levels. Discontinuing would leave the client unprotected.",
    class: "Anticoagulants",
    nclex_category: "Pharmacological Therapies",
  },
  {
    type: "sata",
    q: "A nurse is assessing a client who has been on heparin infusion for 8 days. The platelet count has dropped from 240,000 to 74,000/mm³. The client now has a new right leg DVT despite therapeutic aPTT levels. Which actions should the nurse take? SELECT ALL THAT APPLY.",
    options: [
      "Discontinue the heparin infusion immediately",
      "Administer protamine sulfate to reverse heparin",
      "Notify the provider of findings consistent with HIT",
      "Anticipate transitioning to a non-heparin anticoagulant such as argatroban",
      "Apply compression stockings to the affected leg",
      "Document the findings and continue to monitor platelet counts"
    ],
    answer: [0, 2, 3],
    explanation: "This presentation — thrombocytopenia >50% drop on days 5–10 WITH new thrombosis despite therapeutic anticoagulation — is classic Heparin-Induced Thrombocytopenia (HIT Type II). HIT is paradoxically THROMBOTIC. Actions: STOP heparin immediately (A), notify the provider (C), and anticipate a non-heparin anticoagulant like argatroban or fondaparinux (D). Protamine sulfate treats heparin overdose, not HIT. Compression stockings are contraindicated with acute DVT.",
    class: "Anticoagulants",
    nclex_category: "Pharmacological Therapies",
  },
  {
    type: "vignette",
    vignette: "A 68-year-old client with atrial fibrillation has been taking warfarin 5mg daily for 3 years. Her INR today is 5.9. She denies any active bleeding. Review of her medication list reveals she recently started clarithromycin for a respiratory infection 5 days ago.",
    q: "The nurse understands that the elevated INR is MOST likely due to which mechanism?",
    options: [
      "Clarithromycin inhibits CYP2C9, reducing warfarin metabolism and increasing its serum level",
      "Clarithromycin directly enhances the anticoagulant effect of warfarin at receptor sites",
      "The client has been consuming excess Vitamin K which paradoxically raises INR",
      "Clarithromycin displaces warfarin from protein-binding sites, decreasing its effectiveness"
    ],
    answer: 0,
    explanation: "Clarithromycin is a potent CYP3A4 AND CYP2C9 inhibitor. Warfarin (especially the S-enantiomer) is metabolized by CYP2C9. When clarithromycin inhibits this enzyme, warfarin accumulates → INR rises dangerously. This is one of the most tested drug-drug interactions on NCLEX. For an INR of 5.9 without bleeding: hold warfarin, consider oral Vitamin K, and monitor closely.",
    class: "Anticoagulants",
    nclex_category: "Pharmacological Therapies",
  },
  {
    type: "priority",
    q: "A nurse is caring for four clients. Which client requires IMMEDIATE assessment related to anticoagulation therapy?",
    options: [
      "A client on warfarin whose INR is 2.8 and who reports mild headache",
      "A client on enoxaparin who reports pain at the injection site",
      "A client on rivaroxaban who reports sudden severe headache, confusion, and left-sided weakness",
      "A client on heparin infusion whose aPTT result is 72 seconds"
    ],
    answer: 2,
    explanation: "Using ABC prioritization and Maslow's hierarchy: sudden severe headache + confusion + focal neurological deficits in a client on anticoagulation = INTRACRANIAL HEMORRHAGE until proven otherwise. This is a life-threatening emergency requiring IMMEDIATE assessment and intervention (stop anticoagulant, emergent CT scan, andexanet alfa for rivaroxaban reversal). The other clients have expected or manageable findings.",
    class: "Anticoagulants",
    nclex_category: "Safety and Infection Control",
  },

  // ══════════════════════════════════════════════
  // ANTIPLATELETS
  // ══════════════════════════════════════════════
  {
    type: "standard",
    q: "A client who takes clopidogrel following coronary stent placement also takes omeprazole for GERD. The nurse recognizes this combination is concerning because:",
    options: [
      "Both drugs compete for the same renal excretion pathway, increasing toxicity risk",
      "Omeprazole inhibits CYP2C19, reducing activation of clopidogrel and decreasing its antiplatelet effect",
      "Clopidogrel decreases gastric acid production, making omeprazole unnecessary",
      "The combination increases bleeding risk by enhancing platelet inhibition"
    ],
    answer: 1,
    explanation: "Clopidogrel is a PRODRUG requiring hepatic activation by CYP2C19. Omeprazole competitively inhibits CYP2C19, reducing conversion of clopidogrel to its active metabolite → reduced antiplatelet effect → increased stent thrombosis risk. This is a critical drug interaction post-PCI. Pantoprazole has less CYP2C19 inhibition and is preferred if a PPI is needed.",
    class: "Antiplatelets",
    nclex_category: "Pharmacological Therapies",
  },
  {
    type: "sata",
    q: "A nurse is providing discharge teaching to a client newly prescribed ticagrelor (Brilinta) after an NSTEMI. Which instructions should the nurse include? SELECT ALL THAT APPLY.",
    options: [
      "Take the medication twice daily as prescribed",
      "You may experience shortness of breath — this is a known side effect, not a sign of heart failure",
      "Take aspirin 325mg daily with this medication for added protection",
      "Do not stop this medication without consulting your cardiologist",
      "Avoid aspirin doses greater than 100mg daily while on ticagrelor",
      "This medication may be crushed and mixed with food if swallowing is difficult"
    ],
    answer: [0, 1, 3, 4],
    explanation: "Ticagrelor: (A) is twice daily — correct. (B) Dyspnea affects ~15% of patients and is NOT bronchospasm or heart failure — correct to teach. (C) INCORRECT — high-dose aspirin (>100mg) REDUCES ticagrelor's effectiveness — contraindicated. (D) Never stop P2Y12 inhibitors abruptly post-stent — thrombosis risk. (E) Correct — aspirin must be ≤100mg/day. (F) Incorrect — ticagrelor should not be crushed without specific guidance.",
    class: "Antiplatelets",
    nclex_category: "Pharmacological Therapies",
  },

  // ══════════════════════════════════════════════
  // THROMBOLYTICS
  // ══════════════════════════════════════════════
  {
    type: "vignette",
    vignette: "A 58-year-old male presents to the ED with sudden onset right-sided weakness, facial droop, and aphasia that began 2 hours ago. CT scan shows no hemorrhage. BP is 168/94 mmHg. The provider orders alteplase (tPA) IV.",
    q: "Which nursing action is the HIGHEST priority during the alteplase infusion?",
    options: [
      "Maintain BP below 185/110 mmHg and monitor neurological status every 15 minutes",
      "Administer aspirin 325mg concurrently to prevent re-occlusion",
      "Insert a urinary catheter immediately to monitor urine output",
      "Prepare the client for emergent surgical embolectomy as a backup"
    ],
    answer: 0,
    explanation: "During tPA infusion for ischemic stroke: BP must be maintained <185/110 mmHg (hypertension increases hemorrhagic conversion risk). Neurological checks every 15 minutes are mandatory to detect intracranial hemorrhage early. Antiplatelet agents (aspirin) are CONTRAINDICATED for 24 hours post-tPA. Urinary catheterization is a secondary concern. TIME IS BRAIN — the priority is safe tPA administration.",
    class: "Thrombolytics",
    nclex_category: "Pharmacological Therapies",
  },
  {
    type: "standard",
    q: "Twenty minutes after completing a tPA infusion for ischemic stroke, a client develops sudden severe headache, vomiting, and a blood pressure of 195/112 mmHg. The nurse's PRIORITY action is:",
    options: [
      "Administer a PRN antihypertensive medication per standing orders",
      "Stop any remaining tPA infusion, notify the provider immediately, and prepare for emergent CT scan",
      "Reposition the client to prevent aspiration and continue monitoring",
      "Administer aminocaproic acid (Amicar) to reverse tPA effects"
    ],
    answer: 1,
    explanation: "Sudden severe headache + vomiting + hypertension after tPA = INTRACRANIAL HEMORRHAGE until proven otherwise. This is the most feared complication of tPA. Priority: stop infusion → notify provider → emergent CT scan. Aminocaproic acid may be used for tPA-related bleeding but the FIRST action is stopping infusion and getting imaging. Repositioning alone is dangerously inadequate.",
    class: "Thrombolytics",
    nclex_category: "Safety and Infection Control",
  },

  // ══════════════════════════════════════════════
  // ACE INHIBITORS
  // ══════════════════════════════════════════════
  {
    type: "vignette",
    vignette: "A 52-year-old male with hypertension and type 2 diabetes mellitus has been taking lisinopril 10mg daily for 6 months. At today's follow-up, his serum creatinine has risen from 0.9 to 1.3 mg/dL and potassium is 5.3 mEq/L. He reports a persistent dry cough that began 3 weeks ago.",
    q: "The nurse correctly interprets these findings as:",
    options: [
      "Signs of lisinopril toxicity requiring immediate discontinuation and dialysis",
      "Expected pharmacological effects of ACE inhibition — mild creatinine rise and hyperkalemia are acceptable; cough is a class effect requiring provider notification",
      "Evidence of worsening diabetic nephropathy unrelated to lisinopril",
      "Signs of a serious allergic reaction requiring epinephrine administration"
    ],
    answer: 1,
    explanation: "ACE inhibitors cause: (1) mild creatinine rise (10–30% is acceptable — reflects reduced glomerular hyperfiltration, which is actually renoprotective long-term); (2) hyperkalemia (reduced aldosterone → K+ retention); (3) dry cough in 10–15% of patients (bradykinin accumulation). None of these findings require emergency intervention, but the provider should be notified about the K+ level and cough. If K+ rises above 5.5 or cough is intolerable, drug change may be needed.",
    class: "ACE Inhibitors · -pril",
    nclex_category: "Pharmacological Therapies",
  },
  {
    type: "priority",
    q: "A client taking lisinopril calls the clinic reporting swelling of the lips and tongue that began 30 minutes ago. He has mild difficulty swallowing but can speak. Which instruction should the nurse give FIRST?",
    options: [
      "Take diphenhydramine 50mg immediately and come to the clinic in 2 hours",
      "Call 911 immediately — this is angioedema and can progress to airway obstruction",
      "Stop taking lisinopril and schedule a follow-up appointment tomorrow",
      "Take an antacid and monitor the swelling — it will likely resolve on its own"
    ],
    answer: 1,
    explanation: "ACE inhibitor-induced angioedema is a MEDICAL EMERGENCY. Oropharyngeal swelling can rapidly progress to complete airway obstruction and death. Even though the client can currently speak, airway compromise can occur within minutes. Call 911 FIRST. Diphenhydramine does NOT effectively treat bradykinin-mediated angioedema (unlike histamine-mediated allergic reactions). Lisinopril is permanently contraindicated after this event.",
    class: "ACE Inhibitors · -pril",
    nclex_category: "Safety and Infection Control",
  },

  // ══════════════════════════════════════════════
  // ARBs
  // ══════════════════════════════════════════════
  {
    type: "standard",
    q: "A provider prescribes losartan for a client who previously experienced intolerable cough on lisinopril. The client asks why the new medication won't cause cough. The nurse's BEST explanation is:",
    options: [
      "Losartan is a weaker medication so it has fewer side effects overall",
      "Losartan blocks the angiotensin II receptor directly without inhibiting ACE, so bradykinin does not accumulate — eliminating the cough mechanism",
      "Losartan is processed differently by the kidneys so cough is impossible",
      "The cough from lisinopril was likely unrelated to the medication"
    ],
    answer: 1,
    explanation: "ACE inhibitors block ACE → bradykinin accumulates → cough. ARBs like losartan bypass ACE entirely and block the AT1 receptor directly. Since ACE is not inhibited, bradykinin levels remain normal → no cough. ARBs provide equivalent cardiovascular and renal protection to ACE inhibitors without this side effect. Same pregnancy contraindication applies.",
    class: "ARBs · -sartan",
    nclex_category: "Pharmacological Therapies",
  },

  // ══════════════════════════════════════════════
  // BETA BLOCKERS
  // ══════════════════════════════════════════════
  {
    type: "sata",
    q: "A nurse is preparing to administer metoprolol succinate 50mg to a client with heart failure. Which assessments should the nurse complete BEFORE administration? SELECT ALL THAT APPLY.",
    options: [
      "Apical heart rate for one full minute",
      "Blood pressure",
      "Blood glucose level",
      "Respiratory status — assess for wheezing or bronchospasm",
      "Serum potassium level",
      "Temperature"
    ],
    answer: [0, 1, 2, 3],
    explanation: "Before metoprolol: (A) Apical HR — hold if <60 bpm. (B) BP — hold if systolic <90 mmHg. (C) Blood glucose — beta blockers mask tachycardia (but not diaphoresis) of hypoglycemia; baseline glucose important in diabetic patients. (D) Respiratory — metoprolol is β1-selective but can cause bronchospasm at higher doses; assess baseline. (E) Potassium is not a standard pre-administration check for metoprolol. (F) Temperature is not relevant here.",
    class: "Beta Blockers · -olol",
    nclex_category: "Pharmacological Therapies",
  },
  {
    type: "vignette",
    vignette: "A client with chronic obstructive pulmonary disease (COPD) and newly diagnosed hypertension is seen in the cardiology clinic. The cardiologist prescribes propranolol 40mg twice daily. The client's current medications include albuterol inhaler PRN and tiotropium daily.",
    q: "The nurse should question this order because:",
    options: [
      "Propranolol and albuterol have additive bronchodilation effects that could cause tachycardia",
      "Propranolol is a non-selective beta blocker that blocks β2 receptors in the lungs, which can cause severe bronchospasm in COPD clients",
      "Propranolol is contraindicated with tiotropium due to additive anticholinergic effects",
      "Propranolol requires dose adjustment in COPD due to altered drug metabolism"
    ],
    answer: 1,
    explanation: "Propranolol blocks BOTH β1 (cardiac) and β2 (pulmonary) receptors. In COPD, bronchial smooth muscle relies on β2 stimulation to maintain airway patency. Blocking β2 → bronchoconstriction → potentially fatal bronchospasm. A cardioselective β1 blocker (metoprolol, atenolol, bisoprolol) should be used if a beta blocker is truly necessary in COPD. The nurse has a professional obligation to question this order.",
    class: "Beta Blockers · -olol",
    nclex_category: "Safety and Infection Control",
  },

  // ══════════════════════════════════════════════
  // CALCIUM CHANNEL BLOCKERS
  // ══════════════════════════════════════════════
  {
    type: "standard",
    q: "A client receiving IV diltiazem for atrial fibrillation with rapid ventricular response is also prescribed metoprolol by a covering provider. The nurse should:",
    options: [
      "Administer both medications as ordered since they target different receptors",
      "Hold both medications and wait for the client's heart rate to normalize spontaneously",
      "Hold the metoprolol and contact the provider — concurrent IV diltiazem and beta blocker can cause life-threatening bradycardia and heart block",
      "Administer the metoprolol first, then the diltiazem 30 minutes later to prevent interaction"
    ],
    answer: 2,
    explanation: "Diltiazem (non-DHP CCB) slows AV conduction and decreases HR. Metoprolol (beta blocker) also slows AV conduction and HR. Combining these — especially IV — creates ADDITIVE negative chronotropy and dromotropy, risking complete heart block and cardiac arrest. The nurse must hold the metoprolol and contact the provider immediately. This is a high-stakes medication safety scenario frequently tested on NCLEX.",
    class: "Calcium Channel Blockers · -dipine / -verapamil / -diltiazem",
    nclex_category: "Safety and Infection Control",
  },
  {
    type: "sata",
    q: "A nurse is teaching a client newly prescribed amlodipine for hypertension. Which statements should the nurse include in teaching? SELECT ALL THAT APPLY.",
    options: [
      "You may notice ankle swelling — this is a common side effect caused by vasodilation",
      "Avoid drinking grapefruit juice as it can increase amlodipine levels",
      "Take this medication with food to prevent GI upset",
      "This medication will also control your heart rate if it becomes elevated",
      "Do not stop this medication abruptly without consulting your provider",
      "Headache and flushing may occur, especially when first starting"
    ],
    answer: [0, 1, 4, 5],
    explanation: "(A) Peripheral edema is the most common side effect of DHP CCBs — caused by arteriolar vasodilation. Teach leg elevation. (B) Grapefruit inhibits CYP3A4 → increased amlodipine levels — avoid. (C) Food is not required for amlodipine. (D) INCORRECT — amlodipine is a DHP CCB (vascular selective) and has minimal effect on heart rate. (E) Abrupt discontinuation can cause rebound hypertension. (F) Headache and flushing from vasodilation are common initially.",
    class: "Calcium Channel Blockers · -dipine / -verapamil / -diltiazem",
    nclex_category: "Pharmacological Therapies",
  },

  // ══════════════════════════════════════════════
  // ANTIARRHYTHMICS & NITRATES
  // ══════════════════════════════════════════════
  {
    type: "vignette",
    vignette: "A client with heart failure and atrial fibrillation has been taking amiodarone 200mg daily for 18 months. At today's appointment, he reports a new dry cough and progressive shortness of breath on exertion over the past 6 weeks. Lung auscultation reveals bilateral fine crackles. His thyroid stimulating hormone (TSH) is elevated at 8.2 mIU/L.",
    q: "The nurse correctly identifies which TWO findings as potential amiodarone toxicity?",
    options: [
      "Pulmonary toxicity (amiodarone-induced pneumonitis) and hypothyroidism",
      "Renal toxicity and hyperthyroidism",
      "Hepatotoxicity and hyperkalemia",
      "Cardiac toxicity and adrenal insufficiency"
    ],
    answer: 0,
    explanation: "Amiodarone is 37% iodine by weight and causes multi-organ toxicity. This client shows: (1) Pulmonary toxicity — progressive dyspnea + bilateral crackles = amiodarone pneumonitis (most serious, can be fatal); (2) Hypothyroidism — elevated TSH (amiodarone's iodine load can cause either hypo OR hyperthyroidism). Both require immediate provider notification. Amiodarone's half-life of 40–55 days means toxicity can persist for months after stopping.",
    class: "Antiarrhythmics & Nitrates",
    nclex_category: "Pharmacological Therapies",
  },
  {
    type: "priority",
    q: "A client with chest pain is prescribed sublingual nitroglycerin. Before administering, the nurse reviews the client's medication list. Which finding requires the nurse to WITHHOLD nitroglycerin and notify the provider?",
    options: [
      "The client takes metoprolol 25mg daily",
      "The client took sildenafil (Viagra) 20 hours ago",
      "The client's blood pressure is 142/88 mmHg",
      "The client took aspirin 81mg this morning"
    ],
    answer: 1,
    explanation: "Sildenafil (Viagra), tadalafil (Cialis), and vardenafil (Levitra) are PDE-5 inhibitors that potentiate nitric oxide → profound vasodilation. Combined with nitroglycerin (which also works via NO), the result can be severe, refractory hypotension and death. Sildenafil: nitroglycerin contraindicated for 24 hours. Tadalafil: 48 hours. This is an ABSOLUTE contraindication. The other findings do not contraindicate nitroglycerin.",
    class: "Antiarrhythmics & Nitrates",
    nclex_category: "Safety and Infection Control",
  },
  {
    type: "standard",
    q: "A nurse administers adenosine 6mg rapid IV push for a client in paroxysmal supraventricular tachycardia (PSVT). The cardiac monitor briefly shows a flat line (asystole) for 6 seconds before normal sinus rhythm resumes. The nurse should:",
    options: [
      "Begin CPR immediately — asystole indicates cardiac arrest",
      "Administer a second dose of adenosine — the first dose was ineffective",
      "Document the finding as the expected therapeutic response to adenosine and continue monitoring",
      "Call a rapid response team — the client has experienced a life-threatening complication"
    ],
    answer: 2,
    explanation: "Transient asystole (flat line lasting seconds) is the EXPECTED, THERAPEUTIC mechanism of adenosine. By transiently blocking AV node conduction, adenosine 'resets' the reentrant circuit causing PSVT. Normal rhythm typically resumes within 10–15 seconds. The nurse should warn the client beforehand about the expected chest tightness and 'doom' sensation. This is NOT cardiac arrest. No CPR or rapid response is needed.",
    class: "Antiarrhythmics & Nitrates",
    nclex_category: "Pharmacological Therapies",
  },

  // ══════════════════════════════════════════════
  // DIURETICS
  // ══════════════════════════════════════════════
  {
    type: "vignette",
    vignette: "A client with heart failure is prescribed both furosemide 40mg IV daily and digoxin 0.125mg daily. This morning's labs show: Sodium 138 mEq/L, Potassium 3.1 mEq/L, Magnesium 1.6 mEq/L, Digoxin level 1.8 ng/mL. The client reports nausea, loss of appetite, and seeing yellow-green halos around lights.",
    q: "The nurse's PRIORITY action is to:",
    options: [
      "Administer both medications as scheduled since the digoxin level is within therapeutic range",
      "Hold the furosemide only and administer digoxin as the level is therapeutic",
      "Hold both medications, notify the provider immediately — the client is showing signs of digoxin toxicity potentiated by hypokalemia",
      "Administer potassium supplementation and then give both medications"
    ],
    answer: 2,
    explanation: "Despite a 'therapeutic' digoxin level of 1.8 ng/mL, HYPOKALEMIA (K+ 3.1) dramatically enhances digoxin binding to Na/K-ATPase → TOXICITY occurs at therapeutic levels. Visual disturbances (yellow-green halos) + GI symptoms (nausea, anorexia) = classic digoxin toxicity. HOLD BOTH medications, notify provider IMMEDIATELY. The antidote is Digoxin Immune Fab (Digibind). This is a critical NCLEX safety scenario — toxicity can occur within 'normal' drug levels when electrolytes are abnormal.",
    class: "Diuretics",
    nclex_category: "Safety and Infection Control",
  },
  {
    type: "sata",
    q: "A nurse is caring for a client receiving furosemide IV for acute pulmonary edema. Which assessments are MOST important to monitor? SELECT ALL THAT APPLY.",
    options: [
      "Urine output hourly",
      "Serum potassium level",
      "Daily weight",
      "Hearing acuity",
      "Blood glucose",
      "Lung sounds"
    ],
    answer: [0, 1, 2, 3, 5],
    explanation: "(A) Hourly urine output — furosemide should produce rapid diuresis; inadequate output may indicate renal failure or fluid shifts. (B) Potassium — furosemide is potassium-WASTING; hypokalemia can cause life-threatening dysrhythmias. (C) Daily weight — most accurate measure of fluid status (1 kg = ~1 liter fluid). (D) Hearing — high-dose IV furosemide causes ototoxicity (irreversible tinnitus/hearing loss). (E) Blood glucose — not a priority for furosemide. (F) Lung sounds — assess response to treatment (crackles should diminish with diuresis).",
    class: "Diuretics",
    nclex_category: "Pharmacological Therapies",
  },

  // ══════════════════════════════════════════════
  // ANTIBIOTICS
  // ══════════════════════════════════════════════
  {
    type: "vignette",
    vignette: "A client is receiving vancomycin 1250mg IV over 60 minutes for MRSA bacteremia. After 20 minutes of infusion, the client reports sudden flushing, pruritus, and erythema across the face, neck, and upper chest. BP is 98/60 mmHg. The client denies throat tightness or difficulty breathing.",
    q: "The nurse's BEST initial action is:",
    options: [
      "Stop the infusion permanently and document a vancomycin allergy",
      "Stop or slow the infusion rate and administer diphenhydramine as ordered — this is Red Man Syndrome, not anaphylaxis",
      "Administer epinephrine 0.3mg IM — this presentation indicates anaphylaxis",
      "Continue the infusion at the current rate and apply cool compresses for comfort"
    ],
    answer: 1,
    explanation: "Red Man Syndrome is a RATE-RELATED infusion reaction (NOT a true IgE-mediated allergy) caused by direct mast cell degranulation from vancomycin. It is NOT anaphylaxis. Key differences: no bronchospasm, no urticaria, no throat closure. Management: slow or stop infusion + diphenhydramine. Vancomycin is NOT permanently contraindicated — can resume at slower rate. Epinephrine is for true anaphylaxis with airway compromise.",
    class: "Antibiotics",
    nclex_category: "Pharmacological Therapies",
  },
  {
    type: "sata",
    q: "A nurse is reviewing discharge instructions for a client completing a course of ciprofloxacin for a urinary tract infection. Which instructions should the nurse include? SELECT ALL THAT APPLY.",
    options: [
      "Separate ciprofloxacin from antacids, calcium supplements, and iron by at least 2 hours",
      "Report any tendon pain, especially in the Achilles — stop the medication and seek evaluation immediately",
      "Take the medication with a full glass of milk for best absorption",
      "Avoid prolonged sun exposure and use sunscreen while on this medication",
      "This medication is safe to use in children under 18 for most infections",
      "Report any numbness, tingling, or weakness in the extremities"
    ],
    answer: [0, 1, 3, 5],
    explanation: "(A) Divalent cations chelate fluoroquinolones → drastically reduce absorption — separate by 2+ hours. (B) BLACK BOX WARNING: tendinitis/tendon rupture — stop immediately if tendon pain occurs. (C) INCORRECT — milk contains calcium which chelates ciprofloxacin — avoid. (D) Fluoroquinolones cause photosensitivity — sunscreen required. (E) INCORRECT — contraindicated in patients <18 due to cartilage damage risk. (F) BLACK BOX WARNING: peripheral neuropathy — may be permanent — report immediately.",
    class: "Antibiotics",
    nclex_category: "Pharmacological Therapies",
  },

  // ══════════════════════════════════════════════
  // PAIN & OPIOIDS
  // ══════════════════════════════════════════════
  {
    type: "vignette",
    vignette: "A postoperative client received morphine 4mg IV 25 minutes ago for pain. The nurse performs a routine assessment and finds: respiratory rate 7 breaths/min, SpO2 88% on room air, client responds only to sternal rub, pupils are pinpoint bilaterally. Pain score is now 0.",
    q: "The nurse's FIRST action should be:",
    options: [
      "Apply a nonrebreather mask at 15L/min oxygen and recheck SpO2 in 5 minutes",
      "Notify the provider and document the assessment findings",
      "Attempt to arouse the client and administer naloxone (Narcan) per PRN order",
      "Position the client in high Fowler's and prepare for emergent intubation"
    ],
    answer: 2,
    explanation: "This client has opioid-induced respiratory depression: RR 7 (critical — <12), SpO2 88%, unresponsive, pinpoint pupils. This is a MEDICAL EMERGENCY. FIRST action: attempt to arouse AND administer naloxone (Narcan) — the opioid antagonist that will reverse respiratory depression within 1–2 minutes. Remember: naloxone's half-life (30–90 min) is shorter than morphine's — monitor for re-narcotization and repeat doses PRN. Oxygen alone is insufficient for this level of depression.",
    class: "Pain & Opioids",
    nclex_category: "Safety and Infection Control",
  },
  {
    type: "sata",
    q: "A nurse is reviewing a postoperative client's medication administration record. The client received Percocet (oxycodone 5mg/acetaminophen 325mg) two tablets at 0800 and two tablets at 1200. The client now requests Tylenol 1000mg at 1600 for a headache. Which actions should the nurse take? SELECT ALL THAT APPLY.",
    options: [
      "Administer the Tylenol as requested — it is a different medication from Percocet",
      "Calculate the total acetaminophen received from Percocet doses",
      "Recognize that administering Tylenol 1000mg would bring the total acetaminophen to 3,300mg for the day so far",
      "Hold the Tylenol and contact the provider to report the situation",
      "Administer ibuprofen instead since it does not contain acetaminophen",
      "Document that the client refused pain medication"
    ],
    answer: [1, 2, 3],
    explanation: "This is a CRITICAL medication safety scenario. Percocet contains 325mg acetaminophen per tablet. Client received: 4 tablets × 325mg = 1,300mg already. Adding Tylenol 1000mg = 2,300mg total by 1600 — within daily limit BUT additional Percocet doses later could push past 4,000mg (max) or 3,000mg (elderly/liver disease). The nurse must CALCULATE total acetaminophen (B), recognize the cumulative risk (C), and notify the provider (D) before administering. Never give additional acetaminophen-containing products without accounting for all sources.",
    class: "Pain & Opioids",
    nclex_category: "Safety and Infection Control",
  },

  // ══════════════════════════════════════════════
  // PSYCH MEDS
  // ══════════════════════════════════════════════
  {
    type: "vignette",
    vignette: "A client with schizophrenia has been receiving haloperidol 5mg IM for 3 days in the inpatient psychiatric unit. The nurse is called to the client's room and finds him rigid, with a temperature of 39.8°C (103.6°F), blood pressure 168/102 mmHg, heart rate 122 bpm, diaphoresis, and severely altered mental status. The client's CK level from this morning is 4,200 U/L.",
    q: "The nurse recognizes this presentation as:",
    options: [
      "Acute dystonia — treatable with benztropine IM",
      "Serotonin syndrome — treat with cyproheptadine",
      "Neuroleptic Malignant Syndrome (NMS) — a life-threatening emergency requiring immediate intervention",
      "Akathisia — treat with propranolol and reduce antipsychotic dose"
    ],
    answer: 2,
    explanation: "NMS is a rare but LIFE-THREATENING reaction to antipsychotics: FEVER (hyperthermia) + RIGIDITY (lead-pipe) + ALTERED MENTAL STATUS + AUTONOMIC INSTABILITY (labile BP, tachycardia, diaphoresis) + elevated CK (muscle breakdown). Management: STOP antipsychotic IMMEDIATELY, ICU transfer, dantrolene (muscle relaxant), bromocriptine (dopamine agonist), supportive care. Mortality 10–20% if untreated. MNEMONIC: 'FALTER' — Fever, Altered consciousness, Labile BP, Tremor, Elevated CK, Rigidity.",
    class: "Psych Meds",
    nclex_category: "Safety and Infection Control",
  },
  {
    type: "sata",
    q: "A nurse is teaching a client newly prescribed sertraline (Zoloft) 50mg daily for major depressive disorder. Which points should the nurse emphasize? SELECT ALL THAT APPLY.",
    options: [
      "Full antidepressant effect may take 2–6 weeks — do not stop if no immediate improvement",
      "Do not take any over-the-counter cold medications containing dextromethorphan without consulting your provider",
      "You may take this medication with MAOIs for enhanced antidepressant effect",
      "Report increased thoughts of self-harm or suicide, especially in the first few weeks",
      "Do not abruptly discontinue this medication — taper under provider guidance",
      "Tramadol and other serotonergic drugs should be used cautiously with sertraline"
    ],
    answer: [0, 1, 3, 4, 5],
    explanation: "(A) SSRIs take 2–6 weeks for full effect — critical teaching to prevent premature discontinuation. (B) Dextromethorphan is serotonergic — risk of serotonin syndrome with SSRIs. (C) DANGEROUS AND INCORRECT — MAOIs + SSRIs = life-threatening serotonin syndrome; 14-day washout required. (D) BLACK BOX WARNING: increased suicidality in <25 years, especially early in treatment — monitor closely. (E) Abrupt discontinuation causes discontinuation syndrome (dizziness, 'brain zaps', nausea). (F) Tramadol is serotonergic — serotonin syndrome risk.",
    class: "Psych Meds",
    nclex_category: "Pharmacological Therapies",
  },

  // ══════════════════════════════════════════════
  // ENDOCRINE
  // ══════════════════════════════════════════════
  {
    type: "vignette",
    vignette: "A client with type 1 diabetes is admitted for pneumonia. The nurse prepares to administer the prescribed insulin: insulin glargine (Lantus) 22 units at bedtime and regular insulin per sliding scale. The client's blood glucose is 287 mg/dL. The sliding scale calls for 8 units of regular insulin.",
    q: "Which action by the nurse demonstrates CORRECT insulin administration?",
    options: [
      "Mix the 22 units of glargine and 8 units of regular insulin in one syringe for a single injection",
      "Administer the regular insulin first, then draw up glargine in the same syringe",
      "Administer the regular insulin and glargine as TWO SEPARATE injections in different sites",
      "Hold the glargine since the blood glucose is already elevated and regular insulin is being given"
    ],
    answer: 2,
    explanation: "Insulin glargine (Lantus) MUST NEVER be mixed with any other insulin. Glargine has a pH of 4 — when mixed with regular insulin (pH ~7), the pH change causes precipitation and unpredictable pharmacokinetics of BOTH insulins. Always administer as SEPARATE injections at separate sites. This is one of the most commonly tested insulin safety questions on NCLEX. Glargine should also NEVER be shaken — roll gently.",
    class: "Endocrine",
    nclex_category: "Safety and Infection Control",
  },
  {
    type: "priority",
    q: "A nurse is caring for four clients with diabetes. Which client requires PRIORITY assessment?",
    options: [
      "A client on metformin whose blood glucose is 142 mg/dL before lunch",
      "A client on insulin glargine whose fasting glucose is 118 mg/dL",
      "A client on regular insulin who received their dose 45 minutes ago and is now diaphoretic, trembling, and confused",
      "A client on sitagliptin whose HbA1c is 7.2%"
    ],
    answer: 2,
    explanation: "Using ABC and Maslow's: diaphoresis + trembling + confusion 45 minutes after regular insulin = HYPOGLYCEMIA (Somogyi-type or insulin peak effect). Regular insulin peaks at 2–4 hours but can cause earlier hypoglycemia if the client didn't eat. Hypoglycemia can progress to seizures and death. PRIORITY: check glucose STAT, administer 15g fast-acting carbohydrate (15–15 rule) or dextrose IV if unable to swallow. The other clients have controlled or expected glucose values.",
    class: "Endocrine",
    nclex_category: "Safety and Infection Control",
  },

  // ══════════════════════════════════════════════
  // RESPIRATORY
  // ══════════════════════════════════════════════
  {
    type: "vignette",
    vignette: "A 34-year-old client with moderate persistent asthma uses albuterol (ProAir) inhaler 4–5 times per week for symptom relief. She uses fluticasone (Flovent) inhaled corticosteroid twice daily as prescribed. She reports her asthma is 'under control' because the albuterol always works when she needs it.",
    q: "The nurse's BEST response to this client's statement is:",
    options: [
      "Agree with the client — if the rescue inhaler works, asthma is being managed effectively",
      "Inform the client that using albuterol more than 2 days/week for symptoms indicates inadequately controlled asthma requiring a provider evaluation for step-up therapy",
      "Tell the client to use the fluticasone as needed instead of the albuterol",
      "Advise the client to double the fluticasone dose to eliminate albuterol use"
    ],
    answer: 1,
    explanation: "Per NAEPP (National Asthma Education and Prevention Program) guidelines: rescue inhaler use >2 days/week for symptom control indicates UNCONTROLLED asthma. Albuterol treats bronchospasm but does NOT address underlying airway inflammation. This client needs provider evaluation for step-up therapy (likely increasing ICS dose or adding a LABA). Over-reliance on rescue inhalers is associated with asthma mortality. Doubling ICS without provider order is not the nurse's role.",
    class: "Respiratory",
    nclex_category: "Pharmacological Therapies",
  },
  {
    type: "standard",
    q: "A client with COPD who takes tiotropium (Spiriva) HandiHaler reports he swallowed the capsule by mistake instead of inhaling it. The nurse should:",
    options: [
      "Tell the client this is fine — the medication will be absorbed through the GI tract",
      "Advise the client to induce vomiting immediately to prevent systemic absorption",
      "Inform the client that the medication will not work if swallowed — the dose is missed; do not double the next dose, and use the inhaler correctly next time",
      "Administer activated charcoal to prevent anticholinergic toxicity"
    ],
    answer: 2,
    explanation: "Tiotropium capsules are designed for INHALATION only — the device punctures the capsule and the powder is inhaled. If swallowed, the medication is poorly absorbed orally and will NOT produce therapeutic bronchodilation. The client simply missed the dose. Do NOT induce vomiting (aspiration risk) or give activated charcoal (not indicated for a non-toxic missed inhalation dose). Teach correct HandiHaler technique — this is a common administration error.",
    class: "Respiratory",
    nclex_category: "Pharmacological Therapies",
  },

  // ══════════════════════════════════════════════
  // GI DRUGS
  // ══════════════════════════════════════════════
  {
    type: "vignette",
    vignette: "A client is scheduled for a CT scan with IV contrast tomorrow morning. Current medications include: metformin 1000mg twice daily, lisinopril 10mg daily, atorvastatin 40mg at bedtime, and aspirin 81mg daily. Baseline creatinine is 1.1 mg/dL.",
    q: "Which medication adjustment requires the nurse to contact the provider BEFORE the procedure?",
    options: [
      "Lisinopril — ACE inhibitors must be held 24 hours before all imaging studies",
      "Metformin — must be held before IV contrast and for 48 hours after, pending renal function reassessment",
      "Atorvastatin — statins interact with iodinated contrast media",
      "Aspirin — antiplatelet agents must be held before CT scans"
    ],
    answer: 1,
    explanation: "Metformin must be HELD before IV contrast procedures. IV contrast can cause contrast-induced nephropathy (acute kidney injury). If renal function deteriorates, metformin accumulates → lactic acidosis (potentially fatal, 50% mortality). Protocol: hold metformin day of procedure, recheck creatinine/eGFR 48 hours post-procedure, resume only if renal function is stable. This applies even if baseline creatinine is normal.",
    class: "GI Drugs",
    nclex_category: "Safety and Infection Control",
  },
  {
    type: "sata",
    q: "A nurse is teaching a client newly prescribed omeprazole (Prilosec) 20mg for GERD. Which statements should be included? SELECT ALL THAT APPLY.",
    options: [
      "Take omeprazole 30–60 minutes before your first meal of the day",
      "Long-term use may decrease magnesium and vitamin B12 levels — annual monitoring is recommended",
      "You may crush the tablet and mix it with water for easier swallowing",
      "Omeprazole may reduce the effectiveness of clopidogrel if you take both",
      "If you take calcium supplements, separate them from omeprazole by at least 2 hours",
      "You should see symptom relief within 24 hours of starting"
    ],
    answer: [0, 1, 3, 4],
    explanation: "(A) PPIs must be taken before meals — the proton pump must be actively secreting to be inhibited. (B) Long-term PPI use causes hypomagnesemia and B12 deficiency — monitoring warranted. (C) INCORRECT — do not crush delayed-release omeprazole (destroys enteric coating); capsule contents can be sprinkled on applesauce only. (D) Omeprazole inhibits CYP2C19 → reduces clopidogrel activation — significant interaction. (E) Calcium reduces PPI absorption — separate by 2 hours. (F) INCORRECT — PPIs typically take 1–4 days for symptom improvement, not 24 hours.",
    class: "GI Drugs",
    nclex_category: "Pharmacological Therapies",
  },

  // ══════════════════════════════════════════════
  // MUSCULOSKELETAL
  // ══════════════════════════════════════════════
  {
    type: "vignette",
    vignette: "A client with multiple sclerosis has been receiving intrathecal baclofen via an implanted pump for severe spasticity for 2 years. The pump alarm activates and the client reports sudden dramatic increase in muscle spasms, extreme agitation, high fever (40.1°C/104.2°F), and has a seizure.",
    q: "The nurse recognizes this as:",
    options: [
      "An MS relapse requiring high-dose IV methylprednisolone",
      "Intrathecal baclofen withdrawal syndrome — a life-threatening emergency",
      "Baclofen toxicity from pump overdose — administer physostigmine",
      "Neuroleptic malignant syndrome from a recent medication change"
    ],
    answer: 1,
    explanation: "Abrupt intrathecal baclofen withdrawal from pump failure = LIFE-THREATENING EMERGENCY. Withdrawal signs: rebound severe spasticity, hyperthermia, rhabdomyolysis, seizures, autonomic instability, multi-organ failure. This is distinct from baclofen TOXICITY (which causes CNS/respiratory depression, not spasticity). Treatment: restore baclofen delivery IMMEDIATELY, supportive care, ICU transfer. This has a high mortality rate if not recognized and treated promptly.",
    class: "Musculoskeletal",
    nclex_category: "Safety and Infection Control",
  },
  {
    type: "standard",
    q: "A client with rheumatoid arthritis has been prescribed methotrexate 15mg weekly. The nurse reviews the medication administration record and sees the order written as 'methotrexate 15mg daily.' The nurse should:",
    options: [
      "Administer the medication as written — 15mg is within the normal dose range",
      "Administer the medication but reduce the dose to 7.5mg daily as a safety measure",
      "HOLD the medication immediately and clarify the order — methotrexate for RA is given WEEKLY, not daily",
      "Contact the pharmacy to confirm the dose before administering"
    ],
    answer: 2,
    explanation: "This is one of the MOST DANGEROUS and frequently cited medication errors in nursing. Methotrexate for rheumatoid arthritis is dosed WEEKLY. Daily dosing causes fatal bone marrow suppression, severe mucositis, hepatotoxicity, and pulmonary toxicity. The nurse MUST HOLD the medication and clarify with the prescriber — this is a prescribing error. Even if pharmacy has filled it, the nurse is the last safety check. Never administer without clarification.",
    class: "Musculoskeletal",
    nclex_category: "Safety and Infection Control",
  },
  {
    type: "sata",
    q: "A nurse is teaching a client newly prescribed alendronate (Fosamax) 70mg weekly for osteoporosis. Which instructions are ESSENTIAL to include? SELECT ALL THAT APPLY.",
    options: [
      "Take the tablet on an empty stomach with 8 ounces of plain water only",
      "Remain upright (sitting or standing) for at least 30 minutes after taking the medication",
      "Take the medication with orange juice to improve absorption",
      "Do not eat, drink anything other than water, or take other medications for at least 30 minutes",
      "If you develop jaw pain or a loose tooth, notify your provider immediately",
      "You may lie down after taking the medication if you feel dizzy"
    ],
    answer: [0, 1, 3, 4],
    explanation: "(A) Empty stomach + plain water only — food reduces absorption by >60%. (B) MUST remain upright ≥30 min — prevents esophageal ulceration/erosion (caustic to esophagus). (C) INCORRECT — orange juice (and all beverages except water) reduces absorption. (D) No food, drink, or medications for 30 min — critical. (E) Osteonecrosis of the jaw is a rare but serious complication — report jaw pain, loose teeth, or exposed bone. (F) INCORRECT — lying down causes esophageal reflux of the drug → ulceration/perforation.",
    class: "Musculoskeletal",
    nclex_category: "Pharmacological Therapies",
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

// Get unique drug classes for filter
const QUIZ_CLASSES = ["All", ...Array.from(new Set(QUIZ_QUESTIONS.map(q => q.class)))];
const TIMER_SECONDS = 60;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Quiz() {
  const [mode, setMode] = useState(null); // null = setup screen
  const [filterClass, setFilterClass] = useState("All");
  const [timedMode, setTimedMode] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const timerRef = useRef(null);

  const startQuiz = (missedOnly = false, missedQs = []) => {
    let pool = missedOnly ? missedQs : QUIZ_QUESTIONS;
    if (!missedOnly && filterClass !== "All") {
      pool = pool.filter(q => q.class === filterClass);
    }
    const shuffled = shuffle(pool);
    setQuestions(shuffled); questionsRef.current = shuffled; answersRef.current = []; scoreRef.current = 0;
    setQIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setShowExplanation(false);
    setAnswers([]);
    setTimeLeft(TIMER_SECONDS);
    setMode("quiz");
  };

  const q = questions[qIndex];

  // Timer logic
  useEffect(() => {
    if (mode !== "quiz" || !timedMode || selected !== null || done) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          // Auto-submit as wrong
          setSelected(-1);
          setShowExplanation(true);
          setAnswers(a => [...a, { correct: false, selected: -1, answer: q.answer }]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [qIndex, mode, timedMode, selected, done]);

  const questionsRef = useRef([]);
  const answersRef = useRef([]);
  const scoreRef = useRef(0);
  const [sataSelected, setSataSelected] = useState([]);

  const isSata = q && q.type === "sata";

  const handleSelect = (i) => {
    if (isSata) {
      // Toggle SATA selection
      setSataSelected(prev =>
        prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
      );
    } else {
      if (selected !== null) return;
      clearInterval(timerRef.current);
      setSelected(i);
      setShowExplanation(true);
      const correct = i === q.answer;
      if (correct) setScore(s => { scoreRef.current = s + 1; return s + 1; });
      setAnswers(a => { const n = [...a, { correct, selected: i, answer: q.answer }]; answersRef.current = n; return n; });
    }
  };

  const handleSataSubmit = () => {
    clearInterval(timerRef.current);
    const correctAnswers = q.answer; // array
    const correct = JSON.stringify([...sataSelected].sort()) === JSON.stringify([...correctAnswers].sort());
    setSelected(sataSelected);
    setShowExplanation(true);
    if (correct) setScore(s => s + 1);
    setAnswers(a => [...a, { correct, selected: sataSelected, answer: correctAnswers }]);
  };

  const handleNext = () => {
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
      setSelected(null);
      setSataSelected([]);
      setShowExplanation(false);
      setTimeLeft(TIMER_SECONDS);
    } else {
      // Save to progress
      try {
        const classBreakdown = {};
        questionsRef.current.forEach((q, i) => {
          const cls = q.class;
          if (!classBreakdown[cls]) classBreakdown[cls] = { correct: 0, total: 0 };
          classBreakdown[cls].total++;
          if (answersRef.current[i]?.correct) classBreakdown[cls].correct++;
        });
        const prev = JSON.parse(localStorage.getItem("studentrx_progress") || "[]");
        prev.push({ date: new Date().toISOString(), pct: Math.round((scoreRef.current / questionsRef.current.length) * 100), correct: scoreRef.current, total: questionsRef.current.length, filter: filterClass, timed: timedMode, classBreakdown });
        localStorage.setItem("studentrx_progress", JSON.stringify(prev.slice(-50)));
      } catch(e) {}
      setDone(true);
    }
  };

  // SETUP SCREEN
  if (mode === null) {
    return (
      <div className="quiz-setup">
        <h2 className="setup-title">Quiz Settings</h2>

        <div className="setup-section">
          <div className="setup-label">Filter by Drug Class</div>
          <div className="setup-pills">
            {QUIZ_CLASSES.map(cls => (
              <button
                key={cls}
                className={`setup-pill ${filterClass === cls ? "active" : ""}`}
                onClick={() => setFilterClass(cls)}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-section">
          <div className="setup-label">Mode</div>
          <div className="setup-modes">
            <button
              className={`mode-btn ${!timedMode ? "active" : ""}`}
              onClick={() => setTimedMode(false)}
            >
              <span className="mode-icon">📖</span>
              <span className="mode-name">Study Mode</span>
              <span className="mode-desc">No time limit — read explanations</span>
            </button>
            <button
              className={`mode-btn ${timedMode ? "active" : ""}`}
              onClick={() => setTimedMode(true)}
            >
              <span className="mode-icon">⏱️</span>
              <span className="mode-name">Timed Mode</span>
              <span className="mode-desc">60 seconds per question</span>
            </button>
          </div>
        </div>

        <div className="setup-count">
          {filterClass === "All" ? QUIZ_QUESTIONS.length : QUIZ_QUESTIONS.filter(q => q.class === filterClass).length} questions
          {filterClass !== "All" && ` in ${filterClass}`} · shuffled randomly
        </div>

        <button className="start-btn" onClick={() => startQuiz()}>
          Start Quiz →
        </button>
      </div>
    );
  }

  // RESULTS SCREEN
  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const missedQs = questions.filter((_, i) => !answers[i]?.correct);

    return (
      <div className="quiz-done">
        <div className="score-circle">
          <span className="score-num">{pct}%</span>
          <span className="score-label">{score}/{questions.length} correct</span>
        </div>
        <h2>{pct >= 80 ? "🎉 Excellent work!" : pct >= 60 ? "📚 Keep studying!" : "💪 Review and try again!"}</h2>
        <p className="score-message">
          {pct >= 80 ? "You're well-prepared for NCLEX-style pharmacology questions." :
           pct >= 60 ? "Good foundation — focus on the topics you missed." :
           "Revisit the Study Guide and Flashcards, then try again."}
        </p>

        <div className="result-actions">
          {missedQs.length > 0 && (
            <button className="missed-btn" onClick={() => startQuiz(true, missedQs)}>
              🎯 Retake Missed Only ({missedQs.length})
            </button>
          )}
          <button className="restart-btn" onClick={() => startQuiz()}>
            🔀 New Shuffled Quiz
          </button>
          <button className="restart-btn outline" onClick={() => setMode(null)}>
            ⚙️ Change Settings
          </button>
        </div>

        <div className="results-breakdown">
          {questions.map((question, i) => (
            <div key={i} className={`result-item ${answers[i]?.correct ? "correct" : "wrong"}`}>
              <span>{answers[i]?.correct ? "✓" : "✗"}</span>
              <span>{question.class}</span>
              <span className="result-q">{question.q.slice(0, 60)}...</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // QUIZ SCREEN
  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft > 30 ? "#4caf7d" : timeLeft > 10 ? "#e0a85c" : "#e05c5c";
  const typeLabels = { standard: "Multiple Choice", sata: "Select All That Apply", vignette: "Clinical Vignette", priority: "Priority Question" };
  const typeColors = { standard: "#5c8de0", sata: "#c47ee0", vignette: "#e0a85c", priority: "#e05c5c" };
  const qType = q.type || "standard";

  return (
    <div className="quiz">
      <div className="quiz-meta">
        <span className="quiz-class-tag">{q.class}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {timedMode && (
            <span className="timer-badge" style={{ color: timerColor, borderColor: timerColor }}>
              ⏱ {timeLeft}s
            </span>
          )}
          <span className="quiz-counter">Question {qIndex + 1} of {questions.length}</span>
        </div>
      </div>

      <div className="question-type-badge" style={{ background: typeColors[qType] + "22", color: typeColors[qType], borderColor: typeColors[qType] + "55" }}>
        {qType === "sata" ? "📋 " : qType === "vignette" ? "📄 " : qType === "priority" ? "⚡ " : "❓ "}{typeLabels[qType]}
      </div>

      {timedMode && (
        <div className="timer-bar">
          <div className="timer-fill" style={{ width: `${timerPct}%`, background: timerColor }} />
        </div>
      )}

      <div className="progress-bar" style={{ marginBottom: "1rem" }}>
        <div className="progress-fill" style={{ width: `${(qIndex / questions.length) * 100}%` }} />
      </div>

      {q.vignette && (
        <div className="vignette-box">
          <div className="vignette-label">CLINICAL SCENARIO</div>
          <p>{q.vignette}</p>
        </div>
      )}

      {q.nclex_category && (
        <div className="nclex-category">NCLEX Category: {q.nclex_category}</div>
      )}

      <h2 className="quiz-question">{q.q}</h2>

      {isSata && selected === null && (
        <div className="sata-instruction">📋 Select ALL answers that apply, then click Submit.</div>
      )}

      <div className="options">
        {q.options.map((opt, i) => {
          let cls = "option";
          if (isSata) {
            if (selected !== null) {
              if (q.answer.includes(i)) cls += " correct";
              else if (sataSelected.includes(i) && !q.answer.includes(i)) cls += " wrong";
              else cls += " dimmed";
            } else {
              if (sataSelected.includes(i)) cls += " sata-selected";
            }
          } else {
            if (selected !== null) {
              if (i === q.answer) cls += " correct";
              else if (i === selected && selected !== q.answer) cls += " wrong";
              else cls += " dimmed";
            }
          }
          return (
            <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={selected !== null}>
              <span className="option-letter">{["A","B","C","D","E","F"][i]}</span>
              <span>{opt}</span>
              {isSata && selected === null && sataSelected.includes(i) && <span className="sata-check">✓</span>}
            </button>
          );
        })}
      </div>

      {isSata && selected === null && sataSelected.length > 0 && (
        <button className="next-btn" onClick={handleSataSubmit} style={{ marginTop: "0.75rem" }}>
          Submit Answers ({sataSelected.length} selected)
        </button>
      )}

      {showExplanation && (
        <div className="explanation">
          <div className="exp-title">
            {isSata
              ? (JSON.stringify([...sataSelected].sort()) === JSON.stringify([...q.answer].sort()) ? "✓ Correct!" : "✗ Incorrect")
              : selected === q.answer ? "✓ Correct!" : selected === -1 ? "⏰ Time's up!" : "✗ Incorrect"}
          </div>
          {isSata && (
            <div style={{ fontSize: "0.78rem", color: "var(--gold)", marginBottom: "0.4rem" }}>
              Correct answers: {q.answer.map(i => ["A","B","C","D","E","F"][i]).join(", ")}
            </div>
          )}
          <p>{q.explanation}</p>
        </div>
      )}

      {selected !== null && (
        <button className="next-btn" onClick={handleNext}>
          {qIndex < questions.length - 1 ? "Next Question →" : "See Results"}
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


// ── MNEMONICS ─────────────────────────────────────────────────────────────────

const MNEMONICS_DATA = [
  { category: "Anticoagulants", color: "#e05c5c", icon: "🩸", items: [
    { drug: "Heparin antidote", mnemonic: "PROTamine = antidote for hePARIN", detail: "Protamine sulfate reverses heparin. Think: you PROTEST heparin effects with Protamine. For LMWH (enoxaparin): partial reversal ~60%." },
    { drug: "Warfarin reversal", mnemonic: "Vitamin K = KEY to unlock warfarin. FFP = FAST reversal", detail: "Vitamin K (slow, oral/IV). FFP or 4-factor PCC for urgent reversal. INR goal: 2-3 most patients, 2.5-3.5 for mechanical valves. Many drug/food interactions." },
    { drug: "HIT recognition", mnemonic: "4 Ts: Thrombocytopenia, Timing (5-10 days), Thrombosis, oTher causes excluded", detail: "HIT is paradoxically THROMBOTIC. Platelet drop >50% + new clots = STOP heparin immediately. Switch to non-heparin anticoagulant (argatroban, fondaparinux)." },
    { drug: "DOACs reversal", mnemonic: "Rivaroxaban/Apixaban = Andexanet alfa. Dabigatran = Praxbind", detail: "Factor Xa inhibitors (rivaroxaban, apixaban) reversed by Andexanet alfa. Direct thrombin inhibitor (dabigatran) reversed by idarucizumab (Praxbind). No routine monitoring needed." },
  ]},
  { category: "Cardiac", color: "#e05ca0", icon: "❤️", items: [
    { drug: "Beta Blockers (-olol)", mnemonic: "-OLOL = slOLOw. Hold if HR <60 or BP <90/60", detail: "NEVER stop abruptly (rebound MI/HTN). Masks hypoglycemia tachycardia. Antidote: glucagon. Non-selective (propranolol) = avoid in asthma/COPD." },
    { drug: "ACE Inhibitors (-pril)", mnemonic: "ACE = Always Causes Effects on K+ and Cough", detail: "Dry cough (10-15%) = bradykinin. Switch to ARB if intolerable. Contraindicated: pregnancy. Monitor: K+, creatinine, BP. Angioedema = STOP permanently." },
    { drug: "Digoxin toxicity", mnemonic: "DIRT: Dysrhythmias, Irregular vision (halos), nausea/vomiting, hypokalemia Triggers it", detail: "Yellow-green halos = classic. Hypokalemia = #1 trigger. Therapeutic: 0.5-2 ng/mL. Antidote: Digibind. Hold if HR <60. Narrow therapeutic index!" },
    { drug: "Nitroglycerin", mnemonic: "NTG: No Taking with Girlfriend (Viagra/Cialis)", detail: "ABSOLUTE contraindication with PDE-5 inhibitors. Store in dark glass bottle. Up to 3 SL tablets q5 min. IV: use non-PVC tubing. Headache is expected." },
    { drug: "Amiodarone toxicity", mnemonic: "PALE Thyroid: Pulmonary, Altered skin, Liver, Eye + Thyroid", detail: "Most serious = pulmonary toxicity (pneumonitis). Blue-gray skin (irreversible). Half-life 40-55 DAYS. Increases warfarin effect 30-50%. Monitor TFTs, LFTs, PFTs, ophthalmology." },
  ]},
  { category: "Pain/Opioids", color: "#c47ee0", icon: "🎯", items: [
    { drug: "Opioid toxicity triad", mnemonic: "RIP: Respiratory depression, mIOsis (pinpoint pupils), drowsiness (sedation)", detail: "RR <12 = emergency. Antidote: Naloxone (Narcan). WARNING: Narcan half-life 30-90 min is SHORTER than most opioids - re-narcotization happens! Repeat doses PRN." },
    { drug: "Acetaminophen max dose", mnemonic: "4g/day healthy, 2g/day elderly/liver — check ALL sources!", detail: "Hidden in Percocet, Vicodin, NyQuil, DayQuil. Overdose = #1 cause of acute liver failure. Antidote: N-acetylcysteine (NAC/Mucomyst). Most effective within 8-10 hours." },
    { drug: "Naloxone (Narcan)", mnemonic: "Narcan is SHORT — shorter than most opioids. Watch for re-narcotization!", detail: "Half-life only 30-90 min. Morphine lasts 4-6 hours. ALWAYS monitor after giving Narcan. May need repeated doses or infusion. Precipitates acute withdrawal in opioid-dependent patients." },
  ]},
  { category: "Antibiotics", color: "#7ec87e", icon: "🦠", items: [
    { drug: "Vancomycin Red Man Syndrome", mnemonic: "RED = Rate-related, not allergic. Diphenhydramine treats it", detail: "Slow infusion to 60+ min. Give diphenhydramine. NOT a true allergy - can rechallenge at slower rate. Also: nephrotoxic + ototoxic. Monitor trough/AUC." },
    { drug: "Fluoroquinolone warnings", mnemonic: "FLOCK: Flex-tendon rupture, Lengthened QT, Oh no C.diff, Children contraindicated, Kids cartilage", detail: "BBW: tendon rupture (especially Achilles, elderly, corticosteroid users). QT prolongation. Contraindicated <18 years. Separate from Ca, Mg, Fe, antacids by 2+ hours." },
    { drug: "Metronidazole (Flagyl)", mnemonic: "FLAGYL + ALCOHOL = FLAGRANT disulfiram reaction", detail: "Avoid alcohol DURING treatment AND 48-72 hours AFTER. Metallic taste is common. Urine may turn dark brown (warn patient - not hematuria). Treats C.diff, anaerobes, Trichomonas." },
  ]},
  { category: "Endocrine", color: "#e07e5c", icon: "⚗️", items: [
    { drug: "Insulin types memory", mnemonic: "RANI: Regular (IV ok, clear), Aspart/Lispro (rapid, clear), NPH (cloudy, intermediate), Insulin glargine (clear, 24hr peakless)", detail: "ONLY Regular insulin can be given IV. NEVER mix glargine with any other insulin. Clear does NOT always mean Regular (glargine is also clear). Cloudy = NPH always." },
    { drug: "Hypoglycemia 15-15 rule", mnemonic: "15g carbs, wait 15 min, recheck. Repeat if still <70", detail: "15g fast carbs = 4oz juice, regular soda, glucose tablets. If unconscious: D50 IV or glucagon IM. Follow with complex carb + protein snack to prevent rebound." },
    { drug: "Metformin + Contrast dye", mnemonic: "CONTRAST = CONTRAINDICATED with Metformin temporarily", detail: "Hold BEFORE contrast, restart 48 hours AFTER if kidneys stable. Risk: contrast nephropathy + metformin accumulation = lactic acidosis (50% mortality). Applies even with normal creatinine." },
  ]},
  { category: "Psych Meds", color: "#e0c05c", icon: "🧠", items: [
    { drug: "EPS side effects", mnemonic: "ADAPT: Akathisia, Dystonia (acute), Akinesia, Pseudo-parkinsonism, Tardive dyskinesia (irreversible)", detail: "Acute dystonia (within hours/days) = benztropine or diphenhydramine. Tardive dyskinesia = IRREVERSIBLE with long-term use. All caused by D2 receptor blockade." },
    { drug: "NMS vs Serotonin Syndrome", mnemonic: "NMS = SLOW + RIGID. SS = FAST + HYPERACTIVE (clonus, hyperreflexia)", detail: "NMS: slow onset, lead-pipe rigidity, hyperthermia, elevated CK, altered LOC. Treat: stop antipsychotic, dantrolene. SS: fast onset, clonus, agitation, diaphoresis. Treat: cyproheptadine." },
    { drug: "Lithium toxicity signs", mnemonic: "TREMOR first (early), then CONFUSION (late) = HOLD and call provider", detail: "Therapeutic: 0.6-1.2 mEq/L. Dehydration + NSAIDs = TOXICITY risk. NO antidote. Severe toxicity requires hemodialysis. Consistent Na+ and fluid intake is critical." },
    { drug: "Benzodiazepines", mnemonic: "NEVER cold turkey — SEIZURE risk! Taper slowly.", detail: "Physical dependence develops even at therapeutic doses. Abrupt withdrawal = life-threatening seizures. Antidote = Flumazenil (but use cautiously — can precipitate withdrawal seizures in dependent patients)." },
  ]},
  { category: "Musculoskeletal", color: "#d4a06a", icon: "🦴", items: [
    { drug: "Alendronate (Fosamax)", mnemonic: "UPRIGHT after = UP RIGHT away from bed (no lying down for 30 min!)", detail: "Empty stomach + plain WATER only. UPRIGHT 30+ min. No food/meds 30 min after. Weekly 70mg. Watch for jaw osteonecrosis and atypical femur fractures (long-term)." },
    { drug: "Methotrexate dosing", mnemonic: "MTX = Must Take Weekly. Daily = DEADLY (bone marrow suppression)", detail: "Weekly dosing for RA - one of most dangerous dosing errors in medicine. Supplement folic acid. Category X. Antidote: leucovorin. Avoid alcohol (additive hepatotoxicity) and NSAIDs." },
    { drug: "Baclofen withdrawal", mnemonic: "BACLOFEN STOP = BAD: seizures, hyperthermia, rhabdomyolysis, death", detail: "Especially dangerous with intrathecal pump failure (pump alarm = EMERGENCY). Withdrawal: severe spasticity, hyperthermia, altered LOC, seizures. Must TAPER slowly." },
  ]},
];

function Mnemonics() {
  const [activeCat, setActiveCat] = useState(0);
  const [expandedItem, setExpandedItem] = useState(null);
  const cat = MNEMONICS_DATA[activeCat];
  return (
    <div className="mnemonics">
      <div className="mnemonics-header">
        <h2 className="section-title">🧠 Mnemonics Library</h2>
        <p className="section-sub">Memory tricks that stick — built for NCLEX success</p>
      </div>
      <div className="mnemonic-cat-tabs">
        {MNEMONICS_DATA.map((c, i) => (
          <button key={i} className={"mnemonic-cat-btn" + (activeCat === i ? " active" : "")}
            style={{"--mcolor": c.color}} onClick={() => { setActiveCat(i); setExpandedItem(null); }}>
            <span>{c.icon}</span><span>{c.category}</span>
          </button>
        ))}
      </div>
      <div className="mnemonic-list">
        {cat.items.map((item, i) => (
          <div key={i} className={"mnemonic-card" + (expandedItem === i ? " expanded" : "")}
            style={{"--mcolor": cat.color}} onClick={() => setExpandedItem(expandedItem === i ? null : i)}>
            <div className="mnemonic-top">
              <div>
                <div className="mnemonic-drug">{item.drug}</div>
                <div className="mnemonic-phrase">💡 {item.mnemonic}</div>
              </div>
              <div className="mnemonic-expand">{expandedItem === i ? "−" : "+"}</div>
            </div>
            {expandedItem === i && <div className="mnemonic-detail">{item.detail}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LAB VALUES ────────────────────────────────────────────────────────────────

const LAB_DATA = [
  { category: "Hematology", icon: "🩸", color: "#e05c5c", labs: [
    { name: "Hemoglobin (Hgb)", normal: "M: 13.5–17.5 g/dL | F: 12–15.5 g/dL", low: "Anemia — fatigue, pallor, tachycardia. Transfuse if <7 g/dL or symptomatic", high: "Polycythemia — increased clot risk", drugs: "Iron supplements, EPO (epoetin alfa) raise Hgb. Chemotherapy lowers it." },
    { name: "Platelets (PLT)", normal: "150,000–400,000/mm³", low: "<50,000 = bleeding risk. <20,000 = spontaneous bleed. HIT: drops >50% on days 5-10 of heparin", high: ">400,000 = thrombocytosis — clot risk", drugs: "Heparin (HIT), aspirin, chemotherapy, methotrexate all affect platelets" },
    { name: "WBC", normal: "4,500–11,000/mm³", low: "<1,000 neutrophils (ANC) = neutropenia — infection risk. Hold chemotherapy if ANC <500", high: ">11,000 = infection, inflammation, leukemia, corticosteroids", drugs: "Corticosteroids elevate WBC. Chemotherapy, methotrexate decrease WBC" },
    { name: "INR", normal: "Therapeutic: 2–3 (most) | 2.5–3.5 (mechanical valves)", low: "<2 = subtherapeutic → clot risk → increase warfarin", high: ">3 = supratherapeutic → bleed risk. >5 = hold warfarin, give Vitamin K", drugs: "Warfarin (intentionally elevated). Vitamin K foods lower INR. Clarithromycin, amiodarone increase INR." },
    { name: "aPTT", normal: "Therapeutic: 60–100 sec (1.5–2.5x normal ~25–35 sec)", low: "<60 = subtherapeutic heparin → increase rate", high: ">100 = supratherapeutic. >120 = hold and notify provider", drugs: "Unfractionated heparin (UFH) only. LMWH (enoxaparin) monitored by Anti-Xa, not aPTT." },
  ]},
  { category: "Electrolytes", icon: "⚡", color: "#e0c05c", labs: [
    { name: "Sodium (Na⁺)", normal: "136–145 mEq/L", low: "<136 = hyponatremia. Sx: headache, confusion, seizures. Correct SLOWLY (<0.5 mEq/L/hr) — too fast = osmotic demyelination syndrome", high: ">145 = hypernatremia. Sx: thirst, confusion, dry membranes, seizures", drugs: "Loop diuretics cause hyponatremia. Lithium → polyuria → hypernatremia risk." },
    { name: "Potassium (K⁺)", normal: "3.5–5.0 mEq/L", low: "<3.5 = hypokalemia. Sx: muscle weakness, flat T-waves, U-waves, dysrhythmias. INCREASES DIGOXIN TOXICITY", high: ">5.0 = hyperkalemia. Sx: peaked T-waves, bradycardia, cardiac arrest. ACE inhibitors, ARBs, spironolactone can cause", drugs: "Loop diuretics WASTE K+. K+-sparing diuretics, ACE inhibitors, ARBs RETAIN K+." },
    { name: "Calcium (Ca²⁺)", normal: "8.5–10.5 mg/dL", low: "<8.5 = hypocalcemia. Sx: tetany, Chvostek sign, Trousseau sign, prolonged QT, seizures", high: ">10.5 = hypercalcemia. 'Bones, Groans, Stones, Moans' — bone pain, GI symptoms, kidney stones, confusion", drugs: "Loop diuretics lower Ca²+. Thiazides raise Ca²+. Bisphosphonates can cause hypocalcemia." },
    { name: "Magnesium (Mg²⁺)", normal: "1.5–2.5 mEq/L", low: "<1.5 = hypomagnesemia. Sx: tremors, seizures, dysrhythmias, refractory hypokalemia. Long-term PPIs can cause.", high: ">2.5 = hypermagnesemia. Sx: loss of DTRs, respiratory depression, cardiac arrest. Antidote: calcium gluconate", drugs: "Loop diuretics waste Mg²+. Long-term PPIs cause hypomagnesemia. Antacids can cause hypermagnesemia." },
  ]},
  { category: "Kidney", icon: "🫘", color: "#5c8de0", labs: [
    { name: "BUN", normal: "7–20 mg/dL", low: "Liver failure, malnutrition, overhydration", high: ">20 = azotemia. Dehydration, renal failure, GI bleed. BUN:Cr ratio >20:1 = pre-renal cause", drugs: "NSAIDs, ACE inhibitors, aminoglycosides can elevate BUN." },
    { name: "Creatinine (Cr)", normal: "M: 0.7–1.3 mg/dL | F: 0.5–1.1 mg/dL", low: "Decreased muscle mass (elderly, malnourished — may mask renal impairment)", high: "Indicates renal dysfunction. Doubling = ~50% loss of renal function", drugs: "NSAIDs, aminoglycosides, vancomycin, contrast dye — nephrotoxic. Hold metformin if rising." },
    { name: "eGFR", normal: ">60 mL/min/1.73m²", low: "<60 = CKD. <30 = severe — hold/dose-adjust many drugs. <15 = kidney failure", high: "Normal/high in early diabetic nephropathy", drugs: "Hold metformin if <30. Dose-adjust: vancomycin, digoxin, enoxaparin, lithium, gabapentin." },
    { name: "Urine Output", normal: "≥30 mL/hr (≥0.5 mL/kg/hr)", low: "<30 mL/hr = oliguria — notify provider immediately", high: ">2,500 mL/24hr = polyuria — DI, hyperglycemia, lithium toxicity", drugs: "Loop diuretics should produce rapid diuresis. Lithium causes nephrogenic diabetes insipidus." },
  ]},
  { category: "Cardiac", icon: "❤️", color: "#e05ca0", labs: [
    { name: "Troponin I/T", normal: "<0.04 ng/mL (varies by lab)", low: "N/A", high: "MOST SPECIFIC marker for MI. Rises 3-6 hrs, peaks 24 hrs, elevated 7-14 days after MI. Also elevated: PE, myocarditis, sepsis", drugs: "No drugs directly affect troponin — elevation = cardiac damage." },
    { name: "BNP / NT-proBNP", normal: "BNP <100 pg/mL | NT-proBNP <300 pg/mL", low: "Rules OUT heart failure", high: "Heart failure — higher = worse. BNP >500 = definitive HF. Guides diuretic therapy.", drugs: "Sacubitril (Entresto) inhibits BNP breakdown — elevates BNP levels. Do not use BNP to monitor response in patients on Entresto." },
    { name: "Digoxin level", normal: "Therapeutic: 0.5–2.0 ng/mL | HF target: 0.5–0.9", low: "<0.5 = subtherapeutic", high: ">2.0 = toxicity risk. Toxicity at lower levels if hypokalemia present! Antidote: Digibind", drugs: "Quinidine, amiodarone, verapamil all INCREASE digoxin levels — dose reduction needed." },
  ]},
  { category: "Liver", icon: "🫀", color: "#7ec87e", labs: [
    { name: "ALT / AST", normal: "ALT: 7–56 U/L | AST: 10–40 U/L", low: "N/A", high: "Hepatocellular damage. >3x ULN = consider holding hepatotoxic drugs. ALT more liver-specific. AST also elevated in MI.", drugs: "Methotrexate, amiodarone, statins, acetaminophen OD, isoniazid, valproate — hepatotoxic." },
    { name: "Albumin", normal: "3.5–5.0 g/dL", low: "<3.5 = malnutrition, liver disease, nephrotic syndrome. Low albumin → more FREE drug → toxicity risk for highly protein-bound drugs", high: "Dehydration (hemoconcentration)", drugs: "Warfarin, phenytoin, diazepam are highly protein-bound — low albumin increases free drug levels → toxicity." },
    { name: "Bilirubin (Total)", normal: "0.1–1.2 mg/dL", low: "N/A", high: ">2.5 = clinical jaundice. Direct (conjugated) = obstruction. Indirect = hemolysis or liver failure", drugs: "Rifampin turns fluids orange (not jaundice). Many drugs cause drug-induced liver injury (DILI)." },
  ]},
  { category: "Glucose", icon: "🍬", color: "#e07e5c", labs: [
    { name: "Fasting Blood Glucose", normal: "70–99 mg/dL fasting | <140 mg/dL 2hr post-meal", low: "<70 = hypoglycemia. 15-15 rule. <50 = severe → D50 IV. Beta-blockers MASK tachycardia (diaphoresis still occurs).", high: ">126 fasting = diabetes. >180 in hospital = treat with insulin", drugs: "Insulin causes hypoglycemia. Corticosteroids cause hyperglycemia. Beta-blockers mask hypoglycemia symptoms." },
    { name: "HbA1c", normal: "<5.7% normal | 5.7–6.4% prediabetes | ≥6.5% diabetes", low: "Lower = better glucose control. Goal <7% for most diabetics", high: ">9% = poor control. >12% = very poor control → DKA risk", drugs: "Metformin, insulin, all diabetes drugs aim to lower HbA1c. Reflects 3-month average glucose." },
    { name: "Potassium in DKA", normal: "3.5–5.0 mEq/L — CRITICAL in DKA management", low: "Insulin in DKA drives K+ INTO cells → rapid drop. Replace K+ if <3.5 BEFORE starting insulin", high: "Initial DKA K+ often HIGH (acidosis shifts K+ out of cells) despite total body deficit", drugs: "ALWAYS give K+ replacement with insulin in DKA. Monitor K+ every 1-2 hours during treatment." },
  ]},
];

function LabValues() {
  const [activeCat, setActiveCat] = useState(0);
  const [expandedLab, setExpandedLab] = useState(null);
  const [search, setSearch] = useState("");
  const cat = LAB_DATA[activeCat];
  const searchActive = search.trim().length > 0;
  const searchResults = searchActive
    ? LAB_DATA.flatMap(c => c.labs.map(l => ({ ...l, color: c.color }))).filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) || l.drugs.toLowerCase().includes(search.toLowerCase()))
    : cat.labs;
  return (
    <div className="lab-values">
      <div className="mnemonics-header">
        <h2 className="section-title">🔬 Lab Values Reference</h2>
        <p className="section-sub">Normal ranges, critical values and drug effects</p>
      </div>
      <div className="search-wrap" style={{marginBottom:"1rem"}}>
        <span className="search-icon">🔍</span>
        <input className="search-input" placeholder="Search labs or drugs..." value={search}
          onChange={e => { setSearch(e.target.value); setExpandedLab(null); }} />
        {search && <button className="search-clear" onClick={() => setSearch("")}>✕</button>}
      </div>
      {!searchActive && (
        <div className="mnemonic-cat-tabs">
          {LAB_DATA.map((c, i) => (
            <button key={i} className={"mnemonic-cat-btn" + (activeCat === i ? " active" : "")}
              style={{"--mcolor": c.color}} onClick={() => { setActiveCat(i); setExpandedLab(null); }}>
              <span>{c.icon}</span><span>{c.category}</span>
            </button>
          ))}
        </div>
      )}
      <div className="lab-list">
        {searchResults.map((lab, i) => (
          <div key={i} className={"lab-card" + (expandedLab === i ? " expanded" : "")}
            style={{"--lcolor": lab.color || cat.color}} onClick={() => setExpandedLab(expandedLab === i ? null : i)}>
            <div className="lab-top">
              <div>
                <div className="lab-name">{lab.name}</div>
                <div className="lab-normal">{lab.normal}</div>
              </div>
              <div className="mnemonic-expand">{expandedLab === i ? "−" : "+"}</div>
            </div>
            {expandedLab === i && (
              <div className="lab-detail">
                <div className="lab-row"><span className="lab-tag low">📉 Low</span><p>{lab.low}</p></div>
                <div className="lab-row"><span className="lab-tag high">📈 High</span><p>{lab.high}</p></div>
                <div className="lab-row"><span className="lab-tag drugs">💊 Drug Effects</span><p>{lab.drugs}</p></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PROGRESS TRACKER ──────────────────────────────────────────────────────────

function Progress() {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("studentrx_progress") || "[]"); }
    catch { return []; }
  });
  const [showClear, setShowClear] = useState(false);
  const clearHistory = () => { localStorage.removeItem("studentrx_progress"); setHistory([]); setShowClear(false); };
  const avgScore = history.length > 0 ? Math.round(history.reduce((s, x) => s + x.pct, 0) / history.length) : 0;
  const bestScore = history.length > 0 ? Math.max(...history.map(x => x.pct)) : 0;
  const totalQ = history.reduce((s, x) => s + (x.total || 0), 0);

  const classPerf = {};
  history.forEach(session => {
    if (session.classBreakdown) {
      Object.entries(session.classBreakdown).forEach(([cls, data]) => {
        if (!classPerf[cls]) classPerf[cls] = { correct: 0, total: 0 };
        classPerf[cls].correct += data.correct;
        classPerf[cls].total += data.total;
      });
    }
  });
  const weakSpots = Object.entries(classPerf)
    .map(([cls, d]) => ({ cls, pct: Math.round((d.correct / d.total) * 100), total: d.total }))
    .filter(x => x.total >= 2).sort((a, b) => a.pct - b.pct).slice(0, 5);

  if (history.length === 0) {
    return (
      <div className="progress-empty">
        <div className="empty-icon">📊</div>
        <h2>No quiz history yet</h2>
        <p>Complete a quiz to start tracking your progress. Your scores and weak spots will appear here automatically.</p>
        <p style={{fontSize:"0.75rem", color:"var(--text-dimmer)", marginTop:"0.5rem"}}>Progress is saved locally on this device.</p>
      </div>
    );
  }

  return (
    <div className="progress-tab">
      <div className="mnemonics-header">
        <h2 className="section-title">📊 Your Progress</h2>
        <p className="section-sub">{history.length} quiz session{history.length !== 1 ? "s" : ""} completed</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-num" style={{color:"var(--gold)"}}>{avgScore}%</div><div className="stat-label">Average Score</div></div>
        <div className="stat-card"><div className="stat-num" style={{color:"var(--green)"}}>{bestScore}%</div><div className="stat-label">Best Score</div></div>
        <div className="stat-card"><div className="stat-num" style={{color:"var(--blue)"}}>{history.length}</div><div className="stat-label">Quizzes Taken</div></div>
        <div className="stat-card"><div className="stat-num" style={{color:"#c47ee0"}}>{totalQ}</div><div className="stat-label">Questions Answered</div></div>
      </div>
      {weakSpots.length > 0 && (
        <div className="weak-spots">
          <div className="ws-title">🎯 Your Weak Spots — Focus here</div>
          {weakSpots.map((ws, i) => (
            <div key={i} className="ws-item">
              <div className="ws-name">{ws.cls}</div>
              <div className="ws-bar-wrap">
                <div className="ws-bar"><div className="ws-fill" style={{width:`${ws.pct}%`, background: ws.pct >= 70 ? "var(--green)" : ws.pct >= 50 ? "var(--gold)" : "var(--red)"}}/></div>
                <span className="ws-pct" style={{color: ws.pct >= 70 ? "var(--green)" : ws.pct >= 50 ? "var(--gold)" : "var(--red)"}}>{ws.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="history-section">
        <div className="ws-title">📅 Recent Sessions</div>
        {[...history].reverse().slice(0, 10).map((s, i) => (
          <div key={i} className="history-item">
            <div className="history-left">
              <div className="history-date">{new Date(s.date).toLocaleDateString("en-US", {month:"short", day:"numeric", hour:"2-digit", minute:"2-digit"})}</div>
              <div className="history-mode">{s.filter !== "All" ? s.filter : "All Classes"} · {s.timed ? "⏱ Timed" : "📖 Study"}</div>
            </div>
            <div className="history-score" style={{color: s.pct >= 80 ? "var(--green)" : s.pct >= 60 ? "var(--gold)" : "var(--red)"}}>
              {s.pct}%<span className="history-fraction">{s.correct}/{s.total}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="clear-btn" onClick={() => setShowClear(true)}>Clear History</button>
      {showClear && (
        <div className="confirm-clear">
          <p>Are you sure? This cannot be undone.</p>
          <div style={{display:"flex", gap:"0.5rem", marginTop:"0.5rem"}}>
            <button className="restart-btn outline" onClick={() => setShowClear(false)}>Cancel</button>
            <button className="restart-btn" style={{borderColor:"var(--red)", color:"var(--red)"}} onClick={clearHistory}>Yes, Clear</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "study", label: "Study Guide", icon: "📖" },
  { id: "cards", label: "Flashcards", icon: "🃏" },
  { id: "quiz", label: "Quiz", icon: "✏️" },
  { id: "mnemonics", label: "Mnemonics", icon: "🧠" },
  { id: "labs", label: "Lab Values", icon: "🔬" },
  { id: "progress", label: "Progress", icon: "📊" },
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

        /* QUESTION TYPE BADGE */
        .question-type-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          padding: 0.25rem 0.65rem;
          border-radius: 100px;
          border: 1px solid;
          margin-bottom: 0.75rem;
        }

        .vignette-box {
          background: var(--navy-light);
          border: 1px solid var(--gold)33;
          border-left: 3px solid var(--gold);
          border-radius: 0 10px 10px 0;
          padding: 1rem;
          margin-bottom: 1rem;
          font-size: 0.84rem;
          line-height: 1.6;
          color: var(--text);
        }

        .vignette-label {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.4rem;
        }

        .nclex-category {
          font-size: 0.65rem;
          color: var(--text-dimmer);
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .sata-instruction {
          font-size: 0.78rem;
          color: var(--gold);
          background: var(--gold)0d;
          border: 1px solid var(--gold)33;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          margin-bottom: 0.75rem;
        }

        .option.sata-selected {
          border-color: var(--gold)88;
          background: var(--gold)0d;
        }

        .sata-check {
          margin-left: auto;
          color: var(--gold);
          font-weight: 700;
        }

        /* QUIZ SETUP */
        .quiz-setup {
          padding: 0.5rem 0;
        }

        .setup-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.4rem;
          color: var(--cream);
          margin-bottom: 1.5rem;
        }

        .setup-section {
          margin-bottom: 1.5rem;
        }

        .setup-label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-dimmer);
          margin-bottom: 0.6rem;
        }

        .setup-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .setup-pill {
          padding: 0.35rem 0.75rem;
          background: var(--navy-light);
          border: 1px solid var(--navy-border);
          border-radius: 100px;
          color: var(--text-dim);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .setup-pill.active {
          background: var(--gold)22;
          border-color: var(--gold);
          color: var(--gold);
        }

        .setup-modes {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .mode-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.9rem 1rem;
          background: var(--navy-mid);
          border: 1px solid var(--navy-border);
          border-radius: 10px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }

        .mode-btn.active {
          border-color: var(--gold);
          background: var(--gold)0d;
        }

        .mode-icon { font-size: 1.25rem; }

        .mode-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--cream);
          display: block;
        }

        .mode-desc {
          font-size: 0.75rem;
          color: var(--text-dim);
          display: block;
        }

        .setup-count {
          font-size: 0.8rem;
          color: var(--text-dim);
          margin-bottom: 1.25rem;
          padding: 0.6rem 0.85rem;
          background: var(--navy-mid);
          border-radius: 8px;
          border: 1px solid var(--navy-border);
        }

        .start-btn {
          width: 100%;
          padding: 0.95rem;
          background: var(--gold);
          border: none;
          border-radius: 12px;
          color: var(--navy);
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .start-btn:hover { opacity: 0.9; }

        /* TIMER */
        .timer-badge {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          border: 1px solid;
          transition: color 0.3s, border-color 0.3s;
        }

        .timer-bar {
          height: 3px;
          background: var(--navy-light);
          border-radius: 100px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .timer-fill {
          height: 100%;
          border-radius: 100px;
          transition: width 1s linear, background 0.3s;
        }

        /* RESULT ACTIONS */
        .result-actions {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 1.5rem;
        }

        .missed-btn {
          width: 100%;
          padding: 0.85rem;
          background: var(--gold);
          border: none;
          border-radius: 10px;
          color: var(--navy);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
        }

        .restart-btn {
          width: 100%;
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

        .restart-btn.outline {
          border-color: var(--navy-border);
          color: var(--text-dim);
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

        /* MNEMONICS & LAB VALUES */
        .mnemonics, .lab-values, .progress-tab { padding: 0.25rem 0; }

        .mnemonics-header { margin-bottom: 1.25rem; }
        .section-title { font-family: 'DM Serif Display', serif; font-size: 1.3rem; color: var(--cream); margin-bottom: 0.2rem; }
        .section-sub { font-size: 0.78rem; color: var(--text-dim); }

        .mnemonic-cat-tabs {
          display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem;
        }
        .mnemonic-cat-btn {
          display: flex; align-items: center; gap: 0.3rem;
          padding: 0.35rem 0.7rem;
          background: var(--navy-light); border: 1px solid var(--navy-border);
          border-radius: 100px; color: var(--text-dim);
          font-family: 'DM Sans', sans-serif; font-size: 0.72rem; cursor: pointer; transition: all 0.2s;
        }
        .mnemonic-cat-btn.active { background: var(--mcolor)22; border-color: var(--mcolor); color: var(--mcolor); }

        .mnemonic-list, .lab-list { display: flex; flex-direction: column; gap: 0.6rem; }

        .mnemonic-card, .lab-card {
          background: var(--navy-mid); border: 1px solid var(--navy-border);
          border-radius: 12px; overflow: hidden; cursor: pointer; transition: border-color 0.2s;
        }
        .mnemonic-card.expanded, .lab-card.expanded { border-color: var(--mcolor, var(--lcolor, var(--gold))); }
        .lab-card.expanded { border-color: var(--lcolor); }

        .mnemonic-top, .lab-top {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 0.9rem 1rem;
        }
        .mnemonic-drug, .lab-name {
          font-size: 0.9rem; font-weight: 600; color: var(--cream); margin-bottom: 0.25rem;
        }
        .mnemonic-phrase { font-size: 0.78rem; color: var(--gold); font-style: italic; }
        .lab-normal { font-size: 0.72rem; color: var(--text-dim); font-family: 'DM Mono', monospace; }
        .mnemonic-expand { color: var(--text-dimmer); font-size: 1.25rem; font-weight: 300; }

        .mnemonic-detail, .lab-detail {
          padding: 0 1rem 1rem; border-top: 1px solid var(--navy-border); padding-top: 0.75rem;
          font-size: 0.82rem; line-height: 1.6; color: var(--text);
        }

        .lab-row { display: flex; gap: 0.6rem; align-items: flex-start; margin-bottom: 0.5rem; }
        .lab-row p { font-size: 0.8rem; color: var(--text); line-height: 1.5; }
        .lab-tag {
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.08em;
          padding: 0.2rem 0.5rem; border-radius: 6px; white-space: nowrap; margin-top: 0.1rem;
        }
        .lab-tag.low { background: #5c8de022; color: #5c8de0; }
        .lab-tag.high { background: #e05c5c22; color: #e05c5c; }
        .lab-tag.drugs { background: var(--gold)22; color: var(--gold); }

        /* PROGRESS */
        .progress-empty {
          text-align: center; padding: 3rem 1rem;
        }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .progress-empty h2 { font-family: 'DM Serif Display', serif; font-size: 1.3rem; color: var(--cream); margin-bottom: 0.5rem; }
        .progress-empty p { font-size: 0.85rem; color: var(--text-dim); line-height: 1.6; }

        .stats-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem;
        }
        .stat-card {
          background: var(--navy-mid); border: 1px solid var(--navy-border);
          border-radius: 12px; padding: 1rem; text-align: center;
        }
        .stat-num { font-family: 'DM Serif Display', serif; font-size: 2rem; line-height: 1; margin-bottom: 0.25rem; }
        .stat-label { font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.06em; }

        .weak-spots {
          background: var(--navy-mid); border: 1px solid var(--navy-border);
          border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem;
        }
        .ws-title { font-size: 0.85rem; font-weight: 600; color: var(--cream); margin-bottom: 0.25rem; }
        .ws-sub { font-size: 0.72rem; color: var(--text-dim); margin-bottom: 0.75rem; }
        .ws-item { margin-bottom: 0.6rem; }
        .ws-name { font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.2rem; }
        .ws-bar-wrap { display: flex; align-items: center; gap: 0.5rem; }
        .ws-bar { flex: 1; height: 6px; background: var(--navy-light); border-radius: 100px; overflow: hidden; }
        .ws-fill { height: 100%; border-radius: 100px; transition: width 0.5s ease; }
        .ws-pct { font-size: 0.72rem; font-weight: 600; font-family: 'DM Mono', monospace; min-width: 35px; text-align: right; }

        .history-section { margin-bottom: 1rem; }
        .history-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.65rem 0; border-bottom: 1px solid var(--navy-border);
        }
        .history-date { font-size: 0.78rem; color: var(--text); margin-bottom: 0.1rem; }
        .history-mode { font-size: 0.65rem; color: var(--text-dimmer); }
        .history-score { font-family: 'DM Serif Display', serif; font-size: 1.2rem; text-align: right; }
        .history-fraction { display: block; font-family: 'DM Sans', sans-serif; font-size: 0.65rem; color: var(--text-dimmer); }

        .clear-btn {
          background: none; border: 1px solid var(--navy-border); border-radius: 8px;
          color: var(--text-dimmer); font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
          padding: 0.5rem 1rem; cursor: pointer; margin-bottom: 0.75rem;
        }
        .confirm-clear {
          background: var(--navy-mid); border: 1px solid var(--red)44; border-radius: 10px;
          padding: 0.85rem; font-size: 0.82rem; color: var(--text-dim);
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
          {tab === "mnemonics" && <Mnemonics />}
          {tab === "labs" && <LabValues />}
          {tab === "progress" && <Progress />}
          {tab === "tutor" && <AITutor />}
        </main>
      </div>
    </>
  );
}
