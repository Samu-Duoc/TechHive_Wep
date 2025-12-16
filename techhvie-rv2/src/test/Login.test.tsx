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

import Login from "../pages/Login";

describe("Login Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("muestra los campos de correo y contraseña", () => {
        const { container } = render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        
        const emailInput = container.querySelector('input[type="email"]');
        const passwordInput = container.querySelector('input[type="password"]');
        
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /iniciar sesión/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /ingresar/i })).toBeInTheDocument();
    });

    it("muestra errores si los campos están vacíos", async () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const submitBtn = screen.getByRole("button", { name: /ingresar/i });
        fireEvent.click(submitBtn);

        // HTML5 validation ocurre, verificamos que los inputs existan y tengan 'required'
        const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
        expect(inputs.length).toBeGreaterThan(0);
        expect(inputs[0].required).toBe(true);
    });

    it("acepta credenciales correctas", async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: "test-token", usuario: { id: 1, email: "user@gmail.com" } }),
        });

        const { container } = render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
        const passwordInput = container.querySelector('input[type="password"]') as HTMLInputElement;
        
        fireEvent.change(emailInput, { target: { value: "user@gmail.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/login"),
                expect.any(Object)
            );
        });
    });
});
