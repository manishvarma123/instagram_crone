import { setPosts } from "@/redux/Slices/postSlice";
import axios from "axios";
import { useEffect } from "react"
import { useDispatch } from "react-redux"


const useGetAllPost = async() => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllPost = async() => {
            try {
                const res = await axios.get('http://localhost:8000/api/v1/post/all',{withCredentials:true})
                console.log(res.data.posts)
                if(res.data.success){
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllPost();
    },[])
}

export default useGetAllPost