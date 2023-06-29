import styled from 'styled-components';

type IMobileProps = {
  mobile: boolean;
};

export const Title = styled.p<IMobileProps>`
  max-width: ${(props) => (props.mobile ? '280px' : '650px')};
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  flex-wrap: wrap;
  word-wrap: break-word;
`;

export const Data = styled.div`
  font-size: 14px;
`;

export const Text = styled.p<IMobileProps>`
  max-width: ${(props) => (props.mobile ? '280px' : '650px')};
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  flex-wrap: wrap;
  word-wrap: break-word;

  img {
    max-width: ${(props) => (props.mobile ? '250px' : '500px')};
  }
`;
