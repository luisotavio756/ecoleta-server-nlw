import knex from '../database/connection';
import { Request, Response } from 'express';


export default {
    async index(req: Request, res: Response) {
        const {
            city,
            uf,
            items,
            latitude,
            longitude
        } = req.query;

        const parserItems = String(items)
            .split(', ')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parserItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        const serializePoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.1.103:8000/uploads/${point.image}`
            }
        })

        return res.json(serializePoints);
    },

    async show(req: Request, res: Response) {
        const { id } = req.params;

        const point = await knex('points').where('id', id).first();

        if(!point)
            return res.status(400).json({ error: 'Point not found !' });

        const serializePoint ={
            ...point,
            image_url: `http://192.168.1.103:8000/uploads/${point.image}`
        };

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.id', id)
            .select('items.title');

        return res.json({ point: serializePoint, items });
    },

    async store(req: Request, res: Response) {
        const { 
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;
        
     
        const trx = await knex.transaction();
        
        const point = {
            image: req.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        const insertedId = await trx('points').insert(point);

        let pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
            return {
                item_id: item_id,
                point_id: insertedId[0]
            }
        });

        await trx('point_items').insert(pointItems);
        await trx.commit();

        return res.json({
            id: insertedId[0],
            ...point
        });
        // return res.json(insertedId);
        
    }

    

}