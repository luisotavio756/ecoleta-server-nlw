import express from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import ItemController from './controllers/ItemsController';
import PointsController from './controllers/PointsController';

const routes = express.Router();
const upload = multer(multerConfig);

// Items Routes
routes.get('/items', ItemController.index);

// Points Routes
routes.get('/points', PointsController.index);
routes.get('/points/:id', PointsController.show);
routes.post('/points', upload.single('image'), PointsController.store);

export default routes;

