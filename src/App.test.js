import { render, screen, fireEvent } from "@testing-library/react";
import { InputArea, Square } from "./App";

describe("Testing App", () => {
  it("it should set [square currentPosition] classes in Square when isCurrentPosition", () => {
    render(<Square value={"@"} isCurrentPosition={true} isVisited={false} />);
    const divWithAt = screen.getByText(/@/i);
    expect(divWithAt.className).toBe("square currentPosition");
  });

  it("it should set [square visited] classes in Square when isVisited", () => {
    render(
      <Square value={"@"} isCurrentPosition={false} isVisited={() => true} />,
    );
    const divWithAt = screen.getByText(/@/i);
    expect(divWithAt.className).toBe("square visited");
  });

  it("it should set [square] classes in Square when isVisited", () => {
    render(
      <Square value={"@"} isCurrentPosition={false} isVisited={() => false} />,
    );
    const divWithAt = screen.getByText(/@/i);
    expect(divWithAt.className).toBe("square");
  });

  it("it should show disabled parse button at the begining", () => {
    const { container } = render(<InputArea parseUserInput={() => {}} />);
    const elem = screen.getByText(/Parse/i).closest("button");
    expect(elem.attributes["disabled"]).toBeTruthy();
  });

  it("it should show enabled Parse button when userInput has value", () => {
    const { container } = render(<InputArea parseUserInput={() => {}} />);
    const elem = screen.getByText(/Parse/i).closest("button");
    const textArea = container.querySelector("textarea");
    fireEvent.change(textArea, { target: { value: "23" } });
    expect(elem.attributes["disabled"]).toBeFalsy();
  });
});
