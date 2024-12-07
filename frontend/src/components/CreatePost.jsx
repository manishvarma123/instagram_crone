import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/Slices/postSlice';

const CreatePost = ({openPostDialogue,setOpenPostDialog}) => {

  const imageRef = useRef();
  const [file,setFile] = useState("");
  const [caption,setcaption] = useState("");
  const [imagePreview,setImagePreview] = useState("")
  const [loading,setLoading] = useState(false);

  const {user} = useSelector(state => state.auth)
  const {posts} = useSelector(state => state.post)

  const dispatch = useDispatch()

  const fileChangeHandler = async(e) => {
    const file = e.target.files[0];
    // console.log(file)
    if(file){
      setFile(file)
      const dataUrl = await readFileAsDataURL(file)
      setImagePreview(dataUrl)
      // console.log(dataUrl);

    }

  }

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption",caption);
    if(imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/api/v1/post/addpost", formData , {
        headers : {
          'Content-Type' : 'multipart/form-data'
        },
        withCredentials : true
      });

      if(res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]))
        setOpenPostDialog(false)
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={openPostDialogue}>
      <DialogContent onInteractOutside={()=>setOpenPostDialog(false)}>
        <DialogHeader className="text-center font-bold">Create New Post</DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className=''>
            <h1 className='font-semibold text-xs'>{user?.username? user?.username : "username"}</h1>
            <span className='text-gray-600 text-xs'>{user?.bio? user?.bio : 'Bio Here...'}</span>
          </div>
        </div>
        <Textarea value={caption} onChange={(e)=>setcaption(e.target.value)} className="focus-visible:ring-transparent" placeholder="Write a caption..." />
        {
          imagePreview && (
            <div className="w-full h-64 flex justify-center items-center rounded-md overflow-hidden">
              <img className='object-contain h-full rounded-md' src={imagePreview} alt="preview_img" />
            </div>
          )
        }
        <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler}/>
        <Button onClick={() => imageRef.current.click()} className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]">Select from computer</Button>
        {
          imagePreview && (
            loading ? (
              <Button>
                <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button onClick={createPostHandler} type="submit" className="w-full">Post</Button>
            )
            
          )
        }
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost