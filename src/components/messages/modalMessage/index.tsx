import { Modal } from 'react-bootstrap';
import { Data, Text, Title } from './styledComponents';
import { format } from 'date-fns';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import { useContext } from 'react';
import { ThemeContext } from 'src/context/ThemeContext';

export function ModalMessage(props) {
  const { mobile } = useContext(ThemeContext);
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        closeButton
        className=" justify-content-center border-0 px-5"
      >
        <Modal.Title id="contained-modal-title-vcenter">
          <Title mobile={mobile}>{props.message?.title}</Title>
          <Data>
            {props.message?.dt_creation &&
              format(new Date(props.message?.dt_creation), 'dd/MM/yyyy')}
          </Data>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center text-center px-5">
        <Text mobile={mobile}>
          <div dangerouslySetInnerHTML={{ __html: props.message?.text }} />
        </Text>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-column justify-content-center border-0 align-center px-5">
        <div style={{ width: 220 }}>
          <ButtonDefault onClick={props.onHide}>Fechar</ButtonDefault>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
