import axios from 'axios';
import { MdFilterList } from 'react-icons/md';
import Swal from 'sweetalert2';
import { AiFillDelete } from 'react-icons/ai';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DataTable from 'react-data-table-component';
import { useQuery, QueryClient, QueryCache } from '@tanstack/react-query';

function Table() {
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isaddModalOpen, setIsaddModalOpen] = useState(false);
  // const [newrecord, setNewRecord] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [rowsForDelete, setrowsForDelete] = useState([]);
  const [record, setRecord] = useState([]);
  const [ip, setIp] = useState('');
  const [page, setPage] = useState(1);
  const [length, setLength] = useState(0);
  const [deleted, setDeleted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    reset,
  } = useForm({ defaultValues: { test: 'Setting default values' } });

  const fetchData = async (pageNo, rowsPerPage) => {
    try {
      console.log('rowsPerPage ', rowsPerPage);
      const response = await axios.get(
        `http://localhost:5000/api/selctedrecords?page=${pageNo}&limit=${rowsPerPage}`
      );
      setData(response.data.result.rows);
      setTotalRows(response.data.result.totalRows);
      return response;
    } catch (error) {
      console.log('Error in fetching Data :', error);
    }
  };

  const {
    isPending,
    error,
    isLoading,
    isFetching,
    data: rows,
  } = useQuery({
    queryKey: ['userData', page, perPage],
    queryFn: () => fetchData(page, perPage),
    cacheTime: 1 * 60 * 1000,
    staleTime: 3 * 60 * 1000,
    keepPreviousData: true,
    onSuccess: () => console.log('Data Fetched Successfully'),
  });
  console.log('Checking Cache :', { isLoading, isFetching });
  // console.log('rows: ', rows);
  const handlePerRowsChange = async (newPerPage, page) => {
    const response = await fetchData(page, newPerPage);
    setData(response.data.result.rows);
    setTotalRows(response.data.result.totalRows);
    setPerPage(newPerPage);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  useEffect(() => {
    fetchData(1, 5);
  }, []);

  // console.log(data);

  // Sweat Alert
  const Toast = Swal.mixin({
    toast: true,
    position: 'left-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        setIp(response.data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
      }
    };

    fetchIp();
  }, []);
  // console.log(ip);

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
  // Function to handle adding new record
  const handleNewRecord = async (newrecord) => {
    event.preventDefault();

    try {
      const newdata = await axios.post('http://localhost:5000/api/create', {
        first_name: newrecord.first_name,
        last_name: newrecord.last_name,
        email: newrecord.email,
        gender: newrecord.gender,
        ip_address: ip,
      });
      Toast.fire({
        icon: 'success',
        title: 'Data Added Successfully!',
      });
      fetchData(1, 5);
      reset();
      setIsaddModalOpen(false);

      console.log(newdata.data.message);
    } catch (error) {
      console.error('Error in adding new record:', error);
    }
  };
  const handleInputChange = async (fieldname, value) => {
    setValue(fieldname, value);
    await trigger(fieldname);
  };
  const handleToggleModal = (row) => {
    setIsModalOpen(!isModalOpen);
    setSelectedRow(row);
    if (row) {
      setRecord(row);
      console.log('Record:', record);
    }
  };
  const handleEdit = async (row) => {
    handleToggleModal(row);
    console.log('Editing row:', row.id);
    setIsModalOpen(!isModalOpen);
  };
  const handleUpdate = async () => {
    event.preventDefault();
    console.log(record);
    try {
      // const id = row.id;
      const updaterecord = await axios.put('http://localhost:5000/api/update', {
        id: record.id,
        first_name: record.first_name,
        last_name: record.last_name,
        email: record.email,
        gender: record.gender,
        ip_address: record.ip_address,
      });
      Toast.fire({
        icon: 'success',
        title: 'Data Updated Successfully!',
      });
      fetchData(1, 5);
      setIsModalOpen(false);
      console.log(updaterecord.data.message);
    } catch (error) {
      console.error('Error in updating data:', error);
    }
  };
  // Function to handle delete action
  const handleDelete = async (row) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (deleterecord) => {
      if (deleterecord.isConfirmed) {
        try {
          const id = row.id;
          const delrecord = await axios.delete('http://localhost:5000/api/delete', {
            data: { id },
          });
          fetchData(1, 5);
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
          });
          console.log(delrecord.data.message);
        } catch (error) {
          console.error('Error in deleting data:', error);
        }
      }
    });
  };

  // Function to handle delete all of the rows
  const handleDeleteSelectedRows = async (row) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (deleteallrecord) => {
      if (deleteallrecord.isConfirmed) {
        try {
          const ids = rowsForDelete.map((delrow) => delrow.id);
          const delallrecord = await axios.delete('http://localhost:5000/api/deleteMultiple', {
            data: { ids },
          });
          fetchData(1, 5);
          setDeleted(false);
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
          });
          console.log(delallrecord.data.message);
        } catch (error) {
          console.error('Error in deleting Selected Rows:', error);
        }
      }
    });
  };
  // const handleDeleteSelectedRows = async () => {
  //   try {
  //     const ids = rowsForDelete.map((row) => row.id);
  //     const result = await axios.delete('http://localhost:5000/api/deleteMultiple', {
  //       data: { ids: ids },
  //     });
  //     fetchData(1);
  //     setDeleted(false);
  //     console.log(result.data.message);
  //   } catch (error) {
  //     console.error('Error in deleting selected rows:', error);
  //   }
  // };

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
        type="button"
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
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All',
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
          onClick={() => setIsaddModalOpen(!isaddModalOpen)}
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
                <button type="button" onClick={handleDeleteSelectedRows}>
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
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            paginationComponentOptions={paginationComponentOptions}
            paginationPerPage={[5]}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
            // paginationIconFirstPage={null}
            // paginationIconLastPage={null}
            highlightOnHover
          />
          {/* Adding New Data  */}
          {isaddModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg min-w-[400px]">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Add New Record Here
                    </h3>
                    <button
                      type="button"
                      className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => setIsaddModalOpen(!isaddModalOpen)}
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
                    {/* Adding Data  */}
                    <form className="space-y-4" onSubmit={handleSubmit(handleNewRecord)} noValidate>
                      <div>
                        <label
                          htmlFor="first_name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          First Name
                          <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            {...register('first_name', {
                              required: {
                                value: true,
                                message: 'First Name is required',
                              },
                              maxLength: {
                                value: 18,
                                message: 'First Name Can not be greater than 8 characters',
                              },
                            })}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="First Name"
                            required
                          />
                        </label>

                        {errors.first_name && (
                          <p className="text-red-600 text-xs ml-2">{errors.first_name.message}</p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="last_name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Last Name
                          <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            {...register('last_name', {
                              required: {
                                value: true,
                                message: 'Last Name is required',
                              },
                              maxLength: {
                                value: 18,
                                message: 'Last Name Can not be greater than 8 characters',
                              },
                            })}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Last Name"
                            required
                          />
                        </label>

                        <p className="text-red-600 text-xs ml-2">{errors.last_name?.message}</p>
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Email
                          <input
                            type="email"
                            name="email"
                            id="email"
                            {...register('email', {
                              required: {
                                value: true,
                                message: 'Email is required',
                              },

                              pattern: {
                                value:
                                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: 'Invalid Email',
                              },
                            })}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Email"
                            required
                          />
                        </label>

                        <p className="text-red-600 text-xs ml-2">{errors.email?.message}</p>
                      </div>
                      <div>
                        <label
                          htmlFor="gender"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Gender
                          <select
                            name="gender"
                            id="gender"
                            {...register('gender', { required: 'Gender is Required' })}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </label>

                        <p className="text-red-600 text-xs ml-2">{errors.gender?.message}</p>
                      </div>
                      <div>
                        <label
                          htmlFor="ip_address"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          IP Address
                          <input
                            type="text"
                            name="ip_address"
                            id="ip_address"
                            value={ip}
                            readOnly
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="IP Address"
                            required
                          />
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Add Now
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Updating Data  */}
          {isModalOpen && selectedRow && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg min-w-[400px]">
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
                    {/* Updating Data  */}
                    <form className="space-y-4" onSubmit={handleUpdate} noValidate>
                      <div>
                        <label
                          htmlFor="first_name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          First Name
                          <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            value={record.first_name}
                            onChange={(e) => setRecord({ ...record, first_name: e.target.value })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="First Name"
                          />
                        </label>

                        {errors.first_name && (
                          <p className="text-red-600 text-xs ml-2">{errors.first_name.message}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="last_name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Last Name
                          <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            value={record.last_name}
                            onChange={(e) => setRecord({ ...record, last_name: e.target.value })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Last Name"
                            required
                          />
                        </label>
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Email
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={record.email}
                            onChange={(e) => setRecord({ ...record, email: e.target.value })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Email"
                            required
                          />
                        </label>
                      </div>
                      <div>
                        <label
                          htmlFor="gender"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Gender
                          <input
                            type="text"
                            name="gender"
                            id="gender"
                            value={record.gender}
                            onChange={(e) => setRecord({ ...record, gender: e.target.value })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Gender"
                            required
                          />
                        </label>
                      </div>
                      <div>
                        <label
                          htmlFor="ip_address"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          IP Address
                          <input
                            type="text"
                            name="ip_address"
                            id="ip_address"
                            value={record.ip_address}
                            readOnly
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Ip Address"
                            required
                          />
                        </label>
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
