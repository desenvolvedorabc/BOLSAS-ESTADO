import CardLogin from 'src/components/cardLogin';
import FormRecuperar from 'src/components/formRecuperar';
import LoginContainer from 'src/components/loginContainer';
import LoginContent from 'src/components/loginContent';
import { Header } from 'src/components/header';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from 'src/context/ThemeContext';
import { GetServerSideProps } from 'next';

export default function Home({ url }) {
  const { state } = useContext(ThemeContext);
  const [logoEstado, setLogoEstado] = useState('');

  useEffect(() => {
    setLogoEstado(`${url}/users/avatar/${state?.logo}`);
  }, [state, url]);
  return (
    <>
      <Header title={'Recuperar a senha'} />
      <LoginContainer>
        <LoginContent>
          <CardLogin logo={logoEstado}>
            <FormRecuperar />
          </CardLogin>
        </LoginContent>
      </LoginContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      url: process.env.NEXT_PUBLIC_API_URL,
    },
  };
};
