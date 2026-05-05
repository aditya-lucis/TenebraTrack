import { useEffect } from "react";
import { IconCheck } from "../AuthPage.icons";

export function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="toast">
      <span className="toast-icon"><IconCheck /></span>
      {message}
    </div>
  );
}