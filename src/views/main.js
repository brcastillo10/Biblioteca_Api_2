document.addEventListener('DOMContentLoaded', function() {
    // Tu código JavaScript aquí
    const token = localStorage.getItem('token');

    if (token) {
        // El usuario está autenticado
        console.log('El usuario está autenticado.');
        // Aquí puedes realizar acciones correspondientes al usuario autenticado, como cargar contenido protegido, etc.
    } else {
        // El usuario no está autenticado
        console.log('El usuario no está autenticado.');
        // Aquí puedes redirigir al usuario a la página de inicio de sesión u otra acción
        window.location.href = '/login';
    }
});
