/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { FormControlLabel, Switch, TextField } from '@mui/material';
import { ThemeContext } from 'src/context/ThemeContext';
import { Card, InputGroup } from 'src/shared/styledForms';
import brLocale from 'date-fns/locale/pt-BR';
import { maskCPF } from 'src/utils/masks';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import { TableResult } from '../TableResult';
import { ModalJustification } from '../ModalJustification';
import ModalPergunta from 'src/components/modalPergunta';
import Router from 'next/router';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { ButtonsEdit } from '../ButtonsEdit';
import { ButtonsSend } from '../ButtonsSend';
import { InfoReport, Status, Title } from './styledComponents';
import { ButtonsApprove } from '../ButtonsApprove';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import { useGeneratePdf } from 'src/utils/generatePdf';
import {
  deleteMonthReport,
  editMonthReport,
  sendMonthReport,
} from 'src/services/relatorio-mensal.service';
import { getMonthsName } from 'src/utils/anos';
import { AiOutlineEye } from 'react-icons/ai';
import { StatusField } from '../StatusField';
import { GeneratePdfMonthlyReport } from './GeneratePdfMonthlyReport';
import { FormerInput } from 'src/components/scholarshipPreRegistration/FormScholarshipPreRegistration/styledComponents';
import { ModalJustificationReprove } from '../ModalJustificationReprove';
import { useContext, useEffect, useState } from 'react';

type Props = {
  loadedReport: any;
  loadedTerm: any;
  step: string;
  reload?: () => void;
  changeStep?: (newStep: string) => void;
  url: string;
};

