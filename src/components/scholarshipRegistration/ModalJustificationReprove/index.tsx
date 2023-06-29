import { TextField } from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import { StatusField } from '../StatusField';
import {
  DateInstance,
  Divisor,
  Instances,
  TitleInstance,
} from './styledComponents';

export function ModalJustificationReprove(props) {
  const [justification, setJustification] = useState(null);

  useEffect(() => {
    if (props?.validationRegional) {
      setJustification(props?.validationRegional?.justificationReprove);
    } else {
      setJustification(props?.validationCounty?.justificationReprove);
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
      <Modal.Body className="d-flex flex-column px-5">
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
                scholarship={{
                  levelApproveRegistration: 'MUNICIPIO',
                  statusRegistration: props?.validationCounty?.status,
                }}
              />
            </div>
          )}
          {props?.validationRegional && (
            <>
              <Divisor>{'>'}</Divisor>
              <div>
                <DateInstance>
                  {format(
                    new Date(props?.validationRegional?.updatedAt),
                    'dd/MM/yyyy',
                  )}
                </DateInstance>
                <StatusField
                  scholarship={{
                    levelApproveRegistration: 'REGIONAL',
                    statusRegistration: props?.validationRegional?.status,
                  }}
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
