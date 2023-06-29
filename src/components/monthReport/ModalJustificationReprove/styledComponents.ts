import styled from 'styled-components';

type MobileProps = {
  mobile: boolean;
};

export const Instances = styled.div`
  color: #857d82;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const TitleInstance = styled.div`
  color: #4b4b4b;
  margin-top: 10px;
`;

export const DateInstance = styled.div`
  margin: 10px 0px;
`;

export const Divisor = styled.div<MobileProps>`
  margin: 10px;
  margin-top: ${(props) => (props.mobile ? '20px' : '50px')};
  font-size: 18px;
`;
