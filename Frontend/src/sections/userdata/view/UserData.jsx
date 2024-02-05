import React from 'react';
import { useQuery } from '@tanstack/react-query';

import Card from './Card';

function UserDataPage() {
  const { isPending, error, data } = useQuery({
    queryKey: ['userData'],
    queryFn: () =>
      fetch('https://random-data-api.com/api/v2/users?size=10&is_xml=true').then((res) =>
        res.json()
      ),
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  if (isPending) return 'Loading...';
  if (error) return `An error has occurred:  + ${error.message}`;
  const userdata = data;
  // console.log(data);
  return (
    <div className="grid grid-flow-row grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mx-auto">
      {userdata && userdata.map((item) => <Card key={item.id} {...item} />)}
    </div>
  );
}

export default UserDataPage;
