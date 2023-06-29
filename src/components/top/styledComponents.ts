import styled from 'styled-components';
import { MdArrowBack } from 'react-icons/md';

interface IButtonVoltar {
  mobile: boolean;
}

export const Container = styled.div`
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 5px;
`;
export const ButtonVoltar = styled.button<IButtonVoltar>`
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid ${(props) => props.theme.colors.primary};
  margin-right: 7px;
  cursor: pointer;
  min-width: ${(props) => (props.mobile ? '24px' : '40px')};
  width: ${(props) => (props.mobile ? '24px' : '40px')};
  height: ${(props) => (props.mobile ? '24px' : '40px')};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconArrowBack = styled(MdArrowBack)`
  color: ${(props) => props.theme.colors.primary};
`;
