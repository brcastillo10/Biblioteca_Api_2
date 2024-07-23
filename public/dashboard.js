document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    if (token) {
        // El usuario está autenticado
        console.log('El usuario está autenticado.');
        try {
            const response = await fetch('/user-info', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const userData = await response.json();
            document.getElementById('userInfo').innerHTML = `
                <p>Nombre: ${userData.nombre}</p>
                <p>Correo: ${userData.correo}</p>
                <p>2FA: ${userData.twoFactorEnabled ? 'Habilitado' : 'Deshabilitado'}</p>
                <button id="toggle2FA" class="btn btn-primary">
                    ${userData.twoFactorEnabled ? 'Deshabilitar' : 'Habilitar'} 2FA
                </button>
                <button id="logout" class="btn btn-danger">Cerrar sesión</button>
            `;

            document.getElementById('toggle2FA').addEventListener('click', async () => {
                const action = userData.twoFactorEnabled ? 'disable' : 'enable';
                const response = await fetch(`/toggle-2fa?action=${action}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    location.reload();
                }
            });

            document.getElementById('logout').addEventListener('click', () => {
                localStorage.removeItem('token');
                window.location.href = '/';
            });

            // Aquí puedes agregar el código para cargar la lista de libros y manejar otras funcionalidades del dashboard
            // Por ejemplo:
            // cargarListaDeLibros();
            // manejarFormularioAgregarLibro();
            // etc.

        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        // El usuario no está autenticado
        console.log('El usuario no está autenticado.');
        window.location.href = '/';
    }
});

// Aquí puedes agregar otras funciones necesarias para el dashboard, como:
// function cargarListaDeLibros() { ... }
// function manejarFormularioAgregarLibro() { ... }
// etc.