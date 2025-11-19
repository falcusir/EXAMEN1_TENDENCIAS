import { Hono } from 'hono';
import { Greet } from './greet.mariadb.js';
const greet = new Hono();
//MUESTRA TODOS LOS SALUDOS
greet.get('/regards', async (c) => c.json(await Greet.findAll()));
//MUESTRA POR ID
greet.get('/greet/:id', async (c) => c.json(await Greet.findById(Number(c.req.param('id')))));
//INSERTA UNO NUEVO
greet.post('/greet', async (c) => {
    const param = await c.req.json();
    const result = await Greet.create(param);
    return c.json(result, 201);
});
// ACTUALIZA EL SALUDO
greet.put('/greet/:id', async (c) => {
    const id = Number(c.req.param('id'));
    const param = await c.req.json();
    const result = await Greet.update(id, param);
    return c.json(result);
});
// ELIMINA UN SALUDO
greet.delete('/greet/:id', async (c) => {
    const id = Number(c.req.param('id'));
    const result = await Greet.delete(id);
    return c.json(result);
});
//ESTADISTICA
//1. Total, de registros
//2. Conteo por idioma
greet.get('/greet/stats', async (c) => {
    const result = await Greet.stats();
    return c.json(result);
});
export default greet;
