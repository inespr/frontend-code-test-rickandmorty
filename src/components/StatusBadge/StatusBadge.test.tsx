import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders Alive status text", () => {
    render(<StatusBadge status="Alive" />);
    expect(screen.getByText("Alive")).toBeInTheDocument();
  });

  it("renders Dead status text", () => {
    render(<StatusBadge status="Dead" />);
    expect(screen.getByText("Dead")).toBeInTheDocument();
  });

  it("renders unknown status text", () => {
    render(<StatusBadge status="unknown" />);
    expect(screen.getByText("unknown")).toBeInTheDocument();
  });
});
