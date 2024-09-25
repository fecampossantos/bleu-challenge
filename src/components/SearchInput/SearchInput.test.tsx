import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchInput from "./index";

describe("SearchInput Component", () => {
  const mockSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rendes component", async () => {
    render(<SearchInput search={mockSearch} />);

    expect(
      screen.getByPlaceholderText("search pools by id")
    ).toBeInTheDocument();
  });

  it("calls search func after debounce", async () => {
    const ID =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    render(<SearchInput search={mockSearch} />);

    const input = screen.getByPlaceholderText("search pools by id");
    fireEvent.change(input, {
      target: {
        value: ID,
      },
    });

    await waitFor(() => expect(mockSearch).toHaveBeenCalledWith(ID));
  });

  it("shows error for invalid input", async () => {
    render(<SearchInput search={mockSearch} />);

    const input = screen.getByPlaceholderText("search pools by id");
    fireEvent.change(input, { target: { value: "invalid" } });

    await waitFor(() => expect(input).toHaveClass("error"));
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it("clears error and does not search when input is empty", async () => {
    render(<SearchInput search={mockSearch} />);

    const input = screen.getByPlaceholderText("search pools by id");
    fireEvent.change(input, { target: { value: "" } });

    await waitFor(() => expect(input).not.toHaveClass("error"));
    expect(mockSearch).not.toHaveBeenCalled();
  });
});
