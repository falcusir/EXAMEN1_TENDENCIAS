import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import ping from './ping/ping.js';
import greet from './greet/greet.js';
const server = new Hono();
server.get('/', (c) => {
    return c.text('Hello Chiquill@s!');
});
server.route('/', ping);
server.route('/', greet);
serve({
    fetch: server.fetch,
    port: 3000
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
