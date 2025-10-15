/*Filtrado de Productos */

// Base de datos de productos ficticias :)
const productos = [
    {
        id: 1,
        titulo: "Asus vivoBook 15",
        descripcion: "Notebook liviano con pantalla Full HD, ideal para estudio y trabajo diario.",
        imagen: "../img/categorias/computadoras/asusVivo15.jpg", // Ruta corregida de la imagen
        categoria: "Computadores",
        tags: ["Notebook", "Asus", "Estudio"],
        precio: "$499.990",
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        id: 2,
        titulo: "MacBook Air M1",
        descripcion: "Ultraportátil de Apple con chip M1 y batería de larga duración.",
        imagen: "../img//categorias/computadoras/macBook Air M1.jpg",
        categoria: "Computadores",
        tags: ["Apple", "Mac", "Ligero"],
        precio: "$899.990",
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        id: 3,
        titulo: "PC Gamer Ryzen 5",
        descripcion: "Computador de escritorio con gran potencia para juegos y multitarea.",
        imagen: "../img/categorias/computadoras/PCRyzen.jpg",
        categoria: "computadores",
        tags: ["Gaming", "Ryzen", "Desktop"],
        precio: "$649.990",
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        id: 4,
        titulo: "Samsung Galaxy S21",
        descripcion: "Smartphone Android con cámara avanzada y rendimiento rápido.",
        imagen: "../img/categorias/smartphones/SamsungGalaxyS21.jpg",
        categoria: "smartphones",
        tags: ["Samsung", "Android", "Smartphone"],
        precio: "$429.990",
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        id: 5,
        titulo: "iPhone 12 Reacondicionado",
        descripcion: "Teléfono Apple reacondicionado con diseño premium y garantía.",
        imagen: "../img/categorias/smartphones/iPhone 12.jpg",
        categoria: "smartphones",
        tags: ["Apple", "Reacondicionado"],
        precio: "$389.990",
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        id: 6,
        titulo: "Cargador Rápido 65W",
        descripcion: "Adaptador de carga rápida compatible con notebooks y smartphones.",
        imagen: "../img/Categorias/accesorios/CargadorRapido65W.jpg",
        categoria: "Accesorios",
        tags: ["Cargador", "65W", "USB-C"],
        precio: "$24.990",
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        id: 7,
        titulo: "Cable LAN Cat6",
        descripcion: "Cable de red de alta velocidad para conexión estable a internet.",
        imagen: "../img/Categorias/accesorios/CableLAN.jpg",
        categoria: "Accesorios",
        tags: ["Cable", "Red", "Internet"],
        precio: "$6.000",
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        id: 8,
        titulo: "Pendrive Kingston 64GB",
        descripcion: "Memoria portátil confiable para almacenar archivos.",
        imagen: "../img/Categorias/accesorios/Pendrive Kingston 64GB.jpg",
        categoria: "Accesorios",
        tags: ["USB", "Memoria", "Kingston"],
        precio: "$15.000",
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        id: 9,
        titulo: "PlayStation 4 Slim Reacondionada.",
        descripcion: "Consola reacondicionada con garantía y amplio catálogo de juegos.",
        imagen: "../img/categorias/rect/PS4Slim.jpg",
        categoria: "Dispositivos Reacondicionados",
        tags: ["PlayStation", "Reacondicionado", "Gaming"],
        precio: "$229.990",
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        id: 10,
        titulo: "Dell Inspiron 3520 Reacondionada.",
        descripcion: "Notebook reacondicionado con rendimiento confiable para trabajo y estudio.",
        imagen: "../img/categorias/rect/DellInspiron.jpg",
        categoria: "Dispositivos Reacondicionados",
        tags: ["Dell", "Reacondicionado", "Notebook"],
        precio: "$229.990",
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        id: 11,
        titulo: "NVIDIA RTX 4060 MSI",
        descripcion: "Tarjeta gráfica potente para gaming y creación de contenido.",
        imagen: "../img/categorias/componentes/RTX4060.Jpg",
        categoria: "componentes",
        tags: ["NVIDIA", "Gráfica", "Gaming"],
        precio: "$379.990",
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        id: 12,
        titulo: "ASUS Prime B550M",
        descripcion: "Placa madre de alta calidad para procesadores AMD Ryzen.",
        imagen: "../img/categorias/componentes/ASUS Prime B550M.jpg",
        categoria: "componentes",
        tags: ["ASUS", "Motherboard", "PC"],
        precio: "$149.990",
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        id: 13,
        titulo: "Steam Deck 512GB",
        descripcion: "Consola portátil para jugar toda tu biblioteca de Steam en cualquier lugar.",
        imagen: "../img/categorias/consolas/SteamDeck.jpg",
        categoria: "consolas",
        tags: ["Steam", "Portátil", "Gaming"],
        precio: "$699.990",
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        id: 14,
        titulo: "Sony WH-1000XM4",
        descripcion: "Audífonos inalámbricos con cancelación de ruido de última generación.",
        imagen: "../img/Categorias/audio/SonyWH1000XM4.jpg",
        categoria: "audio",
        tags: ["Sony", "Audífonos", "Cancelación de ruido"],
        precio: "$249.990",
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        id: 15,
        titulo: "Sound BlasterX G6",
        descripcion: "Amplificador de audio DAC/AMP para experiencia de sonido premium.",
        imagen: "../img/categorias/audio/CreativeSoundBlasterXG6.jpg",
        categoria: "audio",
        tags: ["Creative", "DAC", "Audio"],
        precio: "$99.990",
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        id: 22,
        titulo: "Teclado Mecánico Redragon K630",
        descripcion: "Teclado retroiluminado mecanico, perfecto para gaming",
        imagen: "../img/categorias/Perifericos/TecladoMecánicoRedragon.png",
        categoria: "periferico",
        tags: ["Teclado", "Mecánico", "Redragon"],
        precio: "$179.990",
        demoUrl: "#",
        codeUrl: "#"
    },
    {
        id: 23,
        titulo: "Silla Gamer Cougar Armor",
        descripcion: "Silla ergonomica con soporte ajustable para largas sesiones",
        imagen: "../img/categorias/Perifericos/SillaGamerCougarArmor.jpg",
        categoria: "Periferico",
        tags: ["Silla", "Gamer", "Cougar"],
        precio: "$199.990",
        demoUrl: "#",
        codeUrl: "#"
    }
];

