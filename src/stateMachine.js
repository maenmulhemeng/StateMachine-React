function move(nextPoition) {
  return nextPoition;
}
// This funciton returns the value the represent heading north
function changeDirectionToNorth() {
  return "NORTH";
}
// This funciton returns the value the represent heading west
function changeDirectionToWest() {
  return "WEST";
}
// This funciton returns the value the represent heading east
function changeDirectionToEast() {
  return "EAST";
}
// This funciton returns the value the represent heading south
function changeDirectionToSouth() {
  return "SOUTH";
}
// This funciton accepts a list as a parameter and reverse it
function reversePriorities(priorities) {
  priorities.reverse();
  return priorities;
}
// This funciton toggle the boost value
function toggleBoost(boost) {
  return !boost;
}
// This function finds the other teleporters and returns it
function teleport(teleportPosition, teleports) {
  return teleports.filter(
    (t) => t[0] != teleportPosition[0] && t[1] != teleportPosition[1],
  )[0];
}
// With respect to the prioritized dicrections, this function finds to which direction
// we should look at to escape from blockers like @ or x without boost power
function lookAround(
  priorities,
  getNextPistion,
  position,
  stateMap,
  isBoost,
  visited,
  L,
  C,
) {
  // No direction until we find one
  let foundDirection = false;
  let resultDirection = "";
  let resultNextPoition = [];
  // Let's check our priorities
  priorities.forEach((possibleDirection) => {
    // Let's look toward the position of the suggested direction
    const positionOfPossibleState = getNextPistion(
      position,
      possibleDirection,
      L,
      C,
    );
    // And then let's get its state
    const possibleState =
      stateMap[positionOfPossibleState[0]][positionOfPossibleState[1]];
    // if the next state is not a blocker @ and now an x without boost and the next position has not beed visited and we haven't seen
    // a good direction to look at
    if (
      !(
        possibleState == "#" ||
        (possibleState == "x" && !isBoost) ||
        foundDirection ||
        visited.includes(positionOfPossibleState)
      )
    ) {
      // We'll consider this direction a good potential to look at
      resultDirection = possibleDirection;
      // And we'll take its state
      resultNextPoition = positionOfPossibleState;
      // Direction found
      foundDirection = true;
      // Let's return them
      return;
    }
  });
  return [resultDirection, resultNextPoition, foundDirection];
}
// This action remove change the state into blank
function deleteBlocker(position, stateMap) {
  stateMap[position[0]][position[1]] = "blank";
}

