import { observer } from "mobx-react-lite";
import "./game-screen.scss";

import React from "react";
import { GameState } from "../../game/game-state";

interface GameScreenProps {
  gameState: GameState;
}

export const GameScreen: React.FC<GameScreenProps> = observer(
  ({ gameState }) => {
    const part = gameState.currentPart;

    return (
      <div className="game-screen">
        <div className="choose-text">Choose a {part.type}</div>

        <div className="switcher">
          <div
            className="button"
            onClick={() => gameState.changePartChoice("prev")}
          >
            Prev
          </div>
          <div className="button" onClick={gameState.selectPartChoice}>
            Select
          </div>
          <div
            className="button"
            onClick={() => gameState.changePartChoice("next")}
          >
            Next
          </div>
        </div>
      </div>
    );
  }
);
