import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export const postPrediction = async (req: Request, res: Response) => {
    try {
        // check if image does not exist
        const image = req.file;
        if (!image) {
            return res.json({
                data: null,
                errors: [{ field: 'image', message: 'Please upload an image' }]
            });
        }

        const formData = new FormData();
        formData.append('image', fs.createReadStream(image.path));

        const resp = await axios.post(
            'http://localhost:8080/predict',
            formData,
            {
                headers: {
                    ...formData.getHeaders() // Include the correct headers
                }
            }
        );
        console.log(resp);

        return res.json({
            ...resp.data
        });
    } catch (error) {
        console.error(error);
        return res.json({
            data: null,
            errors: [{ field: 'server', message: 'Something went wrong' }]
        });
    }
};
