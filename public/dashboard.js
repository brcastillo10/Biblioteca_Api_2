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

            const form = document.getElementById('add-book-form');
            const LibroLista = document.getElementById('book-list');
        
            // Función para cargar libros
            const CargarLibro = async () => {
                try {
                    const response = await fetch('/libros');
                    const libros = await response.json();
                    LibroLista.innerHTML = '';
                    libros.forEach(libro => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${libro._id}</td>
                            <td>${libro.titulo}</td>
                            <td>${libro.autores.join(', ')}</td>
                            <td><button class="btn btn-primary" onclick="deletelibro('${libro._id}')">Eliminar</button></td>
                        `;
                        LibroLista.appendChild(row);
                    });
                } catch (error) {
                    console.error('Error cargando libros:', error);
                }
            };
        
            // Función para registrar un libro
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const titulo = document.getElementById('titulo').value;
                const editorial = document.getElementById('editorial').value;
                const fechaDePublicacion = document.getElementById('fechaDePublicacion').value;
                const autores = document.getElementById('autores').value.split(',').map(a => a.trim()); //Para más autores separados por coma
                const genero = document.getElementById('genero').value;
                const resumen = document.getElementById('resumen').value;
        
                try {
                    const response = await fetch('/libros', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ titulo, editorial, fechaDePublicacion, autores, genero, resumen })
                    });
                    if (response.ok) {
                        form.reset();
                        CargarLibro();
                    } else {
                        console.error('Error al registrar el libro');
                    }
                } catch (error) {
                    console.error('Error al registrar el libro:', error);
                }
            });
        
            // Función para eliminar un libro
            window.deletelibro = async (id) => {
                try {
                    const response = await fetch(`/libros/${id}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        CargarLibro();
                    } else {
                        console.error('Error al eliminar un libro');
                    }
                } catch (error) {
                    console.error('Error al eliminar un libro:', error);
                }
            };
        
        
        
            // Cargar libros al inicio del dashboard
            CargarLibro();
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

//Manejo de formulario para eliminar, modificar y añadir un libro

document.addEventListener('DOMContentLoaded', () => {
    


});


// Aquí puedes agregar otras funciones necesarias para el dashboard, como:
// function cargarListaDeLibros() { ... }
// function manejarFormularioAgregarLibro() { ... }
// etc.