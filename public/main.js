document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const twoFactorToken = document.getElementById('twoFactorToken')?.value || '';

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, contrasena, twoFactorToken })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = '/home';
    } else {
        const errorResponse = await response.json();
        if (errorResponse.require2FA) {
            document.getElementById('twoFactorField').style.display = 'block';
        } else {
            const errorContainer = document.getElementById('error-container');
            errorContainer.innerHTML = `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    ${errorResponse.error}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        }
    }
});
