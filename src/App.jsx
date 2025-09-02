import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import { useEffect, useState } from 'react';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

function encodeUrl(url, {sortField, sortDirection, queryString}){
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`
  let searchQuery = ""

  if(queryString && queryString.trim() !== ""){
    searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`
  }

  return encodeURI(`${url}?${sortQuery}${searchQuery}`)

}

function App() {
  // state
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [sortField, setSortField] = useState('createdTime')
  const [sortDirection, setSortDirection] = useState('desc')
  const [queryString, setQueryString] = useState("")



  // fetch api
  useEffect(() => {

    const fetchTodos = async () => {
      setIsLoading(true);

      let options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(encodeUrl(url, {sortField, sortDirection, queryString}), options);
        if (!resp.ok) {
          throw new Error(resp.statusText);
        }

        const data = await resp.json();
        console.log(data);

        const todos = data.records.map((record) => {
          const todo = {
            id: record.id,
            title: record.fields.title,
            isCompleted: record.fields.isCompleted,
          };

          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          console.log(todo.isCompleted);
          return todo;
        });

        setTodoList([...todos]);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [sortDirection, sortField, queryString]);

  const addTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(encodeUrl(url, {sortField, sortDirection, queryString}), options);
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }

      const { records } = await resp.json();

      const savedTodo = {
        id: records[0].id,
        title: records[0].fields.title,
        isCompleted: records[0].fields.isCompleted,
      };

      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }


      setTodoList([...todoList, savedTodo]);
      console.log(todoList);
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const completeTodo = async (id) => {
    // const updatedTodos = todoList.map((todo) => {
    //   if (todo.id === id) {
    //     return { ...todo, isCompleted: true };
    //   }
    //   return todo;
    // });
    // setTodoList(updatedTodos);

    const completeTodo = todoList.find((todo) => todo.id === id);
    const originalTodo = { ...completeTodo };

    const payload = {
      records: [
        {
          id: completeTodo.id,
          fields: {
            title: completeTodo.title,
            isCompleted: true,
          },
        },
      ],
    };
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(encodeUrl(url, {sortField, sortDirection, queryString}), options);
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      setTodoList(
        todoList.map((todo) =>
          todo.id === id ? { ...todo, isCompleted: true } : todo
        )
      );
    } catch (error) {
      console.log(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      setTodoList(
        todoList.map((todo) =>
          todo.id === originalTodo.id ? originalTodo : todo
        )
      );
    } finally {
      setIsSaving(false);
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(encodeUrl(url, {sortField, sortDirection, queryString}), options);
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      setTodoList(
        todoList.map((todo) => (todo.id === editedTodo.id ? editedTodo : todo))
      );
    } catch (error) {
      console.log(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      // const revertedTodos = originalTodo
      setTodoList(
        todoList.map((todo) =>
          todo.id === originalTodo.id ? originalTodo : todo
        )
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      <hr />
      <TodosViewForm 
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />
      {errorMessage && (
        <div>
          <hr></hr>
          <p>{errorMessage}</p>
          <button
            onClick={() => {
              setErrorMessage('');
            }}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
