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

                const libroList = document.getElementById('book-list').querySelector('tbody');
                const updatelibroForm = document.getElementById('update-book-form');

                const cargarLibros = async () => {
                    try {
                        const response = await fetch('/libros', {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        const libros = await response.json();
                        libroList.innerHTML = '';
                        libros.forEach(libro => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${libro._id}</td>
                                <td>${libro.titulo}</td>
                                <td>${libro.autores.join(', ')}</td>
                                <td>
                                    <button class="btn btn-secondary" onclick="editBook('${libro._id}')">Editar</button>
                                    <button class="btn btn-danger" onclick="deleteBook('${libro._id}')">Eliminar</button>
                                </td>
                            `;
                            libroList.appendChild(row);
                        });
                    } catch (error) {
                        console.error('Error cargando libros:', error);
                    }
                };

                window.editBook = async (id) => {
                    try {
                        const response = await fetch(`/libros/${id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        if (response.status === 404) {
                            showMessage('Libro no encontrado', 'warning');
                            return;
                        }
                        const libro = await response.json();
                        document.getElementById('book-id').value = libro._id;
                        document.getElementById('titulo').value = libro.titulo;
                        document.getElementById('editorial').value = libro.editorial;
                        document.getElementById('fechaDePublicacion').value = libro.fechaDePublicacion.split('T')[0];
                        document.getElementById('autores').value = libro.autores.join(', ');
                        document.getElementById('genero').value = libro.genero;
                        document.getElementById('resumen').value = libro.resumen;
                    } catch (error) {
                        console.error('Error obteniendo libro:', error);
                    }
                };

                updatelibroForm.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const id = document.getElementById('book-id').value;
                    const titulo = document.getElementById('titulo').value;
                    const editorial = document.getElementById('editorial').value;
                    const fechaDePublicacion = document.getElementById('fechaDePublicacion').value;
                    const autores = document.getElementById('autores').value.split(',').map(a => a.trim());
                    const genero = document.getElementById('genero').value;
                    const resumen = document.getElementById('resumen').value;

                    try {
                        const response = await fetch(`/libros/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ titulo, editorial, fechaDePublicacion, autores, genero, resumen })
                        });
                        if (response.ok) {
                            cargarLibros();
                            updatelibroForm.reset();
                            showMessage('Libro actualizado correctamente', 'success');
                        } else {
                            console.error('Error actualizando libro');
                        }
                    } catch (error) {
                        console.error('Error actualizando libro:', error);
                    }
                });

                window.deleteBook = async (id) => {
                    try {
                        const response = await fetch(`/libros/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        if (response.ok) {
                            cargarLibros();
                        } else {
                            console.error('Error eliminando libro');
                        }
                    } catch (error) {
                        console.error('Error eliminando libro:', error);
                    }
                };

                cargarLibros();
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

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 3000);
};