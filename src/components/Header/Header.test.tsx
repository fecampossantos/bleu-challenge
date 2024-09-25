import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "./index";

jest.mock("@rainbow-me/rainbowkit", () => ({
  ConnectButton: jest.fn(() => <div>Mocked ConnectButton</div>),
}));

jest.mock("../SearchInput", () =>
  jest.fn(({ search }) => (
    <input
      data-testid="search-input"
      onChange={(e) => search(e.target.value)}
    />
  ))
);

describe("Header Component", () => {
  const mockSearch = jest.fn();

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders the header with SearchInput and ConnectButton", () => {
    render(<Header search={mockSearch} />);

    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByText("Mocked ConnectButton")).toBeInTheDocument();
  });

  it("retrieves and displays recent searches from localStorage", () => {
    localStorage.setItem("@bleu-task-recent-searches", "search1,search2");

    render(<Header search={mockSearch} />);

    expect(screen.getByText("Recent")).toBeInTheDocument();
    expect(screen.getByText("search1")).toBeInTheDocument();
    expect(screen.getByText("search2")).toBeInTheDocument();
  });

  it("handles search input and updates recent searches", async () => {
    render(<Header search={mockSearch} />);

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "new search" } });

    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith("new search");
    });

    const recentSearches = localStorage.getItem("@bleu-task-recent-searches");
    expect(recentSearches).toBe("new search");
  });

  it("adds new search to recent searches without duplicates", () => {
    localStorage.setItem("@bleu-task-recent-searches", "search1,search2");

    render(<Header search={mockSearch} />);

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "search1" } });

    const recentSearches = localStorage.getItem("@bleu-task-recent-searches");
    expect(recentSearches).toBe("search1,search2");
  });

  it("limits recent searches to 5 items", () => {
    localStorage.setItem(
      "@bleu-task-recent-searches",
      "search1,search2,search3,search4,search5"
    );

    render(<Header search={mockSearch} />);

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "search6" } });

    const recentSearches = localStorage.getItem("@bleu-task-recent-searches");
    expect(recentSearches).toBe("search6,search1,search2,search3,search4");
  });

  it("allows clicking on recent searches", () => {
    localStorage.setItem("@bleu-task-recent-searches", "search1");

    render(<Header search={mockSearch} />);

    const recentSearchButton = screen.getByText("search1");
    fireEvent.click(recentSearchButton);

    expect(mockSearch).toHaveBeenCalledWith("search1");
  });
});
