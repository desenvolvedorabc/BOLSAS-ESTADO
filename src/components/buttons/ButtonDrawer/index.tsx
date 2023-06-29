import { MdOutlineClose, MdOutlineMenu } from 'react-icons/md';
import { ButtonStyled } from './styledComponents';

export function ButtonDrawer({ onClick, active = true as boolean }) {
  return (
    <ButtonStyled onClick={onClick}>
      {active ? <MdOutlineMenu /> : <MdOutlineClose />}
    </ButtonStyled>
  );
}
