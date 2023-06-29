import styled from 'styled-components';

interface MobileProps {
  mobile: boolean;
}

export const ButtonGroup = styled.div<MobileProps>`
  ${(props) => (props.mobile ? 'max-width: 480px' : '')}
  display: flex;
  justify-content: ${(props) => (props.mobile ? 'center' : 'end')};
  padding: 30px;
  border-top: 1px solid #d5d5d5;
  margin-top: 10px;
`;
