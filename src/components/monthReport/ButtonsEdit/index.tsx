import { useContext } from 'react';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import { ThemeContext } from 'src/context/ThemeContext';
import { ButtonGroup } from './styledComponents';
import ButtonVermelho from 'src/components/buttons/buttonVermelho';

type Props = {
  setModalShowWarningCancel: (boolean) => void;
  handlePrint: () => void;
  setModalShowWarningDeletePlan: (boolean) => void;
  reproved: boolean;
};

export function ButtonsEdit({
  setModalShowWarningDeletePlan,
  setModalShowWarningCancel,
  handlePrint,
  reproved,
}: Props) {
  const { mobile } = useContext(ThemeContext);
  return (
    <>
      {mobile ? (
        <div>
          <ButtonGroup mobile={mobile}>
            <div style={{ display: 'flex' }}>
              <div style={{ width: 163, marginRight: 20 }}>
                <ButtonWhite onClick={() => setModalShowWarningCancel(true)}>
                  Cancelar
                </ButtonWhite>
              </div>
              <div style={{ width: 163 }}>
                <ButtonDefault
                  type="submit"
                  onClick={() => {
                    // handleSubmit(onSubmit()),
                    null;
                  }}
                >
                  Salvar
                </ButtonDefault>
              </div>
            </div>
          </ButtonGroup>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: 164 }}>
              <ButtonWhite onClick={handlePrint}>Exportar PDF</ButtonWhite>
            </div>
            {!reproved && (
              <div style={{ width: 175 }}>
                <ButtonVermelho
                  onClick={() => setModalShowWarningDeletePlan(true)}
                  // disable={isDisabled}
                >
                  Excluir Relatório
                </ButtonVermelho>
              </div>
            )}
          </div>
        </div>
      ) : (
        <ButtonGroup mobile={mobile}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: 164 }}>
              <ButtonWhite onClick={handlePrint}>Exportar PDF</ButtonWhite>
            </div>
            {!reproved && (
              <div style={{ width: 175, marginLeft: 20 }}>
                <ButtonVermelho
                  onClick={() => setModalShowWarningDeletePlan(true)}
                  // disable={isDisabled}
                >
                  Excluir Relatório
                </ButtonVermelho>
              </div>
            )}
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: 163, marginRight: 20 }}>
              <ButtonWhite onClick={() => setModalShowWarningCancel(true)}>
                Cancelar
              </ButtonWhite>
            </div>
            <div style={{ width: 163 }}>
              <ButtonDefault
                type="submit"
                onClick={() => {
                  // handleSubmit(onSubmit()),
                  null;
                }}
              >
                Salvar
              </ButtonDefault>
            </div>
          </div>
        </ButtonGroup>
      )}
    </>
  );
}
