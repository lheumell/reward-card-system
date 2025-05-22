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
      <div
        className="bg-gradient-to-r from-violet-200 from-5% via-violet-50 via-50% to-95% to-teal-100 panel-content"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="panel-close" onClick={onClose}>
          ×
        </span>
        <div className="py-4">{children}</div>
      </div>
      <style jsx>{`
        .panel-overlay {
          position: fixed;
          padding: 8px;
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
          padding: 20px;
          border-radius: 12px;
          position: relative;
          max-width: 500px;
          width: 100%;
        }
        .panel-close {
          position: absolute;
          top: 0px;
          right: 10px;
          background: none;
          border: none;
          font-size: 32px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Panel;
