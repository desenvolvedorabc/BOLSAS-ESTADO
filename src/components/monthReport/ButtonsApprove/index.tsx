import Router from 'next/router';
import { useContext, useState } from 'react';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { ModalReprove } from 'src/components/ModalReprove';
import { ThemeContext } from 'src/context/ThemeContext';
import { BoxVoltar, ButtonGroup } from './styledComponents';
import {
  approveMonthReport,
  reproveMonthReport,
  updateMonthReport,
} from 'src/services/relatorio-mensal.service';
import { useAuth } from 'src/context/AuthContext';

type Props = {
  idReport: number;
  statusReport: string;
  reload: () => void;
  level: string;
};

export function ButtonsApprove({
  idReport,
  statusReport,
  reload,
  level,
}: Props) {
  const [justification, setJustification] = useState();
  const [modalShowReprove, setModalShowReprove] = useState(false);
  const [modalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [type, setType] = useState(null);
  const [modalMessageError, setModalMessageError] = useState(false);
  const { mobile } = useContext(ThemeContext);
  const { user } = useAuth();

  const handleReprove = async () => {
    const data = {
      justification: justification,
    };
    const resp = await reproveMonthReport(idReport, data);

    if (resp.status === 200 || resp.status === 201) {
      setType('reprove');
      setModalShowReprove(false);
      setModalStatus(true);
    } else {
      setModalMessageError(resp.data.message);
      setModalStatus(false);
    }
    setModalShowConfirm(true);
  };

  const handleUpdate = async () => {
    const resp = await updateMonthReport(idReport);

    if (resp.status === 200 || resp.status === 201) {
      setType('update');
      setModalStatus(true);
    } else {
      setModalMessageError(resp.data.message);
      setModalStatus(false);
    }
    setModalShowConfirm(true);
  };

  const handleApprove = async () => {
    const resp = await approveMonthReport(idReport);

    if (resp.status === 200 || resp.status === 201) {
      setType('approve');
      setModalStatus(true);
    } else {
      setModalMessageError(resp.data.message);
      setModalStatus(false);
    }
    setModalShowConfirm(true);
  };

  const handleChangeJustification = (value) => {
    setJustification(value);
  };

  return (
    <>
      <ButtonGroup mobile={mobile}>
        {user?.access_profile?.role === level ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {statusReport === 'PENDENTE_VALIDACAO' ? (
              <div style={{ width: 163 }}>
                <ButtonWhite onClick={() => handleUpdate()}>
                  Em Validação
                </ButtonWhite>
              </div>
            ) : (
              statusReport != 'APROVADO' &&
              statusReport != 'REPROVADO' && (
                <>
                  <div style={{ width: 163, marginRight: 20 }}>
                    <ButtonWhite onClick={() => setModalShowReprove(true)}>
                      Reprovar
                    </ButtonWhite>
                  </div>

                  <div style={{ width: 163 }}>
                    <ButtonWhite onClick={() => handleApprove()}>
                      Aprovar
                    </ButtonWhite>
                  </div>
                </>
              )
            )}
          </div>
        ) : (
          <div></div>
        )}

        <BoxVoltar mobile={mobile}>
          <div style={{ width: 163 }}>
            <ButtonDefault
              onClick={() => {
                Router.back();
              }}
            >
              Voltar
            </ButtonDefault>
          </div>
        </BoxVoltar>
      </ButtonGroup>
      <ModalReprove
        show={modalShowReprove}
        onHide={() => {
          setModalShowReprove(false);
        }}
        text={
          'Você está prestes a reprovar esse relatório. Por favor, digite abaixo a justificativa dessa reprovação.'
        }
        placeholder={
          'Espaço para justificativa de rejeição do relatório aqui...'
        }
        buttonText={'Reprovar Relatório Mensal'}
        changeJustification={handleChangeJustification}
        justification={justification}
        edit={true}
        onConfirm={handleReprove}
      />
      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false), modalStatus && Router.reload();
        }}
        text={
          modalStatus
            ? type === 'approve'
              ? `Relatório aprovado com sucesso!`
              : type === 'reprove'
              ? `Relatório reprovado com sucesso!`
              : `Relatório atualizado com sucesso!`
            : modalMessageError
        }
        status={modalStatus}
      />
    </>
  );
}
