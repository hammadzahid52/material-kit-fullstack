import { Helmet } from 'react-helmet-async';

import { InfoTablepage } from 'src/sections/detailinfo/view';

export default function DetailInfoPage() {
  return (
    <>
      <Helmet>
        <title> Detail Info | Minimal UI </title>
      </Helmet>

      <InfoTablepage />
    </>
  );
}
