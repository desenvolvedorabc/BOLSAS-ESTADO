import styled from 'styled-components';

export const Card = styled.div<{ mobile: boolean }>`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  display: grid;
  width: ${(props) => (props.mobile ? '100%' : '50%')};
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;
`;
