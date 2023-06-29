import styled from 'styled-components';

type MobileProps = {
  mobile: boolean;
};

export const Box = styled.div<MobileProps>`
  padding-bottom: 20px;
  border-bottom: 1px solid #d5d5d5;
  display: grid;
  grid-template-columns: ${(props) =>
    props.mobile ? '1fr' : '2fr 1fr 1fr 1fr'};
  grid-gap: 20px;
`;

export const Box2 = styled.div<MobileProps>`
  padding: 20px 0 30px 0;
  display: grid;
  grid-template-columns: ${(props) =>
    props.mobile ? '1fr 1fr' : '1fr 3fr 1fr'};
  grid-gap: 20px;
`;
