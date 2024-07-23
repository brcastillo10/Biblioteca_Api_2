// Agrega un listener al evento 'submit' del formulario con id 'loginForm'
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    // Previene que el formulario se envíe de forma tradicional
    e.preventDefault();

    const correo = document.getElementById('correo').value;     // Obtiene el valor del campo de entrada con id 'correo'
    const contrasena = document.getElementById('contrasena').value;     // Obtiene el valor del campo de entrada con id 'contraseña'

    // Envía una solicitud POST asincrónica a la ruta '/login'
    const response = await fetch('/login', {
        method: 'POST', // Establece el método HTTP como POST
        headers: {
            'Content-Type': 'application/json' // Especifica que el cuerpo de la solicitud será JSON
        },
        body: JSON.stringify({ correo, contrasena }) // Convierte el objeto con el correo y contraseña a una cadena JSON
    });


    // Si la respuesta del servidor es exitosa
    if (response.ok) {
    // Redirige al usuario a la página de inicio
        window.location.href = '/home';
    } else {
        // Si hay un error en el inicio de sesión, mostrar el mensaje de error
        const errorResponse = await response.json(); // Convierte la respuesta de error a un objeto JSON
        const errorMessage = errorResponse.error;   // Extrae el mensaje de error del objeto JSON

        // Encuentra el contenedor de errores en el DOM
        const errorContainer = document.getElementById('error-container');
        // Actualiza el HTML del contenedor de errores con un mensaje de alerta
        errorContainer.innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                ${errorMessage} <!-- Inserta el mensaje de error en el HTML -->
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }
});
