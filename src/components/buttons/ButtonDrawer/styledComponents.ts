import { Button } from 'react-bootstrap';
import styled from 'styled-components';

export const ButtonStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 3.125rem;
  height: 3.125rem;

  // width: 1.125rem;
  // height: 1.125rem;

  border: none;
  border-radius: 7.42857px;
  box-shadow: 0px 1.71429px 2.28571px 1.14286px rgba(0, 0, 0, 0.25);

  font-size: 1.75rem;

  background-color: #ffffff;
  color: ${(props) => props.theme.colors.primary};

  &:hover {
    background-color: ${(props) => props.theme.buttons.defaultActive};
  }
  &:active {
    background-color: ${(props) => props.theme.buttons.defaultActive};
  }
  &:focus {
    background-color: ${(props) => props.theme.buttons.defaultActive};
  }
  &:disabled {
    background-color: ${(props) => props.theme.buttons.defaultDisable};
  }
`;
