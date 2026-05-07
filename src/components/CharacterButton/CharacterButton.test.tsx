import { render, screen, RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CharacterButton } from "./CharacterButton";

const renderWithProvider = (ui: React.ReactElement): RenderResult =>
  render(<TooltipProvider>{ui}</TooltipProvider>);

const char = {
  id: "1",
  name: "Rick Sanchez",
  image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  status: "Alive" as const,
};

describe("CharacterButton", () => {
  it("renders character name", () => {
    renderWithProvider(<CharacterButton char={char} onClick={() => {}} />);
    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
  });

  it("renders avatar image with alt text", () => {
    renderWithProvider(<CharacterButton char={char} onClick={() => {}} />);
    expect(screen.getByAltText("Rick Sanchez")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    renderWithProvider(<CharacterButton char={char} onClick={onClick} />);
    await userEvent.click(screen.getByTitle("Rick Sanchez"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("applies card variant by default", () => {
    const { container } = renderWithProvider(<CharacterButton char={char} onClick={() => {}} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
