import fs from 'fs';
import path from 'path';

export const charToImage = (char: string) => {
    const filename = `${char.toUpperCase()}.jpg`;
    const filepath = path.join(
        process.cwd(),
        'src',
        'data',
        'letters',
        filename
    );

    const exists = fs.existsSync(filepath);
    if (!exists) return '';

    return filepath;
};
