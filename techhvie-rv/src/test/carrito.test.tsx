import { describe, test, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mocks for the carrito context
const eliminarMock = vi.fn();
const vaciarMock = vi.fn();
const actualizarMock = vi.fn();

const mockCarrito = [
    {
        id: 1,
            titulo: 'Asus vivoBook 15',
        descripcion: 'Noteobook Asus VivoBook 15',
        imagen: '/img/categorias/computadoras/asusVivoBook15.jpg',
        categoria: 'Computadoras',
        tags: [],
        precio:  229990,
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
        // Ensure any localStorage-based initial data is set to our mock so component renders predictable items
        try {
            localStorage.setItem('carritoTechHive', JSON.stringify(mockCarrito));
        } catch (e) {
            // ignore in environments without localStorage
        }
    });

    it('muestra el título y el item del carrito', () => {
        const { container } = render(
            <MemoryRouter>
                <Carrito visible={true} onClose={() => {}} />
            </MemoryRouter>
        );

        expect(screen.getByText(/Tu Carrito/)).toBeInTheDocument();
    // Producto y cantidad (título coincidente con el mock actual)
    expect(screen.getByText('Asus vivoBook 15')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        // Botón vaciar
        expect(screen.getByText('Vaciar Carrito')).toBeInTheDocument();
    });

    it('llama a eliminarDelCarrito, actualizarCantidad y vaciarCarrito al interactuar', () => {
        const { container } = render(
            <MemoryRouter>
                <Carrito visible={true} onClose={() => {}} />
            </MemoryRouter>
        );

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