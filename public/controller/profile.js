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

            // Verifica si la respuesta es correcta
            if (!response.ok) {
                throw new Error('Error al obtener los datos del perfil');
            }

            // Asegúrate de que la respuesta esté en formato JSON
            const userData = await response.json();

            // Actualiza el DOM con los datos del usuario
            document.getElementById('nombre').textContent = userData.nombre;
            document.getElementById('edad').textContent = userData.edad;
            document.getElementById('ciudad').textContent = userData.ciudad;
            document.getElementById('correo').textContent = userData.correo;

        } catch (error) {
            console.error('Error:', error);
            // Muestra un mensaje de error en el contenedor de errores
            document.getElementById('error-container').textContent = 'No se pudieron obtener los datos del perfil.';
        }

    } else {
        // El usuario no está autenticado
        console.log('El usuario no está autenticado.');
        window.location.href = '/';
    }
});
