import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';// Simulador de rutas
import Login from '../pages/Login';  // Componente a testear


// Bloque principal de pruebas
describe('Login Component', () => {

    // PRUEBA 1 : Verificar los siguientes campos del formulario
    it ("Muestra los campos correo y contraseña", () => {

    // Rederizar el componente Login dentro de un MemoryRouter simulado
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        // VERIFICACIÓN DE LOS IMPUTS DEL FORMULARIO
        expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
        expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();

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

    // Prueba 3: Aceptación de credenciales

    it ("Solo se aceptan credenciales correstas", async () => {

        render(
            <MemoryRouter>
                <Login onLoginSuccess={onLoginSuccess}/>
            </MemoryRouter>
        );

        // Simular ingreso de datos
        fireEvent.change (screen.getByLabelText(/correo electrónico/i), {target: { value: "demo@gmail.com" } });
        fireEvent.change (screen.getByLabelText(/contraseña/i), {target: { value: "D1234" } });
        fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
        // OnLoginSucess debe  haberse llamado
        expect(onLoginSuccess).toHaveBeenCalled();
    });
});
