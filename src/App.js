import { useState, useReducer, useEffect } from "react";
import { useStateMachine } from "./stateMachine";
import { reducer, initialState } from "./gameReducer";

export function InputArea({ parseUserInput }) {
  function caseOne() {
    return "5 6\n# # # # # #\n# @ E   $ #\n#   N     #\n# x       #\n# # # # # #";
  }

  function caseTwo() {
    return "10 10\n# # # # # # # # # #\n#                 #\n#     S       W   #\n#                 #\n#     $           #\n#                 #\n# @               #\n#                 #\n# E           N   #\n# # # # # # # # # #";
  }

  const [userInput, setUserInput] = useState("");
  return (
    <div>
      <textarea
        id="inputArea"
        rows="10"
        cols="50"
        value={userInput}
        onChange={(e) => {
          setUserInput(e.target.value);
        }}
      ></textarea>
      <div>
        <button
          disabled={userInput.length == 0}
          onClick={() => parseUserInput(userInput)}
        >
          {" "}
          Parse{" "}
        </button>
        <button
          onClick={() => {
            setUserInput(caseOne());
          }}
        >
          Copy Case 1
        </button>

        <button
          onClick={() => {
            setUserInput(caseTwo());
          }}
        >
          Copy Case 2
        </button>
      </div>
    </div>
  );
}
export function Square({ value, isCurrentPosition, isVisited }) {
  if (isCurrentPosition) {
    if (value == "$") {
      return <div className="square targetPoition">{value}</div>;
    } else if (value != "$") {
      return <div className="square currentPosition">{value}</div>;
    }
  } else if (isVisited()) {
    return <div className="square visited">{value}</div>;
  }

  return <div className="square">{value}</div>;
}

