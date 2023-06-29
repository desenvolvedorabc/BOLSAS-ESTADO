import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import {
  Card,
  ButtonGroupBetween,
  InputGroup2,
  InputGroup,
} from 'src/shared/styledForms';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ErrorText from 'src/components/ErrorText';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { useEffect, useState, useContext } from 'react';
import Router from 'next/router';
import ModalPergunta from 'src/components/modalPergunta';
import { createRegional, editRegional } from 'src/services/regionais.service';
import ButtonVermelho from 'src/components/buttons/buttonVermelho';
import { Autocomplete, Chip, TextField } from '@mui/material';
import { loadCity, loadUf } from 'src/utils/combos';
import { ThemeContext } from 'src/context/ThemeContext';
import { maskCEP } from 'src/utils/masks';
import useDebounce from 'src/utils/use-debounce';
import { useAuth } from 'src/context/AuthContext';

type ValidationErrors = Partial<{
  name: string;
  abbreviation: string;
  cities: string;
}>;

export default function FormEditRegional({ regional }) {
  const { user } = useAuth();
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalMessageError, setModalMessageError] = useState('');
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] =
    useState(false);
  const [active, setActive] = useState(regional?.active);
  const [listUf, setListUf] = useState([]);
  const [listCity, setListCity] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const { mobile } = useContext(ThemeContext);
  const [cities, setCities] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    async function fetchAPI() {
      const ufs = await loadUf();
      setListUf(ufs);

      if (regional) {
        setSelectedState(
          ufs.find((state) => state.sigla == regional?.abbreviation),
        );
      } else {
        setSelectedState(
          ufs.find((state) => state.sigla == user?.partner_state?.abbreviation),
        );
      }
    }
    fetchAPI();
  }, [user]);

  const validate = (values) => {
    const errors: ValidationErrors = {};
    if (!values?.name?.trim()) {
      errors.name = 'Campo obrigatório';
    }
    if (!values?.abbreviation) {
      errors.abbreviation = 'Campo obrigatório';
    }
    if (values?.cities?.length === 0) {
      errors.cities = 'Campo obrigatório';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: regional?.name,
      abbreviation: regional?.abbreviation
        ? regional?.abbreviation
        : user?.partner_state?.abbreviation,
      cities: regional?.cities,
    },
    validate,
    onSubmit: async (values) => {
      setIsDisabled(true);
      let response;

      try {
        if (regional) {
          response = await editRegional(regional?.id, values);
        } else response = await createRegional(values);
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
    },
  });

  async function changeRegional() {
    setModalShowQuestion(false);
    const data = {
      active: !regional.active,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    // data.active = !data.active;

    const response = await editRegional(regional.id, data);
    if (response.status === 200 || response.status === 201) {
      setActive(regional?.active);
      setModalStatus(true);
      setModalShowConfirmQuestion(true);
    } else {
      setModalStatus(false);
      setModalShowConfirmQuestion(true);
    }
  }

  const handleSelectState = async (newValue) => {
    setSelectedState(newValue);
    formik.setFieldValue('abbreviation', newValue?.sigla);
    // formik.setFieldValue('name', newValue?.nome);
    formik.setFieldValue('cities', []);
    setCities([]);
  };

  useEffect(() => {
    async function fetchAPI() {
      if (selectedState) {
        const loadCities = await loadCity(selectedState?.sigla);
        setListCity(loadCities);

        if (selectedState?.sigla === regional?.abbreviation) {
          const list = [];
          regional?.cities?.forEach((x) => {
            const find = loadCities.find((c) => c?.nome === x);
            if (find) {
              list.push(find);
            }
          });
          setCities(list);
        }
      }
    }
    fetchAPI();
  }, [selectedState]);

  const handleChangeCity = (newValue) => {
    const list = [];
    setCities(newValue);
    newValue?.map((x) => list.push(x.nome));
    formik.values.cities = list;
    formik.setTouched({ ...formik.touched, ['cities']: true });
    formik.validateForm();
  };

  return (
    <>
      <Card>
        <div className="mb-3">
          <strong>Adicionar Nova Regional</strong>
        </div>
        <Form onSubmit={formik.handleSubmit}>
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
              />
              {formik.errors.name ? (
                <ErrorText>{formik.errors.name}</ErrorText>
              ) : null}
            </div>
            <InputGroup mobile={mobile} columns={'1fr 1fr'}>
              <div>
                <Autocomplete
                  id="size-small-outlined"
                  size="small"
                  noOptionsText="Sigla UF"
                  value={selectedState}
                  options={listUf}
                  getOptionLabel={(option) => option.sigla}
                  isOptionEqualToValue={(option, value) =>
                    option.sigla === value
                  }
                  onChange={(_event, newValue) => {
                    handleSelectState(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} label="Sigla UF" />
                  )}
                  disabled
                />
                {formik.errors.abbreviation ? (
                  <ErrorText>{formik.errors.abbreviation}</ErrorText>
                ) : null}
              </div>
              <div>
                <Autocomplete
                  id="size-small-outlined"
                  size="small"
                  noOptionsText="Código IBGE"
                  value={selectedState}
                  options={listUf}
                  getOptionLabel={(option) => option?.id?.toString()}
                  isOptionEqualToValue={(option, value) => option.id === value}
                  onChange={(_event, newValue) => {
                    handleSelectState(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} label="Código IBGE" />
                  )}
                  disabled
                />
                {formik.errors.abbreviation ? (
                  <ErrorText>{formik.errors.abbreviation}</ErrorText>
                ) : null}
              </div>
            </InputGroup>
          </InputGroup>
          <InputGroup2 mobile={mobile} paddingBottom>
            <div>
              <Autocomplete
                multiple
                id="size-small-outlined"
                size="small"
                noOptionsText="Municípios"
                value={cities}
                options={listCity}
                getOptionLabel={(option) => option.nome}
                onChange={(_event, newValue) => {
                  handleChangeCity(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Municípios" />
                )}
                renderTags={(value, getTagProps) => {
                  if (cities.length === 0) value = [];
                  return (
                    <div style={{ maxHeight: 100, overflow: 'auto' }}>
                      {value.map((option, index) => (
                        <Chip
                          key={index}
                          label={option.nome}
                          {...getTagProps({ index })}
                        />
                      ))}
                    </div>
                  );
                }}
              />
              {formik.errors.cities ? (
                <ErrorText>{formik.errors.cities}</ErrorText>
              ) : null}
            </div>
          </InputGroup2>
          <ButtonGroupBetween
            border={true}
            style={{ marginTop: 30 }}
            mobile={mobile}
          >
            {!mobile && (
              <>
                {regional ? (
                  <div style={{ width: 137 }}>
                    {regional?.active ? (
                      <ButtonVermelho
                        onClick={(e) => {
                          e.preventDefault();
                          setModalShowQuestion(true);
                        }}
                      >
                        Desativar
                      </ButtonVermelho>
                    ) : (
                      <ButtonDefault
                        onClick={(e) => {
                          e.preventDefault();
                          setModalShowQuestion(true);
                        }}
                      >
                        Ativar
                      </ButtonDefault>
                    )}
                  </div>
                ) : (
                  <div></div>
                )}
              </>
            )}
            <div className="d-flex">
              <div style={{ width: 137 }}>
                <ButtonWhite
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
                    formik.handleSubmit(e);
                  }}
                  disable={!formik.isValid || isDisabled}
                >
                  Salvar
                </ButtonDefault>
              </div>
            </div>
          </ButtonGroupBetween>
          {regional && mobile ? (
            <div style={{ width: 137, margin: 'auto', marginTop: 30 }}>
              {regional?.active ? (
                <ButtonVermelho
                  onClick={(e) => {
                    e.preventDefault();
                    setModalShowQuestion(true);
                  }}
                >
                  Desativar
                </ButtonVermelho>
              ) : (
                <ButtonDefault
                  onClick={(e) => {
                    e.preventDefault();
                    setModalShowQuestion(true);
                  }}
                >
                  Ativar
                </ButtonDefault>
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
          setModalShowConfirm(false), modalStatus && Router.reload();
        }}
        text={
          modalStatus
            ? `Regional ${formik.values.name} ${
                regional ? 'alterada' : 'adicionada'
              } com sucesso!`
            : modalMessageError
        }
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changeRegional()}
        buttonNo={!active ? 'Não Ativar' : 'Não Desativar'}
        buttonYes={'Sim, Tenho Certeza'}
        text={`Você está ${
          !active === true ? 'ativando' : 'desativando'
        } esse Regional. Tem certeza que deseja continuar?`}
        status={!active}
        size="lg"
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
