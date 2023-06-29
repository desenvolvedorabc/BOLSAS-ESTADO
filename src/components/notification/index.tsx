import { useContext, useEffect, useState } from 'react';
import {
  MdOutlineNotifications,
  MdClose,
  MdOutlineEmail,
} from 'react-icons/md';
import {
  Button,
  NotificationNumber,
  NotificationList,
  Top,
  Title,
  CardNotification,
  TitleNotification,
  Data,
} from './styledComponents';
import { getNotifications } from 'src/services/notificacoes.service';
import MailOpen from 'public/assets/images/mailOpen.svg';
import { ModalNotification } from '../modalNotification';
import { formatDate } from 'src/utils/date';
import { ThemeContext } from 'src/context/ThemeContext';

export default function Notification() {
  const { theme, mobile } = useContext(ThemeContext);
  const [qntNotification, setQntNotification] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [modalShowNotification, setModalShowNotification] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [notificationList, setNotificationList] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showQntNotification, setShowQntNotification] = useState(false);
  let firstLoad = true;
  const [finished, setFinished] = useState(false);

  const loadNotifications = async (reset) => {
    const _page = reset ? 1 : page;
    const resp = await getNotifications(_page, limit);

    setQntNotification(resp.data?.totalNotificationsNotRead);

    if (resp.data?.totalNotificationsNotRead > 0 && firstLoad === true) {
      setShowQntNotification(true);
    }

    if (resp.data?.meta?.itemCount < 10) setFinished(true);

    firstLoad = false;
    if (resp.data?.items) {
      if (reset) setNotificationList(resp.data.items);
      else setNotificationList([...notificationList, ...resp.data.items]);
    }
  };

  useEffect(() => {
    loadNotifications(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const selectNotification = (id) => {
    setSelectedNotification(id);
    setModalShowNotification(true);
  };

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && !finished) {
        setPage((currentValue) => currentValue + 1);
      }
    });
    if (document.querySelector('#sentinela')) {
      intersectionObserver.observe(document.querySelector('#sentinela'));
    }

    return () => intersectionObserver.disconnect();
  }, [isOpen]);

  const handleLoadNotification = () => {
    setPage(1);
    loadNotifications(true);
  };

  return (
    <div style={{}}>
      <Button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowQntNotification(false);
        }}
      >
        <MdOutlineNotifications
          color={theme.colors.primary}
          size={32}
          style={{ margin: 'auto', padding: 3 }}
        />
        {showQntNotification && (
          <NotificationNumber>{qntNotification}</NotificationNumber>
        )}
      </Button>
      {isOpen && (
        <NotificationList open={isOpen} mobile={mobile}>
          <Top>
            <MdClose
              onClick={() => {
                setIsOpen(!isOpen);
                setShowQntNotification(false);
              }}
              size={16}
              style={{ cursor: 'pointer' }}
            />
            <Title>NOTIFICAÇÕES</Title>
          </Top>
          {notificationList.map((notification) => (
            <CardNotification
              key={notification.id}
              onClick={() => {
                selectNotification(notification.id);
              }}
            >
              <div>
                <TitleNotification read={notification.readAt} mobile={mobile}>
                  {notification.title}
                </TitleNotification>
                <Data>{formatDate(notification.createdAt, 'dd/MM/yyyy')}</Data>
              </div>
              <div>
                {notification.readAt ? (
                  <MailOpen color={'#B3B3B3'} size={18} />
                ) : (
                  <MdOutlineEmail color={theme.colors.primary} size={22} />
                )}
              </div>
            </CardNotification>
          ))}

          <div id="sentinela"></div>
        </NotificationList>
      )}
      <ModalNotification
        show={modalShowNotification}
        onHide={() => {
          setModalShowNotification(false);
        }}
        notification={selectedNotification}
        reload={handleLoadNotification}
      />
    </div>
  );
}