export default function FormMonthReport({
  loadedReport,
  loadedTerm,
  step,
  reload,
  changeStep,
  url,
}: Props) {
  const { mobile } = useContext(ThemeContext);

  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowWarningCancel, setModalShowWarningCancel] = useState(false);
  const [modalShowWarningDeletePlan, setModalShowWarningDeletePlan] =
    useState(false);
  const [modalShowJustificationReprove, setModalShowJustificationReprove] =
    useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalMessageError, setModalMessageError] = useState('');
  const [type, setType] = useState(null);

  const [modalShowJustify, setModalShowJustify] = useState(false);
  const [report, setReport] = useState(loadedReport);
  const [actions, setActions] = useState(loadedReport?.actionsMonthlyReport);
  const [fileProve, setFileProve] = useState(loadedReport?.actionDocument);

  const { componentRef, handlePrint } = useGeneratePdf();

  useEffect(() => {
    setReport(loadedReport);
    setActions(loadedReport?.actionsMonthlyReport);
    setFileProve(loadedReport?.actionDocument);
  }, [loadedReport]);

  const onSubmit = async (e) => {
    e.preventDefault();

    let error = false;

    actions.forEach((action) => {
      if (!action.detailing) {
        error = true;
      } else {
        if (action.status === 'CONCLUIDO') {
          if (action?.scheduleWorkPlan?.isFormer) {
            if (
              !action.trainingDate ||
              !action.workloadInMinutes ||
              !action.qntExpectedGraduates ||
              !action.qntFormedGifts ||
              !action.trainingModality
            ) {
              error = true;
              return;
            }
          } else {
            if (!action.detailingResult || !action.qntFormedGifts) {
              error = true;
              return;
            }
          }
        }
      }
    });

    if (error) {
      setModalStatus(false);
      setModalShowConfirm(true);
      setModalMessageError(`Existem campos que não foram preenchidos`);
      return;
    }

    let file = null;

    if (fileProve) {
      file = new FormData();
      file.append('file', fileProve);
    }

    const data = {
      month: report?.month,
      year: report?.year,
      actions: actions,
      file: file,
    };

    let response;
    if (step === 'edit') {
      response = await editMonthReport(report?.id, data);
    }

    if (response.status === 200 || response.status === 201) {
      setType('save');
      setModalStatus(true);
      setModalShowConfirm(true);
      setReport(response.data);
    } else {
      setModalMessageError(response.data.message);
      setModalStatus(false);
      setModalShowConfirm(true);
    }
  };

  const handleDeletePlan = async () => {
    const resp = await deleteMonthReport(report?.id);

    if (resp.status === 200 || resp.status === 201) {
      setType('delete');
      setModalStatus(true);
      // reload();
    } else {
      setModalMessageError(resp.data.message);
      setModalStatus(false);
    }
    setModalShowConfirm(true);
  };

  const handleSend = async () => {
    const resp = await sendMonthReport(report?.id);

    if (resp.status === 200 || resp.status === 201) {
      setType('send');
      setModalStatus(true);
      setModalShowConfirm(true);
      reload;
    } else {
      setModalMessageError(resp.data.message);
      setModalStatus(false);
      setModalShowConfirm(true);
    }
  };

  const onFileChange = (e) => {
    setFileProve(e.target.value);
  };

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <div>
          <strong>Bolsista</strong>
        </div>
        <InputGroup columns={'1fr 2fr 1fr'} paddingTop={'30px'} mobile={mobile}>
          <TextField
            fullWidth
            label="CPF"
            name="cpf"
            id="cpf"
            value={maskCPF(report?.scholar?.user?.cpf)}
            size="small"
            disabled={true}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="Nome Completo"
            name="name"
            id="name"
            value={report?.scholar?.user?.name}
            size="small"
            disabled={true}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormerInput>
            <div>Bolsista Formador?</div>
            <div>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    defaultChecked={report?.scholar?.isFormer}
                  />
                }
                label={report?.scholar?.isFormer ? 'Sim' : 'Não'}
                labelPlacement="start"
                disabled
              />
            </div>
          </FormerInput>
        </InputGroup>
      </Card>
      <Card style={{ marginTop: 30 }}>
        <div>
          <strong>Termo de Compromisso</strong>
        </div>
        <InputGroup columns={'1fr 1fr'} paddingTop={'30px'} mobile={mobile}>
          <TextField
            fullWidth
            label="Projeto"
            name="project"
            id="project"
            value={loadedTerm?.project}
            size="small"
            disabled={true}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </InputGroup>
        <InputGroup columns={'1fr 1fr'} paddingTop={'30px'} mobile={mobile}>
          <TextField
            fullWidth
            label="Regional"
            name="workUnit"
            id="workUnit"
            value={loadedTerm?.workUnit}
            size="small"
            disabled={true}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="Município"
            name="city"
            id="city"
            value={loadedTerm?.city}
            size="small"
            disabled={true}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </InputGroup>
        <InputGroup columns={'1fr 1fr'} paddingTop={'30px'} mobile={mobile}>
          <InputGroup columns={'1fr 1fr'} mobile={mobile}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={brLocale}
            >
              <DatePicker
                openTo="year"
                views={['year', 'month', 'day']}
                label="Data Inicio"
                value={loadedTerm?.startDate}
                onChange={() => null}
                disabled
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    size="small"
                    {...params}
                    sx={{ backgroundColor: '#FFF' }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={brLocale}
            >
              <DatePicker
                openTo="year"
                views={['year', 'month', 'day']}
                label="Data Fim"
                value={loadedTerm?.endDate}
                onChange={() => null}
                disabled
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    size="small"
                    {...params}
                    sx={{ backgroundColor: '#FFF' }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </InputGroup>
        </InputGroup>
      </Card>
      <div style={{ padding: 20 }}>
        <Title>Relatório Mensal</Title>
        <InfoReport mobile={mobile}>
          <div>
            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ width: 131, marginRight: 20 }}>
                <TextField
                  size="small"
                  value={getMonthsName(report?.month)}
                  label="Mês"
                  sx={{ backgroundColor: '#FFF' }}
                  disabled
                />
              </div>
              <div style={{ width: 131 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={report?.year}
                  label="Ano"
                  sx={{ backgroundColor: '#FFF' }}
                  disabled
                />
              </div>

              {step === 'send' && (
                <div style={{ marginLeft: 20 }}>
                  <ButtonWhite onClick={handlePrint}>
                    Exportar Relatório Mensal
                  </ButtonWhite>
                </div>
              )}
            </div>
          </div>
          <Status>
            {!mobile && <div></div>}
            <div
              style={{
                display: 'flex',
                flexDirection: mobile ? 'column' : 'row',
              }}
            >
              <StatusField
                status={report?.status}
                level={report?.levelApproveRegistration}
              />
              {report?.status === 'REPROVADO' && (
                <div
                  style={{
                    width: 40,
                    marginLeft: mobile ? 0 : '0.938rem',
                    marginTop: mobile ? '0.938rem' : 0,
                  }}
                >
                  <ButtonDefault
                    onClick={() => setModalShowJustificationReprove(true)}
                  >
                    <AiOutlineEye size={17} />
                  </ButtonDefault>
                </div>
              )}
            </div>
          </Status>
        </InfoReport>
      </div>
      <div style={{ padding: 20 }}>
        <Title>Cronograma</Title>
        <div style={{ marginTop: 25 }}>
          <TableResult
            actions={actions}
            edit={step === 'edit' ? true : false}
            actionsReport={[]}
            file={report?.actionDocument}
            changeFile={onFileChange}
            url={url}
          />
        </div>
      </div>
      {step === 'send' &&
        report?.status !== 'APROVADO' &&
        report?.status !== 'EM_VALIDACAO' && (
          <ButtonsSend
            handleSend={handleSend}
            changeStep={changeStep}
            send={report?.status === 'PENDENTE_ENVIO'}
          />
        )}
      {step === 'edit' && (
        <ButtonsEdit
          setModalShowWarningDeletePlan={setModalShowWarningDeletePlan}
          setModalShowWarningCancel={setModalShowWarningCancel}
          // isValid={isValid}
          handlePrint={handlePrint}
          reproved={report?.status === 'REPROVADO'}
        />
      )}
      {/* buttons */}
      {step === 'approve' && (
        <ButtonsApprove
          idReport={report?.id}
          statusReport={report?.status}
          level={report?.levelApproveRegistration}
          reload={reload}
        />
      )}
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false),
            modalStatus
              ? type === 'delete'
                ? Router.back()
                : Router.reload()
              : null;
        }}
        text={
          modalStatus
            ? type === 'delete'
              ? `Relatório excluído com sucesso!`
              : type === 'save'
              ? `Informações salvas com sucesso!`
              : `Relatório Enviado com sucesso!`
            : modalMessageError
        }
        status={modalStatus}
      />
      <ModalJustification
        show={modalShowJustify}
        onHide={() => {
          setModalShowJustify(false);
        }}
        text={
          report?.levelApproveRegistration === 'ESTADO'
            ? report?.validationHistoryState?.justificationReprove
            : report?.levelApproveRegistration === 'REGIONAL'
            ? report?.validationHistoryRegional?.justificationReprove
            : report?.validationHistoryCounty?.justificationReprove
        }
      />
      <ModalJustificationReprove
        show={modalShowJustificationReprove}
        onHide={() => {
          setModalShowJustificationReprove(false);
        }}
        text={
          'Você está prestes a reprovar o cadastro desse Bolsista. Por favor, digite abaixo a justificativa da reprovação.'
        }
        changeJustification={null}
        validationCounty={report?.validationHistoryCounty}
        validationRegional={report?.validationHistoryRegional}
        validationState={report?.validationHistoryState}
        edit={false}
        onConfirm={() => {
          setModalShowJustificationReprove(false);
        }}
      />
      <ModalPergunta
        show={modalShowWarningCancel}
        onHide={() => setModalShowWarningCancel(false)}
        onConfirm={() => {
          // resetForm(),
          //   changeEdit(false),
          setModalShowWarningCancel(false), Router.reload();
        }}
        buttonNo={'Não Descartar'}
        buttonYes={'Descartar'}
        text={`Atenção! Se voltar sem salvar, todas as suas modificações serão descartadas.`}
        status={false}
        warning={true}
        size="md"
      />
      <ModalPergunta
        show={modalShowWarningDeletePlan}
        onHide={() => setModalShowWarningDeletePlan(false)}
        onConfirm={() => {
          handleDeletePlan(), setModalShowWarningDeletePlan(false);
        }}
        buttonNo={'Não Excluir'}
        buttonYes={'Sim, tenho certeza'}
        text={`Atenção! Você está excluindo esse Relatório.
        Tem certeza que deseja continuar?`}
        status={false}
        warning={true}
        size="md"
      />
      <GeneratePdfMonthlyReport
        componentRef={componentRef}
        report={loadedReport}
        term={loadedTerm}
      />
    </form>
  );
}
