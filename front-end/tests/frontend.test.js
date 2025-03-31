import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import SignUp from "../src/pages/SignUp/SignUp";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));

describe("SignUp Component", () => {
  test("should display an error message when signing up with an invalid email", async () => {
    createUserWithEmailAndPassword.mockRejectedValueOnce({
      code: "auth/invalid-email",
    });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email:/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText(/password:/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText(/register/i));

    await waitFor(() => {
      expect(screen.getByText("The email address is not valid.")).toBeInTheDocument();
    });
  });

  test("should call createUserWithEmailAndPassword when clicking register", async () => {
    createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { email: "test@example.com" },
    });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email:/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password:/i), {
      target: { value: "strongpassword" },
    });

    fireEvent.click(screen.getByText(/register/i));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com",
        "strongpassword"
      );
    });
  });
});
