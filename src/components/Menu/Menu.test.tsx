import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Menu from "./index";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";

jest.mock("@apollo/client", () => ({
  useQuery: jest.fn(),
  gql: jest.fn(),
}));

jest.mock("wagmi", () => ({
  useAccount: jest.fn(),
}));

describe("Menu Component", () => {
  const mockUpdatePoolId = jest.fn();
  const mockUseAccount = {
    address: "0x1234",
  };

  beforeEach(() => {
    (useAccount as jest.Mock).mockReturnValue(mockUseAccount);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      data: null,
    });

    render(<Menu updatePoolId={mockUpdatePoolId} />);

    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: new Error("Test Error"),
      data: null,
    });

    render(<Menu updatePoolId={mockUpdatePoolId} />);

    expect(screen.getByText("something went wrong")).toBeInTheDocument();
  });

  it("renders pools", async () => {
    const mockData = {
      pools: [{ id: "0xabcdef1234" }, { id: "0x56789abcdef" }],
    };

    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: mockData,
    });

    render(<Menu updatePoolId={mockUpdatePoolId} />);

    expect(screen.getByText("0xab...234")).toBeInTheDocument();
    expect(screen.getByText("0x56...def")).toBeInTheDocument();
  });

  it("calls updatePoolId on pool click", () => {
    const mockData = {
      pools: [{ id: "0xabcdef1234" }],
    };

    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: mockData,
    });

    render(<Menu updatePoolId={mockUpdatePoolId} />);

    const button = screen.getByText("0xab...234");
    fireEvent.click(button);

    expect(mockUpdatePoolId).toHaveBeenCalledWith("0xabcdef1234");
  });

  it("renders no pools when no pools available", () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: { pools: [] },
    });

    render(<Menu updatePoolId={mockUpdatePoolId} />);

    expect(screen.getByText("no pools")).toBeInTheDocument();
  });
});
