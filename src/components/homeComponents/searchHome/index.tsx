import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { MdClose, MdSearch } from 'react-icons/md';
import { useAuth } from 'src/context/AuthContext';
import { ThemeContext } from 'src/context/ThemeContext';
import { useGetScholarshipGeneralSearch } from 'src/services/bolsista.service';
import { useGetContractGeneralSearch } from 'src/services/contract';
import { useGetPerfisGeneralSearch } from 'src/services/perfis.service';
import { useGetWorkPlansGeneral } from 'src/services/plano-trabalho.service';
import { IGetRegional, getRegionais } from 'src/services/regionais.service';
import { useGetMonthReportsGeneralSearch } from 'src/services/relatorio-mensal.service';
import { useGetUsersGeneralSearch } from 'src/services/usuarios.service';
import { IconColor } from 'src/shared/styledComponents';
import { parseCookies } from '../../../utils/cookies';
import useDebounce from '../../../utils/use-debounce';
import {
  Button,
  ButtonClose,
  FormStyled,
  RespBox,
  Text,
  Title,
} from './styledComponents';

export default function SearchHome() {
  const [isRespOpen, setIsRespOpen] = useState(false);

  const handleRespOpen = () => {
    setIsRespOpen(!isRespOpen);
  };

  const { mobile } = useContext(ThemeContext);
  const { user } = useAuth();
  const cookies = parseCookies();

  const [searchTerm, setSearchTerm] = useState('');
  const [regionais, setRegionais] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [enabledUsers, setEnabledUsers] = useState(false);
  const [enabledWorkPlans, setEnabledWorkPlans] = useState(false);
  const [enabledPerfil, setEnabledPerfil] = useState(false);
  const [enabledScholars, setEnabledScholars] = useState(false);
  const [enabledTerms, setEnabledTerms] = useState(false);
  const [enabledReports, setEnabledReports] = useState(false);
  const [enabledRegional, setEnabledRegional] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (
      cookies['USU_AREAS'] &&
      cookies['USU_AREAS'] !== 'undefined' &&
      user.subRole !== 'ADMIN'
    ) {
      const userAreas = JSON.parse(cookies['USU_AREAS']);

      if (userAreas.find((x) => x.tag === 'USU_ADM')) {
        setEnabledUsers(true);
      }
      if (userAreas.find((x) => x.tag === 'APRO_PLN_TRAB')) {
        setEnabledWorkPlans(true);
      }
      if (userAreas.find((x) => x.tag === 'PER_ACE')) {
        setEnabledPerfil(true);
      }
      if (userAreas.find((x) => x.tag === 'APRO_CAD_BOL')) {
        setEnabledScholars(true);
      }
      if (userAreas.find((x) => x.tag === 'TER_ADS')) {
        setEnabledTerms(true);
      }
      if (userAreas.find((x) => x.tag === 'APRO_REL')) {
        setEnabledReports(true);
      }
      if (userAreas.find((x) => x.tag === 'REG_PAR')) {
        setEnabledRegional(true);
      }
    } else {
      setEnabledUsers(true);
      setEnabledPerfil(true);
      setEnabledScholars(true);
      setEnabledWorkPlans(true);
      setEnabledTerms(true);
      setEnabledReports(true);
      setEnabledRegional(true);
    }
    // }
  }, [cookies, user]);

  const { data: respWorkPlan } = useGetWorkPlansGeneral(
    {
      page: 1,
      limit: 99999999,
      order: 'ASC',
      referenceYear: null,
      search: debouncedSearchTerm,
      status: null,
    },
    enabledWorkPlans,
  );

  const { data: respUsers } = useGetUsersGeneralSearch(
    {
      search: debouncedSearchTerm,
      page: 1,
      limit: 9999999,
      order: 'ASC',
      status: null,
      profile: null,
      role: 'ESTADO',
    },
    enabledUsers,
  );

  const { data: respPerfil } = useGetPerfisGeneralSearch(
    {
      search: debouncedSearchTerm,
      page: 1,
      limit: 99999,
      order: 'ASC',
      accessProfileRole: null,
      status: null,
      forApproveScholar: false,
    },
    enabledPerfil,
  );

  const { data: respScholars } = useGetScholarshipGeneralSearch(
    {
      search: debouncedSearchTerm,
      page: 1,
      limit: 99999,
      order: 'ASC',
      status: null,
      city: null,
    },
    enabledScholars,
  );

  const { data: respTerm } = useGetContractGeneralSearch(
    {
      search: debouncedSearchTerm,
      page: 1,
      limit: 9999999,
      order: 'ASC',
      status: null,
      city: null,
    },
    enabledTerms,
  );

  const { data: respReport } = useGetMonthReportsGeneralSearch(
    {
      search: debouncedSearchTerm,
      page: 1,
      limit: 9999999,
      order: 'ASC',
      status: null,
      year: null,
      month: null,
    },
    enabledReports,
  );

  // count += respWorkPlan.data?.items?.length;

  useEffect(
    () => {
      setResultCount(0);

      if (debouncedSearchTerm) {
        searchCharacters(debouncedSearchTerm);
        if (!isRespOpen) handleRespOpen();
      } else {
        setResultCount(0);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearchTerm],
  );

  useEffect(() => {
    let count = 0;
    if (respWorkPlan) {
      count += respWorkPlan?.items?.length;
    }
    if (respUsers) {
      count += respUsers?.items?.length;
    }
    if (respPerfil) {
      count += respPerfil?.items?.length;
    }
    if (respScholars) {
      count += respScholars?.items?.length;
    }
    if (respTerm) {
      count += respTerm?.items?.length;
    }
    if (respReport) {
      count += respReport?.items?.length;
    }
    if (regionais) {
      count += regionais?.length;
    }

    setResultCount(count);
  }, [
    regionais,
    respPerfil,
    respReport,
    respScholars,
    respTerm,
    respUsers,
    respWorkPlan,
  ]);

  // API search function
  async function searchCharacters(search: string) {
    const dataRegional: IGetRegional = {
      search: search,
      page: 1,
      limit: 9999999,
      order: 'ASC',
    };

    let respRegional;
    if (enabledRegional) {
      respRegional = await getRegionais(dataRegional);
    }

    setRegionais(respRegional?.data?.items ? respRegional?.data?.items : []);
  }

  return (
    <FormStyled className="col">
      <Form.Group controlId="formBasicEmail">
        <div className="d-flex align-items-center">
          <Form.Control
            className="pe-5"
            type="text"
            name="search"
            placeholder="Faça uma busca no sistema"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="button" onClick={handleRespOpen}>
            <IconColor>
              <MdSearch />
            </IconColor>
          </Button>
        </div>
        <div className="col-12">
          {isRespOpen && (
            <RespBox mobile={mobile} className="col-7">
              <div className="d-flex justify-content-between align-items-center">
                <div>Resultados Encontrados ({resultCount})</div>
                <ButtonClose type="button" onClick={handleRespOpen}>
                  <MdClose color={'#3E8277'} />
                </ButtonClose>
              </div>
              {respUsers?.items?.length > 0 && (
                <>
                  <hr />
                  <Title>
                    <strong>Usuários</strong>
                  </Title>
                  {respUsers?.items?.map((result) => (
                    <div key={result.id}>
                      <Link
                        href={`/painel/${user?.partner_state?.slug}/usuario-admin/${result.id}`}
                        passHref
                      >
                        <Text>{result.name}</Text>
                      </Link>
                    </div>
                  ))}
                </>
              )}
              {respPerfil?.items?.length > 0 && (
                <>
                  <hr />
                  <Title>
                    <strong>Perfil de Acesso</strong>
                  </Title>
                  {respPerfil?.items?.map((result) => (
                    <div key={result.id}>
                      <Link
                        href={`/painel/${user?.partner_state?.slug}/perfil-de-acesso/editar/${result.id}`}
                        passHref
                      >
                        <Text>{result.name}</Text>
                      </Link>
                    </div>
                  ))}
                </>
              )}
              {regionais.length > 0 && (
                <>
                  <hr />
                  <Title>
                    <strong>Regionais Parceiras</strong>
                  </Title>
                  {regionais.map((result) => (
                    <div key={result.id}>
                      <Link
                        href={`/painel/${user?.partner_state?.slug}/regional-parceira/editar/${result.id}`}
                        passHref
                      >
                        <Text>{result.name}</Text>
                      </Link>
                    </div>
                  ))}
                </>
              )}
              {respWorkPlan?.items?.length > 0 && (
                <>
                  <hr />
                  <Title>
                    <strong>Planos de Trabalho</strong>
                  </Title>
                  {respWorkPlan?.items?.map((result) => (
                    <div key={result.id}>
                      <Link
                        href={`/painel/${user?.partner_state?.slug}/aprovacoes-de-planos-de-trabalho/${result.id}`}
                        passHref
                      >
                        <Text>{result?.scholar?.name}</Text>
                      </Link>
                    </div>
                  ))}
                </>
              )}
              {respReport?.items?.length > 0 && (
                <>
                  <hr />
                  <Title>
                    <strong>Relatórios Mensais</strong>
                  </Title>
                  {respReport?.items?.map((result) => (
                    <div key={result.id}>
                      <Link
                        href={`/painel/${user?.partner_state?.slug}/aprovacao-de-relatorios/${result.id}`}
                        passHref
                      >
                        <Text>{result?.scholar?.user?.name}</Text>
                      </Link>
                    </div>
                  ))}
                </>
              )}
              {respScholars?.items?.length > 0 && (
                <>
                  <hr />
                  <Title>
                    <strong>Bolsistas</strong>
                  </Title>
                  {respScholars?.items?.map((result) => (
                    <div key={result.id}>
                      <Link
                        href={`/painel/${user?.partner_state?.slug}/aprovacao-de-cadastro-do-bolsista/${result.id}`}
                        passHref
                      >
                        <Text>{result?.user?.name}</Text>
                      </Link>
                    </div>
                  ))}
                </>
              )}
              {respTerm?.items?.length > 0 && (
                <>
                  <hr />
                  <Title>
                    <strong>Termo de Compromisso</strong>
                  </Title>
                  {respTerm?.items?.map((result) => (
                    <div key={result.id}>
                      <Link
                        href={`/painel/${user?.partner_state?.slug}/termo-de-compromisso/${result.id}`}
                        passHref
                      >
                        <Text>{result?.scholar?.user?.name}</Text>
                      </Link>
                    </div>
                  ))}
                </>
              )}
            </RespBox>
          )}
        </div>
      </Form.Group>
    </FormStyled>
  );
}
