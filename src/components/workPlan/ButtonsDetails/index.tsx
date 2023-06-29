import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import { ButtonGroup } from './styledComponents';

type Props = {
  havePlan: boolean;
  handleSend: () => void;
  changeEdit: (boolean) => void;
  status: string;
  isDisabled: boolean;
};

export function ButtonsDetails({
  havePlan,
  handleSend,
  changeEdit,
  status,
  isDisabled,
}: Props) {
  return (
    <ButtonGroup>
      <>
        <div></div>
        {havePlan && status !== 'EM_VALIDACAO' && status !== 'APROVADO' ? (
          <div style={{ display: 'flex' }}>
            <div style={{ width: 137, marginRight: 20 }}>
              <ButtonDefault
                onClick={() => {
                  changeEdit(true), window.scrollTo(0, 0);
                }}
                // disable={status }
              >
                Editar
              </ButtonDefault>
            </div>
            <div style={{ width: 137 }}>
              <ButtonDefault onClick={() => handleSend()} disable={isDisabled}>
                Enviar
              </ButtonDefault>
            </div>
          </div>
        ) : (
          <>
            {/* {!edit() && (
              <div style={{ width: 137 }}>
                <ButtonDefault
                  onClick={() => {
                    changeEdit(true), window.scrollTo(0, 0);
                  }}
                  disable={edit()}
                >
                  Editar
                </ButtonDefault>
              </div>
            )} */}
          </>
        )}
      </>
    </ButtonGroup>
  );
}
