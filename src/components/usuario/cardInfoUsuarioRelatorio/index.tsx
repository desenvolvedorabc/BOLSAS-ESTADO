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
  Email,
} from './styledComponents';
import Router from 'next/router';
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
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { useContext, useEffect, useState } from 'react';
import { resendEmailPassword } from 'src/services/usuarios.service';
import { maskCPF, maskPhone } from 'src/utils/masks';
import { IconColor } from 'src/shared/styledComponents';
import { ThemeContext } from 'src/context/ThemeContext';
import { ButtonMenu } from 'src/components/ButtonMenu';
import { useGeneratePdf } from 'src/utils/generatePdf';
import { useAuth } from 'src/context/AuthContext';
import { ProfileRole } from 'src/services/perfis.service';

export default function CardInfoUsuarioRelatorio({ usuario }) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const { mobile } = useContext(ThemeContext);
  const { componentRef, handlePrint } = useGeneratePdf();
  const { user } = useAuth();
  const [disableEdit, setDisableEdit] = useState(false);

  const sendEmail = async () => {
    const resp = await resendEmailPassword(usuario?.id);
    if (resp.status === 200) {
      setModalStatus(true);
    } else {
      setModalStatus(false);
    }

    setModalShowConfirm(true);
  };

  useEffect(() => {
    if (user?.subRole === 'ADMIN' && usuario?.subRole === 'BOLSISTA') {
      setDisableEdit(true);
    }
  }, [user?.subRole, usuario?.subRole]);

  return (
    <CardStyled>
      <CardItems mobile={mobile}>
        <InfoGroup mobile={mobile}>
          <Logo className="rounded-circle">
            {usuario?.image_profile ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${usuario?.image_profile_url}`}
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
          <div style={{ marginLeft: mobile ? '' : '1.5rem' }}>
            <Name mobile={mobile}>{usuario?.name}</Name>
            <Role mobile={mobile}>
              {usuario?.access_profile?.name} -{' '}
              {usuario?.subRole === 'ADMIN'
                ? 'ADMIN'
                : ProfileRole[usuario?.access_profile?.role]}
            </Role>
            <IconsGroup mobile={mobile}>
              <Info mobile={mobile}>
                <IconColor>
                  <MdOutlineEmail size={24} />
                </IconColor>
                <Email mobile={mobile} className="ms-2 mb-3">
                  {usuario?.email}
                </Email>
              </Info>
              <Info mobile={mobile}>
                <IconColor>
                  <MdOutlineLocationOn size={24} />
                </IconColor>
                <div className="ms-2 mb-3">
                  {usuario?.city
                    ? usuario?.city
                    : 'N/A' + ' - ' + usuario?.partner_state?.name}
                </div>
              </Info>
              <Info mobile={mobile}>
                <IconColor>
                  <MdOutlineAccountCircle size={24} />
                </IconColor>
                <div className="ms-2 mb-3">{maskCPF(usuario?.cpf)}</div>
              </Info>
              <Info mobile={mobile}>
                <IconColor>
                  <MdShareLocation size={24} />
                </IconColor>
                <div className="ms-2 mb-3">
                  {'Regional: ' +
                    (usuario?.regionalPartner?.name
                      ? usuario?.regionalPartner?.name
                      : 'N/A')}
                </div>
              </Info>
              <Info mobile={mobile}>
                <IconColor>
                  <MdPhoneAndroid size={24} />
                </IconColor>
                <div className="ms-2 mb-3">{maskPhone(usuario?.telephone)}</div>
              </Info>
            </IconsGroup>
          </div>
        </InfoGroup>
        <ButtonGroup mobile={mobile}>
          <ButtonMenu handlePrint={handlePrint} handleCsv={null} />
          {!usuario?.isChangePasswordWelcome && !mobile && (
            <div style={{ width: 140 }}>
              <ButtonWhite
                onClick={() => {
                  sendEmail();
                }}
              >
                Reenviar Email
              </ButtonWhite>
            </div>
          )}
          <div className="ms-2" style={{ width: 140 }}>
            {!disableEdit && (
              <ButtonDefault
                onClick={() => {
                  Router.push(
                    `/painel/${user?.partner_state?.slug}/usuario-admin/editar/${usuario?.id}`,
                  );
                }}
              >
                Editar
              </ButtonDefault>
            )}
          </div>
        </ButtonGroup>
        {!usuario?.isChangePasswordWelcome && mobile && (
          <div
            style={{
              width: 140,
              margin: 'auto',
              display: 'flex',
            }}
          >
            <ButtonWhite
              onClick={() => {
                sendEmail();
              }}
            >
              Reenviar Email
            </ButtonWhite>
          </div>
        )}
      </CardItems>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false);
        }}
        text={
          modalStatus ? `Email enviado com sucesso` : `Erro ao enviar email`
        }
        status={modalStatus}
      />
      <GeneratePdfPage componentRef={componentRef} usuario={usuario} />
    </CardStyled>
  );
}

function GeneratePdfPage({ componentRef, usuario }) {
  return (
    <div className="pdf">
      <div ref={componentRef} className="print-container">
        <CardStyled>
          <CardItems mobile={false}>
            <InfoGroup mobile={false}>
              <Logo className="rounded-circle">
                {usuario?.image_profile ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${usuario?.image_profile_url}`}
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
              <div className="ms-4">
                <Name mobile={false}>
                  <strong>{usuario?.name}</strong>
                </Name>
                <Role mobile={false}>
                  {usuario?.access_profile?.name} -
                  {usuario?.subRole === 'ADMIN'
                    ? 'ADMIN'
                    : ProfileRole[usuario?.access_profile?.role]}
                </Role>
                <IconsGroup mobile={false}>
                  <Info mobile={false}>
                    <IconColor>
                      <MdOutlineEmail size={24} />
                    </IconColor>
                    <div className="ms-2 mb-3">{usuario?.email}</div>
                  </Info>
                  <Info mobile={false}>
                    <IconColor>
                      <MdOutlineLocationOn size={24} />
                    </IconColor>
                    <div className="ms-2 mb-3">
                      {usuario?.city
                        ? usuario?.city
                        : 'N/A' + ' - ' + usuario?.partner_state?.name}
                    </div>
                  </Info>
                  <Info mobile={false}>
                    <IconColor>
                      <MdOutlineAccountCircle size={24} />
                    </IconColor>
                    <div className="ms-2 mb-3">{maskCPF(usuario?.cpf)}</div>
                  </Info>
                  <Info mobile={false}>
                    <IconColor>
                      <MdShareLocation size={24} />
                    </IconColor>
                    <div className="ms-2 mb-3">
                      {'Regional: ' +
                        (usuario?.regionalPartner?.name
                          ? usuario?.regionalPartner?.name
                          : 'N/A')}
                    </div>
                  </Info>
                </IconsGroup>
              </div>
            </InfoGroup>
          </CardItems>
        </CardStyled>
      </div>
    </div>
  );
}
