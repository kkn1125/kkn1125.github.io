import React from "react";
import todos from "../../src/data/todo.json";

function Todos() {
  return <div>{JSON.stringify(todos)}</div>;
}

export default Todos;
