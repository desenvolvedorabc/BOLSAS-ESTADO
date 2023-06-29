import Router from 'next/router';
import { useContext, useState } from 'react';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { ModalReprove } from 'src/components/ModalReprove';
import { ThemeContext } from 'src/context/ThemeContext';
import {
  approveWorkPlan,
  reproveWorkPlan,
  updateWorkPlan,
} from 'src/services/plano-trabalho.service';
import { BoxVoltar, ButtonGroup } from './styledComponents';

type Props = {
  idPlan: number;
  statusPlan: string;
  reload: () => void;
  isDisabled: boolean;
};

export function ButtonsApprove({
  idPlan,
  statusPlan,
  reload,
  isDisabled,
}: Props) {
  const [justification, setJustification] = useState();
  const [modalShowReprove, setModalShowReprove] = useState(false);
  const [modalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [type, setType] = useState(null);
  const [modalMessageError, setModalMessageError] = useState(false);
  const { mobile } = useContext(ThemeContext);

  const handleReprove = async () => {
    const data = {
      justification: justification,
    };
    const resp = await reproveWorkPlan(idPlan, data);

    if (resp.status === 200 || resp.status === 201) {
      setType('reprove');
      setModalShowReprove(false);
      setModalStatus(true);
      reload();
    } else {
      setModalMessageError(resp.data.message);
      setModalStatus(false);
    }
    setModalShowConfirm(true);
  };

  const handleUpdate = async () => {
    const resp = await updateWorkPlan(idPlan);

    if (resp.status === 200 || resp.status === 201) {
      setType('update');
      setModalStatus(true);
      reload();
    } else {
      setModalMessageError(resp.data.message);
      setModalStatus(false);
    }
    setModalShowConfirm(true);
  };

  const handleApprove = async () => {
    const resp = await approveWorkPlan(idPlan);

    if (resp.status === 200 || resp.status === 201) {
      setType('approve');
      setModalStatus(true);
      reload();
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
        <div style={{ display: 'flex' }}>
          {statusPlan === 'PENDENTE_VALIDACAO' ? (
            <div style={{ width: 163 }}>
              <ButtonWhite onClick={() => handleUpdate()} disable={isDisabled}>
                Em Validação
              </ButtonWhite>
            </div>
          ) : (
            statusPlan != 'APROVADO' &&
            statusPlan != 'REPROVADO' && (
              <>
                <div style={{ width: 163, marginRight: 20 }}>
                  <ButtonWhite
                    onClick={() => setModalShowReprove(true)}
                    disable={isDisabled}
                  >
                    Reprovar
                  </ButtonWhite>
                </div>

                <div style={{ width: 163 }}>
                  <ButtonWhite
                    onClick={() => handleApprove()}
                    disable={isDisabled}
                  >
                    Aprovar
                  </ButtonWhite>
                </div>
              </>
            )
          )}
        </div>
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
          'Você está prestes a reprovar esse plano de trabalho. Por favor, digite abaixo a justificativa dessa reprovação.'
        }
        placeholder={
          'Espaço para justificativa de rejeição do plano de trabalho aqui...'
        }
        buttonText={'Reprovar Plano de Trabalho'}
        changeJustification={handleChangeJustification}
        justification={justification}
        edit={true}
        onConfirm={handleReprove}
      />
      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false), modalStatus && window.scrollTo(0, 0);
        }}
        text={
          modalStatus
            ? type === 'approve'
              ? `Plano de Trabalho aprovado com sucesso!`
              : type === 'reprove'
              ? `Plano de Trabalho reprovado com sucesso!`
              : `Plano de Trabalho atualizado com sucesso!`
            : modalMessageError
        }
        status={modalStatus}
      />
    </>
  );
}
