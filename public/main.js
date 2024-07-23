document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, contrasena })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
     //   console.log('Token generado: ', data.token); //Ver si se genera el token
        window.location.href = '/home';
    } else {
        // Si hay un error en el inicio de sesión, mostrar el mensaje de error
        console.log('Fallo el iniciar sesion')
        const errorResponse = await response.json();
        const errorMessage = errorResponse.error;

        const errorContainer = document.getElementById('error-container');
        errorContainer.innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                ${errorMessage}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }
});
