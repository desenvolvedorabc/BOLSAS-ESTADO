import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import {
  SelectionSide,
  Title,
  List,
  ListOverflow,
  FormCheck,
  FormCheckLabel,
  CardSelectionSide,
  MessageSide,
  ButtonDest,
  ButtonDestList,
  TopMessage,
  CardButtons,
  ButtonCard,
  ButtonScroll,
} from './styledComponents';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import ModalAviso from 'src/components/modalAviso';
import { useContext, useEffect, useState } from 'react';
import Router from 'next/router';
import ButtonVermelho from 'src/components/buttons/buttonVermelho';
import {
  Autocomplete,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material';
import {
  MdClose,
  MdOutlineKeyboardDoubleArrowDown,
  MdSearch,
} from 'react-icons/md';
import { createMessage } from 'src/services/mensagens.service';
import { Editor } from '../editor';
import { useAuth } from 'src/context/AuthContext';
import { getRegionais } from 'src/services/regionais.service';
import { useGetUsersNotifications } from 'src/services/usuarios.service';
import { queryClient } from 'src/lib/react-query';
import { ThemeContext } from 'src/context/ThemeContext';
import ErrorText from 'src/components/ErrorText';

type ValidationErrors = Partial<{
  title: string;
  text: string;
  usersIds: string;
}>;

export default function FormCreateMessage() {
  const { user } = useAuth();
  const { mobile } = useContext(ThemeContext);
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState(true);
  const [selectedRegional, setSelectedRegional] = useState(null);
  const [regionalList, setRegionalList] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [searchUser, setSearchUser] = useState(null);

  const [isRegionalDisabled, setIsRegionalDisabled] = useState(false);
  const [isCityDisabled, setIsCityDisabled] = useState(true);

  const [selectAllActive, setselectAllActive] = useState(false);
  const [mySelected, setMySelected] = useState([]);
  const [listAdd, setListAdd] = useState([]);
  const [text, setText] = useState('');
  const [disableAll, setDisableAll] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const { data: dataUsers, isLoading: isLoadingUsers } =
    useGetUsersNotifications({
      search: searchUser,
      page: 1,
      limit: 9999999,
      order: 'ASC',
      status: '1',
      role: 'ESTADO',
      idRegionalPartner: selectedRegional?.id,
      city: selectedCity,
      profileType: null,
    });

  const validate = (values) => {
    const errors: ValidationErrors = {};
    if (!values.title) {
      errors.title = 'Campo obrigatório';
    } else if (values.title.length < 6) {
      errors.title = 'Deve ter no minimo 6 caracteres';
    }
    if (!values.text) {
      errors.text = 'Campo obrigatório';
    }
    if (listAdd?.length === 0) {
      errors.usersIds = 'Necessário ao menos 1 destinatório';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      text: '',
      usersIds: [],
    },
    validate,
    onSubmit: async (values) => {
      values.text = text;

      const list = [];
      listAdd.map((x) => {
        list.push(x.id);
      });
      values.usersIds = list;

      setIsDisabled(true);
      let response = null;
      try {
        response = await createMessage(values);
      } catch (err) {
        setIsDisabled(false);
      } finally {
        setIsDisabled(false);
      }
      if (response.status === 201) {
        setModalStatus(true);
        setModalShowConfirm(true);
        queryClient.invalidateQueries(['messages']);
      } else {
        setErrorMessage(response.data.message || 'Erro ao enviar mensagem');
        setModalStatus(false);
        setModalShowConfirm(true);
      }
    },
  });

  const loadRegionais = async () => {
    const resp = await getRegionais({
      search: null,
      page: 1,
      limit: 999999,
      order: 'ASC',
      status: 1,
      column: null,
    });

    if (resp.data?.items) {
      setRegionalList(resp?.data?.items);
    }
  };

  useEffect(() => {
    if (user) {
      if (user?.access_profile?.role === 'MUNICIPIO') {
        setIsRegionalDisabled(true);
        setIsCityDisabled(true);
        setSelectedRegional(user?.regionalPartner);
        setSelectedCity(user?.city);
      } else if (user?.access_profile?.role === 'REGIONAL') {
        setIsRegionalDisabled(true);
        setIsCityDisabled(false);
        setSelectedRegional(user?.regionalPartner);
        setCityList(user?.regionalPartner?.cities);
      } else if (user?.access_profile?.role === 'ESTADO') {
        setIsRegionalDisabled(false);
        loadRegionais();
      } else {
        setIsRegionalDisabled(true);
        setIsCityDisabled(true);
      }
    }
  }, [user]);

  const handleSelectRegional = (newValue) => {
    setSelectedRegional(newValue);
    setSelectedCity(null);
    setCityList(newValue?.cities);
    if (!newValue) setIsCityDisabled(true);
    else setIsCityDisabled(false);
  };

  const handleSelectCity = (newValue) => {
    setSelectedCity(newValue);
  };

  const handleSearchUser = (e) => {
    setSearchUser(e.target.value);
  };

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  const handleSelectAll = () => {
    if (!selectAllActive) {
      const list = [];

      dataUsers?.items?.forEach(async (x) => {
        list.push(x);
      });
      setMySelected(list);

      setselectAllActive(!selectAllActive);
    } else {
      setMySelected([]);
      setselectAllActive(!selectAllActive);
    }
  };

  const handleChangeSelect = (user) => {
    if (mySelected.some((x) => x.id == user?.id)) {
      setMySelected([...mySelected.filter((x) => x.id !== user?.id)]);
    } else {
      setMySelected([...mySelected, user]);
    }
  };

  const verifyMySelected = (user) => {
    return mySelected.find((item) => {
      return user?.id === item?.id;
    });
  };

  const handleAddSelecteds = () => {
    const list = listAdd.concat();
    mySelected.map((x) => {
      if (!listAdd.some((user) => user?.id == x.id)) {
        list.push(x);
      }
    });
    setListAdd(list);
  };

  const handleRemoveMun = (id) => {
    setListAdd([...listAdd.filter((x) => x.id !== id)]);
  };

  const handleChangeText = (value) => {
    setText(value);
    // formik.values.text = value;
    formik.setFieldValue('text', value);
  };

  useEffect(() => {
    formik.validateForm();
  }, [listAdd]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: mobile ? 'column' : 'row',
          alignItems: mobile ? 'center' : 'normal',
        }}
      >
        <SelectionSide mobile={mobile}>
          <CardSelectionSide>
            <Title>Destinatários</Title>
            <Autocomplete
              id="regional"
              size="small"
              fullWidth
              noOptionsText="Regional"
              value={selectedRegional}
              options={regionalList}
              getOptionLabel={(option) => option.name}
              onChange={(_event, newValue) => {
                handleSelectRegional(newValue);
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Regional" />
              )}
              disabled={isRegionalDisabled}
              sx={{ backgroundColor: '#fff', marginBottom: '10px' }}
            />
            <div>
              <Autocomplete
                id="city"
                size="small"
                fullWidth
                noOptionsText="Município"
                value={selectedCity}
                options={cityList}
                onChange={(_event, newValue) => {
                  handleSelectCity(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Município" />
                )}
                disabled={isCityDisabled}
                sx={{ backgroundColor: '#fff', marginBottom: '10px' }}
              />
            </div>
            <div className="col mt-2 mb-3">
              <FormControl size="small" fullWidth variant="outlined">
                <InputLabel htmlFor="user">
                  {user?.subRole === 'ADMIN'
                    ? 'Buscar Usuário Estado'
                    : 'Buscar Usuário'}
                </InputLabel>
                <OutlinedInput
                  id="user"
                  size="small"
                  value={searchUser}
                  onChange={handleSearchUser}
                  endAdornment={
                    <InputAdornment position="end">
                      <MdSearch />
                    </InputAdornment>
                  }
                  label={
                    user?.subRole === 'ADMIN'
                      ? 'Buscar Usuário Estado'
                      : 'Buscar Usuário'
                  }
                  sx={{ backgroundColor: '#fff', marginBottom: '10px' }}
                />
              </FormControl>
            </div>
            <List>
              <FormCheck id={'user_form_check'} className="">
                <Form.Check.Input
                  onChange={handleSelectAll}
                  value={'all'}
                  name="usuarios"
                  type={'checkbox'}
                  checked={selectAllActive}
                  disabled={disableAll}
                />
                <FormCheckLabel>
                  <div>Selecionar Todos</div>
                </FormCheckLabel>
              </FormCheck>
              <ListOverflow>
                {dataUsers?.items?.map((x) => {
                  return (
                    <FormCheck key={x.id} id={x.id} className="">
                      <div style={{ width: '14px !important' }}>
                        <Form.Check.Input
                          onChange={() => handleChangeSelect(x)}
                          value={x}
                          name="mySelected"
                          type={'checkbox'}
                          checked={verifyMySelected(x)}
                        />
                      </div>
                      <FormCheckLabel>
                        <div>{x.name}</div>
                      </FormCheckLabel>
                    </FormCheck>
                  );
                })}
              </ListOverflow>
            </List>
            {mobile && (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'end',
                }}
              >
                <ButtonScroll onClick={() => window.scrollTo(0, 960)}>
                  <MdOutlineKeyboardDoubleArrowDown color={'#FFF'} size={24} />
                </ButtonScroll>
              </div>
            )}
          </CardSelectionSide>
          <ButtonCard mobile={mobile}>
            <div style={{ width: '100%' }}>
              <ButtonWhite
                onClick={() => {
                  handleAddSelecteds();
                }}
              >
                Adicionar
              </ButtonWhite>
            </div>
          </ButtonCard>
        </SelectionSide>
        <MessageSide className="col" mobile={mobile}>
          <TopMessage>
            <TextField
              fullWidth
              label="Título da Mensagem"
              name="title"
              id="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onKeyDown={onKeyDown}
              onDragEnter={(e) => e.preventDefault()}
              onSubmit={(e) => e.preventDefault()}
              size="small"
              sx={{
                backgroundColor: '#FFF',
              }}
            />
            {formik.errors.title ? (
              <ErrorText>{formik.errors.title}</ErrorText>
            ) : null}

            <Title style={{ marginTop: 10 }}>Destinatários:</Title>
            <ButtonDestList mobile={mobile}>
              <>
                {listAdd.map((x) => (
                  <>
                    <ButtonDest
                      key={x.id}
                      onClick={() => {
                        handleRemoveMun(x.id);
                      }}
                    >
                      {x.name}
                      <MdClose color={'#4B4B4B'} size={18} />
                    </ButtonDest>
                  </>
                ))}
              </>
            </ButtonDestList>
            {formik.errors.usersIds ? (
              <ErrorText>{formik.errors.usersIds}</ErrorText>
            ) : null}
          </TopMessage>
          <div style={{ marginLeft: mobile ? 0 : 16 }}>
            <Editor changeText={handleChangeText} />
            {formik.errors.text ? (
              <ErrorText>{formik.errors.text}</ErrorText>
            ) : null}
          </div>
        </MessageSide>
      </div>
      <CardButtons>
        <div style={{ width: 135 }}>
          <ButtonVermelho
            onClick={() => {
              setModalShowWarning(true);
            }}
          >
            Descartar
          </ButtonVermelho>
        </div>
        <div style={{ width: 135 }}>
          <ButtonDefault
            onClick={(e) => {
              formik.handleSubmit(e);
            }}
            type="submit"
            disable={isDisabled}
          >
            Enviar
          </ButtonDefault>
        </div>
      </CardButtons>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false),
            modalStatus &&
              Router.push(
                `/painel/${user?.partner_state?.slug}/envio-de-mensagens`,
              );
        }}
        text={
          modalStatus
            ? `Mensagem enviada com sucesso.`
            : 'Erro ao enviar mensagem'
          //errorMessage
        }
        status={modalStatus}
      />
      <ModalAviso
        show={modalShowWarning}
        onHide={() => setModalShowWarning(false)}
        onConfirm={() => {
          Router.push(
            `/painel/${user?.partner_state?.slug}/envio-de-mensagens`,
          );
        }}
        buttonYes={'Sim, Descartar Mensagem'}
        buttonNo={'Manter Mensagem'}
        text={`Tem certeza que deseja descartar a mensagem atual?`}
      />
    </>
  );
}
