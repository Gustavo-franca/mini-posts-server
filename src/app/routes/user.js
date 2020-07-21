import express from 'express';
import UserController from '../controllers/UserController'
import authMiddleware from '../middleware/authentication';
const router = express.Router();
const userController = new UserController();

router.use(authMiddleware);
router.get('/logout',userController.logout);
export default router;


