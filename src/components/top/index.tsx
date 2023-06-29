import { useRouter } from 'next/router';
import { Container, ButtonVoltar, IconArrowBack } from './styledComponents';
import PageTitle from 'src/components/pageTitle';
import { useContext } from 'react';
import { ThemeContext } from 'src/context/ThemeContext';
import Notification from '../notification';

export default function Top({ title }) {
  const router = useRouter();
  const { mobile } = useContext(ThemeContext);

  return (
    <Container className="col-12">
      <div className="d-flex align-items-center">
        <ButtonVoltar mobile={mobile} onClick={() => router.back()}>
          <IconArrowBack size={mobile ? 12 : 28} />
        </ButtonVoltar>

        <PageTitle>{title}</PageTitle>
      </div>
      <div className="d-flex align-items-center">
        {/* <Search open={searchOpen} /> */}
        <Notification />
      </div>
    </Container>
  );
}
