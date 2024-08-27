import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import { homeRoutes } from './routes';

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

    // STARTING THE SERVER
    app.listen(port, () => console.log(`http://localhost:${port}`));
};

main().catch((error) => console.log(error));
