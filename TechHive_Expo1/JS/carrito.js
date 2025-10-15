// Variables globales del carrito
let carrito = [];
let valorTotal = 0;

// Elementos DOM
const iconoCarrito = document.getElementById('carrito');
const numeroCarrito = document.getElementById('numero');
const contenedorCompra = document.getElementById('contenedorCompra');
const carritoOverlay = document.getElementById('carritoOverlay');
const productosCompra = document.getElementById('productosCompra');
const totalCompra = document.getElementById('totalCompra');
const cerrarCarrito = document.getElementById('cerrarCarrito');
const finalizarCompra = document.getElementById('finalizarCompra');
const vaciarCarrito = document.getElementById('vaciarCarrito');
const body = document.querySelector('body');

// ========================================
// FUNCIONES DE ALMACENAMIENTO LOCAL
// ========================================
function guardarCarrito() {
    localStorage.setItem('carritoTechHive', JSON.stringify(carrito));
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carritoTechHive');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}


/* FUNCIONES DEL CARRITO*/

// Agregar producto al carrito
function agregarAlCarrito(producto) {
    // Verificar si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
        // Si existe, aumentar la cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si no existe, agregarlo con cantidad 1
        carrito.push({
            id: producto.id,
            titulo: producto.titulo,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }
    
    guardarCarrito();
    actualizarContadorCarrito();
    
    // Mostrar notificación simple
    mostrarNotificacion(`${producto.titulo} agregado al carrito`);
}

// Eliminar producto del carrito
function eliminarDelCarrito(idProducto) {
    const index = carrito.findIndex(item => item.id === idProducto);
    if (index !== -1) {
        const nombreProducto = carrito[index].titulo;
        carrito.splice(index, 1);
        guardarCarrito();
        actualizarContadorCarrito();
        mostrarCarrito();
        mostrarNotificacion(`${nombreProducto} eliminado del carrito`);
    }
}

// Actualizar cantidad de un producto
function actualizarCantidad(idProducto, nuevaCantidad) {
    const producto = carrito.find(item => item.id === idProducto);
    if (producto) {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(idProducto);
        } else {
            producto.cantidad = nuevaCantidad;
            guardarCarrito();
            actualizarContadorCarrito();
            mostrarCarrito();
        }
    }
}


/*FUNCIONES DE INTERFAZ*/

// Mostrar el carrito (lateral)
function abrirCarrito() {
    if (contenedorCompra && carritoOverlay) {
        body.style.overflow = 'hidden';
        contenedorCompra.classList.remove('none');
        carritoOverlay.classList.remove('none');
        
        // Animación de entrada
        setTimeout(() => {
            contenedorCompra.classList.add('visible');
            carritoOverlay.classList.add('visible');
        }, 10);
        
        mostrarCarrito();
    }
}

// Cerrar el carrito
function cerrarCarritoModal() {
    if (contenedorCompra && carritoOverlay) {
        contenedorCompra.classList.remove('visible');
        carritoOverlay.classList.remove('visible');
        
        setTimeout(() => {
            body.style.overflow = 'auto';
            contenedorCompra.classList.add('none');
            carritoOverlay.classList.add('none');
        }, 300);
    }
}

// Mostrar productos en el carrito
function mostrarCarrito() {
    if (!productosCompra || !totalCompra) return;
    
    productosCompra.innerHTML = '';
    valorTotal = 0;
    
    if (carrito.length === 0) {
        productosCompra.innerHTML = `
            <div class="carrito-vacio">
                <p>🛒 Tu carrito está vacío</p>
                <p>¡Agrega algunos productos increíbles!</p>
            </div>
        `;
        totalCompra.innerHTML = '';
        return;
    }
    
    carrito.forEach(item => {
        const precioNumerico = parseFloat(item.precio.replace(/[$.,]/g, ''));
        const subtotal = precioNumerico * item.cantidad;
        valorTotal += subtotal;
        
        productosCompra.innerHTML += `
            <div class="item-carrito-lateral" data-id="${item.id}">
                <div class="item-imagen-lateral">
                    <img src="${item.imagen}" alt="${item.titulo}" onerror="this.src='../img/logo.jpg'">
                </div>
                <div class="item-detalles">
                    <h4 class="item-titulo">${item.titulo}</h4>
                    <p class="item-precio-lateral">${item.precio}</p>
                    <div class="item-cantidad-lateral">
                        <button class="btn-cantidad-lateral" onclick="actualizarCantidad(${item.id}, ${item.cantidad - 1})">-</button>
                        <span class="cantidad-lateral">${item.cantidad}</span>
                        <button class="btn-cantidad-lateral" onclick="actualizarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
                    </div>
                </div>
                <div class="item-acciones">
                    <p class="subtotal-lateral">$${subtotal.toLocaleString()}</p>
                    <button class="btn-eliminar-lateral" onclick="eliminarDelCarrito(${item.id})">🗑️</button>
                </div>
            </div>
        `;
    });
    
    totalCompra.innerHTML = `
        <div class="resumen-total">
            <div class="total-linea">
                <span>Subtotal (${carrito.reduce((total, item) => total + item.cantidad, 0)} productos):</span>
                <span class="precio-total">$${valorTotal.toLocaleString()}</span>
            </div>
            <div class="total-linea total-final">
                <span>Total:</span>
                <span class="precio-total-final">$${valorTotal.toLocaleString()}</span>
            </div>
        </div>
    `;
}

// Actualizar el contador del carrito en la interfaz
function actualizarContadorCarrito() {
    if (numeroCarrito) {
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        numeroCarrito.textContent = totalItems;
        numeroCarrito.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-carrito';
    notificacion.textContent = mensaje;
    
    // Agregar al body
    document.body.appendChild(notificacion);
    
    // Mostrar con animación
    setTimeout(() => {
        notificacion.classList.add('visible');
    }, 50);
    
    // Ocultar después de 2.5 segundos
    setTimeout(() => {
        notificacion.classList.remove('visible');
        setTimeout(() => {
            if (document.body.contains(notificacion)) {
                document.body.removeChild(notificacion);
            }
        }, 300);
    }, 2500);
}

// Vaciar todo el carrito
function vaciarTodoElCarrito() {
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito ya está vacío');
        return;
    }
    
    carrito = [];
    valorTotal = 0;
    guardarCarrito();
    mostrarCarrito();
    actualizarContadorCarrito();
    mostrarNotificacion('Carrito vaciado correctamente');
}

// Finalizar compra
function procesarCompra() {
    if (carrito.length === 0) {
        // Solo mostrar alert, no notificación
        alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
        return;
    }
    
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    const confirmacion = confirm(`¿Confirmas la compra de ${totalItems} productos por $${valorTotal.toLocaleString()}?`);
    
    if (confirmacion) {
        // Simular procesamiento
        mostrarNotificacion('¡Compra realizada con éxito! 🎉');
        vaciarTodoElCarrito();
        cerrarCarritoModal();
        
        // Aquí podrías agregar lógica para enviar la orden al servidor
        console.log('Compra procesada:', {
            productos: carrito,
            total: valorTotal,
            fecha: new Date()
        });
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

// Inicializar cuando la página cargue
document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    actualizarContadorCarrito();
    
    // Event listeners para los botones del carrito
    if (iconoCarrito) {
        iconoCarrito.addEventListener('click', abrirCarrito);
    }
    
    if (cerrarCarrito) {
        cerrarCarrito.addEventListener('click', cerrarCarritoModal);
    }
    
    if (finalizarCompra) {
        finalizarCompra.addEventListener('click', procesarCompra);
    }
    
    if (vaciarCarrito) {
        vaciarCarrito.addEventListener('click', vaciarTodoElCarrito);
    }
    
    // Cerrar carrito al hacer clic fuera del modal o en el overlay
    if (carritoOverlay) {
        carritoOverlay.addEventListener('click', cerrarCarritoModal);
    }
    
    if (contenedorCompra) {
        contenedorCompra.addEventListener('click', function(e) {
            if (e.target === contenedorCompra) {
                cerrarCarritoModal();
            }
        });
    }
    
    console.log('🛒 Sistema de carrito TechHive iniciado');
});

// Función global para que productos.js pueda usarla
window.agregarAlCarrito = agregarAlCarrito;