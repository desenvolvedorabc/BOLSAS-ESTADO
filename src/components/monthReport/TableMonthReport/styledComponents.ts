import styled from 'styled-components';
import { TfiExport } from 'react-icons/tfi';

interface MobileProps {
  mobile: boolean;
}

export const Container = styled.div`
  background-color: #fff;
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
`;

export const TopContainer = styled.div<MobileProps>`
  //margin-top: 40px;
  padding: 15px 10px 5px 10px;
  display: flex;
  ${(props) => props.mobile && 'flex-direction: column;'}
  justify-content: space-between;
`;

export const IconExport = styled(TfiExport)`
  color: ${(props) => props.theme.colors.primary};
`;
