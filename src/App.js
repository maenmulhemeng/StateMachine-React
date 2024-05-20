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
  const [transition] = useStateMachine();
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
  function getNextPistion(position, direction, L, C) {
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

    let nextPoition = getNextPistion(
      gameState.position,
      gameState.direction,
      gameState.L,
      gameState.C,
    );
    // Let's ask our state machine a simple quesiton
    // What should we do if we want to move from current state to the next state of the next position with respect to the boos value
    const commands = transition(
      gameState.stateMap[gameState.position[0]][gameState.position[1]],
      gameState.stateMap[nextPoition[0]][nextPoition[1]],
      gameState.isBoost,
    );
    // The answer is a list of commands
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      switch (command.name) {
        case "move":
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
            payload: nextPoition,
          });
          break;
        case "deleteBlocker":
          dispatch({
            type: "deleteBlocker",
            payload: nextPoition,
          });
          break;
        case "teleporters":
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
            payload: command["action"](gameState.position, gameState.teleports),
          });

          break;
        case "changeDirection":
          // execute the command action (callback function)
          dispatch({
            type: "setDirection",
            payload: command["action"](),
          });
          break;
        case "reverse":
          // execute the command action (callback function)
          dispatch({
            type: "reversePriorities",
            payload: command["action"](gameState.priorities),
          });
          break;
        case "boost":
          dispatch({
            type: "setIsBoost",
            payload: command["action"](gameState.isBoost),
          });
          // execute the command action (callback function)
          break;
        case "impossible":
          break;
        case "done":
          return gameState.instructions;
        case "lookAround":
          // execute the command action
          const [direction1, nextPoition1, stop1] = command["action"](
            gameState.priorities,
            getNextPistion,
            gameState.position,
            gameState.stateMap,
            gameState.isBoost,
            gameState.visited,
            gameState.L,
            gameState.C,
          );
          // if we could not find a position to go to after looking around
          // We'll consider ourselves stacking in a loop
          if (!stop1) {
            return ["LOOP"];
          } else {
            dispatch({
              type: "setDirection",
              payload: direction1,
            });
            nextPoition = nextPoition1;
          }
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
