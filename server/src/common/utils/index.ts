import fs from 'fs';
import path from 'path';

export const charToImage = (char: string) => {
    const filename = `${char.toUpperCase()}.jpg`;
    const filepath = path.join(process.cwd(), 'src', 'data', 'ISL', filename);

    const exists = fs.existsSync(filepath);
    if (!exists) return '';

    return filepath;
};

export const sleep = async (secs: number) =>
    new Promise((resolve) => setTimeout(resolve, secs * 1000));
