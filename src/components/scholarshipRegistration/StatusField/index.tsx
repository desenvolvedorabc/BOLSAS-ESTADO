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

export function StatusField({ scholarship }) {
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
    <StatusContainer
      division={scholarship?.statusRegistration !== 'PENDENTE_ENVIO'}
    >
      <div>
        <LabelStatus>Status</LabelStatus>
        <StatusText colors={getColor(scholarship?.statusRegistration)}>
          {StatusReport[scholarship?.statusRegistration]}
        </StatusText>
      </div>
      {scholarship?.statusRegistration !== 'PENDENTE_ENVIO' ? (
        <>
          <DivisionStatus />
          <div>
            <LevelField colors={getColor(scholarship?.statusRegistration)}>
              <Circle colors={getColor(scholarship?.statusRegistration)} />
              <StatusText colors={getColor(scholarship?.statusRegistration)}>
                {ProfileName[scholarship?.levelApproveRegistration]}
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
