/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { TextField } from '@mui/material';
import { Card, InputGroup } from 'src/shared/styledForms';
import brLocale from 'date-fns/locale/pt-BR';
import { maskCPF } from 'src/utils/masks';
import { Status, Title } from './styledComponents';
import { getMonthsName } from 'src/utils/anos';
import { TableResult } from '../../TableResult';
import { StatusField } from '../../StatusField';

export function GeneratePdfMonthlyReport({ componentRef, report, term }) {
  return (
    <div className="pdf">
      <div ref={componentRef} className="print-container">
        <form>
          <Card>
            <div>
              <strong>Bolsista</strong>
            </div>
            <InputGroup columns={'1fr 3fr'} paddingTop={'30px'} mobile={false}>
              <TextField
                fullWidth
                label="CPF"
                name="cpf"
                id="cpf"
                value={maskCPF(report?.scholar?.user?.cpf)}
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
                value={report?.scholar?.user?.name}
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
                value={term?.project}
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
                value={term?.workUnit}
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
                value={term?.city}
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
                    value={term?.startDate}
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
                    value={term?.endDate}
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
            <Title>Relatório Mensal</Title>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', marginTop: 30 }}>
                  <div style={{ width: 131, marginRight: 20 }}>
                    <TextField
                      size="small"
                      value={getMonthsName(report?.month)}
                      label="Mês"
                      sx={{ backgroundColor: '#FFF' }}
                      disabled
                    />
                  </div>
                  <div style={{ width: 131 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={report?.year}
                      label="Ano"
                      sx={{ backgroundColor: '#FFF' }}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <Status>
                <div></div>
                <div style={{ display: 'flex' }}>
                  <StatusField
                    status={report?.status}
                    level={report?.levelApproveRegistration}
                  />
                </div>
              </Status>
            </div>
          </div>
          <div style={{ padding: 20 }}>
            <Title>Cronograma</Title>
            <div style={{ marginTop: 25 }}>
              <TableResult
                actions={report?.actionsMonthlyReport}
                edit={false}
                actionsReport={[]}
                file={report?.actionDocument}
                changeFile={null}
                url={null}
                isPdf={true}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
