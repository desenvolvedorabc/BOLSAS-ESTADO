import { Card, InputGroup } from 'src/shared/styledForms';
import { TextField } from '@mui/material';
import { maskCPF } from 'src/utils/masks';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR';
import { Form } from 'react-bootstrap';

export function GeneratePdfContract({ componentRef, contract }) {
  return (
    <div className="pdf">
      <div ref={componentRef} className="print-container">
        <Card>
          <div className="mb-3">
            <strong>Termo de compromisso</strong>
          </div>
          <Form>
            <InputGroup mobile={false} columns={'1fr 3fr'} paddingTop={'30px'}>
              <TextField
                label="CPF"
                size="small"
                fullWidth
                value={maskCPF(contract?.scholar?.user?.cpf)}
                sx={{ backgroundColor: '#fff' }}
              />
              <TextField
                label="Nome"
                size="small"
                fullWidth
                value={contract?.scholar?.user?.name}
                sx={{ backgroundColor: '#fff' }}
              />
            </InputGroup>
            <InputGroup
              mobile={false}
              columns={'1fr 1fr'}
              gap={'30px'}
              paddingTop={'30px'}
            >
              <div>
                <TextField
                  value={contract?.project}
                  label="Projeto"
                  size="small"
                  fullWidth
                  sx={{ backgroundColor: '#fff' }}
                />
              </div>
              <div>
                <TextField
                  value={contract?.axle}
                  label="Eixo"
                  size="small"
                  fullWidth
                  sx={{ backgroundColor: '#fff' }}
                />
              </div>
            </InputGroup>
            <InputGroup
              mobile={false}
              columns={'1fr 1fr'}
              gap={'30px'}
              paddingTop={'30px'}
            >
              <div>
                <TextField
                  value={contract?.workUnit}
                  label="Regional"
                  size="small"
                  fullWidth
                  sx={{ backgroundColor: '#fff' }}
                />
              </div>
              <div>
                <TextField
                  value={contract?.city}
                  label="Município"
                  size="small"
                  fullWidth
                  sx={{ backgroundColor: '#fff' }}
                />
              </div>
            </InputGroup>
            <InputGroup
              mobile={false}
              columns={'1fr 1fr'}
              gap={'30px'}
              paddingTop={'30px'}
            >
              <div>
                <TextField
                  value={contract?.contractDescription}
                  label="Descrição do Contrato"
                  size="small"
                  multiline
                  fullWidth
                  sx={{ backgroundColor: '#fff' }}
                  inputProps={{
                    style: { height: '90px' },
                  }}
                />
              </div>
            </InputGroup>
            <InputGroup
              mobile={false}
              columns={'1fr 1fr 1fr 1fr'}
              gap={'30px'}
              paddingTop={'30px'}
            >
              <div>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  locale={brLocale}
                >
                  <DatePicker
                    value={contract?.startDate}
                    openTo="year"
                    views={['year', 'month', 'day']}
                    label="Data início"
                    onChange={null}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        size="small"
                        {...params}
                        sx={{ backgroundColor: '#FFF' }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
              <div>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  locale={brLocale}
                >
                  <DatePicker
                    value={contract?.endDate}
                    openTo="year"
                    onChange={null}
                    views={['year', 'month', 'day']}
                    label="Data Término"
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        size="small"
                        {...params}
                        sx={{ backgroundColor: '#FFF' }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
              <div>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  locale={brLocale}
                >
                  <DatePicker
                    value={contract?.extensionDate}
                    onChange={null}
                    openTo="year"
                    views={['year', 'month', 'day']}
                    label="Data Prorrogação"
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        size="small"
                        {...params}
                        sx={{ backgroundColor: '#FFF' }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </InputGroup>

            <InputGroup mobile={false} columns={'1fr'} paddingTop={'30px'}>
              <div
                style={{
                  borderTop: '1px solid #d5d5d5',
                }}
              ></div>
            </InputGroup>

            <InputGroup
              mobile={false}
              columns={'1fr 1fr'}
              gap={'30px'}
              paddingTop={'30px'}
            >
              <div>
                <TextField
                  value={contract?.payingSource}
                  label="Fonte Pagadora"
                  size="small"
                  fullWidth
                  sx={{ backgroundColor: '#fff' }}
                />
              </div>
              <div>
                <TextField
                  value={contract?.bagName}
                  label="Nome da Bolsa"
                  size="small"
                  fullWidth
                  sx={{ backgroundColor: '#fff' }}
                />
              </div>
            </InputGroup>
            <InputGroup
              mobile={false}
              columns={'1fr 1fr 1fr 1fr'}
              gap={'30px'}
              paddingTop={'30px'}
            >
              <div>
                <TextField
                  value={contract?.weekHours}
                  label="Horas Semanais"
                  size="small"
                  fullWidth
                  sx={{ backgroundColor: '#fff' }}
                />
              </div>
              <div>
                <TextField
                  value={(
                    contract?.scholarshipValueInCents / 100
                  ).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Valor da Bolsa"
                  size="small"
                  fullWidth
                  sx={{ backgroundColor: '#fff' }}
                />
              </div>
            </InputGroup>
          </Form>
        </Card>
      </div>
    </div>
  );
}
