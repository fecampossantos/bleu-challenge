import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PinataFile from "./index";
import { pinata } from "../../utils/pinata/config";

jest.mock("wagmi", () => ({
  useReadContract: jest.fn().mockReturnValue({
    data: "mockReadContractData",
    isError: false,
    isLoading: false,
    error: null,
  }),
  useWriteContract: jest.fn().mockReturnValue({
    writeContract: jest.fn(),
  }),
}));

jest.mock("../../utils/pinata/config", () => ({
  pinata: {
    gateways: {
      get: jest.fn(),
    },
    upload: {
      file: jest.fn().mockReturnValue({
        IpfsHash: "mockIpfsHash",
      }),
    },
  },
}));

describe("PinataFile Component", () => {
  beforeEach(() => {
    (pinata.gateways.get as jest.Mock).mockResolvedValue({
      data: "mockFileData",
    });
  });

  it("renders textarea with initial content", async () => {
    render(<PinataFile poolID="0x123" />);

    await waitFor(() => {
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("mockFileData");
    });
  });

  it("enables editing when edit button is clicked", async () => {
    render(<PinataFile poolID="0x123" />);

    const editButton = screen.getByRole("button");
    fireEvent.click(editButton);

    const textarea = screen.getByRole("textbox");
    expect(textarea).not.toHaveAttribute("readonly");
  });

  it("disables editing and cancels changes when cancel button is clicked", async () => {
    render(<PinataFile poolID="0x123" />);

    const editButton = screen.getByRole("button");
    fireEvent.click(editButton);

    const cancelButton = screen.getByTestId("edit-button");
    fireEvent.click(cancelButton);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("readonly");
  });

  it("shows 'no pool selected' when no poolID is provided", () => {
    render(<PinataFile poolID={undefined} />);
    expect(screen.getByText(/no pool selected/i)).toBeInTheDocument();
  });
});
