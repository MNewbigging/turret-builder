import { Part } from "../../game/parts";
import "./part-row.scss";
import React from "react";

interface PartRowProps {
  part: Part;
  onClick: () => void;
}

export const PartRow: React.FC<PartRowProps> = ({ part, onClick }) => {
  return (
    <div className="part-row" onClick={onClick}>
      {part.type}: {part.name}
    </div>
  );
};
