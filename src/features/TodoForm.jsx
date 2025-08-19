import { useRef } from 'react';
import { useState } from 'react';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const todoTitleInput = useRef('');

  function handleAddTodo(event) {
    event.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle("")
    todoTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        ref={todoTitleInput}
        type="text"
        name="title"
        id="todoTitle"
        value={workingTodoTitle}
        onChange={(e)=>{setWorkingTodoTitle(e.target.value)}}
      ></input>
      <button disabled={!workingTodoTitle}>Add Todo</button>
    </form>
  );
}

export default TodoForm;
