import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { BrowserRouter } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

// Mock Firebase methods
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
}));

jest.mock("../../firebase", () => ({
  auth: {},
  provider: {},
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders email and password inputs and buttons", () => {
    renderWithRouter(<Login />);
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In with Google/i })).toBeInTheDocument();
  });

  test("handles successful email/password login", async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: "123" } });

    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
    });
  });

  test("shows alert on failed email/password login", async () => {
    window.alert = jest.fn(); // Mock alert
    signInWithEmailAndPassword.mockRejectedValue(new Error("Invalid credentials"));

    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: "wrong@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invalid credentials.");
    });
  });

  test("handles successful Google login", async () => {
    window.alert = jest.fn();
    signInWithPopup.mockResolvedValue({ user: { uid: "456" } });

    renderWithRouter(<Login />);
    fireEvent.click(screen.getByRole("button", { name: /Sign In with Google/i }));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Login successful!");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("shows alert on failed Google login", async () => {
    window.alert = jest.fn();
    signInWithPopup.mockRejectedValue(new Error("Google sign-in error"));

    renderWithRouter(<Login />);
    fireEvent.click(screen.getByRole("button", { name: /Sign In with Google/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invalid login attempt.");
    });
  });
});
