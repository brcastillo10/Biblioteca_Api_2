document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const response = await fetch('/user-info', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const userData = await response.json();
            if (response.ok) {
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
                const messageDiv = document.getElementById('message');

                const showMessage = (message, type) => {
                    messageDiv.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
                };
            

                const cargarLibros = async () => {
                    try {
                        const response = await fetch('/libros');
                        const libros = await response.json();
            
                        const tableBody = document.querySelector('#book-list tbody');
                        tableBody.innerHTML = '';
            
                        libros.forEach(libro => {
                            const row = document.createElement('tr');
            
                            row.innerHTML = `
                                <td>${libro._id}</td>
                                <td>${libro.titulo}</td>
                                <td>${libro.autores.join(', ')}</td>
                                <td>
                                    <button class="btn btn-primary btn-edit" data-id="${libro._id}">Editar</button>
                                </td>
                            `;
            
                            tableBody.appendChild(row);
                        });
            
                        // Agregar evento a los botones de editar
                        document.querySelectorAll('.btn-edit').forEach(button => {
                            button.addEventListener('click', (e) => {
                                const libroId = e.target.dataset.id;
                                const libro = libros.find(lib => lib._id === libroId);
            
                                if (libro) {
                                    document.querySelector('#book-id').value = libro._id;
                                    document.querySelector('#titulo').value = libro.titulo;
                                    document.querySelector('#editorial').value = libro.editorial;
                                    document.querySelector('#fechaDePublicacion').value = libro.fechaDePublicacion.split('T')[0];
                                    document.querySelector('#autores').value = libro.autores.join(', ');
                                    document.querySelector('#genero').value = libro.genero;
                                    document.querySelector('#resumen').value = libro.resumen;
                                }
                            });
                        });
                    } catch (err) {
                        console.error(err);
                    }
                };

                                    // Función para actualizar el libro
                    const updatelibross = async (e) => {
                        e.preventDefault();

                        const libroId = document.querySelector('#book-id').value;
                        const titulo = document.querySelector('#titulo').value;
                        const editorial = document.querySelector('#editorial').value;
                        const fechaDePublicacion = document.querySelector('#fechaDePublicacion').value;
                        const autores = document.querySelector('#autores').value.split(',').map(a => a.trim());
                        const genero = document.querySelector('#genero').value;
                        const resumen = document.querySelector('#resumen').value;

                        try {
                            const response = await fetch(`/libros/${libroId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({ titulo, editorial, fechaDePublicacion, autores, genero, resumen })
                            });

                            if (response.ok) {
                                const updatedLibro = await response.json();
                                showMessage('Libro actualizado con éxito', 'success');
                                //document.querySelector('#message').innerText = 'Libro actualizado con éxito!';
                                cargarLibros(); // Recargar la lista de libros
                            } else {
                                const error = await response.text();
                                showMessage('Error de solicitud: Datos inválidos', 'warning');
                                //document.querySelector('#message').innerText = `Error: ${error}`;
                            }
                        } catch (err) {
                            showMessage('Error del servidor', 'danger');
                            //document.querySelector('#message').innerText = `Error: ${err.message}`;
                        }
                    };

                cargarLibros();
                document.querySelector('#update-book-form').addEventListener('submit', updatelibross);
            } else {
                console.error('Error al obtener los datos del usuario:', userData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.log('El usuario no está autenticado.');
        window.location.href = '/';
    }
});
/*
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 3000);
    
};*/