import styled from 'styled-components';
import { Form } from 'react-bootstrap';

interface IStyleMobile {
  mobile: boolean;
}

export const InputGroupCheck = styled(Form.Group)`
  display: flex;
  flex-direction: column;
  border-right: 1px solid #d5d5d5;
`;

export const InputGroupCheck2 = styled(Form.Group)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
`;

export const FormCheckLabel = styled(Form.Check.Label)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-left: 8px;
`;

export const CardBloco = styled.div<IStyleMobile>`
  width: ${(props) => (props.mobile ? 300 : 790)};
  border: 0.5px solid #828282;
  border-radius: 5px;
  margin-bottom: 27px;
`;

export const TopoCard = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;
  border-bottom: 1px solid #828282;
`;

export const CheckGroup = styled.div<IStyleMobile>`
  display: grid;
  grid-template-columns: ${(props) => (props.mobile ? '1fr' : '1fr 1fr 1fr')};
`;

export const FormCheck = styled(Form.Check)`
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #d5d5d5;
  border-right: 1px solid #d5d5d5;
  width: 100%;
  padding: 20px 0px 17px 8px;
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  background-color: #d8d8d8;
  border-radius: 25px;
  margin-left: 5px;
`;
