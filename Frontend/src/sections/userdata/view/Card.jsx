import React from 'react';
import PropTypes from 'prop-types';

Card.propTypes = {
  first_name: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
};

function Card({ first_name, last_name, username, email, avatar }) {
  return (
    <div className="p-7 bg-white border border-gray-200 rounded-lg shadow dark:bg-white flex flex-col items-center space-y-36 max-w-[15rem] sm:space-y-24">
      <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={avatar} alt="" />
      <div className="flex flex-col items-center space-y-2">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-900">
          {first_name} {last_name}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-600">{username}</p>
        <p className="font-normal text-gray-700 dark:text-gray-600">{email}</p>
      </div>
    </div>
  );
}

export default Card;
