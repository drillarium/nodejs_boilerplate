import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import Bonjour from 'bonjour-service'
import { authRouter } from './authentication/auth.router';
import { logger } from "./logger"                                                 // logger

const app = express();

// parse incoming requests with JSON payload
app.use(express.json());

// route
app.use("/api/auth", authRouter);

// initialize a simple http server
const server = http.createServer(app);

// initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {

    // connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {

        // log the received message and send it back to the client
        logger.info(`[server]: received: ${message}, message`);

        ws.send(`Hello, you sent -> ${message}`);
    });

    // send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

// parse command args
console.log(process.argv);

// start our server
const port = 8999;
server.listen(port, () => {
    logger.info(`[server]: server is running at: ${port}`);

    // Bonjour
    const instance = new Bonjour();

    // advertise an HTTP server on port 3000
    instance.publish({ name: 'My Web Server', type: 'http', port: port });

    // browse for all http services
    instance.find({ type: 'http' }, (service) => {
        logger.info(`[server]: found an HTTP server ${JSON.stringify(service)}`);
    });
});
