import React, { useEffect, useReducer } from "react";
import { PickContext } from "./pickContext";

const defaultPick = {
  storage: [],
  read: () => {},
  add: () => {},
  save: () => {},
  deletes: () => {},
};

const pickReducer = function (state, action) {
  switch (action.type) {
    case "READ":
      const getStorage = JSON.parse(localStorage["userpick"]);
      return {
        storage: getStorage,
      };
    case "ADD":
      localStorage["userpick"] = JSON.stringify(
        state.storage.concat(action.storage)
      );
      return {
        storage: state.storage.concat(action.storage),
      };
    case "SAVE":
      localStorage["userpick"] = JSON.stringify(state.storage);
      return {
        storage: state.storage,
      };
    case "DELETE":
      const filteredStorage = state.storage.filter(
        (item) => item.slug !== action.slug
      );
      return {
        storage: filteredStorage,
      };
  }
};

function PickProvider({ children }) {
  const [pickState, dispatch] = useReducer(pickReducer, defaultPick);

  const read = () => {
    dispatch({ type: "READ" });
    return pickState;
  };

  const add = (data) => {
    dispatch({ type: "ADD", storage: data });
    return pickState;
  };

  const save = () => {
    dispatch({ type: "SAVE" });
    return pickState;
  };

  const deletes = (slug) => {
    dispatch({ type: "DELETE", slug: slug });
    return pickState;
  };

  const find = (data) => {
    if (pickState.storage.find((item) => item.slug === data.slug) !== undefined) {
      return true;
    }
    return false;
  };

  const pickContext = {
    storage: pickState.storage,
    read: read,
    add: add,
    save: save,
    deletes: deletes,
    find: find,
  };

  useEffect(() => {
    if (!localStorage["userpick"]) {
      localStorage["userpick"] = "[]";
    } else {
      pickContext.read();
    }
  }, []);

  return (
    <PickContext.Provider value={pickContext}>{children}</PickContext.Provider>
  );
}

export default PickProvider;
