import { Helmet } from 'react-helmet-async';

import { UserData } from 'src/sections/userdata/view';

// ----------------------------------------------------------------------

export default function UserDataPage() {
  return (
    <>
      <Helmet>
        <title> User Data | Minimal UI </title>
      </Helmet>

      <UserData />
    </>
  );
}
