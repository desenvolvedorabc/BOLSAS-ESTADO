import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import {
  FormCheckLabel,
  CardBloco,
  TopoCard,
  CheckGroup,
  FormCheck,
  Tag,
} from './styledComponents';
import { Card, ButtonGroupBetween, InputGroup3 } from 'src/shared/styledForms';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ErrorText from 'src/components/ErrorText';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { useEffect, useState, useContext } from 'react';
import Router from 'next/router';
import ModalPergunta from 'src/components/modalPergunta';
import {
  createPerfil,
  editPerfil,
  ProfileRole,
} from 'src/services/perfis.service';
import { getAllAreas } from 'src/services/areas.service';
import ButtonVermelho from 'src/components/buttons/buttonVermelho';
import { Autocomplete, TextField } from '@mui/material';
import {
  ESTADOLINKS,
  REGIONALLINKS,
  MUNICIPIOLINKS,
  BOLSISTALINKS,
} from 'src/utils/menu';
import { ThemeContext } from 'src/context/ThemeContext';
import { useAuth } from 'src/context/AuthContext';

type ValidationErrors = Partial<{ name: string; areas: string; role: string }>;

export default function FormEditPerfil({ perfil }) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalMessageError, setModalMessageError] = useState('');
  const [modalShowQuestion, setModalShowQuestion] = useState(false);
  const [modalShowConfirmQuestion, setModalShowConfirmQuestion] =
    useState(false);
  const [active, setActive] = useState(perfil?.active);
  const [listProfiles, setListProfiles] = useState([]);
  const [listAreas, setListAreas] = useState([]);
  const [listAreasOptions, setListAreasOptions] = useState([]);
  const { mobile } = useContext(ThemeContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.subRole === 'ADMIN') {
      setListProfiles(['MUNICIPIO', 'REGIONAL', 'ESTADO']);
    } else if (user?.access_profile?.role === 'ESTADO') {
      setListProfiles(['MUNICIPIO', 'REGIONAL']);
    } else if (user?.access_profile?.role === 'REGIONAL') {
      setListProfiles(['BOLSISTA', 'MUNICIPIO']);
    } else if (user?.access_profile?.role === 'MUNICIPIO') {
      setListProfiles(['BOLSISTA']);
    }
  }, [user]);

  const getAreasName = () => {
    const list = [];
    if (perfil)
      perfil?.areas?.map((x) => {
        list.push(x?.tag);
      });
    return list;
  };

  const validate = (values) => {
    const errors: ValidationErrors = {};
    if (!values?.name?.trim()) {
      errors.name = 'Campo obrigatório';
    } else if (values?.name?.trim().length < 6) {
      errors.name = 'Deve ter no mínimo 6 caracteres';
    }
    if (values?.areas?.length === 0) {
      errors.areas = 'Deve conter no mínimo uma função';
    }
    if (!values.role) {
      errors.role = 'Campo obrigatório';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: perfil?.name,
      areas: getAreasName(),
      active: perfil?.active,
      role: perfil?.role
        ? perfil?.role
        : user?.access_profile?.role === 'MUNICIPIO'
        ? 'BOLSISTA'
        : null,
    },
    validate,
    onSubmit: async (values) => {
      setIsDisabled(true);

      const list = [];
      if (!perfil?.id) {
        const arrayHome = ['HOME'];

        arrayHome.forEach((x) => {
          listAreas.forEach((area) => {
            if (x === area.tag) list.push({ id: area.id });
          });
        });
      }

      values.areas.forEach((x) => {
        listAreas.forEach((area) => {
          if (x === area.tag) list.push({ id: area.id });
        });
      });

      values.areas = list;

      let response;
      try {
        if (perfil) {
          response = await editPerfil(perfil?.id, values);
        } else response = await createPerfil(values);
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

  async function changePerfil() {
    setModalShowQuestion(false);
    const data = {
      active: !perfil.active,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    // data.active = !data.active;

    const response = await editPerfil(perfil.id, data);
    if (response.status === 200 || response.status === 201) {
      setActive(perfil?.active);
      setModalStatus(true);
      setModalShowConfirmQuestion(true);
    } else {
      setModalMessageError(response.data.message);
      setModalStatus(false);
      setModalShowConfirmQuestion(true);
    }
  }

  const loadAreas = async () => {
    const resp = await getAllAreas();
    if (resp.data.length > 0) setListAreas(resp.data);
  };

  useEffect(() => {
    loadAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formik.values.role === 'ESTADO')
      setListAreasOptions(Object.values(ESTADOLINKS));
    else {
      if (formik.values.role === 'MUNICIPIO')
        setListAreasOptions(Object.values(MUNICIPIOLINKS));
      else {
        if (formik.values.role === 'REGIONAL')
          setListAreasOptions(Object.values(REGIONALLINKS));
        else {
          if (formik.values.role === 'BOLSISTA')
            setListAreasOptions(Object.values(BOLSISTALINKS));
          else setListAreasOptions([]);
        }
      }
    }
  }, [formik.values.role]);

  const verifyCheckAreas = (name) => {
    const check = formik.values.areas.find((x) => name === x);

    if (check) return true;
    const element = document.getElementById(name) as HTMLInputElement;
    if (element?.checked) element.checked = false;
    return false;
  };

  const selectAll = (grupo) => {
    listAreasOptions.forEach((link) => {
      const list = formik.values.areas;
      if (link?.grupo === grupo) {
        link?.items.forEach((item) => {
          if (!formik.values.areas.includes(item.ARE_NOME)) {
            document.getElementById(item.ARE_NOME).click();
            list.push(item.ARE_NOME);
          }
        });
      }
      formik.values.areas = list;
    });

    formik.validateForm();
  };

  // const deselectAll = () => {
  //   listAreasOptions.forEach((link) => {
  //     link?.items.forEach((item) => {
  //       const element = document.getElementById(
  //         item.ARE_NOME,
  //       ) as HTMLInputElement;
  //       // console.log('element', element);
  //       if (element?.checked) {
  //         console.log('element', element);

  //         element.checked = false;
  //         // document.getElementById(item.ARE_NOME).checked = false;
  //       }
  //     });
  //   });
  // };

  const handleChangeRole = (newValue) => {
    formik.values.role = newValue;
    formik.values.areas = [];

    formik.validateForm();
  };

  return (
    <>
      <Card>
        <div className="mb-3">
          <strong>Novo Perfil de Usuário</strong>
        </div>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup3 mobile={mobile}>
            <div>
              <Form.Label>Hierarquia de Acesso:</Form.Label>
              <div className="mb-2">
                <Autocomplete
                  id="size-small-outlined"
                  size="small"
                  noOptionsText="Selecione um Tipo"
                  value={formik.values.role}
                  options={listProfiles}
                  // getOptionLabel={(option) => option.nome}
                  onChange={(_event, newValue) => {
                    handleChangeRole(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Selecione um Tipo"
                    />
                  )}
                  disabled={user?.access_profile?.role === 'MUNICIPIO'}
                />
                {formik.errors.role ? (
                  <ErrorText>{formik.errors.role}</ErrorText>
                ) : null}
              </div>
            </div>
            <div>
              <Form.Label>Nome do Perfil</Form.Label>
              <div className="mb-2">
                <TextField
                  fullWidth
                  label="Nome do Perfil"
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
            </div>
          </InputGroup3>
          <div>
            <div className="mt-5 mb-3">Permissões:</div>
            <CardBloco mobile={mobile}>
              <TopoCard>
                <div style={{ fontWeight: 500 }}></div>
                <div style={{ width: mobile ? 131 : 152 }}>
                  <ButtonDefault
                    disable
                    onClick={() => {
                      null;
                    }}
                  >
                    Marcar Todos
                  </ButtonDefault>
                </div>
              </TopoCard>
              <CheckGroup mobile={mobile}>
                <FormCheck className="col-11">
                  <Form.Check.Input
                    onChange={null}
                    value={'Home'}
                    name="areas"
                    type={'checkbox'}
                    disabled
                    defaultChecked={true}
                  />
                  <FormCheckLabel>
                    <div>Home</div>
                  </FormCheckLabel>
                </FormCheck>
                <FormCheck className="col-11">
                  <Form.Check.Input
                    onChange={null}
                    value={'Minha Conta'}
                    name="areas"
                    type={'checkbox'}
                    disabled
                    defaultChecked={true}
                  />
                  <FormCheckLabel>
                    <div>Minha Conta</div>
                  </FormCheckLabel>
                </FormCheck>
              </CheckGroup>
            </CardBloco>
            {listAreasOptions.map((link) => (
              <>
                {link.grupo != '' && (
                  <CardBloco key={link?.grupo} mobile={mobile}>
                    <TopoCard>
                      <div style={{ fontWeight: 500 }}>{link?.grupo}</div>
                      <div style={{ width: mobile ? 131 : 152 }}>
                        <ButtonDefault
                          onClick={() => {
                            selectAll(link?.grupo);
                          }}
                        >
                          Marcar Todos
                        </ButtonDefault>
                      </div>
                    </TopoCard>
                    <CheckGroup mobile={mobile}>
                      {link?.items.map((x) => (
                        <>
                          {x.ARE_NOME != 'HOME' && (
                            <FormCheck
                              key={x.name}
                              id={x.name}
                              className="col-11"
                            >
                              <Form.Check.Input
                                onChange={formik.handleChange}
                                value={x.ARE_NOME}
                                name="areas"
                                id={x.ARE_NOME}
                                type={'checkbox'}
                                disabled={x.ARE_NOME === 'HOME'}
                                defaultChecked={
                                  perfil?.id
                                    ? verifyCheckAreas(x.ARE_NOME)
                                    : x.ARE_NOME === 'HOME'
                                }
                              />
                              <FormCheckLabel>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  {x.name}
                                  {formik.values.role !== 'BOLSISTA' &&
                                    x.bolsista && <Tag>Bolsista</Tag>}
                                </div>
                              </FormCheckLabel>
                            </FormCheck>
                          )}
                        </>
                      ))}
                    </CheckGroup>
                  </CardBloco>
                )}
              </>
            ))}
          </div>
          <ButtonGroupBetween
            border={true}
            style={{ marginTop: 30 }}
            mobile={mobile}
          >
            {!mobile && (
              <>
                {perfil ? (
                  <div style={{ width: 137 }}>
                    {perfil?.active ? (
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

          {perfil && mobile ? (
            <div style={{ width: 160, margin: 'auto', marginTop: 30 }}>
              {perfil?.active ? (
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
            ? `Perfil ${formik.values.name} ${
                perfil ? 'alterado' : 'adicionado'
              } com sucesso!`
            : modalMessageError
        }
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowQuestion}
        onHide={() => setModalShowQuestion(false)}
        onConfirm={() => changePerfil()}
        buttonNo={!active ? 'Não Ativar' : 'Não Desativar'}
        buttonYes={'Sim, Tenho Certeza'}
        text={`Você está ${
          !active === true ? 'ativando' : 'desativando'
        } esse Perfil de Acesso. Tem certeza que deseja continuar?`}
        status={!active}
        size="lg"
      />
      <ModalConfirmacao
        show={modalShowConfirmQuestion}
        onHide={() => {
          setModalShowConfirmQuestion(false);
          modalStatus && Router.reload();
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
