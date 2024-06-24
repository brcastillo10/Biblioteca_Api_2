const request = require('supertest');
const app = require('../src/server');

describe('Login Endpoint', () => {
  it('Debería iniciar sesión correctamente con credenciales válidas', async () => {
    const response = await request(app)
      .post('/login')
      .send({ correo: 'erick@gmail.com', contrasena: 'erick' });

    console.log(response.body); 
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('token');
  });

  it('Debería fallar al iniciar sesión con credenciales inválidas', async () => {
    const response = await request(app)
      .post('/login')
      .send({ correo: 'er@gmail.com', contrasena: 'er' });

    console.log(response.body); 
    expect(response.statusCode).toEqual(401);
    expect(response.body).toHaveProperty('error');
  });
});
