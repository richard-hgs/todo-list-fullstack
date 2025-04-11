// https://redux.js.org/usage/writing-tests
// https://stackoverflow.com/questions/69125633/mocking-nextjs-router-events-with-jest
import { fireEvent, screen } from "@testing-library/react";

import { renderWithProviders } from "@/lib/utils/test-utils";

import LoginForm from "./LoginForm";

jest.mock("axios");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    pathname: "/",
    push: jest.fn(),
    replace: jest.fn(),
    query: {},
    asPath: "/",
    isReady: true,
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
    prefetch: jest.fn().mockResolvedValue(undefined),
  }),
}));
describe("LoginForm", () => {
  it("should render the form", () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByText(/Entre na sua conta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
  });

  it("should show validation errors for empty fields", async () => {
    renderWithProviders(<LoginForm />);
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    expect(
      await screen.findByText(/Informe um e-mail válido/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/Informe a senha/i)).toBeInTheDocument();
  });

  it("should show validation error for invalid email", async () => {
    renderWithProviders(<LoginForm />);
    fireEvent.change(screen.getByTestId(/email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    expect(
      await screen.findByText(/Informe um e-mail válido/i)
    ).toBeInTheDocument();
  });

  it("should show validation error for invalid password", async () => {
    renderWithProviders(<LoginForm />);
    fireEvent.change(screen.getByTestId(/password/i), {
      target: { value: " " },
    });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    expect(await screen.findByText(/Informe a senha/i)).toBeInTheDocument();
  });

  it("should show validation error for password less than 6 digits", async () => {
    renderWithProviders(<LoginForm />);
    fireEvent.change(screen.getByTestId(/password/i), {
      target: { value: "12345" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    expect(await screen.findByText(/Informe a senha/i)).toBeInTheDocument();
  });
});
