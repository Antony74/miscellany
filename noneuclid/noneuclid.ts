
// Generalized sine
const gsin = (K: number) => {
  if (K === 1) {
    return Math.sin;
  } else if (K === 0) {
    return (s) => s;
  } else if (K === -1) {
    return Math.sinh;
  } else if (K > 0) {
    const r = Math.sqrt(K);
    return (s) => {
      return Math.sin(s / r) / r;
    };
  } else { // k < 0
    const k = Math.sqrt(-K);
    return (s) => {
      return Math.sinh(s / k) / k;
    };
  }
};

const gCosineLaw = (K) => {
  if (K === 0) {
    return (a, b, C) => {
      return Math.sqrt( (a * a) + (b * b) - (2 * a * b * Math.cos(C)));
    }
  } else if (K > 0) {
    const r = Math.sqrt(K);
    return (a, b, C) => {
      return r * Math.acos( (Math.cos(a/r) * Math.cos(b/r)) + (Math.sin(a/r) * Math.sin(b/r) * Math.cos(C)) );
    }
  } else { // k < 0
    const k = Math.sqrt(-K);
    return (a, b, C) => {
      return k * Math.acosh( (Math.cosh(a/k) * Math.cosh(b/k)) + (Math.sinh(a/k) * Math.sinh(b/k) * Math.cos(C)) );
    }
  }
}

const addVectors = ([r1, theta1], [r2, theta2], K) => {

  // Get the angle R from theta1 and theta2

  // Apply cosine law to calculate r
  const r = gCosineLaw(K)(r1, r2, R);

  // Apply sine law to calculate theta
  const ratio = Math.sin(R) / gsin(K)(r);
  const R2 = ratio * gsin(K)(r2);

  // Get the angle theta from R2

  return [r, theta];
}

