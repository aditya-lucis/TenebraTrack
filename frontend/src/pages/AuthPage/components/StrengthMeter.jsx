import { getStrength } from "../AuthPage.utils";

const LABELS = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"];
const COLORS = ["", "weak", "medium", "strong", "strong"];

export function StrengthMeter({ password }) {
  const s = getStrength(password);
  return (
    <div>
      <div className="strength-meter">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`strength-bar ${i <= s ? COLORS[s] : ""}`}
          />
        ))}
      </div>
      {password && (
        <div
          style={{
            fontSize: 11,
            marginTop: 4,
            color: s >= 3 ? "var(--mint)" : s === 2 ? "#f59e0b" : "var(--danger)",
            fontWeight: 600,
          }}
        >
          {LABELS[s]}
        </div>
      )}
    </div>
  );
}