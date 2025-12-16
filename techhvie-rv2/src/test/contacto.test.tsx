import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock axios
vi.mock('axios', () => ({
    default: {
        post: vi.fn((url, data) => {
            if (url === "http://localhost:8085/contacto/guardar") {
                return Promise.resolve({ status: 200 });
            }
            return Promise.reject(new Error('Request failed'));
        })
    }
}));

import Contacto from "../pages/contacto";

describe("Contact Page", () => {
    it("Muestra los campos Nombre, correo y mensaje/consulta", () => {
        render(
            <MemoryRouter>
                <Contacto />
            </MemoryRouter>
        );

        expect(screen.getByLabelText("Nombre:")).toBeInTheDocument();
        expect(screen.getByLabelText("Correo electrónico:")).toBeInTheDocument();
        expect(screen.getByLabelText("Mensaje:")).toBeInTheDocument();
    });

    it("Muestra mensaje de error si los campos estan vacios al enviar el formulario", async () => {
        render(
            <MemoryRouter>
                <Contacto />
            </MemoryRouter>
        );
        const submitButton = screen.getByText("Enviar");

        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(screen.getByText("El nombre debe tener al menos 3 caracteres.")).toBeInTheDocument();
            expect(screen.getByText("El email es obligatorio.")).toBeInTheDocument();
            expect(screen.getByText("El mensaje no puede estar vacío.")).toBeInTheDocument();
        });
    });

    it("Muestra mensaje de exito al enviar el formulario con datos validos", async () => {
        render(
            <MemoryRouter>
                <Contacto />
            </MemoryRouter>
        );
        const nameInput = screen.getByLabelText("Nombre:");
        const emailInput = screen.getByLabelText("Correo electrónico:");
        const messageInput = screen.getByLabelText("Mensaje:");
        const submitButton = screen.getByText("Enviar");
        
        fireEvent.change(nameInput, { target: { value: "Juan Perez" } });
        fireEvent.change(emailInput, { target: { value: "juan@gmail.com" } });
        fireEvent.change(messageInput, { target: { value: "Me gusta su sitio web!" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("¡Gracias por tu mensaje, Juan Perez!")).toBeInTheDocument();
        });
    });

});
