import { Status, Title } from '../FormWorkPlan/styledComponents';
import { TableSchedules } from '../TableSchedules';
import { Card, InputGroup } from 'src/shared/styledForms';
import { List, ListItemButton, ListItemText, TextField } from '@mui/material';
import { maskCPF } from 'src/utils/masks';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import { MdExpandLess } from 'react-icons/md';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR';
import { TextArea } from './styledComponents';

export function GeneratePdfWorkPlan({
  componentRef,
  user,
  loadedPlan,
  loadedTerm,
  schedules,
  StatusName,
}) {
  return (
    <div className="pdf">
      <div ref={componentRef} className="print-container">
        <Card style={{ marginTop: 20 }}>
          <div>
            <strong>Bolsista</strong>
          </div>
          <InputGroup columns={'1fr 3fr'} paddingTop={'30px'} mobile={false}>
            <TextField
              fullWidth
              label="CPF"
              name="cpf"
              id="cpf"
              value={maskCPF(user?.cpf)}
              size="small"
              disabled={true}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Nome"
              name="name"
              id="name"
              value={user?.name}
              size="small"
              disabled={true}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </InputGroup>
        </Card>
        <Card style={{ marginTop: 30 }}>
          <div>
            <strong>Termo de Compromisso</strong>
          </div>
          <InputGroup columns={'1fr 1fr'} paddingTop={'30px'} mobile={false}>
            <TextField
              fullWidth
              label="Projeto"
              name="project"
              id="project"
              value={loadedTerm?.project}
              size="small"
              disabled={true}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </InputGroup>
          <InputGroup columns={'1fr 1fr'} paddingTop={'30px'} mobile={false}>
            <TextField
              fullWidth
              label="Regional"
              name="workUnit"
              id="workUnit"
              value={loadedTerm?.workUnit}
              size="small"
              disabled={true}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Município"
              name="city"
              id="city"
              value={loadedTerm?.city}
              size="small"
              disabled={true}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </InputGroup>
          <InputGroup columns={'1fr 1fr'} paddingTop={'30px'} mobile={false}>
            <InputGroup columns={'1fr 1fr'} mobile={false}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={brLocale}
              >
                <DatePicker
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="Data Inicio"
                  value={loadedTerm?.startDate}
                  onChange={() => null}
                  disabled
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      size="small"
                      {...params}
                      sx={{ backgroundColor: '#FFF' }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={brLocale}
              >
                <DatePicker
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="Data Fim"
                  value={loadedTerm?.endDate}
                  onChange={() => null}
                  disabled
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      size="small"
                      {...params}
                      sx={{ backgroundColor: '#FFF' }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </InputGroup>
          </InputGroup>
        </Card>
        <div style={{ padding: 20 }}>
          <Title>Plano de Trabalho</Title>
          <Status>
            <div>
              <div>
                <TextField
                  label="Status"
                  name="status"
                  id="status"
                  value={StatusName[loadedPlan?.status]}
                  size="small"
                  disabled={true}
                  sx={{ backgroundColor: '#fff' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
            </div>
          </Status>
        </div>
        <Card>
          <ListItemButton onClick={() => null}>
            <ListItemText primary="Justificativa" />
            {<MdExpandLess />}
          </ListItemButton>
          <List component="div" disablePadding>
            <TextArea>{loadedPlan?.justification}</TextArea>
          </List>
        </Card>

        <Card>
          <ListItemButton onClick={() => null}>
            <ListItemText primary="Objetivos Gerais" />
            {<MdExpandLess />}
          </ListItemButton>
          <List component="div" disablePadding>
            <TextArea>{loadedPlan?.generalObjectives}</TextArea>
          </List>
        </Card>
        <Card style={{ marginTop: 25 }}>
          <ListItemButton onClick={() => null}>
            <ListItemText primary="Objetivos Específicos" />
            {<MdExpandLess />}
          </ListItemButton>
          <TextArea>{loadedPlan?.specificObjectives}</TextArea>
          <List component="div" disablePadding></List>
        </Card>
        <div style={{ padding: 20 }}>
          <Title>Cronograma</Title>
          <div style={{ marginTop: 25 }}>
            <TableSchedules
              schedules={schedules}
              edit={false}
              changeSchedules={null}
              changedTable={null}
              isUserFormer={loadedPlan?.scholar?.isFormer}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
