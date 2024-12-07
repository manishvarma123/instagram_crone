import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarImage } from './ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts, setSelectedPost } from '@/redux/Slices/postSlice'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'

const CommentDialog = ({ openComment, setOpenComment }) => {

    const [text, setText] = useState("")
    const { selectedPost,posts } = useSelector(state => state.post)
    const [comments,setComment] = useState([])
    const dispatch = useDispatch()

    useEffect(()=>{
        if(selectedPost){
            setComment(selectedPost?.comments)
        }
    },[selectedPost])

    const changeEventHandler = (e) => {
        const textInput = e.target.value;
        if (textInput.trim()) {
            setText(textInput)
        } else {
            setText("")
        }
    }

    const sendMessageHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                const updatedCommentData = [...comments, res.data.comment]
                setComment(updatedCommentData)

                const updatedPostData = posts.map(p => p._id === selectedPost?._id ? (
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

    return (
        <div>
            <Dialog open={openComment} >
                <DialogContent onInteractOutside={() => {
                    // dispatch(setSelectedPost(null))
                    setOpenComment(false)
                }
                } className="max-w-5xl h-full max-h-[80vh] p-0 flex flex-col">
                    <div className="flex flex-1 h-full">
                        <div className="w-1/2 h-full">
                            <img
                                src={selectedPost?.image}
                                alt="post_img"
                                className='w-full h-full object-cover rounded-l-lg'
                            />
                        </div>
                        <div className="w-1/2 flex flex-col justify-between">
                            <div className="flex justify-between items-center p-4">
                                <div className="flex gap-3 items-center">
                                    <Link>
                                        <Avatar className="bg-gray-300 flex items-center justify-center">
                                            <AvatarImage src={selectedPost?.author?.profilePicture} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div>
                                        <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                                    </div>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <MoreHorizontal className='cursor-pointer' />
                                    </DialogTrigger>
                                    <DialogContent className="flex flex-col items-center text-sm text-center">
                                        <div className='w-full cursor-pointer text-[#ED4956] font-bold'>Unfollow</div>
                                        <div className='w-full cursor-pointer'>Add to favourite</div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <hr />
                            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                                {
                                    comments?.map((comment) => <Comment key={comment?._id} comment={comment} />)
                                }
                            </div>
                            <div className='p-4'>
                                <div className="flex items-center gap-2">
                                    <input value={text} onChange={changeEventHandler} type="text" placeholder='Add a comment...' className='w-full outline-none border border-gray-300 px-3 py-2 rounded text-sm' />
                                    <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">Send</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CommentDialog