import { describe, test, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mocks for the carrito context
const eliminarMock = vi.fn();
const vaciarMock = vi.fn();
const actualizarMock = vi.fn();

const mockCarrito = [
    {
        id: 1,
        titulo: 'Retro Console',
        descripcion: 'Consola retro',
        imagen: '/img/consola.jpg',
        categoria: 'consolas',
        tags: [],
        precio: 379990,
        cantidad: 2,
    },
];

vi.mock('../context/CarritoContext', () => ({
    useCarrito: () => ({
        carrito: mockCarrito,
        agregarAlCarrito: vi.fn(),
        eliminarDelCarrito: eliminarMock,
        vaciarCarrito: vaciarMock,
        actualizarCantidad: actualizarMock,
    }),
}));

// Mock react-bootstrap's Offcanvas to avoid needing window.matchMedia in jsdom
vi.mock('react-bootstrap', () => {
    const React = require('react');
    function Offcanvas(props: any) {
        // Render children directly for tests
        return React.createElement('div', {}, props.children);
    }
    Offcanvas.Header = ({ children }: any) => React.createElement('div', {}, children);
    Offcanvas.Title = ({ children }: any) => React.createElement('div', {}, children);
    Offcanvas.Body = ({ children }: any) => React.createElement('div', {}, children);
    return { Offcanvas };
});

import Carrito from '../pages/Carrito';

describe('Carrito Component', () => {
    beforeEach(() => {
        eliminarMock.mockClear();
        vaciarMock.mockClear();
        actualizarMock.mockClear();
    });

    it('muestra el título y el item del carrito', () => {
        const { container } = render(<Carrito visible={true} onClose={() => {}} />);

        expect(screen.getByText(/Tu Carrito/)).toBeInTheDocument();
        // Producto y cantidad
        expect(screen.getByText('Retro Console')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        // Botón vaciar
        expect(screen.getByText('Vaciar Carrito')).toBeInTheDocument();
    });

    it('llama a eliminarDelCarrito, actualizarCantidad y vaciarCarrito al interactuar', () => {
        const { container } = render(<Carrito visible={true} onClose={() => {}} />);

        const deleteBtn = container.querySelector('.delete-btn') as HTMLButtonElement;
        expect(deleteBtn).toBeTruthy();
        fireEvent.click(deleteBtn);
        expect(eliminarMock).toHaveBeenCalledWith(1);

        const plusButtons = screen.getAllByText('+');
        expect(plusButtons.length).toBeGreaterThan(0);
        fireEvent.click(plusButtons[0]);
        // Debe haberse llamado con id 1 y nueva cantidad 3
        expect(actualizarMock).toHaveBeenCalledWith(1, 3);

        const vaciarBtn = screen.getByText('Vaciar Carrito');
        fireEvent.click(vaciarBtn);
        expect(vaciarMock).toHaveBeenCalled();
    });
});