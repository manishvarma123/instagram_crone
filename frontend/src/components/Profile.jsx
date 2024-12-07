import useGetUserProfile from '@/hooks/useGetUserProfile'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

const Profile = () => {

  const params = useParams();
  const userId = params.id
  useGetUserProfile(userId)
  const [activetab, setActivetab] = useState('posts');

  const { userProfile,user } = useSelector(state => state.auth);
  const isLoggedInuserProfile = userProfile?._id === user?._id;
  const isfollowing = false;

  const handletabChange = (tab) => {
    setActivetab(tab);
  }

  const displayedPost = activetab === "posts" ? userProfile?.posts : userProfile?.bookmarks

  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10'>
      <div className="flex flex-col gap-20 p-8 w-full">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className='h-32 w-32'>
              <AvatarImage src={userProfile?.profilePicture} alt='profilephoto' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {
                  isLoggedInuserProfile ? (
                    <>
                      <Link to={'/account/edit'}><Button variant='secondary' className="hover:bg-gray-200 h-8">Edit Profile</Button></Link>
                      <Button variant='secondary' className="hover:bg-gray-200 h-8">View archive</Button>
                      <Button variant='secondary' className="hover:bg-gray-200 h-8">Ad tools</Button>
                    </>
                  ) : (
                    isfollowing ? (
                      <>
                        <Button variant='secondary' className="h-8" >Follow</Button>
                        <Button variant='secondary' className="h-8" >Message</Button>
                      </>
                    ) : (
                      <Button className="bg-[#0095F6] hover:bg-[#3192d2] h-8" >Follow</Button>
                    )
                  )
                }
              </div>
              <div className='flex items-center gap-5'>
                <p><span className='font-semibold'>{userProfile?.posts.length}</span> posts</p>
                <p><span className='font-semibold'>{userProfile?.followers.length}</span> followers</p>
                <p><span className='font-semibold'>{userProfile?.following.length}</span> followings</p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className="font-semibold">{userProfile?.bio || 'bio here...'}</span>
                <Badge className='w-fit' variant='secondary'><AtSign className='w-4'/><span className='pl-1'>{userProfile?.username}</span></Badge>
                <span>I am Full Stack developer</span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-slate-400">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span onClick={()=>handletabChange('posts')} className={`py-3 cursor-pointer ${activetab === "posts" ? 'font-bold' : ''}`}>POSTS</span>
            <span onClick={()=>handletabChange('saved')} className={`py-3 cursor-pointer ${activetab === "saved" ? 'font-bold' : ''}`}>SAVED</span>
            <span onClick={()=>handletabChange('reels')} className={`py-3 cursor-pointer ${activetab === "reels" ? 'font-bold' : ''}`}>REELS</span>
            <span onClick={()=>handletabChange('tags')} className={`py-3 cursor-pointer ${activetab === "tags" ? 'font-bold' : ''}`}>TAGS</span>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            {
              displayedPost?.map((post)=>{
                return(
                  <div key={post?._id} className='relative group bg-red-600 rounded-md overflow-hidden cursor-pointer'>
                    <img src={post?.image} alt="post_image" className='w-full aspect-square object-cover'/>
                    <div className="absolute bg-black/50 inset-0 opacity-0 group-hover:opacity-100 duration-300 flex justify-center items-center">
                      <div className="flex items-center text-white space-x-4">
                        <Button className="flex items-center gap-2 hover:text-gray-300 hover:bg-slate-800">
                          <Heart />
                          <span>{post?.likes.length}</span>
                        </Button>
                        <Button className="flex items-center gap-2 hover:text-gray-300 hover:bg-slate-800">
                          <MessageCircle />
                          <span>{post?.comments.length}</span>
                        </Button>
                        
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile