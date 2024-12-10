import { Router } from 'express';
import {
    createUser,
    getUser,
    getUsers,
    updateUser,
} from '../controllers/user.controller';
// Users layout Route
const userRoute = Router();
userRoute.post('', createUser);
userRoute.get('', getUsers);
userRoute.get('/:userid', getUser);
// userRoute.patch('/:userid', updateUser);
export default userRoute;