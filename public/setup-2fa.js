document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = '/';
        return;
    }

    try {
        const response = await fetch('/setup-2fa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
        const data = await response.json();
        document.getElementById('qrCode').innerHTML = `<img src="${data.qr}" alt="QR Code">`;
        localStorage.setItem('tempSecret', data.secret);
    } catch (error) {
        console.error('Error setting up 2FA:', error);
    }

    document.getElementById('verifyButton').addEventListener('click', async () => {
        const verificationCode = document.getElementById('verificationCode').value;
        const userId = localStorage.getItem('userId');
        const secret = localStorage.getItem('tempSecret');

        try {
            const response = await fetch('/verify-2fa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, token: verificationCode, secret }),
            });
            const data = await response.json();
            if (data.success) {
                document.getElementById('message').innerHTML = '<div class="alert alert-success">2FA activado correctamente</div>';
                setTimeout(() => {
                    window.location.href = '/home';
                }, 2000);
            } else {
                document.getElementById('message').innerHTML = '<div class="alert alert-danger">Código inválido. Intente de nuevo.</div>';
            }
        } catch (error) {
            console.error('Error verifying 2FA:', error);
        }
    });
});