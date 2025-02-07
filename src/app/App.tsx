import "./app.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { AppState } from "./app-state";
import { LoadingScreen } from "../ui/loading-screen/loading-screen";
import { GameScreen } from "../ui/game-screen/game-screen";

interface AppProps {
  appState: AppState;
}

export const App: React.FC<AppProps> = observer(({ appState }) => {
  const started = appState.started;
  const gameState = appState.gameState;

  return (
    <div className="ui-root">
      {!started && <LoadingScreen appState={appState} />}
      {started && gameState && <GameScreen gameState={gameState} />}
    </div>
  );
});
