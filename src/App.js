import { useState, useEffect } from 'react'
import axios from 'axios';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import UserDetail from './UserDetail';
import '@fortawesome/fontawesome-free/css/all.min.css'
import './App.css'

const App = () => {
  const [records, setRecords] = useState([]);
  const [sorting, setSorting] = useState({ column: 'first_name', direction: 'asc' });
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  useEffect(() => {
    axios.get('https://d2k-static-assets.s3.ap-south-1.amazonaws.com/assignment-files/python-backend-assignment/users.json')
      .then(res => {
        setRecords(res.data);
        setFilteredRecords(res.data)
      })
      .catch(err => console.log(err))
  }, []);

  const filter = (event) => {
    if (event.type === 'keydown' && event.key !== 'Enter') {
      return;
    }

    const searchValue = event.target.value.toLowerCase();
    const filtered = records.filter(user => {
      const { first_name, last_name } = user;
      return (
        first_name.toLowerCase().includes(searchValue) ||
        last_name.toLowerCase().includes(searchValue)
      );
    });
    setFilteredRecords(filtered);
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });

    const sortedRecords = [...filteredRecords].sort((a, b) => {
      if (typeof a[column] === 'number') {
        return direction === 'asc' ? a[column] - b[column] : b[column] - a[column];
      } else {
        if (a[column].toLowerCase() < b[column].toLowerCase()) return direction === 'asc' ? -1 : 1;
        if (a[column].toLowerCase() > b[column].toLowerCase()) return direction === 'asc' ? 1 : -1;
        return 0;
      }
    });
    setFilteredRecords(sortedRecords);
  };  

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage)
  const maxPageNumbersToShow = 5;
  const halfPageNumbersToShow = Math.floor(maxPageNumbersToShow / 2)

  let startPage = Math.max(currentPage - halfPageNumbersToShow, 1)
  let endPage = Math.min(startPage + maxPageNumbersToShow - 1, totalPages);

  if (endPage - startPage + 1 < maxPageNumbersToShow) {
    startPage = Math.max(endPage - maxPageNumbersToShow + 1, 1)
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      {/* <h1>user</h1> */}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name and last name"
                  onChange={filter}
                />
                <table>
                  <thead>
                    <tr>
                      <th
                        onClick={() => handleSort("first_name")}
                        style={{ cursor: "pointer" }}
                      >
                        First Name{" "}
                        <i
                          className={`fa fa-sort-${
                            sorting.column === "first_name" &&
                            sorting.direction === "asc"
                              ? "up"
                              : "down"
                          }`}
                          aria-hidden="true"
                        ></i>
                      </th>
                      <th
                        onClick={() => handleSort("last_name")}
                        style={{ cursor: "pointer" }}
                      >
                        Last Name{" "}
                        <i
                          className={`fa fa-sort-${
                            sorting.column === "last_name" &&
                            sorting.direction === "asc"
                              ? "up"
                              : "down"
                          }`}
                          aria-hidden="true"
                        ></i>
                      </th>
                      <th
                        onClick={() => handleSort("age")}
                        style={{ cursor: "pointer" }}
                      >
                        Age{" "}
                        <i
                          className={`fa fa-sort-${
                            sorting.column === "age" &&
                            sorting.direction === "asc"
                              ? "up"
                              : "down"
                          }`}
                          aria-hidden="true"
                        ></i>
                      </th>
                      <th
                        onClick={() => handleSort("email")}
                        style={{ cursor: "pointer" }}
                      >
                        Email{" "}
                        <i
                          className={`fa fa-sort-${
                            sorting.column === "email" &&
                            sorting.direction === "asc"
                              ? "up"
                              : "down"
                          }`}
                          aria-hidden="true"
                        ></i>
                      </th>
                      <th
                        onClick={() => handleSort("web")}
                        style={{ cursor: "pointer" }}
                      >
                        Website{" "}
                        <i
                          className={`fa fa-sort-${
                            sorting.column === "web" &&
                            sorting.direction === "asc"
                              ? "up"
                              : "down"
                          }`}
                          aria-hidden="true"
                        ></i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.length > 0 ? (
                      currentRecords.map((user) => (
                        <tr key={user.id}>
                          <td>{user.first_name}</td>
                          <td>{user.last_name}</td>
                          <td>{user.age}</td>
                          <td>{user.email}</td>
                          <td>
                            <Link to={`/user/${user.id}`}>{user.web}</Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr></tr>
                    )}
                  </tbody>
                </table>
                <div className="pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  {pageNumbers.map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={currentPage === number ? "active" : ""}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            }
          />
          <Route path="/user/:id" element={<UserDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;





