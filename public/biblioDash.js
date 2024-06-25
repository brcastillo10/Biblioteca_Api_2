//Manejo de formulario para eliminar, modificar y añadir un libro

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addlibro');
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
});


/*

document.getElementById('addLibros').addEventListener('submit', async function (e){
    e.preventDefault();
    const titulo = document.getElementById('titulo').value;
    const editorial = document.getElementById('editorial').value;
    const fechaDePublicacion = document.getElementById('fechaDePublicacion').value;
    const autores = document.getElementById('autores').value;
    const genero = document.getElementById('genero').value;
    const resumen = document.getElementById('resumen').value;

    const response = await fetch('/libros',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({titulo, editorial, fechaDePublicacion, autores, genero, resumen })
    });

});
*/