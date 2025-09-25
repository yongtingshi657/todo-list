import { useRef } from 'react';
import { useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: 10px auto;
  flex: 1;
`;
const StyledButton = styled.button`
  &:disabled {
    font-style: italic;
    background: grey;
  }
`;

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const todoTitleInput = useRef('');

  function handleAddTodo(event) {
    event.preventDefault();
    onAddTodo({ title: workingTodoTitle, isCompleted: false });
    setWorkingTodoTitle('');
    todoTitleInput.current.focus();
  }

  return (
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(e) => {
          setWorkingTodoTitle(e.target.value);
        }}
        elementId="todoTitle"
        labelText="Todo"
      />
      <StyledButton disabled={workingTodoTitle.trim() === ''}>
        {isSaving ? 'Saving...' : 'Add Todo'}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;
