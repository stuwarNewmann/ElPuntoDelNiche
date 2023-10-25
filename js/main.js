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
            const precio = parseFloat(btn.getAttribute('data-precio'));
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
        const productoEnCarrito = carrito.find(p => p.id === producto.id);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            producto.cantidad = 1;
            carrito.push(producto);
        }
        actualizarCarrito();
        actualizarContadorCarrito();
    }

    function incrementar(id) {
        const producto = carrito.find(p => p.id === id);
        if (producto) {
            producto.cantidad++;
            actualizarCarrito();
            actualizarContadorCarrito();
        }
    }

    function decrementar(id) {
        const producto = carrito.find(p => p.id === id);
        if (producto && producto.cantidad > 1) {
            producto.cantidad--;
        } else if (producto.cantidad === 1) {
            carrito = carrito.filter(p => p.id !== id);
        }
        actualizarCarrito();
        actualizarContadorCarrito();
    }

    function eliminar(id) {
        carrito = carrito.filter(p => p.id !== id);
        actualizarCarrito();
        actualizarContadorCarrito();
    }

    function actualizarContadorCarrito() {
        const count = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        countCarritoMobile.textContent = count;
    }

    function enviarAWhatsApp() {
        const barrio = barrioInput.value;
        let mensaje = `Hola, quiero hacer un pedido:\n`;
    
        carrito.forEach(producto => {
            mensaje += `${producto.nombre} - $${producto.precio} x ${producto.cantidad}\n`;
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

    function actualizarCarrito() {
        listaCarrito.innerHTML = '';
        carrito.forEach(producto => {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            li.innerHTML = `
                <div class="text-left">
                    <strong>${producto.nombre}</strong> - $${producto.precio}
                </div>
                <div class="text-right">
                    <button class="btn-decrementar btn btn-outline-secondary btn-sm mr-2" data-id="${producto.id}">-</button>
                    <span class="mx-2">${producto.cantidad}</span>
                    <button class="btn-incrementar btn btn-outline-secondary btn-sm ml-2" data-id="${producto.id}">+</button>
                    <button class="btn-eliminar btn btn-outline-danger btn-sm ml-2" data-id="${producto.id}">Eliminar</button>
                </div>
            `;
            listaCarrito.appendChild(li);
        });
    }

    listaCarrito.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-decrementar')) {
            decrementar(e.target.getAttribute('data-id'));
        } else if (e.target.classList.contains('btn-incrementar')) {
            incrementar(e.target.getAttribute('data-id'));
        } else if (e.target.classList.contains('btn-eliminar')) {
            eliminar(e.target.getAttribute('data-id'));
        }
    });

    
    productos.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            card.classList.add('scale-animation'); // Añadir animación
    
            setTimeout(() => {
                card.classList.remove('scale-animation');
            }, 500); // Remover la animación después de 500ms
    
            const id = btn.getAttribute('data-id');
            const nombre = btn.getAttribute('data-nombre');
            const precio = parseFloat(btn.getAttribute('data-precio'));
            agregarAlCarrito({ id, nombre, precio });
        });
    });
    
    
    
    
    

    // Evento para mostrar el modal cuando se haga clic en la burbuja flotante o en el botón "Comprar"
    [countCarritoMobile, comprarBtn].forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal();
        });
    });
});
