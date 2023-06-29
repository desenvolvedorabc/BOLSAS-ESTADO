import { OutlinedInput } from '@mui/material';
import { Modal } from 'react-bootstrap';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';

export function ModalJustification(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className=" justify-content-center border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          Motivo da Reprovação
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center text-center px-5">
        <OutlinedInput
          fullWidth
          minRows={5}
          maxRows={8}
          multiline
          label=" "
          name="justification"
          id="justification"
          value={'Detalhes do motivo da reprovação do plano:\n' + props.text}
          size="small"
          disabled={true}
          sx={{ backgroundColor: '#fff' }}
        />
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center border-0 px-5">
        <ButtonDefault type="button" onClick={props.onHide}>
          {props.textConfirm ?? 'Fechar'}
        </ButtonDefault>
      </Modal.Footer>
    </Modal>
  );
}
