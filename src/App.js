import { useEffect, useState } from "react";

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
    <div>
      <h2>Chosse your Box</h2>
      <button value="3" onClick={(e) => Number(setBoxSize(e.target.value))}>
        3*3
      </button>
      <button value="4" onClick={(e) => Number(setBoxSize(e.target.value))}>
        4*4
      </button>
      <button value="5" onClick={(e) => Number(setBoxSize(e.target.value))}>
        5*5
      </button>
    </div>
  );
}

function Game({ boxSize }) {
  const totalCells = boxSize * boxSize;
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

  const generateNumbers = (newStart) => {
    const nums = Array.from({ length: totalCells }, (_, i) => newStart + i);
    nums.sort(() => Math.random() - 0.5);
    setNumbers(nums);
    setSelectedNumbers([]);
    setNextNumber(newStart);
    setStartNumber(newStart);
  };

  const handleClick = (num) => {
    if (selectedNumbers.includes(num) || gameOver) return;

    if (num === nextNumber) {
      setScore((curr) => curr + 1);
      setNextNumber(nextNumber + 1);
      setTime((curr) => curr + 1);
      setSelectedNumbers((curr) => [...curr, num]);

      if (selectedNumbers.length + 1 === numbers.length) {
        const newStageTime = Math.floor(stageTime / 2); // نصف زمان مرحله جاری
        setStageTime(newStageTime);
        setTime(newStageTime);
        setStage((curr) => curr + 1);
        setScore((curr) => curr + 20);
        const newStart = Math.floor(Math.random() * 91) + 10;
        generateNumbers(newStart);
      }
    } else {
      setScore((curr) => curr - 2);
      setTime((curr) => Math.max(curr - 2, 0));
    }
  };

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
  }, []);

  if (gameOver) {
    return (
      <div>
        <h1>Game Over</h1>
        <h2>Stage Reached: {stage}</h2>
        <h2>Score: {score}</h2>
      </div>
    );
  }

  return (
    <>
      <h1>Time: {time}s</h1>
      <h1>Score: {score}</h1>
      <h1>Stage: {stage}</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${boxSize}, 80px)`,
          gap: "5px",
        }}
      >
        {numbers.map((num, i) => (
          <div
            key={i}
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: selectedNumbers.includes(num)
                ? "#90ee90"
                : "#ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              cursor: selectedNumbers.includes(num) ? "default" : "pointer",
            }}
            onClick={() => handleClick(num)}
          >
            {num}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
