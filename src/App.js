import { useState, useReducer } from "react";
import { useStateMachine } from "./stateMachine";
import { reducer, initialState } from "./gameReducer";
import { startTransition } from "react/cjs/react.production.min";

function InputArea({ parseUserInput }) {
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
      <button onClick={() => parseUserInput(userInput)}> Parse </button>
    </div>
  );
}
function Square({ value, isCurrentPosition }) {
  if (isCurrentPosition && value == "$") {
    return <div className="square targetPoition">{value}</div>;
  } else if (isCurrentPosition && value != "$") {
    return <div className="square currentPosition">{value}</div>;
  }
  return <div className="square">{value}</div>;
}

function Board({ position, stateMap }) {
  return (
    <>
      {stateMap.map((row, i) => (
        <div className="board-row" key={"b" + i}>
          {row.map((col, j) => (
            <Square
              key={"col" + j}
              value={col == "blank" ? " " : col}
              onSquareClick={() => handleClick(i)}
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
  const [currentMove, setCurrentMove] = useState(0);

  const [stateMachine, transition] = useStateMachine();

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  /*function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }*/

  function jumpTo(nextMove) {
    //setCurrentMove(nextMove);
    console.log(history[nextMove]);
    dispatch({
      type: "setGameState",
      payload: history[nextMove],
    });
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
    lines = userInput.split("\n");
    stateMapTemp = [];
    lines.forEach((line, index) => {
      if (index == 0) {
        // Read L and c
        [L1, C2] = line.split(" ").map((n) => parseInt(n));
      } else {
        const lineArray = Array.from(line).filter((e, index) => index % 2 == 0);
        const initialPoition = lineArray.findIndex((c) => c == "@");
        if (initialPoition > -1) {
          dispatch({
            type: "setPosition",
            payload: [index - 1, initialPoition],
          });
        }
        stateMapTemp.push(lineArray.map((e) => (e == " " ? "blank" : e)));
      }
    });
    //console.log(stateMapTemp, L, C);
    dispatch({
      type: "setL",
      payload: L1,
    });

    dispatch({
      type: "setC",
      payload: C2,
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
    // we'll save the solution here e.g ['SOUTH', 'EAST', 'NORTH', 'EAST', 'EAST']

    // We'll track the positions that we have visited e.g [[1,1], [1,2]]
    // it means we have visited position [1,1] and then [1,2]
    countery = 0;
    // Let's keep moving while we haven't reached $ yet and we are not stacking in a loop
    // We'll consider revisiting the same position twice is a problem and it leads us to loop
    /*while (
      stateMap[position[0]][position[1]] != "$" &&
      !visited.includes(position)
    ) {*/
    // Givem the current position and the direction we can know the what the next position is

    /*if (countery++ > 20) {
        console.log("infinit");
        break;
      }*/
    let nextPoition = getNextPistion(
      gameState.position,
      gameState.direction,
      gameState.L,
      gameState.C
    );
    // Let's ask our state machine a simple quesiton
    // What should we do if we want to move from current state to the next state of the next position with respect to the boos value
    commands = transition(
      gameState.stateMap[gameState.position[0]][gameState.position[1]],
      gameState.stateMap[nextPoition[0]][nextPoition[1]],
      gameState.isBoost
    );
    console.log(commands);
    // The answer is a list of commands
    commands.forEach((command) => {
      console.log(command.name, countery);
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

          console.log(
            "nextPoition is: ",
            nextPoition,
            " position is ",
            gameState.position,
            " and visited is",
            gameState.visited
          );
          break;
        case "deleteBlocker":
          command["action"](nextPoition, gameState.stateMap);
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
        case "lookAround":
          // execute the command action
          console.log("before lookAround :", gameState);
          const [direction1, nextPoition1, stop1] = command["action"](
            gameState.priorities,
            getNextPistion,
            gameState.position,
            gameState.stateMap,
            gameState.isBoost,
            gameState.visited,
            gameState.L,
            gameState.C
          );
          console.log("look around :", direction1, nextPoition1, stop1);
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
    });
    setHistory([...history, { ...gameState }]);
    //} // While
    console.log("visited ", gameState.visited);
    return gameState.instructions;
  }
  buildHistory = () => {
    const instructions = getInstructions();
    console.log("solution: ", instructions);
  };
  return (
    <>
      Dimenstion {gameState.L} {gameState.C} and starting postion [
      {gameState.position[0]},{gameState.position[1]}]
      <br />
      Instructions {gameState.instructions}
      <br />
      Visisted {gameState.visited}
      <div className="game">
        <div className="game-board">
          <Board stateMap={gameState.stateMap} position={gameState.position} />
          <button onClick={() => buildHistory()}>Get Instructions</button>
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
        <div className="inputArea">
          <InputArea parseUserInput={parseUserInput}></InputArea>
        </div>
      </div>
    </>
  );
}
