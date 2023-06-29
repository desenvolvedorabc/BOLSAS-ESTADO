import { Form } from 'react-bootstrap';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import { Card, ButtonGroupBetween, InputGroup } from 'src/shared/styledForms';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { useEffect, useState, useContext } from 'react';
import Router from 'next/router';
import ModalPergunta from 'src/components/modalPergunta';
import { getRegionais, IGetRegional } from 'src/services/regionais.service';
import {
  Autocomplete,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material';
import { ThemeContext } from 'src/context/ThemeContext';
import { maskCPF, maskPhone } from 'src/utils/masks';
import { isValidCPF } from 'src/utils/validate';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  createPreScholarship,
  IPreScholarshipForm,
} from 'src/services/bolsista.service';
import { FormerInput } from './styledComponents';
import { useAuth } from 'src/context/AuthContext';

const schemaSchedule = yup.object().shape({
  name: yup
    .string()
    .required('Campo obrigatório')
    .min(6, 'Deve ter no mínimo 6 caracteres'),
  email: yup
    .string()
    .email('Email com formato inválido')
    .required('Campo obrigatório'),
  cpf: yup
    .string()
    .required('Campo obrigatório')
    .test(
      'Documento com formato inválido',
      'Documento com formato inválido',
      (cpf) => isValidCPF(cpf ? cpf : ''),
    )
    .nullable(),
  telephone: yup
    .string()
    .required('Campo obrigatório')
    .min(14, 'Telefone com formato inválido')
    .max(14, 'Telefone com formato inválido')
    .nullable(),
  axle: yup.string().required('Campo obrigatório'),
  city: yup.string().required('Campo obrigatório').nullable(),
  idRegional: yup.string().required('Campo obrigatório').nullable(),
});

export default function FormScholarshipPreRegistration() {
  const { user } = useAuth();
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalMessageError, setModalMessageError] = useState('');
  const { mobile } = useContext(ThemeContext);
  const [listRegionais, setListRegionais] = useState([]);
  const [selectedRegional, setSelectedRegional] = useState(
    user?.regionalPartner,
  );
  const [listCity, setListCity] = useState(
    user?.regionalPartner ? user?.regionalPartner?.cities : [],
  );
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    loadRegionais();
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IPreScholarshipForm>({
    defaultValues: {
      name: '',
      email: '',
      cpf: '',
      telephone: '',
      axle: '',
      city: user?.city,
      idRegional: user?.regionalPartner?.id,
      isFormer: false,
    },
    resolver: yupResolver(schemaSchedule),
  });

  const onSubmit: SubmitHandler<IPreScholarshipForm> = async (data, e) => {
    e.preventDefault();

    data.cpf = data?.cpf?.replace(/\D/g, '');
    data.telephone = data?.telephone?.replace(/\D/g, '');
    data.idRegional = Number(data?.idRegional);
    setIsDisabled(true);

    let response = null;
    try {
      response = await createPreScholarship(data);
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }

    // const response = await createPreScholarship(data);

    if (response.status === 200 || response.status === 201) {
      setModalStatus(true);
      setModalShowConfirm(true);
    } else {
      setModalMessageError(response.data.message);
      setModalStatus(false);
      setModalShowConfirm(true);
    }
  };

  const loadRegionais = async () => {
    const data: IGetRegional = {
      page: 1,
      limit: 999999,
      order: 'ASC',
      status: 1,
    };
    const resp = await getRegionais(data);

    if (resp.data?.items) {
      setListRegionais(resp?.data?.items);
    }
  };

  const handleChangeRegional = (newValue) => {
    setValue('idRegional', newValue?.id);
    setSelectedRegional(newValue);
    setValue('city', null);
    if (newValue?.cities) setListCity(newValue?.cities);
    else setListCity([]);
  };

  useEffect(() => {
    setValue('city', user?.city);
    setSelectedRegional(user?.regionalPartner);
  }, [listRegionais, user]);

  return (
    <>
      <Card>
        <div className="mb-3">
          <strong>Novo Bolsista</strong>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div>Dados Pessoais</div>
          <InputGroup mobile={mobile} columns={'1fr 1fr'} paddingTop={'30px'}>
            <div>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome"
                    error={!!errors.name}
                    size="small"
                    helperText={errors.name ? errors.name?.message : ''}
                    fullWidth
                    sx={{ backgroundColor: '#fff' }}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    error={!!errors.email}
                    size="small"
                    helperText={errors.email ? errors.email?.message : ''}
                    fullWidth
                    sx={{ backgroundColor: '#fff' }}
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
                name="cpf"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={maskCPF(field.value)}
                    label="CPF"
                    error={!!errors.cpf}
                    size="small"
                    helperText={errors.cpf ? errors.cpf?.message : ''}
                    fullWidth
                    inputProps={{ maxLength: 14 }}
                    sx={{ backgroundColor: '#fff' }}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="telephone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={maskPhone(field.value)}
                    label="Telefone"
                    error={!!errors.telephone}
                    size="small"
                    inputProps={{ maxLength: 14 }}
                    helperText={
                      errors.telephone ? errors.telephone?.message : ''
                    }
                    fullWidth
                    sx={{ backgroundColor: '#fff' }}
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
                  />
                )}
              />
            </div>
            {!mobile && <div></div>}
            <div>
              <Autocomplete
                id="size-small-outlined"
                size="small"
                noOptionsText="Selecione uma Regional"
                value={selectedRegional}
                options={listRegionais}
                getOptionLabel={(option) => option.name}
                onChange={(_event, newValue) => {
                  handleChangeRegional(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    {...params}
                    label="Regional"
                    error={!!errors.idRegional}
                    helperText={
                      errors.idRegional ? errors.idRegional?.message : ''
                    }
                  />
                )}
                disabled
              />
            </div>
            <div>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    id="size-small-outlined"
                    size="small"
                    noOptionsText="Selecione um Município"
                    value={field.value}
                    options={listCity}
                    onChange={(_event, newValue) => {
                      field.onChange(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...params}
                        label="Município"
                        error={!!errors.city}
                        helperText={errors.city ? errors.city?.message : ''}
                      />
                    )}
                    disabled={user?.access_profile?.role === 'MUNICIPIO'}
                  />
                )}
              />
            </div>
            <FormerInput>
              <div>Bolsista Formador?</div>
              <div>
                <Controller
                  name="isFormer"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      // value={field.value}
                      {...field}
                      control={<Switch color="primary" />}
                      label={field.value ? 'Sim' : 'Não'}
                      labelPlacement="start"
                    />
                  )}
                />
              </div>
            </FormerInput>
          </InputGroup>
          <ButtonGroupBetween
            border={true}
            style={{ marginTop: 30 }}
            mobile={mobile}
          >
            {!mobile && <div></div>}
            <div className="d-flex">
              <div style={{ width: 137 }}>
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
            </div>
          </ButtonGroupBetween>
        </Form>
      </Card>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false), modalStatus && Router.reload();
        }}
        text={
          modalStatus ? `Bolsista adicionado com sucesso!` : modalMessageError
        }
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
    </>
  );
}
