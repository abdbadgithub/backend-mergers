import { Router } from 'express';
import userRoute from './user.route';
import messageRoutes from './message.route';

// Index
const indexRoute = Router();

indexRoute.get('', async (req, res) => {
  res.json({ message: 'Welcome User' });
});

indexRoute.use('/users', userRoute);
indexRoute.use('/messages', messageRoutes);

export default indexRoute;