export function useStateMachine() {
  const commandMove = { name: "move", action: move };
  const commandLookAround = { name: "lookAround", action: lookAround };
  const commandImpossible = { name: "impossible" };
  const commandDone = { name: "done" };
  const commandChangeDirectionToNorth = {
    name: "changeDirection",
    action: changeDirectionToNorth,
  };
  const commandChangeDirectionToWest = {
    name: "changeDirection",
    action: changeDirectionToWest,
  };
  const commandChangeDirectionToSouth = {
    name: "changeDirection",
    action: changeDirectionToSouth,
  };
  const commandChangeDirectionToEast = {
    name: "changeDirection",
    action: changeDirectionToEast,
  };
  const commandReverse = { name: "reverse", action: reversePriorities };
  const commandBoost = { name: "boost", action: toggleBoost };
  const commandTeleporters = { name: "teleporters", action: teleport };
  const commandLoop = { name: "loop" };
  const commandDeleteBlocker = { name: "deleteBlocker", action: deleteBlocker };

  const stateMachine = {
    blank: {
      blank: [commandMove],
      "#": [commandLookAround],
      x: [commandLookAround],
      $: [commandMove],
      "@": [commandMove],
      N: [commandMove, commandChangeDirectionToNorth],
      W: [commandMove, commandChangeDirectionToWest],
      E: [commandMove, commandChangeDirectionToEast],
      S: [commandMove, commandChangeDirectionToSouth],
      I: [commandMove, commandReverse],
      B: [commandMove, commandBoost],
      T: [commandMove, commandTeleporters],
    },
    "#": {
      blank: [commandImpossible],
      "#": [commandImpossible],
      x: [commandImpossible],
      $: [commandImpossible],
      "@": [commandImpossible],
      N: [commandImpossible],
      W: [commandImpossible],
      E: [commandImpossible],
      S: [commandImpossible],
      I: [commandImpossible],
      B: [commandImpossible],
      T: [commandImpossible],
    },
    x: {
      blank: [commandMove],
      "#": [commandImpossible],
      x: [commandImpossible],
      $: [commandMove],
      "@": [commandMove],
      N: [commandMove, commandChangeDirectionToNorth],
      W: [commandMove, commandChangeDirectionToWest],
      E: [commandMove, commandChangeDirectionToEast],
      S: [commandMove, commandChangeDirectionToSouth],
      I: [commandMove, commandReverse],
      B: [commandMove, commandBoost],
      T: [commandMove, commandTeleporters],
    },
    $: {
      blank: [commandDone],
      "#": [commandDone],
      x: [commandDone],
      $: [commandDone],
      "@": [commandDone],
      N: [commandMove, commandChangeDirectionToNorth],
      W: [commandMove, commandChangeDirectionToWest],
      E: [commandMove, commandChangeDirectionToEast],
      S: [commandMove, commandChangeDirectionToSouth],
      I: [commandMove, commandReverse],
      B: [commandMove, commandBoost],
      T: [commandMove, commandTeleporters],
    },
    "@": {
      blank: [commandMove],
      "#": [commandLookAround],
      x: [commandLookAround],
      $: [commandMove],
      "@": [commandImpossible],
      N: [commandMove, commandChangeDirectionToNorth],
      W: [commandMove, commandChangeDirectionToWest],
      E: [commandMove, commandChangeDirectionToEast],
      S: [commandMove, commandChangeDirectionToSouth],
      I: [commandMove, commandReverse],
      B: [commandMove, commandBoost],
      T: [commandMove, commandTeleporters],
    },
    N: {
      blank: [commandMove],
      "#": [commandLookAround],
      x: [commandLookAround],
      $: [commandMove],
      "@": [commandMove],
      N: [commandMove, commandChangeDirectionToNorth],
      W: [commandMove, commandChangeDirectionToWest],
      E: [commandMove, commandChangeDirectionToEast],
      S: [commandMove, commandChangeDirectionToSouth],
      I: [commandMove, commandReverse],
      B: [commandMove, commandBoost],
      T: [commandMove, commandTeleporters],
    },
    W: {
      blank: [commandMove],
      "#": [commandLookAround],
      x: [commandLookAround],
      $: [commandMove],
      "@": [commandMove],
      N: [commandMove, commandChangeDirectionToNorth],
      W: [commandMove, commandChangeDirectionToWest],
      E: [commandMove, commandChangeDirectionToEast],
      S: [commandMove, commandChangeDirectionToSouth],
      I: [commandMove, commandReverse],
      B: [commandMove, commandBoost],
      T: [commandMove, commandTeleporters],
    },
    E: {
      blank: [commandMove],
      "#": [commandLookAround],
      x: [commandLookAround],
      $: [commandMove],
      "@": [commandMove],
      N: [commandMove, commandChangeDirectionToNorth],
      W: [commandMove, commandChangeDirectionToWest],
      E: [commandMove, commandChangeDirectionToEast],
      S: [commandMove, commandChangeDirectionToSouth],
      I: [commandMove, commandReverse],
      B: [commandMove, commandBoost],
      T: [commandMove, commandTeleporters],
    },
    S: {
      blank: [commandMove],
      "#": [commandLookAround],
      x: [commandLookAround],
      $: [commandMove],
      "@": [commandMove],
      N: [commandMove, commandChangeDirectionToNorth],
      W: [commandMove, commandChangeDirectionToWest],
      E: [commandMove, commandChangeDirectionToEast],
      S: [commandMove, commandChangeDirectionToSouth],
      I: [commandMove, commandReverse],
      B: [commandMove, commandBoost],
      T: [commandMove, commandTeleporters],
    },
    I: {
      blank: [commandMove],
      "#": [commandLookAround],
      x: [commandLookAround],
      $: [commandMove],
      "@": [commandMove],
      N: [commandMove, commandChangeDirectionToNorth],
      W: [commandMove, commandChangeDirectionToWest],
      E: [commandMove, commandChangeDirectionToEast],
      S: [commandMove, commandChangeDirectionToSouth],
      I: [commandMove, commandReverse],
      B: [commandMove, commandBoost],
      T: [commandMove, commandTeleporters],
    },
    B: {
      blank: [commandMove],
      "#": [commandLookAround],
      x: [commandLookAround],
      $: [commandMove],
      "@": [commandMove],
      N: [commandMove, commandChangeDirectionToNorth],
      W: [commandMove, commandChangeDirectionToWest],
      E: [commandMove, commandChangeDirectionToEast],
      S: [commandMove, commandChangeDirectionToSouth],
      I: [commandMove, commandReverse],
      B: [commandMove, commandBoost],
      T: [commandMove, commandTeleporters],
    },
    T: {
      blank: [commandMove],
      "#": [commandLookAround],
      x: [commandLookAround],
      $: [commandMove],
      "@": [commandMove],
      N: [commandMove, commandChangeDirectionToNorth],
      W: [commandMove, commandChangeDirectionToWest],
      E: [commandMove, commandChangeDirectionToEast],
      S: [commandMove, commandChangeDirectionToSouth],
      I: [commandMove, commandReverse],
      B: [commandMove, commandBoost],
      T: [commandLoop],
    },
  };

  // Transition Funcion is (state1,state2)=>commands and by executing these commands we'll move from state1 to state2
  function transition(currentState, nextState, isBoost) {
    // For the special case of facing a blocker x when we have the boost power
    // We'd return the command immediately
    if (nextState == "x" && isBoost) {
      return [commandMove, commandDeleteBlocker];
      // But for the other cases we'll ask the state machine table
    }
    return stateMachine[currentState][nextState];
  }

  return [transition];
}
