import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  Collapse,
  FormControlLabel,
  List,
  ListItemButton,
  ListItemText,
  Switch,
  TextField,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useAuth } from 'src/context/AuthContext';
import { ThemeContext } from 'src/context/ThemeContext';
import { Card, InputGroup } from 'src/shared/styledForms';
import brLocale from 'date-fns/locale/pt-BR';
import { StatusReport, maskCPF } from 'src/utils/masks';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import { AiOutlineEye } from 'react-icons/ai';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { TableSchedules } from '../TableSchedules';
import { ModalJustification } from '../ModalJustification';
import { ModalActionDetail } from '../ModalActionDetail';
import {
  createWorkPlan,
  deleteSchedule,
  deleteWorkPlan,
  editWorkPlan,
  ISchedule,
  sendWorkPlan,
} from 'src/services/plano-trabalho.service';
import ModalPergunta from 'src/components/modalPergunta';
import Router from 'next/router';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ButtonsEdit } from '../ButtonsEdit';
import { ButtonsSend } from '../ButtonsSend';
import { ButtonsDetails } from '../ButtonsDetails';
import { Status, Title } from './styledComponents';
import { ButtonsApprove } from '../ButtonsApprove';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import { useGeneratePdf } from 'src/utils/generatePdf';
import { GeneratePdfWorkPlan } from '../GeneratePdfWorkPlan';
import { FormerInput } from 'src/components/scholarshipPreRegistration/FormScholarshipPreRegistration/styledComponents';

interface IFormInputs {
  cpf: string;
  name: string;
  status: string;
  justification: string;
  generalObjectives: string;
  specificObjectives: string;
  schedules: ISchedule[];
}

const schema = yup.object().shape({
  justification: yup.string().required('Campo obrigatório'),
  generalObjectives: yup.string().required('Campo obrigatório'),
  specificObjectives: yup.string().required('Campo obrigatório'),
  schedules: yup.array().min(1, 'Campo obrigatório'),
});

