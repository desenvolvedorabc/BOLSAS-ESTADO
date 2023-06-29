import { TextField } from '@mui/material';
import { format } from 'date-fns';
import { Modal } from 'react-bootstrap';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import { StatusField } from '../StatusField';
import {
  DateInstance,
  Divisor,
  Instances,
  TitleInstance,
} from './styledComponents';
import { ThemeContext } from 'src/context/ThemeContext';
import { useContext, useEffect, useState } from 'react';

export function ModalJustificationReprove(props) {
  const [justification, setJustification] = useState(null);
  const { mobile } = useContext(ThemeContext);

  useEffect(() => {
    if (props?.validationState) {
      setJustification(props?.validationState?.justificationReprove);
    } else {
      if (props?.validationRegional) {
        setJustification(props?.validationRegional?.justificationReprove);
      } else {
        setJustification(props?.validationCounty?.justificationReprove);
      }
    }
  }, [props.validationCounty, props.validationRegional]);

  const handleChange = (e) => {
    setJustification(e.target.value);
    props.changeJustification(e.target.value);
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        className="border-0 px-5"
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ textAlign: 'center', marginTop: 10 }}
        >
          Motivo da Reprovação
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column px-4">
        <TextField
          fullWidth
          minRows={5}
          maxRows={8}
          multiline
          label="Detalhes do motivo da reprovação do plano:"
          name="justification"
          id="justification"
          value={justification}
          onChange={handleChange}
          size="small"
          disabled={!props.edit}
          sx={{ backgroundColor: '#fff' }}
        />
        <TitleInstance>Instâncias de aprovação:</TitleInstance>
        <Instances>
          {props?.validationCounty && (
            <div>
              <DateInstance>
                {format(
                  new Date(props?.validationCounty?.updatedAt),
                  'dd/MM/yyyy',
                )}
              </DateInstance>
              <StatusField
                level={'MUNICIPIO'}
                status={props?.validationCounty?.status}
              />
            </div>
          )}
          {props?.validationRegional && (
            <>
              <Divisor mobile={mobile}>{'>'}</Divisor>
              <div>
                <DateInstance>
                  {format(
                    new Date(props?.validationRegional?.updatedAt),
                    'dd/MM/yyyy',
                  )}
                </DateInstance>
                <StatusField
                  level={'REGIONAL'}
                  status={props?.validationRegional?.status}
                />
              </div>
            </>
          )}
          {props?.validationState && (
            <>
              <Divisor mobile={mobile}>{'>'}</Divisor>
              <div>
                <DateInstance>
                  {format(
                    new Date(props?.validationState?.updatedAt),
                    'dd/MM/yyyy',
                  )}
                </DateInstance>
                <StatusField
                  level={'ESTADO'}
                  status={props?.validationState?.status}
                />
              </div>
            </>
          )}
        </Instances>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center border-0 px-5">
        <ButtonDefault type="button" onClick={props.onConfirm}>
          Fechar
        </ButtonDefault>
      </Modal.Footer>
    </Modal>
  );
}
