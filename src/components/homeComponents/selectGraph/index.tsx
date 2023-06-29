import { useContext, useEffect, useState } from 'react';
import { Box, Box2 } from './styledComponents';
import { Autocomplete, TextField } from '@mui/material';
import { GraphScholars } from '../graphScholars';
import { ThemeContext } from 'src/context/ThemeContext';
import { GraphReports } from '../graphReports';
import { GraphValues } from '../graphValues';
import { useAuth } from 'src/context/AuthContext';
import { useGetRegionais } from 'src/services/regionais.service';
import { GraphScholarsPending } from '../graphScholarsPending';
import { GraphPendingWorkPlan } from '../graphPendingWorkPlan';
import { GraphAmountInvested } from '../graphAmountInvested';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR';
import { isValidDate } from 'src/utils/validate';
import { GraphTeachers } from '../graphTeachers';
import ErrorText from 'src/components/ErrorText';

enum StatusName {
  APROVADO = 'Aprovado',
  PENDENTE_ENVIO = 'Pendente Envio',
  REPROVADO = 'Reprovado',
}

export function SelectGraph() {
  const { mobile } = useContext(ThemeContext);
  const date = new Date();
  const [type, setType] = useState('Número de bolsistas ativos');
  const [year, setYear] = useState(date.getFullYear());
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [yearList, setYearList] = useState([]);
  const [month, setMonth] = useState(null);
  const [statusReport, setStatusReport] = useState('APROVADO');
  const { user } = useAuth();
  const [regional, setRegional] = useState(null);
  const [cities, setCities] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [isDisabledRegional, setIsDisabledRegional] = useState(false);
  const [statusTeacher, setStatusTeacher] = useState('Professores Formados');
  const [errorDate, setErrorDate] = useState(false);

  const monthList = [
    {
      id: 1,
      name: 'Janeiro',
    },
    {
      id: 2,
      name: 'Fevereiro',
    },
    {
      id: 3,
      name: 'Março',
    },
    {
      id: 4,
      name: 'Abril',
    },
    {
      id: 5,
      name: 'Maio',
    },
    {
      id: 6,
      name: 'Junho',
    },
    {
      id: 7,
      name: 'Julho',
    },
    {
      id: 8,
      name: 'Agosto',
    },
    {
      id: 9,
      name: 'Setembro',
    },
    {
      id: 10,
      name: 'Outubro',
    },
    {
      id: 11,
      name: 'Novembro',
    },
    {
      id: 12,
      name: 'Dezembro',
    },
  ];

  useEffect(() => {
    if (user?.access_profile?.role === 'REGIONAL') {
      setRegional(
        user?.regionalPartner !== undefined ? user?.regionalPartner : null,
      );
      setCityList(user?.regionalPartner?.cities);
      setIsDisabledRegional(true);
    }
    if (user?.access_profile?.role === 'MUNICIPIO') {
      setRegional(
        user?.regionalPartner !== undefined ? user?.regionalPartner : null,
      );
      setCities([user?.city]);
      setIsDisabledRegional(true);
    }
  }, [user]);

  const { data: listRegionais, isLoading: isLoadingRegionais } =
    useGetRegionais({
      search: null,
      page: 1,
      limit: 9999999,
      order: 'ASC',
      status: 1,
    });

  const handleChangeRegional = (newValue) => {
    setRegional(newValue);
    if (newValue) {
      setCityList(newValue.cities);
    } else {
      setCityList([]);
    }
    setCities([]);
  };

  const getYears = () => {
    const list = [];

    for (let i = 2019; i <= date.getFullYear(); i++) {
      list.push(i);
    }
    setYearList(list);
  };

  useEffect(() => {
    getYears();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dateEnd && dateEnd < dateStart) {
      setErrorDate(true);
    } else {
      setErrorDate(false);
    }
  }, [dateStart, dateEnd]);

  return (
    <>
      <Box mobile={mobile}>
        <Autocomplete
          id="size-small-outlined"
          size="small"
          noOptionsText=" "
          value={type}
          options={[
            'Número de bolsistas ativos',
            'Relatórios (Aprovados / Reprovados / Pendentes)',
            'Bolsistas Pendentes Envio (Cadastro Completo)',
            'Bolsistas Pendentes Envio (Plano de Trabalho)',
            'Professores Formados Por Bolsista Formador',
            'Valor Das Bolsas (Média)',
            'Total Real Investido das Bolsas',
          ]}
          onChange={(_event, newValue) => {
            setType(newValue);
          }}
          disableClearable
          renderInput={(params) => (
            <TextField size="small" {...params} label=" " />
          )}
        />
        {type !== 'Total Real Investido das Bolsas' ? (
          <Autocomplete
            id="size-small-outlined"
            size="small"
            noOptionsText="Ano Calendário"
            value={year}
            options={yearList}
            onChange={(_event, newValue) => {
              setYear(Number(newValue));
            }}
            disableClearable
            renderInput={(params) => (
              <TextField size="small" {...params} label="Ano Calendário" />
            )}
          />
        ) : (
          <>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={brLocale}
            >
              <DatePicker
                openTo="year"
                views={['year', 'month', 'day']}
                label="Data Início"
                value={dateStart}
                onChange={(val) => {
                  if (isValidDate(val)) {
                    setDateStart(val);
                    return;
                  }
                  setDateStart('');
                }}
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
            <div>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={brLocale}
              >
                <DatePicker
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="Data Fim"
                  value={dateEnd}
                  minDate={dateStart}
                  onChange={(val) => {
                    if (isValidDate(val)) {
                      setDateEnd(val);
                      return;
                    }
                    setDateEnd('');
                  }}
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
              {errorDate && (
                <ErrorText>Data Fim inferior a Data Inicio</ErrorText>
              )}
            </div>
          </>
        )}
        {type === 'Relatórios (Aprovados / Reprovados / Pendentes)' && (
          <>
            <Autocomplete
              id="size-small-outlined"
              size="small"
              noOptionsText="Mês"
              value={month}
              options={monthList}
              getOptionLabel={(option) => option?.name}
              onChange={(_event, newValue) => {
                setMonth(newValue);
              }}
              disableClearable
              renderInput={(params) => (
                <TextField size="small" {...params} label="Mês" />
              )}
            />
            <Autocomplete
              id="size-small-outlined"
              size="small"
              noOptionsText="Status dos Relatórios"
              value={statusReport}
              options={Object.keys(StatusName)}
              getOptionLabel={(option) => StatusName[option]}
              onChange={(_event, newValue) => {
                setStatusReport(newValue);
              }}
              disableClearable
              renderInput={(params) => (
                <TextField
                  size="small"
                  {...params}
                  label="Status dos Relatórios"
                />
              )}
            />
          </>
        )}
      </Box>
      <Box2 mobile={mobile}>
        <Autocomplete
          id="size-small-outlined"
          size="small"
          noOptionsText="Regional"
          value={regional}
          options={listRegionais?.items?.length > 0 ? listRegionais?.items : []}
          getOptionLabel={(option) => option.name}
          onChange={(_event, newValue) => {
            handleChangeRegional(newValue);
          }}
          loading={isLoadingRegionais}
          renderInput={(params) => (
            <TextField size="small" {...params} label="Regional" />
          )}
          disabled={isDisabledRegional}
        />
        <Autocomplete
          id="size-small-outlined"
          size="small"
          multiple
          noOptionsText="Município"
          value={cities}
          options={cityList}
          onChange={(_event, newValue) => {
            setCities(newValue);
          }}
          disabled={!regional || user?.access_profile?.role === 'MUNICIPIO'}
          renderInput={(params) => (
            <TextField size="small" {...params} label="Município" />
          )}
        />
        {type === 'Professores Formados Por Bolsista Formador' && (
          <Autocomplete
            id="size-small-outlined"
            size="small"
            noOptionsText="Status de Formação"
            value={statusTeacher}
            options={['Professores Formados', 'Professores Previstos']}
            onChange={(_event, newValue) => {
              setStatusTeacher(newValue);
            }}
            renderInput={(params) => (
              <TextField size="small" {...params} label="Status de Formação" />
            )}
          />
        )}
      </Box2>
      {type === 'Número de bolsistas ativos' ? (
        <GraphScholars year={year} regional={regional} cities={cities} />
      ) : type === 'Relatórios (Aprovados / Reprovados / Pendentes)' ? (
        <GraphReports
          year={year}
          month={month}
          statusReport={statusReport}
          regional={regional}
          cities={cities}
        />
      ) : type === 'Valor Das Bolsas (Média)' ? (
        <GraphValues year={year} regional={regional} cities={cities} />
      ) : type === 'Bolsistas Pendentes Envio (Cadastro Completo)' ? (
        <GraphScholarsPending year={year} regional={regional} cities={cities} />
      ) : type === 'Bolsistas Pendentes Envio (Plano de Trabalho)' ? (
        <GraphPendingWorkPlan year={year} regional={regional} cities={cities} />
      ) : type === 'Professores Formados Por Bolsista Formador' ? (
        <GraphTeachers
          year={year}
          regional={regional}
          cities={cities}
          statusTeacher={statusTeacher}
        />
      ) : type === 'Total Real Investido das Bolsas' ? (
        <GraphAmountInvested
          dateStart={dateStart}
          dateEnd={dateEnd}
          regional={regional}
          cities={cities}
        />
      ) : (
        <GraphScholars year={year} regional={regional} cities={cities} />
      )}
    </>
  );
}
