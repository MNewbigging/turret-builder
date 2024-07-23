import { observer } from "mobx-react-lite";
import "./game-screen.scss";

import React from "react";
import { GameState } from "../../game/game-state";

interface GameScreenProps {
  gameState: GameState;
}

export const GameScreen: React.FC<GameScreenProps> = observer(
  ({ gameState }) => {
    const basePart = gameState.basePart;

    return (
      <div className="game-screen">
        <div className="builder">
          <div className="selector-row">
            <div className="selector-button" onClick={gameState.nextBaseItem}>
              Base: {basePart?.name}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
