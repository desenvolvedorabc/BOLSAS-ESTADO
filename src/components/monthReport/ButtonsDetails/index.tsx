import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import { ButtonGroup } from './styledComponents';

type Props = {
  havePlan: boolean;
  handleSend: () => void;
  changeEdit: (boolean) => void;
  edit: () => boolean;
};

export function ButtonsDetails({
  havePlan,
  handleSend,
  changeEdit,
  edit,
}: Props) {
  return (
    <ButtonGroup>
      <>
        <div></div>
        {havePlan && edit() ? (
          <>
            <div style={{ width: 163, marginRight: 20 }}>
              <ButtonDefault
                onClick={() => {
                  changeEdit(true), window.scrollTo(0, 0);
                }}
                disable={edit()}
              >
                Editar
              </ButtonDefault>
            </div>
            <div style={{ width: 163 }}>
              <ButtonDefault onClick={() => handleSend()}>Enviar</ButtonDefault>
            </div>
          </>
        ) : (
          <>
            {!edit() && (
              <div style={{ width: 163 }}>
                <ButtonDefault
                  onClick={() => {
                    changeEdit(true), window.scrollTo(0, 0);
                  }}
                  disable={edit()}
                >
                  Editar
                </ButtonDefault>
              </div>
            )}
          </>
        )}
      </>
    </ButtonGroup>
  );
}
