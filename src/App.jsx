import { useState, useRef, useEffect } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────

const DRUG_CLASSES = [
  {
    id: "anticoagulants",
    name: "Anticoagulants",
    icon: "🩸",
    color: "#e05c5c",
    suffix: "-xaban (Factor Xa inhibitors) | -gatran (direct thrombin inhibitors)",
    suffixNote: "Heparin, Warfarin, Enoxaparin have no suffix pattern. Factor Xa inhibitors end in -XABAN: rivaROXABAN, apiXABAN, edoXABAN. Direct thrombin inhibitors end in -GATRAN: dabiGATRAN. Memory: -xaban = Xa inhibitor. -gatran = direct thrombin (gate) inhibitor.",
    keyDrugs: ["Heparin (UFH)", "Enoxaparin/Lovenox (LMWH)", "Warfarin/Coumadin", "Rivaroxaban/Xarelto (-xaban)", "Apixaban/Eliquis (-xaban)", "Dabigatran/Pradaxa (-gatran)"],
    classOverview: "Anticoagulants PREVENT new clots from forming — they do NOT dissolve existing clots (thrombolytics do that). Every anticoagulant has a REVERSAL AGENT — know them all cold for NCLEX. Key monitoring: INR for warfarin, aPTT for heparin.",
    classMnemonic: "REVERSAL AGENTS: Heparin → Protamine. Warfarin → Vitamin K (slow) or FFP (fast). -xabans → Andexanet alfa. Dabigatran → Idarucizumab (Praxbind). Enoxaparin → Protamine (partial only).",
    drugs: [
      {
        name: "Heparin (Unfractionated UFH)",
        mechanism: "Activates antithrombin III → inhibits thrombin (IIa) and factor Xa → prevents clot formation and extension",
        indications: "DVT/PE treatment & prevention, ACS, cardiac surgery, bridge therapy",
        antidote: "🔴 Protamine Sulfate — 1mg neutralizes ~100 units heparin",
        monitoring: "aPTT (therapeutic: 60–100 sec). Platelet count every 2–3 days (HIT watch). Anti-Xa levels in special populations.",
        nursingPearls: "🔑 NEVER give IM. SubQ for prophylaxis, IV drip for treatment. HIT = paradoxical THROMBOSIS despite low platelets (days 5–10). Platelet drop >50% = STOP heparin immediately and switch to non-heparin anticoagulant.",
        sideEffects: "Bleeding, HIT (thrombocytopenia + new clots — days 5–10), osteoporosis (long-term use)",
      },
      {
        name: "Warfarin (Coumadin)",
        mechanism: "Inhibits Vitamin K epoxide reductase → blocks synthesis of clotting factors II, VII, IX, X and proteins C and S",
        indications: "A-fib stroke prevention, mechanical heart valves, long-term DVT/PE prevention",
        antidote: "🔴 Vitamin K (slow reversal 24–48 hrs) | FFP or 4-factor PCC (rapid reversal for active bleeding)",
        monitoring: "INR (therapeutic: 2–3 for most; 2.5–3.5 for mechanical valves). Takes 3–5 days to reach therapeutic level after dose change.",
        nursingPearls: "🔑 Hundreds of drug-food interactions. Consistent (not eliminated) Vitamin K diet — teach consistency! Contraindicated in pregnancy (Category X). Many antibiotics, NSAIDs, and amiodarone significantly raise INR.",
        sideEffects: "Bleeding (most common), skin necrosis (rare — protein C deficiency), purple toe syndrome, teratogenicity",
      },
      {
        name: "Enoxaparin (Lovenox) — LMWH",
        mechanism: "Low Molecular Weight Heparin — primarily inhibits Factor Xa > thrombin via antithrombin III. More predictable pharmacokinetics than UFH.",
        indications: "DVT/PE prophylaxis & treatment, ACS, bridge therapy from warfarin",
        antidote: "🔴 Protamine sulfate (partial ~60% reversal only)",
        monitoring: "Anti-Xa levels (if needed: obese, renal impairment, pregnancy). Renal function — contraindicated if CrCl <30.",
        nursingPearls: "🔑 SubQ ONLY — never IV. Do NOT expel air bubble before injection (pre-filled syringes). Rotate injection sites. Lower HIT risk than UFH. No routine aPTT monitoring needed.",
        sideEffects: "Bleeding, injection site hematoma, thrombocytopenia (lower HIT risk than UFH)",
      },
      {
        name: "Rivaroxaban (Xarelto)",
        mechanism: "Direct Factor Xa inhibitor — blocks factor Xa without needing antithrombin",
        indications: "A-fib stroke prevention, DVT/PE treatment & prevention, post-op VTE prophylaxis",
        antidote: "🔴 Andexanet alfa (AndeXXa) — X for Xa inhibitor",
        monitoring: "No routine monitoring needed. Renal function (adjust dose if impaired). Signs of bleeding.",
        nursingPearls: "🔑 Take with EVENING MEAL (increases absorption by 39%). No routine INR monitoring = higher adherence risk — teach patient never to miss doses. Avoid in severe renal impairment.",
        sideEffects: "Bleeding, GI upset",
      },
    ],
  },
  {
    id: "antiplatelets",
    name: "Antiplatelets",
    icon: "💊",
    color: "#5c8de0",
    suffix: "-iban (GP IIb/IIIa inhibitors) | No suffix for P2Y12 inhibitors",
    suffixNote: "GP IIb/IIIa inhibitors end in -IBAN: eptifibatIBAN, tirofibanIBAN. P2Y12 inhibitors: clopidogrel, ticagrelor, prasugrel — no consistent suffix. Aspirin (ASA) is unique. Memory: -iban = inhibits platelet binding. DAPT = Dual Antiplatelet Therapy (ASA + P2Y12 inhibitor) after stent.",
    keyDrugs: ["Aspirin/ASA (COX-1 inhibitor)", "Clopidogrel/Plavix (P2Y12)", "Ticagrelor/Brilinta (P2Y12)", "Prasugrel/Effient (P2Y12)", "Abciximab/ReoPro (GP IIb/IIIa)"],
    classOverview: "Antiplatelets prevent platelets from clumping together. They work UPSTREAM from anticoagulants — targeting the platelet plug phase. Essential after coronary stents (DAPT = ASA + P2Y12 inhibitor). Irreversible inhibitors (aspirin, clopidogrel) — effect lasts platelet lifespan (7–10 days).",
    classMnemonic: "DAPT after stent = ASA + P2Y12 (clopidogrel OR ticagrelor). Clopidogrel is a prodrug needing CYP2C19. Ticagrelor works without activation. Aspirin: irreversible COX-1 block = platelet effect lasts 7–10 days.",
    drugs: [
      {
        name: "Aspirin (ASA) 81mg",
        mechanism: "Irreversibly inhibits COX-1 → blocks thromboxane A2 synthesis → reduces platelet aggregation for platelet's lifespan (7–10 days)",
        indications: "ACS, MI/stroke prevention, post-stent (DAPT with P2Y12 inhibitor), pain/fever at higher doses",
        antidote: "🔴 No specific antidote — platelet transfusion for serious bleeding",
        monitoring: "Signs of bleeding, GI symptoms. INR not affected by aspirin.",
        nursingPearls: "🔑 Effect lasts 7–10 days (irreversible platelet inhibition). Low-dose 81mg for cardioprotection. NEVER give to children with viral illness (Reye's syndrome). Take with food. With ticagrelor: cap aspirin at ≤100mg (higher doses REDUCE ticagrelor effectiveness).",
        sideEffects: "GI bleeding/ulceration, tinnitus (toxicity at high doses), Reye's syndrome in children",
      },
      {
        name: "Clopidogrel (Plavix)",
        mechanism: "PRODRUG — hepatically activated by CYP2C19 → irreversible P2Y12 ADP receptor antagonist → inhibits platelet aggregation for platelet's lifespan",
        indications: "ACS, post-PCI (DAPT with ASA), stroke/TIA prevention in patients intolerant of ASA",
        antidote: "🔴 No specific antidote — platelet transfusion",
        monitoring: "Bleeding signs. CYP2C19 genotype testing may be ordered (poor metabolizers = reduced effect).",
        nursingPearls: "🔑 PRODRUG requiring CYP2C19 hepatic activation. Omeprazole and esomeprazole inhibit CYP2C19 → REDUCES effectiveness → use pantoprazole instead. Hold 5–7 days before surgery. Irreversible — effect lasts platelet lifespan.",
        sideEffects: "Bleeding, TTP (thrombotic thrombocytopenic purpura — rare but life-threatening), rash",
      },
      {
        name: "Ticagrelor (Brilinta)",
        mechanism: "Reversible P2Y12 ADP receptor antagonist — does NOT require hepatic activation (active drug, not prodrug)",
        indications: "ACS (NSTEMI/STEMI), post-PCI with stent, prevention of recurrent MI/stroke",
        antidote: "🔴 No specific antidote — platelet transfusion (less effective due to reversible binding)",
        monitoring: "Bleeding signs, dyspnea (common unique side effect ~15%), HR (bradycardia), renal function",
        nursingPearls: "🔑 TWICE DAILY dosing — adherence is critical. Dyspnea in ~15% (NOT bronchospasm — reassure patient, usually resolves). Aspirin >100mg REDUCES ticagrelor effectiveness — always cap ASA at 81mg. Works in CYP2C19 poor metabolizers unlike clopidogrel. Hold 5 days before surgery.",
        sideEffects: "Bleeding, dyspnea (unique — not bronchospasm), bradycardia, ventricular pauses, hyperuricemia",
      },
    ],
  },
  {
    id: "thrombolytics",
    name: "Thrombolytics (Clot Busters)",
    icon: "⚡",
    color: "#e0a85c",
    suffix: "-plase (plasminogen activators)",
    suffixNote: "ALL thrombolytics end in -PLASE: altePLASE (tPA), tenectePLASE, retePLASE. They DISSOLVE existing clots (unlike anticoagulants which prevent new ones). Memory: -PLASE = PLASminogen activator = dissolves clots. TIME IS BRAIN (stroke) = TIME IS MUSCLE (MI).",
    keyDrugs: ["Alteplase/tPA (-plase)", "Tenecteplase/TNKase (-plase)", "Reteplase (-plase)", "Aminocaproic Acid/Amicar (ANTIDOTE)"],
    classOverview: "Thrombolytics convert plasminogen to plasmin → dissolve fibrin clots. Used emergently for ischemic stroke (within 3–4.5 hrs), massive PE, and STEMI. HIGH BLEEDING RISK — contraindications must be checked before administration. Always have reversal agent (Amicar) available.",
    classMnemonic: "TIME IS BRAIN (ischemic stroke — door to needle <60 min). TIME IS MUSCLE (STEMI). Contraindications: Hemorrhagic stroke ever, active bleeding, recent surgery/trauma. No antiplatelets/anticoagulants for 24 hrs post-tPA (stroke).",
    drugs: [
      {
        name: "Alteplase (tPA — tissue Plasminogen Activator)",
        mechanism: "Recombinant tPA → binds fibrin in clot → converts plasminogen to plasmin → dissolves fibrin clot from inside out",
        indications: "Ischemic stroke (within 3–4.5 hrs of symptom onset), massive PE, STEMI, occluded catheters (lower dose)",
        antidote: "🔴 Aminocaproic acid (Amicar) — antifibrinolytic. Fresh frozen plasma for major bleeding.",
        monitoring: "Neurological status q15 min (stroke), BP <185/110 mmHg during and 24 hrs after infusion, bleeding signs, all IV sites",
        nursingPearls: "🔑 TIME IS BRAIN — goal door-to-needle <60 min for stroke. NO antiplatelets or anticoagulants for 24 hrs post-stroke tPA. Absolute contraindications: hemorrhagic stroke (ever), active internal bleeding, recent intracranial surgery/trauma. Monitor q15 min during infusion. Sudden severe headache after tPA = STOP and get emergent CT (intracranial hemorrhage).",
        sideEffects: "Intracranial hemorrhage (most feared), major bleeding at IV sites, angioedema, reperfusion arrhythmias",
      },
      {
        name: "Tenecteplase (TNKase)",
        mechanism: "Modified tPA — greater fibrin specificity, longer half-life → single IV weight-based bolus (vs. alteplase infusion over 60 min)",
        indications: "STEMI (preferred in many EMS and hospital systems — bolus dosing easier to administer)",
        antidote: "🔴 Aminocaproic acid (Amicar), FFP for active bleeding",
        monitoring: "Bleeding signs, BP, cardiac rhythm, ST segment resolution (sign of reperfusion)",
        nursingPearls: "🔑 SINGLE IV BOLUS dosed by weight (30–50mg) — major advantage over alteplase infusion in time-sensitive STEMI. Reperfusion arrhythmias (PVCs, AIVR) after administration = EXPECTED and REASSURING (blood flow restored to heart). Same contraindications as alteplase.",
        sideEffects: "Bleeding (intracranial hemorrhage most serious), reperfusion arrhythmias (expected), hypotension",
      },
    ],
  },
  {
    id: "cardiac",
    name: "Cardiac Drugs",
    icon: "❤️",
    color: "#e05ca0",
    suffix: "ACE inhibitors: -pril | ARBs: -sartan | Beta blockers: -olol | DHP CCBs: -dipine",
    suffixNote: "ACE inhibitors end in -PRIL (lisinoPRIL, enalaPRIL). ARBs end in -SARTAN (loSARTAN, valSARTAN). Beta blockers end in -OLOL (metoprOLOL, atenOLOL). DHP Calcium Channel Blockers end in -DIPINE (amloDIPINE, nifeDIPINE). Non-DHP CCBs: verapamil, diltiazem (no suffix pattern). Nitrates: nitroglycerin. Antiarrhythmics: amiodarone, adenosine, digoxin.",
    keyDrugs: ["Lisinopril (-pril — ACE)", "Losartan (-sartan — ARB)", "Metoprolol (-olol — BB)", "Carvedilol (-olol — BB)", "Amlodipine (-dipine — DHP CCB)", "Diltiazem (non-DHP CCB)", "Verapamil (non-DHP CCB)", "Digoxin (cardiac glycoside)", "Amiodarone (antiarrhythmic)", "Nitroglycerin (nitrate)", "Adenosine (antiarrhythmic)"],
    classOverview: "Cardiac drugs span multiple subclasses — each targets a different mechanism. KEY distinctions: ACE inhibitors (-pril) cause cough → switch to ARB (-sartan). Beta blockers (-olol) NEVER stop abruptly. DHP CCBs (-dipine) = BP only. Non-DHP CCBs (verapamil/diltiazem) = rate AND BP — NEVER combine with beta blockers. Digoxin = narrow therapeutic index.",
    classMnemonic: "ACE = Always Cough Eventually → switch to ARB (no cough). -OLOL = slOLOl (hold if HR <60). -DIPINE = Decreases arterial Pressure. Verapamil/Diltiazem + beta blocker = DANGER (fatal bradycardia). Digoxin: hold if HR <60, watch K⁺.",
    drugs: [
      {
        name: "Lisinopril (Zestril) — ACE Inhibitor [-pril]",
        mechanism: "Inhibits ACE → prevents angiotensin I → II conversion → vasodilation, reduced aldosterone → lower BP and cardiac afterload/preload",
        indications: "HTN (first-line), HFrEF (reduces mortality), post-MI, diabetic nephropathy (renoprotective)",
        antidote: "🔴 No specific antidote. Icatibant for severe angioedema. Discontinue immediately.",
        monitoring: "BP (first-dose hypotension risk), K⁺ (hyperkalemia), creatinine (mild rise is acceptable ~10–30%), dry cough",
        nursingPearls: "🔑 DRY COUGH in 10–15% (bradykinin accumulation — NOT allergy) → switch to ARB (-sartan) if intolerable. CONTRAINDICATED in pregnancy (fetal renal failure/death). ANGIOEDEMA — rare, life-threatening airway emergency, can occur YEARS after starting. First-dose hypotension — monitor after first dose.",
        sideEffects: "Dry cough (most common — 10–15%), hyperkalemia, first-dose hypotension, angioedema (rare/life-threatening), renal impairment, teratogenicity (Category D/X)",
      },
      {
        name: "Losartan (Cozaar) — ARB [-sartan]",
        mechanism: "Selectively blocks AT1 angiotensin II receptors directly → vasodilation, reduced aldosterone → same benefits as ACE inhibitors WITHOUT inhibiting ACE → no bradykinin accumulation → NO COUGH",
        indications: "HTN, HFrEF (alternative to ACE inhibitor), diabetic nephropathy, stroke prevention in HTN with LVH",
        antidote: "🔴 No specific antidote",
        monitoring: "BP, K⁺ (same hyperkalemia risk as ACE inhibitors), creatinine, uric acid (losartan uniquely lowers uric acid — beneficial in gout)",
        nursingPearls: "🔑 Preferred when ACE inhibitor causes intolerable cough — SAME cardiac/renal benefits, NO cough. SAME contraindications: avoid in pregnancy (Category D/X). Do NOT combine with ACE inhibitors (dual RAAS blockade increases renal failure/hyperkalemia risk). Losartan uniquely uricosuric.",
        sideEffects: "Hyperkalemia, hypotension, renal impairment, teratogenicity — notably NO dry cough (key difference from ACE inhibitors)",
      },
      {
        name: "Metoprolol (Lopressor/Toprol XL) — Beta Blocker [-olol]",
        mechanism: "Selective β1-adrenergic blocker → decreases HR, myocardial contractility, and BP; reduces cardiac oxygen demand and renin release",
        indications: "HTN, angina, HFrEF (reduces mortality), post-MI, A-fib rate control, migraine prophylaxis",
        antidote: "🔴 Glucagon (for beta-blocker overdose — bypasses the blocked beta receptor)",
        monitoring: "HR (HOLD if <60 bpm), BP (hold if systolic <90 mmHg), blood glucose (masks hypoglycemia tachycardia), respiratory status",
        nursingPearls: "🔑 NEVER abruptly discontinue — taper over 1–2 weeks (rebound MI/HTN risk). Masks tachycardia of hypoglycemia (sweating still occurs — teach diabetics). β1-selective but selectivity lost at high doses — caution in asthma. Lopressor (IR) = twice daily; Toprol XL (ER) = once daily — NOT interchangeable mg-for-mg.",
        sideEffects: "Bradycardia, hypotension, fatigue, depression, sexual dysfunction, bronchospasm (at high doses), masks hypoglycemia symptoms",
      },
      {
        name: "Carvedilol (Coreg) — Non-selective Beta Blocker + Alpha Blocker [-olol]",
        mechanism: "Non-selective β1+β2 blocker PLUS α1 blocker → reduces HR, contractility, AND peripheral vascular resistance (dual mechanism)",
        indications: "HFrEF (first-line — reduces mortality), post-MI LV dysfunction, HTN",
        antidote: "🔴 Glucagon (for overdose)",
        monitoring: "HR (hold if <60), BP (orthostatic hypotension risk due to α-blockade), weight (fluid retention in HF)",
        nursingPearls: "🔑 Take WITH FOOD (slows absorption, reduces peak hypotension from α-blockade). High orthostatic hypotension risk — advise slow position changes. One of THREE beta blockers proven to reduce HF mortality (with metoprolol succinate and bisoprolol). Greater vasodilation than pure β-blockers.",
        sideEffects: "Orthostatic hypotension (more than other beta blockers), bradycardia, fatigue, weight gain, hyperglycemia",
      },
      {
        name: "Amlodipine (Norvasc) — DHP Calcium Channel Blocker [-dipine]",
        mechanism: "Dihydropyridine (DHP) CCB — blocks L-type Ca²⁺ channels in vascular smooth muscle → vasodilation → reduced peripheral resistance → lower BP (minimal cardiac rate effect)",
        indications: "HTN (first-line), chronic stable angina, vasospastic (Prinzmetal) angina",
        antidote: "🔴 Calcium gluconate/chloride (high-dose for severe overdose), glucagon, vasopressors",
        monitoring: "BP, peripheral edema (most common side effect), HR (minimal effect from amlodipine)",
        nursingPearls: "🔑 DHP = primarily VASCULAR — minimal HR effect (unlike verapamil/diltiazem). Peripheral edema is most common complaint (arteriolar vasodilation without venous dilation). Long half-life (30–50 hrs) → once daily, gradual BP changes. Safe in asthma/COPD. GRAPEFRUIT inhibits CYP3A4 → increased levels.",
        sideEffects: "Peripheral edema (most common), flushing, headache, reflex tachycardia, gingival hyperplasia (long-term)",
      },
      {
        name: "Diltiazem (Cardizem) — Non-DHP Calcium Channel Blocker",
        mechanism: "Non-DHP CCB — blocks Ca²⁺ channels in BOTH vascular smooth muscle AND cardiac conduction system → vasodilation + decreased HR (negative chronotropy) + slowed AV conduction",
        indications: "A-fib/flutter rate control, SVT, stable/vasospastic angina, HTN",
        antidote: "🔴 Calcium gluconate, glucagon, atropine (for bradycardia), transcutaneous pacing",
        monitoring: "HR (HOLD if <60), BP, ECG (PR interval prolongation/AV block), LFTs",
        nursingPearls: "🔑 NON-DHP = affects BOTH rate AND vessels. NEVER combine with beta blockers (additive AV block → fatal bradycardia/cardiac arrest). CONTRAINDICATED in HFrEF with systolic dysfunction (negative inotropy worsens HF). Available IV for acute A-fib rate control. Many CYP3A4 drug interactions.",
        sideEffects: "Bradycardia, AV block (DANGER with beta blockers), hypotension, constipation, peripheral edema, elevated LFTs",
      },
      {
        name: "Verapamil (Calan) — Non-DHP Calcium Channel Blocker",
        mechanism: "Non-DHP CCB — MOST potent cardiac Ca²⁺ channel blocker → strongest negative chronotropy and inotropy + vasodilation",
        indications: "A-fib/flutter rate control, PSVT (IV — if adenosine fails), HTN, angina, cluster headache prophylaxis, hypertrophic cardiomyopathy",
        antidote: "🔴 Calcium gluconate (IV), glucagon, atropine, transcutaneous pacing",
        monitoring: "HR (hold if <60), BP, PR interval (AV block risk), LFTs, constipation (nearly universal)",
        nursingPearls: "🔑 MOST CARDIO-SELECTIVE non-DHP. CONTRAINDICATED: HFrEF (depresses failing myocardium), WPW + A-fib (accelerates accessory pathway → V-fib). NEVER IV verapamil + IV beta blocker (fatal). CONSTIPATION is nearly universal — prophylactic bowel regimen. Grapefruit increases levels.",
        sideEffects: "Bradycardia, AV block, hypotension, constipation (most common of all CCBs), HF exacerbation, flushing",
      },
      {
        name: "Digoxin (Lanoxin) — Cardiac Glycoside",
        mechanism: "Inhibits Na⁺/K⁺-ATPase → increases intracellular Ca²⁺ → positive inotropy (stronger contractions); enhances vagal tone → negative chronotropy and slowed AV conduction",
        indications: "HFrEF (improves symptoms — does NOT reduce mortality), A-fib rate control",
        antidote: "🔴 Digoxin Immune Fab (Digibind/DigiFab) — binds and inactivates digoxin",
        monitoring: "Digoxin level (therapeutic: 0.5–2.0 ng/mL; HF target: 0.5–0.9), serum K⁺ (hypokalemia → toxicity!), renal function, apical HR before each dose",
        nursingPearls: "🔑 NARROW THERAPEUTIC INDEX. Apical pulse × 1 FULL MINUTE — hold if <60 bpm. HYPOKALEMIA is #1 trigger of toxicity (loop diuretics + digoxin = dangerous combo). Toxicity signs: nausea/vomiting (first sign), yellow-green halos/visual changes, bradycardia, life-threatening dysrhythmias. Quinidine, amiodarone, verapamil increase digoxin levels.",
        sideEffects: "Toxicity: bradycardia, GI symptoms (nausea/vomiting — often FIRST sign), visual disturbances (yellow-green halos), life-threatening dysrhythmias",
      },
      {
        name: "Amiodarone (Cordarone) — Class III Antiarrhythmic",
        mechanism: "Class III antiarrhythmic (K⁺ channel blocker → prolongs repolarization/QT) + Class I (Na⁺), Class II (β-block), and Class IV (Ca²⁺) properties — most multi-class antiarrhythmic",
        indications: "Life-threatening ventricular arrhythmias (V-fib, V-tach), A-fib rate/rhythm control, ACLS cardiac arrest protocol",
        antidote: "🔴 No specific antidote. Supportive care. Half-life 40–55 days — toxicity persists long after stopping.",
        monitoring: "TFTs (thyroid q6 months), LFTs, PFTs/CXR (pulmonary q6–12 months), QTc interval, ophthalmology (corneal deposits), skin",
        nursingPearls: "🔑 TOXICITY AFFECTS EVERY ORGAN: Pulmonary toxicity (most serious — pneumonitis/fibrosis), thyroid (hypo OR hyper — 37% iodine), hepatotoxicity, corneal microdeposits (benign but universal), blue-gray skin (irreversible). Half-life 40–55 DAYS. Increases warfarin effect — reduce warfarin dose 30–50%. Use sunscreen. Report new dyspnea immediately.",
        sideEffects: "Pulmonary toxicity (most serious), hypo/hyperthyroidism, hepatotoxicity, QT prolongation, corneal deposits, blue-gray skin, photosensitivity, bradycardia",
      },
      {
        name: "Nitroglycerin (NTG) — Nitrate",
        mechanism: "Organic nitrate → converts to nitric oxide (NO) → activates guanylate cyclase → smooth muscle relaxation → venodilation (↓ preload) + coronary artery dilation",
        indications: "Acute angina (SL), ACS, HTN emergency (IV), acute decompensated HF with pulmonary edema (IV)",
        antidote: "🔴 No specific antidote. Phenylephrine for refractory hypotension. AVOID PDE-5 inhibitors (Viagra/Cialis) — profound hypotension.",
        monitoring: "BP (hold if systolic <90 mmHg), HR, headache (expected), pain relief, IV: continuous BP monitoring",
        nursingPearls: "🔑 SL: up to 3 tablets q5 min — if no relief after 3 doses, call 911 (probable MI). Headache is EXPECTED (vasodilation) — not a reason to stop. Nitrate tolerance with continuous use → require 8–12 hr nitrate-FREE interval daily (remove patch at bedtime). Store in DARK GLASS bottle. ABSOLUTE CONTRAINDICATION with PDE-5 inhibitors (sildenafil/Viagra, tadalafil/Cialis) — fatal hypotension. IV: use non-PVC tubing.",
        sideEffects: "Headache (most common — vasodilation), hypotension, reflex tachycardia, dizziness, flushing, tolerance (continuous use)",
      },
      {
        name: "Adenosine (Adenocard) — Antiarrhythmic",
        mechanism: "Endogenous nucleoside → activates A1 receptors → hyperpolarizes AV node → transiently blocks AV conduction → terminates reentrant SVT circuits",
        indications: "PSVT/SVT conversion (first-line IV agent), diagnostic tool to reveal underlying atrial flutter/fibrillation",
        antidote: "🔴 Theophylline/caffeine (adenosine antagonists). Effects are self-limiting (half-life <10 seconds).",
        monitoring: "Continuous cardiac monitoring, BP, respiratory status, IV patency (large antecubital vein preferred)",
        nursingPearls: "🔑 HALF-LIFE <10 SECONDS — give as RAPID IV PUSH followed by immediate saline flush. Warn patient: will feel chest tightness, flushing, and sense of impending doom for seconds (NORMAL — it passes quickly). Transient asystole is the EXPECTED MECHANISM — not cardiac arrest. Caffeine and theophylline block its effects.",
        sideEffects: "Transient asystole (expected/therapeutic), chest tightness, flushing, dyspnea, sense of impending doom (all very brief <60 seconds)",
      },
    ],
  },
  {
    id: "diuretics",
    name: "Diuretics",
    icon: "💧",
    color: "#5cc4e0",
    suffix: "Loops: -ide | Thiazides: -thiazide | K⁺-sparing: -one or -ene",
    suffixNote: "Loop diuretics: furosemIDE, bumetanIDE, torsemIDE. Thiazides: hydrochlorothiaZIDE, chlorthalIDONE. K⁺-sparing: spironolactONE, eplerenONE, triamterENE. Memory: Loops = LOSE K⁺. Thiazides = LOSE K⁺ (but KEEP Ca²⁺). K⁺-sparing = KEEP K⁺ (hyperkalemia risk!).",
    keyDrugs: ["Furosemide/Lasix (loop)", "Bumetanide/Bumex (loop)", "HCTZ (thiazide)", "Spironolactone/Aldactone (K⁺-sparing)", "Eplerenone/Inspra (K⁺-sparing)"],
    classOverview: "Diuretics block Na⁺ reabsorption at different nephron sites → increase urine output. KEY: Loop and thiazide diuretics WASTE potassium (hypokalemia risk). K⁺-sparing diuretics RETAIN potassium (hyperkalemia risk). Combining a loop with a K⁺-sparing diuretic is a common strategy to balance potassium.",
    classMnemonic: "CADET: Ca²⁺ (thiazides keep it), Aldosterone antagonists (spironolactone), Distal tubule (thiazide site), Efficacy (loops most potent), Toxicity — K⁺ wasting (loops/thiazides) vs K⁺ retention (spironolactone).",
    drugs: [
      {
        name: "Furosemide (Lasix) — Loop Diuretic",
        mechanism: "Inhibits Na⁺/K⁺/2Cl⁻ cotransporter in thick ascending limb of loop of Henle → massive sodium, chloride, and water excretion",
        indications: "Edema (HF, hepatic cirrhosis, renal disease), HTN, hypercalcemia, acute pulmonary edema (IV = rapid)",
        antidote: "🔴 No specific antidote — IV fluids and electrolyte replacement",
        monitoring: "K⁺ (hypokalemia!), Na⁺, Mg²⁺, BUN/creatinine, urine output, daily weight, hearing (ototoxicity with high-dose IV)",
        nursingPearls: "🔑 Lasix = LAsts SIX hours. Give in morning (or before 6pm) to prevent nocturia. K⁺-WASTING — supplement K⁺ or combine with spironolactone. Sulfa allergy cross-reactivity (rare). High-dose IV → OTOTOXICITY (irreversible tinnitus/hearing loss). Diuresis onset within 30–60 min of IV.",
        sideEffects: "Hypokalemia (most important!), hyponatremia, dehydration, ototoxicity (high-dose IV), hyperuricemia, hyperglycemia",
      },
      {
        name: "Spironolactone (Aldactone) — K⁺-sparing Diuretic",
        mechanism: "Aldosterone receptor antagonist — blocks aldosterone in collecting duct → Na⁺ wasting + K⁺ RETENTION (potassium-SPARING). Also blocks androgen receptors (anti-androgenic).",
        indications: "HFrEF (reduces mortality — RALES trial), hyperaldosteronism, ascites, HTN, hypokalemia prevention",
        antidote: "🔴 No specific antidote. Calcium gluconate IV for severe hyperkalemia. Sodium polystyrene sulfonate (Kayexalate) to lower K⁺.",
        monitoring: "K⁺ (HYPERKALEMIA risk!), renal function, BP, gynecomastia (men), menstrual irregularities (women)",
        nursingPearls: "🔑 K⁺-SPARING = AVOID K⁺ supplements and K⁺-rich foods unless directed. AVOID concurrent ACE inhibitors or ARBs without VERY close K⁺ monitoring (triple RAAS blockade risk). Gynecomastia in men (anti-androgenic) — eplerenone is more selective. Takes weeks for full HF benefit.",
        sideEffects: "Hyperkalemia (most important!), gynecomastia/breast tenderness, menstrual irregularities, GI upset",
      },
    ],
  },
  {
    id: "statins",
    name: "Statins (HMG-CoA Reductase Inhibitors)",
    icon: "💛",
    color: "#c9a84c",
    suffix: "-statin",
    suffixNote: "ALL statins end in -STATIN: atorvaSTATIN, rosuvaSTATIN, simvaSTATIN, pravaSTATIN, lovaSTATIN, fluvaSTATIN, pitavaSTATIN. Memory: -STATIN = Stops cholesterol synthesis. Potency order: Rosuvastatin > Atorvastatin > Simvastatin > Pravastatin. Most potent = rosuvastatin (up to 65% LDL reduction).",
    keyDrugs: ["Atorvastatin/Lipitor (-statin)", "Rosuvastatin/Crestor (-statin)", "Simvastatin/Zocor (-statin)", "Pravastatin/Pravachol (-statin)", "Lovastatin/Mevacor (-statin)"],
    classOverview: "Statins inhibit HMG-CoA reductase (rate-limiting enzyme of cholesterol synthesis) → liver upregulates LDL receptors → more LDL cleared from blood. First-line for cardiovascular risk reduction. Also given post-MI regardless of LDL level (pleiotropic anti-inflammatory effects).",
    classMnemonic: "Statins STAT the cholesterol factory. GRAPEFRUIT = enemy of statins (CYP3A4 inhibition → myopathy). MYOPATHY warning: muscle pain + weakness + elevated CK → STOP. Category X in pregnancy (cholesterol needed for fetal development). Take at BEDTIME (cholesterol synthesis peaks at night) — exception: atorvastatin and rosuvastatin can be taken any time.",
    drugs: [
      {
        name: "Atorvastatin (Lipitor)",
        mechanism: "Inhibits HMG-CoA reductase → reduces hepatic cholesterol synthesis → upregulates LDL receptors → increased LDL clearance from circulation",
        indications: "Primary and secondary prevention of cardiovascular events, hyperlipidemia, post-MI/ACS (regardless of baseline LDL — pleiotropic benefits)",
        antidote: "🔴 No specific antidote. Discontinue if severe myopathy/rhabdomyolysis or significant hepatotoxicity.",
        monitoring: "Baseline LFTs, CK levels (if muscle symptoms develop), lipid panel (4–12 weeks after starting or changing dose)",
        nursingPearls: "🔑 GRAPEFRUIT JUICE inhibits CYP3A4 → dramatically increases statin levels → MYOPATHY/RHABDOMYOLYSIS risk. Rhabdomyolysis = massive muscle breakdown → myoglobin → acute kidney failure (can be fatal). Report muscle pain + weakness + dark urine immediately. Category X in PREGNANCY. Can be taken any time of day (unlike older statins).",
        sideEffects: "Myopathy (muscle pain/weakness — dose-dependent), rhabdomyolysis (severe/rare — dark urine, renal failure), elevated LFTs, headache. Teratogenic (Category X).",
      },
      {
        name: "Rosuvastatin (Crestor)",
        mechanism: "Most potent HMG-CoA reductase inhibitor — up to 65% LDL reduction. Less hepatic CYP450 metabolism than atorvastatin.",
        indications: "Hyperlipidemia, atherosclerosis prevention, high-risk cardiovascular patients, patients needing maximum LDL lowering",
        antidote: "🔴 No specific antidote",
        monitoring: "LFTs, CK if muscle symptoms, lipid panel, urine protein (rare proteinuria with rosuvastatin at high doses)",
        nursingPearls: "🔑 Most potent statin — maximum LDL reduction. Less CYP3A4 metabolism → fewer grapefruit/drug interactions than atorvastatin/simvastatin. Still watch for myopathy. Asian patients may need lower doses (higher plasma levels in this population). NOT a CYP3A4 substrate (unlike atorvastatin and simvastatin).",
        sideEffects: "Myopathy, rhabdomyolysis (rare), proteinuria (rare at high doses), elevated LFTs, headache",
      },
    ],
  },
  {
    id: "antibiotics",
    name: "Antibiotics",
    icon: "🦠",
    color: "#7ec87e",
    suffix: "Penicillins: -cillin | Fluoroquinolones: -floxacin | Macrolides: -thromycin | Cephalosporins: cef-/ceph- | Carbapenems: -penem",
    suffixNote: "Penicillins: amoxiCILLIN, ampICILLIN, nafCILLIN. Fluoroquinolones: cipro FLOXACIN, levo FLOXACIN. Macrolides: azithROMYCIN, clarithROMYCIN, erythROMYCIN. Cephalosporins: CEFazolin, CEFtriaxone, CEFepime. Carbapenems: meroPENEM, imipENEM, ertaPENEM. Glycopeptides: vancomycin (no suffix). Nitroimidazoles: metRONIDAZOLE.",
    keyDrugs: ["Vancomycin (glycopeptide — MRSA)", "Ciprofloxacin (-floxacin)", "Metronidazole/Flagyl (nitroimidazole)", "Amoxicillin (-cillin)", "Azithromycin (-thromycin)", "Ceftriaxone (cef-)"],
    classOverview: "Antibiotics kill (bactericidal) or inhibit (bacteriostatic) bacteria. KEY NCLEX rules: culture BEFORE antibiotics, complete the full course, watch for C. diff with broad-spectrum antibiotics, and know the major toxicities. Allergy cross-reactivity: penicillins ↔ cephalosporins (~10%), carbapenems (~1%).",
    classMnemonic: "C-LAAT: Culture before starting, Look at sensitivities, Administer on time (consistent levels!), Assess for allergies (cross-reactivity), Track adverse effects (C. diff, nephrotoxicity, ototoxicity, tendon rupture).",
    drugs: [
      {
        name: "Vancomycin — Glycopeptide",
        mechanism: "Inhibits cell wall synthesis by binding D-Ala-D-Ala terminus of peptidoglycan precursors — effective ONLY against gram-POSITIVE organisms (including MRSA)",
        indications: "MRSA infections (IV), C. difficile (oral — does NOT absorb systemically), serious gram-positive infections when beta-lactams contraindicated",
        antidote: "🔴 No specific antidote. Supportive care, hemodialysis for severe toxicity.",
        monitoring: "AUC/MIC ratio OR trough levels (traditional 10–20 mcg/mL), BUN/creatinine (nephrotoxicity), CBC, hearing (ototoxicity)",
        nursingPearls: "🔑 NARROW THERAPEUTIC INDEX. Infuse over AT LEAST 60 min — rapid infusion → RED MAN SYNDROME (flushing, erythema, hypotension — rate-related, NOT allergy — slow infusion and give diphenhydramine). Nephrotoxic especially with aminoglycosides. Ototoxic at high levels. Oral vancomycin for C. diff DOES NOT enter bloodstream.",
        sideEffects: "Nephrotoxicity, ototoxicity, Red Man Syndrome (rate-related infusion reaction — not allergy), thrombophlebitis at IV site",
      },
      {
        name: "Ciprofloxacin (Cipro) — Fluoroquinolone [-floxacin]",
        mechanism: "Inhibits bacterial DNA gyrase and topoisomerase IV → prevents DNA replication and repair → bactericidal against broad spectrum including gram-negative organisms",
        indications: "UTIs (especially complicated), respiratory infections, GI infections, anthrax prophylaxis, bone/joint infections",
        antidote: "🔴 No specific antidote",
        monitoring: "Tendon pain/swelling (especially Achilles), renal function, QTc interval, blood glucose, peripheral neurological symptoms",
        nursingPearls: "🔑 BLACK BOX WARNINGS: tendinitis/tendon rupture (Achilles most common — especially elderly, corticosteroid users, renal transplant), peripheral neuropathy (may be PERMANENT), CNS effects. Separate from antacids, Ca²⁺, Mg²⁺, Fe, dairy by 2+ hours (chelation reduces absorption by up to 90%). CONTRAINDICATED <18 years. QT prolongation.",
        sideEffects: "Tendon rupture (BBW — especially Achilles), peripheral neuropathy (BBW — possibly permanent), QT prolongation, photosensitivity, GI upset, dysglycemia",
      },
      {
        name: "Metronidazole (Flagyl) — Nitroimidazole",
        mechanism: "Reduced inside anaerobic organisms → forms cytotoxic free radicals → disrupts DNA → bactericidal against anaerobes and protozoa",
        indications: "C. difficile (mild-moderate), anaerobic infections, H. pylori (triple therapy), Trichomoniasis, bacterial vaginosis, amoebiasis",
        antidote: "🔴 No specific antidote",
        monitoring: "LFTs, peripheral neurological symptoms (neuropathy with prolonged use), CBC with prolonged use",
        nursingPearls: "🔑 DISULFIRAM-LIKE REACTION with alcohol — avoid during treatment AND 48–72 hours AFTER last dose (severe nausea, vomiting, flushing, tachycardia). Metallic taste — very common, warn patients. Urine may turn dark/reddish-brown (harmless — NOT hematuria, warn patient). Crosses blood-brain barrier.",
        sideEffects: "Metallic taste (very common), nausea, peripheral neuropathy (prolonged use), disulfiram-like reaction with alcohol, dark urine (harmless)",
      },
    ],
  },
  {
    id: "analgesics",
    name: "Pain Management & Opioids",
    icon: "🎯",
    color: "#c47ee0",
    suffix: "NSAIDs: -fen (ibuprofen, naproxen) | COX-2 inhibitors: -coxib | Opioids: no consistent suffix",
    suffixNote: "NSAIDs: ibuproFEN, naproxEN, ketoproFEN. COX-2 inhibitors: celeCOXIB, rofeCOXIB. Opioids: morphine, oxycodone, hydromorphone, fentanyl, codeine — no suffix pattern. Antidote for opioids: naloxone (Narcan). Acetaminophen (Tylenol) — unique, NOT an NSAID.",
    keyDrugs: ["Morphine (opioid — mu agonist)", "Oxycodone (opioid)", "Fentanyl (opioid)", "Tramadol (weak opioid)", "Naloxone/Narcan (ANTIDOTE)", "Ketorolac/Toradol (NSAID — parenteral)", "Acetaminophen/Tylenol (non-opioid, non-NSAID)"],
    classOverview: "Opioids bind mu (μ) opioid receptors → powerful analgesia + respiratory depression. The TRIAD of opioid overdose: respiratory depression + miosis (pinpoint pupils) + decreased LOC. Antidote: Naloxone (Narcan) — must be immediately accessible. Acetaminophen: max 4g/day, HIDDEN in combination products.",
    classMnemonic: "Opioid overdose = RIP: Respiratory depression, mIOsis (pinpoint), unreSPonsive. Antidote = Narcan (reverse the RIP). Narcan half-life is SHORT — re-narcotization happens! Acetaminophen: 4 grams MAX — check ALL medications for hidden acetaminophen.",
    drugs: [
      {
        name: "Morphine Sulfate — Opioid Agonist",
        mechanism: "Binds mu (μ), kappa (κ), delta (δ) opioid receptors in CNS → inhibits pain transmission, causes sedation, euphoria, respiratory depression, constipation",
        indications: "Moderate-to-severe acute/chronic pain, acute MI pain (reduces pain + anxiety + preload), acute pulmonary edema, dyspnea in palliative care",
        antidote: "🔴 Naloxone (Narcan) 0.4–2mg IV/IM/SQ/intranasal. Repeat every 2–3 min PRN. REPEAT doses likely needed — monitor for re-narcotization!",
        monitoring: "Respiratory rate (HOLD if <12/min), sedation level (PASERO scale), pain score, bowel function, urine output, SpO2",
        nursingPearls: "🔑 ALWAYS have naloxone accessible before administering. Assess RR BEFORE every dose. Constipation in virtually ALL patients — start PROPHYLACTIC bowel regimen (stool softener + stimulant laxative) with first opioid dose. Urinary retention common. Pruritus = histamine release (NOT allergy — treat with low-dose naloxone or antihistamine).",
        sideEffects: "Respiratory depression (CRITICAL), constipation (nearly universal), urinary retention, nausea/vomiting, sedation, pruritus (histamine — not allergy), hypotension",
      },
      {
        name: "Naloxone (Narcan) — Opioid Antagonist",
        mechanism: "Competitive opioid receptor antagonist — rapidly displaces opioids from mu/kappa/delta receptors → reverses respiratory depression, sedation, and analgesia within 1–2 minutes",
        indications: "Opioid overdose reversal, opioid-induced respiratory depression, neonatal opioid depression",
        antidote: "🔴 N/A — this IS the antidote for opioid toxicity",
        monitoring: "Respiratory rate (goal >12), LOC after giving, vital signs, re-narcotization watch (give multiple doses PRN), pain level (reverses analgesia too)",
        nursingPearls: "🔑 Half-life 30–90 min — SHORTER than most opioids (morphine 4–6 hr, fentanyl 2–4 hr, methadone up to 36+ hrs). Patient CAN re-narcotize after naloxone wears off — MONITOR closely, repeat doses PRN, consider infusion for long-acting opioids. Precipitates ACUTE WITHDRAWAL in opioid-dependent patients (agitation, tachycardia, HTN, diaphoresis, seizures).",
        sideEffects: "Acute opioid withdrawal (in dependent patients), reversal of analgesia (pain returns), pulmonary edema (rare), tachycardia, HTN",
      },
      {
        name: "Acetaminophen (Tylenol) — Non-Opioid Analgesic",
        mechanism: "Centrally inhibits prostaglandin synthesis in CNS; modulates endocannabinoid system — NO significant peripheral anti-inflammatory effect (NOT an NSAID)",
        indications: "Mild-to-moderate pain, fever, adjunct for moderate-severe pain (multimodal analgesia — reduces opioid requirements)",
        antidote: "🔴 N-acetylcysteine (NAC/Mucomyst) — most effective within 8–10 hours of ingestion. Replenishes glutathione → prevents hepatotoxic metabolite buildup.",
        monitoring: "Total daily dose from ALL sources (combination products!), LFTs (hepatotoxicity in overdose or chronic liver disease), signs of liver failure",
        nursingPearls: "🔑 MAX DOSE: 4g/day healthy adults; 2g/day elderly/liver disease/chronic alcohol. HIDDEN in Percocet (oxycodone/APAP), Vicodin (hydrocodone/APAP), NyQuil, DayQuil — COUNT ALL SOURCES. Overdose = #1 cause of acute liver failure in the US. NAC most effective within 8–10 hours — don't delay. Well-tolerated at therapeutic doses — NO GI irritation, no platelet effects.",
        sideEffects: "Hepatotoxicity (overdose — can be fatal), rash (rare). Well-tolerated at therapeutic doses with no significant GI or platelet effects.",
      },
      {
        name: "Ketorolac (Toradol) — Parenteral NSAID",
        mechanism: "Non-selective COX-1 and COX-2 inhibitor → reduces prostaglandin synthesis → anti-inflammatory, analgesic, antipyretic effects",
        indications: "Short-term management of moderate-to-severe acute pain (5-day maximum), post-operative pain, renal colic, as opioid-sparing agent",
        antidote: "🔴 No specific antidote. Misoprostol for GI protection. Dialysis for severe renal toxicity.",
        monitoring: "Renal function (BUN/Cr), GI symptoms (bleeding), BP (can cause HTN/edema), bleeding signs, platelet function",
        nursingPearls: "🔑 MAXIMUM 5 DAYS of therapy total (parenteral + oral combined). Contraindicated: active GI bleeding, renal impairment, coagulopathy, perioperative CABG, pregnancy (especially 3rd trimester). Potent parenteral NSAID — opioid-sparing benefits without respiratory depression or sedation. NO opioid-related constipation.",
        sideEffects: "GI bleeding/ulceration, renal impairment (especially with dehydration), bleeding (inhibits platelet aggregation), HTN, edema, elevated LFTs",
      },
    ],
  },
  {
    id: "psych",
    name: "Psychiatric Medications",
    icon: "🧠",
    color: "#e0c05c",
    suffix: "SSRIs: -ine | Benzodiazepines: -azepam or -azolam | Atypical antipsychotics: -pine or -done",
    suffixNote: "SSRIs: fluoxETINE, sertraLINE, paroxETINE, citaloPRAM. Benzodiazepines: diazEPAM, lorazEPAM, alprazOLAM, midazOLAM. Typical antipsychotics: halopERIDOL, chlorpromaZINE. Atypical: olanzaPINE, quetaPINE, risperiDONE, ziprasiDONE. Memory: -azepam/-azolam = benzo (GABA enhancer). -pine/-done = atypical antipsychotic.",
    keyDrugs: ["Sertraline/Zoloft (SSRI)", "Fluoxetine/Prozac (SSRI)", "Haloperidol/Haldol (typical antipsychotic)", "Quetiapine/Seroquel (atypical)", "Lithium (mood stabilizer)", "Lorazepam/Ativan (-azepam — benzo)", "Valproic Acid/Depakote (anticonvulsant/mood)"],
    classOverview: "Psychiatric medications affect neurotransmitters (serotonin, dopamine, norepinephrine, GABA). NCLEX safety priorities: SSRIs take 2–6 weeks (teach patient not to stop early), benzodiazepine withdrawal = FATAL seizures, antipsychotics cause EPS and NMS, lithium has extremely narrow therapeutic index.",
    classMnemonic: "EPS from antipsychotics = ADAPT: Akathisia (restlessness), Dystonia (acute spasm — treat with benztropine), Akinesia, Pseudoparkinsonism, Tardive dyskinesia (IRREVERSIBLE — long-term). NMS = FALTER: Fever, Altered LOC, Labile BP, Tremor/rigidity, Elevated CK, Rhabdomyolysis → STOP DRUG, ICU.",
    drugs: [
      {
        name: "Lithium Carbonate — Mood Stabilizer",
        mechanism: "Exact mechanism not fully elucidated — modulates neurotransmitter release (serotonin, norepinephrine, dopamine), inhibits inositol signaling, neuroprotective effects",
        indications: "Bipolar disorder (gold standard for mania prevention and maintenance therapy), augmentation of antidepressants in treatment-resistant depression",
        antidote: "🔴 No specific antidote. Hemodialysis for severe toxicity (level >3.5 mEq/L or severe symptoms). Supportive care.",
        monitoring: "Serum lithium (therapeutic: 0.6–1.2 mEq/L; acute mania up to 1.5), BUN/creatinine, TFTs (hypothyroidism risk), ECG, Na⁺ and hydration status",
        nursingPearls: "🔑 VERY NARROW THERAPEUTIC INDEX. Early toxicity (level 1.5–2.5): fine tremor, polyuria, nausea, diarrhea. Severe toxicity (>2.5): coarse tremor, confusion, ataxia, seizures, cardiac arrest. DEHYDRATION and NSAIDs → raise lithium levels → toxicity. Na⁺ depletion → lithium retention. Consistent Na⁺ and FLUID intake is essential. Teach: avoid NSAIDs, maintain hydration, report early toxicity signs.",
        sideEffects: "Fine tremor (early/chronic), polyuria/polydipsia (nephrogenic DI), weight gain, hypothyroidism (long-term), acne, Ebstein's anomaly (Category D teratogen — 1st trimester)",
      },
      {
        name: "Haloperidol (Haldol) — Typical Antipsychotic",
        mechanism: "First-generation (typical) antipsychotic — potent D2 dopamine receptor blocker in mesolimbic pathway → reduces positive symptoms of psychosis",
        indications: "Schizophrenia, acute psychosis/agitation (IM/IV), Tourette syndrome, delirium (ICU — low dose IV), intractable hiccups",
        antidote: "🔴 No specific antidote. Benztropine (Cogentin) or diphenhydramine for EPS. Bromocriptine + dantrolene for NMS.",
        monitoring: "EPS (dystonia, akathisia, parkinsonism), QTc interval (especially IV haloperidol), vital signs, temperature (NMS watch), AIMS test (tardive dyskinesia — long-term)",
        nursingPearls: "🔑 HIGH EPS RISK (typical antipsychotics = more D2 blockade). Acute dystonia (within hours-days) → benztropine IM immediately. NMS = LIFE-THREATENING EMERGENCY: hyperthermia + lead-pipe rigidity + altered LOC + autonomic instability + elevated CK → STOP drug → ICU. Tardive dyskinesia = IRREVERSIBLE with long-term use (involuntary face/tongue/limb movements).",
        sideEffects: "EPS (dystonia, akathisia, pseudoparkinsonism, tardive dyskinesia — irreversible), NMS (rare but fatal), QT prolongation (IV), sedation, orthostatic hypotension",
      },
      {
        name: "Sertraline (Zoloft) — SSRI [-ine]",
        mechanism: "Selectively inhibits presynaptic serotonin reuptake transporter (SERT) → increases synaptic serotonin concentration — most selective SSRI with fewest drug interactions",
        indications: "Major depression, OCD, panic disorder, PTSD, social anxiety disorder, PMDD",
        antidote: "🔴 No specific antidote. Cyproheptadine for serotonin syndrome. Benzodiazepines for agitation.",
        monitoring: "Suicidal ideation (especially <25 years — first weeks), weight, sexual dysfunction, serotonin syndrome signs (agitation, clonus, hyperthermia)",
        nursingPearls: "🔑 BLACK BOX WARNING: increased suicidal thinking in children, adolescents, young adults — monitor closely first 1–4 weeks. Takes 2–6 WEEKS for full antidepressant effect — teach patient not to stop early. NEVER combine with MAOIs (14-day washout required — serotonin syndrome = life-threatening). Discontinuation syndrome if stopped abruptly (dizziness, 'brain zaps', nausea) — taper slowly.",
        sideEffects: "Sexual dysfunction (most common long-term), nausea (usually improves), insomnia or somnolence, weight changes, serotonin syndrome (with interactions/overdose)",
      },
      {
        name: "Lorazepam (Ativan) — Benzodiazepine [-azepam]",
        mechanism: "Enhances GABA-A receptor-mediated chloride influx → CNS depression → anxiolytic, anticonvulsant, sedative, muscle relaxant, and amnestic effects",
        indications: "Anxiety, status epilepticus (IV — FIRST-LINE in most protocols), alcohol withdrawal seizures, procedural sedation, acute agitation",
        antidote: "🔴 Flumazenil — use CAUTIOUSLY in benzo-dependent patients (can precipitate life-threatening seizure withdrawal). Short-acting — re-sedation possible.",
        monitoring: "Respiratory rate, sedation level (especially with opioids — BLACK BOX WARNING together), LOC, fall risk (especially elderly — BEERS criteria), dependence signs",
        nursingPearls: "🔑 HIGH DEPENDENCE POTENTIAL — Schedule IV. ABRUPT WITHDRAWAL in dependent patients = LIFE-THREATENING SEIZURES — MUST taper slowly over weeks-months. ELDERLY: HIGH fall/fracture risk + cognitive impairment (BEERS criteria — avoid if possible). IV lorazepam for status epilepticus: 0.1 mg/kg IV. Opioids + benzodiazepines = BLACK BOX WARNING for fatal respiratory depression.",
        sideEffects: "Sedation, respiratory depression, anterograde amnesia, physical dependence, withdrawal seizures (abrupt discontinuation), paradoxical excitation (elderly/pediatric), falls",
      },
    ],
  },
  {
    id: "endocrine",
    name: "Endocrine Medications",
    icon: "⚗️",
    color: "#e07e5c",
    suffix: "Insulins: named by onset/duration | Sulfonylureas: -ide | PPARγ agonists: -glitazone | GLP-1 agonists: -glutide",
    suffixNote: "Insulins: lispro/aspart (rapid), Regular (short), NPH (intermediate), glargine/detemir (long-acting). Sulfonylureas: glipiZIDE, glybURIDE, glimePIRIDE — stimulate insulin release. GLP-1 agonists: exenaGLUTIDE, liragluTIDE, semaGLUTIDE. DPP-4 inhibitors: sitagLIPTIN, saxaGLIPTIN. Thyroid: levothyroxine (T4), liothyronine (T3).",
    keyDrugs: ["Regular Insulin (short-acting — IV ok!)", "Insulin Glargine/Lantus (long-acting — NO mixing!)", "Insulin Lispro/Humalog (rapid-acting)", "Metformin/Glucophage (biguanide)", "Levothyroxine/Synthroid (T4 replacement)"],
    classOverview: "Endocrine drugs replace or modulate hormones. KEY insulin rules: ONLY Regular insulin can be given IV, NEVER mix insulin glargine with other insulins, ALWAYS check BG before every insulin dose, use 15-15 rule for hypoglycemia. Metformin: HOLD before IV contrast dye.",
    classMnemonic: "Insulin clarity rule: CLEAR = Regular OR Glargine (read the label!). CLOUDY = NPH only. ONLY REGULAR goes IV. NEVER mix glargine. BG before EVERY insulin dose. Metformin + contrast = HOLD (lactic acidosis risk).",
    drugs: [
      {
        name: "Regular Insulin (Humulin R / Novolin R) — Short-Acting",
        mechanism: "Short-acting human insulin — binds insulin receptors → GLUT4 translocation → cellular glucose uptake; inhibits gluconeogenesis and glycogenolysis in liver",
        indications: "Type 1 & 2 DM, hyperkalemia treatment (drives K⁺ intracellularly with dextrose), DKA (IV drip), hospitalized hyperglycemia management",
        antidote: "🔴 Dextrose (D50W IV) for hypoglycemia. Glucagon IM/SQ if no IV access.",
        monitoring: "Blood glucose (before and 1–2 hrs after), K⁺ (drops with insulin in DKA — critical to monitor and replace), vital signs",
        nursingPearls: "🔑 ONLY insulin that can be given IV. Clear appearance (BUT glargine is also clear — always read the label twice!). Onset 30–60 min, peak 2–4 hrs, duration 6–8 hrs. For hyperkalemia: give with D50W simultaneously (prevents hypoglycemia while insulin drives K⁺ into cells). In DKA: IV insulin drip with mandatory K⁺ replacement.",
        sideEffects: "Hypoglycemia (most critical), hypokalemia (especially in DKA treatment), lipodystrophy at injection sites, weight gain",
      },
      {
        name: "Insulin Glargine (Lantus / Basaglar / Toujeo) — Long-Acting",
        mechanism: "Long-acting insulin analog — pH 4 solution precipitates at subcutaneous pH → forms depot → slow, sustained, PEAKLESS absorption over 24 hours",
        indications: "Basal insulin coverage for Type 1 & 2 DM — controls fasting glucose",
        antidote: "🔴 Dextrose (D50W IV). Glucagon IM/SQ.",
        monitoring: "Fasting blood glucose (target 80–130 mg/dL), HbA1c (every 3 months), injection sites, signs of hypoglycemia",
        nursingPearls: "🔑 PEAKLESS — provides 24-hour basal coverage with no pronounced peak (lower hypoglycemia risk than NPH). Same time EVERY day. NEVER EVER mix with ANY other insulin (pH disruption destroys depot mechanism and alters both insulins' pharmacokinetics). Do NOT shake — roll gently. Clear appearance — always read the label!",
        sideEffects: "Hypoglycemia (less risk than NPH due to no peak), weight gain, lipodystrophy at injection sites, injection site reactions",
      },
      {
        name: "Metformin (Glucophage) — Biguanide",
        mechanism: "Decreases hepatic gluconeogenesis (primary mechanism), increases peripheral insulin sensitivity, modestly reduces intestinal glucose absorption. Does NOT stimulate insulin secretion.",
        indications: "Type 2 DM (FIRST-LINE therapy), prediabetes, PCOS, insulin resistance",
        antidote: "🔴 No specific antidote. Hemodialysis for severe lactic acidosis.",
        monitoring: "BG, HbA1c, renal function (eGFR — HOLD if <30 mL/min), B12 levels (long-term use), LFTs",
        nursingPearls: "🔑 HOLD before IV contrast dye (before AND 48 hrs after) — contrast nephropathy → metformin accumulation → LACTIC ACIDOSIS (mortality ~50%). HOLD before surgery. Does NOT cause hypoglycemia when used alone (no insulin secretion). Take WITH food (reduces GI side effects — very common initially). eGFR <30 = ABSOLUTELY CONTRAINDICATED. Long-term B12 deficiency — supplement or monitor levels.",
        sideEffects: "GI upset (nausea, diarrhea, abdominal cramping — improves over weeks), lactic acidosis (rare but serious — especially with renal impairment), B12 deficiency (long-term)",
      },
      {
        name: "Levothyroxine (Synthroid/Levoxyl) — T4 Thyroid Replacement",
        mechanism: "Synthetic T4 (thyroxine) → peripherally converted to active T3 by deiodinase → binds thyroid hormone receptors → regulates metabolism, growth, and organ function",
        indications: "Hypothyroidism (primary thyroid replacement), thyroid cancer suppression (supraphysiologic doses), myxedema coma",
        antidote: "🔴 No specific antidote. Beta-blockers for tachycardia/symptoms of over-replacement. Gradual dose reduction.",
        monitoring: "TSH (primary monitoring — normal 0.4–4.0 mIU/L; check 4–6 weeks after dose changes), free T4, HR, weight, signs of over/under-replacement",
        nursingPearls: "🔑 Take on EMPTY STOMACH with WATER ONLY 30–60 min before breakfast. Separate from calcium, iron supplements, antacids, PPIs, and cholestyramine by at least 4 hours (bind levothyroxine → reduced absorption). Narrow therapeutic index — dose changes take 4–6 WEEKS to stabilize TSH. Start LOW in elderly and cardiac patients (can precipitate angina or MI). Report: palpitations, tremors, weight loss, sweating (over-replacement).",
        sideEffects: "Over-replacement: palpitations, tachycardia, weight loss, insomnia, tremor, heat intolerance, osteoporosis (long-term). Under-replacement: fatigue, weight gain, cold intolerance, bradycardia, depression.",
      },
    ],
  },
  {
    id: "respiratory",
    name: "Respiratory Medications",
    icon: "🫁",
    color: "#5ce0c4",
    suffix: "Beta-2 agonists: -terol | Inhaled corticosteroids: -one or -ide | Anticholinergics: -tropium",
    suffixNote: "SABAs (rescue): albuTEROL, levalbuTEROL. LABAs (control): salmetEROL, formotEROL. ICS (anti-inflammatory): fluticasONE, budesonIDE, beclomethasONE. LAMAs (COPD): tiotropIUM, umeclidinIUM. SAMAs: ipratropIUM. Memory: -terol = bronchodilator (beta-2 agonist). -tropium = anticholinergic bronchodilator. -one/-ide = corticosteroid.",
    keyDrugs: ["Albuterol (-terol — SABA rescue)", "Salmeterol (-terol — LABA control)", "Fluticasone (-one — ICS)", "Tiotropium (-tropium — LAMA)", "Ipratropium (-tropium — SAMA)"],
    classOverview: "Respiratory drugs treat asthma and COPD. KEY distinction: RESCUE inhalers (SABAs like albuterol) treat acute bronchospasm NOW. CONTROLLER medications (ICS, LABAs, LAMAs) prevent symptoms over time. Using rescue inhaler >2 days/week for symptoms = inadequately controlled asthma → step up therapy. ALWAYS rinse mouth after inhaled corticosteroids.",
    classMnemonic: "SABA = Short-Acting Beta Agonist = Rescue inhaler. LABA = Long-Acting Beta Agonist = Control (never use LABA alone in asthma — always with ICS). ICS = Inhaled CorticoSteroid = prevents inflammation. LAMA = Long-Acting Muscarinic Antagonist = COPD control. Rinse AFTER ICS (prevents thrush).",
    drugs: [
      {
        name: "Albuterol (ProAir/Ventolin) — SABA",
        mechanism: "Short-acting selective β2-adrenergic receptor agonist → relaxes bronchial smooth muscle → rapid bronchodilation. Also used for hyperkalemia (shifts K⁺ intracellularly at high doses).",
        indications: "Acute bronchospasm (asthma, COPD exacerbation), exercise-induced bronchospasm prevention (before exercise), hyperkalemia (adjunct)",
        antidote: "🔴 No specific antidote. Non-selective beta-blocker can reverse effects (use with extreme caution — may cause bronchospasm).",
        monitoring: "HR (tachycardia), K⁺ (hypokalemia at high/nebulized doses), SpO2, peak flow, breath sounds, tremor",
        nursingPearls: "🔑 RESCUE inhaler — NOT for daily maintenance. Use >2 days/week for symptom control = UNCONTROLLED ASTHMA → notify provider (step-up therapy needed). Shake before use, use spacer device (improves delivery). Tachycardia and tremor are expected side effects — not reasons to stop. Refill requests increasing = poor asthma control signal.",
        sideEffects: "Tachycardia (most common), tremor, hypokalemia (high doses), nervousness/anxiety, paradoxical bronchospasm (rare — stop immediately)",
      },
      {
        name: "Fluticasone (Flovent/Flonase) — ICS",
        mechanism: "Inhaled corticosteroid — binds glucocorticoid receptors → suppresses inflammatory gene transcription → reduces airway inflammation, mucus hypersecretion, and bronchial hyperresponsiveness",
        indications: "Persistent asthma (controller/maintenance — ALL severity levels requiring controller therapy), allergic rhinitis (nasal formulation)",
        antidote: "🔴 No specific antidote",
        monitoring: "Growth in children (ICS may suppress linear growth with high doses), HPA axis (adrenal suppression — high doses/prolonged), bone density (long-term), oropharyngeal candidiasis",
        nursingPearls: "🔑 CONTROLLER — NOT for acute bronchospasm (won't work fast enough). ALWAYS rinse mouth and gargle with water AFTER EVERY USE → spit it out → prevents ORAL CANDIDIASIS (thrush — most common side effect, easily prevented). Takes days-weeks for full effect. Use spacer device. Often combined with LABA: Advair (fluticasone + salmeterol), Symbicort (budesonide + formoterol).",
        sideEffects: "Oral candidiasis (PREVENTABLE — RINSE MOUTH!), dysphonia (hoarseness — reduced with spacer), HPA suppression (high doses), growth suppression in children (high doses)",
      },
      {
        name: "Tiotropium (Spiriva) — LAMA",
        mechanism: "Long-acting muscarinic antagonist (LAMA) — selectively blocks M3 muscarinic receptors in bronchial smooth muscle → prolonged bronchodilation for 24 hours",
        indications: "COPD maintenance therapy (first-line), asthma add-on therapy for uncontrolled asthma ≥6 years",
        antidote: "🔴 No specific antidote",
        monitoring: "Urinary symptoms (retention — especially with BPH), intraocular pressure (narrow-angle glaucoma), dry mouth, renal function",
        nursingPearls: "🔑 ONCE DAILY maintenance — NOT a rescue inhaler. HandiHaler CAPSULES are for INHALATION ONLY — do NOT swallow (common error!). Avoid spraying into eyes (narrow-angle glaucoma risk — angle closure). Anticholinergic side effects: urinary retention (caution in BPH — notify provider), constipation, dry mouth, tachycardia. Respimat soft mist inhaler is an alternative.",
        sideEffects: "Dry mouth (most common), urinary retention (especially with BPH), constipation, blurred vision, paradoxical bronchospasm (rare), tachycardia",
      },
    ],
  },
  {
    id: "gi",
    name: "GI Medications",
    icon: "🫃",
    color: "#c4e05c",
    suffix: "PPIs: -prazole | H2 blockers: -tidine | 5-HT3 antagonists (antiemetics): -setron",
    suffixNote: "PPIs: omePRAZOLE, pantoPRAZOLE, lanSOPRAZOLE, esomePRAZOLE — ALL end in -PRAZOLE (most potent acid suppressors). H2 blockers: famotiDINE, ranitIDINE, cimETIDINE — end in -TIDINE. 5-HT3 antiemetics: ondanSETRON, graniSETRON — end in -SETRON. Memory: -prazole = PPI (proton pump). -tidine = H2 (histamine 2 blocker). -setron = serotonin antagonist antiemetic.",
    keyDrugs: ["Omeprazole (-prazole — PPI)", "Pantoprazole (-prazole — PPI, preferred with Plavix)", "Famotidine (-tidine — H2 blocker)", "Ondansetron/Zofran (-setron — antiemetic)", "Metoclopramide/Reglan (prokinetic)"],
    classOverview: "GI drugs treat acid disorders, nausea, and motility issues. PPIs are most potent acid suppressors but require 30–60 min before meals. H2 blockers are less potent but faster for acute symptoms. Ondansetron IV: major QT prolongation risk — NEVER rapid IV push. Long-term PPI risks: hypomagnesemia, B12 deficiency, C. diff.",
    classMnemonic: "-prazole = PPI (most potent, taken BEFORE meals). -tidine = H2 blocker (faster but less potent, can take with meals). -setron = antiemetic (give ondansetron SLOWLY IV — QT risk). PPIs + Plavix = BAD combo (use pantoprazole instead — less CYP2C19 interaction).",
    drugs: [
      {
        name: "Omeprazole (Prilosec) — PPI [-prazole]",
        mechanism: "Irreversibly inhibits H⁺/K⁺-ATPase (proton pump) on gastric parietal cells after activation by acidic pH → blocks ALL phases of acid secretion for 24+ hours",
        indications: "GERD, peptic ulcer disease, H. pylori (triple/quadruple therapy), Zollinger-Ellison syndrome, NSAID-induced ulcer prevention",
        antidote: "🔴 No specific antidote",
        monitoring: "Mg²⁺ (hypomagnesemia — especially after >1 year), B12 (deficiency — long-term), bone density (fracture risk), C. diff risk, renal function (CKD association)",
        nursingPearls: "🔑 Give 30–60 min BEFORE meals (proton pump must be actively secreting acid to be inhibited). Long-term risks: hypomagnesemia (tremors, seizures, arrhythmias — FDA warning), B12 deficiency, increased C. diff risk, osteoporosis, CKD. CYP2C19 inhibitor → reduces clopidogrel (Plavix) activation → use PANTOPRAZOLE with Plavix instead. Do NOT crush delayed-release capsules.",
        sideEffects: "Headache, diarrhea (short-term); long-term: hypomagnesemia, B12 deficiency, fractures, C. diff, CKD risk, community-acquired pneumonia",
      },
      {
        name: "Ondansetron (Zofran) — 5-HT3 Antagonist [-setron]",
        mechanism: "Selectively blocks 5-HT3 (serotonin) receptors in the chemoreceptor trigger zone (CTZ) and vagal afferents → blocks emetic signals to vomiting center",
        indications: "Chemotherapy-induced nausea/vomiting (CINV — gold standard), post-operative nausea/vomiting (PONV), radiation-induced nausea, general nausea",
        antidote: "🔴 No specific antidote",
        monitoring: "QTc interval (especially IV — correct electrolytes first), bowel sounds (constipation), serotonin syndrome signs (with other serotonergic drugs)",
        nursingPearls: "🔑 QT PROLONGATION RISK with IV administration — NEVER give as rapid IV push (can cause fatal arrhythmia). Infuse over AT LEAST 15 minutes for scheduled doses. Correct K⁺ and Mg²⁺ before giving (electrolyte abnormalities increase QT risk). Constipation is very common — monitor bowel function. ODT (orally dissolving tablet) available. Serotonin syndrome risk with SSRIs, MAOIs, tramadol.",
        sideEffects: "Constipation (most common), headache, QT prolongation (IV — potentially fatal if rapid push), diarrhea, serotonin syndrome (with serotonergic agents)",
      },
    ],
  },
  {
    id: "musculoskeletal",
    name: "Musculoskeletal Medications",
    icon: "🦴",
    color: "#d4a06a",
    suffix: "Bisphosphonates: -dronate | Xanthine oxidase inhibitors: -purinol | DMARDs: varied",
    suffixNote: "Bisphosphonates: alendRONATE, risedRONATE, ibanDRONATE, zoledRONATE — end in -DRONATE. Xanthine oxidase inhibitors (gout prevention): alloePURINOL, febuxoSTAT. Muscle relaxants: cyclobenzaprine (Flexeril), baclofen, methocarbamol (Robaxin) — no suffix pattern. DMARDs: methotrexate (WEEKLY!), leflunomide, hydroxychloroquine.",
    keyDrugs: ["Alendronate/Fosamax (-dronate — osteoporosis)", "Colchicine (acute gout — NOT prevention)", "Allopurinol (-purinol — gout prevention)", "Baclofen (muscle relaxant — NEVER stop abruptly)", "Methotrexate (DMARD — WEEKLY not daily!)", "Cyclobenzaprine/Flexeril (muscle relaxant)"],
    classOverview: "Musculoskeletal drugs treat osteoporosis, gout, spasticity, and inflammatory arthritis. Critical NCLEX safety points: Alendronate requires strict administration technique (upright 30 min!), methotrexate is WEEKLY for RA (daily = FATAL), baclofen withdrawal causes life-threatening seizures, allopurinol must NOT be started during acute gout flare.",
    classMnemonic: "Alendronate: UPRIGHT 30 min (or esophageal erosion!). MTX: Must Take Weekly (daily = deadly). Baclofen: Never Abruptly Stop (seizures + hyperthermia). Allopurinol: Allow the Flare to Resolve first (wait 2–4 weeks). Colchicine: GI symptoms = dose-limiting signal (stop or reduce).",
    drugs: [
      {
        name: "Alendronate (Fosamax) — Bisphosphonate [-dronate]",
        mechanism: "Bisphosphonate — inhibits osteoclast activity and induces osteoclast apoptosis → slows bone resorption → increases bone mineral density",
        indications: "Osteoporosis prevention and treatment (post-menopausal, glucocorticoid-induced, male), Paget's disease of bone",
        antidote: "🔴 No specific antidote. Calcium/milk may bind drug if given immediately after ingestion.",
        monitoring: "Bone mineral density (DEXA scan), Ca²⁺ and Vitamin D (correct deficiencies before starting), renal function (CrCl <35 = contraindicated), jaw pain, thigh/groin pain (atypical femur fracture)",
        nursingPearls: "🔑 THREE CRITICAL RULES — must do ALL to prevent esophageal erosion/necrosis: (1) Empty stomach + 8 oz PLAIN WATER only (no juice, coffee, food). (2) Remain UPRIGHT (sitting or standing) — NO LYING DOWN for ≥30 minutes after. (3) No food, other beverages, or medications for 30 min. Weekly 70mg dosing. Osteonecrosis of jaw (ONJ) — complete dental work before starting. Drug holiday after 3–5 years may be considered.",
        sideEffects: "Esophageal irritation/ulceration/perforation (if taken incorrectly!), hypocalcemia, musculoskeletal pain, ONJ (rare), atypical femur fractures (long-term use)",
      },
      {
        name: "Colchicine (Colcrys) — Anti-Gout (Acute)",
        mechanism: "Binds tubulin → inhibits microtubule assembly → impairs neutrophil migration and phagocytosis → reduces uric acid crystal-induced inflammation (does NOT lower uric acid levels)",
        indications: "Acute gout attack (FIRST-LINE — most effective within 12–36 hours of symptom onset), gout prophylaxis, familial Mediterranean fever, pericarditis",
        antidote: "🔴 No specific antidote. Supportive care. GI symptoms signal dose-limiting toxicity.",
        monitoring: "Renal function (dose-adjust if CrCl <30), CBC (bone marrow suppression in toxicity), GI symptoms (dose-limiting signal), neuromuscular symptoms",
        nursingPearls: "🔑 START EARLY in gout attack — most effective within 12–36 hours. GI symptoms (diarrhea, nausea, vomiting) = DOSE-LIMITING SIGNAL — reduce dose or hold (do NOT push through). CYP3A4 inhibitors (clarithromycin, cyclosporine, statins) dramatically increase colchicine toxicity. Avoid grapefruit. Toxicity progression: GI → bone marrow suppression → multi-organ failure.",
        sideEffects: "Diarrhea (most common/dose-limiting — signal to reduce dose), nausea/vomiting, bone marrow suppression (toxicity), myopathy, neuropathy",
      },
      {
        name: "Allopurinol (Zyloprim) — Xanthine Oxidase Inhibitor [-purinol]",
        mechanism: "Inhibits xanthine oxidase → blocks conversion of hypoxanthine → xanthine → uric acid → LOWERS serum uric acid production (does NOT treat acute attacks)",
        indications: "Chronic gout PREVENTION (NOT for acute flares!), hyperuricemia from chemotherapy (tumor lysis syndrome prophylaxis), recurrent uric acid kidney stones",
        antidote: "🔴 No specific antidote",
        monitoring: "Serum uric acid (target <6 mg/dL), BUN/creatinine, CBC, LFTs, skin rash (SJS/DRESS risk — especially with HLA-B*5801 allele)",
        nursingPearls: "🔑 NEVER start during ACUTE GOUT FLARE — mobilizes urate crystals → worsens/prolongs attack. Wait until flare FULLY resolves (2–4 weeks) before starting. Increase fluid intake (2–3 L/day). DRESS syndrome/SJS/TEN risk — life-threatening hypersensitivity (especially in Asian patients with HLA-B*5801 — genetic test recommended before starting). Increases toxicity of azathioprine and 6-MP — reduce their doses 67–75%.",
        sideEffects: "Rash (can progress to SJS/TEN/DRESS — life-threatening), GI upset, gout flare on initiation, hepatotoxicity, bone marrow suppression (rare)",
      },
      {
        name: "Methotrexate (Rheumatrex — RA dosing) — DMARD",
        mechanism: "Folate antagonist — inhibits dihydrofolate reductase (DHFR) → impairs DNA synthesis in rapidly dividing immune cells → anti-inflammatory and immunosuppressive at low WEEKLY doses",
        indications: "Rheumatoid arthritis (first-line DMARD), psoriasis, psoriatic arthritis. At HIGH doses: leukemia, lymphoma, ectopic pregnancy, osteosarcoma.",
        antidote: "🔴 Leucovorin (folinic acid) — bypasses DHFR block (leucovorin rescue). Used for toxicity or high-dose MTX protocols.",
        monitoring: "CBC (bone marrow suppression — monthly initially), LFTs (hepatotoxicity — baseline then q1–3 months), BUN/Cr (nephrotoxicity), CXR/PFTs (pulmonary toxicity), pregnancy test (Category X!)",
        nursingPearls: "🔑 RA DOSE = WEEKLY — NEVER DAILY. Daily dosing causes FATAL bone marrow suppression and mucositis — one of the most catastrophic medication errors in nursing. ALWAYS verify frequency (weekly, weekly, weekly). Supplement FOLIC ACID (reduces side effects — do NOT stop it). Category X teratogen — contraception during AND 3 months AFTER. Avoid alcohol (hepatotoxicity), NSAIDs (reduce renal MTX clearance), live vaccines, and patients with active infections.",
        sideEffects: "Nausea/vomiting, mucositis (mouth sores), bone marrow suppression (fatal if daily dose!), hepatotoxicity/cirrhosis (long-term), pulmonary toxicity (pneumonitis), teratogenicity (Category X)",
      },
      {
        name: "Baclofen (Lioresal) — Muscle Relaxant / Antispasticity",
        mechanism: "GABA-B receptor agonist in spinal cord → inhibits excitatory neurotransmitter release from afferent fibers → reduces skeletal muscle spasticity and tone",
        indications: "Spasticity from MS, spinal cord injury, cerebral palsy; chronic hiccups; intrathecal pump for severe refractory spasticity",
        antidote: "🔴 No specific antidote. Physostigmine may help in acute toxicity. Supportive care. Intrathecal pump failure = emergency.",
        monitoring: "Muscle tone and spasticity, sedation, seizure activity (withdrawal watch!), BP, renal function (renally cleared)",
        nursingPearls: "🔑 NEVER abruptly discontinue — withdrawal causes: hallucinations, hyperthermia, rebound severe spasticity, seizures — CAN BE FATAL (especially with intrathecal pump failure). ALWAYS taper slowly. Intrathecal baclofen pump alarm = MEDICAL EMERGENCY. Potentiates CNS depressants and alcohol.",
        sideEffects: "Sedation, weakness/hypotonia, dizziness, nausea, urinary frequency, withdrawal seizures and hyperthermia (if abruptly stopped)",
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
      <div className={"drug-card" + (isFlipped ? " flipped" : "")}>
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
        className={"drug-item" + (isOpen ? " expanded" : "")}
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
              <div className="detail-block side-effects-block">
                <div className="detail-label" style={{color:"var(--red)"}}>⚠️ SIDE EFFECTS</div>
                <p style={{color:"var(--red)"}}>{drug.sideEffects}</p>
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
              className={"class-btn" + (currentClass.id === dc.id ? " active" : "")}
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

      {/* Class header — suffix, key drugs, overview, mnemonic */}
      {!searchActive && (
        <div className="class-header-card" style={{"--accent": currentClass.color}}>
          {/* Suffix badge */}
          <div className="class-suffix-row">
            <span className="class-suffix-label">DRUG ENDING</span>
            <span className="class-suffix-badge" style={{background: currentClass.color + "22", color: currentClass.color, borderColor: currentClass.color + "55"}}>
              {currentClass.suffix}
            </span>
          </div>

          {/* Suffix note */}
          {currentClass.suffixNote && (
            <p className="class-suffix-note">{currentClass.suffixNote}</p>
          )}

          {/* Key drugs */}
          {currentClass.keyDrugs && (
            <div className="class-key-drugs">
              <div className="class-key-label">KEY DRUGS TO KNOW</div>
              <div className="class-key-list">
                {currentClass.keyDrugs.map((d, i) => (
                  <span key={i} className="class-key-drug" style={{background: currentClass.color + "15", color: currentClass.color, borderColor: currentClass.color + "40"}}>
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Class overview */}
          {currentClass.classOverview && (
            <div className="class-overview-section">
              <div className="class-key-label">CLASS OVERVIEW</div>
              <p className="class-overview-text">{currentClass.classOverview}</p>
            </div>
          )}

          {/* Mnemonic */}
          {currentClass.classMnemonic && (
            <div className="class-mnemonic-section">
              <span className="class-mnemonic-icon">💡</span>
              <p className="class-mnemonic-text">{currentClass.classMnemonic}</p>
            </div>
          )}
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
          className={"fc-filter" + (!activeClass ? " active" : "")}
          onClick={() => { setActiveClass(null); setCardIndex(0); setFlipped(false); }}
        >All</button>
        {DRUG_CLASSES.map((dc) => (
          <button
            key={dc.id}
            className={"fc-filter" + (activeClass?.id === dc.id ? " active" : "")}
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
                className={"setup-pill" + (filterClass === cls ? " active" : "")}
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
              className={"mode-btn" + (!timedMode ? " active" : "")}
              onClick={() => setTimedMode(false)}
            >
              <span className="mode-icon">📖</span>
              <span className="mode-name">Study Mode</span>
              <span className="mode-desc">No time limit — read explanations</span>
            </button>
            <button
              className={"mode-btn" + (timedMode ? " active" : "")}
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
            <div key={i} className={"result-item " + (answers[i]?.correct ? "correct" : "wrong")}>
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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const reply = data.reply || "Sorry, I couldn't generate a response.";
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
          <div key={i} className={"message " + m.role}>
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
              className={"prompt-cat-tab" + (activeCategory === i ? " active" : "")}
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


// ── SAFETY TAB ────────────────────────────────────────────────────────────────

const PRE_ADMIN_DATA = [
  {
    category: "Cardiac Glycosides",
    color: "#e05ca0",
    icon: "❤️",
    drugs: ["Digoxin (Lanoxin)"],
    checks: [
      { icon: "⏱️", label: "Apical pulse × 1 full minute", critical: true, detail: "HOLD and notify provider if apical HR <60 bpm (adult). Document rate before administering." },
      { icon: "🧪", label: "Check serum potassium (K⁺)", critical: true, detail: "Therapeutic: 3.5–5.0 mEq/L. Hypokalemia (<3.5) dramatically increases digoxin toxicity risk — hold and notify if low." },
      { icon: "🧪", label: "Check digoxin level if ordered", critical: true, detail: "Therapeutic range: 0.5–2.0 ng/mL. HF target: 0.5–0.9 ng/mL. Hold and notify if supratherapeutic." },
      { icon: "🫘", label: "Check renal function (BUN/Cr)", critical: false, detail: "Digoxin is renally cleared. Renal impairment → drug accumulation → toxicity. Dose adjustments may be needed." },
      { icon: "👁️", label: "Assess for toxicity symptoms", critical: true, detail: "Ask about: nausea/vomiting, yellow-green halos, blurred vision, headache, fatigue. These are early toxicity signs — hold and report." },
      { icon: "💊", label: "Review all concurrent medications", critical: false, detail: "Quinidine, amiodarone, verapamil, and clarithromycin increase digoxin levels. NSAIDs may worsen renal function → toxicity." },
    ]
  },
  {
    category: "Anticoagulants — Warfarin",
    color: "#e05c5c",
    icon: "🩸",
    drugs: ["Warfarin (Coumadin)"],
    checks: [
      { icon: "🧪", label: "Check current INR", critical: true, detail: "Therapeutic INR: 2–3 (most indications), 2.5–3.5 (mechanical heart valves). Hold and notify if >3.5 without active bleeding order, or per facility protocol." },
      { icon: "🩹", label: "Assess for active bleeding", critical: true, detail: "Check: unusual bruising, blood in urine/stool, prolonged bleeding from cuts, gum bleeding, nosebleeds, hemoptysis." },
      { icon: "💊", label: "Review new medications and supplements", critical: true, detail: "Hundreds of interactions. Antibiotics, NSAIDs, aspirin, amiodarone, clarithromycin, and many supplements (fish oil, vitamin E, garlic) can raise INR dangerously." },
      { icon: "🥗", label: "Assess recent dietary changes", critical: false, detail: "Sudden increase in Vitamin K foods (spinach, kale, broccoli) lowers INR. Sudden decrease raises INR. Teach consistency, not elimination." },
      { icon: "📋", label: "Verify dose matches current INR", critical: true, detail: "Warfarin dosing is adjusted based on INR results. Always verify the dose ordered aligns with the most recent INR result." },
    ]
  },
  {
    category: "Anticoagulants — Heparin",
    color: "#e07e5c",
    icon: "💉",
    drugs: ["Unfractionated Heparin (UFH) IV"],
    checks: [
      { icon: "🧪", label: "Check aPTT level", critical: true, detail: "Therapeutic aPTT: 60–100 seconds (1.5–2.5× normal). Subtherapeutic = increase rate. Supratherapeutic = decrease/hold. Always use heparin protocol." },
      { icon: "🩹", label: "Assess for bleeding signs", critical: true, detail: "Check IV sites, urine color, stool color, neurological status (intracranial bleed), and any unusual bruising or pain." },
      { icon: "🩸", label: "Check platelet count", critical: true, detail: "Monitor for HIT: platelet drop >50% on days 5–10. HIT is prothrombotic. Stop heparin immediately if HIT suspected." },
      { icon: "💊", label: "Verify infusion pump settings", critical: true, detail: "Heparin is a HIGH ALERT medication. Two-nurse verification of concentration, rate, and patient identity before starting or changing infusion." },
      { icon: "🚨", label: "Confirm protamine sulfate is available", critical: false, detail: "Protamine sulfate is the heparin antidote. Ensure it's available on unit before administering high-dose heparin." },
    ]
  },
  {
    category: "Insulin",
    color: "#5c8de0",
    icon: "💉",
    drugs: ["All insulin types"],
    checks: [
      { icon: "🍬", label: "Check blood glucose BEFORE administering", critical: true, detail: "ALWAYS check BG before insulin. Hold if BG <70 mg/dL (hypoglycemic) and notify provider. Verify BG result matches clinical picture." },
      { icon: "🍽️", label: "Verify patient has eaten or will eat (rapid-acting)", critical: true, detail: "Rapid-acting insulins (lispro, aspart, glulisine): give within 15 min of meal. If patient can't eat → hold and notify provider." },
      { icon: "👁️", label: "Inspect insulin appearance", critical: true, detail: "Regular and glargine = CLEAR. NPH = CLOUDY (normal). Discard if: cloudy when should be clear, clumped, discolored, or past expiration." },
      { icon: "🔬", label: "Verify correct insulin TYPE and dose", critical: true, detail: "Insulin is HIGH ALERT. Two-nurse verification required at many facilities. Confirm: right insulin type, right dose, right route (SubQ vs IV), right time." },
      { icon: "🧪", label: "NEVER mix insulin glargine with other insulins", critical: true, detail: "Glargine (Lantus/Basaglar) has pH 4 — mixing changes pH and pharmacokinetics of both insulins. Always separate syringes and sites." },
      { icon: "🍬", label: "Ensure fast-acting glucose is accessible", critical: false, detail: "Keep 15g fast-acting carbohydrate (juice, glucose tabs) or D50W IV accessible before administering insulin, especially in high-risk patients." },
    ]
  },
  {
    category: "Opioid Analgesics",
    color: "#c47ee0",
    icon: "🎯",
    drugs: ["Morphine", "Oxycodone", "Hydromorphone", "Fentanyl", "Codeine"],
    checks: [
      { icon: "🫁", label: "Assess respiratory rate", critical: true, detail: "HOLD if RR <12 breaths/min. Assess depth and quality of respirations, not just rate. Notify provider before administering." },
      { icon: "😴", label: "Assess level of consciousness/sedation", critical: true, detail: "Use PASERO opioid sedation scale. Hold if patient is difficult to arouse (score 3) or unarousable (score 4). Risk of respiratory arrest." },
      { icon: "📊", label: "Check pain score and last dose time", critical: false, detail: "Reassess pain before giving. Verify time of last opioid dose to avoid stacking. Is current pain consistent with expected pattern?" },
      { icon: "🚨", label: "Confirm naloxone (Narcan) is available", critical: true, detail: "Naloxone must be immediately accessible whenever opioids are administered. Know the reversal dose (0.4–2mg IV/IM/IN) and be ready to repeat." },
      { icon: "💊", label: "Check for concurrent CNS depressants", critical: true, detail: "Benzodiazepines + opioids = HIGH RISK of fatal respiratory depression (FDA Black Box Warning). Alcohol, antihistamines, muscle relaxants also potentiate." },
      { icon: "🤢", label: "Assess bowel function", critical: false, detail: "Opioids cause constipation in virtually all patients. Initiate prophylactic bowel regimen (stool softener + stimulant laxative) with first opioid dose." },
    ]
  },
  {
    category: "Antihypertensives — Beta Blockers",
    color: "#5c7de0",
    icon: "⏱️",
    drugs: ["Metoprolol", "Carvedilol", "Propranolol", "Atenolol", "Labetalol"],
    checks: [
      { icon: "⏱️", label: "Check apical/radial pulse", critical: true, detail: "HOLD if HR <60 bpm and notify provider. Beta blockers cause bradycardia — assess rate AND rhythm. Document before administering." },
      { icon: "📊", label: "Check blood pressure", critical: true, detail: "HOLD if systolic BP <90 mmHg (or per facility parameters) and notify provider. Risk of hypotension especially with first doses." },
      { icon: "🫁", label: "Assess respiratory status", critical: true, detail: "Assess for wheezing, dyspnea, or bronchospasm — especially with non-selective beta blockers (propranolol) in patients with asthma/COPD." },
      { icon: "🍬", label: "Consider blood glucose in diabetics", critical: false, detail: "Beta blockers mask tachycardia of hypoglycemia (sweating still occurs). Diabetic patients need close glucose monitoring on beta blockers." },
      { icon: "⚠️", label: "Never hold abruptly without provider order", critical: true, detail: "If holding a dose, notify provider. Beta blockers must be tapered — abrupt discontinuation causes rebound tachycardia, hypertension, and can precipitate MI." },
    ]
  },
  {
    category: "ACE Inhibitors & ARBs",
    color: "#e05ca0",
    icon: "❤️",
    drugs: ["Lisinopril", "Enalapril", "Captopril", "Losartan", "Valsartan", "Irbesartan"],
    checks: [
      { icon: "📊", label: "Check blood pressure", critical: true, detail: "HOLD if systolic BP <90 mmHg. First-dose hypotension risk is highest — especially in volume-depleted, elderly, or high-dose diuretic patients." },
      { icon: "🧪", label: "Check serum potassium and creatinine", critical: true, detail: "ACE inhibitors/ARBs raise K⁺ and creatinine. Hold and notify if K⁺ >5.5 mEq/L or creatinine rises significantly (>30% from baseline)." },
      { icon: "🤰", label: "Confirm patient is NOT pregnant", critical: true, detail: "ABSOLUTELY CONTRAINDICATED in pregnancy (Category D/X). Can cause fetal renal failure, oligohydramnios, limb contractures, and death. Verify pregnancy status in women of childbearing age." },
      { icon: "😮", label: "Assess for angioedema symptoms", critical: true, detail: "Ask about: lip/tongue/throat swelling, difficulty swallowing, voice changes. Angioedema can occur at ANY time, even years after starting. If present — HOLD and call provider IMMEDIATELY." },
      { icon: "💊", label: "Check for concurrent K⁺-sparing medications", critical: false, detail: "Avoid combining with potassium-sparing diuretics (spironolactone) or K⁺ supplements without close monitoring — severe hyperkalemia risk." },
    ]
  },
  {
    category: "Diuretics — Loop",
    color: "#5cc4e0",
    icon: "💧",
    drugs: ["Furosemide (Lasix)", "Bumetanide (Bumex)", "Torsemide (Demadex)"],
    checks: [
      { icon: "📊", label: "Check blood pressure", critical: true, detail: "HOLD if systolic BP <90 mmHg. Loop diuretics can cause significant volume depletion and orthostatic hypotension." },
      { icon: "🧪", label: "Check electrolytes — especially K⁺", critical: true, detail: "Loop diuretics are potassium-WASTING. Check K⁺ before each dose. Hold if K⁺ <3.0 mEq/L and notify provider. May need supplementation." },
      { icon: "⚖️", label: "Check daily weight", critical: false, detail: "Daily weight is the most accurate fluid status monitor. 1 kg = ~1 liter fluid. Compare to previous day and document trend." },
      { icon: "🫘", label: "Assess urine output", critical: false, detail: "Document urine output. Adequate response: 0.5 mL/kg/hr. Notify provider if urine output <30 mL/hr after loop diuretic — may indicate renal failure." },
      { icon: "👂", label: "Ask about hearing changes", critical: false, detail: "Ototoxicity risk with high-dose IV furosemide. Ask about tinnitus, hearing loss, or dizziness. Risk increased with concurrent aminoglycosides or vancomycin." },
      { icon: "🩸", label: "Check BUN and creatinine", critical: false, detail: "Monitor for pre-renal azotemia from excessive diuresis. Rising BUN/Cr may indicate over-diuresis — notify provider." },
    ]
  },
  {
    category: "Antipsychotics",
    color: "#e0c05c",
    icon: "🧠",
    drugs: ["Haloperidol (Haldol)", "Olanzapine (Zyprexa)", "Quetiapine (Seroquel)", "Risperidone (Risperdal)"],
    checks: [
      { icon: "📊", label: "Check blood pressure (orthostatic)", critical: true, detail: "Antipsychotics cause orthostatic hypotension — especially with first doses or dose increases. Check lying and standing BP. High fall risk." },
      { icon: "⏱️", label: "Check ECG/QTc if ordered (especially IV haloperidol)", critical: true, detail: "QT prolongation risk — especially IV haloperidol. Hold if QTc >500ms and notify provider. Avoid other QT-prolonging drugs." },
      { icon: "🌡️", label: "Assess temperature and muscle rigidity", critical: true, detail: "NMS warning: hyperthermia + muscle rigidity + altered LOC = HOLD and emergency notification. NMS can be fatal if not caught early." },
      { icon: "🚶", label: "Assess for EPS symptoms", critical: false, detail: "Check for: new muscle stiffness, tremors, restlessness (akathisia), involuntary movements. Benztropine (Cogentin) treats acute EPS." },
      { icon: "💊", label: "Check concurrent CNS depressants", critical: false, detail: "Additive CNS depression with benzodiazepines, opioids, alcohol. Monitor sedation level carefully. Avoid IV haloperidol + IV lorazepam combination." },
    ]
  },
  {
    category: "Chemotherapy / High-Alert Drugs",
    color: "#e05c5c",
    icon: "⚠️",
    drugs: ["Methotrexate", "Cyclophosphamide", "Vincristine", "Cisplatin"],
    checks: [
      { icon: "📋", label: "Verify dosing schedule — WEEKLY not daily (MTX)", critical: true, detail: "Methotrexate for RA/psoriasis is WEEKLY. Daily = FATAL. Always verify frequency with original order, pharmacy, and a second nurse." },
      { icon: "🧪", label: "Check CBC — ANC, platelets, Hgb", critical: true, detail: "Hold if: ANC <1,000, platelets <50,000, or Hgb <8 g/dL (facility-specific). Chemotherapy during nadir = life-threatening infection risk." },
      { icon: "🫘", label: "Check renal and hepatic function", critical: true, detail: "Methotrexate, cisplatin: renal function. Methotrexate, cyclophosphamide: liver function. Impaired clearance → drug accumulation → toxicity." },
      { icon: "🔒", label: "Two-nurse independent double-check required", critical: true, detail: "Chemotherapy ALWAYS requires two independent RN verifications of: drug name, dose, route, rate, patient identity (2 identifiers), and cycle day." },
      { icon: "🤰", label: "Confirm pregnancy status and contraception", critical: true, detail: "Most chemotherapy agents are teratogenic (Category D or X). Verify pregnancy test negative. Confirm effective contraception for both male and female patients." },
      { icon: "🧤", label: "Use appropriate PPE for handling", critical: true, detail: "Hazardous drug precautions: chemotherapy gloves, gown, and eye protection when handling. Use closed-system transfer devices. Dispose in chemotherapy waste." },
    ]
  },
];

const TERATOGENIC_DRUGS = [
  {
    category: "Cardiovascular",
    color: "#e05ca0",
    icon: "❤️",
    drugs: [
      { name: "Warfarin (Coumadin)", risk: "Category X", trimester: "All trimesters", effects: "Warfarin embryopathy (nasal hypoplasia, stippled epiphyses) in 1st trimester; fetal hemorrhage (intracranial) in 2nd/3rd trimester; fetal/neonatal death", alternative: "Use LMWH (enoxaparin) throughout pregnancy — does not cross placenta", nclex: "Switch ALL women of childbearing age on warfarin to enoxaparin when pregnant" },
      { name: "ACE Inhibitors (-pril)", risk: "Category D/X", trimester: "2nd & 3rd trimester especially", effects: "Fetal renal tubular dysplasia, oligohydramnios, fetal renal failure, pulmonary hypoplasia, limb contractures, neonatal death", alternative: "Methyldopa or labetalol for HTN in pregnancy; nifedipine is also used", nclex: "Absolutely contraindicated. Stop immediately if pregnancy discovered. Check pregnancy status in all women of childbearing age." },
      { name: "ARBs (-sartan)", risk: "Category D/X", trimester: "2nd & 3rd trimester", effects: "Same as ACE inhibitors — fetal renal failure, oligohydramnios, fetal death. Both inhibit the RAAS system", alternative: "Methyldopa, labetalol, nifedipine", nclex: "Same contraindication as ACE inhibitors. RAAS inhibition = lethal to fetal kidneys in 2nd/3rd trimester." },
      { name: "Amiodarone (Cordarone)", risk: "Category D", trimester: "All trimesters", effects: "Neonatal hypothyroidism/hyperthyroidism (amiodarone is 37% iodine), bradycardia, growth restriction, neurotoxicity", alternative: "Use only if benefit outweighs risk and no alternatives exist", nclex: "Monitor neonate's thyroid function. Amiodarone's long half-life means fetal exposure continues after stopping." },
      { name: "Statins (-statin)", risk: "Category X", trimester: "All trimesters", effects: "Cholesterol is essential for fetal development; statins block cholesterol synthesis → skeletal malformations, CNS defects, fetal death", alternative: "Discontinue statins during pregnancy. Resume postpartum.", nclex: "STOP immediately when pregnancy is confirmed. Cholesterol is critical for fetal brain and cell membrane development." },
    ]
  },
  {
    category: "Antibiotics & Antivirals",
    color: "#7ec87e",
    icon: "🦠",
    drugs: [
      { name: "Tetracyclines (doxycycline, minocycline)", risk: "Category D", trimester: "2nd & 3rd trimester", effects: "Permanent discoloration of fetal teeth (yellow-brown staining), inhibition of fetal bone growth, hepatotoxicity in mother", alternative: "Azithromycin, erythromycin, amoxicillin for most infections in pregnancy", nclex: "Never use tetracyclines after 15 weeks gestation — teeth mineralization begins then." },
      { name: "Fluoroquinolones (ciprofloxacin, levofloxacin)", risk: "Category C", trimester: "All trimesters", effects: "Damage to fetal cartilage and joint development (same as pediatric concern); animal studies show musculoskeletal defects", alternative: "Safer antibiotics should be used; benefit must outweigh risk", nclex: "Avoid unless no alternative exists. Same cartilage concern as in children <18." },
      { name: "Metronidazole (Flagyl)", risk: "Category B (1st trimester caution)", trimester: "1st trimester avoid if possible", effects: "Possible increased risk of cleft palate and cardiac defects in 1st trimester animal studies (human data conflicting); generally considered safe in 2nd/3rd trimester", alternative: "Clindamycin for BV in 1st trimester; metronidazole used in 2nd/3rd trimester when needed", nclex: "Commonly used in pregnancy for BV/Trichomoniasis after 1st trimester. Not absolute contraindication." },
      { name: "Ribavirin", risk: "Category X", trimester: "All trimesters", effects: "Highly teratogenic and embryotoxic in ALL animal species studied. Causes facial/skeletal/GI malformations and fetal death at very low doses", alternative: "Absolutely contraindicated. Two forms of contraception required for female patients AND female partners of male patients during treatment and 6 months after", nclex: "Category X — TWO forms of contraception required. Monthly pregnancy tests during treatment." },
    ]
  },
  {
    category: "Psychiatric Medications",
    color: "#e0c05c",
    icon: "🧠",
    drugs: [
      { name: "Lithium (Eskalith)", risk: "Category D", trimester: "1st trimester especially", effects: "Ebstein's anomaly (tricuspid valve malformation) — 1st trimester exposure. Neonatal toxicity: hypotonia ('floppy baby'), bradycardia, cyanosis, diabetes insipidus", alternative: "Discuss risk/benefit carefully. Some women continue with close fetal monitoring. Lamotrigine may be an alternative for bipolar", nclex: "Ebstein's anomaly = key NCLEX fact for lithium. Monitor neonate for lithium toxicity at birth." },
      { name: "Valproic Acid (Depakote)", risk: "Category D/X", trimester: "1st trimester — neural tube closure (weeks 3-4)", effects: "Neural tube defects (spina bifida — 1–2%), craniofacial defects, cardiovascular malformations, cognitive impairment/autism spectrum disorder, fetal valproate syndrome", alternative: "Lamotrigine, levetiracetam (lower teratogenic risk). High-dose folic acid (4mg) before conception if valproic acid cannot be stopped", nclex: "One of the most teratogenic anticonvulsants. Neural tube closes at 28 days — before most women know they're pregnant. Folic acid is critical." },
      { name: "Benzodiazepines (diazepam, lorazepam, alprazolam)", risk: "Category D", trimester: "All trimesters; especially 1st and near delivery", effects: "Possible cleft palate (1st trimester). Neonatal withdrawal syndrome. Floppy infant syndrome (near delivery): hypotonia, apnea, hypothermia, poor feeding", alternative: "Taper gradually before conception when possible; if used near delivery, neonatology team should be notified", nclex: "Neonates of mothers on benzodiazepines need monitoring for withdrawal and respiratory depression at birth." },
      { name: "SSRIs (paroxetine especially)", risk: "Paroxetine: Category D. Others: Category C", trimester: "3rd trimester; paroxetine in 1st trimester", effects: "Paroxetine: cardiac septal defects (1st trimester). All SSRIs in 3rd trimester: Neonatal Abstinence Syndrome (NAS) — jitteriness, poor feeding, respiratory distress; persistent pulmonary hypertension of newborn (PPHN)", alternative: "Sertraline considered lowest risk SSRI in pregnancy. Weigh risks of untreated depression vs. medication exposure", nclex: "Paroxetine (Paxil) = most teratogenic SSRI. Do not use in 1st trimester. All SSRIs can cause NAS if used near delivery." },
    ]
  },
  {
    category: "Rheumatology / Immunology",
    color: "#d4a06a",
    icon: "🦴",
    drugs: [
      { name: "Methotrexate (MTX)", risk: "Category X", trimester: "All trimesters — avoid conception", effects: "Folic acid antagonist → neural tube defects, craniofacial abnormalities (methotrexate embryopathy), limb defects, spontaneous abortion, fetal death", alternative: "Discontinue at least 3 months before attempting conception (male AND female). Use hydroxychloroquine or sulfasalazine for RA in pregnancy", nclex: "Contraception required during therapy AND for 3 months after stopping. Leucovorin (folinic acid) is the antidote for overdose." },
      { name: "Leflunomide (Arava)", risk: "Category X", trimester: "All trimesters", effects: "Highly teratogenic — embryotoxic and teratogenic in animal studies at low doses. Very long half-life (up to 2 years in some patients)", alternative: "Drug elimination procedure (cholestyramine 8g TID × 11 days) required before pregnancy; verify plasma levels <0.02 mg/L with 2 tests 14 days apart", nclex: "Category X with extremely long half-life. Cholestyramine washout procedure is REQUIRED before pregnancy — unique NCLEX teaching point." },
      { name: "Thalidomide / Lenalidomide", risk: "Category X", trimester: "All trimesters", effects: "Thalidomide caused one of history's worst drug disasters — phocomelia (limb reduction defects), internal organ malformations. Zero tolerance for pregnancy exposure", alternative: "Absolutely contraindicated. Both drugs require REMS programs with mandatory pregnancy testing and contraception verification", nclex: "REMS program (Risk Evaluation and Mitigation Strategy) required. Two forms of contraception + monthly pregnancy testing mandatory." },
    ]
  },
  {
    category: "Isotretinoin & Dermatologics",
    color: "#5cc4e0",
    icon: "💊",
    drugs: [
      { name: "Isotretinoin (Accutane)", risk: "Category X", trimester: "All trimesters", effects: "Isotretinoin embryopathy: CNS malformations (hydrocephalus, microcephaly), craniofacial defects (cleft palate, microtia), cardiac defects, thymus abnormalities. 25–30× increased risk of spontaneous abortion", alternative: "Absolutely contraindicated. iPLEDGE program: 2 forms of contraception, monthly pregnancy tests, 30-day supply limits", nclex: "iPLEDGE REMS program — one of the most restrictive. Patient must have 2 negative pregnancy tests before starting and monthly thereafter." },
      { name: "Topical Retinoids (tretinoin, adapalene)", risk: "Category C", trimester: "Avoid in 1st trimester", effects: "Systemic absorption is minimal but not zero. Some studies suggest possible low risk of cardiac defects with significant systemic exposure. Avoid as precaution", alternative: "Azelaic acid and glycolic acid are considered safer alternatives in pregnancy for acne", nclex: "Generally avoided in pregnancy due to theoretical teratogenic risk. Topical tretinoin has much lower risk than oral isotretinoin." },
      { name: "Finasteride (Propecia/Proscar)", risk: "Category X", trimester: "All trimesters (for pregnant women)", effects: "5-alpha reductase inhibitor — blocks DHT synthesis critical for male fetal genitalia development. Exposure of pregnant women to crushed tablets or semen of treated men → male fetal genital abnormalities", alternative: "Pregnant women must NOT handle crushed or broken tablets. Use gloves if any contact.", nclex: "Pregnant women should not handle crushed finasteride tablets. Male partners on finasteride: condom use recommended." },
    ]
  },
  {
    category: "Anticonvulsants",
    color: "#e05c5c",
    icon: "⚡",
    drugs: [
      { name: "Phenytoin (Dilantin)", risk: "Category D", trimester: "1st trimester especially", effects: "Fetal hydantoin syndrome: craniofacial abnormalities, digital/nail hypoplasia, growth retardation, cognitive impairment. Neonatal bleeding (inhibits Vitamin K-dependent clotting factors)", alternative: "Lamotrigine, levetiracetam have lower teratogenic risk. High-dose folic acid supplementation (4mg/day) before conception", nclex: "Give Vitamin K to neonate at birth if mother was on phenytoin. Folic acid 4mg preconception is critical." },
      { name: "Carbamazepine (Tegretol)", risk: "Category D", trimester: "1st trimester", effects: "Neural tube defects (spina bifida — 0.5–1%), craniofacial defects, fingernail hypoplasia, developmental delay. Lower risk than valproic acid but still significant", alternative: "Lamotrigine or levetiracetam preferred in women of childbearing age when possible. Folic acid 4mg supplementation", nclex: "Neural tube defect risk — folic acid supplementation before and during pregnancy is essential." },
      { name: "Lamotrigine (Lamictal)", risk: "Category C", trimester: "1st trimester monitoring", effects: "Generally considered lower risk than other anticonvulsants. Some studies suggest possible increased oral cleft risk at higher doses. Levels decrease significantly during pregnancy — dose adjustments needed", alternative: "Often used as the preferred anticonvulsant in pregnant women with epilepsy or bipolar disorder", nclex: "Lamotrigine levels DROP dramatically in pregnancy due to increased hepatic metabolism — dose increases required. Monitor for breakthrough seizures." },
    ]
  },
];

function Safety() {
  const [activeSection, setActiveSection] = useState("preadmin");
  const [activeCat, setActiveCat] = useState(0);
  const [expandedCheck, setExpandedCheck] = useState(null);
  const [expandedDrug, setExpandedDrug] = useState(null);
  const [teraSearch, setTeraSearch] = useState("");

  const teraSearchActive = teraSearch.trim().length > 0;
  const teraResults = teraSearchActive
    ? TERATOGENIC_DRUGS.flatMap(c => c.drugs.map(d => ({ ...d, category: c.category, color: c.color, icon: c.icon })))
        .filter(d => d.name.toLowerCase().includes(teraSearch.toLowerCase()) || d.effects.toLowerCase().includes(teraSearch.toLowerCase()) || d.category.toLowerCase().includes(teraSearch.toLowerCase()))
    : [];

  const preAdminCat = PRE_ADMIN_DATA[activeCat];
  const teraCat = TERATOGENIC_DRUGS[activeCat < TERATOGENIC_DRUGS.length ? activeCat : 0];

  return (
    <div className="safety-tab">
      <div className="mnemonics-header">
        <h2 className="section-title">🛡️ Safety Reference</h2>
        <p className="section-sub">Pre-administration checklists & teratogenic drug guide</p>
      </div>

      {/* Section Toggle */}
      <div className="safety-toggle">
        <button
          className={"safety-toggle-btn" + (activeSection === "preadmin" ? " active" : "")}
          onClick={() => { setActiveSection("preadmin"); setActiveCat(0); setExpandedCheck(null); }}
        >
          ✅ Pre-Admin Checklists
        </button>
        <button
          className={"safety-toggle-btn" + (activeSection === "teratogenic" ? " active" : "")}
          onClick={() => { setActiveSection("teratogenic"); setActiveCat(0); setExpandedDrug(null); }}
        >
          🤰 Teratogenic Drugs
        </button>
      </div>

      {/* PRE-ADMIN SECTION */}
      {activeSection === "preadmin" && (
        <>
          <div className="mnemonic-cat-tabs">
            {PRE_ADMIN_DATA.map((c, i) => (
              <button key={i}
                className={"mnemonic-cat-btn" + (activeCat === i ? " active" : "")}
                style={{"--mcolor": c.color}}
                onClick={() => { setActiveCat(i); setExpandedCheck(null); }}>
                <span>{c.icon}</span><span>{c.category}</span>
              </button>
            ))}
          </div>

          <div className="preadmin-drug-list">
            {preAdminCat.drugs.map((d, i) => (
              <span key={i} className="preadmin-drug-tag" style={{background: preAdminCat.color + "22", color: preAdminCat.color, borderColor: preAdminCat.color + "55"}}>
                {d}
              </span>
            ))}
          </div>

          <div className="checklist">
            {preAdminCat.checks.map((check, i) => (
              <div key={i}
                className={"checklist-item" + (expandedCheck === i ? " expanded" : "") + (check.critical ? " critical" : "")}
                style={{"--ccolor": check.critical ? "#e05c5c" : preAdminCat.color}}
                onClick={() => setExpandedCheck(expandedCheck === i ? null : i)}>
                <div className="checklist-top">
                  <div className="checklist-left">
                    {check.critical && <span className="critical-badge">CRITICAL</span>}
                    <span className="check-icon">{check.icon}</span>
                    <span className="check-label">{check.label}</span>
                  </div>
                  <div className="mnemonic-expand">{expandedCheck === i ? "−" : "+"}</div>
                </div>
                {expandedCheck === i && (
                  <div className="check-detail">{check.detail}</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* TERATOGENIC SECTION */}
      {activeSection === "teratogenic" && (
        <>
          <div className="tera-warning">
            <span>⚠️</span>
            <p>These medications can cause birth defects, fetal injury, or death. Always verify pregnancy status in women of childbearing age before administering.</p>
          </div>

          <div className="search-wrap" style={{marginBottom:"1rem"}}>
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search drug name or effect..."
              value={teraSearch} onChange={e => { setTeraSearch(e.target.value); setExpandedDrug(null); }} />
            {teraSearch && <button className="search-clear" onClick={() => setTeraSearch("")}>✕</button>}
          </div>

          {!teraSearchActive && (
            <div className="mnemonic-cat-tabs">
              {TERATOGENIC_DRUGS.map((c, i) => (
                <button key={i}
                  className={"mnemonic-cat-btn" + (activeCat === i ? " active" : "")}
                  style={{"--mcolor": c.color}}
                  onClick={() => { setActiveCat(i); setExpandedDrug(null); }}>
                  <span>{c.icon}</span><span>{c.category}</span>
                </button>
              ))}
            </div>
          )}

          <div className="tera-list">
            {(teraSearchActive ? teraResults : teraCat.drugs).map((drug, i) => (
              <div key={i}
                className={"tera-card" + (expandedDrug === i ? " expanded" : "")}
                style={{"--tcolor": drug.color || teraCat.color}}
                onClick={() => setExpandedDrug(expandedDrug === i ? null : i)}>
                <div className="tera-top">
                  <div>
                    <div className="tera-name">{drug.name}</div>
                    <div className="tera-risk-row">
                      <span className="tera-risk-badge">{drug.risk}</span>
                      <span className="tera-trimester">⚠️ {drug.trimester}</span>
                    </div>
                  </div>
                  <div className="mnemonic-expand">{expandedDrug === i ? "−" : "+"}</div>
                </div>
                {expandedDrug === i && (
                  <div className="tera-detail">
                    <div className="tera-row">
                      <span className="tera-tag effects">🧬 Fetal Effects</span>
                      <p>{drug.effects}</p>
                    </div>
                    <div className="tera-row">
                      <span className="tera-tag alternative">✅ Alternative</span>
                      <p>{drug.alternative}</p>
                    </div>
                    <div className="tera-row">
                      <span className="tera-tag nclex">📝 NCLEX Pearl</span>
                      <p>{drug.nclex}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
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
  { id: "safety", label: "Safety", icon: "🛡️" },
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

        /* CLASS HEADER CARD */
        .class-header-card {
          background: var(--navy-mid);
          border: 1px solid var(--accent, var(--navy-border));
          border-top: 3px solid var(--accent, var(--gold));
          border-radius: 12px;
          padding: 1rem 1.1rem;
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .class-suffix-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .class-suffix-label {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-dimmer);
        }

        .class-suffix-badge {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.7rem;
          border-radius: 6px;
          border: 1px solid;
          letter-spacing: 0.04em;
        }

        .class-suffix-note {
          font-size: 0.78rem;
          line-height: 1.55;
          color: var(--text-dim);
          border-top: 1px solid var(--navy-border);
          padding-top: 0.6rem;
        }

        .class-key-drugs {
          border-top: 1px solid var(--navy-border);
          padding-top: 0.6rem;
        }

        .class-key-label {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-dimmer);
          margin-bottom: 0.4rem;
        }

        .class-key-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .class-key-drug {
          font-size: 0.7rem;
          font-weight: 500;
          padding: 0.2rem 0.55rem;
          border-radius: 100px;
          border: 1px solid;
        }

        .class-overview-section {
          border-top: 1px solid var(--navy-border);
          padding-top: 0.6rem;
        }

        .class-overview-text {
          font-size: 0.8rem;
          line-height: 1.6;
          color: var(--text);
          margin-top: 0.3rem;
        }

        .class-mnemonic-section {
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
          background: var(--gold)0d;
          border: 1px solid var(--gold)33;
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
        }

        .class-mnemonic-icon { font-size: 0.9rem; margin-top: 0.05rem; }

        .class-mnemonic-text {
          font-size: 0.78rem;
          line-height: 1.55;
          color: var(--gold);
          font-style: italic;
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

        .side-effects-block {
          background: var(--red)0d;
          border: 1px solid var(--red)33;
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

        /* SAFETY TAB */
        .safety-tab { padding: 0.25rem 0; }

        .safety-toggle {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          background: var(--navy-mid);
          border: 1px solid var(--navy-border);
          border-radius: 12px;
          padding: 0.35rem;
        }

        .safety-toggle-btn {
          flex: 1;
          padding: 0.6rem;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: var(--text-dim);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .safety-toggle-btn.active {
          background: var(--gold);
          color: var(--navy);
          font-weight: 700;
        }

        .preadmin-drug-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }

        .preadmin-drug-tag {
          font-size: 0.7rem;
          font-weight: 500;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          border: 1px solid;
        }

        .checklist {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .checklist-item {
          background: var(--navy-mid);
          border: 1px solid var(--navy-border);
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .checklist-item.critical {
          border-left: 3px solid var(--red);
        }

        .checklist-item.expanded {
          border-color: var(--ccolor);
        }

        .checklist-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 1rem;
          gap: 0.5rem;
        }

        .checklist-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .critical-badge {
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: var(--red)22;
          color: var(--red);
          border: 1px solid var(--red)44;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        .check-icon { font-size: 1rem; }

        .check-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--cream);
        }

        .check-detail {
          padding: 0 1rem 0.85rem;
          font-size: 0.8rem;
          line-height: 1.6;
          color: var(--text);
          border-top: 1px solid var(--navy-border);
          padding-top: 0.75rem;
        }

        /* TERATOGENIC */
        .tera-warning {
          display: flex;
          gap: 0.6rem;
          align-items: flex-start;
          background: var(--red)0d;
          border: 1px solid var(--red)33;
          border-left: 3px solid var(--red);
          border-radius: 0 10px 10px 0;
          padding: 0.85rem;
          margin-bottom: 1rem;
          font-size: 0.8rem;
          color: var(--text);
          line-height: 1.5;
        }

        .tera-warning span { font-size: 1.1rem; margin-top: 0.1rem; }

        .tera-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .tera-card {
          background: var(--navy-mid);
          border: 1px solid var(--navy-border);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .tera-card.expanded { border-color: var(--tcolor); }

        .tera-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 0.9rem 1rem;
        }

        .tera-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--cream);
          margin-bottom: 0.35rem;
        }

        .tera-risk-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tera-risk-badge {
          font-size: 0.62rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          background: var(--red)22;
          color: var(--red);
          border: 1px solid var(--red)44;
          letter-spacing: 0.05em;
        }

        .tera-trimester {
          font-size: 0.68rem;
          color: var(--text-dim);
        }

        .tera-detail {
          padding: 0 1rem 1rem;
          border-top: 1px solid var(--navy-border);
          padding-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .tera-row {
          display: flex;
          gap: 0.6rem;
          align-items: flex-start;
        }

        .tera-row p {
          font-size: 0.8rem;
          line-height: 1.55;
          color: var(--text);
        }

        .tera-tag {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          white-space: nowrap;
          margin-top: 0.1rem;
          text-transform: uppercase;
        }

        .tera-tag.effects { background: var(--red)22; color: var(--red); }
        .tera-tag.alternative { background: var(--green)22; color: var(--green); }
        .tera-tag.nclex { background: var(--gold)22; color: var(--gold); }

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
                className={"tab-btn" + (tab === t.id ? " active" : "")}
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
          {tab === "safety" && <Safety />}
          {tab === "progress" && <Progress />}
          {tab === "tutor" && <AITutor />}
        </main>
      </div>
    </>
  );
}
