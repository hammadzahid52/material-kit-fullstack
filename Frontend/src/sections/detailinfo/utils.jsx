// import React from 'react';
// import IconButton from '@mui/material/IconButton';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { useDataContext } from './view/DataContext.jsx';

// const options = ['Edit', 'Delete'];

// export default function LongMenu({ id }) {
//   const { data, updateData } = useDataContext();
//   const row = data.find((item) => item.id === id);

//   const handleEdit = () => {
//     // Add logic to handle edit action here
//     console.log(id, 'Edit clicked');
//     // Example: Update the name of the row
//     // const newData = data.map(item => (item.id === id ? { ...item, name: 'Updated Name' } : item));
//     // updateData(newData);
//   };

//   const handleDelete = () => {
//     // Add logic to handle delete action here
//     console.log(id, 'Delete clicked');
//     // Example: Remove the row from data
//     // const newData = data.filter(item => item.id !== id);
//     // updateData(newData);
//   };

//   return (
//     <div>
//       <IconButton aria-label="more" id="long-button" aria-haspopup="true" onClick={handleClick}>
//         <MoreVertIcon />
//       </IconButton>
//       <Menu id="long-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
//         {options.map((option) => (
//           <MenuItem key={option} onClick={option === 'Edit' ? handleEdit : handleDelete}>
//             {option}
//           </MenuItem>
//         ))}
//       </Menu>
//     </div>
//   );
// }
