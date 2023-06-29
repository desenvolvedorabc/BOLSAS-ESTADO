import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import { Card, ButtonGroupBetween, InputGroup } from 'src/shared/styledForms';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ErrorText from 'src/components/ErrorText';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { useEffect, useState, useContext } from 'react';
import Router from 'next/router';
import ModalPergunta from 'src/components/modalPergunta';
import { Autocomplete, TextField } from '@mui/material';
import { ThemeContext } from 'src/context/ThemeContext';
import {
  maskAccount,
  maskAgency,
  maskCEP,
  maskCPF,
  maskPhone,
} from 'src/utils/masks';
import { isValidDate } from 'src/utils/validate';
import InputFile from 'src/components/InputFile';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  createCompleteScholarship,
  editCompleteScholarship,
  IScholarshipForm,
  sendCompleteScholarship,
} from 'src/services/bolsista.service';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR';
import { completeCEP } from 'src/utils/combos';
import { ButtonDownload } from './styledComponents';
import { MdOutlineDownload } from 'react-icons/md';
import { StatusField } from '../StatusField';
import { ModalJustificationReprove } from '../ModalJustificationReprove';

const schemaSchedule = yup.object().shape({
  rg: yup.string().required('Campo obrigatório').nullable(),
  sex: yup.string().required('Campo obrigatório').nullable(),
  axle: yup.string().required('Campo obrigatório').nullable(),
  maritalStatus: yup.string().required('Campo obrigatório').nullable(),
  dateOfBirth: yup
    .string()
    .required('Campo obrigatório')
    .nullable()
    .test('Data inválida', (dateOfBirth) => {
      return isValidDate(dateOfBirth);
    }),
  motherName: yup.string().required('Campo obrigatório').nullable(),
  fatherName: yup.string().required('Campo obrigatório').nullable(),
  cep: yup
    .string()
    .required('Campo obrigatório')
    .min(9, 'Deve ter no mínimo 8 caracteres')
    .max(9, 'Deve ter no máximo 8 caracteres')
    .nullable(),
  state: yup.string().required('Campo obrigatório').nullable(),
  city: yup.string().required('Campo obrigatório').nullable(),
  address: yup.string().required('Campo obrigatório').nullable(),
  bank: yup
    .string()
    .required('Campo obrigatório')
    .min(3, 'Deve ter no mínimo 3 caracteres')
    .max(3, 'Deve ter no máximo 3 caracteres')
    .nullable(),
  agency: yup.string().required('Campo obrigatório').nullable(),
  accountNumber: yup.string().required('Campo obrigatório').nullable(),
  accountType: yup.string().required('Campo obrigatório').nullable(),
  trainingArea: yup.string().required('Campo obrigatório').nullable(),
  highestDegree: yup.string().required('Campo obrigatório').nullable(),
  employmentRelationship: yup.string().required('Campo obrigatório').nullable(),
  instituteOfOrigin: yup.string().required('Campo obrigatório').nullable(),
  functionalStatus: yup.string().required('Campo obrigatório').nullable(),
  bagDescription: yup.string().required('Campo obrigatório').nullable(),
  locationDevelopWorkPlan: yup
    .string()
    .required('Campo obrigatório')
    .nullable(),
  agreementOfTheEducationNetwork: yup
    .string()
    .required('Campo obrigatório')
    .nullable(),
});

