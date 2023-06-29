import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import { Card, ButtonGroupBetween, InputGroup } from 'src/shared/styledForms';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ErrorText from 'src/components/ErrorText';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { useEffect, useState, useContext } from 'react';
import Router from 'next/router';
import ModalPergunta from 'src/components/modalPergunta';
import { getRegionais, IGetRegional } from 'src/services/regionais.service';
import ButtonVermelho from 'src/components/buttons/buttonVermelho';
import {
  Autocomplete,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material';
import { ThemeContext } from 'src/context/ThemeContext';
import { maskCPF, maskPhone } from 'src/utils/masks';
import { isValidCPF } from 'src/utils/validate';
import InputFile from 'src/components/InputFile';
import { getPerfisEditUser } from 'src/services/perfis.service';
import {
  createUser,
  editUser,
  inactivateUser,
} from 'src/services/usuarios.service';
import { FormerInput } from 'src/components/scholarshipPreRegistration/FormScholarshipPreRegistration/styledComponents';
import { editScholarWithUser } from 'src/services/bolsista.service';
import ModalConfirmation from 'src/components/modalConfirmation';
import { useAuth } from 'src/context/AuthContext';

type ValidationErrors = Partial<{
  name: string;
  email: string;
  cpf: string;
  telephone: string;
  city: string;
  idRegional: string;
  idAccessProfile: string;
}>;

export default function FormEditUsuario({ usuario, scholar }) {
  const { user } = useAuth();
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalMessageError, setModalMessageError] = useState('');
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] =
    useState(false);
  const [modalShowQuestionBolsista, setModalShowQuestionBolsista] =
    useState(false);
  const [active, setActive] = useState(usuario?.active);
  const { mobile } = useContext(ThemeContext);
  const [avatar, setAvatar] = useState(null);
  const [listRegionais, setListRegionais] = useState([]);
  const [selectedRegional, setSelectedRegional] = useState(
    usuario?.regionalPartner ? usuario?.regionalPartner : user?.regionalPartner,
  );
  const [listCity, setListCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState(
    usuario?.city ? usuario?.city : user?.city,
  );
  const [listPerfis, setListPerfis] = useState([]);
  const [selectedPerfil, setSelectedPerfil] = useState(usuario?.access_profile);
  const { state } = useContext(ThemeContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabledRegional, setIsDisabledRegional] = useState(false);
  const [isDisabledCity, setIsDisabledCity] = useState(true);
  const [changeBolsista, setChangeBolsista] = useState(false);
  const [isFormer, setIsFormer] = useState(false);

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

  const loadPerfis = async () => {
    const resp = await getPerfisEditUser({
      search: null,
      page: 1,
      limit: 99999,
      order: 'ASC',
      accessProfileRole: null,
      status: 1,
      forApproveScholar: usuario?.subRole === 'BOLSISTA' ? true : null,
    });

    if (resp.data?.items) {
      setListPerfis(resp?.data?.items);
    }
  };

  useEffect(() => {
    loadRegionais();
    loadPerfis();
    if (usuario?.regionalPartner) {
      setListCity(usuario?.regionalPartner?.cities);
    }
  }, [usuario]);

  useEffect(() => {
    if (selectedPerfil?.role === 'ESTADO' || usuario?.subRole === 'BOLSISTA') {
      setIsDisabledRegional(true);
    } else {
      if (user?.access_profile?.role === 'REGIONAL') {
        setIsDisabledRegional(true);
        setSelectedRegional(user?.regionalPartner);
        if (user?.regionalPartner?.cities)
          setListCity(user?.regionalPartner?.cities);
        setIsDisabledCity(false);
      } else if (user?.access_profile?.role === 'MUNICIPIO') {
        setIsDisabledRegional(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const validate = (values) => {
    const errors: ValidationErrors = {};
    if (!values?.name?.trim()) {
      errors.name = 'Campo obrigatório';
    }
    if (!values.email) {
      errors.email = 'Campo obrigatório';
    } else if (
      // eslint-disable-next-line no-useless-escape
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.email,
      )
    ) {
      errors.email = 'Email com formato inválido';
    }
    if (!values.cpf) {
      errors.cpf = 'Campo obrigatório';
    } else if (!isValidCPF(values.cpf)) {
      errors.cpf = 'Documento com formato inválido';
    }
    if (!values?.telephone) {
      errors.telephone = 'Campo obrigatório';
    } else if (values?.telephone?.length != 14) {
      errors.telephone = 'Telefone com formato inválido';
    }
    if (
      selectedPerfil?.role != 'ESTADO' &&
      selectedPerfil?.role != 'REGIONAL' &&
      !values?.city
    ) {
      errors.city = 'Campo obrigatório';
    }
    if (selectedPerfil?.role != 'ESTADO' && !values?.idRegional) {
      errors.idRegional = 'Campo obrigatório';
    }
    if (!values?.idAccessProfile && !changeBolsista) {
      errors.idAccessProfile = 'Campo obrigatório';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: usuario?.name,
      email: usuario?.email,
      cpf: maskCPF(usuario?.cpf),
      telephone: maskPhone(usuario?.telephone),
      idPartnerState: usuario?.partner_state?.id
        ? usuario?.partner_state?.id
        : state?.id,
      city: usuario?.city,
      idRegional: usuario?.regionalPartner?.id
        ? usuario?.regionalPartner?.id
        : user?.regionalPartner?.id,
      idAccessProfile: usuario?.access_profile?.id,
      axle: scholar?.axle,
    },
    validate,
    onSubmit: async (values) => {
      setIsDisabled(true);

      const data = {
        ...values,
        cpf: values?.cpf?.replace(/\D/g, ''),
        telephone: values?.telephone?.replace(/\D/g, ''),
      };

      let response;

      try {
        if (usuario) {
          if (usuario?.subRole === 'BOLSISTA') {
            response = await editScholarWithUser(
              scholar?.id,
              scholar?.userId,
              data,
              avatar,
            );
          } else {
            response = await editUser(
              usuario?.id,
              data,
              avatar,
              changeBolsista,
              isFormer,
            );
          }
        } else response = await createUser(data, avatar);
      } catch (err) {
        setIsDisabled(false);
      } finally {
        setIsDisabled(false);
      }

      if (response?.status === 200 || response?.status === 201) {
        setModalStatus(true);
        setModalShowConfirm(true);
      } else {
        setModalMessageError(response?.data.message);
        setModalStatus(false);
        setModalShowConfirm(true);
      }
    },
  });

  async function changeUser() {
    let response;
    if (usuario?.subRole === 'BOLSISTA') {
      response = await inactivateUser(usuario.id);
    } else {
      setModalShowQuestion(false);
      const data = {
        active: !usuario.active,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      response = await editUser(usuario.id, data, null, false, false);
    }
    if (response.status === 200 || response.status === 201) {
      setActive(usuario?.active);
      setModalStatus(true);
      setModalShowConfirmQuestion(true);
    } else {
      setModalStatus(false);
      setModalShowConfirmQuestion(true);
    }
  }

  const onFileChange = (e) => {
    setAvatar(e.target.value);
  };

  const handleChangeRegional = (newValue) => {
    formik.setFieldValue('idRegional', newValue?.id);
    setSelectedRegional(newValue);
    formik.setFieldValue('city', null);
    handleChangeCity(null);
    if (newValue?.cities) setListCity(newValue?.cities);
    else setListCity([]);

    if (
      newValue !== null &&
      newValue !== undefined &&
      selectedPerfil?.role !== 'REGIONAL'
    )
      setIsDisabledCity(false);
    else {
      setIsDisabledCity(true);
    }
  };

  useEffect(() => {
    formik.validateForm();
  }, [selectedRegional]);

  const handleChangeCity = (newValue) => {
    formik.setFieldValue('city', newValue);
    setSelectedCity(newValue);
  };

  const handleChangePerfil = (newValue) => {
    formik.setFieldValue('idAccessProfile', newValue?.id);
    setSelectedPerfil(newValue);
    setChangeBolsista(false);
    setIsFormer(false);
    if (newValue?.role === 'ESTADO' && usuario?.subRole !== 'BOLSISTA') {
      formik.setFieldValue('idRegional', null);
      setSelectedRegional(null);
      formik.setFieldValue('city', null);
      setSelectedCity(null);
      setIsDisabledRegional(true);
      setIsDisabledCity(true);
    }
    if (newValue?.role === 'REGIONAL' && usuario?.subRole !== 'BOLSISTA') {
      formik.setFieldValue('city', null);
      setSelectedCity(null);
      setIsDisabledRegional(false);
      setIsDisabledCity(true);
    }
    if (newValue?.role === 'MUNICIPIO' && usuario?.subRole !== 'BOLSISTA') {
      setIsDisabledRegional(false);
      if (selectedRegional) setIsDisabledCity(false);
      else setIsDisabledCity(true);
    }
  };

  useEffect(() => {
    formik.validateForm();
  }, [selectedPerfil]);

  const handleChangeBolsista = (e) => {
    setChangeBolsista(e.target.checked);
    if (!e.target.checked) setIsFormer(false);
  };

  useEffect(() => {
    formik.validateForm();
  }, [changeBolsista]);

  const handleChangeIsFormer = (e) => {
    setIsFormer(e.target.checked);
  };

  const showChangeScholar = () => {
    if (usuario) {
      if (
        (user?.access_profile?.role === 'ESTADO' ||
          user?.access_profile?.role === 'REGIONAL') &&
        usuario?.subRole !== 'BOLSISTA'
      ) {
        if (
          user?.access_profile?.role === 'ESTADO' &&
          selectedPerfil?.role !== 'REGIONAL'
        ) {
          return false;
        }

        return true;
      }
    }

    return false;
  };

  return (
    <>
      <Card>
        <div className="mb-3">
          <strong>{usuario ? 'Editar' : 'Adicionar'} Novo Usuário</strong>
        </div>
        <Form onSubmit={formik.handleSubmit}>
          <div>Dados Pessoais</div>
          <InputGroup mobile={mobile} columns={'1fr 1fr'} paddingTop={'30px'}>
            <div>
              <TextField
                fullWidth
                label="Nome"
                name="name"
                id="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                size="small"
                disabled={scholar}
              />
              {formik.errors.name ? (
                <ErrorText>{formik.errors.name}</ErrorText>
              ) : null}
            </div>
            <div>
              <TextField
                fullWidth
                label="Email"
                name="email"
                id="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.errors.email ? (
                <ErrorText>{formik.errors.email}</ErrorText>
              ) : null}
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
                fullWidth
                label="CPF"
                name="cpf"
                id="cpf"
                value={maskCPF(formik.values.cpf)}
                onChange={formik.handleChange}
                size="small"
                disabled={usuario?.subRole === 'BOLSISTA'}
              />
              {formik.errors.cpf ? (
                <ErrorText>{formik.errors.cpf}</ErrorText>
              ) : null}
            </div>
            <div>
              <TextField
                fullWidth
                label="Telefone"
                inputProps={{ maxLength: 14 }}
                name="telephone"
                id="telephone"
                value={maskPhone(formik.values.telephone)}
                onChange={formik.handleChange}
                size="small"
              />
              {formik.errors.telephone ? (
                <ErrorText>{formik.errors.telephone}</ErrorText>
              ) : null}
            </div>
            <div>
              <Autocomplete
                id="size-small-outlined"
                size="small"
                noOptionsText="Selecione uma Regional"
                value={selectedRegional}
                options={listRegionais}
                getOptionLabel={(option) => option.name}
                // isOptionEqualToValue={(option, value) =>
                //   option?.id === value?.id
                // }
                onChange={(_event, newValue) => {
                  handleChangeRegional(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Regional" />
                )}
                disabled={isDisabledRegional}
              />
              {formik.errors.idRegional ? (
                <ErrorText>{formik.errors.idRegional}</ErrorText>
              ) : null}
            </div>
            <div>
              <Autocomplete
                id="size-small-outlined"
                size="small"
                noOptionsText="Selecione um Município"
                value={selectedCity}
                options={listCity}
                onChange={(_event, newValue) => {
                  handleChangeCity(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Município" />
                )}
                disabled={isDisabledCity}
              />
              {formik.errors.city ? (
                <ErrorText>{formik.errors.city}</ErrorText>
              ) : null}
            </div>
          </InputGroup>
          <InputGroup
            columns={'1fr 1fr 1fr 1fr'}
            mobile={mobile}
            paddingTop={'30px'}
          >
            <div>
              <div style={{ marginBottom: 20 }}>Foto de Perfil</div>
              <div>
                <InputFile
                  label="Foto de Perfil"
                  onChange={(e) => onFileChange(e)}
                  error={formik.touched.image_profile}
                  acceptFile={'image/*'}
                />
              </div>
            </div>
            <div>
              <div style={{ marginBottom: 20 }}>Perfil de Acesso</div>
              <div>
                <Autocomplete
                  id="size-small-outlined"
                  size="small"
                  noOptionsText="Selecione um perfil"
                  value={selectedPerfil}
                  options={listPerfis}
                  getOptionLabel={(option) => option.name}
                  onChange={(_event, newValue) => {
                    handleChangePerfil(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Perfil de Acesso"
                    />
                  )}
                />
                {formik.errors.idAccessProfile ? (
                  <ErrorText>{formik.errors.idAccessProfile}</ErrorText>
                ) : null}
              </div>
            </div>
            {showChangeScholar() && (
              <>
                <div>
                  <div style={{ marginBottom: 20 }}>
                    Configuração de Usuário
                  </div>
                  <FormerInput>
                    <div>É Bolsista?</div>
                    <div>
                      <FormControlLabel
                        control={
                          <Switch color="primary" defaultChecked={false} />
                        }
                        label={changeBolsista ? 'Sim' : 'Não'}
                        labelPlacement="start"
                        onChange={(e: React.SyntheticEvent) => {
                          handleChangeBolsista(e);
                        }}
                      />
                    </div>
                  </FormerInput>
                </div>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    marginTop: mobile ? 0 : 44,
                  }}
                >
                  <FormerInput style={{ width: '100%' }}>
                    <div>Bolsista Formador?</div>
                    <div>
                      <FormControlLabel
                        control={
                          <Switch color="primary" defaultChecked={false} />
                        }
                        label={isFormer ? 'Sim' : 'Não'}
                        labelPlacement="start"
                        onChange={(e: React.SyntheticEvent) => {
                          handleChangeIsFormer(e);
                        }}
                        checked={isFormer}
                        disabled={!changeBolsista}
                      />
                    </div>
                  </FormerInput>
                </div>
              </>
            )}
            {scholar && (
              <div style={{ display: 'flex', marginTop: 44 }}>
                <TextField
                  fullWidth
                  label="Eixo"
                  name="axle"
                  id="axle"
                  value={formik.values.axle}
                  onChange={formik.handleChange}
                  size="small"
                />
                {formik.errors.axle ? (
                  <ErrorText>{formik.errors.axle}</ErrorText>
                ) : null}
              </div>
            )}
          </InputGroup>
          <ButtonGroupBetween
            border={true}
            style={{ marginTop: 30 }}
            mobile={mobile}
          >
            {!mobile && (
              <>
                {usuario ? (
                  <div style={{ width: 137 }}>
                    {usuario?.active ? (
                      <ButtonVermelho
                        disable={isDisabled}
                        onClick={(e) => {
                          e.preventDefault();
                          setModalShowQuestion(true);
                        }}
                      >
                        Desativar
                      </ButtonVermelho>
                    ) : (
                      <>
                        {usuario?.subRole !== 'BOLSISTA' && (
                          <ButtonDefault
                            disable={isDisabled}
                            onClick={(e) => {
                              e.preventDefault();
                              setModalShowQuestion(true);
                            }}
                          >
                            Ativar
                          </ButtonDefault>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div></div>
                )}
              </>
            )}
            <div style={{ display: 'flex' }}>
              <div style={{ width: 137 }}>
                <ButtonWhite
                  disable={isDisabled}
                  onClick={(e) => {
                    e.preventDefault();
                    setModalShowWarning(true);
                  }}
                >
                  Cancelar
                </ButtonWhite>
              </div>
              <div className="ms-3" style={{ width: 137 }}>
                <ButtonDefault
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    changeBolsista
                      ? setModalShowQuestionBolsista(true)
                      : formik.handleSubmit(e);
                  }}
                  disable={!formik.isValid || isDisabled}
                >
                  Salvar
                </ButtonDefault>
              </div>
            </div>
          </ButtonGroupBetween>
          {usuario && mobile ? (
            <div style={{ width: 160, margin: 'auto', marginTop: 30 }}>
              {usuario?.active ? (
                <ButtonVermelho
                  disable={isDisabled}
                  onClick={(e) => {
                    e.preventDefault();
                    setModalShowQuestion(true);
                  }}
                >
                  Desativar
                </ButtonVermelho>
              ) : (
                <>
                  {usuario?.subRole !== 'BOLSISTA' && (
                    <ButtonDefault
                      disable={isDisabled}
                      onClick={(e) => {
                        e.preventDefault();
                        setModalShowQuestion(true);
                      }}
                    >
                      Ativar
                    </ButtonDefault>
                  )}
                </>
              )}
            </div>
          ) : (
            <div></div>
          )}
        </Form>
      </Card>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false), modalStatus && Router.back();
        }}
        text={
          modalStatus
            ? `Usuário ${formik.values.name} ${
                usuario ? 'alterado' : 'adicionado'
              }  com sucesso!`
            : modalMessageError
        }
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changeUser()}
        buttonNo={!active ? 'Não Ativar' : 'Não Desativar'}
        buttonYes={'Sim, Tenho Certeza'}
        text={`Você está ${
          !active === true ? 'ativando' : 'desativando'
        } esse Usuário. Tem certeza que deseja continuar?`}
        status={!active}
        size="lg"
      />
      <ModalConfirmation
        show={modalShowQuestionBolsista}
        onHide={() => setModalShowQuestionBolsista(false)}
        onConfirm={(e) => formik.handleSubmit(e)}
        buttonNo={'Não tenho certeza'}
        buttonYes={'Alterar Perfil'}
        text={`Atenção! Você está prestes a alterar esse perfil. Tem certeza que deseja continuar?`}
        size="md"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => {
          setModalShowConfirmQuestion(false);
          Router.reload();
        }}
        text={
          modalStatus
            ? `${formik.values.name} ${
                active === true ? 'desativado' : 'ativado'
              } com sucesso!`
            : modalMessageError
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
        status={!active}
        warning={true}
        size="md"
      />
    </>
  );
}
