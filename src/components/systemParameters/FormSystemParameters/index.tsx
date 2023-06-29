import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import { Card, ButtonGroupBetween, InputGroup } from 'src/shared/styledForms';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { useEffect, useState, useContext } from 'react';
import Router from 'next/router';
import ModalPergunta from 'src/components/modalPergunta';
import { Autocomplete, TextField } from '@mui/material';
import { ThemeContext } from 'src/context/ThemeContext';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Label, TooltipStyled } from './styledComponents';
import { IParams, createParam, editParam } from 'src/services/params';
import { MdInfoOutline } from 'react-icons/md';

const schemaSchedule = yup.object().shape({
  dayLimitForMonthlyReport: yup
    .number()
    .required('Campo obrigatório')
    .nullable(),
  daysLimitForAnalysisMonthlyReport: yup
    .number()
    .required('Campo obrigatório')
    .nullable(),
  daysLimitSendNotificationForMonthlyReport: yup
    .number()
    .required('Campo obrigatório')
    .nullable(),
});

export default function FormSystemParameters({ params }) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalMessageError, setModalMessageError] = useState('');
  const { mobile } = useContext(ThemeContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const { theme } = useContext(ThemeContext);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IParams>({
    defaultValues: {
      dayLimitForMonthlyReport: params?.dayLimitForMonthlyReport,
      daysLimitForAnalysisMonthlyReport:
        params?.daysLimitForAnalysisMonthlyReport,
      daysLimitSendNotificationForMonthlyReport:
        params?.daysLimitSendNotificationForMonthlyReport,
    },
    resolver: yupResolver(schemaSchedule),
  });

  const onSubmit: SubmitHandler<IParams> = async (data, e) => {
    e.preventDefault();

    setIsDisabled(true);

    let response = null;
    try {
      if (params) {
        response = await editParam(data);
      } else {
        response = await createParam(data);
      }
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

  const getDays = () => {
    const list = [];

    for (let i = 0; i < 31; i++) {
      list.push(i + 1);
    }
    return list;
  };

  return (
    <>
      <Card>
        <div className="mb-3">
          <strong>Configuração</strong>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Label>
            <div style={{ marginRight: 10 }}>Envio de Relatório Mensal</div>

            <OverlayTrigger
              key={'toolTip'}
              placement={mobile ? 'top-start' : 'right'}
              overlay={
                <Tooltip id={`tooltip-right`}>
                  Possibilidade de personalizar o dia recorrente do mês em que
                  será a data corte para envio do relatório mensal
                </Tooltip>
              }
            >
              <div>
                <MdInfoOutline color={theme.colors.primary} size={24} />
              </div>
            </OverlayTrigger>
          </Label>
          <div style={{ width: 302, marginBottom: 40 }}>
            <Controller
              name="dayLimitForMonthlyReport"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  id="size-small-outlined"
                  size="small"
                  noOptionsText="Dia Limite"
                  value={field.value}
                  options={getDays()}
                  onChange={(_event, newValue) => {
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Dia Limite"
                      error={!!errors.dayLimitForMonthlyReport}
                      helperText={
                        errors.dayLimitForMonthlyReport
                          ? errors.dayLimitForMonthlyReport?.message
                          : ''
                      }
                    />
                  )}
                />
              )}
            />
          </div>
          <Label>
            <div style={{ marginRight: 10 }}>Aprovação de Relatório Mensal</div>

            <OverlayTrigger
              key={'toolTip'}
              placement={mobile ? 'top-start' : 'right'}
              overlay={
                <Tooltip id={`tooltip-right`}>
                  Possibilidade de personalizar a quantidade de dias que o
                  aprovador tem após a data de corte do envio do relatório
                  mensal do bolsista
                </Tooltip>
              }
            >
              <div>
                <MdInfoOutline color={theme.colors.primary} size={24} />
              </div>
            </OverlayTrigger>
          </Label>
          <div style={{ width: 302 }}>
            <Controller
              name="daysLimitForAnalysisMonthlyReport"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  id="size-small-outlined"
                  size="small"
                  noOptionsText="Dias Limite"
                  value={field.value}
                  options={[1, 2, 3, 4, 5, 6, 7]}
                  onChange={(_event, newValue) => {
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Dias Limite"
                      error={!!errors.daysLimitForAnalysisMonthlyReport}
                      helperText={
                        errors.daysLimitForAnalysisMonthlyReport ? (
                          errors.daysLimitForAnalysisMonthlyReport?.message
                        ) : (
                          <div>
                            <MdInfoOutline /> Necessário definir data max. de
                            envio do relatório.
                          </div>
                        )
                      }
                    />
                  )}
                />
              )}
            />
          </div>
          <Label>
            <div style={{ marginRight: 10 }}>Notificação ao Bolsista</div>

            <OverlayTrigger
              key={'toolTip'}
              placement={mobile ? 'top-start' : 'right'}
              overlay={
                <Tooltip
                  id={`tooltip-right`}
                  // style={{ backgroundColor: theme.colors.primary }}
                >
                  Possibilidade de personalizar a quantidade de dias anterior a
                  data corte de envio do relatório mensal, em que o bolsista com
                  relatório pendente de envio pode receber uma notificação
                </Tooltip>
              }
            >
              <div>
                <MdInfoOutline color={theme.colors.primary} size={24} />
              </div>
            </OverlayTrigger>
          </Label>
          <div style={{ width: 302 }}>
            <Controller
              name="daysLimitSendNotificationForMonthlyReport"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  id="size-small-outlined"
                  size="small"
                  noOptionsText="Quantidade de Dias"
                  value={field.value}
                  options={[1, 2, 3, 4, 5]}
                  onChange={(_event, newValue) => {
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Quantidade de Dias"
                      error={!!errors.daysLimitSendNotificationForMonthlyReport}
                      helperText={
                        errors.daysLimitSendNotificationForMonthlyReport ? (
                          errors.daysLimitSendNotificationForMonthlyReport
                            ?.message
                        ) : (
                          <div>
                            <MdInfoOutline /> Dias corridos anteriormente a data
                            de corte.
                          </div>
                        )
                      }
                    />
                  )}
                />
              )}
            />
          </div>

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
          modalStatus ? `Parâmetros salvos com sucesso!` : modalMessageError
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