export default function FormScholarshipRegistration({
  scholarship,
  user,
  edit,
  changeEdit,
  url,
}) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalMessageError, setModalMessageError] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const { mobile } = useContext(ThemeContext);
  const [fileRg, setFileRg] = useState(null);
  const [errorFileRg, setErrorFileRg] = useState(null);
  const [fileCpf, setFileCpf] = useState(null);
  const [errorFileCpf, setErrorFileCpf] = useState(null);
  const [fileCurrentAccount, setFileCurrentAccount] = useState(null);
  const [errorFileCurrentAccount, setErrorFileCurrentAccount] = useState(null);
  const [fileCurriculumVitae, setFileCurriculumVitae] = useState(null);
  const [errorFileCurriculumVitae, setErrorFileCurriculumVitae] =
    useState(null);
  const [fileHigherTitle, setFileHigherTitle] = useState(null);
  const [errorFileHigherTitle, setErrorFileHigherTitle] = useState(null);
  const [fileProofOfAddress, setFileProofOfAddress] = useState(null);
  const [errorFileProofOfAddress, setErrorFileProofOfAddress] = useState(null);
  const [fileMedicalCertificate, setFileMedicalCertificate] = useState(null);
  const [errorFileMedicalCertificate, setErrorFileMedicalCertificate] =
    useState(null);
  const [inputedCep, setInputedCep] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [modalShowJustificationReprove, setModalShowJustificationReprove] =
    useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IScholarshipForm>({
    defaultValues: {
      rg: scholarship?.rg,
      sex: scholarship?.sex,
      axle: scholarship?.axle,
      maritalStatus: scholarship?.maritalStatus,
      dateOfBirth: scholarship?.dateOfBirth,
      motherName: scholarship?.motherName,
      fatherName: scholarship?.fatherName,
      cep: scholarship?.cep,
      state: scholarship?.state,
      city: scholarship?.city,
      address: scholarship?.address,
      bank: scholarship?.bank,
      agency: scholarship?.agency,
      accountNumber: scholarship?.accountNumber,
      accountType: scholarship?.accountType,
      trainingArea: scholarship?.trainingArea,
      highestDegree: scholarship?.highestDegree,
      employmentRelationship: scholarship?.employmentRelationship,
      instituteOfOrigin: scholarship?.instituteOfOrigin,
      functionalStatus: scholarship?.functionalStatus,
      bagDescription: scholarship?.bagDescription,
      locationDevelopWorkPlan: scholarship?.locationDevelopWorkPlan,
      agreementOfTheEducationNetwork:
        scholarship?.agreementOfTheEducationNetwork,
    },
    resolver: yupResolver(schemaSchedule),
  });

  const onSubmit: SubmitHandler<IScholarshipForm> = async (data, e) => {
    setIsDisabled(true);
    e.preventDefault();

    let error = false;
    const formData = new FormData();
    if (fileRg) {
      formData.append('copyRgFrontAndVerse', fileRg);
      setErrorFileRg(null);
    } else if (!scholarship?.copyRgFrontAndVerse) {
      setErrorFileRg('Campo Obrigatório');
      error = true;
    }
    if (fileCpf) {
      formData.append('copyCpfFrontAndVerse', fileCpf);
      setErrorFileCpf(null);
    } else if (!scholarship?.copyCpfFrontAndVerse) {
      setErrorFileCpf('Campo Obrigatório');
      error = true;
    }
    if (fileCurrentAccount) {
      formData.append('currentAccountCopy', fileCurrentAccount);
      setErrorFileCurrentAccount(null);
    } else if (!scholarship?.currentAccountCopy) {
      setErrorFileCurrentAccount('Campo Obrigatório');
      error = true;
    }
    if (fileCurriculumVitae) {
      formData.append('curriculumVitae', fileCurriculumVitae);
      setErrorFileCurriculumVitae(null);
    } else if (!scholarship?.curriculumVitae) {
      setErrorFileCurriculumVitae('Campo Obrigatório');
      error = true;
    }
    if (fileHigherTitle) {
      formData.append('copyHigherTitle', fileHigherTitle);
      setErrorFileHigherTitle(null);
    } else if (!scholarship?.copyHigherTitle) {
      setErrorFileHigherTitle('Campo Obrigatório');
      error = true;
    }
    if (fileProofOfAddress) {
      formData.append('proofOfAddress', fileProofOfAddress);
      setErrorFileProofOfAddress(null);
    } else if (!scholarship?.proofOfAddress) {
      setErrorFileProofOfAddress('Campo Obrigatório');
      error = true;
    }
    if (fileMedicalCertificate) {
      formData.append('medicalCertificate', fileMedicalCertificate);
      setErrorFileMedicalCertificate(null);
    } else if (!scholarship?.medicalCertificate) {
      setErrorFileMedicalCertificate('Campo Obrigatório');
      error = true;
    }

    if (error) {
      setIsDisabled(false);
      return;
    }

    data.agency = data?.agency?.replace(/\D/g, '');
    data.accountNumber = data?.accountNumber?.replace(/\D/g, '');

    Object.keys(data).map(function (key) {
      formData.append(key, data[key]);
    });

    let response;

    try {
      if (scholarship?.registrationLevel === 'CADASTRO_COMPLETO') {
        response = await editCompleteScholarship(scholarship?.id, formData);
      } else response = await createCompleteScholarship(formData);
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }

    if (response.status === 200 || response.status === 201) {
      setModalStatus(true);
      setModalShowConfirm(true);
      setModalMessage(`As informações foram salvas com sucesso!`);
    } else {
      setModalMessageError(response.data.message);
      setModalStatus(false);
      setModalShowConfirm(true);
    }
  };

  const handleSend = async () => {
    const resp = await sendCompleteScholarship();

    if (resp.status === 200 || resp.status === 201) {
      setModalStatus(true);
      setModalShowConfirm(true);
      setModalMessage(
        `O formulário foi enviado para aprovação com sucesso! Aguarde para a análise.`,
      );
    } else {
      setModalMessageError(resp.data.message);
      setModalStatus(false);
      setModalShowConfirm(true);
    }
  };

  const onFileRgChange = (e) => {
    setFileRg(e.target.value);
  };

  const onFileCpfChange = (e) => {
    setFileCpf(e.target.value);
  };

  const onFileCurrentAccountChange = (e) => {
    setFileCurrentAccount(e.target.value);
  };

  const onFileCurriculumVitaeChange = (e) => {
    setFileCurriculumVitae(e.target.value);
  };

  const onFileHigherTitleChange = (e) => {
    setFileHigherTitle(e.target.value);
  };

  const onFileProofOfAddressChange = (e) => {
    setFileProofOfAddress(e.target.value);
  };

  const onFileMedicalCertificateChange = (e) => {
    setFileMedicalCertificate(e.target.value);
  };

  useEffect(() => {
    async function fetchAPI() {
      const resp = await completeCEP(inputedCep);
      if (resp && !resp?.erro) {
        setValue('state', resp?.uf);
        setValue('city', resp?.localidade);
        setValue('address', resp?.logradouro);
      }
    }
    fetchAPI();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputedCep]);

  enum AccountTypeEnum {
    POUPANCA = 'Poupança',
    CORRENTE = 'Corrente',
  }

  const getAxleDisabled = () => {
    if (edit) if (!scholarship?.axle) return false;

    return true;
  };

  return (
    <>
      <div className="mb-3" style={{ fontSize: 21 }}>
        <strong>Dados Pessoais</strong>
      </div>
      {scholarship?.registrationLevel === 'CADASTRO_COMPLETO' && (
        <div style={{ display: 'flex', marginBottom: 20 }}>
          <div style={{ marginRight: 20 }}>
            <StatusField scholarship={scholarship} />
          </div>
          {scholarship?.statusRegistration === 'REPROVADO' && (
            <div style={{ width: 200 }}>
              <ButtonWhite
                onClick={() => setModalShowJustificationReprove(true)}
                type="button"
              >
                Motivo da reprovação
              </ButtonWhite>
            </div>
          )}
        </div>
      )}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <InputGroup mobile={mobile} columns={'1fr 1fr'}>
            <div>
              <TextField
                value={user?.name}
                label="Nome"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
            <div>
              <TextField
                value={user?.email}
                label="Email"
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
                value={user?.cpf ? maskCPF(user?.cpf) : ''}
                label="CPF"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
            <div>
              <TextField
                value={
                  user?.telephone ? maskPhone(user?.telephone) : user?.telephone
                }
                label="Telefone"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
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
                    disabled={getAxleDisabled()}
                    sx={{ backgroundColor: '#fff' }}
                  />
                )}
              />
            </div>
            {!mobile && <div></div>}
            <div>
              <TextField
                value={user?.regionalPartner?.name}
                size="small"
                label="Regional"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
            <div>
              <TextField
                value={user?.city}
                size="small"
                label="Município"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
          </InputGroup>
        </Card>
        <Card style={{ marginTop: 20 }}>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr 1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <Controller
              name="rg"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="RG"
                  error={!!errors.rg}
                  size="small"
                  helperText={errors.rg ? errors.rg?.message : ''}
                  fullWidth
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
            <Controller
              name="sex"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  id="size-small-outlined"
                  size="small"
                  noOptionsText="Sexo"
                  value={field.value}
                  options={['Masculino', 'Feminino', 'Outro']}
                  onChange={(_event, newValue) => {
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Sexo"
                      error={!!errors.sex}
                      helperText={errors.sex ? errors.sex?.message : ''}
                    />
                  )}
                  disabled={!edit}
                />
              )}
            />
            <Controller
              name="maritalStatus"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  id="size-small-outlined"
                  size="small"
                  noOptionsText="Estado Civil"
                  value={field.value}
                  options={[
                    'Solteiro',
                    'Casado',
                    'Separado',
                    'Divorciado',
                    'Viúvo',
                  ]}
                  onChange={(_event, newValue) => {
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Estado Civil"
                      error={!!errors.maritalStatus}
                      helperText={
                        errors.maritalStatus
                          ? errors.maritalStatus?.message
                          : ''
                      }
                    />
                  )}
                  disabled={!edit}
                />
              )}
            />
            <Controller
              name="dateOfBirth"
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
                    label="Data de Nascimento"
                    disabled={!edit}
                    onChange={(val) => {
                      field.onChange(val);
                    }}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        size="small"
                        {...params}
                        sx={{ backgroundColor: '#FFF' }}
                        error={!!errors.dateOfBirth}
                        helperText={
                          errors.dateOfBirth
                            ? errors.dateOfBirth?.message ===
                              'dateOfBirth is invalid'
                              ? 'Data inválida'
                              : errors.dateOfBirth?.message
                            : ''
                        }
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <Controller
              name="motherName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome da Mãe"
                  error={!!errors.motherName}
                  size="small"
                  helperText={
                    errors.motherName ? errors.motherName?.message : ''
                  }
                  fullWidth
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
            <Controller
              name="fatherName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome do Pai"
                  error={!!errors.fatherName}
                  size="small"
                  helperText={
                    errors.fatherName ? errors.fatherName?.message : ''
                  }
                  fullWidth
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr 1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <Controller
              name="cep"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={(e) => {
                    field.onChange(maskCEP(e.target.value)),
                      setInputedCep(e.target.value);
                  }}
                  value={maskCEP(field.value)}
                  label="CEP"
                  error={!!errors.cep}
                  size="small"
                  helperText={errors.cep ? errors.cep?.message : ''}
                  fullWidth
                  inputProps={{ maxLength: 9 }}
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Estado"
                  error={!!errors.state}
                  size="small"
                  helperText={errors.state ? errors.state?.message : ''}
                  fullWidth
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                  InputLabelProps={{
                    shrink: !!field.value,
                  }}
                />
              )}
            />
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cidade"
                  error={!!errors.city}
                  size="small"
                  helperText={errors.city ? errors.city?.message : ''}
                  fullWidth
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                  InputLabelProps={{
                    shrink: !!field.value,
                  }}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Endereço"
                  error={!!errors.address}
                  size="small"
                  helperText={errors.address ? errors.address?.message : ''}
                  fullWidth
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                  InputLabelProps={{
                    shrink: !!field.value,
                  }}
                />
              )}
            />
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr 1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <Controller
              name="bank"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Banco"
                  error={!!errors.bank}
                  size="small"
                  helperText={errors.bank ? errors.bank?.message : ''}
                  fullWidth
                  inputProps={{ maxLength: 3 }}
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
            <Controller
              name="agency"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={maskAgency(field.value)}
                  label="Agência"
                  error={!!errors.agency}
                  size="small"
                  helperText={errors.agency ? errors.agency?.message : ''}
                  fullWidth
                  inputProps={{ maxLength: 6 }}
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
            <Controller
              name="accountNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={maskAccount(field.value)}
                  label="Número da Conta"
                  error={!!errors.accountNumber}
                  size="small"
                  helperText={
                    errors.accountNumber ? errors.accountNumber?.message : ''
                  }
                  fullWidth
                  inputProps={{ maxLength: 13 }}
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
            <Controller
              name="accountType"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  id="size-small-outlined"
                  size="small"
                  noOptionsText="Tipo de conta"
                  value={field.value}
                  options={Object.keys(AccountTypeEnum)}
                  getOptionLabel={(option) => AccountTypeEnum[option]}
                  onChange={(_event, newValue) => {
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Tipo de conta"
                      error={!!errors.accountType}
                      helperText={
                        errors.accountType ? errors.accountType?.message : ''
                      }
                    />
                  )}
                  disabled={!edit}
                />
              )}
            />
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr 1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <Controller
              name="trainingArea"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Área de Formação"
                  error={!!errors.trainingArea}
                  size="small"
                  helperText={
                    errors.trainingArea ? errors.trainingArea?.message : ''
                  }
                  fullWidth
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
            <Controller
              name="highestDegree"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Titulação Mais Elevada"
                  error={!!errors.highestDegree}
                  size="small"
                  helperText={
                    errors.highestDegree ? errors.highestDegree?.message : ''
                  }
                  fullWidth
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
            <Controller
              name="employmentRelationship"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Vinculo Empregatício"
                  error={!!errors.employmentRelationship}
                  size="small"
                  helperText={
                    errors.employmentRelationship
                      ? errors.employmentRelationship?.message
                      : ''
                  }
                  fullWidth
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
            <Controller
              name="instituteOfOrigin"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Instituto de Origem"
                  error={!!errors.instituteOfOrigin}
                  size="small"
                  helperText={
                    errors.instituteOfOrigin
                      ? errors.instituteOfOrigin?.message
                      : ''
                  }
                  fullWidth
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 3fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <Controller
              name="functionalStatus"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Situação Funcional"
                  error={!!errors.functionalStatus}
                  size="small"
                  helperText={
                    errors.functionalStatus
                      ? errors.functionalStatus?.message
                      : ''
                  }
                  fullWidth
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
            <Controller
              name="bagDescription"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descrição da Bolsa"
                  error={!!errors.bagDescription}
                  size="small"
                  helperText={
                    errors.bagDescription ? errors.bagDescription?.message : ''
                  }
                  fullWidth
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <Controller
              name="locationDevelopWorkPlan"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Local Onde Desenvolverá o Plano de Trabalho"
                  error={!!errors.locationDevelopWorkPlan}
                  size="small"
                  helperText={
                    errors.locationDevelopWorkPlan
                      ? errors.locationDevelopWorkPlan?.message
                      : ''
                  }
                  fullWidth
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
            <Controller
              name="agreementOfTheEducationNetwork"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Concordância da Rede de Ensino"
                  error={!!errors.agreementOfTheEducationNetwork}
                  size="small"
                  helperText={
                    errors.agreementOfTheEducationNetwork
                      ? errors.agreementOfTheEducationNetwork?.message
                      : ''
                  }
                  fullWidth
                  disabled={!edit}
                  sx={{ backgroundColor: '#fff' }}
                />
              )}
            />
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr 1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <div>
              <div style={{ height: mobile ? 'auto' : 58 }}>
                RG (Frente e Verso)
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  <InputFile
                    label="Upload do Arquivo"
                    onChange={(e) => onFileRgChange(e)}
                    error={!!errorFileRg}
                    acceptFile={'*'}
                    disabled={!edit}
                  />
                  {errorFileRg ? <ErrorText>{errorFileRg}</ErrorText> : null}
                </div>
                {scholarship?.copyRgFrontAndVerse && (
                  <OverlayTrigger
                    key={'toolTip_Arq'}
                    placement={'bottom'}
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        {scholarship?.copyRgFrontAndVerse}
                      </Tooltip>
                    }
                  >
                    <ButtonDownload
                      href={`${url}/scholars/files/${scholarship?.copyRgFrontAndVerse}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MdOutlineDownload size={20} />
                    </ButtonDownload>
                  </OverlayTrigger>
                )}
              </div>
            </div>
            <div>
              <div style={{ height: mobile ? 'auto' : 58 }}>
                CPF (Frente e Verso)
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  <InputFile
                    label="Upload do Arquivo"
                    onChange={(e) => onFileCpfChange(e)}
                    error={!!errorFileCpf}
                    acceptFile={'*'}
                    disabled={!edit}
                  />
                  {errorFileCpf ? <ErrorText>{errorFileCpf}</ErrorText> : null}
                </div>
                {scholarship?.copyCpfFrontAndVerse && (
                  <OverlayTrigger
                    key={'toolTip_Arq'}
                    placement={'bottom'}
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        {scholarship?.copyCpfFrontAndVerse}
                      </Tooltip>
                    }
                  >
                    <ButtonDownload
                      href={`${url}/scholars/files/${scholarship?.copyCpfFrontAndVerse}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MdOutlineDownload size={20} />
                    </ButtonDownload>
                  </OverlayTrigger>
                )}
              </div>
            </div>
            <div>
              <div style={{ height: mobile ? 'auto' : 58 }}>
                Cópia da Conta Corrente / Conta Poupança
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  <InputFile
                    label="Upload do Arquivo"
                    onChange={(e) => onFileCurrentAccountChange(e)}
                    error={!!errorFileCurrentAccount}
                    acceptFile={'*'}
                    disabled={!edit}
                  />
                  {errorFileCurrentAccount ? (
                    <ErrorText>{errorFileCurrentAccount}</ErrorText>
                  ) : null}
                </div>
                {scholarship?.currentAccountCopy && (
                  <OverlayTrigger
                    key={'toolTip_Arq'}
                    placement={'bottom'}
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        {scholarship?.currentAccountCopy}
                      </Tooltip>
                    }
                  >
                    <ButtonDownload
                      href={`${url}/scholars/files/${scholarship?.currentAccountCopy}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MdOutlineDownload size={20} />
                    </ButtonDownload>
                  </OverlayTrigger>
                )}
              </div>
            </div>
            <div>
              <div style={{ height: mobile ? 'auto' : 58 }}>
                Curriculum Vitae
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  <InputFile
                    label="Upload do Arquivo"
                    onChange={(e) => onFileCurriculumVitaeChange(e)}
                    error={!!errorFileCurriculumVitae}
                    acceptFile={'*'}
                    disabled={!edit}
                  />
                  {errorFileCurriculumVitae ? (
                    <ErrorText>{errorFileCurriculumVitae}</ErrorText>
                  ) : null}
                </div>
                {scholarship?.curriculumVitae && (
                  <OverlayTrigger
                    key={'toolTip_Arq'}
                    placement={'bottom'}
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        {scholarship?.curriculumVitae}
                      </Tooltip>
                    }
                  >
                    <ButtonDownload
                      href={`${url}/scholars/files/${scholarship?.curriculumVitae}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MdOutlineDownload size={20} />
                    </ButtonDownload>
                  </OverlayTrigger>
                )}
              </div>
            </div>
            <div>
              <div style={{ marginBottom: 20 }}>Cópia da maior titulação </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  <InputFile
                    label="Upload do Arquivo"
                    onChange={(e) => onFileHigherTitleChange(e)}
                    error={!!errorFileHigherTitle}
                    acceptFile={'*'}
                    disabled={!edit}
                  />
                  {errorFileHigherTitle ? (
                    <ErrorText>{errorFileHigherTitle}</ErrorText>
                  ) : null}
                </div>
                {scholarship?.copyHigherTitle && (
                  <OverlayTrigger
                    key={'toolTip_Arq'}
                    placement={'bottom'}
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        {scholarship?.copyHigherTitle}
                      </Tooltip>
                    }
                  >
                    <ButtonDownload
                      href={`${url}/scholars/files/${scholarship?.copyHigherTitle}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MdOutlineDownload size={20} />
                    </ButtonDownload>
                  </OverlayTrigger>
                )}
              </div>
            </div>
            <div>
              <div style={{ marginBottom: 20 }}>Comprovante de Residência</div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  <InputFile
                    label="Upload do Arquivo"
                    onChange={(e) => onFileProofOfAddressChange(e)}
                    error={!!errorFileProofOfAddress}
                    acceptFile={'*'}
                    disabled={!edit}
                  />
                  {errorFileProofOfAddress ? (
                    <ErrorText>{errorFileProofOfAddress}</ErrorText>
                  ) : null}
                </div>
                {scholarship?.proofOfAddress && (
                  <OverlayTrigger
                    key={'toolTip_Arq'}
                    placement={'bottom'}
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        {scholarship?.proofOfAddress}
                      </Tooltip>
                    }
                  >
                    <ButtonDownload
                      href={`${url}/scholars/files/${scholarship?.proofOfAddress}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MdOutlineDownload size={20} />
                    </ButtonDownload>
                  </OverlayTrigger>
                )}
              </div>
            </div>
            <div>
              <div style={{ marginBottom: 20 }}>Atestado Médico</div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  <InputFile
                    label="Upload do Arquivo"
                    onChange={(e) => onFileMedicalCertificateChange(e)}
                    error={!!errorFileMedicalCertificate}
                    acceptFile={'*'}
                    disabled={!edit}
                  />
                  {errorFileMedicalCertificate ? (
                    <ErrorText>{errorFileMedicalCertificate}</ErrorText>
                  ) : null}
                </div>
                {scholarship?.medicalCertificate && (
                  <OverlayTrigger
                    key={'toolTip_Arq'}
                    placement={'bottom'}
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        {scholarship?.medicalCertificate}
                      </Tooltip>
                    }
                  >
                    <ButtonDownload
                      href={`${url}/scholars/files/${scholarship?.medicalCertificate}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MdOutlineDownload size={20} />
                    </ButtonDownload>
                  </OverlayTrigger>
                )}
              </div>
            </div>
          </InputGroup>
        </Card>
        <ButtonGroupBetween
          border={true}
          style={{ marginTop: 30 }}
          mobile={mobile}
        >
          {!mobile && <div></div>}
          <div className="d-flex">
            {edit ? (
              <div className="ms-3" style={{ width: 137 }}>
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
            ) : (
              <div style={{ display: 'flex' }}>
                {scholarship?.statusRegistration !== 'EM_VALIDACAO' &&
                  scholarship?.statusRegistration !== 'APROVADO' && (
                    <>
                      <div style={{ width: 137, marginRight: 25 }}>
                        <ButtonWhite
                          type="button"
                          disable={isDisabled}
                          onClick={() => {
                            changeEdit(true);
                          }}
                        >
                          Editar
                        </ButtonWhite>
                      </div>
                      <div style={{ width: 163 }}>
                        <ButtonDefault
                          disable={
                            scholarship?.statusRegistration ===
                              'PENDENTE_VALIDACAO' ||
                            scholarship?.statusRegistration === 'REPROVADO' ||
                            isDisabled
                          }
                          onClick={() => {
                            setModalShowWarning(true);
                          }}
                        >
                          Enviar para aprovação
                        </ButtonDefault>
                      </div>
                    </>
                  )}
              </div>
            )}
          </div>
        </ButtonGroupBetween>
      </Form>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false), modalStatus && Router.reload();
        }}
        text={modalStatus ? modalMessage : modalMessageError}
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowWarning}
        onHide={() => setModalShowWarning(false)}
        onConfirm={handleSend}
        buttonNo={'Não, desejo voltar'}
        buttonYes={'Sim, Desejo Enviar'}
        text={`Você está prestes a enviar esse formulário para aprovação. Tem certeza que deseja prosseguir? `}
        status={false}
        warning={true}
        size="md"
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
        validationCounty={scholarship?.validationHistoryCounty}
        validationRegional={scholarship?.validationHistoryRegional}
        edit={false}
        onConfirm={() => {
          setModalShowJustificationReprove(false);
        }}
      />
    </>
  );
}
