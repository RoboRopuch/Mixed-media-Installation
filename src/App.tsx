import { useState } from "react";
import "./App.scss";
import {drawFromRanges} from "./utils/randomWIthCustomProbability.ts";
import {useRangeContext} from "./context.tsx";
import {MusicManager} from "./components/musicManager.ts";

function App() {
    const [count, setCount] = useState(null);
const { ranges } = useRangeContext();
const [animation, setAnimation] = useState<boolean>(false);

const soundManager = MusicManager.getInstance();

const handleButtonClik = () => {
    setAnimation(true);
    soundManager.playDrumRoll(10);

}

const handleAnimationEnd = ( event: AnimationEvent) => {
    event.stopPropagation();
    setCount(drawFromRanges(ranges));
    setAnimation(false)
}

const animationTest = animation ? `fadeIn 10s` : ``;
const content = animationTest ? <img className={'animation'} onAnimationEnd={handleAnimationEnd} style={{animation: `${animationTest}`}} alt={'lottery'} src={'/lottery.gif'}></img> :         <div>
        <button onClick={handleButtonClik} className="push--flat"></button>
        {count && <h2>{count}</h2>}
    </div>
;
  return (
    <div className="app-container">
        {content}
    </div>
  );
}

export default App;
