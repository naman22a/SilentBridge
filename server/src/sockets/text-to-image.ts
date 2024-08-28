import { getSocket } from '../common/socket';
import imageToBase64 from 'image-to-base64';
import { charToImage } from '../utils';

const io = getSocket();

io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('text-stream', ({ text }: { text: string }) => {
        for (let char of text) {
            setInterval(async () => {
                const base64 = await imageToBase64(charToImage(char));
                console.log(base64);
                socket.emit('image-stream', { image: base64 });
            }, 2000); // 2 secs
        }
    });
});
