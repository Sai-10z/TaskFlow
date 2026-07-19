import { Check, X } from "lucide-react";

function PasswordStrength({ password }) {
  const requirements = [
    { label: "8+ Characters", test: (p) => p.length >= 8 },
    { label: "Uppercase", test: (p) => /[A-Z]/.test(p) },
    { label: "Number", test: (p) => /[0-9]/.test(p) },
    { label: "Special Character", test: (p) => /[^A-Za-z0-9]/.test(p) }
  ];

  const metCount = requirements.filter(req => req.test(password)).length;
  
  let strengthLabel = "Weak";
  let strengthColor = "var(--danger)";
  let progressWidth = "33%";
  
  if (metCount === 0) {
    strengthLabel = "";
    progressWidth = "0%";
  } else if (metCount < 3) {
    strengthLabel = "Weak";
    strengthColor = "var(--danger)";
    progressWidth = "33%";
  } else if (metCount === 3) {
    strengthLabel = "Medium";
    strengthColor = "var(--warning)";
    progressWidth = "66%";
  } else if (metCount === 4) {
    strengthLabel = "Strong";
    strengthColor = "var(--success)";
    progressWidth = "100%";
  }

  return (
    <div className="password-strength-container">
      {password.length > 0 && (
        <>
          <div className="strength-header">
            <span>Password Strength</span>
            <span style={{ color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
          </div>
          <div className="strength-bar-bg">
            <div 
              className="strength-bar-fill" 
              style={{ width: progressWidth, backgroundColor: strengthColor }}
            ></div>
          </div>
          <div className="strength-checklist">
            {requirements.map((req, index) => {
              const isMet = req.test(password);
              return (
                <div key={index} className={`checklist-item ${isMet ? 'met' : ''}`}>
                  {isMet ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                  <span>{req.label}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default PasswordStrength;
