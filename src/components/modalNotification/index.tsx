import { Modal } from 'react-bootstrap';
import { Data, Text, Title } from './styledComponents';
import { format } from 'date-fns';
import { MdNotificationsActive } from 'react-icons/md';
import {
  getNotification,
  readNotifications,
} from 'src/services/notificacoes.service';
import { useContext, useEffect, useState } from 'react';
import { ButtonDefault } from '../buttons/buttonDefault';
import { ThemeContext } from 'src/context/ThemeContext';

export function ModalNotification(props) {
  const { mobile } = useContext(ThemeContext);

  const [notification, setNotification] = useState(null);

  const loadNotification = async () => {
    if (props.notification != null) {
      const resp = await getNotification(props.notification);
      if (resp.data?.notification) {
        setNotification(resp.data?.notification);
        const respRead = await readNotifications(props.notification);
        props.reload();
      }
    }
  };

  useEffect(() => {
    loadNotification();
  }, [props.notification]);

  return (
    <Modal
      {...props}
      // size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          <MdNotificationsActive color={'#3B4BA2'} size={26} />
          <Title mobile={mobile}>{notification?.title}</Title>
          <Data>
            {notification?.createdAt &&
              format(new Date(notification?.createdAt), 'dd/MM/yyyy')}
          </Data>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex px-5">
        <Text>
          <div dangerouslySetInnerHTML={{ __html: notification?.text }} />
        </Text>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-column justify-content-center border-0 align-center px-5">
        <div style={{ width: 248 }}>
          <ButtonDefault onClick={props.onHide}>Entendi</ButtonDefault>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
