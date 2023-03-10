import { Router } from 'express';
import UserController from '../controllers/userController';
import { UserBelongsToUser } from '../middlewares/ResourceBelongsToUser.middleware';
import UserMustBeAuthenticated from '../middlewares/UserMustBeAuthenticated.middleware';

const userRoutes = Router();
const userController = new UserController();

userRoutes.get('/', userController.getUsers);
userRoutes.post('/', userController.createUser);

userRoutes.get('/:id', userController.getUser);
userRoutes.patch(
  '/:id',
  UserMustBeAuthenticated,
  UserBelongsToUser,
  userController.updateUser
);
userRoutes.delete(
  '/:id',
  UserMustBeAuthenticated,
  UserBelongsToUser,
  userController.removeUser
);

userRoutes.patch(
  '/:id/author',
  UserMustBeAuthenticated,
  userController.toggleUserAuthorPrivileges
);

userRoutes.patch(
  '/:id/admin',
  UserMustBeAuthenticated,
  userController.toggleUserAdminrPrivileges
);

userRoutes.post('/authenticate', userController.login);

userRoutes.post('/authenticate/refresh', userController.refreshToken);

export default userRoutes;
