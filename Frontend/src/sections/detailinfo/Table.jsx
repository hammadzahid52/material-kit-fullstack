import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdFilterList } from 'react-icons/md';
import { AiFillDelete } from 'react-icons/ai';
import DataTable from 'react-data-table-component';
import PropTypes, { object } from 'prop-types';
import { id } from 'date-fns/locale';

const ITEM_HEIGHT = 48;
function Table() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [rowsForDelete, setrowsForDelete] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/viewAll'); // Endpoint to fetch data from backend
      setData(response.data.result.rows);
      // console.log(response.data.result.rows);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const [length, setLength] = useState(0);
  const [deleted, setDeleted] = useState(false);
  // console.log(data);

  const columns = [
    {
      name: 'Id',
      selector: (row) => row.id,
      style: {
        fontWeight: '530',
      },
      sortable: true,
    },
    {
      name: 'First Name',
      selector: (row) => row.first_name,
      style: {
        fontWeight: '530',
      },
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: (row) => row.last_name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'Gender',
      selector: (row) => row.gender,
      sortable: true,
    },
    {
      name: 'Address',
      selector: (row) => row.ip_address,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => actionButton(row), // Use actionButton function here
    },
  ];
  const filteredData = data.filter((row) =>
    Object.values(row).some(
      (value) => value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const handleToggleModal = (row) => {
    setIsModalOpen(!isModalOpen);
    setSelectedRow(row);
    if (row) {
      setFirstName(row.first_name || '');
      setLastName(row.last_name || '');
      setEmail(row.email || '');
      setGender(row.gender || '');
    }
  };
  const handleEdit = async (row) => {
    // event.preventDefault();
    // try {
    //   const updatedUser = {
    //     id: row.id,
    //     first_name: firstName,
    //     last_name: lastName,
    //     email: email,
    //     gender: gender,
    //   };
    //   await axios.put('http://localhost:5000/api/update', updatedUser);
    //   fetchData();
    //   setIsModalOpen(false);
    // } catch (error) {
    //   console.error('Error in Updating the data:', error);
    // }
    // Implement edit logic here
    handleToggleModal(row);
    console.log('Editing row:', row.id);
    setIsModalOpen(!isModalOpen);
  };

  // Function to handle delete action
  const handleDelete = async (row) => {
    try {
      const id = row.id;
      await axios.delete('http://localhost:5000/api/delete', { data: { id: id } });
      fetchData();
      console.log('Row deleted successfully');
    } catch (error) {
      console.error('Error in deleting data:', error);
    }
  };
  // Function to handle delete all of the rows
  // Function to handle delete all of the rows
  const handleDeleteSelectedRows = async () => {
    try {
      // Iterate over selected rows and delete each one
      const ids = rowsForDelete.map((row) => row.id);

      // Now you can send the IDs to the backend to delete the selected rows
      const result = await axios.delete('http://localhost:5000/api/deleteMultiple', {
        data: { ids: ids },
      });
      // Refresh the data displayed in the table
      fetchData();
      setDeleted(false);
      console.log(result.data.message);
    } catch (error) {
      console.error('Error in deleting selected rows:', error);
    }
  };

  const actionButton = (row) => (
    <div className="flex">
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
        onClick={() => handleEdit(row)}
      >
        Edit
      </button>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleDelete(row)}
      >
        Delete
      </button>
    </div>
  );

  const customStyles = {
    rows: {
      style: {
        minHeight: '70px',
        hover: {
          backgroundColor: 'lightgray',
        },
      },
    },
    headCells: {
      style: {
        minHeight: '70px',
        paddingLeft: '2px',
        paddingRight: '8px',
        backgroundColor: '#F4F6F8',
        fontFamily: 'inherit',
        fontSize: '14px',
      },
    },
    cells: {
      style: {
        paddingLeft: '1px',
        paddingRight: '8px',
        fontFamily: 'inherit',
        fontSize: '14px',
      },
    },
  };
  const paginationComponentOptions = {
    rowsPerPageText: 'Rows Per Page',
    rangeSeparatorText: 'of',
    selectAllRowsItem: false,
    selectAllRowsItemText: 'Todos',
  };
  const handleSelected = ({ selectedRows }) => {
    setLength(selectedRows.length);
    setDeleted(selectedRows.length > 0);
    setrowsForDelete(selectedRows);
    console.log('Selected rows:', selectedRows);
  };

  return (
    <div>
      <div className="flex mx-2 md:mx-3 lg:mx-3 xl:mx-auto justify-between max-w-[74rem] mb-12">
        <div>
          <h1 className="font-bold text-xl md:text-2xl">User Information</h1>
        </div>
        <button
          type="button"
          className="font-semibold flex justify-center items-center text-white px-6 py-[0.40rem] rounded-md bg-[#212B36]"
        >
          New User
        </button>
      </div>

      <div className="max-w-6xl mx-auto ">
        <div className="">
          {deleted ? (
            <div className="bg-[#D0ECFE] py-8 rounded-t-2xl">
              <div className="flex justify-between mx-9 ">
                <div className="text-blue-500 font-bold">{length} selected</div>
                <button onClick={handleDeleteSelectedRows}>
                  <AiFillDelete className="text-xl" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white py-5 rounded-t-2xl">
              <div className="flex justify-between mx-3 md:mx-9 lg:mx-9">
                <div className="max-w-[16rem] flex justify-center align-center items-center">
                  <form action="">
                    <div className="relative ">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                          />
                        </svg>
                      </div>
                      <input
                        type="search"
                        id="defaultsearch"
                        className="bg-white block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg hover:border-black focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search Users ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
                <div>
                  <MdFilterList className="text-black text-2xl flex justify-center mt-2" />
                </div>
              </div>
            </div>
          )}

          <DataTable
            columns={columns}
            data={filteredData}
            selectableRows
            onSelectedRowsChange={handleSelected}
            customStyles={customStyles}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            paginationPerPage={[5]}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
            paginationIconFirstPage={null}
            paginationIconLastPage={null}
            highlightOnHover
          />
          {isModalOpen && selectedRow && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Update Your Data
                    </h3>
                    <button
                      type="button"
                      className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={handleToggleModal}
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  <div className="p-4 md:p-5">
                    <form className="space-y-4" action="#">
                      <div>
                        <label
                          htmlFor="first_name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          placeholder="First Name"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          placeholder="Last Name"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Email
                        </label>
                        <input
                          type="text"
                          name="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          placeholder="Email"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="gender"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Gender
                        </label>
                        <input
                          type="text"
                          name="gender"
                          id="gender"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          placeholder="Gender"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Update Now
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// Table.propTypes = {
//   id: PropTypes.number.isRequired,
//   firstName: PropTypes.string.isRequired,
//   lastName: PropTypes.string.isRequired,
//   email: PropTypes.string.isRequired,
//   gender: PropTypes.string.isRequired,
//   address: PropTypes.string.isRequired,
// };

export default Table;
