import knex from '../database/connection';
import { Request, Response } from 'express';

export default {
    async index(req: Request, res: Response) {
        const items = await knex('items').select('*');
    
        const array = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.1.103:8000/uploads/${item.image}`
            };
        })
    
        return res.json(array);
    }
};