import { useEffect, useState } from "react";
import { CheckSquare } from "lucide-react";
import "../styles/auth.css";

function AuthLayout({ children }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40; 
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    setMousePosition({ x, y });
  };

  return (
    <div className="auth-layout-wrapper" onMouseMove={handleMouseMove}>
      {/* Animated Aurora Background */}
      <div 
        className="aurora-bg"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
      >
        <div className="aurora-blob blob-1"></div>
        <div className="aurora-blob blob-2"></div>
        <div className="aurora-blob blob-3"></div>
      </div>
      
      {/* Animated Mesh Grid Overlay */}
      <div className="auth-mesh-grid"></div>

      {/* Main Content Area */}
      <main className="auth-main-content">
        {children}
      </main>
    </div>
  );
}

export default AuthLayout;