function Board({ position, stateMap, visited }) {
  return (
    <>
      {stateMap?.map((row, i) => (
        <div className="board-row" key={"b" + i}>
          {row.map((col, j) => (
            <Square
              key={"col" + j}
              value={col == "blank" ? " " : col}
              isVisited={() =>
                visited.find((v) => v[0] == i && v[1] == j)?.length > 0
              }
              isCurrentPosition={position[0] == i && position[1] == j}
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [gameState, dispatch] = useReducer(reducer, initialState);
  const [history, setHistory] = useState([]);
  const [
    transition,
    commandMove,
    commandLookAround,
    commandImpossible,
    commandDone,
    commandChangeDirectionToNorth,
    commandChangeDirectionToWest,
    commandChangeDirectionToSouth,
    commandChangeDirectionToEast,
    commandReverse,
    commandBoost,
    commandTeleporters,
    commandLoop,
    commandDeleteBlocker,
  ] = useStateMachine();

  commandImpossible.action = () => {};
  commandDone.action = () => {
    return gameState.instructions;
  };

  commandReverse.action = () => {
    // execute the command action (callback function)
    dispatch({
      type: "reversePriorities",
      payload: gameState.priorities,
    });
  };

  commandBoost.action = () => {
    dispatch({
      type: "setIsBoost",
      payload: !gameState.isBoost,
    });
  };

  commandTeleporters.action = () => {
    // Consider the current position is visited
    dispatch({
      type: "addVisit",
      payload: gameState.position,
    });
    // Add the direction (instuction) to the solution
    dispatch({
      type: "addInstruction",
      payload: gameState.direction,
    });
    // execute the command action (callback function)
    const nextP = getNextPosition(
      gameState.position,
      gameState.direction,
      gameState.L,
      gameState.C,
    );
    dispatch({
      type: "setPosition",
      payload: gameState.teleports.filter(
        (t) => !(t[0] == nextP[0] && t[1] == nextP[1]),
      )[0],
    });
  };

  commandLoop.action = () => {
    return ["LOOP"];
  };
  commandDeleteBlocker.action = () => {
    dispatch({
      type: "deleteBlocker",
      payload: getNextPosition(
        gameState.position,
        gameState.direction,
        gameState.L,
        gameState.C,
      ),
    });
  };
  commandMove.action = () => {
    // Consider the current position is visited
    dispatch({
      type: "addVisit",
      payload: gameState.position,
    });
    // Add the direction (instuction) to the solution
    dispatch({
      type: "addInstruction",
      payload: gameState.direction,
    });

    // execute the command action (callback function)
    dispatch({
      type: "setPosition",
      payload: getNextPosition(
        gameState.position,
        gameState.direction,
        gameState.L,
        gameState.C,
      ),
    });
  };

  commandLookAround.action = () => {
    // No direction until we find one
    let foundDirection = false;
    let resultDirection = "";
    let resultnextPosition = [];

    // Let's check our priorities
    gameState.priorities.forEach((possibleDirection) => {
      // Let's look toward the position of the suggested direction
      const positionOfPossibleState = getNextPosition(
        gameState.position,
        possibleDirection,
        gameState.L,
        gameState.C,
      );

      // And then let's get its state
      const possibleState =
        gameState.stateMap[positionOfPossibleState[0]][
          positionOfPossibleState[1]
        ];
      // if the next state is not a blocker @ and now an x without boost and the next position has not beed visited and we haven't seen
      // a good direction to look at
      if (
        !(
          possibleState == "#" ||
          (possibleState == "x" && !gameState.isBoost) ||
          foundDirection ||
          gameState.visited.find(
            (v) =>
              v[0] == positionOfPossibleState[0] &&
              v[1] == positionOfPossibleState[1],
          )
        )
      ) {
        // We'll consider this direction a good potential to look at
        resultDirection = possibleDirection;
        // And we'll take its state
        resultnextPosition = positionOfPossibleState;
        // Direction found
        foundDirection = true;
        // Let's return them
        return;
      }
    });
    return [resultDirection, resultnextPosition, foundDirection];
  };

  commandChangeDirectionToNorth.action = () => {
    dispatch({
      type: "setDirection",
      payload: "NORTH",
    });
  };
  commandChangeDirectionToWest.action = () => {
    dispatch({
      type: "setDirection",
      payload: "WEST",
    });
  };
  commandChangeDirectionToSouth.action = () => {
    dispatch({
      type: "setDirection",
      payload: "SOUTH",
    });
  };
  commandChangeDirectionToEast.action = () => {
    dispatch({
      type: "setDirection",
      payload: "EAST",
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        gameState.stateMap.length > 0 &&
        gameState.stateMap[gameState.position[0]][gameState.position[1]] !=
          "$" &&
        !gameState.visited.find(
          (v) => v[0] == gameState.position[0] && v[1] == gameState.position[1],
        )
      ) {
        buildHistory();
      }
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  });
  function jumpTo(nextMove) {
    dispatch({
      type: "setGameState",
      payload: history[nextMove],
    });
    setHistory(history.slice(0, nextMove + 1));
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  function parseUserInput(userInput) {
    const lines = userInput.split("\n");
    const stateMapTemp = [];
    let L1, C1;
    let teleports = [];
    lines.forEach((line, index) => {
      if (index == 0) {
        // Read L and c
        [L1, C1] = line.split(" ").map((n) => parseInt(n));
      } else {
        const lineArray = Array.from(line).filter((e, index) => index % 2 == 0);
        const initialPoition = lineArray.findIndex((c) => c == "@");
        if (initialPoition > -1) {
          dispatch({
            type: "setPosition",
            payload: [index - 1, initialPoition],
          });
        }
        const teleportersInLine = lineArray.reduce(
          (prev, curr, j) => (curr == "T" ? [...prev, [index - 1, j]] : prev),
          [],
        );

        teleports = [...teleports, ...teleportersInLine];
        stateMapTemp.push(lineArray.map((e) => (e == " " ? "blank" : e)));
      }
    });
    dispatch({
      type: "setL",
      payload: L1,
    });

    dispatch({
      type: "setC",
      payload: C1,
    });

    dispatch({
      type: "setTeleports",
      payload: teleports,
    });

    dispatch({
      type: "setStateMap",
      payload: stateMapTemp,
    });
  }

  // Given the current position and the direction, this function return the next
  // position with respect to the matrix boundaries
  function getNextPosition(position, direction, L, C) {
    const i = position[0];
    const j = position[1];
    // heading south means moving down on rows
    if (direction == "SOUTH") {
      return i < L - 1 ? [i + 1, j] : [i, j];
    }
    // heading east means moving right on columns
    else if (direction == "EAST") {
      return j < C - 1 ? [i, j + 1] : [i, j];
    }
    // heading north means moving up on rows
    else if (direction == "NORTH") {
      return i > 0 ? [i - 1, j] : [i, j];
    }
    // heading west means moving left on columns
    else if (direction == "WEST") {
      return j > 0 ? [i, j - 1] : [i, j];
    }
  }

  function getInstructions() {
    // Give me the current position and the direction we can know the what the next position is

    let nextPosition = getNextPosition(
      gameState.position,
      gameState.direction,
      gameState.L,
      gameState.C,
    );
    // Let's ask our state machine a simple quesiton
    // What should we do if we want to move from current state to the next state of the next position with respect to the boos value
    const commands = transition(
      gameState.stateMap[gameState.position[0]][gameState.position[1]],
      gameState.stateMap[nextPosition[0]][nextPosition[1]],
      gameState.isBoost,
    );

    // The answer is a list of commands
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      switch (command.name) {
        case "move":
          command.action();
          break;
        case "deleteBlocker":
          command.action();
          break;
        case "teleporters":
          command.action();
          break;
        case "changeDirectionNorth":
          command.action();
          break;
        case "changeDirectionWest":
          command.action();
          break;
        case "changeDirectionSouth":
          command.action();
          break;
        case "changeDirectionEast":
          command.action();
          break;
        case "reverse":
          command.action();
          break;
        case "boost":
          command.action();
          break;
        case "impossible":
          return;
        case "done":
          return command.action();
        case "lookAround":
          const [direction1, nextPosition1, stop1] = command.action();
          if (!stop1) {
            return ["LOOP"];
          } else {
            dispatch({
              type: "setDirection",
              payload: direction1,
            });
            nextPosition = nextPosition1;
          }
          break;
      }
    }
    setHistory([...history, { ...gameState }]);

    return gameState.instructions;
  }

  function buildHistory() {
    getInstructions();
  }
  return (
    <>
      <div className="game">
        {gameState?.stateMap?.length > 0 ? (
          <>
            <div className="game-board">
              <h4>priorities</h4>
              <p>
                {gameState?.priorities.map((i, index) => (
                  <span key={i + index}>
                    {i}
                    {" | "}
                  </span>
                ))}
              </p>
              <h4>The board (State Map)</h4>
              <Board
                stateMap={gameState.stateMap}
                position={gameState.position}
                visited={gameState.visited}
              />

              <div>
                <h4>Current Direction</h4>
                <p>{gameState?.direction}</p>

                <h4>Instructions</h4>
                {gameState?.instructions.map((i, index) => (
                  <div key={i + index}>{i}</div>
                ))}
              </div>
            </div>
            <div className="game-info">
              <ol>{moves}</ol>
            </div>
          </>
        ) : (
          <></>
        )}
        {gameState?.stateMap?.length == 0 ? (
          <div className="inputArea">
            <InputArea parseUserInput={parseUserInput}></InputArea>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
