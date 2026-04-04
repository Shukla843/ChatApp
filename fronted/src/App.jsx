import Signup from './components/Signup';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './components/HomePage';
import Login from './components/Login';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { setOnlineUsers } from './redux/userSlice';
import { BASE_URL } from './config';

console.log("BASE_URL:", BASE_URL);

// Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/login",
    element: <Login />
  },
]);

function App() {
  const { authUser } = useSelector(store => store.user);
  const dispatch = useDispatch();

  // ✅ socket ko yaha store karo (Redux me nahi)
  const socketRef = useRef(null);

  useEffect(() => {
    if (authUser) {
      // ✅ connect socket
      socketRef.current = io(BASE_URL, {
        query: {
          userId: authUser._id
        }
      });

      // ✅ listen online users
      socketRef.current.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      // ✅ cleanup
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }
  }, [authUser, dispatch]);

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <RouterProvider router={router} />
    </div>
  ); 
}

export default App;