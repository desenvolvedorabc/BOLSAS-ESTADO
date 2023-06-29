import styled from 'styled-components';

type StatusProps = {
  sent: boolean;
};

export const Container = styled.div`
  background-color: #fff;
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
`;

export const TopContainer = styled.div`
  //margin-top: 40px;
  padding: 15px 10px 5px 10px;
  display: flex;
  justify-content: space-between;
`;

export const FilterSelectedContainer = styled.div`
  background-color: #f2f0f9;
  display: flex;
  padding: 10px;
  align-items: end;
`;

export const Status = styled.div<StatusProps>`
  background-color: ${(props) => (props.sent ? '#CDFFCD' : '#FFE0E0')};
  color: ${(props) => (props.sent ? '#007F00' : '#D30000')};
  border-radius: 10px;
  text-align: center;
  padding: 2px 24px;
`;

export const ButtonDelete = styled.button`
  background-color: transparent;
  border: none;
  height: 100%;
  width: 100%;
  color: #3b51c7;

  &:hover {
    color: #3b51c7;
    background-color: transparent;
    border: none;
  }

  &:active {
    background-color: transparent;
    border: none;
  }
`;

export const Title = styled.span`
  max-height: 100px;
  max-width: 650px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  flex-wrap: wrap;
`;

export const Text = styled.span<{ mobile: boolean }>`
  max-height: 100px;
  max-width: 650px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  display: flex;
  flex-wrap: wrap;

  img {
    max-width: ${(props) => (props.mobile ? '120px' : '200px')};
  }
`;
