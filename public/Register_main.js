document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const userData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('userId', data._id);
            window.location.href = '/setup-2fa.html';
        } else {
            const errorData = await response.json();
            document.getElementById('error-container').innerHTML = `
                <div class="alert alert-danger">${errorData.error}</div>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});