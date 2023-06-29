import {
  CardStyled,
  HeaderStyled,
  BodyStyled,
  ImageBox,
} from './styledComponents';

export default function CardLogin(props) {
  return (
    <CardStyled>
      <HeaderStyled>
        <ImageBox>
          <img src={props.logo} width={145} height={104} alt="Logo estado" />
          {/* <Image src="/assets/images/logoParc.png" width={145} height={104} /> */}
        </ImageBox>
      </HeaderStyled>
      <BodyStyled>{props.children}</BodyStyled>
    </CardStyled>
  );
}
