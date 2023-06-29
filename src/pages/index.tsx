import TopHome from '../components/homeComponents/topHome';
import SessionTimeout from '../components/timeOut/sessionTimeout';
import Router, { useRouter } from 'next/router';
import { useState } from 'react';
import PageContainer from 'src/components/pageContainer';
import { destroyCookies } from 'src/utils/auth';
import Layout from 'src/components/layout';
import type { ReactElement } from 'react';
import { withSSRAuth } from 'src/utils/withSSRAuth';

export default function Home() {
  const [isAuthenticated, setAuth] = useState(true);
  const { query } = useRouter();

  const handleClick = () => {
    setAuth(!isAuthenticated);
    destroyCookies();
    Router.push(`/painel/${query?.estado}/login`);
  };

  return (
    <>
      <SessionTimeout logOut={handleClick} />
      <PageContainer>
        <TopHome title={'Home'} searchOpen={true} />
      </PageContainer>
    </>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout header={'Home'}>{page}</Layout>;
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    // let cookies = parseCookies(ctx);

    // cookies = {
    //   ...cookies,
    //   USU_AVATAR: null,
    // };

    return {
      props: {
        // userInfo: cookies,
      },
    };
  },
  {
    profiles: [],
    roles: [],
  },
);
