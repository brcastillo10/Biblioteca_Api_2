const request = require('supertest');
const app = require('../src/server');
const Libros = require('../src/models/libros');
const User = require('../src/models/User');
const bcrypt = require('bcrypt');


describe('User Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('Debe registrar un nuevo usuario', async () => {
      const response = await request(app)
          .post('/register')
          .send({
              nombre: 'Juan',
              edad: 30,
              correo: 'yuulito@example.com',
              ciudad: 'Quito',
              contrasena: 'password123'
          });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.nombre).toBe('Juan');
  });

  it('Debe logearse el usuario y redireccionarlo a Home', async () => {
      await User.create({
          nombre: 'Ana',
          edad: 25,
          correo: 'aaaaana@example.com',
          ciudad: 'Guayaquil',
          contrasena: await bcrypt.hash('password123', 10)
      });

      const response = await request(app)
          .post('/login')
          .send({
              correo: 'aaaaana@example.com',
              contrasena: 'password123'
          });

      expect(response.status).toBe(200);
  });

  it('Debe eliminar un usuario con su ID', async () => {
      const user = await User.create({
          nombre: 'Luis',
          edad: 28,
          correo: 'luis@example.com',
          ciudad: 'Cuenca',
          contrasena: await bcrypt.hash('password123', 10)
      });

      const response = await request(app)
          .delete(`/users/${user._id}`);

      expect(response.status).toBe(200);
      expect(response.text).toBe('Usuario eliminado correctamente');
  });

  it('Debe actualizar un usuario con su ID', async () => {
      const user = await User.create({
          nombre: 'Mario',
          edad: 40,
          correo: 'mariooooo@example.com',
          ciudad: 'Manta',
          contrasena: await bcrypt.hash('password123', 10)
      });

      const response = await request(app)
          .put(`/users/${user._id}`)
          .send({ nombre: 'Mariooo Updated', edad: 41 });

      expect(response.status).toBe(200);
      expect(response.body.nombre).toBe('Mariooo Updated');
      expect(response.body.edad).toBe(41);
  });
});

describe('Libros Routes', () => {
  beforeEach(async () => {
    await Libros.deleteMany({}); 
  });

  it('Debe registrar un nuevo Libro', async () => {
      const response = await request(app)
          .post('/libros')
          .send({
              titulo: 'Cien Años de Soledad',
              editorial: 'Editorial Sudamericana',
              fechaDePublicacion: '1967-06-05',
              autores: ['Gabriel Garcia Marquez'],
              genero: 'Realismo mágico',
              resumen: 'La historia de la familia Buendía en el pueblo de Macondo...'
          });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.titulo).toBe('Cien Años de Soledad');
  });

  it('Debe traer todos los libros', async () => {
      await Libros.create({
          titulo: '1984',
          editorial: 'Editorial Planeta',
          fechaDePublicacion: '1949-06-08',
          autores: ['George Orwell'],
          genero: 'Distopía',
          resumen: 'Un análisis de la sociedad totalitaria.'
      });

      const response = await request(app).get('/libros');
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
  });

  it('Debe borrar un libro con su ID', async () => {
      const libro = await Libros.create({
          titulo: 'Brave New World',
          editorial: 'Harper & Brothers',
          fechaDePublicacion: '1932-08-01',
          autores: ['Aldous Huxley'],
          genero: 'Ciencia ficción',
          resumen: 'Una visión futurista de una sociedad controlada.'
      });

      const response = await request(app)
          .delete(`/libros/${libro._id}`);

      expect(response.status).toBe(200);
      expect(response.text).toBe('El lirbo fue eliminado correctamente');
  });

  it('Debe actualizar un libro con su ID', async () => {
      const libro = await Libros.create({
          titulo: 'Fahrenheit 451',
          editorial: 'Ballantine Books',
          fechaDePublicacion: '1953-10-19',
          autores: ['Ray Bradbury'],
          genero: 'Ciencia ficción',
          resumen: 'Una crítica a la censura y la pérdida de la individualidad.'
      });

      const response = await request(app)
          .put(`/libros/${libro._id}`)
          .send({ titulo: 'Fahrenheit 451 Updated' });

      expect(response.status).toBe(200);
      expect(response.body.titulo).toBe('Fahrenheit 451 Updated');
  });
});