import LoginContent from 'src/components/loginContent';
import LoginContainer from 'src/components/loginContainer';
import CardLogin from 'src/components/cardLogin';
import FormNovaSenha from 'src/components/formNovaSenha';
import { Header } from 'src/components/header';
import { ThemeContext } from 'src/context/ThemeContext';
import { useContext, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';

export default function NovaSenha({ url }) {
  const { state } = useContext(ThemeContext);
  const [logoEstado, setLogoEstado] = useState('');

  useEffect(() => {
    setLogoEstado(`${url}/users/avatar/${state?.logo}`);
  }, [state, url]);
  return (
    <>
      <Header title={'Definir Nova Senha'} />
      <LoginContainer>
        <LoginContent>
          <CardLogin logo={logoEstado}>
            <FormNovaSenha />
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
