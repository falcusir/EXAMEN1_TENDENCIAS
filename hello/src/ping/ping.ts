import { Hono } from "hono"; 
const ping = new Hono()
ping.get('/ping',(c)=> {
    return c.json({'Mensaje': 'pong'})
})
export default ping