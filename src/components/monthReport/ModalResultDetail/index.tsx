import { Autocomplete, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR';

import { Title } from './styledComponents';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { ThemeContext } from 'src/context/ThemeContext';
import { IResult } from 'src/services/relatorio-mensal.service';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import { isValidDate } from 'src/utils/validate';
import { InputGroup } from 'src/shared/styledForms';

const schemaSchedule = yup.object().shape({
  detailingResult: yup.string().nullable(),
  // .required('Campo obrigatório'),
  qntFormedGifts: yup
    .number()
    .min(0, 'Não é permitido número negativo')
    .nullable(),
  // .required('Campo obrigatório'),
  workloadInMinutes: yup
    .number()
    .min(0, 'Não é permitido número negativo')
    .nullable(),
  // .required('Campo obrigatório'),
  qntExpectedGraduates: yup
    .number()
    .min(0, 'Não é permitido número negativo')
    .nullable(),
  // .required('Campo obrigatório'),
  trainingModality: yup.string().nullable(),
  // .required('Campo obrigatório'),
  trainingDate: yup
    .string()
    // .required('Campo obrigatório')
    .nullable()
    .test('Data inválida', (trainingDate) => {
      return isValidDate(trainingDate);
    }),
});

export enum TrainingModalityEnum {
  REMOTO = 'Remoto',
  PRESENCIAL = 'Presencial',
}

export function ModalResultDetail(props) {
  const { mobile } = useContext(ThemeContext);
  const [action, setAction] = useState(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setAction(props.action);
    reset({
      detailingResult: props.action?.detailingResult
        ? props.action?.detailingResult
        : '',
      trainingDate: props.action?.trainingDate,
      workloadInMinutes: props.action?.workloadInMinutes,
      qntExpectedGraduates: props.action?.qntExpectedGraduates,
      qntFormedGifts: props.action?.qntFormedGifts,
      trainingModality: props.action?.trainingModality
        ? props.action?.trainingModality
        : null,
    });
  }, [props.changedAction]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IResult>({
    defaultValues: {
      detailingResult: action?.detailingResult,
      workloadInMinutes: action?.workloadInMinutes,
      qntExpectedGraduates: action?.qntExpectedGraduates,
      qntFormedGifts: action?.qntFormedGifts,
      trainingModality: action?.trainingModality,
      trainingDate: action?.trainingDate,
    },
    resolver: yupResolver(schemaSchedule),
  });

  useEffect(() => {
    setEdit(props.edit);
  }, [props.edit]);

  const onSubmit: SubmitHandler<IResult> = async (data) => {
    if (props?.action?.id) props.handleChangeResult(props?.action?.id, data);
    else props.handleChangeResult(props?.action?.scheduleWorkPlanId, data);
    props.onHide();
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
            <div>Detalhes do Resultado</div>
          </Title>
        </Modal.Header>
        <Modal.Body className="text-center px-5">
          {!props.isFormer ? (
            <>
              <Controller
                name="detailingResult"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    minRows={5}
                    maxRows={8}
                    multiline
                    inputProps={{ maxLength: 500 }}
                    label="Digite uma descrição sobre o resultado*"
                    placeholder="Digite aqui uma descrição sobre os resultados do mês..."
                    error={!!errors.detailingResult}
                    disabled={!props.edit}
                    size="small"
                    helperText={
                      edit && errors.detailingResult
                        ? errors.detailingResult?.message
                        : ''
                    }
                    fullWidth
                    sx={{ backgroundColor: '#fff' }}
                  />
                )}
              />
              <div style={{ marginTop: 15 }}>
                <Controller
                  name="qntFormedGifts"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Digite a quantidade numérica referente ao resultado"
                      error={!!errors.qntFormedGifts}
                      disabled={!props.edit}
                      size="small"
                      helperText={
                        edit && errors.qntFormedGifts
                          ? errors.qntFormedGifts?.type === 'typeError'
                            ? 'Somente número permitido'
                            : errors.qntFormedGifts?.message
                          : ''
                      }
                      fullWidth
                      sx={{ backgroundColor: '#fff' }}
                    />
                  )}
                />
              </div>
            </>
          ) : (
            <div>
              <InputGroup gap={'20px'} mobile={mobile}>
                <Controller
                  name="trainingDate"
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
                        label="Data da Formação"
                        disabled={!edit}
                        // onChange={(val) => {
                        //   field.onChange(val);
                        // }}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            size="small"
                            {...params}
                            sx={{ backgroundColor: '#FFF' }}
                            error={!!errors.trainingDate}
                            helperText={
                              errors.trainingDate
                                ? errors.trainingDate?.message ===
                                  'trainingDate is invalid'
                                  ? 'Data inválida'
                                  : errors.trainingDate?.message
                                : ''
                            }
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <Controller
                  name="workloadInMinutes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Carga Horária"
                      error={!!errors.workloadInMinutes}
                      disabled={!edit}
                      size="small"
                      helperText={
                        edit && errors.workloadInMinutes
                          ? errors.workloadInMinutes?.type === 'typeError'
                            ? 'Somente número permitido'
                            : errors.workloadInMinutes?.message
                          : ''
                      }
                      fullWidth
                      sx={{ backgroundColor: '#fff' }}
                    />
                  )}
                />
              </InputGroup>
              <Controller
                name="qntExpectedGraduates"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Qtd. Formados Previstos"
                    error={!!errors.qntExpectedGraduates}
                    disabled={!edit}
                    size="small"
                    helperText={
                      edit && errors.qntExpectedGraduates
                        ? errors.qntExpectedGraduates?.type === 'typeError'
                          ? 'Somente número permitido'
                          : errors.qntExpectedGraduates?.message
                        : ''
                    }
                    fullWidth
                    sx={{ backgroundColor: '#fff', marginTop: '15px' }}
                  />
                )}
              />
              <Controller
                name="qntFormedGifts"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Qtd. Formados Presentes"
                    error={!!errors.qntFormedGifts}
                    disabled={!edit}
                    size="small"
                    helperText={
                      edit && errors.qntFormedGifts
                        ? errors.qntFormedGifts?.type === 'typeError'
                          ? 'Somente número permitido'
                          : errors.qntFormedGifts?.message
                        : ''
                    }
                    fullWidth
                    sx={{ backgroundColor: '#fff', marginTop: '15px' }}
                  />
                )}
              />
              <Controller
                name="trainingModality"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    id="size-small-outlined"
                    size="small"
                    noOptionsText="Modalidade da Formação"
                    value={field.value}
                    options={['REMOTO', 'PRESENCIAL']}
                    getOptionLabel={(option) => TrainingModalityEnum[option]}
                    onChange={(_event, newValue) => {
                      field.onChange(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...params}
                        label="Modalidade da Formação"
                        error={!!errors.trainingModality}
                        helperText={
                          errors.trainingModality
                            ? errors.trainingModality?.message
                            : ''
                        }
                        sx={{ marginTop: '15px' }}
                      />
                    )}
                    disabled={!edit}
                  />
                )}
              />
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
                  // disable={!isValid}
                >
                  Adicionar
                </ButtonDefault>
              </div>
              <ButtonWhite
                border={false}
                onClick={() => {
                  props.onHide();
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
    </>
  );
}
