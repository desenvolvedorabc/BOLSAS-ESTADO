import { useContext } from 'react';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import { ThemeContext } from 'src/context/ThemeContext';
import { ButtonGroup } from './styledComponents';

type Props = {
  handleSend: () => void;
  changeStep: (newStep: string) => void;
  send: boolean;
};

export function ButtonsSend({ handleSend, changeStep, send }: Props) {
  const { mobile } = useContext(ThemeContext);

  return (
    <ButtonGroup mobile={mobile}>
      <div style={{ display: 'flex' }}>
        <div style={{ width: 163, marginRight: 20 }}>
          <ButtonWhite
            onClick={() => {
              changeStep('edit');
            }}
          >
            Editar
          </ButtonWhite>
        </div>
        {send && (
          <div style={{ width: 163 }}>
            <ButtonDefault onClick={() => handleSend()}>Enviar</ButtonDefault>
          </div>
        )}
      </div>
    </ButtonGroup>
  );
}
