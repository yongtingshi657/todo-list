import { useEffect } from 'react';
import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';
import { useSearchParams, useNavigate } from 'react-router';

export default function TodosPage({
  addTodo,
  todoState,
  completeTodo,
  updateTodo,
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const uncompletedTodos = todoState.todoList.filter(
    (todo) => todo.isCompleted === false
  );
  const totalPages = Math.ceil(uncompletedTodos.length / itemsPerPage);
  const indexOfLastTodo = indexOfFirstTodo + itemsPerPage;
  const todosOnCurrentPage = uncompletedTodos.slice(
    indexOfFirstTodo,
    indexOfLastTodo
  );

  function handlePreviousPage() {
    if (currentPage > 1) {
      setSearchParams({ page: currentPage - 1 });
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      setSearchParams({ page: currentPage + 1 });
    }
  }
  const navigate = useNavigate();

  useEffect(() => {
    if (totalPages > 0) {
      if (currentPage < 1 || currentPage > totalPages || isNaN(currentPage)) {
        navigate('/');
      }
    }
  }, [currentPage, totalPages, navigate]);

  return (
    <>
      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
      <TodoList
        todoList={todosOnCurrentPage}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
      />
      <hr />
      <div className="paginationControls">
        <button disabled={currentPage === 1} onClick={handlePreviousPage}>
          Previous
        </button>
        <span>
          {' '}
          Page {currentPage} of {totalPages}{' '}
        </span>
        <button disabled={currentPage === totalPages} onClick={handleNextPage}>
          Next
        </button>
      </div>
      <TodosViewForm
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />
    </>
  );
}
