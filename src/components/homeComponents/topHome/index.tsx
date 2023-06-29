import Notification from '../../notification';
import Search from '../searchHome';
import { Container } from './styledComponents';
import PageTitle from 'src/components/pageTitle';

export default function Top({ title, searchOpen = false }) {
  return (
    <Container className="col-12">
      <PageTitle>{title}</PageTitle>
      <Search />
      <div />
      <div className="d-flex align-items-center">
        <Notification />
      </div>
    </Container>
  );
}
