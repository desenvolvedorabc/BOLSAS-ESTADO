import { Card, InputGroup } from 'src/shared/styledForms';
import { TextField } from '@mui/material';
import { maskCPF } from 'src/utils/masks';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR';
import { BoxSign, LineSign } from '../styledComponents';

export function GeneratePdfSignContract({ componentRef, user, contract }) {
  return (
    <div className="pdf">
      <div ref={componentRef} className="print-container">
        <Card style={{ marginBottom: 5 }}>
          <div className="mb-3">
            <strong>Bolsista</strong>
          </div>
          <InputGroup mobile={false} columns={'1fr 3fr'} paddingTop={'30px'}>
            <TextField
              label="CPF"
              size="small"
              fullWidth
              value={maskCPF(user?.cpf)}
              sx={{
                backgroundColor: '#fff',
                '&.Mui-disabled': {
                  color: '#000',
                },
              }}
              disabled={true}
            />
            <TextField
              label="Nome"
              size="small"
              fullWidth
              value={user?.name}
              sx={{ backgroundColor: '#fff' }}
              disabled={true}
            />
          </InputGroup>
        </Card>
        <Card>
          <div className="mb-3">
            <strong>Termo de compromisso</strong>
          </div>
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
                disabled
              />
            </div>
            <div>
              <TextField
                value={contract?.axle}
                label="Eixo"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
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
                disabled
                sx={{ backgroundColor: '#fff' }}
              />
            </div>
            <div>
              <TextField
                value={contract?.city}
                label="Município"
                size="small"
                fullWidth
                disabled
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
                disabled
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
                  onChange={null}
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="Data início"
                  disabled
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
                  onChange={null}
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="Data Término"
                  disabled
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
                  disabled
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
                disabled
              />
            </div>
            <div>
              <TextField
                value={contract?.bagName}
                label="Nome da Bolsa"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
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
                disabled
              />
            </div>
            <div>
              <TextField
                value={(contract?.scholarshipValueInCents / 100).toLocaleString(
                  'pt-BR',
                  {
                    style: 'currency',
                    currency: 'BRL',
                  },
                )}
                label="Valor da Bolsa"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
          </InputGroup>
          <BoxSign>
            <div>Assinatura do Bolsista:</div>
            <LineSign mobile={false} />
            <div style={{ textAlign: 'justify' }}>{user?.name}</div>
          </BoxSign>
        </Card>
      </div>
    </div>
  );
}
