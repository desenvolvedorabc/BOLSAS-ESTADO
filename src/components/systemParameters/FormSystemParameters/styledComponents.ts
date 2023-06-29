import { Tooltip } from 'react-bootstrap';
import styled from 'styled-components';

export const Label = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  margin-top: 10px;
`;

export const TooltipStyled = styled(Tooltip)`
  background: ${(props) => props.theme.colors.primary};
`;
