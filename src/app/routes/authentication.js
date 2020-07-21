import express from 'express';
import UserController from '../controllers/UserController'
const router = express.Router();
const userController = new UserController();


router.post('/register',userController.create);
router.post('/login',userController.login);

router.post('/forgot_password',userController.forgot)
router.post('/reset_password',userController.resetPassword)
export default router;


