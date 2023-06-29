import styled from 'styled-components';

export const ButtonDownload = styled.a`
  background-color: #fff;
  border-radius: 4px;
  height: 40px;
  width: 40px;
  border: 1px solid #d5d5d5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
`;