// Función para crear la tarjeta de producto
function crearTarjetaProducto(producto) {
    const tagsHTML = producto.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    // Manejar categorías múltiples para el data-category
    const categoryData = Array.isArray(producto.categoria) 
        ? producto.categoria.join(' ') 
        : producto.categoria;
    
    return `
        <article class="card reveal" data-category="${categoryData}">
            <div class="thumb">
                <img src="${producto.imagen}" alt="${producto.titulo}" onerror="this.src='../img/logo.jpg'">
            </div>
            <div class="content">
                ${tagsHTML}
                <h3>${producto.titulo}</h3>
                <p>${producto.descripcion}</p>
                <div class="precio">
                    <strong>Precio: ${producto.precio}</strong>
                </div>
                <div class="cantidad-selector">
                    <label>Cantidad:</label>
                    <div class="cantidad-controls">
                        <button class="btn-cantidad-menos" onclick="cambiarCantidad(${producto.id}, -1)">-</button>
                        <input type="number" id="cantidad-${producto.id}" class="cantidad-input" value="1" min="1" max="10">
                        <button class="btn-cantidad-mas" onclick="cambiarCantidad(${producto.id}, 1)">+</button>
                    </div>
                </div>
                <div class="card-actions">
                    <a href="#" class="btn-comprar" onclick="agregarProductoAlCarrito(${producto.id}); return false;">🛒 Agregar al Carrito</a>
                </div>
            </div>
        </article>
    `;
}

