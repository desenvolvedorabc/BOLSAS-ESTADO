import styled from 'styled-components';

type IMobileProps = {
  mobile: boolean;
};

export const Data = styled.div`
  color: #4b4b4b;
  font-size: 16px;
`;

export const Text = styled.p`
  width: 100%;
  word-wrap: break-word;

  img {
    max-width: 100%;
  }
`;

export const Title = styled.p<IMobileProps>`
  font-weight: 700;
  font-size: 16px;
  color: #000000;
  margin-top: 15px;
  margin-bottom: 10px;

  max-width: ${(props) => (props.mobile ? '250px' : '400px')};
  // max-width: 100%;
  word-wrap: break-word;
`;
