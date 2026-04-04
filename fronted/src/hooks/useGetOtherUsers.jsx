import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
import { BASE_URL } from "../config";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/user`, {
          withCredentials: true, // ✅ IMPORTANT
        });

        console.log("other users -> ", res);
        dispatch(setOtherUsers(res.data));
      } catch (error) {
        console.log("Error fetching users:", error.response?.data || error.message);
      }
    };

    fetchOtherUsers();
  }, [dispatch]);
};

export default useGetOtherUsers;