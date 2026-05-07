import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar, StatusFilter } from "./FilterBar";

const makeProps = (overrides = {}) => ({
  search: "",
  status: "" as StatusFilter,
  onSearchChange: vi.fn(),
  onStatusChange: vi.fn(),
  ...overrides,
});

describe("FilterBar", () => {
  it("renders search input", () => {
    render(<FilterBar {...makeProps()} />);
    expect(screen.getByPlaceholderText("Search by name, species...")).toBeInTheDocument();
  });

  it("calls onSearchChange when typing", async () => {
    const onSearchChange = vi.fn();
    render(<FilterBar {...makeProps({ onSearchChange })} />);
    await userEvent.type(screen.getByPlaceholderText("Search by name, species..."), "Rick");
    expect(onSearchChange).toHaveBeenCalled();
    expect(onSearchChange).toHaveBeenLastCalledWith("k");
  });

  it("shows clear button when search has value and clears on click", async () => {
    const onSearchChange = vi.fn();
    render(<FilterBar {...makeProps({ search: "Rick", onSearchChange })} />);
    await userEvent.click(screen.getByLabelText("Clear"));
    expect(onSearchChange).toHaveBeenCalledWith("");
  });

  it("renders status select", () => {
    render(<FilterBar {...makeProps()} />);
    expect(screen.getByText(/all status/i)).toBeInTheDocument();
  });
});
