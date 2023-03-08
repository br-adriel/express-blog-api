import { Router } from 'express';
import UserController from '../controllers/userController';

const userRoutes = Router();
const userController = new UserController();

userRoutes.get('/', userController.getUsers);
userRoutes.post('/', userController.createUser);

userRoutes.get('/:id', userController.getUser);
userRoutes.patch('/:id', userController.updateUser);
userRoutes.delete('/:id', userController.removeUser);

userRoutes.patch('/:id/author', userController.toggleUserAuthorPrivileges);

userRoutes.patch('/:id/admin', userController.toggleUserAdminrPrivileges);

userRoutes.post('/authenticate', userController.login);

export default userRoutes;
