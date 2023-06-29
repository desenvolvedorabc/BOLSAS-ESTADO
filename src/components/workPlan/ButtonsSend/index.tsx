import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import { ButtonGroup } from './styledComponents';

type Props = {
  havePlan: boolean;
  changeSend: (boolean) => void;
  changeEdit: (boolean) => void;
  handleSend: () => void;
  isDisabled: boolean;
};

export function ButtonsSend({
  changeSend,
  changeEdit,
  handleSend,
  isDisabled,
}: Props) {
  return (
    <ButtonGroup>
      <div></div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: 137, marginRight: 20 }}>
          <ButtonWhite
            onClick={() => {
              changeSend(false), changeEdit(true);
            }}
          >
            Voltar
          </ButtonWhite>
        </div>
        <div style={{ width: 137 }}>
          <ButtonDefault onClick={() => handleSend()} disable={isDisabled}>
            Enviar
          </ButtonDefault>
        </div>
      </div>
    </ButtonGroup>
  );
}
