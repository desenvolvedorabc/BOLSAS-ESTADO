import styled from 'styled-components';

interface MobileProps {
  mobile: boolean;
}

export const CardStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  background-color: #fff;
  padding: 1rem;
  margin-bottom: 20px;
`;

export const CardItems = styled.div<MobileProps>`
  display: flex;
  flex-direction: ${(props) => (props.mobile ? 'column' : 'row')};
  justify-content: space-between;
  width: 100%;
`;

export const InfoGroup = styled.div<MobileProps>`
  display: flex;
  align-items: center;
  flex-direction: ${(props) => (props.mobile ? 'column' : 'row')};
`;

export const IconsGroup = styled.div<MobileProps>`
  ${(props) =>
    props.mobile
      ? `
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `
      : `
      display: grid;
      grid-template-columns: 1fr 1fr;
      // grid-gap: 45px;
    `}
`;

export const Info = styled.div<MobileProps>`
  display: flex;
  padding-right: ${(props) => (props.mobile ? '0px' : '45px')};

  word-wrap: break-word;
`;

export const NameBox = styled.div<MobileProps>`
  ${(props) =>
    props.mobile
      ? 'width:100%; display: flex; flex-direction: column; align-items:center; margin-top: 20px;'
      : ''};
`;

export const Name = styled.div<MobileProps>`
  font-size: 24px;
  margin-bottom: 10px;
  display: flex;
  font-weight: bold;
  ${(props) =>
    props.mobile ? 'justify-content: center; text-align: center' : ''};
`;

export const Email = styled.div<MobileProps>`
  ${(props) =>
    props.mobile
      ? 'overflow: hidden; text-overflow: ellipsis; width: 70vw;'
      : ''};
`;

export const Role = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #7c7c7c;
  margin-bottom: 16px;
`;

export const Logo = styled.div`
  border: 9px solid #f6f6f6 !important;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);
  width: 180px;
  height: 180px;
`;

export const ButtonGroup = styled.div<MobileProps>`
  display: flex;
  flex-direction: ${(props) => (props.mobile ? 'row' : 'column')};
  align-items: ${(props) => (props.mobile ? '' : 'end')};
  justify-content: space-between;
  margin-top: ${(props) => (props.mobile ? '3.875rem' : '0rem')};
  margin-bottom: ${(props) => (props.mobile ? '1.25rem' : '0rem')};
`;
