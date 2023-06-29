import { lighten } from 'polished';
import {
  Circle,
  DivisionStatus,
  LabelStatus,
  LevelField,
  StatusContainer,
  StatusText,
} from './styledComponents';
import { StatusReport } from 'src/utils/masks';

export function StatusField({ status, level }) {
  const getColor = (status) => {
    if (status === 'APROVADO') {
      return ['#64BC47', '#64BC47', lighten(0.4, '#64BC47')];
    } else if (status === 'EM_VALIDACAO') {
      return ['#0517B9', '#4A4AFF', '#EDEDFC'];
    } else if (status === 'PENDENTE_VALIDACAO') {
      return ['#0517B9', '#4A4AFF', '#EDEDFC'];
    } else if (status === 'PENDENTE_ENVIO') {
      return ['#B99205', '#fff', '#fff'];
    } else if (status === 'REPROVADO') {
      return ['#FF6868', '#FF6868', '#FCEDED'];
    }

    return ['#000'];
  };

  enum ProfileName {
    ESTADO = 'Estado',
    REGIONAL = 'Regional',
    MUNICIPIO = 'Município',
  }

  return (
    <StatusContainer division={status !== 'PENDENTE_ENVIO'}>
      <div>
        <LabelStatus>Status</LabelStatus>
        <StatusText colors={getColor(status)}>
          {StatusReport[status]}
        </StatusText>
      </div>
      {status !== 'PENDENTE_ENVIO' ? (
        <>
          <DivisionStatus />
          <div>
            <LevelField colors={getColor(status)}>
              <Circle colors={getColor(status)} />
              <StatusText colors={getColor(status)}>
                {ProfileName[level]}
              </StatusText>
            </LevelField>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </StatusContainer>
  );
}
