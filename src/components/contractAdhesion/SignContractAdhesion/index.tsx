import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import { Card, ButtonGroupBetween, InputGroup } from 'src/shared/styledForms';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { useState, useContext } from 'react';
import Router from 'next/router';
import ModalPergunta from 'src/components/modalPergunta';
import { TextField } from '@mui/material';
import { ThemeContext } from 'src/context/ThemeContext';
import brLocale from 'date-fns/locale/pt-BR';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { useAuth } from 'src/context/AuthContext';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import { maskCPF } from 'src/utils/masks';
import { BoxSign, LineSign } from './styledComponents';
import InputFile from 'src/components/InputFile';
import { ButtonDownload } from 'src/components/scholarshipRegistration/FormScholarshipApprove/styledComponents';
import { MdOutlineDownload } from 'react-icons/md';
import { useGeneratePdf } from 'src/utils/generatePdf';
import { GeneratePdfSignContract } from './GeneratePdfSignContract';
import ErrorText from 'src/components/ErrorText';
import { signMyContract } from 'src/services/contract';
import { format } from 'date-fns';

export default function SignContractAdhesion({ contract, url }) {
  const { user } = useAuth();
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalMessageError, setModalMessageError] = useState('');
  const { mobile } = useContext(ThemeContext);
  const [isDisabled, setIsDisabled] = useState(true);
  const [file, setFile] = useState(null);
  const [errorFile, setErrorFile] = useState(false);

  const { componentRef, handlePrint } = useGeneratePdf();

  const handleChangeFile = (e) => {
    setFile(e.target.value);
    setModalShowWarning(true);
  };

  const handleSave = async () => {
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
      response = await signMyContract(data);
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }

    if (response?.status === 200 || response?.status === 201) {
      setModalStatus(true);
      setModalShowConfirm(true);
    } else {
      setModalMessageError(response?.data?.message);
      setModalStatus(false);
      setModalShowConfirm(true);
    }
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
          <strong>Termo de compromisso</strong>
        </div>
        <Form onSubmit={null}>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <div>
              <TextField
                value={contract?.project}
                label="Projeto"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
            <div>
              <TextField
                value={contract?.axle}
                label="Eixo"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <div>
              <TextField
                value={contract?.workUnit}
                label="Regional"
                size="small"
                fullWidth
                disabled
                sx={{ backgroundColor: '#fff' }}
              />
            </div>
            <div>
              <TextField
                value={contract?.city}
                label="Município"
                size="small"
                fullWidth
                disabled
                sx={{ backgroundColor: '#fff' }}
              />
            </div>
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <div>
              <TextField
                value={contract?.contractDescription}
                label="Descrição do Contrato"
                size="small"
                minRows={4}
                maxRows={4}
                multiline
                inputProps={{ maxLength: 300 }}
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr 1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <div>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={brLocale}
              >
                <DatePicker
                  value={contract?.startDate}
                  onChange={null}
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="Data início"
                  disabled
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      size="small"
                      {...params}
                      sx={{ backgroundColor: '#FFF' }}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>
            <div>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={brLocale}
              >
                <DatePicker
                  value={contract?.endDate}
                  onChange={null}
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="Data Término"
                  disabled
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      size="small"
                      {...params}
                      sx={{ backgroundColor: '#FFF' }}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>
            <div>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={brLocale}
              >
                <DatePicker
                  value={contract?.extensionDate}
                  onChange={null}
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="Data Prorrogação"
                  disabled
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      size="small"
                      {...params}
                      sx={{ backgroundColor: '#FFF' }}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>
          </InputGroup>

          <InputGroup mobile={mobile} columns={'1fr'} paddingTop={'30px'}>
            <div
              style={{
                borderTop: '1px solid #d5d5d5',
              }}
            ></div>
          </InputGroup>

          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <div>
              <TextField
                value={contract?.payingSource}
                label="Fonte Pagadora"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
            <div>
              <TextField
                value={contract?.bagName}
                label="Nome da Bolsa"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr 1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <div>
              <TextField
                value={contract?.weekHours}
                label="Horas Semanais"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
            <div>
              <TextField
                value={(contract?.scholarshipValueInCents / 100).toLocaleString(
                  'pt-BR',
                  {
                    style: 'currency',
                    currency: 'BRL',
                  },
                )}
                label="Valor da Bolsa"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
          </InputGroup>
          <BoxSign>
            <div>Assinatura do Bolsista:</div>
            <LineSign mobile={mobile} />
            <div style={{ textAlign: 'justify' }}>{user?.name}</div>
          </BoxSign>
          {contract?.status === 'PENDENTE_ASSINATURA' && (
            <ButtonGroupBetween mobile={mobile} border={false}>
              <div></div>
              <div style={{ width: 163 }}>
                <ButtonDefault
                  type="button"
                  // disable={isDisabled}
                  onClick={handlePrint}
                >
                  Download do Termo
                </ButtonDefault>
              </div>
            </ButtonGroupBetween>
          )}
        </Form>
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
                disabled={contract?.status !== 'PENDENTE_ASSINATURA'}
              />
              {errorFile ? <ErrorText>Campo Obrigatório</ErrorText> : null}
            </div>
            {contract?.signedDocument && (
              <OverlayTrigger
                key={'toolTip_Arq'}
                placement={'bottom'}
                overlay={
                  <Tooltip id={`tooltip-bottom`}>
                    {contract?.signedDocument}
                  </Tooltip>
                }
              >
                <ButtonDownload
                  href={`${url}/terms-of-membership/terms/${contract?.signedDocument}`}
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
                  contract?.signedAt
                    ? format(new Date(contract?.signedAt), 'dd/MM/yyyy')
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
          {contract?.status === 'PENDENTE_ASSINATURA' && (
            <div style={{ width: 163, marginTop: mobile ? 20 : 0 }}>
              <ButtonDefault
                type="button"
                disable={isDisabled}
                onClick={handleSave}
              >
                Assinar Termo
              </ButtonDefault>
            </div>
          )}
        </div>
      </Card>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false), modalStatus && Router.reload();
        }}
        text={modalStatus ? `Termo assinado com sucesso!` : modalMessageError}
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowWarning}
        onHide={() => {
          setModalShowWarning(false), setIsDisabled(true);
        }}
        onConfirm={() => {
          setIsDisabled(false), setModalShowWarning(false);
        }}
        buttonNo={'Não foi assinado'}
        buttonYes={'Confirmo a Assinatura'}
        text={`Confirma que foi realizada a assinatura do termo de Compromisso enviado?`}
        status={false}
        warning={true}
        size="md"
      />
      <GeneratePdfSignContract
        componentRef={componentRef}
        user={user}
        contract={contract}
      />
    </>
  );
}
