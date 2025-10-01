import './App.css';
import { useEffect, useState, useCallback, useReducer } from 'react';
import { Routes, Route} from 'react-router';
import styles from './App.module.css';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';
import TodosPage from './pages/TodosPage';
import Header from './shared/Header';
import { useLocation } from 'react-router';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // state
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';

    if (queryString && queryString.trim() !== '') {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }

    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [url, sortField, sortDirection, queryString]);

  // fetch api
  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });
      console.log('Fetching...');

      let options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) {
          throw new Error(resp.statusText);
        }

        const data = await resp.json();
        dispatch({ type: todoActions.loadTodos, records: data.records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error: error });
      }
    };
    fetchTodos();
  }, [encodeUrl, token]);

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
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, records: records });
    } catch (error) {
      console.log(error);
      dispatch({ type: todoActions.setLoadError, error: error });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const completeTodo = async (id) => {
    const completeTodo = todoState.todoList.find((todo) => todo.id === id);
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
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      dispatch({ type: todoActions.completeTodo, id: id });
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        originalTodo: originalTodo,
        error: error,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoState.todoList.find(
      (todo) => todo.id === editedTodo.id
    );
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
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      dispatch({ type: todoActions.updateTodo, editedTodo: editedTodo });
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        originalTodo: originalTodo,
        error: error,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const location = useLocation();
  const [title, setTitle] = useState('TodoList');
  const logo = title === 'TodoList' ? './checklist.png' : null;

  useEffect(() => {
    if (location.pathname === '/') {
      setTitle('TodoList');
    } else if (location.pathname === '/about') {
      setTitle('About');
    } else {
      setTitle('Not Found');
    }
  }, [location]);


  return (
    <div className={styles.container}>
      <Header title={title} logo={logo} />

      <Routes>
        <Route
          path="/"
          element={
            <TodosPage
              addTodo={addTodo}
              todoState={todoState}
              completeTodo={completeTodo}
              updateTodo={updateTodo}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              sortField={sortField}
              setSortField={setSortField}
              queryString={queryString}
              setQueryString={setQueryString}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {todoState.errorMessage && (
        <div className={styles.errorMessage}>
          <hr></hr>
          <p>{todoState.errorMessage}</p>
          <button
            onClick={() => {
              dispatch({ type: todoActions.clearError });
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
