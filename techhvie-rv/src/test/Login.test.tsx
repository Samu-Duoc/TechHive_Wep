import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';  // simulador de rutas
import '@testing-library/jest-dom';// Simplifica las aserciones DOM
import Login from '../pages/Login';  // Componente a testear


// Bloque principal de pruebas
describe("Login Component", () => {

    // PRUEBA 1 : Verificar los siguientes campos del formulario
    it("muestra los campos de correo y contraseña", () => {
// Renderizamos el componente dentro de un MemoryRouter simulado
        render(
        <MemoryRouter>
            <Login/>
        </MemoryRouter>
    );

        // VERIFICACIÓN DE LOS IMPUTS DEL FORMULARIO
        expect(screen.getByLabelText(/email|correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();

        // VERIFICACIÓN DEL BOTÓN  INGRESAR
        expect(screen.getByRole('button', { name: /Ingresar/i })).toBeInTheDocument();
    });

    // Prueba 2 : VALIDAR COMPOS VACÍOS
    it('muestra errores si los campos estan vacíos al enviar el formulario', async () => {

        render(
            <MemoryRouter>
                <Login/>
            </MemoryRouter>
        );

        // Simular que el usario hizo clic y ingreso , sin recibir nada
        fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

   // Buscar errores de validación
        expect(await screen.findByText(/el correo es obligatorio/i)).toBeInTheDocument();
        expect(await screen.findByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
    });

    it("acepta credenciales correctas", async () => {
    const onLoginSuccess = vi.fn(); // función simulada

    render(
        <MemoryRouter>
        <Login onLoginSuccess={onLoginSuccess} />
        </MemoryRouter>
    );

    // Usar las credenciales de prueba que valida el componente
    fireEvent.change(screen.getByLabelText(/email|correo electrónico/i), { target: { value: "demo@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "1234" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    // onLoginSuccess debe haberse llamado
    expect(onLoginSuccess).toHaveBeenCalled();
    });
});
