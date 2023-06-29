import styled from 'styled-components';
import { Form, Button } from 'react-bootstrap';

export interface InputGroupProps {
  columns: string;
  mobile: boolean;
  gap: string;
  paddingTop: string;
}

export interface MobileProps {
  mobile?: boolean;
}

export interface ButtonGroupProps {
  mobile?: boolean;
  border?: boolean;
  justify?: string;
}

export const InputGroup = styled(Form.Group)<InputGroupProps>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.mobile ? '1fr' : props.columns ? props.columns : '1fr 1fr'};
  grid-gap: ${(props) => (props.gap ? props.gap : '30px')};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : '0px')};
`;

export const InputGroup3Dashed = styled(Form.Group)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  padding-bottom: 30px;
  padding-top: 30px;
  border-bottom: 1px dashed #d5d5d5;
`;

export const InputGroup3 = styled(Form.Group)<MobileProps>`
  display: grid;
  grid-template-columns: ${(props) => (props.mobile ? '1fr' : '1fr 1fr 1fr')};
  grid-gap: 40px;
  padding-top: 30px;
`;

export const InputGroup32 = styled(Form.Group)`
  display: grid;
  grid-template-columns: ${(props) => (props.mobile ? '1fr' : '2fr 1fr 1fr')};
  grid-gap: 30px;
  padding-top: 30px;
`;

export const InputGroup5 = styled(Form.Group)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  padding-top: 30px;
`;

export const InputGroup4 = styled(Form.Group)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 50px;
  padding-top: 30px;
`;

export const InputGroup42 = styled(Form.Group)`
  display: grid;
  grid-template-columns: 3fr 1fr 2fr 2fr;
  grid-gap: 30px;
  padding-top: 30px;
`;

export const ButtonDisable = styled(Button)`
  background-color: #ff6868;
  width: 100%;
  border: none;
  font-size: 13px;
  min-height: 40px;

  &:hover {
    background-color: #943030;
  }
  &:active {
    background-color: #943030;
  }
  &:focus {
    background-color: #943030;
  }

  &:disabled {
    background-color: #d5d5d5;
  }
`;

export const InputGroup2 = styled(Form.Group)`
  display: grid;
  grid-template-columns: ${(props) => (props.mobile ? '1fr' : '1fr 1fr')};
  grid-gap: 30px;
  padding-bottom: ${(props) => (props.paddingBottom ? '30px' : '0px')};
  padding-top: 30px;
`;

export const Circle = styled.div`
  height: 20px;
  width: 20px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
`;

export const ButtonGroupBetween = styled.div<ButtonGroupProps>`
  display: flex;
  flex-direction: ${(props) => (props.mobile ? 'column' : 'row')};
  justify-content: ${(props) =>
    props.justify ? props.justify : 'space-between'};
  align-items: center;
  padding-top: 30px;
  border-top: ${(props) => (props.border ? '1px solid #d5d5d5' : 'none')};
`;

export const ButtonGroupEnd = styled.div`
  display: flex;
  justify-content: end;
  padding-top: 30px;
  border-top: 1px solid #d5d5d5;
`;

export const Card = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;

  &.reset {
    background-color: transparent;
    border-radius: 0;
    padding: 0;
    .card-box {
      margin-bottom: 16px;
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;
    }
  }
`;

const getColor = (props) => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isFocused) {
    return '#2196f3';
  }
  return '#eeeeee';
};

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

export const ButtonNoBorder = styled.button`
  background-color: white;
  border: none;
  margin-top: 3px;
  font-size: 0.9rem;
`;

export const FormCheck = styled(Form.Check)`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d5d5d5;
`;

export const FormSelect = styled(Form.Select)`
  height: 40px;
`;
