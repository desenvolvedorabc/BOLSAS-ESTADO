import { PageContainerStyled } from './styledComponents';
import { useContext } from 'react';
import { ThemeContext } from 'src/context/ThemeContext';

export default function PageContainer({ children }) {
  const { mobile } = useContext(ThemeContext);

  return (
    <main className="d-flex col-12" style={{ height: '100%' }}>
      <PageContainerStyled mobile={mobile}>
        <div>{children}</div>
      </PageContainerStyled>
    </main>
  );
}
