import { ButtonStyled } from './styledComponents';

export function ButtonDefault({
  children,
  onClick,
  disable = false,
  type = 'button',
}) {
  return (
    <ButtonStyled type={type} onClick={onClick} disabled={disable}>
      {children}
    </ButtonStyled>
  );
}
