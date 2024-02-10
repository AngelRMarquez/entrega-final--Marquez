
document.addEventListener('DOMContentLoaded', function () {
    iniciarUI();
});

function iniciarUI() {
    mostrarProductos();

    document.getElementById('btnPagar').addEventListener('click', mostrarFormularioPago);
    document.getElementById('btnConfirmarPago').addEventListener('click', confirmarPago);

    // Mostrar datos almacenados en localStorage al cargar la página
    mostrarDatosGuardados();
}

function mostrarProductos() {
    const productList = document.getElementById('product-list');

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
}

function mostrarFormularioPago() {
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.style.display = 'block';
    }
}

function confirmarPago() {
    const nombre = document.getElementById('nombre_pago').value;
    const tarjeta = document.getElementById('tarjeta_pago').value;
    const vencimiento = document.getElementById('vencimiento_pago').value;
    const cvv = document.getElementById('cvv_pago').value;

    if (!nombre || !tarjeta || !vencimiento || !cvv) {
        console.error('Por favor, complete todos los campos antes de confirmar el pago.');
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
}

function reiniciarCompra() {
    carrito.length = 0;
    actualizarCarrito();
    mostrarTotal(); // Mostrar el total después de reiniciar la compra
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.style.display = 'none';
    }

    mostrarDatosGuardados();
}

function mostrarDatosGuardados() {
    const datosGuardados = localStorage.getItem('datosPago');
    const datosAlmacenadosElement = document.getElementById('datos-almacenados');

    if (datosGuardados && datosAlmacenadosElement) {
        const datos = JSON.parse(datosGuardados);

        let html = '<h3>Detalles del pago:</h3>';
        html += `<p id="nombre_pago">Nombre: ${datos.nombre}</p>`;
        html += `<p id="tarjeta_pago">Tarjeta: ${datos.tarjeta}</p>`;
        html += `<p id="vencimiento_pago">Vencimiento: ${datos.vencimiento}</p>`;
        html += `<p id="cvv_pago">CVV: ${datos.cvv}</p>`;
        html += '<h4>Productos en el carrito:</h4>';
        html += '<ul>';
        datos.carrito.forEach(item => {
            html += `<li>${item.nombre} - Cantidad: ${item.cantidad} - Precio: $${(item.precio * item.cantidad).toFixed(2)}</li>`;
        });
        html += '</ul>';
        html += `<p id="total">Total a pagar: $${calcularTotalCarrito().toFixed(2)}</p>`;

        datosAlmacenadosElement.innerHTML = html;
    }
}

// Función para calcular el total del carrito
function calcularTotalCarrito() {
    let total = 0;
    carrito.forEach(item => {
        total += item.precio * item.cantidad;
    });
    return total;
}