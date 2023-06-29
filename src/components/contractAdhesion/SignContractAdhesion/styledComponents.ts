import styled from 'styled-components';

type IMobileProps = {
  mobile: boolean;
};

export const BoxSign = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  margin-bottom: 10px;
`;

export const LineSign = styled.div<IMobileProps>`
  width: ${(props) => (props.mobile ? '260px' : '504px')};
  border-top: 1px solid #000;
  margin-top: 50px;
  margin-bottom: 10px;
`;
