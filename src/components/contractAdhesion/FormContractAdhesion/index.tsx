import { Form } from 'react-bootstrap';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import { Card, ButtonGroupBetween, InputGroup } from 'src/shared/styledForms';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { useEffect, useState, useContext } from 'react';
import Router from 'next/router';
import ModalPergunta from 'src/components/modalPergunta';
import { TextField } from '@mui/material';
import { ThemeContext } from 'src/context/ThemeContext';
import brLocale from 'date-fns/locale/pt-BR';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from 'src/context/AuthContext';
import {
  IContractForm,
  createContract,
  editContract,
  inactvateContract,
} from 'src/services/contract';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import { AutoCompleteScholarTerm } from 'src/components/autoCompletPag/AutoCompleteScholarTerm';
import { add } from 'date-fns';
import ButtonVermelho from 'src/components/buttons/buttonVermelho';
import { isValidDate } from 'src/utils/validate';
import { maskCPF } from 'src/utils/masks';
import { ModalDelete } from 'src/components/modalDelete';
import { getScholarshipTerm } from 'src/services/bolsista.service';
import { useGeneratePdf } from 'src/utils/generatePdf';
import { GeneratePdfContract } from '../GeneratePdfContract';

const schemaSchedule = yup.object().shape({
  scholarId: yup.number().required('Campo obrigatório'),
  project: yup.string().required('Campo obrigatório'),
  workUnit: yup.string().required('Campo obrigatório').nullable(),
  city: yup.string().required('Campo obrigatório'),
  contractDescription: yup.string().required('Campo obrigatório'),
  axle: yup.string().required('Campo obrigatório').nullable(),
  startDate: yup.date().required('Campo obrigatório').nullable(),
  endDate: yup
    .date()
    .required('Campo obrigatório')
    .nullable()
    .when('startDate', (startDate) => {
      if (startDate && isValidDate(startDate)) {
        return yup.date().min(startDate, 'Data inferior que a de início');
      }
    }),
  extensionDate: yup
    .date()
    .nullable()
    .when('endDate', (endDate) => {
      if (endDate && isValidDate(endDate)) {
        return yup
          .date()
          .min(endDate, 'Data inferior que a de termino')
          .max(
            add(endDate, { years: 1 }),
            'Data não pode ser superior a 1 ano do término',
          )
          .nullable();
      }
    }),
  payingSource: yup.string().required('Campo obrigatório').nullable(),
  bagName: yup.string().required('Campo obrigatório').nullable(),
  weekHours: yup
    .number()
    .integer('O valor precisa ser um número inteiro')
    .required('Campo obrigatório')
    .nullable(),
  scholarshipValue: yup.number().required('Campo obrigatório').nullable(),
});

