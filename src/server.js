import http from 'http'
import app from './index.js'

const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(port, ()=>{
    console.log(port);
})

