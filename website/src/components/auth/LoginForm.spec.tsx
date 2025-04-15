// https://redux.js.org/usage/writing-tests
// https://stackoverflow.com/questions/69125633/mocking-nextjs-router-events-with-jest
import { fireEvent, screen } from "@testing-library/react";
import axios from "axios";

import { renderWithProviders } from "@/lib/utils/test-utils";

import LoginForm from "./LoginForm";

jest.mock("axios");

const mockedAxios = axios as jest.MockedFunction<typeof axios>;

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
  beforeAll(() => {
    // Mock console.error
    consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore console.error after all tests
    consoleErrorMock.mockRestore();
  });

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

  it("should show validation error for incorrect email", async () => {
    renderWithProviders(<LoginForm />);
    fireEvent.change(screen.getByTestId(/email/i), {
      target: { value: "email.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    expect(
      await screen.findByText(/Informe um e-mail válido/i)
    ).toBeInTheDocument();
  });

  it("should show validation error for correct email and invalid password", async () => {
    renderWithProviders(<LoginForm />);
    fireEvent.change(screen.getByTestId(/email/i), {
      target: { value: "email.com" },
    });
    fireEvent.change(screen.getByTestId(/password/i), {
      target: { value: "1234" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    expect(await screen.findByText(/Informe a senha/i)).toBeInTheDocument();
  });

  it("should make axios auth request when all fields are valid and request fails", async () => {
    renderWithProviders(<LoginForm />);
    fireEvent.change(screen.getByTestId(/email/i), {
      target: { value: "testes@testes.com.br" },
    });
    fireEvent.change(screen.getByTestId(/password/i), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    expect(await screen.findByText(/Aviso/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Token de acesso não recebido./i)
    ).toBeInTheDocument();
  });

  it("should make axios auth request when all fields are valid and request succeed without a access token", async () => {
    mockedAxios.mockResolvedValue({ status: 200, data: {} });
    renderWithProviders(<LoginForm />);
    fireEvent.change(screen.getByTestId(/email/i), {
      target: { value: "testes@testes.com.br" },
    });
    fireEvent.change(screen.getByTestId(/password/i), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    expect(await screen.findByText(/Aviso/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Token de acesso não recebido./i)
    ).toBeInTheDocument();
  });

  it("should make axios auth request when all fields are valid and request succeed with invalid token and invalid user", async () => {
    (mockedAxios.post as jest.Mock).mockResolvedValue({
      status: 200,
      data: { accessToken: "valid_token" },
    });
    const { rerender } = renderWithProviders(<LoginForm />);
    fireEvent.change(screen.getByTestId(/email/i), {
      target: { value: "testes@testes.com.br" },
    });
    fireEvent.change(screen.getByTestId(/password/i), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    expect(await screen.findByText(/Aviso/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Usuário não encontrado/i)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(/error-dialog-button/i));

    expect(await screen.queryByText(/Aviso/i)).not.toBeInTheDocument();

    rerender(<LoginForm />);

    expect(await screen.queryByText(/Aviso/i)).not.toBeInTheDocument();

    expect(await screen.findByText(/Entre na sua conta/i)).toBeInTheDocument();
  });
});
