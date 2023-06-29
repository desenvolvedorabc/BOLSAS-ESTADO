import { useContext } from 'react';
import { ThemeContext } from 'src/context/ThemeContext';
import { PageTitleStyled } from './styledComponents';

export default function PageTitle({ children }) {
  const { mobile } = useContext(ThemeContext);

  return <PageTitleStyled mobile={mobile}>{children}</PageTitleStyled>;
}
