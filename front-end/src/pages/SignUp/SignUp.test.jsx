import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignUp from "./SignUp";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Mock firebase/auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn()
}));

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("SignUp Component", () => {
  beforeEach(() => {
    createUserWithEmailAndPassword.mockReset();
  });

  test("renders input fields and button", () => {
    renderWithRouter(<SignUp />);
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
  });

  test("displays error if email is already in use", async () => {
    createUserWithEmailAndPassword.mockRejectedValue({
      code: "auth/email-already-in-use"
    });

    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(/already in use/i)).toBeInTheDocument();
    });
  });

  test("displays error for weak password", async () => {
    createUserWithEmailAndPassword.mockRejectedValue({
      code: "auth/weak-password"
    });

    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: "weak@pass.com" } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(/too weak/i)).toBeInTheDocument();
    });
  });

  test("calls Firebase createUserWithEmailAndPassword with correct params", async () => {
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: "test123" }
    });

    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: "test@domain.com" } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: "strongPassword" } });
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), "test@domain.com", "strongPassword");
    });
  });

  test("navigates after successful sign up", async () => {
    const mockNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockNavigate
    }));

    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: "test123" }
    });

    renderWithRouter(<SignUp />);
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: "test@domain.com" } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: "strongPassword" } });
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
