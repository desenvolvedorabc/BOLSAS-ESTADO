import styled from 'styled-components';

interface IPageTitle {
  mobile: boolean;
}

export const PageTitleStyled = styled.div<IPageTitle>`
  color: #4b4b4b;
  font-size: ${(props) => (props.mobile ? '1.125rem' : '2rem')};
  font-weight: 300;
`;
