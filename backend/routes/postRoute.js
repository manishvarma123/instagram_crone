import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import addNewPost from '../controllers/post/addNewPost.js';
import getAllPost from '../controllers/post/getAllPost.js';
import getUserPost from '../controllers/post/getuserPost.js';
import likePost from '../controllers/post/likePost.js';
import dislikePost from '../controllers/post/dislikePost.js';
import addComment from '../controllers/post/addComment.js';
import getCommentsOfPost from '../controllers/post/getCommentsOfPost.js';
import deletePost from '../controllers/post/deletePost.js';
import bookmarkPost from '../controllers/post/bookmarkPost.js';


const router = express.Router();

router.post("/addpost", isAuthenticated, upload.single('image'), addNewPost);
router.get("/all", isAuthenticated, getAllPost);
router.get("/userpost/all", isAuthenticated, getUserPost);
router.get("/:id/like", isAuthenticated, likePost);
router.get("/:id/dislike", isAuthenticated, dislikePost);
router.post("/:id/comment", isAuthenticated, addComment);
router.post("/:id/comment/all", isAuthenticated, getCommentsOfPost);
router.delete("/delete/:id", isAuthenticated, deletePost);
router.get("/:id/bookmark", isAuthenticated, bookmarkPost);

export default router