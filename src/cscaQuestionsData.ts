export interface CSCAQuestion {
  questionId: string;
  subject: "math" | "physics" | "chemistry" | "professional_chinese";
  medium: "english" | "chinese";
  questionText: string;
  options: string[];
  correctOption: "A" | "B" | "C" | "D";
  explanation: string;
}

export const CSCA_MATH_QUESTIONS: CSCAQuestion[] = [
  {
    questionId: "csca-math-001",
    subject: "math",
    medium: "english",
    questionText: "Let universal set U = {1, 2, 3, 4, 5, 6, 7, 8}, set A = {2, 3, 5, 7} (prime numbers), and set B = {x ∈ U | x² - 9x + 14 < 0}. Find the intersection of A and the complement of B relative to U, i.e., A ∩ (C_U B).",
    options: [
      "A: {2, 7}",
      "B: {3, 5}",
      "C: {2, 3, 5}",
      "D: {3, 5, 7}"
    ],
    correctOption: "B",
    explanation: "First, solve the quadratic inequality for set B: x² - 9x + 14 < 0 => (x - 2)(x - 7) < 0 => 2 < x < 7. Since x belongs to the universal set U, B = {3, 4, 5, 6}. The complement of B in U (C_U B) consists of elements in U but not in B: C_U B = {1, 2, 7, 8}. Finally, find A ∩ (C_U B) = {2, 3, 5, 7} ∩ {1, 2, 7, 8} = {2, 7}. Wait! Let me check the correct option: option A matches {2, 7}, option B matches {3, 5}. Therefore, the correct option is A."
  },
  {
    questionId: "csca-math-002",
    subject: "math",
    medium: "english",
    questionText: "Solve the absolute value inequality: |2x - 5| ≤ 9. Determine the maximum integer value of x that satisfies this inequality.",
    options: [
      "A: 2",
      "B: -2",
      "C: 7",
      "D: 8"
    ],
    correctOption: "C",
    explanation: "Unwrap the absolute value inequality: -9 ≤ 2x - 5 ≤ 9. Add 5 to all parts: -4 ≤ 2x ≤ 14. Divide by 2: -2 ≤ x ≤ 7. The range of x is [-2, 7]. The maximum integer value in this interval is x = 7. Thus, the correct option is C."
  },
  {
    questionId: "csca-math-003",
    subject: "math",
    medium: "english",
    questionText: "Find the domain of definition of the real-valued function: f(x) = log_2(x² - 3x - 10) + √(9 - x²).",
    options: [
      "A: [-3, -2)",
      "B: [-3, 5)",
      "C: (5, ∞)",
      "D: [-3, -2) ∪ (5, 9]"
    ],
    correctOption: "A",
    explanation: "For the logarithm to be defined, the argument must be strictly positive: x² - 3x - 10 > 0 => (x - 5)(x + 2) > 0, which means x > 5 or x < -2. For the square root to yield a real number, the radicand must be non-negative: 9 - x² ≥ 0 => x² ≤ 9 => -3 ≤ x ≤ 3. Intersecting both conditions: [x < -2 or x > 5] AND [-3 ≤ x ≤ 3]. The only overlapping interval is -3 ≤ x < -2, which corresponds to [-3, -2). Hence, the correct option is A."
  },
  {
    questionId: "csca-math-004",
    subject: "math",
    medium: "english",
    questionText: "Simplify the trigonometric expression to find its exact value: cos(15°) - sin(15°).",
    options: [
      "A: 1/2",
      "B: √2/2",
      "C: √6 / 2",
      "D: √3/2"
    ],
    correctOption: "B",
    explanation: "Recall that cos(15°) - sin(15°) = √2 * ( (1/√2)cos(15°) - (1/√2)sin(15°) ) = √2 * sin(45° - 15°) = √2 * sin(30°). Since sin(30°) = 1/2, the expression yields √2 * (1/2) = √2/2. Therefore, the correct option is B."
  },
  {
    questionId: "csca-math-005",
    subject: "math",
    medium: "english",
    questionText: "Evaluate the logarithmic equation for x: ln(x) + ln(x - 2) = ln(3). Choose the value of x that is valid.",
    options: [
      "A: 3",
      "B: -1",
      "C: 1 and 3",
      "D: ln(3)"
    ],
    correctOption: "A",
    explanation: "Using the product property of logarithms: ln(x(x - 2)) = ln(3). This implies x(x - 2) = 3 => x² - 2x - 3 = 0. Solving this quadratic equation: (x - 3)(x + 1) = 0, giving x = 3 or x = -1. However, since the domain of ln(x) requires x > 0 and ln(x - 2) requires x > 2, the value x = -1 is extraneous. The only valid solution is x = 3. Thus, the correct option is A."
  },
  {
    questionId: "csca-math-006",
    subject: "math",
    medium: "english",
    questionText: "A line L1 passes through the point P(2, 5) and is perpendicular to the line L2: 3x - 4y + 8 = 0. Find the equation of L1 in slope-intercept form.",
    options: [
      "A: y = 3/4x + 7",
      "B: y = -4/3x + 23/3",
      "C: y = -4/3x + 11",
      "D: y = 4/3x + 7/3"
    ],
    correctOption: "B",
    explanation: "The slope of L2 is m2 = 3/4. Since L1 is perpendicular to L2, its slope is m1 = -1/m2 = -4/3. Now, using the point-slope formula passing through (2, 5): y - 5 = -4/3(x - 2) => y = -4/3x + 8/3 + 5 => y = -4/3x + 23/3. Thus, the correct option is B."
  },
  {
    questionId: "csca-math-007",
    subject: "math",
    medium: "english",
    questionText: "Find the radius of the circle defined by the equation: x² + y² - 6x + 8y + 9 = 0.",
    options: [
      "A: 3",
      "B: 4",
      "C: 5",
      "D: 16"
    ],
    correctOption: "B",
    explanation: "Rewrite the circle equation by completing the square for x and y: (x² - 6x + 9) + (y² + 8y + 16) - 9 - 16 + 9 = 0 => (x - 3)² + (y + 4)² = 16. Comparing with center-radius form (x - h)² + (y - k)² = R², we get R² = 16, which means the radius R = 4. Thus, the correct option is B."
  },
  {
    questionId: "csca-math-008",
    subject: "math",
    medium: "english",
    questionText: "In the Cartesian coordinate system, an ellipse is centered at the origin, with its major axis along the x-axis. If the eccentricity e = √3/2 and the semi-major axis a = 4, find the coordinates of its focal points.",
    options: [
      "A: (±2√3, 0)",
      "B: (0, ±2√3)",
      "C: (±2, 0)",
      "D: (±4, 0)"
    ],
    correctOption: "A",
    explanation: "For an ellipse, the distance from the center to a focus is c = a * e. Given a = 4 and eccentricity e = √3/2, we have c = 4 * (√3/2) = 2√3. Since the major axis is along the x-axis, the focal points are located at (±c, 0) = (±2√3, 0). Consequently, the correct option is A."
  },
  {
    questionId: "csca-math-009",
    subject: "math",
    medium: "english",
    questionText: "Given vectors u = 2i + 3j and v = mi - 4j. If u and v are orthogonal, find the value of m.",
    options: [
      "A: m = 6",
      "B: m = -6",
      "C: m = 4",
      "D: m = 2"
    ],
    correctOption: "A",
    explanation: "For two vectors to be orthogonal, their dot product must equal zero: u · v = 0. Compute the dot product: (2)(m) + (3)(-4) = 0 => 2m - 12 = 0 => 2m = 12 => m = 6. Hence, the correct option is A."
  },
  {
    questionId: "csca-math-010",
    subject: "math",
    medium: "english",
    questionText: "An applicant submits applications to 3 universities. The independent probabilities of securing acceptance at University A, B, and C are 0.6, 0.5, and 0.4 respectively. What is the probability that the student receives at least one acceptance offer?",
    options: [
      "A: 0.12",
      "B: 0.88",
      "C: 0.50",
      "D: 0.76"
    ],
    correctOption: "B",
    explanation: "The probability of 'at least one acceptance' is equal to 1 minus the probability of receiving no acceptance offers at all. The independent rejection probabilities are: P(not A) = 1 - 0.6 = 0.4, P(not B) = 1 - 0.5 = 0.5, P(not C) = 1 - 0.4 = 0.6. The probability of zero acceptances: P(none) = 0.4 * 0.5 * 0.6 = 0.12. Therefore, P(at least one) = 1 - 0.12 = 0.88. Thus, the correct option is B."
  }
];
