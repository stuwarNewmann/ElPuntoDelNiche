document.addEventListener('DOMContentLoaded', () => {
    const productos = document.querySelectorAll('.agregar');
    const listaCarrito = document.getElementById('lista-carrito');
    const modalPago = document.getElementById('modal-pago');
    const confirmarPago = document.getElementById('confirmar-pago');
    const barrioInput = document.getElementById('barrio');
    const countCarritoMobile = document.getElementById('count-carrito-mobile');
    const closeModalBtns = modalPago.querySelectorAll('[data-dismiss="modal"]');
    const comprarBtn = document.getElementById('comprar');

    let carrito = [];

    productos.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            const id = btn.getAttribute('data-id');
            const nombre = btn.getAttribute('data-nombre');
            const precio = btn.getAttribute('data-precio');
            agregarAlCarrito({ id, nombre, precio });
        });
    });

    confirmarPago.addEventListener('click', () => {
        enviarAWhatsApp();
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            hideModal();
        });
    });

    function agregarAlCarrito(producto) {
        carrito.push(producto);
        actualizarCarrito();
        actualizarContadorCarrito();
    }

    function actualizarCarrito() {
        listaCarrito.innerHTML = '';
        carrito.forEach(producto => {
            const li = document.createElement('li');
            li.textContent = `${producto.nombre} - $${producto.precio}`;
            listaCarrito.appendChild(li);
        });
    }

    function actualizarContadorCarrito() {
        const count = carrito.length;
        countCarritoMobile.textContent = count;
    }

    function enviarAWhatsApp() {
        const barrio = barrioInput.value;
        let mensaje = `Hola, quiero hacer un pedido:\n`;
    
        carrito.forEach(producto => {
            mensaje += `${producto.nombre} - $${producto.precio}\n`;
        });
    
        mensaje += `Domicilio en el barrio: ${barrio}`;
    
        const numeroWhatsApp = "3053053651";
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, '_blank');
    }
    

    function showModal() {
        modalPago.classList.add('show');
        modalPago.setAttribute('aria-modal', 'true');
        modalPago.style.display = 'block';
        document.body.classList.add('modal-open');
    }

    function hideModal() {
        modalPago.classList.remove('show');
        modalPago.removeAttribute('aria-modal');
        modalPago.style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    // Evento para mostrar el modal cuando se haga clic en la burbuja flotante o en el botón "Comprar"
    [countCarritoMobile, comprarBtn].forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal();
        });
    });
});
