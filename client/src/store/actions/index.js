import axios from "axios";
import { FETCH_USER } from "./types";

export const fetchUser = () =>  async dispatch => {
  //request from back end, in our express server in routes (authRoutes.js)
  //thunk will check for a function being return and will automatically will pass the dispatch function into it
    const res = await axios.get("/api/current_user");
    dispatch({ type: FETCH_USER, payload: res.data });
  };

  export const handleToken = (token) => async dispatch => {
    const res = await axios.post("/api/stripe", token);
    dispatch({type: FETCH_USER, payload: res.data})
  }