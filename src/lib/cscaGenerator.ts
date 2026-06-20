import { CSCAQuestion } from "../types";

// Random integer helper [min, max]
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random choice helper
function randChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Shuffle helper
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generator Engine
export function generateCSCAQuestions(subject: "math" | "physics" | "chemistry" | "professional_chinese", limit: number = 20): CSCAQuestion[] {
  const questions: CSCAQuestion[] = [];
  
  const universities = [
    "Peking University", "Tsinghua University", "Zhejiang University", "Fudan University", 
    "Shanghai Jiao Tong University", "Nanjing University", "Wuhan University", "Sichuan University", 
    "Xi'an Jiaotong University", "Harbin Institute of Technology", "Xiamen University", "Tongji University", 
    "Southeast University", "Beihang University", "Nankai University", "Tianjin University",
    "Beijing Normal University", "Zhongshan University", "Huazhong University of Science and Technology",
    "Jilin University", "Sichuan University", "Shandong University5"
  ];

  const templatesCount = 10;
  
  for (let i = 0; i < limit; i++) {
    const qId = `csca-gen-${subject}-${String(i + 1).padStart(3, '0')}`;
    let questionText = "";
    let options: string[] = [];
    let correctOption: "A" | "B" | "C" | "D" = "A";
    let explanation = "";

    const uni = universities[i % universities.length];
    const prefix = subject === "math"
      ? `[CSCA Math Suite - Item ${i + 1} at ${uni}] `
      : subject === "physics"
      ? `[CSCA Physics Lab - Problem ${i + 1} certified by ${uni}] `
      : subject === "chemistry"
      ? `[CSCA Chemistry Lab - Exercise ${i + 1} formulated by ${uni}] `
      : `[CSCA Professional Chinese - Case ${i + 1} at ${uni}] `;

    // Choose template sequentially to guarantee even distribution of the 10 core syllabi across 250 items
    const template = (i % templatesCount) + 1;

    if (subject === "math") {
      // 10 math templates covering Sets, Inequalities, Quadratics, Trig, Geometry, Vectors, Probability, Limits
      switch (template) {
        case 1: { // Sets intersection & complements
          const a = randInt(2, 4);
          const b = randInt(6, 9);
          const val = a * b;
          questionText = `Let universal set U = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, set A = {${a}, ${b}, 5, 10}, and set B = {x ∈ U | x² - ${a+b}x + ${val} < 0}. Find the intersection of A and the complement of B relative to U, i.e., A ∩ (C_U B).`;
          // B corresponds to elements strictly between a and b.
          const inB = Array.from({length: 10}, (_, k) => k + 1).filter(x => x > a && x < b);
          const compB = Array.from({length: 10}, (_, k) => k + 1).filter(x => !inB.includes(x));
          const setA = [a, b, 5, 10];
          const intersection = setA.filter(x => compB.includes(x)).sort((x, y) => x - y);
          
          const ansString = `{${intersection.join(", ")}}`;
          const alt1 = `{${[a, b].join(", ")}}`;
          const alt2 = `{5, 10}`;
          const alt3 = `{1, 5, 10}`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `First, solve the quadratic inequality: x² - ${a+b}x + ${val} < 0 => (x - ${a})(x - ${b}) < 0 => ${a} < x < ${b}. Since x belongs to universal set U, B consists of elements strictly inside this interval. The complement C_U B has elements outside this interval. Intersecting with set A gives the final elements: ${ansString}.`;
          break;
        }
        case 2: { // Absolute value inequalities
          const mid = randInt(3, 8);
          const radius = randInt(4, 9);
          const maxVal = mid + radius;
          questionText = `Solve the absolute value inequality: |x - ${mid}| ≤ ${radius}. Determine the maximum integer value of x that satisfies this constraint.`;
          
          const ansString = `${maxVal}`;
          const alt1 = `${mid + radius - 1}`;
          const alt2 = `${mid + radius + 1}`;
          const alt3 = `${mid * radius}`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `Expanding the absolute value: -${radius} ≤ x - ${mid} ≤ ${radius}. Adding ${mid} to all sides gives: ${mid - radius} ≤ x ≤ ${mid + radius}. The maximum integer value in this interval is exactly ${mid + radius} = ${maxVal}.`;
          break;
        }
        case 3: { // Orthogonal vectors
          const u1 = randInt(2, 5);
          const u2 = randInt(3, 6);
          const dotTarget = u1 * u2;
          questionText = `Given two vectors in the Cartesian plane: u = ${u1}i + ${u2}j and v = mi - ${u1}j. If vector u and vector v are orthogonal, find the exact value of parameter m.`;
          
          const ansString = `${u1}`;
          const alt1 = `-${u1}`;
          const alt2 = `${u2}`;
          const alt3 = `0`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `For two vectors to be orthogonal, their dot product must equal zero: u · v = 0. Therefore, (${u1})(m) + (${u2})(-${u1}) = 0 => ${u1}m - ${u1 * u2} = 0 => m = ${u1}.`;
          break;
        }
        case 4: { // Trigonometric simplifications
          const angle = randChoice([15, 30, 45, 60]);
          questionText = `Evaluate the exact value of the trigonometric ratio: cos²(${angle}°) - sin²(${angle}°).`;
          
          let ansString = "";
          let explanationText = "";
          if (angle === 15) {
            ansString = "√3/2";
            explanationText = "Use the double angle formula: cos²(θ) - sin²(θ) = cos(2θ). For θ = 15°, cos(2 * 15°) = cos(30°) = √3/2.";
          } else if (angle === 30) {
            ansString = "1/2";
            explanationText = "Use the double angle formula: cos²(θ) - sin²(θ) = cos(2θ). For θ = 30°, cos(2 * 30°) = cos(60°) = 1/2.";
          } else if (angle === 45) {
            ansString = "0";
            explanationText = "Since cos(45°) = sin(45°) = √2/2, their squares are identical, making the subtraction result exactly 0.";
          } else {
            ansString = "-1/2";
            explanationText = "Use the double angle formula: cos²(θ) - sin²(θ) = cos(2θ). For θ = 60°, cos(120°) = -1/2.";
          }
          
          const opts = shuffleArray([ansString, "√2/2", "1", "-√3/2"].filter(x => x !== ansString).slice(0, 3).concat(ansString));
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = explanationText;
          break;
        }
        case 5: { // Ellipse focal coordinates
          const focalC = randInt(2, 5);
          const semiA = focalC + randInt(1, 3);
          const ecc = (focalC / semiA).toFixed(3);
          questionText = `In analytical geometry, an ellipse centered at the origin exhibits semi-major axis a = ${semiA} and eccentricity e = ${ecc}. Calculate its focal coordinate distance c.`;
          
          const ansString = `${focalC}`;
          const alt1 = `${semiA - 1}`;
          const alt2 = `${semiA + 1}`;
          const alt3 = `${(semiA * focalC).toFixed(1)}`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `By definition of ellipse parameters, the focal distance from the center is c = a * e. Substituting values: c = ${semiA} * ${ecc} ≈ ${focalC}.`;
          break;
        }
        case 6: { // Logarithmic domain
          const offset = randInt(2, 6);
          questionText = `Find the logical domain of definition of the real-valued logarithmic function: f(x) = ln(x - ${offset}) + √( ${offset + 5} - x ).`;
          
          const ansString = `(${offset}, ${offset + 5}]`;
          const alt1 = `[${offset}, ${offset + 5}]`;
          const alt2 = `(${offset}, ∞)`;
          const alt3 = `[1, ${offset + 5}]`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `For the natural log log(x - ${offset}) to exist, we need x - ${offset} > 0 => x > ${offset}. For the radical to be defined over real numbers, we require ${offset + 5} - x ≥ 0 => x ≤ ${offset + 5}. Combining both clauses: ${offset} < x ≤ ${offset + 5}, which is written in interval notation as (${offset}, ${offset + 5}].`;
          break;
        }
        case 7: { // Probability of independence
          const pA = 0.1 * randInt(5, 8);
          const pB = 0.5;
          const probNoOffer = ((1 - pA) * (1 - pB)).toFixed(2);
          const finalProb = (1 - Number(probNoOffer)).toFixed(2);
          questionText = `An international applicant applies to two Chinese universities. The independent admission acceptance probabilities are ${pA} and ${pB} respectively. What is the mathematical probability that the applicant secures AT LEAST ONE offer?`;
          
          const ansString = `${finalProb}`;
          const alt1 = `${(pA * pB).toFixed(2)}`;
          const alt2 = `${pA}`;
          const alt3 = `0.35`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `The probability of obtaining at least one offer is 1 minus the probability of total rejection. P(total rejection) = (1 - ${pA}) * (1 - ${pB}) = ${(1 - pA).toFixed(1)} * 0.5 = ${probNoOffer}. Thus, P(at least one) = 1 - ${probNoOffer} = ${finalProb}.`;
          break;
        }
        case 8: { // Geometric progression
          const first = randInt(2, 5);
          const ratio = randChoice([2, 3]);
          const termIdx = 4;
          const val = first * Math.pow(ratio, termIdx - 1);
          questionText = `In a geometric progression sequence, the first term a_1 = ${first} and the common ratio r = ${ratio}. Calculate the value of the 4th term (a_4) in this sequence.`;
          
          const ansString = `${val}`;
          const alt1 = `${first + 3 * ratio}`;
          const alt2 = `${first * ratio * ratio}`;
          const alt3 = `${first * 3}`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `The general formula for the n-th term of a geometric Progression is a_n = a_1 * r^(n-1). For the 4th term: a_4 = ${first} * ${ratio}^3 = ${first} * ${ratio * ratio * ratio} = ${val}.`;
          break;
        }
        case 9: { // Completing circle square
          const h = randInt(2, 5);
          const k = randInt(3, 6);
          const r = randChoice([2, 3, 4, 5]);
          const linX = -2 * h;
          const linY = -2 * k;
          const constTerm = h*h + k*k - r*r;
          questionText = `A circle in analytical coordinates has equation: x² + y² + (${linX})x + (${linY})y + ${constTerm} = 0. Find its radius.`;
          
          const ansString = `${r}`;
          const alt1 = `${r + 2}`;
          const alt2 = `${r * r}`;
          const alt3 = `${h}`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `Complete the squares: (x - ${h})² + (y - ${k})² = ${h*h} + ${k*k} - ${constTerm} = ${r*r}. Comparing to standard form, R² = ${r*r}, yielding radius R = ${r}.`;
          break;
        }
        default: { // Derivatives
          const coeff = randInt(2, 6);
          const pow = randChoice([2, 3]);
          questionText = `Find the first derivative (dy/dx) of the function y = ${coeff}x^${pow} - 7x at x = 2.`;
          
          const val = coeff * pow * Math.pow(2, pow - 1) - 7;
          const ansString = `${val}`;
          const alt1 = `${coeff * Math.pow(2, pow) - 14}`;
          const alt2 = `${coeff * pow * Math.pow(2, pow - 1)}`;
          const alt3 = `10`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `The derivative function is dy/dx = ${coeff * pow}x^${pow - 1} - 7. Substituting x = 2: dy/dx = ${coeff * pow} * ${Math.pow(2, pow - 1)} - 7 = ${val}.`;
          break;
        }
      }
    } else if (subject === "physics") {
      // 10 Physics templates: Speed, Projectiles, Gravity, Ideal Gas, Resistors, Coulomb, Optics, Photoelectric, Decays
      switch (template) {
        case 1: { // Kinematics d = vt + 0.5 at^2
          const acc = randChoice([2, 4, 6]);
          const sec = randInt(3, 5);
          const dist = 0.5 * acc * sec * sec;
          questionText = `An electric vehicle starts from rest at a Chinese logistics terminal and accelerates uniformly at ${acc} m/s² along a straight line. Calculate the total distance covered within ${sec} seconds.`;
          
          const ansString = `${dist} meters`;
          const alt1 = `${acc * sec} meters`;
          const alt2 = `${acc * sec * sec} meters`;
          const alt3 = `${0.5 * acc * sec} meters`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `Using the kinematic displacement equation starting from rest (u=0): s = ut + 0.5 * a * t² = 0 + 0.5 * (${acc}) * (${sec})² = 0.5 * ${acc} * ${sec * sec} = ${dist} meters.`;
          break;
        }
        case 2: { // Ideal Gas Law P1V1 = P2V2
          const v1 = randChoice([10, 20, 30]);
          const p1 = randChoice([100, 200]);
          const v2 = v1 / 2;
          const p2 = p1 * 2;
          questionText = `An isolated sample of ideal oxygen gas inside a petrochemical autoclave occupies ${v1} Liters at local pressure ${p1} kPa. If the volume is compressed isothermally to ${v2} Liters, calculate the resulting pressure.`;
          
          const ansString = `${p2} kPa`;
          const alt1 = `${p1 / 2} kPa`;
          const alt2 = `${p1} kPa`;
          const alt3 = `${p1 + v1} kPa`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `Under isothermal conditions, Boyle's Law applies: P_1 * V_1 = P_2 * V_2. Hence, P_2 = (P_1 * V_1) / V_2. Substituting values: P_2 = (${p1} * ${v1}) / ${v2} = ${p2} kPa.`;
          break;
        }
        case 3: { // Circuits (Ohm's Law resistors parallel)
          const r1 = randChoice([6, 12, 18]);
          const r2 = r1 === 6 ? 12 : 6;
          const eq = ((r1 * r2) / (r1 + r2)).toFixed(1);
          questionText = `Two resistor units with resistances R_1 = ${r1} Ω and R_2 = ${r2} Ω are connected in a parallel cluster layout. Compute the equivalent resistance of this parallel circuit.`;
          
          const ansString = `${eq} Ω`;
          const alt1 = `${r1 + r2} Ω`;
          const alt2 = `${Math.abs(r1 - r2)} Ω`;
          const alt3 = `${(r1 * r2).toFixed(1)} Ω`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `For parallel resistors, the equivalent resistance is computed using the reciprocal summation formula: 1 / R_eq = 1 / R_1 + 1 / R_2 => R_eq = (R_1 * R_2) / (R_1 + R_2). Substituting values: (${r1} * ${r2}) / (${r1} + ${r2}) = ${eq} Ω.`;
          break;
        }
        case 4: { // Refraction index & Snell's Law
          const angleI = 30;
          const indexG = 1.5;
          // sin(r) = sin(30)/1.5 = 0.5 / 1.5 = 1/3. r = arcsin(1/3) = 19.47 degrees
          questionText = `A light wave enters a sleek glass screen at an angle of incidence of 30° from the air. If the refractive index of the glass is ${indexG}, calculate the sine of the angle of refraction (sin r).`;
          
          const ansString = `0.33`;
          const alt1 = `0.50`;
          const alt2 = `0.75`;
          const alt3 = `0.22`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `Applying Snell's Law: n_1 * sin(θ_1) = n_2 * sin(θ_2). Since n_1 (air) ≈ 1, we get 1 * sin(30°) = ${indexG} * sin(r) => 0.5 = 1.5 * sin(r) => sin(r) = 0.5 / 1.5 = 1/3 ≈ 0.33.`;
          break;
        }
        case 5: { // Coulomb's law force
          const distFact = randChoice([2, 3]);
          const forceFact = distFact * distFact;
          questionText = `According to Coulomb's Law, two standard static electric charges express a repelling force F. If the separating distance between the charges is multiplied by ${distFact}, determine the new resulting electrostatic force.`;
          
          const ansString = `F / ${forceFact}`;
          const alt1 = `${distFact} * F`;
          const alt2 = `${forceFact} * F`;
          const alt3 = `F / ${distFact}`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `Coulomb's Law shows that force is inversely proportional to the square of distance (F ∝ 1/d²). If the distance is multiplied by ${distFact}, the force drops by a factor of ${distFact}² = ${forceFact}, leading to F / ${forceFact}.`;
          break;
        }
        case 6: { // Thermodynamics Efficiency
          const hotK = randChoice([600, 800, 1000]);
          const coldK = randChoice([300, 400]);
          const eff = Math.round((1 - coldK / hotK) * 100);
          questionText = `A thermodynamic heat generator operates based on a Carnot cycle between a heat reservoir at T_H = ${hotK} K and a coolant sink at T_C = ${coldK} K. Calculate its maximum thermal efficiency percent.`;
          
          const ansString = `${eff}%`;
          const alt1 = `${100 - eff}%`;
          const alt2 = `50%`;
          const alt3 = `${Math.round(coldK / hotK * 100)}%`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `The Carnot engine efficiency limit is calculated as η = 1 - T_C / T_H. Substituting our temperature nodes: η = 1 - ${coldK} / ${hotK} = 1 - ${(coldK / hotK).toFixed(3)} = ${(1 - coldK / hotK).toFixed(3)} representing ${eff}%.`;
          break;
        }
        case 7: { // Half-life decay
          const halfLife = randChoice([10, 24, 50]);
          const totalTime = halfLife * 3;
          questionText = `A radioactive isotope holds a stable half-life duration of ${halfLife} years. What fraction ratio of the original isotope counts remains active after ${totalTime} years of decay?`;
          
          const ansString = `1/8`;
          const alt1 = `1/4`;
          const alt2 = `1/16`;
          const alt3 = `1/3`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `The number of half-life cycles completed is n = total time / half life = ${totalTime} / ${halfLife} = 3 cycles. The remaining active proportion is calculated as (1/2)^n = (1/2)³ = 1/8.`;
          break;
        }
        case 8: { // Wave equation v = f * lambda
          const freq = randChoice([100, 500, 1000]);
          const speed = 340;
          const wl = (speed / freq).toFixed(3);
          questionText = `A sound wave travels through local standard air conditions at speed v = ${speed} m/s with single frequency f = ${freq} Hz. Calculate the sound wave's wavelength (λ).`;
          
          const ansString = `${wl} meters`;
          const alt1 = `${(freq / speed).toFixed(2)} meters`;
          const alt2 = `${(speed * freq).toFixed(0)} meters`;
          const alt3 = `1.5 meters`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `Applying the fundamental wave equation velocity: v = f * λ => λ = v / f. Substituting our values: λ = ${speed} / ${freq} = ${wl} meters.`;
          break;
        }
        case 9: { // Einstein Photoelectric work function
          const wf = 2.0; // eV
          const hf = 3.5; // eV
          const ke = hf - wf;
          questionText = `A metal sheet holds a clean electron work function threshold (Φ) of ${wf} eV. If monochromatic photons with energy hf = ${hf} eV impact the surface, compute the maximum kinetic energy (KE_max) of ejected photoelectrons.`;
          
          const ansString = `${ke} eV`;
          const alt1 = `${wf + hf} eV`;
          const alt2 = `${wf} eV`;
          const alt3 = `0.5 eV`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `Einstein's Photoelectric equation states: KE_max = hf - Φ. Substituting the values: KE_max = ${hf} eV - ${wf} eV = ${ke} eV.`;
          break;
        }
        default: { // Forces F = ma with friction
          const mass = randInt(2, 6);
          const force = randInt(15, 25);
          const fric = randInt(2, 5);
          const acc = ((force - fric) / mass).toFixed(2);
          questionText = `A solid block of mass m = ${mass} kg is pulled horizontally along a rough test track with pulling force F = ${force} N. If a constant resisting sliding friction force of F_f = ${fric} N opposes motion, calculate the acceleration of the block.`;
          
          const ansString = `${acc} m/s²`;
          const alt1 = `${(force / mass).toFixed(2)} m/s²`;
          const alt2 = `3.0 m/s²`;
          const alt3 = `${((force + fric)/mass).toFixed(2)} m/s²`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `Using Newton's Second Law for net forces: F_net = F_pull - F_friction = m * a => ${force} - ${fric} = ${mass} * a => ${force - fric} = ${mass} * a => a = ${force - fric} / ${mass} = ${acc} m/s².`;
          break;
        }
      }
    } else if (subject === "chemistry") {
      // 10 Chemistry templates: Atoms, Stoichiometry, Gases, Equilibriums, Redox, Spontaneity, Bonding, Organics
      switch (template) {
        case 1: { // Stoichiometry mass to moles
          const mass = randChoice([12, 24, 36]);
          const atomicMass = 12; // Carbon
          const moles = mass / atomicMass;
          questionText = `A trade carbon raw batch weighs ${mass} grams. Calculate the precise mole amount of elemental Carbon (atomic mass = 12 g/mol) present in this sample.`;
          
          const ansString = `${moles} mol`;
          const alt1 = `${mass * atomicMass} mol`;
          const alt2 = `1.0 mol`;
          const alt3 = `${(mass / 14).toFixed(1)} mol`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `Number of moles = Mass (g) / Molar Mass (g/mol). Substituting: moles = ${mass} / ${atomicMass} = ${moles} mol.`;
          break;
        }
        case 2: { // Le Chatelier shifts
          questionText = `For the exothermic gaseous equilibrium process: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + Heat (ΔH < 0). According to Le Chatelier's Principle, which of the following actions will shift equilibrium position to the RIGHT?`;
          
          const ansString = "Lowering the system temperature";
          const alt1 = "Decreasing total system pressure";
          const alt2 = "Removing hydrogen gas reactant";
          const alt3 = "Adding a high efficiency catalyst";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `Since heat is written as a product (exothermic reaction), lowering the temperature makes the process shift right to generate more heat. Adding pressure also shifts it right (from 4 gas moles to 2 gas moles), while a catalyst accelerates rate but never shifts equilibrium.`;
          break;
        }
        case 3: { // Redox Oxidation Numbers
          const index = randChoice([4, 7]);
          const polyName = index === 7 ? "Permanganate ion (MnO₄⁻)" : "Sulfate ion (SO₄²⁻)";
          const ans = index === 7 ? "+7" : "+6";
          questionText = `Evaluate the exact oxidation status number of the central metal atom inside the ${polyName} polyatomic group.`;
          
          const ansString = ans;
          const alt1 = "+4";
          const alt2 = "+2";
          const alt3 = "+8";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = index === 7 
            ? `In MnO₄⁻, let x be Manganese oxidation state. Oxygen has state -2. Net sum: x + 4(-2) = -1 => x - 8 = -1 => x = +7.`
            : `In SO₄²⁻, let x be Sulfur oxidation state. Oxygen has state -2. Net sum: x + 4(-2) = -2 => x - 8 = -2 => x = +6.`;
          break;
        }
        case 4: { // Spontaneity Gibbs free energy
          questionText = `A chemical reaction produces an enthalpy change ΔH = -80 kJ/mol (exothermic) and an entropy change ΔS = +100 J/(mol·K) (favorable dispersal). Under what temperature ranges is this process spontaneous?`;
          
          const ansString = "Spontaneous at all temperature ranges";
          const alt1 = "Spontaneous only at extremely high temperatures";
          const alt2 = "Spontaneous only at extremely low temperatures";
          const alt3 = "Completely non-spontaneous at all temperatures";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `Gibbs Spontaneity criteria is ΔG = ΔH - TΔS. Since ΔH is negative and -TΔS remains negative (due to positive ΔS and T being absolute Kelvin), ΔG is negative at all temperatures. Hence, it is spontaneous under all configurations.`;
          break;
        }
        case 5: { // Periodic trends Electronegativity
          questionText = `According to standard trends across the Modern Periodic Table of Elements, which of the following options defines the direction of INCREASING Electronegativity values?`;
          
          const ansString = "From bottom-left to top-right";
          const alt1 = "From top-right to bottom-left";
          const alt2 = "Vertically down within any group columns";
          const alt3 = "Horizontally left across any period rows";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `Electronegativity values increase across a period row from left to right (as nuclear charge increases) and up a group column (as inner shielding decreases), moving from bottom-left to top-right (Fluorine holds highest index).`;
          break;
        }
        case 6: { // Organic functional groups
          questionText = `An organic trade cargo contains a highly fragrant liquid compound composed of the functional group formulation -COO-. Identify the homologous family classification of this compound.`;
          
          const ansString = "Ester";
          const alt1 = "Ether";
          const alt2 = "Ketone";
          const alt3 = "Carboxylic Acid";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `The functional group -COO- consists of a carbonyl carbon bonded to an alkoxy oxygen, which defines the Ester family (commonly known for pleasant fruity fragrances).`;
          break;
        }
        case 7: { // VSEPR shapes
          const hybrid = "CO₂";
          questionText = `Based on Valence Shell Electron Pair Repulsion (VSEPR) molecular theory, evaluate the precise spatial geometric layout of a Carbon Dioxide (${hybrid}) molecule.`;
          
          const ansString = "Linear";
          const alt1 = "Bent / V-shaped";
          const alt2 = "Trigonal Planar";
          const alt3 = "Tetrahedral";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `The central Carbon in CO₂ has two bonding regions (double bonds to Oxygen atoms) and zero lone pairs. This produces an sp-hybridized orbital layout, forcing a 180° angle which is structural Linear.`;
          break;
        }
        case 8: { // pH calculation of strong acid
          const conc = randChoice([1, 2, 3]);
          const molarity = `1.0 x 10^-${conc}`;
          questionText = `Calculate the pH level of a strong Monoprotic hydrochloric acid (HCl) solution holding an active H⁺ molar concentration of ${molarity} M.`;
          
          const ansString = `${conc}.0`;
          const alt1 = `${7 - conc}.0`;
          const alt2 = `${14 - conc}.0`;
          const alt3 = "1.0";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `The pH formula for strong fully dissociating acids is pH = -log_10[H⁺]. Substituting the value log_10(10^-${conc}) = -${conc}, hence pH = -(-${conc}) = ${conc}.0.`;
          break;
        }
        case 9: { // Chemical bonding properties
          questionText = `A mysterious procurement material has a high melting point, is soluble in water, and conducts electric currents only when dissolved or in molten liquid states. Identify its crystal unit grid class.`;
          
          const ansString = "Ionic Crystal lattice";
          const alt1 = "Metallic Solid structure";
          const alt2 = "Covalent Network compound";
          const alt3 = "Molecular Solid arrangement";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `Ionic crystals rely on strong electrostatic locks, giving high melting points. They are insulators as dry crystals but unlock sliding mobile electron ions when dissolved in water or melted, conducting electricity.`;
          break;
        }
        default: { // Stoichiometry ideal gas volume
          const moles = randInt(2, 4);
          const vol = (moles * 22.4).toFixed(1);
          questionText = `Calculate the standard gaseous volume in liters occupied by ${moles} moles of nitrogen gas under standard temperature and pressure (STP, molar volume = 22.4 L/mol).`;
          
          const ansString = `${vol} L`;
          const alt1 = `${(moles * 24.0).toFixed(1)} L`;
          const alt2 = `22.4 L`;
          const alt3 = `${(moles * 11.2).toFixed(1)} L`;
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `Applying standard molar volumes: Volume = moles * 22.4 Liters/mole. Substituting: Volume = ${moles} * 22.4 = ${vol} Liters.`;
          break;
        }
      }
    } else {
      // Professional Chinese language templates (10 covering grammar, trade, shipping, payments, negotiations)
      switch (template) {
        case 1: { // Grammar conjunctions
          questionText = `Complete the commercial Putonghua sentence using the correct corresponding business conjunction: "虽然工厂价格优惠，____ 我们仍然需要审核产品质量规格。" (Although the factory price is favorable, ____ we still need to audit product quality specifications.)`;
          
          const ansString = "但是 (dànshì) - but/however";
          const alt1 = "所以 (suǒyǐ) - therefore";
          const alt2 = "而且 (érqiě) - furthermore";
          const alt3 = "因为 (yīnwèi) - because";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `The sentence utilizes the contradictory clause prefix 虽然 (although), which must be paired with the transition adverb/conjunction 但是 (but/however) to complete the logical loop.`;
          break;
        }
        case 2: { // Logistics container terms
          questionText = `An importer wants to ship a partial volume of commodities that doesn't fill a full shipping container. Identify the correct Chinese logistics term for "Less than Container Load (LCL)" or "consolidating container cargo".`;
          
          const ansString = "拼箱 (pīnxiāng)";
          const alt1 = "整箱 (zhěngxiāng) - FCL";
          const alt2 = "空运 (kōngyùn) - Air freight";
          const alt3 = "提单 (tídān) - Bill of Lading";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `In Chinese freight terminology, 拼箱 (pīnxiāng) represents Less than Container Load (LCL / splitting or combining boxes), while 整箱 (zhěngxiāng) represents Full Container Load (FCL).`;
          break;
        }
        case 3: { // Payment methods
          questionText = `Which of the following terms depicts the secure financial payment framework known in cross-border trade as telegraphic bank transfer wire?`;
          
          const ansString = "电汇 (diànhuì) - T/T";
          const alt1 = "信用证 (xìnyòngzhèng) - L/C";
          const alt2 = "支付宝 (zhīfùbǎo) - Alipay";
          const alt3 = "现金 (xiànjīn) - Cash";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `电汇 (diànhuì) means Telegraphic Transfer (popularly called T/T in global logistics). 信用证 (xìnyòngzhèng) means Letter of Credit.`;
          break;
        }
        case 4: { // OEM mold term
          questionText = `An importer wants to adjust the shape of a custom-molded plastic phone casing at the factory in Shenzhen. What is the precise Chinese manufacturing word for "Industrial Mold" / "Tooling template"?`;
          
          const ansString = "模具 (mújù)";
          const alt1 = "样品 (yàngpǐn) - Sample";
          const alt2 = "包装 (bāozhuāng) - Packaging";
          const alt3 = "发票 (fāpiào) - Invoice";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `模具 (mújù) is the technical term for molds, tooling, or casting templates used on plastic injection production lines.`;
          break;
        }
        case 5: { // Quality control terms
          questionText = `Translate the essential quality assurance check phrase used during factory visits prior to loading cargoes: "产品质量检验合格" (The product quality inspection is certified/passed).`;
          
          const ansString = "The product quality inspection meets standards / passed";
          const alt1 = "The product has functional damages and fails";
          const alt2 = "The package boxes have incorrect logo designs";
          const alt3 = "The container has left the loading terminal port";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `产品质量 (Product quality) 检验 (Inspection) 合格 (Qualified / Passed). This matches the certification checklist required to release container payments.`;
          break;
        }
        case 6: { // Customs clearances
          questionText = `What is the accurate Chinese word for the customs declaration paperwork and clearance procedures at ports: "报关" (bàoguān)?`;
          
          const ansString = "Customs Declaration / Clearance filing";
          const alt1 = "Container Loading operation";
          const alt2 = "Maritime Insurance purchase";
          const alt3 = "Freight Cargo inventory count";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `报 (to report/declare) 关 (customs gate). Therefore, 报关 (bàoguān) represents filing official customs declarations for clearance.`;
          break;
        }
        case 7: { // Unit of measure containers
          questionText = `Translate the essential purchase order unit of measure: "个 (gè)" and "套 (tào)" which correspond to:`;
          
          const ansString = "Individual Unit piece and Complete Assembly Set";
          const alt1 = "Metric Ton and Shipping Container Box";
          const alt2 = "Kilogram weight and Cubic Meter volume";
          const alt3 = "Color spectrum tint and Outer Box package";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `个 (gè) is the generic measure word used for individual widgets/items, while 套 (tào) is the specialized measure word for composite sets or systematic assemblies.`;
          break;
        }
        case 8: { // Bulk discount vocabulary
          questionText = `During a bargaining call with a supplier, you ask: "如果我订购五千套，可以打折吗？" Translate this importer statement.`;
          
          const ansString = "If I order 5,000 sets, can we get a discount?";
          const alt1 = "Can we ship 5,000 units by air tomorrow?";
          const alt2 = "If I wire the balance today, will you pack the items?";
          const alt3 = "We reject the sample due to 5,000 defective parts.";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `如果 (If) 我订购 (I order) 五千 (5,000) 套 (sets), 可以 (can we) 打折 (obtain a discount) 吗 (question indicator)? This translates directly to the offer request.`;
          break;
        }
        case 9: { // Bill of Lading (提单)
          questionText = `Identify the critical maritime freight shipping certificate required to claim ownership of arriving container cargo, known in Standard Chinese cargo practices as "提单" (tídān).`;
          
          const ansString = "Bill of Lading";
          const alt1 = "Commercial Invoice";
          const alt2 = "Packing List certificate";
          const alt3 = "Certificate of Made-in-China Origin";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `提单 (tídān) represents the Bill of Lading (B/L) issued by maritime shipping carriers to prove receipt of cargo for delivery.`;
          break;
        }
        default: { // HSK-style reading comprehension logical link
          questionText = `Select the appropriate transitional word to represent cohesive business communications: "我们在广东设立了分公司，____ 可以更快速地相应非洲客户。" (We set up a branch in Guangdong, ____ can more rapidly respond to African customers.)`;
          
          const ansString = "从而 (cóng'ér) - thereby/thus";
          const alt1 = "难道 (nándào) - rhetorical expression";
          const alt2 = "虽然 (suīrán) - although";
          const alt3 = "除非 (chúfēi) - unless only if";
          
          const opts = shuffleArray([ansString, alt1, alt2, alt3]);
          options = opts.map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`);
          const correctIdx = opts.indexOf(ansString);
          correctOption = String.fromCharCode(65 + correctIdx) as any;
          explanation = `The cause and effect sequence utilizes 从而 (cóng'ér - thereby / thus / as a direct result of setting up the division) to bridge the action and its structural operational outcome.`;
          break;
        }
      }
    }

    questions.push({
      questionId: qId,
      subject,
      medium: subject === "professional_chinese" ? "chinese" : "english",
      questionText: prefix + questionText,
      options,
      correctOption,
      explanation
    });
  }

  return questions;
}
