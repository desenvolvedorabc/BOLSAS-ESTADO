import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import { Card, InputGroup } from 'src/shared/styledForms';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { useState, useContext } from 'react';
import ModalPergunta from 'src/components/modalPergunta';
import { TextField } from '@mui/material';
import { ThemeContext } from 'src/context/ThemeContext';
import { useAuth } from 'src/context/AuthContext';
import ButtonVermelho from 'src/components/buttons/buttonVermelho';
import { maskCPF } from 'src/utils/masks';
import InputFile from 'src/components/InputFile';
import { ButtonDownload } from 'src/components/scholarshipRegistration/FormScholarshipApprove/styledComponents';
import { MdOutlineDownload } from 'react-icons/md';
import ErrorText from 'src/components/ErrorText';
import { cancelMyContract } from 'src/services/contract';
import { format } from 'date-fns';

export default function CancelContractAdhesion({ contract, url }) {
  const { user } = useAuth();
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowSign, setModalShowSign] = useState(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalMessageError, setModalMessageError] = useState('');
  const { mobile } = useContext(ThemeContext);
  const [isDisabled, setIsDisabled] = useState(true);
  const [file, setFile] = useState(null);
  const [errorFile, setErrorFile] = useState(false);

  const { signOut } = useAuth();

  const handleChangeFile = (e) => {
    setFile(e.target.value);
    setModalShowSign(true);
  };

  const handleCancel = async () => {
    if (!file) {
      setErrorFile(true);
      return;
    }

    setErrorFile(false);

    setIsDisabled(true);

    const data = new FormData();
    data.append('file', file);

    let response = null;
    try {
      response = await cancelMyContract(data);
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }

    if (response.status === 200 || response.status === 201) {
      setModalStatus(true);
      setModalShowConfirm(true);
    } else {
      setModalMessageError(response.data.message);
      setModalStatus(false);
      setModalShowConfirm(true);
    }
  };

  const downloadTerm = () => {
    const anchor = document.createElement('a');
    anchor.href =
      '/assets/documents/Termo_de_Cancelamento_Do_Compromisso_Com_A_Bolsa.pdf';
    anchor.target = '_blank';
    anchor.download = 'Termo de Cancelamento Do Compromisso Com A Bolsa';

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <>
      <Card style={{ marginBottom: 5 }}>
        <div className="mb-3">
          <strong>Bolsista</strong>
        </div>
        <InputGroup mobile={mobile} columns={'1fr 3fr'} paddingTop={'30px'}>
          <TextField
            label="CPF"
            size="small"
            fullWidth
            value={maskCPF(user?.cpf)}
            sx={{
              backgroundColor: '#fff',
              '&.Mui-disabled': {
                color: '#000',
              },
            }}
            disabled={true}
          />
          <TextField
            label="Nome"
            size="small"
            fullWidth
            value={user?.name}
            sx={{ backgroundColor: '#fff' }}
            disabled={true}
          />
        </InputGroup>
      </Card>
      <Card>
        <div className="mb-3">
          <strong>Termo de Desistência</strong>
        </div>
        <div style={{ width: 163 }}>
          <ButtonDefault
            type="button"
            disable={contract?.status !== 'ASSINADO'}
            onClick={downloadTerm}
          >
            Download do Termo
          </ButtonDefault>
        </div>
      </Card>
      <Card style={{ marginTop: 14 }}>
        <div style={{ marginBottom: 30 }}>Upload do Termo</div>
        <div
          style={{
            display: 'flex',
            justifyContent: mobile ? 'center' : 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex' }}>
            <div style={{ width: '237px' }}>
              <InputFile
                label="Enviar Termo Assinado"
                onChange={(e) => handleChangeFile(e)}
                error={!!errorFile}
                acceptFile={'*'}
                disabled={contract?.status !== 'ASSINADO'}
              />
              {errorFile ? <ErrorText>Campo Obrigatório</ErrorText> : null}
            </div>
            {contract?.cancelDocument && (
              <OverlayTrigger
                key={'toolTip_Arq'}
                placement={'bottom'}
                overlay={
                  <Tooltip id={`tooltip-bottom`}>
                    {contract?.cancelDocument}
                  </Tooltip>
                }
              >
                <ButtonDownload
                  href={`${url}/terms-of-membership/terms/${contract?.cancelDocument}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MdOutlineDownload size={20} />
                </ButtonDownload>
              </OverlayTrigger>
            )}
            <div style={{ marginLeft: 30 }}>
              <TextField
                value={
                  contract?.cancelAt
                    ? format(new Date(contract?.cancelAt), 'dd/MM/yyyy')
                    : null
                }
                label="Data de Envio"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
          </div>
          {contract?.status === 'ASSINADO' && (
            <div style={{ width: 233, marginTop: mobile ? 20 : 0 }}>
              <ButtonVermelho
                type="button"
                disable={isDisabled}
                onClick={() => setModalShowWarning(true)}
              >
                Cancelar Termo de Compromisso
              </ButtonVermelho>
            </div>
          )}
        </div>
      </Card>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false), modalStatus && signOut();
        }}
        text={modalStatus ? `Termo cancelado com sucesso!` : modalMessageError}
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowSign}
        onHide={() => {
          setModalShowSign(false), setIsDisabled(true);
        }}
        onConfirm={() => {
          setIsDisabled(false), setModalShowSign(false);
        }}
        buttonNo={'Não foi assinado'}
        buttonYes={'Confirmo a Assinatura'}
        text={`Confirma que foi realizada a assinatura do termo de desistência enviado?`}
        status={false}
        warning={true}
        size="md"
      />
      <ModalPergunta
        show={modalShowWarning}
        onHide={() => {
          setModalShowWarning(false);
        }}
        onConfirm={() => {
          setModalShowWarning(false), handleCancel();
        }}
        buttonNo={'Não tenho certeza'}
        buttonYes={'Cancelar Termo'}
        text={`Atenção! Você está cancelando esse termo de compromisso. Tem certeza que deseja continuar?`}
        status={false}
        warning={false}
        size="md"
      />
    </>
  );
}
