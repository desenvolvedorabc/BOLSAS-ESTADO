import { useContext, useState } from 'react';
import { InputGroup, Card } from 'src/shared/styledForms';
import { TextField } from '@mui/material';
import { StateArea, TitleCard } from './styledComponents';
import { format } from 'date-fns';
import { entities_mock } from 'src/utils/mocks/entities';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import { Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ThemeContext } from 'src/context/ThemeContext';

export default function LogDetails({ log }) {
  const [listEntity, setListEntity] = useState(entities_mock);
  const { mobile } = useContext(ThemeContext);

  const getLogName = (value) => {
    let name = value;
    listEntity.map((entity) => {
      if (entity.value === value) name = entity.name;
    });

    return name;
  };

  return (
    <div style={{ maxWidth: mobile ? '' : 'calc(100vw - 20.625rem)' }}>
      <Card style={{ marginBottom: 17 }}>
        <div className="mb-3">
          <strong>Informações do Log</strong>
        </div>
        <InputGroup mobile={mobile} columns={'1fr 1fr 1fr'} paddingTop={'30px'}>
          <div>
            <TextField
              fullWidth
              label="Usuário"
              name="usuario"
              id="usuario"
              value={log?.user?.name}
              onChange={(e) => {
                e.preventDefault();
              }}
              disabled={true}
              size="small"
              sx={{
                '& .Mui-disabled': {
                  background: '#fff',
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: 'black',
                },
              }}
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Origem"
              name="origin"
              id="origin"
              value={log?.user?.role}
              onChange={(e) => {
                e.preventDefault();
              }}
              disabled={true}
              size="small"
              sx={{
                '& .Mui-disabled': {
                  background: '#fff',
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: 'black',
                },
              }}
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Perfil de Acesso"
              name="perfil"
              id="perfil"
              value={log?.user?.access_profile?.name}
              onChange={(e) => {
                e.preventDefault();
              }}
              disabled={true}
              size="small"
              sx={{
                '& .Mui-disabled': {
                  background: '#fff',
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: 'black',
                },
              }}
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Data e Hora"
              name="data"
              id="data"
              value={
                log?.createdAt
                  ? format(new Date(log?.createdAt), 'dd/MM/yyyy - HH:mm:ss')
                  : null
              }
              onChange={(e) => {
                e.preventDefault();
              }}
              disabled={true}
              size="small"
              sx={{
                '& .Mui-disabled': {
                  background: '#fff',
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: 'black',
                },
              }}
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Entidade"
              name="entidade"
              id="entidade"
              value={getLogName(log?.nameEntity)}
              onChange={(e) => {
                e.preventDefault();
              }}
              disabled={true}
              size="small"
              sx={{
                '& .Mui-disabled': {
                  background: '#fff',
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: 'black',
                },
              }}
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Método"
              name="metodo"
              id="metodo"
              value={log?.method}
              onChange={(e) => {
                e.preventDefault();
              }}
              disabled={true}
              size="small"
              sx={{
                '& .Mui-disabled': {
                  background: '#fff',
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: 'black',
                },
              }}
            />
          </div>
        </InputGroup>
      </Card>
      <Card style={{ marginBottom: 17 }}>
        <TitleCard className="mb-3">
          <strong>Estado Antes</strong>
          <OverlayTrigger
            trigger="click"
            placement="left"
            rootClose
            overlay={<Tooltip id={`tooltip-top`}>Texto copiado</Tooltip>}
          >
            <div style={{ width: 205 }}>
              <ButtonWhite
                onClick={() => {
                  navigator.clipboard.writeText(log?.stateInitial);
                }}
              >
                Copiar
              </ButtonWhite>
            </div>
          </OverlayTrigger>
        </TitleCard>
        <StateArea>
          <pre>{log?.stateInitial}</pre>
        </StateArea>
      </Card>
      <Card>
        <TitleCard className="mb-3">
          <strong>Estado Depois</strong>
          <OverlayTrigger
            trigger="click"
            placement="left"
            rootClose
            overlay={<Tooltip id={`tooltip-top`}>Texto copiado</Tooltip>}
          >
            <div style={{ width: 205 }}>
              <ButtonWhite
                onClick={() => {
                  navigator.clipboard.writeText(log?.stateFinal);
                }}
              >
                Copiar
              </ButtonWhite>
            </div>
          </OverlayTrigger>
        </TitleCard>
        <StateArea>
          <pre>{log?.stateFinal}</pre>
        </StateArea>
      </Card>
    </div>
  );
}
