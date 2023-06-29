import { useContext } from 'react';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import ButtonVermelho from 'src/components/buttons/buttonVermelho';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import { ThemeContext } from 'src/context/ThemeContext';
import { ButtonGroup } from './styledComponents';

type Props = {
  havePlan: boolean;
  setModalShowWarningDeletePlan: (boolean) => void;
  setModalShowWarningCancel: (boolean) => void;
  isValid: boolean;
  isDisabled: boolean;
};

export function ButtonsEdit({
  havePlan,
  setModalShowWarningDeletePlan,
  setModalShowWarningCancel,
  isValid,
  isDisabled,
}: Props) {
  const { mobile } = useContext(ThemeContext);

  return (
    <>
      {mobile ? (
        <div>
          <ButtonGroup mobile={mobile}>
            <div style={{ display: 'flex' }}>
              <div style={{ width: 137, marginRight: 20 }}>
                <ButtonWhite onClick={() => setModalShowWarningCancel(true)}>
                  Cancelar
                </ButtonWhite>
              </div>
              <div style={{ width: 137 }}>
                <ButtonDefault
                  disable={!isValid || isDisabled}
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
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {havePlan ? (
              <div style={{ width: 175 }}>
                <ButtonVermelho
                  onClick={() => setModalShowWarningDeletePlan(true)}
                  disable={isDisabled}
                >
                  Excluir Plano de Trabalho
                </ButtonVermelho>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <ButtonGroup mobile={mobile}>
          <div>
            {havePlan ? (
              <div style={{ width: 175 }}>
                <ButtonVermelho
                  onClick={() => setModalShowWarningDeletePlan(true)}
                  disable={isDisabled}
                >
                  Excluir Plano de Trabalho
                </ButtonVermelho>
              </div>
            ) : null}
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: 137, marginRight: 20 }}>
              <ButtonWhite onClick={() => setModalShowWarningCancel(true)}>
                Cancelar
              </ButtonWhite>
            </div>
            <div style={{ width: 137 }}>
              <ButtonDefault
                disable={!isValid || isDisabled}
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
