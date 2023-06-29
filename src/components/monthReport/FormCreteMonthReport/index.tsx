/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { FormControlLabel, Switch, TextField } from '@mui/material';
import { useAuth } from 'src/context/AuthContext';
import { ThemeContext } from 'src/context/ThemeContext';
import { Card, InputGroup } from 'src/shared/styledForms';
import brLocale from 'date-fns/locale/pt-BR';
import { maskCPF } from 'src/utils/masks';
import ModalPergunta from 'src/components/modalPergunta';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { Title } from './styledComponents';
import { createMonthReport } from 'src/services/relatorio-mensal.service';
import { ButtonsCreate } from '../ButtonsCreate';
import { getMonthsName } from 'src/utils/anos';
import Router from 'next/router';
import { TableResultCreate } from '../TableResultCreate';
import { FormerInput } from 'src/components/scholarshipPreRegistration/FormScholarshipPreRegistration/styledComponents';
import { useContext, useEffect, useState } from 'react';

type Props = {
  actions: any[] | any;
  loadedTerm: any;
  year: number | any;
  month: number | any;
};

export default function FormCreateMonthReport({
  actions = null,
  loadedTerm,
  month,
  year,
}: Props) {
  const { user } = useAuth();
  const { mobile } = useContext(ThemeContext);

  const [ModalShowError, setModalShowError] = useState(false);
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowWarningCancel, setModalShowWarningCancel] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalMessageError, setModalMessageError] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [fileProve, setFileProve] = useState(null);
  const [newReportId, setNewReportId] = useState(null);

  const [actionsReport, setActionsReport] = useState([]);
  useEffect(() => {
    const list = [];
    if (!actions?.message) {
      actions?.map((_action) => {
        list.push({
          scheduleWorkPlanId: _action.id,
          detailing: null,
          detailingResult: null,
          workloadInMinutes: 0,
          qntExpectedGraduates: 0,
          qntFormedGifts: 0,
          trainingModality: null,
          trainingDate: null,
          status: _action.status,
          isFormer: _action.isFormer,
        });
      });
    } else {
      setModalShowError(true);
    }

    setActionsReport(list);
  }, [actions]);

  const onSubmit = async (e) => {
    e.preventDefault();

    let error = false;

    actionsReport.forEach((action) => {
      if (!action.detailing) {
        error = true;
      } else {
        if (action.status === 'CONCLUIDO') {
          if (action?.isFormer) {
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
      month: month,
      year: year,
      actions: actionsReport,
      file: file,
    };

    let response;

    try {
      response = await createMonthReport(data);
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }

    if (response.status === 200 || response.status === 201) {
      setModalStatus(true);
      setModalShowConfirm(true);
      setModalMessageError(`As informações foram salvas com sucesso!`);
      setNewReportId(response?.data?.monthlyReport?.id);
    } else {
      setModalMessageError(response.data.message);
      setModalStatus(false);
      setModalShowConfirm(true);
    }
  };

  const onFileChange = (e) => {
    setFileProve(e.target.value);
  };

  return (
    <form onSubmit={(e) => onSubmit(e)}>
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
            value={maskCPF(user?.cpf)}
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
            value={user?.name}
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
                  <Switch color="primary" defaultChecked={user?.isFormer} />
                }
                label={user?.isFormer ? 'Sim' : 'Não'}
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
        <div>
          <div style={{ display: 'flex', marginTop: 30 }}>
            <div style={{ width: 131, marginRight: 20 }}>
              <TextField
                size="small"
                label="Mês"
                value={getMonthsName(month)}
                sx={{ backgroundColor: '#FFF' }}
                disabled={true}
              />
            </div>
            <div style={{ width: 131 }}>
              <TextField
                size="small"
                label="Ano"
                value={year}
                sx={{ backgroundColor: '#FFF' }}
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <Title>Cronograma</Title>
        <div style={{ marginTop: 25 }}>
          <TableResultCreate
            actions={actions}
            edit={true}
            changeFile={onFileChange}
            actionsReport={actionsReport}
          />
        </div>
      </div>
      <ButtonsCreate
        setModalShowWarningCancel={setModalShowWarningCancel}
        isValid={isDisabled || actions?.length === 0}
      />
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false);
          modalStatus &&
            Router.push(
              `/painel/${user?.partner_state?.slug}/relatorio-mensal/${newReportId}`,
            );
        }}
        text={
          modalStatus ? `Informações salvas com sucesso!` : modalMessageError
        }
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowWarningCancel}
        onHide={() => setModalShowWarningCancel(false)}
        onConfirm={() => {
          setModalShowWarningCancel(false), window.scrollTo(0, 0);
        }}
        buttonNo={'Não Descartar'}
        buttonYes={'Descartar'}
        text={`Atenção! Se voltar sem salvar, todas as suas modificações serão descartadas.`}
        status={false}
        warning={true}
        size="md"
      />
      <ModalConfirmacao
        show={ModalShowError}
        onHide={() => {
          setModalShowError(false);
          Router.back();
        }}
        text={actions?.message}
        status={false}
      />
    </form>
  );
}
