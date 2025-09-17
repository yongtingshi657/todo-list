import TodoListItem from './TodoListItem';
import styles from "./TodoList.module.css"

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading}) {
  const filteredTodoList = todoList.filter((todo)=> {
      return !todo.isCompleted
  })

  if(isLoading){
    return <p>Todo list loading...</p>
  }

  return (
    <>
      {filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul className={styles.todoContainer}>
          {filteredTodoList.map(function (todo) {
            return (
              <TodoListItem
                key={todo.id}
                todo={todo}
                onCompleteTodo={onCompleteTodo}
                onUpdateTodo={onUpdateTodo}
              />
            );
          })}
        </ul>
      )}
    </>
  );
}

export default TodoList;
