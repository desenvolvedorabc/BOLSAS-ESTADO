import {
  CardStyled,
  Name,
  Role,
  Logo,
  IconsGroup,
  Info,
  InfoGroup,
  CardItems,
  ButtonGroup,
  NameBox,
  Email,
} from './styledComponents';
import Image from 'next/image';
import {
  MdOutlineEmail,
  MdOutlineAccountCircle,
  MdOutlineLocationOn,
  MdShareLocation,
  MdPhoneAndroid,
} from 'react-icons/md';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import { useContext, useState } from 'react';
import { maskCPF, maskPhone } from 'src/utils/masks';
import { IconColor } from 'src/shared/styledComponents';
import { ThemeContext } from 'src/context/ThemeContext';
import { useAuth } from 'src/context/AuthContext';
import ModalEditarMinhaConta from 'src/components/modalEditarMinhaConta';
import ModalTrocarSenha from 'src/components/modalTrocarSenha';
import { ProfileRole } from 'src/services/perfis.service';

export default function CardInfoMinhaConta({ url }) {
  const [modalEditarMinhaConta, setModalEditarMinhaConta] = useState(false);
  const [modalTrocarSenha, setModalTrocarSenha] = useState(false);
  const { mobile } = useContext(ThemeContext);
  const { user } = useAuth();
  const [isReset, setIsReset] = useState(false);

  return (
    <>
      {user && Object.keys(user)?.length && (
        <>
          <CardStyled>
            <CardItems mobile={mobile}>
              <InfoGroup mobile={mobile}>
                <Logo className="rounded-circle">
                  {user?.image_profile ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${user?.image_profile_url}`}
                      className="rounded-circle"
                      width={160}
                      height={160}
                      alt="avatar"
                    />
                  ) : (
                    <Image
                      src="/assets/images/avatar.png"
                      className="rounded-circle"
                      width={170}
                      height={170}
                      alt="avatar"
                    />
                  )}
                </Logo>
                <div style={{ marginLeft: mobile ? 0 : '1.5rem' }}>
                  <NameBox mobile={mobile}>
                    <Name mobile={mobile}>{user?.name}</Name>
                    <Role>
                      {user?.access_profile?.name} -{' '}
                      {user?.subRole === 'ADMIN'
                        ? 'ADMIN'
                        : ProfileRole[user?.access_profile?.role]}
                    </Role>
                  </NameBox>
                  <IconsGroup mobile={mobile}>
                    <Info mobile={mobile}>
                      <IconColor>
                        <MdOutlineEmail size={24} />
                      </IconColor>
                      <Email mobile={mobile} className="ms-2 mb-3">
                        {user?.email}
                      </Email>
                    </Info>
                    <Info mobile={mobile}>
                      <IconColor>
                        <MdOutlineLocationOn size={24} />
                      </IconColor>
                      <div className="ms-2 mb-3">
                        {user?.city
                          ? user?.city
                          : 'N/A' + ' - ' + user?.partner_state?.name}
                      </div>
                    </Info>
                    <Info mobile={mobile}>
                      <IconColor>
                        <MdPhoneAndroid size={24} />
                      </IconColor>
                      <div className="ms-2 mb-3">
                        {maskPhone(user?.telephone)}
                      </div>
                    </Info>
                    <Info mobile={mobile}>
                      <IconColor>
                        <MdShareLocation size={24} />
                      </IconColor>
                      <div className="ms-2 mb-3">
                        {'Regional: ' +
                          (user?.regionalPartner?.name
                            ? user?.regionalPartner?.name
                            : 'N/A')}
                      </div>
                    </Info>
                    <Info mobile={mobile}>
                      <IconColor>
                        <MdOutlineAccountCircle size={24} />
                      </IconColor>
                      <div className="ms-2 mb-3">{maskCPF(user?.cpf)}</div>
                    </Info>
                  </IconsGroup>
                </div>
              </InfoGroup>
              <ButtonGroup mobile={mobile}>
                <div style={{ width: mobile ? 137 : 163 }}>
                  <ButtonDefault
                    onClick={() => setModalEditarMinhaConta(true)}
                    type="button"
                  >
                    Editar
                  </ButtonDefault>
                </div>
                <div style={{ width: mobile ? 137 : 163 }}>
                  <ButtonWhite
                    onClick={() => setModalTrocarSenha(true)}
                    type="button"
                  >
                    Redefinir Senha
                  </ButtonWhite>
                </div>
              </ButtonGroup>
            </CardItems>
            <ModalEditarMinhaConta
              show={modalEditarMinhaConta}
              onHide={() => {
                setModalEditarMinhaConta(false);
                setIsReset(!isReset);
              }}
              usuario={user}
              url={url}
              isReset={isReset}
            />
            <ModalTrocarSenha
              show={modalTrocarSenha}
              onHide={() => {
                setModalTrocarSenha(false);
              }}
              usuario={user}
            />
          </CardStyled>
        </>
      )}
    </>
  );
}
