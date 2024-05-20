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