// Función para mostrar productos
function mostrarProductos(productosAMostrar) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    if (productosAMostrar.length === 0) {
        grid.innerHTML = `
            <div class="no-products">
                <h3>No se encontraron productos</h3>
                <p>No hay productos en esta categoría actualmente.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = productosAMostrar.map(producto => crearTarjetaProducto(producto)).join('');
    
    // Reiniciar animaciones
    const cards = grid.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Función para filtrar productos
function filtrarProductos(categoria) {
    let productosFiltrados;
    
    if (categoria === 'all') {
        productosFiltrados = productos;
    } else {
        productosFiltrados = productos.filter(producto => {
            // Normalizar las categorías para la comparación (minúsculas y sin espacios extra)
            let categoriaProducto = producto.categoria.toLowerCase().trim();
            let categoriaBuscada = categoria.toLowerCase().trim();
            
            // Si categoria es un array, verificar si incluye la categoría buscada
            if (Array.isArray(producto.categoria)) {
                return producto.categoria.some(cat => cat.toLowerCase().trim() === categoriaBuscada);
            } else {
                // Manejar casos especiales de categorías
                if (categoriaBuscada === 'accesorios' && categoriaProducto === 'accesorios') return true;
                if (categoriaBuscada === 'periferico' && (categoriaProducto === 'periferico' || categoriaProducto === 'periferico')) return true;
                if (categoriaBuscada === 'computadores' && (categoriaProducto === 'computadores' || categoriaProducto === 'computadores')) return true;
                
                // Comparación directa
                return categoriaProducto === categoriaBuscada;
            }
        });
    }
    
    mostrarProductos(productosFiltrados);
    console.log(`Filtrado por: ${categoria}, Productos encontrados: ${productosFiltrados.length}`);
}

// Función para manejar los botones de filtro
function setupFiltros() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            button.classList.add('active');
            
            // Obtener la categoría del botón
            const categoria = button.getAttribute('data-filter');
            
            // Filtrar y mostrar productos
            filtrarProductos(categoria);
        });
    });
}

// Función de búsqueda (opcional)
function setupBusqueda() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase();
        const categoriaActiva = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        
        let productosFiltrados = categoriaActiva === 'all' ? productos : 
                                productos.filter(p => p.categoria === categoriaActiva);
        
        if (termino) {
            productosFiltrados = productosFiltrados.filter(producto =>
                producto.titulo.toLowerCase().includes(termino) ||
                producto.descripcion.toLowerCase().includes(termino) ||
                producto.tags.some(tag => tag.toLowerCase().includes(termino))
            );
        }
        
        mostrarProductos(productosFiltrados);
    });
}

// Inicializar cuando la página cargue
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar todos los productos inicialmente
    mostrarProductos(productos);
    
    // Configurar filtros
    setupFiltros();
    
    // Configurar búsqueda (si existe)
    setupBusqueda();
    
    console.log('Sistema de filtrado dinámico inicializado');
    console.log(`${productos.length} productos cargados`);
});

// ========================================
// INTEGRACIÓN CON CARRITO
// ========================================

// Función para cambiar cantidad en el selector
function cambiarCantidad(idProducto, cambio) {
    const input = document.getElementById(`cantidad-${idProducto}`);
    if (input) {
        let nuevaCantidad = parseInt(input.value) + cambio;
        if (nuevaCantidad < 1) nuevaCantidad = 1;
        if (nuevaCantidad > 10) nuevaCantidad = 10;
        input.value = nuevaCantidad;
    }
}

// Función para agregar producto al carrito con cantidad
function agregarProductoAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    const cantidadInput = document.getElementById(`cantidad-${idProducto}`);
    const cantidad = cantidadInput ? parseInt(cantidadInput.value) : 1;
    
    if (producto && typeof window.agregarAlCarrito === 'function') {
        // Agregar múltiples veces según la cantidad seleccionada
        for (let i = 0; i < cantidad; i++) {
            window.agregarAlCarrito(producto);
        }
        // Resetear cantidad a 1 después de agregar
        if (cantidadInput) {
            cantidadInput.value = 1;
        }
    } else {
        console.error('No se pudo agregar el producto al carrito:', idProducto);
        alert('Error al agregar el producto al carrito');
    }
}

// Hacer las funciones globales
window.agregarProductoAlCarrito = agregarProductoAlCarrito;
window.cambiarCantidad = cambiarCantidad;