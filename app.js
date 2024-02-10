
document.addEventListener('DOMContentLoaded', function () {
    iniciarUI();
    
    document.getElementById('btnPagar').addEventListener('click', mostrarFormularioPago);
    document.getElementById('btnConfirmarPago').addEventListener('click', confirmarPago);
});

function iniciarUI() {
    mostrarProductos();
    actualizarCarrito();
    calcularTotal();
}

function mostrarProductos() {
    const productList = document.getElementById('product-list');

    axios.get('https://api.ejemplo.com/productos')
        .then(response => {
            const productos = response.data;

            productos.forEach(producto => {
                const productElement = document.createElement('div');
                productElement.className = 'product-container';
                productElement.innerHTML = `
                    <h3 class="product-name">${producto.nombre}</h3>
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
                    <p class="product-price">Precio: $${producto.precio.toFixed(2)}</p>
                    <button class="btn-add-to-cart" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
                `;

                productList.appendChild(productElement);
            });
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
        });
}

function agregarAlCarrito(id) {
    const selectedProduct = productos.find(producto => producto.id === id);
    const existingItem = carrito.find(item => item.id === id);

    if (existingItem) {
        existingItem.cantidad++;
    } else {
        carrito.push({ ...selectedProduct, cantidad: 1 });
    }

    actualizarCarrito();
    calcularTotal();
    mostrarNotificacion('success', `Producto agregado al carrito: ${selectedProduct.nombre}`);
}

function actualizarCarrito() {
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        cartItems.innerHTML = '';

        carrito.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.nombre} - Cantidad: ${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}`;
            cartItems.appendChild(listItem);
        });
    }
}

function calcularTotal() {
    const totalElement = document.getElementById('total');
    if (totalElement) {
        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        totalElement.textContent = `Total a pagar: $${total.toFixed(2)}`;
    }
}

function mostrarFormularioPago() {
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.style.display = 'block';
    }
}

function confirmarPago() {
    const nombre = localStorage.getItem('User') || 'User';
    const tarjeta = document.getElementById('tarjeta_pago').value;
    const vencimiento = document.getElementById('vencimiento_pago').value;
    const cvv = document.getElementById('cvv_pago').value;

    if (!tarjeta || !vencimiento || !cvv) {
        mostrarNotificacion('error', 'Por favor, complete todos los campos antes de confirmar el pago.');
        return;
    }

    const datosPago = {
        nombre,
        tarjeta,
        vencimiento,
        cvv,
        carrito,
    };

    localStorage.setItem('datosPago', JSON.stringify(datosPago));
    reiniciarCompra();
    mostrarCarrito();  // Nueva función para mostrar detalles del carrito

    mostrarNotificacion('success', 'Pago realizado');
}

function reiniciarCompra() {
    carrito.length = 0;
    actualizarCarrito();
    calcularTotal();

    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.style.display = 'none';
    }

    mostrarDatosGuardados();
}

function mostrarDatosGuardados() {
    const datosGuardados = localStorage.getItem('datosPago');
    if (datosGuardados) {
        console.log('Datos almacenados en localStorage:', JSON.parse(datosGuardados));
    }
}

function mostrarNotificacion(tipo, mensaje) {
    if (tipo === 'success') {
        Toastify({
            text: mensaje,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)"
            },
            duration: 3000
        }).showToast();
    } else if (tipo === 'error') {
        Toastify({
            text: mensaje,
            style: {
                background: "linear-gradient(to right, #ff416c, #ff4b2b)"
            },
            duration: 3000
        }).showToast();
    }
}

function mostrarCarrito() {
    const detallesCarrito = carrito.map(item => {
        return `${item.nombre} - Cantidad: ${item.cantidad} - Precio: $${(item.precio * item.cantidad).toFixed(2)}`;
    });

    const mensaje = `Detalles del carrito:\n${detallesCarrito.join('\n')}`;
    
    // Mostrar en una ventana emergente
    alert(mensaje);
}
