// ── Validation
export const REGEX = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~]{8,}$/,
  name: /^[a-zA-Z\u00C0-\u024F'][a-zA-Z\u00C0-\u024F' -]{1,}$/,
};

export function isValidEmail(email) {
  return REGEX.email.test(String(email).toLowerCase().trim());
}
export function isStrongPassword(pass) {
  return REGEX.strongPassword.test(pass);
}
export function isValidName(name) {
  return REGEX.name.test(name.trim()) && name.trim().length >= 2;
}

// ── Password Strength 
export function scorePassword(pass) {
  let score = 0;
  if (!pass) return 0;
  if (pass.length >= 8)  score++;
  if (pass.length >= 12) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[a-z]/.test(pass)) score++;
  if (/\d/.test(pass))    score++;
  if (/[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~]/.test(pass)) score++;
  return score;
}

export function getPasswordStrength(pass) {
  const score = scorePassword(pass);
  const pct = (score / 6) * 100;
  if (!pass) return { pct: 0, label: "", color: "transparent" };
  if (score <= 2) return { pct, label: "🔴 Weak password", color: "#f87171" };
  if (score <= 4) return { pct, label: "🟡 Fair — add special characters", color: "#fbbf24" };
  return { pct, label: "🟢 Strong password", color: "#34d399" };
}

// ── Word Count 
export function getWordCount(text) {
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
}

export function getWordCountStatus(count) {
  if (count === 0) return { text: "Minimum 50 words required", color: "#4a5070" };
  if (count < 30)  return { text: `${count} words — too short (need 50+)`, color: "#f87171" };
  if (count < 50)  return { text: `${count} / 50 words minimum`, color: "#fbbf24" };
  if (count < 100) return { text: `${count} words — good`, color: "#34d399" };
  return              { text: `${count} words — excellent!`, color: "#34d399" };
}

// ── Misc 
export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function getBadge(score) {
  if (score >= 80) return { label: "Excellent",  type: "green" };
  if (score >= 65) return { label: "Strong",     type: "green" };
  if (score >= 50) return { label: "Good Start", type: "blue" };
  if (score >= 35) return { label: "Needs Work", type: "orange" };
  return                  { label: "Poor",       type: "red" };
}

export function getScoreColor(score) {
  if (score >= 70) return "#34d399";
  if (score >= 50) return "#fbbf24";
  return "#f87171";
}
