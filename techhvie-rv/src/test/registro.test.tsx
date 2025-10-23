import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../pages/registro";

describe("Register Component", () => {
  it("muestra todos los campos del formulario de registro", () => {
    render(
      <MemoryRouter>
        <Register onRegisterSuccess={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/soy mayor de edad/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /registrarse/i })).toBeInTheDocument();
  });

  it("muestra errores cuando se envía el formulario vacío", async () => {
    render(
      <MemoryRouter>
        <Register onRegisterSuccess={() => {}} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

    expect(await screen.findByText(/el nombre de usuario es obligatorio/i)).toBeInTheDocument();
    expect(await screen.findByText(/el correo es obligatorio/i)).toBeInTheDocument();
    expect(await screen.findByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
    expect(await screen.findByText(/debes ser mayor de edad para registrarte/i)).toBeInTheDocument();
  });

  it("valida el formato del email", async () => {
    render(
      <MemoryRouter>
        <Register onRegisterSuccess={() => {}} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "emailinvalido" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: "1234" },
    });
    fireEvent.click(screen.getByLabelText(/soy mayor de edad/i));
    fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

    expect(await screen.findByText(/formato de correo inválido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toHaveClass("form-control", "is-invalid");
  });

  it("valida la longitud de la contraseña", async () => {
    render(
      <MemoryRouter>
        <Register onRegisterSuccess={() => {}} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

    expect(await screen.findByText(/la contraseña debe tener al menos 4 caracteres/i)).toBeInTheDocument();
  });

  it("realiza el registro con credenciales válidas", async () => {
    const onRegisterSuccess = vi.fn();

    render(
      <MemoryRouter>
        <Register onRegisterSuccess={onRegisterSuccess} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "demo@gmail.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: "1234" },
    });
    fireEvent.click(screen.getByLabelText(/soy mayor de edad/i));
    fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

    expect(onRegisterSuccess).toHaveBeenCalled();
  });

  it("muestra error cuando las contraseñas no coinciden", async () => {
    render(
      <MemoryRouter>
        <Register onRegisterSuccess={() => {}} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: "5678" },
    });
    fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

    expect(await screen.findByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
  });
});