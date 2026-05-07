import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar, StatusFilter } from "./FilterBar";

const makeProps = (overrides = {}) => ({
  name: "",
  origin: "",
  status: "" as StatusFilter,
  groupByOrigin: false,
  onNameChange: vi.fn(),
  onOriginChange: vi.fn(),
  onStatusChange: vi.fn(),
  onGroupByOriginChange: vi.fn(),
  ...overrides,
});

describe("FilterBar", () => {
  it("renders all status chips", () => {
    render(<FilterBar {...makeProps()} />);
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Alive")).toBeInTheDocument();
    expect(screen.getByText("Dead")).toBeInTheDocument();
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("calls onNameChange when typing", async () => {
    const onNameChange = vi.fn();
    render(<FilterBar {...makeProps({ onNameChange })} />);
    await userEvent.type(screen.getByPlaceholderText("Search by name..."), "Rick");
    expect(onNameChange).toHaveBeenCalled();
    expect(onNameChange).toHaveBeenLastCalledWith("k");
  });

  it("calls onOriginChange when typing in origin input", async () => {
    const onOriginChange = vi.fn();
    render(<FilterBar {...makeProps({ onOriginChange })} />);
    await userEvent.type(screen.getByPlaceholderText("Search by origin..."), "Earth");
    expect(onOriginChange).toHaveBeenCalled();
  });

  it("calls onStatusChange with correct value when clicking Alive chip", async () => {
    const onStatusChange = vi.fn();
    render(<FilterBar {...makeProps({ onStatusChange })} />);
    await userEvent.click(screen.getByText("Alive"));
    expect(onStatusChange).toHaveBeenCalledWith("Alive");
  });

  it("calls onStatusChange with empty string when clicking All", async () => {
    const onStatusChange = vi.fn();
    render(<FilterBar {...makeProps({ onStatusChange, status: "Alive" })} />);
    await userEvent.click(screen.getByText("All"));
    expect(onStatusChange).toHaveBeenCalledWith("");
  });

  it("shows clear button when name is set and calls onNameChange with empty string", async () => {
    const onNameChange = vi.fn();
    render(<FilterBar {...makeProps({ name: "Rick", onNameChange })} />);
    const clearBtn = screen.getAllByLabelText("Clear")[0];
    await userEvent.click(clearBtn);
    expect(onNameChange).toHaveBeenCalledWith("");
  });

  it("toggles groupByOrigin when clicking Group chip", async () => {
    const onGroupByOriginChange = vi.fn();
    render(<FilterBar {...makeProps({ onGroupByOriginChange })} />);
    await userEvent.click(screen.getByText("Group"));
    expect(onGroupByOriginChange).toHaveBeenCalledWith(true);
  });
});
