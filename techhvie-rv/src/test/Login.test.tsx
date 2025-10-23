import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Siimular rutas
import Login from "../pages/Login"; // Importamos el componente que vamos a testear

// Bloque principal de pruebas: todas las pruebas relacionadas con el componente Login
describe("Login Component", () => {
  // PRUEBA 1: Verificar que los campos se muestren correctamente
    it("muestra los campos de correo y contraseña", () => {
    // Renderizamos el componente dentro de un MemoryRouter simulado
    render(
        <MemoryRouter>
            <Login onLoginSuccess={() => {}} />
        </MemoryRouter>
    );
    // Verificamos que los inputs del formulario estén presentes en el DOM simulado
    expect(screen.getByLabelText(/correo electrónico|email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    // También comprobamos que el botón 'Ingresar' esté visible
    expect(screen.getByRole("button", { name: /ingresar/i })).toBeInTheDocument();
    });

  // PRUEBA 2: Validar comportamiento cuando los campos están vacíos
    it("muestra errores si los campos están vacíos", async () => {
    render(
        <MemoryRouter>
            <Login onLoginSuccess={() => {}} />
        </MemoryRouter>
    );
    // Simulamos que el usuario presiona el botón 'Ingresar' sin escribir nada
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    // Buscar errores de validación
    expect(await screen.findByText(/el correo es obligatorio/i)).toBeInTheDocument();
    expect(await screen.findByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
    });

  // PRUEBA 3: Validar credenciales correctas
    it("acepta credenciales correctas", async () => {
    const onLoginSuccess = vi.fn(); // función simulada

    render(
        <MemoryRouter>
            <Login onLoginSuccess={onLoginSuccess} />
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/correo electrónico|email/i), { target: { value: "user@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "1234" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    // onLoginSuccess debe haberse llamado
    expect(onLoginSuccess).toHaveBeenCalled();
    });
});
