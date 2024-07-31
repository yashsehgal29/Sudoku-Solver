import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [grid, setGrid] = useState(Array(9).fill(Array(9).fill("")));

  const handleChange = (e, row, col) => {
    const value = e.target.value;
    if (value === "" || /^[1-9]$/.test(value)) {
      setGrid((prev) =>
        prev.map((r, i) =>
          i === row ? r.map((c, j) => (j === col ? value : c)) : r
        )
      );
    }
  };

  const handleReset = () => {
    setGrid(Array(9).fill(Array(9).fill("")));
  };

  const isValidPlacement = (grid, row, col, num) => {
    for (let x = 0; x < 9; x++) {
      if (
        grid[row][x] === num ||
        grid[x][col] === num ||
        grid[Math.floor(row / 3) * 3 + Math.floor(x / 3)][
          Math.floor(col / 3) * 3 + (x % 3)
        ] === num
      ) {
        return false;
      }
    }
    return true;
  };

  const solveSudoku = () => {
    const solve = () => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (grid[i][j] === "") {
            for (let k = 1; k <= 9; k++) {
              const num = k.toString();
              if (isValidPlacement(grid, i, j, num)) {
                grid[i][j] = num;
                if (solve()) {
                  return true;
                }
                grid[i][j] = "";
              }
            }
            return false;
          }
        }
      }
      return true;
    };
    if (!checkValidGrid()) {
      handleReset();
      alert("Invalid Sudoku grid!");
    } else {
      solve();
      setGrid([...grid]);
    }
  };

  const checkValidGrid = () => {
    // Check rows and columns
    for (let i = 0; i < 9; i++) {
      let rowSet = new Set();
      let colSet = new Set();
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] !== "") {
          if (rowSet.has(grid[i][j])) return false;
          rowSet.add(grid[i][j]);
        }
        if (grid[j][i] !== "") {
          if (colSet.has(grid[j][i])) return false;
          colSet.add(grid[j][i]);
        }
      }
    }
    // Check 3x3 grids
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        let boxSet = new Set();
        for (let row = i; row < i + 3; row++) {
          for (let col = j; col < j + 3; col++) {
            if (grid[row][col] !== "") {
              if (boxSet.has(grid[row][col])) return false;
              boxSet.add(grid[row][col]);
            }
          }
        }
      }
    }
    return true;
  };

  return (
    <>
      <div className="flex flex-col w-full h-screen">
        <header className="h-1/6 bg-[#2e2e2e] w-full flex items-center justify-center p-8">
          <h1 className="text-[#c4baba] text-4xl font-bold">Sudoku Solver</h1>
        </header>
        <main className="w-full h-full bg-[#454343] p-10 flex justify-evenly">
          <div className="flex flex-col sudoku-grid">
            {grid.map((row, rowIndex) => (
              <div className="flex" key={`row-${rowIndex}`}>
                {row.map((val, colIndex) => (
                  <input
                    type="text"
                    key={`cell-${rowIndex}-${colIndex}`}
                    value={val}
                    onChange={(e) => handleChange(e, rowIndex, colIndex)}
                    className={`w-12 h-12 border text-center ${
                      (colIndex + 1) % 3 === 0 && colIndex !== 8
                        ? "border-r-2"
                        : "border-r"
                    } ${
                      (rowIndex + 1) % 3 === 0 && rowIndex !== 8
                        ? "border-b-2"
                        : "border-b"
                    } bg-white border-black`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center gap-4 w-fit">
            <button
              onClick={solveSudoku}
              className="p-4 bg-[#565454] shadow-lg hover:shadow-none rounded-xl font-bold text-white"
            >
              Solve It!
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-3 bg-[#e42222] shadow-lg hover:shadow-none rounded-xl font-bold text-white"
            >
              Reset
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
