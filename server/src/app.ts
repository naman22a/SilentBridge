import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import { homeRoutes } from './routes';
import { createServer } from 'http';
import path from 'path';
import imageToBase64 from 'image-to-base64';
import { charToImage } from './common/utils';
import { Server } from 'socket.io';

const main = async () => {
    // CONSTANTS
    const app: Application = express();
    const port = process.env.PORT ?? 5000;
    const server = createServer(app);
    const io = new Server(server);

    // MIDDLEWARE
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({ origin: '*' }));
    app.use(express.static(path.join(__dirname, '..', 'public')));

    // ROUTES
    app.use('/', homeRoutes);

    // WEB SOCKETS
    io.on('connection', (socket) => {
        console.log('Connected', socket.id);

        socket.on('disconnect', () => {
            console.log('Disconnected');
        });

        // EVENTS

        // 1. Text to Image
        socket.on('text-stream', ({ text }: { text: string }) => {
            let index = 0;

            const intervalId = setInterval(async () => {
                if (index >= text.length) {
                    clearInterval(intervalId);
                    return;
                }

                const char = text[index];

                try {
                    const base64 = await imageToBase64(charToImage(char));
                    socket.emit('image-stream', { image: base64 });
                } catch (error) {
                    console.error(error);
                }

                index++;
            }, 2000); // 2 seconds
        });
    });

    // STARTING THE SERVER
    server.listen(port, () => console.log(`http://localhost:${port}`));
};

main().catch((error) => console.log(error));
