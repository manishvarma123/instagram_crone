import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './components/Signup'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Login from './components/Login'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { io } from 'socket.io-client';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/Slices/socketSlice'
import { setOnlineUsers } from './redux/Slices/chatSlice'
import { setLikeNotification } from './redux/Slices/rtnSlice'
import ProtectedRoutes from './components/ProtectedRoutes'


const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: "/",
        element: <ProtectedRoutes><Home /></ProtectedRoutes>
      },
      {
        path: "/profile/:id",
        element: <ProtectedRoutes><Profile /></ProtectedRoutes>
      },
      {
        path: "/account/edit",
        element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
      },
      {
        path: "/chat",
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  }
])


function App() {

  const { user } = useSelector(state => state.auth)
  const {socket} = useSelector(state => state.socketio);
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });

      dispatch(setSocket(socketio));

      // listen all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))
      });

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      })

      return () => {
        socketio.close();
        dispatch(setSocket(null))
      }
    } else if (socket) {
      socket?.close();
      dispatch(setSocket(null))
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
