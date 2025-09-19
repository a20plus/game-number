import { useState } from "react";

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
  const cells = Array.from({ length: boxSize * boxSize }, (b, i) => i);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${boxSize}, 80px)`,
        gap: "5px",
        // border: "solid 0px #000",
      }}
    >
      {cells.map((cell) => (
        <div
          key={cell}
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          {cell + 1}
        </div>
      ))}
    </div>
  );
}

export default App;
