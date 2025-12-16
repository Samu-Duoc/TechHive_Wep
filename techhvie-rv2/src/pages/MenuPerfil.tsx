import React from 'react';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import '../styles/MenuPerfil.css';

interface Props {
    role?: string | null;
}

const MenuPerfil: React.FC<Props> = ({ role }) => {
    return (
        <aside className="menu-perfil p-3">
        <ListGroup variant="flush">
            <ListGroup.Item className="menu-title">Mi Cuenta</ListGroup.Item>

            {/* Perfil (disponible para todos los roles) */}
            <ListGroup.Item as={Link} to="/cuenta/perfil">Perfil</ListGroup.Item>

            {/* CLIENTE */}
            {(!role || role === 'CLIENTE') && (
            <>
                <ListGroup.Item as={Link} to="/cuenta/mis-ordenes">Mis órdenes</ListGroup.Item>
            </>
            )}

            {/* VENDEDOR */}
            {role === 'VENDEDOR' && (
            <>
                <ListGroup.Item as={Link} to="/admin/ordenes">Órdenes</ListGroup.Item>
                <ListGroup.Item as={Link} to="/vendedor/mensajes">Mensajes</ListGroup.Item>
            </>
            )}

            {/* ADMIN: no mostrar Admin Dashboard aquí; mantener inventario, órdenes y mensajes */}
            {role === 'ADMIN' && (
            <>  
                
                <ListGroup.Item as={Link} to="/inventario">Inventario</ListGroup.Item>
                <ListGroup.Item as={Link} to="/admin/ordenes">Órdenes</ListGroup.Item>
                <ListGroup.Item as={Link} to="/admin/mensajes">Mensajes</ListGroup.Item>
            </>
            )}
        </ListGroup>
        </aside>
    );
};

export default MenuPerfil;
