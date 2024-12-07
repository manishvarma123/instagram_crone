import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/Slices/postSlice'
import { Badge } from './ui/badge'


const Post = ({ post }) => {

    const [text, setText] = useState("")
    const [openComment, setOpenComment] = useState(false)
    const { user } = useSelector(state => state.auth)
    const { posts } = useSelector(state => state.post)
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false)
    const [postLike, setpostLike] = useState(post.likes.length);
    const [comment, setComment] = useState([])

    const dispatch = useDispatch();

    useEffect(() => {
        setComment(post.comments)
    }, [posts])

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText)
        } else {
            setText("")
        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, { withCredentials: true })
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1
                setpostLike(updatedLikes);
                setLiked(!liked)

                // apne post ko update karunga
                const updatedPostData = posts.map(p => p._id === post._id ? { ...p, likes: liked ? p.likes.filter(id => id !== user?._id) : [...p.likes, user?._id] } : p)
                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);

        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment]
                setComment(updatedCommentData)

                const updatedPostData = posts.map(p => p._id === post._id ? (
                    { ...p, comments: updatedCommentData }
                ) : (
                    p
                ))
                dispatch(setPosts(updatedPostData))
                setText("")
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`, { withCredentials: true });
            if (res.data.success) {
                const updatedPost = posts.filter((postitem) => postitem?._id !== post?._id)
                dispatch(setPosts(updatedPost))

                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/bookmark`, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className="w-full flex justify-between items-center">
                <div className='flex flex-grow items-center gap-2'>
                    <Avatar>
                        <AvatarImage src='' alt='post_image' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-3">
                        <h1>{post?.author?.username}</h1>
                        {user?._id === post.author._id && <Badge variant="secondary">Author</Badge>}
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        {
                            post?.author?._id !== user?._id && (
                                <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
                            )
                        }
                        <Button variant="ghost" className="cursor-pointer w-fit">Add to favourites</Button>
                        {
                            user && user?._id === post?.author?._id && <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-fit">Delete</Button>
                        }

                    </DialogContent>
                </Dialog>
            </div>
            <img
                className='w-full rounded-sm my-2 aspect-square object-cover'
                src={post?.image}
                alt="post_img"
            />

            <div className='flex justify-between items-center gap-2 my-2'>
                <div className='flex items-center gap-4'>
                    {
                        liked ? <FaHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer text-red-600' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    }

                    <MessageCircle onClick={() => {
                        dispatch(setSelectedPost(post))
                        setOpenComment(true)
                    }} className='cursor-pointer hover:text-gray-600' />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block mb-2'>{postLike} likes</span>
            <p>
                <span className='font-medium mr-2'>{post?.author?.username}</span>
                {post?.caption}
            </p>
            <span onClick={() => {
                dispatch(setSelectedPost(post))
                setOpenComment(true)
            }} className='cursor-pointer text-sm text-gray-500'>View all {comment?.length} comments</span>
            <CommentDialog openComment={openComment} setOpenComment={setOpenComment} />
            <div className='flex justify-between items-center gap-2'>
                <input
                    type='text'
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none text-sm w-full'
                />
                {text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>}

            </div>

        </div>
    )
}

export default Post