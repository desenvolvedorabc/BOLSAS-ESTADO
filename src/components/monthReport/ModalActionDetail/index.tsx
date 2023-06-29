/* eslint-disable react-hooks/exhaustive-deps */
import { TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import { Title } from './styledComponents';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { ThemeContext } from 'src/context/ThemeContext';

const schemaSchedule = yup.object().shape({
  detailing: yup.string().required('Campo obrigatório'),
});

export function ModalActionDetail(props) {
  const [action, setAction] = useState(null);
  const { mobile } = useContext(ThemeContext);

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setAction(props.action);
    reset({
      detailing: props?.action?.detailing ? props?.action?.detailing : '',
    });
  }, [props.changedAction]);

  const {
    control,
    reset,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    defaultValues: {
      detailing: props?.action?.detailing,
    },
    resolver: yupResolver(schemaSchedule),
  });

  useEffect(() => {
    setEdit(props.edit);
  }, [props.edit]);

  const onSubmit = async () => {
    if (action?.id)
      props.handleChangeDetail(action?.id, getValues('detailing'));
    else
      props.handleChangeDetail(
        action?.scheduleWorkPlanId,
        getValues('detailing'),
      );
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
            <div>Detalhe da Ação</div>
          </Title>
        </Modal.Header>
        <Modal.Body className="text-center px-5">
          <Controller
            name="detailing"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                minRows={5}
                maxRows={8}
                multiline
                inputProps={{ maxLength: 500 }}
                label="Detalhe da ação do projeto realizada no mês*"
                placeholder="Digite aqui os detalhes da ação do projeto selecionado realizada no mês..."
                error={!!errors.detailing}
                disabled={!edit}
                size="small"
                helperText={
                  edit && errors.detailing ? errors.detailing?.message : ''
                }
                fullWidth
                sx={{ backgroundColor: '#fff' }}
              />
            )}
          />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center border-0 px-5">
          {edit ? (
            <>
              <div style={{ width: '100%', marginBottom: 5 }}>
                <ButtonDefault
                  type="button"
                  onClick={onSubmit}
                  disable={!isValid}
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
