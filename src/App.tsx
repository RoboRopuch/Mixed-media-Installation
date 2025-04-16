import { useState } from "react";
import "./App.css";
import { randomNum } from "./RandomNum";

function App() {
  const [count, setCount] = useState(0);

  const handleButtonClik = () => setCount(randomNum);

  return (
    <div className="app-container">
      <h1></h1>
      <h2>{count}</h2>
      <button onClick={handleButtonClik}></button>
    </div>
  );
}

export default App;
