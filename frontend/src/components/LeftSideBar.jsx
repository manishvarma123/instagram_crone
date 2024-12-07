import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/Slices/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/Slices/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'

const LeftSideBar = () => {

    const navigate = useNavigate();
    const {user} = useSelector(state => state.auth);
    const {likeNotification} = useSelector(state => state.realTimeNotification);
    const dispatch = useDispatch();
    const [openPostDialogue,setOpenPostDialog] = useState(false)

    const logouthandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true })
            if (res.data.success) {
                dispatch(setUser(null))
                dispatch(setPosts(null))
                dispatch(setSelectedPost(null))
                navigate("/login")
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }  

    const sidebarHandler = (itemtype) => {
        if (itemtype === "Logout"){
            logouthandler();
        } else if(itemtype === "Create"){
            setOpenPostDialog(true);
        } else if(itemtype === "Profile"){
            navigate(`/profile/${user?._id}`)
        } else if(itemtype === "Home"){
            navigate('/')
        } else if(itemtype === "Messages"){
            navigate('/chat')
        }
    }

    const sideBarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" }
    ]

    return (
        <div className='fixed top-0 left-0 z-10 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
                <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
                <div>
                    {
                        sideBarItems.map((item, index) => {
                            return (
                                <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                                    {item.icon}
                                    <span>{item.text}</span>

                                    {
                                        item.text === "Notifications" && likeNotification.length > 0 && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification?.length}</Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        {
                                                            likeNotification.length === 0 ? (<p>No new Notification</p>) : (
                                                                likeNotification.map((notification)=>{
                                                                    return(
                                                                        <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                            <Avatar>
                                                                                <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                                <AvatarFallback>CN</AvatarFallback>
                                                                            </Avatar>
                                                                            <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <CreatePost openPostDialogue={openPostDialogue} setOpenPostDialog={setOpenPostDialog} />
        </div>
    )
}

export default LeftSideBar