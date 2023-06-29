import styled from 'styled-components';
import { Form } from 'react-bootstrap';

type IMobileProps = {
  mobile: boolean;
};

export const FormCheck = styled(Form.Check)`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d5d5d5;
  padding: 11px 21px;
`;

export const FormCheckLabel = styled(Form.Check.Label)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 8px;
`;

export const List = styled.div`
  color: #000;
  border-top: 1px solid #989898;
  border-bottom: 1px solid #989898;
`;

export const ListOverflow = styled.div`
  max-height: 320px;
  overflow: auto;
`;

export const SelectionSide = styled.div<IMobileProps>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.mobile ? '100%' : '285px')};
`;

export const CardSelectionSide = styled.div`
  background-color: #fff;
  padding: 17px;
  height: 710px;
  margin-bottom: '11px';
`;

export const CardButtons = styled.div`
  background-color: #fff;
  padding: 17px;
  display: flex;
  justify-content: space-between;
  margin-top: 14px;
`;

export const Title = styled.div`
  color: #000;
  margin-bottom: 13px;
`;

export const MessageSide = styled.div<IMobileProps>`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-left: ${(props) => (props.mobile ? '0' : '16px')};
`;

export const ButtonDest = styled.button`
  background-color: #f2f0f9;
  padding: 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
`;

export const ButtonDestList = styled.div<IMobileProps>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.mobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr 1fr'};
  grid-gap: 7px;
`;

export const TopMessage = styled.div`
  padding: 14px 16px;
`;

export const ButtonCard = styled.div<IMobileProps>`
  background-color: #fff;
  padding: 8px 17px;
  margin: ${(props) => (props.mobile ? '10px 0 20px 0' : '0')};
`;

export const ButtonScroll = styled.button`
  width: 64px;
  height: 64px;
  // position: absolute;
  // left: 0px;
  //   top: 0px;
  // right: 0px;
  margin-top: -80px;

  border-radius: 50%;

  background: ${(props) => props.theme.colors.primary};
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
`;