export default function FormContractAdhesion({ contract, edit, changeEdit }) {
  const { user } = useAuth();
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [modalShowWarningInactivate, setModalShowWarningInactivate] =
    useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalMessage, setModalMessage] = useState('');
  const { mobile } = useContext(ThemeContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedScholar, setSelectedScholar] = useState(null);

  const { componentRef, handlePrint } = useGeneratePdf();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IContractForm>({
    defaultValues: {
      scholarId: contract ? contract.scholarId : null,
      project: contract ? contract.project : '',
      workUnit: contract ? contract.workUnit : '',
      city: contract ? contract.city : '',
      contractDescription: contract ? contract.contractDescription : '',
      axle: contract ? contract.axle : '',
      startDate: contract ? contract.startDate : null,
      endDate: contract ? contract.endDate : null,
      extensionDate: contract ? contract.extensionDate : null,
      payingSource: contract ? contract.payingSource : '',
      bagName: contract ? contract.bagName : '',
      weekHours: contract ? contract.weekHours : null,
      scholarshipValue: contract
        ? contract.scholarshipValueInCents / 100
        : null,
    },
    resolver: yupResolver(schemaSchedule),
  });

  const onSubmit: SubmitHandler<IContractForm> = async (data, e) => {
    e.preventDefault();

    setIsDisabled(true);

    let response = null;
    try {
      if (contract) response = await editContract(contract?.id, data);
      else response = await createContract(data);
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }

    if (response.status === 200 || response.status === 201) {
      setModalStatus(true);
      setModalShowConfirm(true);
      setModalMessage(
        `Termo ${contract ? 'editado' : 'adicionado'} com sucesso!`,
      );
    } else {
      setModalMessage(response.data.message);
      setModalStatus(false);
      setModalShowConfirm(true);
    }
  };

  useEffect(() => {
    if (!contract && user) {
      setValue('workUnit', user?.regionalPartner?.name);
    }
  }, [user]);

  const findScholar = async () => {
    // setIsLoading(true);
    const params = {
      search: contract?.scholar?.user?.name,
      page: 1,
      limit: 99999999,
      order: 'ASC',
      active: 1,
    };
    const resp = await getScholarshipTerm(params);

    if (resp?.items) {
      const find = resp?.items?.find(
        (item) => item.user?.id === contract?.scholar?.user?.id,
      );
      if (find) setSelectedScholar(find);
    }

    // setIsLoading(false);
  };

  useEffect(() => {
    if (contract && edit) {
      findScholar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, edit]);

  const handleChangeScholar = (newValue) => {
    setSelectedScholar(newValue);
    setValue('scholarId', newValue?.id);
    setValue('axle', newValue?.axle);
    setValue('city', newValue?.user?.city);
  };

  const handleInactivate = async () => {
    let response = null;
    try {
      response = await inactvateContract(contract?.id);
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }

    if (response.status === 200 || response.status === 201) {
      setModalStatus(true);
      setModalShowConfirm(true);
      setModalMessage('Termo desativado com sucesso!');
    } else {
      setModalMessage(response.data.message);
      setModalStatus(false);
      setModalShowConfirm(true);
    }
  };

  return (
    <>
      <Card>
        <div className="mb-3">
          <strong>{contract ? 'Termo de compromisso' : 'Novo Termo'}</strong>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {contract && !edit ? (
            <InputGroup mobile={mobile} columns={'1fr 3fr'} paddingTop={'30px'}>
              <TextField
                label="CPF"
                size="small"
                fullWidth
                value={maskCPF(contract?.scholar?.user?.cpf)}
                sx={{ backgroundColor: '#fff' }}
                disabled={true}
              />
              <TextField
                label="Nome"
                size="small"
                fullWidth
                value={contract?.scholar?.user?.name}
                sx={{ backgroundColor: '#fff' }}
                disabled={true}
              />
            </InputGroup>
          ) : (
            <InputGroup mobile={mobile} columns={'1fr'} paddingTop={'30px'}>
              <div>
                <AutoCompleteScholarTerm
                  scholar={selectedScholar}
                  changeScholar={handleChangeScholar}
                  error={errors.scholarId}
                  disable={!edit}
                />
              </div>
            </InputGroup>
          )}
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <div>
              <Controller
                name="project"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Projeto"
                    error={!!errors.project}
                    size="small"
                    helperText={errors.project ? errors.project?.message : ''}
                    fullWidth
                    sx={{ backgroundColor: '#fff' }}
                    disabled={!edit}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="axle"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Eixo"
                    error={!!errors.axle}
                    size="small"
                    helperText={errors.axle ? errors.axle?.message : ''}
                    fullWidth
                    sx={{ backgroundColor: '#fff' }}
                    disabled
                  />
                )}
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
              <Controller
                name="workUnit"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Regional"
                    error={!!errors.workUnit}
                    size="small"
                    helperText={errors.workUnit ? errors.workUnit?.message : ''}
                    fullWidth
                    disabled
                    sx={{ backgroundColor: '#fff' }}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Município"
                    error={!!errors.city}
                    size="small"
                    helperText={errors.city ? errors.city?.message : ''}
                    fullWidth
                    disabled
                    sx={{ backgroundColor: '#fff' }}
                  />
                )}
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
              <Controller
                name="contractDescription"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descrição do Contrato"
                    error={!!errors.contractDescription}
                    size="small"
                    minRows={4}
                    maxRows={4}
                    multiline
                    inputProps={{ maxLength: 300 }}
                    helperText={
                      errors.contractDescription
                        ? errors.contractDescription?.message
                        : ''
                    }
                    fullWidth
                    sx={{ backgroundColor: '#fff' }}
                    disabled={!edit}
                  />
                )}
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
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    locale={brLocale}
                  >
                    <DatePicker
                      {...field}
                      openTo="year"
                      views={['year', 'month', 'day']}
                      label="Data início"
                      disabled={!edit}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          size="small"
                          {...params}
                          sx={{ backgroundColor: '#FFF' }}
                          error={!!errors.startDate}
                          helperText={
                            errors.startDate
                              ? errors.startDate?.type === 'typeError'
                                ? 'Data inválida'
                                : errors.startDate?.message
                              : ''
                          }
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>
            <div>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    locale={brLocale}
                  >
                    <DatePicker
                      {...field}
                      openTo="year"
                      views={['year', 'month', 'day']}
                      label="Data Término"
                      disabled={!edit}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          size="small"
                          {...params}
                          sx={{ backgroundColor: '#FFF' }}
                          error={!!errors.endDate}
                          helperText={
                            errors.endDate
                              ? errors.endDate?.type === 'typeError'
                                ? 'Data inválida'
                                : errors.endDate?.message
                              : ''
                          }
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>
            <div>
              <Controller
                name="extensionDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    locale={brLocale}
                  >
                    <DatePicker
                      {...field}
                      openTo="year"
                      views={['year', 'month', 'day']}
                      label="Data Prorrogação"
                      disabled={!edit}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          size="small"
                          {...params}
                          sx={{ backgroundColor: '#FFF' }}
                          error={!!errors.extensionDate}
                          helperText={
                            errors.extensionDate
                              ? errors.extensionDate?.type === 'typeError'
                                ? 'Data inválida'
                                : errors.extensionDate?.message
                              : ''
                          }
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
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
              <Controller
                name="payingSource"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fonte Pagadora"
                    error={!!errors.payingSource}
                    size="small"
                    helperText={
                      errors.payingSource ? errors.payingSource?.message : ''
                    }
                    fullWidth
                    sx={{ backgroundColor: '#fff' }}
                    disabled={!edit}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="bagName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome da Bolsa"
                    error={!!errors.bagName}
                    size="small"
                    helperText={errors.bagName ? errors.bagName?.message : ''}
                    fullWidth
                    sx={{ backgroundColor: '#fff' }}
                    disabled={!edit}
                  />
                )}
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
              <Controller
                name="weekHours"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Horas Semanais"
                    error={!!errors.weekHours}
                    size="small"
                    helperText={
                      errors.weekHours
                        ? errors.weekHours?.type === 'typeError'
                          ? 'O valor precisa ser um número inteiro'
                          : errors.weekHours?.message
                        : ''
                    }
                    fullWidth
                    sx={{ backgroundColor: '#fff' }}
                    disabled={!edit}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="scholarshipValue"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value?.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                    onChange={(e) => {
                      field.onChange(
                        Number(e.target.value.replace(/\D/g, '')) / 100,
                      );
                    }}
                    label="Valor da Bolsa"
                    error={!!errors.scholarshipValue}
                    size="small"
                    helperText={
                      errors.scholarshipValue
                        ? errors.scholarshipValue?.type === 'typeError'
                          ? 'O valor precisa ser um número'
                          : errors.scholarshipValue?.message
                        : ''
                    }
                    fullWidth
                    sx={{ backgroundColor: '#fff' }}
                    disabled={!edit}
                  />
                )}
              />
            </div>
          </InputGroup>
          <ButtonGroupBetween
            mobile={mobile}
            border={true}
            style={{ marginTop: 30 }}
          >
            <div>
              <div className="d-flex">
                {contract?.status === 'PENDENTE_ASSINATURA' && (
                  <div style={{ width: 147 }}>
                    <ButtonVermelho
                      onClick={(e) => {
                        e.preventDefault();
                        setModalShowWarningInactivate(true);
                      }}
                    >
                      Desativar Termo
                    </ButtonVermelho>
                  </div>
                )}
                {contract && (
                  <div className="ms-3" style={{ width: 147 }}>
                    <ButtonWhite type="button" onClick={handlePrint}>
                      Exportar PDF
                    </ButtonWhite>
                  </div>
                )}
              </div>
            </div>
            {edit ? (
              <div className="d-flex" style={{ marginTop: mobile ? 20 : 0 }}>
                <div style={{ width: 147 }}>
                  <ButtonWhite
                    onClick={(e) => {
                      e.preventDefault();
                      setModalShowWarning(true);
                    }}
                    disable={isDisabled}
                  >
                    Cancelar
                  </ButtonWhite>
                </div>
                <div className="ms-3" style={{ width: 147 }}>
                  <ButtonDefault
                    type="submit"
                    disable={isDisabled}
                    onClick={() => {
                      null;
                    }}
                  >
                    Salvar
                  </ButtonDefault>
                </div>
              </div>
            ) : (
              <>
                {contract?.status === 'PENDENTE_ASSINATURA' && (
                  <div style={{ width: 147, marginTop: mobile ? 20 : 0 }}>
                    <ButtonDefault
                      type="button"
                      onClick={() => {
                        changeEdit();
                      }}
                    >
                      Editar
                    </ButtonDefault>
                  </div>
                )}
              </>
            )}
          </ButtonGroupBetween>
          {/* )} */}
        </Form>
      </Card>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false), modalStatus && Router.reload();
        }}
        text={modalMessage}
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowWarning}
        onHide={() => setModalShowWarning(false)}
        onConfirm={() => Router.back()}
        buttonNo={'Não Descartar'}
        buttonYes={'Descartar'}
        text={`Atenção! Se voltar sem salvar, todas as suas modificações serão descartadas.`}
        status={false}
        warning={true}
        size="md"
      />
      <ModalDelete
        show={modalShowWarningInactivate}
        onHide={() => setModalShowWarningInactivate(false)}
        onConfirm={() => handleInactivate()}
        buttonNo={'Não Desativar'}
        buttonYes={'Sim, Tenho Certeza'}
        text={`Atenção! Você está desativando esse Termo de Compromisso. Tem certeza que deseja continuar?`}
        size="md"
      />
      <GeneratePdfContract componentRef={componentRef} contract={contract} />
    </>
  );
}
