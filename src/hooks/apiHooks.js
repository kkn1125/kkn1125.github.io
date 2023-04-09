import React, { createContext, useReducer } from "react";
import { API_BASE_PATH, API_PATH } from "../util/globals";

const initialValues = {
  posts: [],
  likes: [],
  views: [],
  users: [],
};

export const ApiContext = new createContext();
export const ApiDispatchContext = new createContext();

const reducer = async (state, action) => {
  switch (action.type) {
    case "USER/UPDATE":
      console.log("test", state);
      return await axios.get(API_PATH + API_BASE_PATH);
    default:
      return state;
  }
};

export const ApiProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialValues);
  return (
    <ApiDispatchContext.Provider value={dispatch}>
      <ApiContext.Provider value={state}>{children}</ApiContext.Provider>
    </ApiDispatchContext.Provider>
  );
};
