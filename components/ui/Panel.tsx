import React from "react";

interface PanelProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Panel: React.FC<PanelProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel-content" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose}>
          ×
        </button>
        <div className="py-4">{children}</div>
      </div>
      <style jsx>{`
        .panel-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .panel-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          position: relative;
          max-width: 500px;
          width: 100%;
        }
        .panel-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Panel;
