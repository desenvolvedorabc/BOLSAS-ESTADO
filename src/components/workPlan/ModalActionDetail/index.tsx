import {
  Autocomplete,
  FormControlLabel,
  FormHelperText,
  Switch,
  TextField,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import {
  createSchedule,
  editSchedule,
  ISchedule,
} from 'src/services/plano-trabalho.service';
import { DatesTitle, Title } from './styledComponents';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { ThemeContext } from 'src/context/ThemeContext';
import { getMonthsName } from 'src/utils/anos';
import { FormerInput } from 'src/components/scholarshipPreRegistration/FormScholarshipPreRegistration/styledComponents';

const schemaSchedule = yup.object().shape({
  month: yup
    .number()
    .required('Campo obrigatório')
    .min(1, 'Valor Invalido')
    .max(12, 'Valor Invalido')
    .nullable(),
  year: yup
    .number()
    .min(0, 'Valor Invalido')
    .max(9999, 'Valor Invalido')
    .required('Campo obrigatório')
    .nullable(),
  action: yup.string().required('Campo obrigatório'),
  isFormer: yup.boolean(),
});

export function ModalActionDetail(props) {
  const [ModalShowConfirmAction, setModalShowConfirmAction] = useState(false);
  const [modalStatusAction, setModalStatusAction] = useState(true);
  const [modalMessageErrorAction, setModalMessageErrorAction] = useState('');
  const [schedule, setSchedule] = useState(null);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const { mobile } = useContext(ThemeContext);

  useEffect(() => {
    const listYear = [];
    const date = new Date();
    listYear.push(date.getFullYear() - 1);
    listYear.push(date.getFullYear());
    listYear.push(date.getFullYear() + 1);
    setYears(listYear);

    const list = [];

    for (let i = 0; i < 12; i++) {
      list.push(i + 1);
    }
    setMonths(list);
  }, []);

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setSchedule(props.schedule);
    setValue('month', props.schedule?.month ? props.schedule?.month : null);
    setValue('year', props.schedule?.year ? props.schedule?.year : null);
    setValue('action', props.schedule?.action);
    setValue(
      'isFormer',
      props.schedule?.isFormer ? props.schedule?.isFormer : false,
    );
  }, [props.changedSchedule]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<ISchedule>({
    defaultValues: {
      month: props?.schedule?.month ? props?.schedule?.month : null,
      year: props?.schedule?.year,
      action: props?.schedule?.action,
      isFormer: props?.schedule?.isFormer ? props?.schedule?.isFormer : false,
    },
    resolver: yupResolver(schemaSchedule),
  });

  useEffect(() => {
    setEdit(props.edit);
  }, [props.edit]);

  const onSubmit: SubmitHandler<ISchedule> = async (data) => {
    let response;

    if (props.schedule) {
      response = await editSchedule(props.schedule?.id, data);

      if (response?.data?.message) {
        setModalMessageErrorAction(response.data.message);
        setModalStatusAction(false);
      } else {
        setModalStatusAction(true);
        data = {
          ...data,
          id: props.schedule?.id,
        };
        props.changeSchedules(data);
      }
    }
    if (props.planId) {
      response = await createSchedule(props?.planId, data);

      if (response?.data?.message) {
        setModalMessageErrorAction(response.data.message);
        setModalStatusAction(false);
      } else {
        setModalStatusAction(true);
        props.changeSchedules({ id: response?.data?.id, ...data });
      }
    } else {
      props.changeSchedules(data);
      setModalStatusAction(true);
    }
    setModalShowConfirmAction(true);
  };

  const closeModal = () => {
    setModalShowConfirmAction(false);
    if (modalStatusAction) {
      props.onHide();
      reset();
    }
    if (props.planId) {
      props.reload;
    }
  };

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="border-0 px-5">
          <Title id="contained-modal-title-vcenter" mobile={mobile}>
            <div>Detalhe da Ação</div>
            <DatesTitle>
              <div style={{ width: 137, marginRight: 20 }}>
                <Controller
                  name="month"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      id="size-small-outlined"
                      size="small"
                      noOptionsText="Mês"
                      value={field.value}
                      options={months}
                      onChange={(_event, newValue) => {
                        field.onChange(newValue);
                      }}
                      disabled={!edit}
                      getOptionLabel={(option) => getMonthsName(option)}
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          {...params}
                          label="Mês"
                          error={!!errors.month}
                          helperText={errors.month ? errors.month?.message : ''}
                        />
                      )}
                    />
                  )}
                />
              </div>
              <div style={{ width: 137 }}>
                <Controller
                  name="year"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Autocomplete
                        fullWidth
                        id="year"
                        size="small"
                        noOptionsText="Ano"
                        {...field}
                        options={years}
                        onChange={(_event, newValue) => {
                          field.onChange(newValue);
                        }}
                        disabled={!edit}
                        renderInput={(params) => (
                          <TextField size="small" {...params} label="Ano" />
                        )}
                        sx={{ width: 142, backgroundColor: '#fff' }}
                      />
                      {errors?.year && (
                        <FormHelperText>
                          {errors?.year ? errors?.year?.message : ''}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </div>
            </DatesTitle>
          </Title>
        </Modal.Header>
        <Modal.Body className="text-center px-5">
          <Controller
            name="action"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                minRows={5}
                maxRows={8}
                multiline
                inputProps={{ maxLength: 3000 }}
                label="Cronograma de execução (AÇÃO):"
                error={!!errors.action}
                disabled={!edit}
                size="small"
                helperText={edit && errors.action ? errors.action?.message : ''}
                fullWidth
                sx={{ backgroundColor: '#fff' }}
              />
            )}
          />
          {props.isUserFormer && (
            <div
              style={{
                width: '17rem',
                fontSize: '0.75rem',
                fontWeight: 500,
                marginTop: '1rem',
              }}
            >
              <FormerInput>
                <div>É Uma Ação de Formação?</div>
                <div>
                  <Controller
                    name="isFormer"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        {...field}
                        control={
                          <Switch
                            color="primary"
                            defaultChecked={props.schedule?.isFormer}
                          />
                        }
                        label={field.value ? 'Sim' : 'Não'}
                        labelPlacement="start"
                        disabled={!edit}
                        sx={{
                          fontSize: '0.75rem',
                        }}
                      />
                    )}
                  />
                </div>
              </FormerInput>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center border-0 px-5">
          {edit ? (
            <>
              <div style={{ width: '100%', marginBottom: 5 }}>
                <ButtonDefault
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disable={!isValid}
                >
                  Adicionar
                </ButtonDefault>
              </div>
              <ButtonWhite
                border={false}
                onClick={() => {
                  props.onHide(), reset();
                }}
              >
                Cancelar
              </ButtonWhite>
            </>
          ) : (
            <ButtonDefault type="button" onClick={props.onHide}>
              {props.textConfirm ?? 'Voltar'}
            </ButtonDefault>
          )}
        </Modal.Footer>
      </Modal>
      <ModalConfirmacao
        show={ModalShowConfirmAction}
        onHide={() => {
          closeModal();
        }}
        text={
          modalStatusAction
            ? `Informações salvas com sucesso!`
            : modalMessageErrorAction
        }
        status={modalStatusAction}
      />
    </>
  );
}
