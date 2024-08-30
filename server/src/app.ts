import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import { homeRoutes } from './routes';
import { createServer } from 'http';
import path from 'path';
import imageToBase64 from 'image-to-base64';
import { charToImage } from './common/utils';
import { Server } from 'socket.io';
import OpenAI from 'openai';
import fs from 'fs';
import { sleep } from './common/utils';

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET_KEY
});

async function audioToText(filePath: string) {
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: 'whisper-1'
    });
    return transcription.text;
}

const main = async () => {
    // CONSTANTS
    const app: Application = express();
    const port = process.env.PORT ?? 5000;
    const server = createServer(app);
    const io = new Server(server, { cors: { origin: '*' } });

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

        // 1. Audio to Images
        socket.on(
            'audio-stream',
            async ({ audio: base64Audio }: { audio: string }) => {
                try {
                    // convert base64 audio to audio file on disk
                    const filePath = path.join(
                        __dirname,
                        '..',
                        'audio',
                        'audo.mp3'
                    );
                    const base64Data = base64Audio.replace(
                        /^data:audio\/\w+;base64,/,
                        ''
                    );
                    const audioBuffer = Buffer.from(base64Data, 'base64');

                    await new Promise((resolve, reject) =>
                        fs.writeFile(filePath, audioBuffer, (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(filePath);
                            }
                        })
                    );

                    // convert audio file to text
                    const text = await audioToText(filePath);

                    // convert text to images
                    for (let char of text) {
                        const imagePath = charToImage(char);
                        if (imagePath) {
                            const base64 = await imageToBase64(imagePath);
                            socket.emit('image-stream', { image: base64 });
                            await sleep(2); // 2 secs
                        }
                    }
                } catch (error) {
                    socket.emit('image-stream-error', { image: '' });
                    console.error(error);
                }
            }
        );
    });

    // STARTING THE SERVER
    server.listen(port, () => console.log(`http://localhost:${port}`));
};

main().catch((error) => console.log(error));
