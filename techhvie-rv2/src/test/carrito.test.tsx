import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mocks for the carrito context
const increaseMock = vi.fn();
const decreaseMock = vi.fn();
const removeMock = vi.fn();

const mockItems = [
    {
        productoId: 1,
        nombre: 'Asus vivoBook 15',
        imagenUrl: '/img/categorias/computadoras/asusVivoBook15.jpg',
        precio: 229990,
        cantidad: 2,
        stock: 10,
    },
];

vi.mock('../context/CarritoContext', () => ({
    useCarrito: () => ({
        items: mockItems,
        total: 459980,
        increase: increaseMock,
        decrease: decreaseMock,
        remove: removeMock,
    }),
}));

import Carrito from '../pages/Carrito';

describe('Carrito Component', () => {
    beforeEach(() => {
        increaseMock.mockClear();
        decreaseMock.mockClear();
        removeMock.mockClear();
    });

    it('muestra el título y el item del carrito', () => {
        render(
            <MemoryRouter>
                <Carrito />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: 'Carrito' })).toBeInTheDocument();
        expect(screen.getByAltText('Asus vivoBook 15')).toBeInTheDocument();
        expect(screen.getByText('Resumen de la orden')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Proceder al pago/i })).toBeInTheDocument();
    });

    it('llama a remove, increase y decrease al interactuar', () => {
        const { container } = render(
            <MemoryRouter>
                <Carrito />
            </MemoryRouter>
        );

        // Buscar el botón de eliminar (icon-btn danger)
        const deleteBtn = container.querySelector('.icon-btn.danger') as HTMLButtonElement;
        expect(deleteBtn).toBeTruthy();
        fireEvent.click(deleteBtn);
        expect(removeMock).toHaveBeenCalledWith(1);

        // Buscar botones de cantidad
        const plusButtons = screen.getAllByText('+');
        expect(plusButtons.length).toBeGreaterThan(0);
        fireEvent.click(plusButtons[0]);
        expect(increaseMock).toHaveBeenCalledWith(1);

        const minusButtons = screen.getAllByText('–');
        expect(minusButtons.length).toBeGreaterThan(0);
        fireEvent.click(minusButtons[0]);
        expect(decreaseMock).toHaveBeenCalledWith(1);
    });
});