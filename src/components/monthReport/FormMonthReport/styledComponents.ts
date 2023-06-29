import styled from 'styled-components';

interface MobileProps {
  mobile: boolean;
}

export const Title = styled.div`
  font-size: 1.313rem;
  font-weight: 500;
`;

export const Status = styled.div`
  display: flex;
  margin-top: 1.563rem;
  justify-content: space-between;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 30px;
  border-top: 1px solid #d5d5d5;
  margin-top: 10px;
`;

export const InfoReport = styled.div<MobileProps>`
  display: flex;
  ${(props) => props.mobile && 'flex-direction: column;'}
  justify-content: space-between;
`;
