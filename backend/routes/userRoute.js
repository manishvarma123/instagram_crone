import express from 'express';
import register from '../controllers/user/register.js'
import login from '../controllers/user/login.js'
import logout from '../controllers/user/logout.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import getProfile from '../controllers/user/getProfile.js'
import upload from '../middlewares/multer.js';
import editProfile from '../controllers/user/editProfile.js';
import getSuggestedUsers from '../controllers/user/getSuggestedUsers.js';
import followOrUnfollow from '../controllers/user/followOrUnfollow.js';



const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/logout',logout);
router.get('/:id/profile',isAuthenticated, getProfile);
router.post('/profile/edit',isAuthenticated,upload.single('profilePicture'), editProfile);
router.get('/suggested',isAuthenticated, getSuggestedUsers);
router.post('follow-or-unfollow/:id', isAuthenticated, followOrUnfollow);

export default router
