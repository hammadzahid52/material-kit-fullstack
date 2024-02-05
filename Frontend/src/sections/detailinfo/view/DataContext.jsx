// // DataContext.jsx
// import React, { createContext, useState, useContext } from 'react';

// export const MyContext = createContext();

// export const useDataContext = () => {
//   const context = useContext(MyContext);
//   if (!context) {
//     throw new Error('useDataContext must be used within a DataProvider');
//   }
//   return context;
// };

// export const DataProvider = ({ children }) => {
//   const [data, setData] = useState([]);

//   const updateData = (newData) => {
//     setData(newData);
//   };

//   return <MyContext.Provider value={{ data, updateData }}>{children}</MyContext.Provider>;
// };
