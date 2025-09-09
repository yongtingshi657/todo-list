export default function TodosViewForm({sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString}) {

    function preventRefresh(e){
        e.preventDefault()
    }
  return (
    <form onSubmit={preventRefresh}>
        <div>
            <label>Search Todos</label>
            <input 
                type="text"
                value={queryString}
                onChange={(e)=> {setQueryString(e.target.value)}}
            />
            <button type="button" onClick={()=>setQueryString("")}>Clear</button>
        </div>
      <label>Sort By</label>
      <select onChange={(e)=> {setSortField(e.target.value)}} value={sortField}>
        <option value="title">Title</option>
        <option value="createdTime">Time added</option>
      </select>
      <label>Direction</label>
      <select onChange={(e)=> {setSortDirection(e.target.value)}}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </form>
  );
}
