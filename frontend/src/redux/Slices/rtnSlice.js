import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name : 'realtimeNotification',
    initialState : {
        likeNotification : [],

    },
    reducers : {
        // actions
        setLikeNotification : (state,action) => {
            if(action.payload.type === 'like'){
                state.likeNotification.push(action.payload);
            } else if(action.payload.type === 'dislike'){
                state.likeNotification = state.likeNotification.filter((item)=>item.userId !== action.payload.userId);
            }
            
        }
    }
})

export const {setLikeNotification} = rtnSlice.actions;

export default rtnSlice.reducer