import { useState } from "react";
import "./App.css";
import "./components/Board.jsx"
import HealthDisplay from "./components/HealthDisplay.jsx";

function App(minDamage = 0, maxDamage=50) {
  const INITIAL_HEALTH = 100;
  const INITIAL_GAME_STATUS ="ongoing";

  const [playerHealth, setPlayerHealth] = useState(INITIAL_HEALTH);
  const [enemyHealth, setEnemyHealth] = useState(INITIAL_HEALTH);

  const[gameStatus, setGameStatus]=useState(INITIAL_GAME_STATUS);








  return (
    <>
      <Board/>
      <HealthDisplay/>
    </>
  );
}

export default App;
