import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import { homeRoutes } from './routes';
import { getSocket, initSocket } from './common/socket';
import { createServer } from 'http';

const main = async () => {
    // CONSTANTS
    const app: Application = express();
    const port = process.env.PORT ?? 5000;

    // MIDDLEWARE
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({ origin: '*' }));

    // ROUTES
    app.use('/', homeRoutes);

    // WEB SOCKETS
    const server = createServer(app);
    initSocket(server);
    const io = getSocket();
    io.on('connection', (socket) => {
        console.log('Connected', socket.id);

        socket.on('disconnect', () => {
            console.log('Disconnected');
        });
    });

    // STARTING THE SERVER
    server.listen(port, () => console.log(`http://localhost:${port}`));
};

main().catch((error) => console.log(error));
