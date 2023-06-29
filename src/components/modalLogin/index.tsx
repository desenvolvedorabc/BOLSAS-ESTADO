import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import Router from 'next/router';
import { Modal } from 'react-bootstrap';
import { MdCheckCircleOutline } from 'react-icons/md';
import { Text } from './styledComponents';

export default function ModalLogin(props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className=" justify-content-center border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          <MdCheckCircleOutline color={'#64BC47'} size={32} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center text-center px-5">
        <Text>{props.text}</Text>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center border-0 px-5">
        <ButtonDefault
          onClick={() => {
            Router.push(`/painel/${props.query?.estado}/login`);
          }}
        >
          Entendi
        </ButtonDefault>
      </Modal.Footer>
    </Modal>
  );
}
