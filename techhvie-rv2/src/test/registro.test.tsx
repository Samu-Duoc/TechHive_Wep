import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock the AuthContext
vi.mock("../context/AuthContext", () => ({
    useAuth: () => ({
        login: vi.fn(),
    }),
}));

// Mock fetch
global.fetch = vi.fn();

import RegisterIn from "../pages/registro";

describe("Register Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Muestra los campos del formulario de registro", () => {
        const { container } = render(
            <MemoryRouter>
                <RegisterIn />
            </MemoryRouter>
        );
        
        // Buscamos inputs por sus atributos name
        expect(container.querySelector('input[name="nombre"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="apellido"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="rut"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="email"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="password"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="telefono"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="direccion"]')).toBeInTheDocument();
    });

    it("Muestra mensaje de error si los campos están vacíos al enviar el formulario", async () => {
        render(
            <MemoryRouter>
                <RegisterIn />
            </MemoryRouter>
        );
        
        const submitButton = screen.getByRole("button", { name: /registrarse/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Nombre obligatorio")).toBeInTheDocument();
            expect(screen.getByText("Apellido obligatorio")).toBeInTheDocument();
            expect(screen.getByText("Correo obligatorio")).toBeInTheDocument();
            expect(screen.getByText("Teléfono obligatorio")).toBeInTheDocument();
            expect(screen.getByText("Dirección obligatoria")).toBeInTheDocument();
        });
    });

    it("Muestra mensaje de exito al enviar el formulario con datos validos", async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 1, email: "juan@gmail.com" }),
        });

        const { container } = render(
            <MemoryRouter>
                <RegisterIn />
            </MemoryRouter>
        );

        const nameInput = container.querySelector('input[name="nombre"]') as HTMLInputElement;
        const lastNameInput = container.querySelector('input[name="apellido"]') as HTMLInputElement;
        const rutInput = container.querySelector('input[name="rut"]') as HTMLInputElement;
        const emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
        const passwordInput = container.querySelector('input[name="password"]') as HTMLInputElement;
        const phoneInput = container.querySelector('input[name="telefono"]') as HTMLInputElement;
        const addressInput = container.querySelector('input[name="direccion"]') as HTMLInputElement;
        const respuestaSecurityInput = container.querySelector('input[name="respuestaSeguridad"]') as HTMLInputElement;
        const termsCheckbox = container.querySelector('input[name="termCond"]') as HTMLInputElement;
        const submitButton = screen.getByRole("button", { name: /registrarse/i });

        fireEvent.change(nameInput, { target: { value: "Juan" } });
        fireEvent.change(lastNameInput, { target: { value: "Perez" } });
        fireEvent.change(rutInput, { target: { value: "12345678-9" } });
        fireEvent.change(emailInput, { target: { value: "juan@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "Password123!" } });
        fireEvent.change(phoneInput, { target: { value: "+56912345678" } });
        fireEvent.change(addressInput, { target: { value: "Calle Principal 123" } });
        fireEvent.change(respuestaSecurityInput, { target: { value: "Fluffy" } });
        fireEvent.click(termsCheckbox);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/registro"),
                expect.any(Object)
            );
        });
    });
});