import { useEffect, useState } from "react";
import "./styles.css";

function App() {
  const [boxSize, setBoxSize] = useState(null);

  return (
    <div className="App">
      {boxSize ? <Game boxSize={boxSize} /> : <Menu setBoxSize={setBoxSize} />}
    </div>
  );
}

function Menu({ setBoxSize }) {
  return (
    <>
      <div className="main">
        <box className="text-box">
          <h1>Next Number</h1>
          <p>
            Click on the numbers in the correct order to score points and
            progress through as many stages as you can!
          </p>
          <div className="buttons">
            <button
              value="3"
              onClick={(e) => Number(setBoxSize(e.target.value))}
            >
              three by three
            </button>
            <button
              value="4"
              onClick={(e) => Number(setBoxSize(e.target.value))}
            >
              four by four
            </button>
            <button
              value="5"
              onClick={(e) => Number(setBoxSize(e.target.value))}
            >
              five by five
            </button>
          </div>
        </box>
      </div>
    </>
  );
}

function Game({ boxSize }) {
  const initialStageTime = 20;

  const [time, setTime] = useState(initialStageTime);
  const [stageTime, setStageTime] = useState(initialStageTime);
  const [score, setScore] = useState(0);
  const [startNumber, setStartNumber] = useState(
    Math.floor(Math.random() * 91) + 10
  );
  const [nextNumber, setNextNumber] = useState(startNumber);
  const [numbers, setNumbers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [stage, setStage] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [wrongNumbers, setWrongNumbers] = useState([]);

  //////////////////////// general funtion for creating dynamic game
  const generateNumbers = (newStart) => {
    const totalCells = boxSize * boxSize;
    const nums = Array.from({ length: totalCells }, (_, i) => newStart + i);
    nums.sort(() => Math.random() - 0.5);
    setNumbers(nums);
    setSelectedNumbers([]);
    setWrongNumbers([]);
    setNextNumber(newStart);
    setStartNumber(newStart);
  };

  ///////////////////////// Timer
  useEffect(() => {
    if (time <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setInterval(() => {
      setTime((cur) => cur - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  useEffect(() => {
    generateNumbers(startNumber);
    document.body.style.padding = "0";
  }, []);

  /////////////////////////// Event Click Handle control
  const handleClick = (num) => {
    if (selectedNumbers.includes(num) || gameOver) return;

    const correctSound = new Audio("/sound/correct.mp3");
    const wrongSound = new Audio("/sound/wrong.mp3");
    const nextSound = new Audio("/sound/wind.mp3");

    if (num === nextNumber) {
      setScore((curr) => curr + 1);
      setNextNumber(nextNumber + 1);
      setTime((curr) => curr + 1);
      setSelectedNumbers((curr) => [...curr, num]);
      correctSound.play();

      if (selectedNumbers.length + 1 === numbers.length) {
        const newStageTime = Math.floor(stageTime / 2);
        setStageTime(newStageTime);
        setTime(newStageTime);
        setStage((curr) => curr + 1);
        setScore((curr) => curr + 20);
        const newStart = Math.floor(Math.random() * 91) + 10;
        nextSound.play();
        generateNumbers(newStart);
      }
    } else {
      setScore((curr) => curr - 2);
      setTime((curr) => Math.max(curr - 2, 0));
      setWrongNumbers((curr) => [...curr, num]);
      wrongSound.play();
    }
  };

  ////////////////////////// Game Over
  if (gameOver) {
    return (
      <div>
        <h1>Game Over</h1>
        <h2>Stage Reached: {stage}</h2>
        <h2>Score: {score}</h2>

        <button onClick={() => (window.location = "/")}>Menu</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="box">
        <div className="content">
          <h1>next number</h1>

          <div className="green-box">
            <span>Stage: {stage}</span>
            <span>Time: {time}</span>
            <span>Score: {score}</span>
          </div>

          <div
            className="stones"
            style={{
              display: "grid",
              ...(Number(boxSize) === 3 && {
                gridTemplateColumns: "repeat(3, 12rem)",
                gap: "9rem",
              }),
              ...(Number(boxSize) === 4 && {
                gridTemplateColumns: "repeat(4, 10rem)",
                gap: "5rem",
              }),
              ...(Number(boxSize) === 5 && {
                gridTemplateColumns: "repeat(5, 10rem)",
                gap: "2rem",
              }),
            }}
          >
            {numbers.map((num, i) => (
              <div
                className="stone"
                key={i}
                style={{
                  background: selectedNumbers.includes(num)
                    ? "linear-gradient(to left, rgba(126, 213, 111, 0.47), rgba(40, 180, 131, 0.46)), url(/img/stone.jpg) center/cover no-repeat"
                    : wrongNumbers.includes(num)
                    ? " url(/img/crack.png) center/cover, url(/img/stone.jpg) center/cover no-repeat"
                    : "url(/img/stone.jpg) center/cover no-repeat",
                  cursor: selectedNumbers.includes(num) ? "default" : "pointer",
                }}
                onClick={() => handleClick(num)}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        <div className="content"></div>
      </div>
    </div>
  );
}

export default App;
