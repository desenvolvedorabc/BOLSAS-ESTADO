import styled from 'styled-components';
import Image from 'next/image';
import { ListItemIcon, ListItemText } from '@mui/material';

export const Nav = styled.div`
  min-width: 270px !important;
  width: 270px;
  min-height: 100vh;
  border-right: 1px solid ${(props) => props.theme.colors.primary};
`;

export const SubTitle = styled.div`
  color: white;
  font-size: 11px;
  margin-left: 5px;
  margin-top: 2px;
  line-height: 1;
`;

export const UserWrapper = styled.div`
  background: ${(props) => props.theme.gradients.gradientHorizontal};
  padding: 8px;
  margin-right: -1px;
`;

export const UserInfo = styled.div`
  color: white;
`;

export const ButtonLogout = styled.button`
  background-color: transparent;
  border: none;
`;

export const ImageStyled = styled(Image)`
  cursor: pointer;
`;

export const TitleGroup = styled(ListItemText)`
  color: ${(props) => props.theme.colors.secondary};
`;

export const ButtonText = styled(ListItemText)<{ active: boolean }>`
  &:hover {
    color: ${(props) => props.theme.colors.secondary};
  }
  &:focus {
    color: ${(props) => props.theme.colors.secondary};
  }

  ${(props) =>
    !props.active
      ? `color: ${props.theme.colors.dark} !important; `
      : `color: ${props.theme.colors.secondary} !important;`}
`;

export const IconButton = styled(ListItemIcon)<{
  reactIcon: boolean;
  active: boolean;
}>`
  color: ${(props) =>
    props.active
      ? props.theme.colors.secondary
      : props.theme.colors.dark} !important;
  ${(props) =>
    props.active &&
    !props.reactIcon &&
    `path {fill: ${props.theme.colors.secondary} !important}`};
`;
