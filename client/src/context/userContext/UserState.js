import axios from "axios"
import React, { useReducer } from "react"
import { useContext } from "react"
import { API } from "../../utils/proxy"
import { AuthContext } from "../authContext/authContext"
import {
  USER_ERROR,
  USER_LOADING,
  USER_SUCCESS,
  ADD_FRIEND_REQUEST,
  UN_FRIEND_REQUEST,
  FRIEND_REQUEST_ACCEPT,
  FRIEND_REQUEST_DELETE,
  ALL_USERS,
} from "../types"
import { UserContext } from "./UserContext"
import UserReducer from "./UserReducer"

export const UserState = ({ children }) => {
  const initialState = {
    user: null,
    all: [],
    friends: null,
    error: "",
    success: "",
    loading: true,
  }
  const [state, dispatch] = useReducer(UserReducer, initialState)
  const authContext = useContext(AuthContext)
  const getAllUsers = async () => {
    try {
      dispatch({
        type: USER_LOADING,
        payload: true,
      })
      const response = await axios.get(`${API}/users`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("_token"))}`,
        },
      })
      // console.log(response.data)
      dispatch({
        type: ALL_USERS,
        payload: response.data,
      })
    } catch (error) {
      dispatch({
        type: USER_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const getUserById = async (userId) => {
    try {
      dispatch({
        type: USER_LOADING,
        payload: true,
      })
      const response = await axios.get(`${API}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("_token"))}`,
        },
      })
      // console.log(response.data)
      dispatch({
        type: USER_SUCCESS,
        payload: response.data,
      })
      const { data } = response
      return data
    } catch (error) {
      dispatch({
        type: USER_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const sendFriendRequest = async (userId, friendId) => {
    try {
      dispatch({
        type: USER_LOADING,
        payload: true,
      })
      const response = await axios.put(
        `${API}/addfriend/${userId}`,
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("_token")
            )}`,
          },
        }
      )
      // console.log(response.data)
      dispatch({
        type: ADD_FRIEND_REQUEST,
        payload: response.data,
      })
      getUserById(authContext.user._id)
    } catch (error) {
      dispatch({
        type: USER_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const unFriend = async (userId, friendId) => {
    try {
      dispatch({
        type: USER_LOADING,
        payload: true,
      })
      const response = await axios.put(
        `${API}/unfriend/${userId}`,
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("_token")
            )}`,
          },
        }
      )
      console.log(response.data)
      dispatch({
        type: UN_FRIEND_REQUEST,
        payload: response.data,
      })
      getUserById(authContext.user._id)
    } catch (error) {
      dispatch({
        type: USER_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  const acceptFriendRequest = async (userId, friendId) => {
    try {
      dispatch({
        type: USER_LOADING,
        payload: true,
      })
      const response = await axios.put(
        `${API}/acceptrequest/${userId}`,
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("_token")
            )}`,
          },
        }
      )
      console.log(response.data)
      dispatch({
        type: FRIEND_REQUEST_ACCEPT,
        payload: response.data,
      })
      getUserById(authContext.user._id)
    } catch (error) {
      dispatch({
        type: USER_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }
  const rejectFriendRequest = async (userId, friendId) => {
    try {
      dispatch({
        type: USER_LOADING,
        payload: true,
      })
      const response = await axios.put(
        `${API}/rejectrequest/${userId}`,
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("_token")
            )}`,
          },
        }
      )
      console.log(response.data)
      dispatch({
        type: FRIEND_REQUEST_DELETE,
        payload: response.data,
      })
      getUserById(authContext.user._id)
    } catch (error) {
      dispatch({
        type: USER_ERROR,
        payload: error.response.data.errorMsg,
      })
    }
  }

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        all: state.all,
        friends: state.friends,
        loading: state.loading,
        error: state.error,
        success: state.success,
        getUserById,
        sendFriendRequest,
        unFriend,
        acceptFriendRequest,
        rejectFriendRequest,
        getAllUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
