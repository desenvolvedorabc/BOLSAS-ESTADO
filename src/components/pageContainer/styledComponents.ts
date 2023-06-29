import styled from 'styled-components';

interface IPageContainer {
  mobile: boolean;
}

export const PageContainerStyled = styled.div<IPageContainer>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${(props) => (props.mobile ? '20px 15px' : '40px 25px')};
  background-color: #f6f6f6;
  width: 100%;
  min-height: 100vh;
  height: '100% !important';
  section {
    width: 100%;
    > header {
      padding-top: 10px;
      padding-right: 22px;
      background: #ffffff;
      width: 100%;
      display: flex;
      justify-content: space-between;

      > div {
        padding-top: 0;
      }

      /* align-items: center; */
    }
  }
`;
