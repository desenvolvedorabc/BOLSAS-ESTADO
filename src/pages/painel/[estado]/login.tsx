import { GetServerSideProps } from 'next';
import { useContext, useEffect, useState } from 'react';
import CardLogin from 'src/components/cardLogin';
import FormLogin from 'src/components/formLogin';
import { Header } from 'src/components/header';
import LoginContainer from 'src/components/loginContainer';
import LoginContent from 'src/components/loginContent';
import { ThemeContext } from 'src/context/ThemeContext';
import { parseCookies } from '../../../utils/cookies';

export default function Home({ url }) {
  const { state } = useContext(ThemeContext);
  const [logoEstado, setLogoEstado] = useState('');

  useEffect(() => {
    setLogoEstado(`${url}/users/avatar/${state?.logo}`);
  }, [state, url]);

  return (
    <>
      {state && (
        <>
          <Header title={'Login'} />
          <LoginContainer>
            <LoginContent>
              <CardLogin logo={logoEstado}>
                <FormLogin idState={state?.id} />
              </CardLogin>
            </LoginContent>
          </LoginContainer>
        </>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);

  if (cookies['__session']) {
    return {
      redirect: {
        destination: `/painel/${ctx.query.estado}/`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      url: process.env.NEXT_PUBLIC_API_URL,
    },
  };
};
