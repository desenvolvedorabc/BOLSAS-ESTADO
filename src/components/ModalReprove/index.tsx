import { TextField } from '@mui/material';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { MdWarning } from 'react-icons/md';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ButtonYellow from 'src/components/buttons/buttonYellow';

export function ModalReprove(props) {
  const [justification, setJustification] = useState(
    props.justification ? props.justification : '',
  );

  const handleChange = (e) => {
    setJustification(e.target.value);
    props.changeJustification(e.target.value);
  };

  return (
    <Modal
      {...props}
      size="md"
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
        <MdWarning color={'#EFD700'} size={28} />
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ textAlign: 'center', fontSize: 14, marginTop: 10 }}
        >
          {props?.text}
          <p style={{ fontSize: 12 }}>
            (Ao descrever o motivo da reprovação, o mesmo será exibido para o
            bolsista)
          </p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center text-center px-5">
        <TextField
          fullWidth
          minRows={5}
          maxRows={8}
          multiline
          label="Justifique a Reprovação"
          name="justification"
          placeholder={props?.placeholder}
          id="justification"
          value={justification}
          onChange={handleChange}
          size="small"
          disabled={!props.edit}
          sx={{ backgroundColor: '#fff' }}
        />
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center border-0 px-5">
        <ButtonYellow
          type="button"
          onClick={props.onConfirm}
          disable={!justification}
        >
          {props?.buttonText}
        </ButtonYellow>
        <ButtonWhite border={false} onClick={props.onHide}>
          Cancelar
        </ButtonWhite>
      </Modal.Footer>
    </Modal>
  );
}
