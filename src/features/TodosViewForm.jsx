import { useEffect, useState } from 'react';

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
      console.log("set time out")
    }, 500);

    return (
     ()=> {clearTimeout(debounce)
      console.log("cleaned")
     }
    )
  }, [localQueryString, setQueryString]);

  function preventRefresh(e) {
    e.preventDefault();
  }

  return (
    <form onSubmit={preventRefresh}>
      <div>
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
      </div>
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
    </form>
  );
}
