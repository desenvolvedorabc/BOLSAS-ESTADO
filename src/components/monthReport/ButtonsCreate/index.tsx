import { useContext } from 'react';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import { ThemeContext } from 'src/context/ThemeContext';
import { ButtonGroup } from './styledComponents';

type Props = {
  setModalShowWarningCancel: (boolean) => void;
  isValid: boolean;
};

export function ButtonsCreate({ setModalShowWarningCancel, isValid }: Props) {
  const { mobile } = useContext(ThemeContext);

  return (
    <>
      <ButtonGroup mobile={mobile}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: 163, marginRight: 20 }}>
            <ButtonWhite onClick={() => setModalShowWarningCancel(true)}>
              Cancelar
            </ButtonWhite>
          </div>
          <div style={{ width: 163 }}>
            <ButtonDefault
              disable={isValid}
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
    </>
  );
}