export default function FormWorkPlan({
  loadedPlan,
  loadedTerm,
  edit,
  changeEdit,
  reload,
  send,
  changeSend,
  approve,
}) {
  const { user } = useAuth();
  const { mobile } = useContext(ThemeContext);

  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowWarningCancel, setModalShowWarningCancel] = useState(false);
  const [modalShowWarningDeletePlan, setModalShowWarningDeletePlan] =
    useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalMessageError, setModalMessageError] = useState('');
  const [type, setType] = useState(null);

  const [openJustify, setOpenJustify] = useState(false);
  const [openGeneral, setOpenGeneral] = useState(false);
  const [openSpecific, setOpenSpecific] = useState(false);
  const [modalShowJustify, setModalShowJustify] = useState(false);
  const [modalShowActionDetail, setModalShowActionDetail] = useState(false);
  const [plan, setPlan] = useState(loadedPlan);
  const [isDisabled, setIsDisabled] = useState(false);

  const { componentRef, handlePrint } = useGeneratePdf();

  useEffect(() => {
    setPlan(loadedPlan);
  }, [loadedPlan]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    defaultValues: {
      cpf: approve ? loadedPlan?.scholar?.cpf : user?.cpf,
      name: approve ? loadedPlan?.scholar?.name : user?.name,
      status: loadedPlan?.status ? loadedPlan?.status : 'PENDENTE_ENVIO',
      justification: loadedPlan?.justification ? loadedPlan?.justification : '',
      generalObjectives: loadedPlan?.generalObjectives
        ? loadedPlan?.generalObjectives
        : '',
      specificObjectives: loadedPlan?.specificObjectives
        ? loadedPlan?.specificObjectives
        : '',
      schedules: loadedPlan?.schedules ? loadedPlan?.schedules : [],
    },
    resolver: yupResolver(schema),
  });

  const [schedules, setSchedules] = useState(
    loadedPlan?.schedules ? loadedPlan?.schedules : [],
  );

  const [changedTable, setChangedTable] = useState(false);

  const onSubmit: SubmitHandler<IFormInputs> = async (data, e) => {
    e.preventDefault();
    setIsDisabled(true);

    let response;

    try {
      if (loadedPlan?.id) {
        response = await editWorkPlan(loadedPlan?.id, data);
      } else response = await createWorkPlan(data);
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }

    if (response.status === 200 || response.status === 201) {
      setType('save');
      setModalStatus(true);
      setModalShowConfirm(true);
      response.data?.status === 'PENDENTE_ENVIO'
        ? changeSend(true)
        : changeSend(false);
      changeEdit(false);
      reload();
      setPlan(response.data);
    } else {
      setModalMessageError(response.data.message);
      setModalStatus(false);
      setModalShowConfirm(true);
    }
  };

  const editDisabled = () => {
    if (
      (plan && plan.status === 'APROVADO') ||
      plan.status === 'EM_VALIDACAO'
    ) {
      return true;
    }
    return false;
  };

  const handleDeletePlan = async () => {
    setIsDisabled(true);
    let resp;
    try {
      resp = await deleteWorkPlan(loadedPlan?.id);
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }

    if (resp.status === 200 || resp.status === 201) {
      setType('delete');
      setModalStatus(true);
      reload();
    } else {
      setModalMessageError(resp.data.message);
      setModalStatus(false);
    }
    setModalShowConfirm(true);
  };

  const handleSend = async () => {
    setIsDisabled(true);
    let resp;
    try {
      resp = await sendWorkPlan(loadedPlan?.id);
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }

    if (resp.status === 200 || resp.status === 201) {
      setType('send');
      setModalStatus(true);
      setModalShowConfirm(true);
      reload();
    } else {
      setModalMessageError(resp.data.message);
      setModalStatus(false);
      setModalShowConfirm(true);
    }
  };

  const handleChangeSchedules = (schedule: ISchedule) => {
    const list = schedules;
    list.push(schedule);
    setValue('schedules', list, { shouldValidate: true });
    setSchedules(list);
    setChangedTable(!changedTable);
  };

  const handleRemoveSchedule = async (schedule: ISchedule) => {
    if (loadedPlan?.id) {
      const resp = await deleteSchedule(schedule?.id);

      if (resp.status === 200 || resp.status === 201) {
        setType('deleteSchedule');
        setModalStatus(true);
        setModalShowConfirm(true);
        const filter = schedules.filter((x) => x != schedule);
        setValue('schedules', filter, { shouldValidate: true });
        setSchedules(filter);
      } else {
        setModalMessageError(resp.data.message);
        setModalStatus(false);
        setModalShowConfirm(true);
      }
    } else {
      const filter = schedules.filter((x) => x != schedule);
      setValue('schedules', filter, { shouldValidate: true });
      setSchedules(filter);
    }
    setChangedTable(!changedTable);
  };

  const resetForm = () => {
    reset({
      justification: plan?.justification ? plan?.justification : '',
      generalObjectives: plan?.generalObjectives ? plan?.generalObjectives : '',
      specificObjectives: plan?.specificObjectives
        ? plan?.specificObjectives
        : '',
      schedules: plan?.schedules ? plan?.schedules : [],
    });
    setSchedules(plan?.schedules ? plan?.schedules : []);
    setChangedTable(!changedTable);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
            value={maskCPF(approve ? loadedPlan?.scholar?.cpf : user?.cpf)}
            size="small"
            disabled={true}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="Nome"
            name="name"
            id="name"
            value={approve ? loadedPlan?.scholar?.name : user?.name}
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
                    defaultChecked={
                      approve
                        ? loadedPlan?.scholar?.scholar?.isFormer
                        : user?.isFormer
                    }
                  />
                }
                label={
                  approve
                    ? loadedPlan?.scholar?.scholar?.isFormer
                    : user?.isFormer
                    ? 'Sim'
                    : 'Não'
                }
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
        <Title>Plano de Trabalho</Title>
        {!edit && (
          <>
            {mobile && (
              <div style={{ marginTop: 15, width: 160 }}>
                <ButtonWhite onClick={handlePrint}>
                  Exportar Plano de trabalho
                </ButtonWhite>
              </div>
            )}
            <Status>
              <div style={{ display: 'flex' }}>
                <div>
                  <TextField
                    label="Status"
                    name="status"
                    id="status"
                    value={StatusReport[plan?.status]}
                    size="small"
                    disabled={true}
                    sx={{ backgroundColor: '#fff' }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
                {plan?.status === 'REPROVADO' && (
                  <div style={{ width: 40, marginLeft: '0.938rem' }}>
                    <ButtonDefault onClick={() => setModalShowJustify(true)}>
                      <AiOutlineEye size={17} />
                    </ButtonDefault>
                  </div>
                )}
              </div>
              {!mobile && (
                <div>
                  <ButtonWhite onClick={handlePrint}>
                    Exportar Plano de trabalho
                  </ButtonWhite>
                </div>
              )}
            </Status>
          </>
        )}
      </div>
      <Card>
        <ListItemButton onClick={() => setOpenJustify(!openJustify)}>
          <ListItemText primary="Justificativa" />
          {openJustify ? <MdExpandLess /> : <MdExpandMore />}
        </ListItemButton>
        <Collapse in={openJustify} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Controller
              name="justification"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  minRows={5}
                  maxRows={8}
                  multiline
                  inputProps={{ maxLength: 3000 }}
                  label="Justificativa"
                  error={!!errors.justification}
                  disabled={!edit}
                  size="small"
                  helperText={
                    edit && errors.justification
                      ? errors.justification?.message
                      : ''
                  }
                  fullWidth
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
          </List>
        </Collapse>
      </Card>
      <Card style={{ marginTop: 25 }}>
        <ListItemButton onClick={() => setOpenGeneral(!openGeneral)}>
          <ListItemText primary="Objetivos Gerais" />
          {openGeneral ? <MdExpandLess /> : <MdExpandMore />}
        </ListItemButton>
        <Collapse in={openGeneral} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Controller
              name="generalObjectives"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  minRows={5}
                  maxRows={8}
                  multiline
                  inputProps={{ maxLength: 3000 }}
                  label="Objetivos Gerais"
                  error={!!errors.generalObjectives}
                  disabled={!edit}
                  size="small"
                  helperText={
                    edit && errors.generalObjectives
                      ? errors.generalObjectives?.message
                      : ''
                  }
                  fullWidth
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
          </List>
        </Collapse>
      </Card>
      <Card style={{ marginTop: 25 }}>
        <ListItemButton onClick={() => setOpenSpecific(!openSpecific)}>
          <ListItemText primary="Objetivos Específicos" />
          {openSpecific ? <MdExpandLess /> : <MdExpandMore />}
        </ListItemButton>
        <Collapse in={openSpecific} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Controller
              name="specificObjectives"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  minRows={5}
                  maxRows={8}
                  multiline
                  inputProps={{ maxLength: 3000 }}
                  label="Objetivos Específicos"
                  error={!!errors.specificObjectives}
                  disabled={!edit}
                  size="small"
                  helperText={
                    edit && errors.specificObjectives
                      ? errors.specificObjectives?.message
                      : ''
                  }
                  fullWidth
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
          </List>
        </Collapse>
      </Card>
      <div style={{ padding: 20 }}>
        <Title>Cronograma</Title>
        {edit && (
          <div style={{ width: 163, marginTop: 25 }}>
            <ButtonDefault onClick={() => setModalShowActionDetail(true)}>
              Adicionar Cronograma
            </ButtonDefault>
          </div>
        )}
        <div style={{ marginTop: 25 }}>
          <TableSchedules
            schedules={schedules}
            edit={
              edit &&
              (loadedPlan?.status === 'PENDENTE_ENVIO' ||
                loadedPlan?.status === 'REPROVADO' ||
                loadedPlan?.status === 'PENDENTE_VALIDACAO')
            }
            changeSchedules={handleRemoveSchedule}
            changedTable={changedTable}
            isUserFormer={
              approve ? loadedPlan?.scholar?.scholar?.isFormer : user?.isFormer
            }
          />
        </div>
      </div>
      {approve ? (
        <ButtonsApprove
          idPlan={loadedPlan?.id}
          statusPlan={loadedPlan?.status}
          reload={reload}
          isDisabled={isDisabled}
        />
      ) : (
        <>
          {edit ? (
            <ButtonsEdit
              havePlan={loadedPlan?.id ? true : false}
              setModalShowWarningDeletePlan={setModalShowWarningDeletePlan}
              setModalShowWarningCancel={setModalShowWarningCancel}
              isValid={isValid}
              isDisabled={isDisabled}
            />
          ) : (
            <>
              {send ? (
                <ButtonsSend
                  havePlan={loadedPlan?.id ? true : false}
                  changeEdit={changeEdit}
                  changeSend={changeSend}
                  handleSend={handleSend}
                  isDisabled={isDisabled}
                />
              ) : (
                <ButtonsDetails
                  changeEdit={changeEdit}
                  handleSend={handleSend}
                  status={loadedPlan?.status}
                  havePlan={loadedPlan?.id ? true : false}
                  isDisabled={isDisabled}
                />
              )}
            </>
          )}
        </>
      )}
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false), type === 'delete' && Router.reload();
        }}
        text={
          modalStatus
            ? type === 'delete'
              ? `Plano de Trabalho excluído com sucesso!`
              : type === 'save'
              ? `Informações salvas com sucesso!`
              : type === 'deleteSchedule'
              ? `Cronograma excluído com sucesso!`
              : `Plano de Trabalho Enviado com sucesso!`
            : modalMessageError
        }
        status={modalStatus}
      />
      <ModalJustification
        show={modalShowJustify}
        onHide={() => {
          setModalShowJustify(false);
        }}
        text={plan?.justificationReprove}
      />
      <ModalActionDetail
        show={modalShowActionDetail}
        onHide={() => {
          setModalShowActionDetail(false);
        }}
        schedules={null}
        edit={true}
        planId={loadedPlan?.id}
        changeSchedules={handleChangeSchedules}
        isUserFormer={
          approve ? loadedPlan?.scholar?.scholar?.isFormer : user?.isFormer
        }
      />
      <ModalPergunta
        show={modalShowWarningCancel}
        onHide={() => setModalShowWarningCancel(false)}
        onConfirm={() => {
          resetForm(),
            changeEdit(false),
            setModalShowWarningCancel(false),
            window.scrollTo(0, 0);
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
          handleDeletePlan(),
            setModalShowWarningDeletePlan(false),
            window.scrollTo(0, 0);
        }}
        buttonNo={'Não Excluir'}
        buttonYes={'Sim, tenho certeza'}
        text={`Atenção! Você está excluindo esse Plano de Trabalho.
        Tem certeza que deseja continuar?`}
        status={false}
        warning={true}
        size="md"
      />
      <GeneratePdfWorkPlan
        componentRef={componentRef}
        user={user}
        loadedPlan={loadedPlan}
        loadedTerm={loadedTerm}
        schedules={schedules}
        StatusName={StatusReport}
      />
    </form>
  );
}
