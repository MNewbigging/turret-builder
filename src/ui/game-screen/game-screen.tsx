import { observer } from "mobx-react-lite";
import "./game-screen.scss";

import React from "react";
import { GameState } from "../../game/game-state";

interface GameScreenProps {
  gameState: GameState;
}

export const GameScreen: React.FC<GameScreenProps> = observer(
  ({ gameState }) => {
    const partType = "base";

    return (
      <div className="game-screen">
        <div className="choose-text">Choose a {partType}</div>
        <div className="switcher">
          <div className="button">Prev</div>
          <div className="button">Skip</div>
          <div className="button">Next</div>
        </div>
      </div>
    );
  }
);
