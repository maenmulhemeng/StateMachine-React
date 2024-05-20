export const initialState = {
  priorities: ["SOUTH", "EAST", "NORTH", "WEST"],
  teleports: [],
  direction: "SOUTH",
  visited: [],
  instructions: [],
  L: 0,
  C: 0,
  position: [],
  isBoost: false,
  stateMap: [],
};
export const reducer = (state, action) => {
  switch (action.type) {
    case "setVisited":
      return { ...state, visited: [...action.payload] };
    case "setInstructions":
      return { ...state, instructions: [...action.payload] };
    case "setTeleports":
      return { ...state, teleports: [...action.payload] };
    case "setDirection":
      return { ...state, direction: action.payload };
    case "setL":
      return { ...state, L: action.payload };
    case "setC":
      return { ...state, C: action.payload };
    case "setPosition":
      return { ...state, position: action.payload };
    case "setIsBoost":
      return { ...state, isBoost: action.payload };
    case "setStateMap":
      return { ...state, stateMap: action.payload };
    case "addVisit":
      return { ...state, visited: [...state.visited, action.payload] };
    case "addInstructions":
      return {
        ...state,
        instructions: [...state.instructions, action.payload],
      };
    case "reversePriorities":
      return { ...state, priorities: [...priorities].reverse() };
    case "setGameState":
      return { ...action.payload };
    case "deleteBlocker":
      return {
        ...state,
        stateMap: [
          ...state.stateMap.map((r, i) =>
            i == action.payload[0]
              ? [...r.map((c, j) => (j == action.payload[1] ? "blank" : c))]
              : [...r],
          ),
        ],
      };
    default:
      return state;
  }
};
