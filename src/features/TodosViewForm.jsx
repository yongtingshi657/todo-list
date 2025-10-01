import { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
    display:flex;
    gap:10px;
    flex-direction:column;
    flex-wrap: wrap;
    justify-content:center;

`

const StyledDiv = styled.div`
    display:flex;
    gap:10px;
    align-items: center;
    justify-content:center;
    flex-wrap:wrap;
    margin-top:10px;
`

export default function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {

  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return (
     ()=> {clearTimeout(debounce)
     }
    )
  }, [localQueryString, setQueryString]);

  function preventRefresh(e) {
    e.preventDefault();
  }

  return (
    <StyledForm onSubmit={preventRefresh}>
      <StyledDiv>
        <label>Search Todos</label>
        <input
          type="text"
          value={localQueryString}
          onChange={(e) => {
            setLocalQueryString(e.target.value);
          }}
        />
        <button type="button" onClick={() => setLocalQueryString('')}>
          Clear
        </button>
      </StyledDiv>
      <label>Sort By</label>
      <select
        onChange={(e) => {
          setSortField(e.target.value);
        }}
        value={sortField}
      >
        <option value="title">Title</option>
        <option value="createdTime">Time added</option>
      </select>
      <label>Direction</label>
      <select
        value={sortDirection}
        onChange={(e) => {
          setSortDirection(e.target.value);
          
        }}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </StyledForm>
  );
}
