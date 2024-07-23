import { observer } from "mobx-react-lite";
import "./game-screen.scss";

import React from "react";
import { GameState } from "../../game/game-state";
import { Part } from "../../game/parts";
import { PartRow } from "./part-row";

interface GameScreenProps {
  gameState: GameState;
}

export const GameScreen: React.FC<GameScreenProps> = observer(
  ({ gameState }) => {
    // Get the input rows for each part
    const partRows: JSX.Element[] = [];
    const turret = gameState.currentTurret;
    turret.forEach((part: Part) => {
      partRows.push(
        <PartRow
          key={part.name}
          part={part}
          onClick={() => gameState.nextPartItem(part)}
        />
      );
    });

    return (
      <div className="game-screen">
        <div className="builder">{partRows}</div>
      </div>
    );
  }
);
