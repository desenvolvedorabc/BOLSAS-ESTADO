import { Modal } from 'react-bootstrap';
import styled from 'styled-components';

type IMobileProps = {
  mobile: boolean;
};

export const Title = styled(Modal.Title)<IMobileProps>`
  padding-top: 30px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  flex-direction: ${(props) => (props.mobile ? 'column' : 'row')};
`;

export const DatesTitle = styled.div`
  display: flex;
`;
