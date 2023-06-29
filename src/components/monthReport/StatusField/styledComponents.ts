import styled from 'styled-components';

export interface ColorProps {
  colors: string[];
}
export interface DivisionProps {
  division: boolean;
}

export const StatusContainer = styled.div<DivisionProps>`
  background-color: #fff;
  border-radius: 4px;
  height: 40px;
  width: ${(props) => (props.division ? '300px' : '200px')};
  border: 1px solid #d5d5d5;
  display: flex;
  align-items: center;
  justify-content: space-around;,
  // padding: 10 30px;
`;

export const LabelStatus = styled.div`
  color: #7c7c7c;
  font-weight: 400;
  font-size: 11px;
`;

export const StatusText = styled.div<ColorProps>`
  color: ${(props) => props.colors[0]} !important;
  // font-weight: 400;
  font-size: 14px;
`;

export const LevelField = styled.div<ColorProps>`
  background-color: ${(props) => props.colors[2]} !important;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 2px 10px;
`;

export const Circle = styled.div<ColorProps>`
  background-color: ${(props) => props.colors[1]};
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 8px;
`;

export const DivisionStatus = styled.div`
  border: 0.5px solid #d5d5d5;
  // width: 2px;
  height: 30px;
`;
