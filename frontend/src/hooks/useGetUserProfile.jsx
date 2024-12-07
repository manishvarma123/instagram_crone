import { setSuggestedUsers, setUserProfile } from "@/redux/Slices/authSlice";
import axios from "axios";
import { useEffect } from "react"
import { useDispatch } from "react-redux"


const useGetUserProfile = async(userId) => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchUserProfile = async() => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`,{withCredentials:true})
                if(res.data.success){
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchUserProfile();
    },[])
}

export default useGetUserProfile