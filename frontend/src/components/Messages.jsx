import React, { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'

const Messages = ({ selectedUser }) => {
    useGetRTM()
    useGetAllMessage()
    const { messages } = useSelector((state) => state.chat)
    const { user } = useSelector((state) => state.auth)

    // Ref to the last message
    const lastMessageRef = useRef(null)

    // Scroll to the last message whenever `messages` change
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    return (
        <div className="overflow-y-auto flex-1 flex flex-col gap-2 p-4">
            {/* Header Section */}
            <div className="flex justify-center">
                <div className="flex flex-col justify-center items-center">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button className="h-8 my-2" variant="secondary">
                            View Profile
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Messages Section */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-3">
                {messages?.map((msg, index) => (
                    <div
                        key={msg._id}
                        ref={index === messages.length - 1 ? lastMessageRef : null} // Attach ref to the last message
                        className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        <div
                            className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user._id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-black'
                                }`}
                        >
                            {msg?.message}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Messages
