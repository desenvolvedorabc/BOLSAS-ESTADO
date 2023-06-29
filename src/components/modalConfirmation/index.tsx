import { Modal } from 'react-bootstrap';
import { MdInfoOutline } from 'react-icons/md';
import ButtonWhite from '../buttons/buttonWhite';
import { ButtonDefault } from '../buttons/buttonDefault';

export default function ModalConfirmation(props) {
  return (
    <Modal
      {...props}
      size={props.size}
      aria-labelledby="contained-modal-title-center"
      centered
    >
      <Modal.Header className=" justify-content-center border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          <MdInfoOutline color={'#FF6868'} size={32} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center text-center px-5">
        <p>
          <strong>{props.text}</strong>
        </p>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-column justify-content-center border-0 align-center px-5 offset-3 col-6">
        <ButtonDefault onClick={props.onHide}>{props.buttonNo}</ButtonDefault>
        <ButtonWhite border={false} onClick={props.onConfirm}>
          {props.buttonYes}
        </ButtonWhite>
      </Modal.Footer>
    </Modal>
  );
}
