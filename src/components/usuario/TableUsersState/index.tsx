import * as React from 'react';
import { useState, useEffect, useRef, useContext } from 'react';
import { saveAs } from 'file-saver';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import {
  getExportUsersStateExcel,
  IGetUser,
  useGetUsers,
} from 'src/services/usuarios.service';
import { Container, TopContainer } from './styledComponents';
import {
  FilterSelectedContainer,
  Marker,
  InputSearch,
  IconSearch,
  TableCellBorder,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  ButtonStyled,
  TableCellStyled,
  TableRowStyled,
  TableSortLabelStyled,
  Status,
  Circle,
} from 'src/shared/styledTables';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  MdOutlineFilterAlt,
  MdNavigateNext,
  MdNavigateBefore,
} from 'react-icons/md';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import Link from 'next/link';
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { ButtonMenu } from 'src/components/ButtonMenu';
import { useGeneratePdf } from 'src/utils/generatePdf';
import { ThemeContext } from 'src/context/ThemeContext';
import Router from 'next/router';
import { useAuth } from 'src/context/AuthContext';
import { getRegionais, IGetRegional } from 'src/services/regionais.service';
import { Loading } from 'src/components/Loading';

interface Data {
  id: string;
  name: string;
  email: string;
  perfil: string;
  perfilType: string;
  city: string;
  regionalPartner: string;
  active: boolean;
}

function createData(
  id: string,
  name: string,
  email: string,
  perfil: string,
  perfilType: string,
  city: string,
  regionalPartner: string,
  active: boolean,
): Data {
  return {
    id,
    name,
    email,
    perfil,
    perfilType,
    city,
    regionalPartner,
    active,
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    label: 'NOME',
  },
  {
    id: 'email',
    numeric: false,
    label: 'EMAIL',
  },
  {
    id: 'perfil',
    numeric: false,
    label: 'PERFIL',
  },
  {
    id: 'perfilType',
    numeric: false,
    label: 'TIPO DO PERFIL',
  },
  {
    id: 'city',
    numeric: false,
    label: 'MUNICÍPIO',
  },
  {
    id: 'regionalPartner',
    numeric: false,
    label: 'REGIONAL',
  },
  {
    id: 'active',
    numeric: false,
    label: 'STATUS',
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void;
  order: 'asc' | 'desc';
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCellStyled
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id === 'name' ? (
              <TableSortLabelStyled
                active={orderBy === headCell.id}
                direction={order === 'asc' ? 'desc' : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabelStyled>
            ) : (
              <div style={{ fontWeight: 600 }}>{headCell.label}</div>
            )}
          </TableCellStyled>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function TableUsersStates({ url }) {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy] = useState('name');
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedRegional, setSelectedRegional] = useState(null);
  const [regionais, setRegionais] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [listType, setListType] = useState([
    { name: 'Bolsista', value: 'BOLSISTA' },
    { name: 'Admin', value: 'ADMIN' },
  ]);
  const [selectedPerfilType, setSelectedPerfilType] = useState(null);
  const [filterRegional, setFilterRegional] = useState(null);
  const [filterCity, setFilterCity] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterPerfilType, setFilterPerfilType] = useState(null);
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const { mobile } = useContext(ThemeContext);
  const { user } = useAuth();
  const [isRegionalDisabled, setIsRegionalDisabled] = useState(true);
  const [isCityDisabled, setIsCityDisabled] = useState(true);
  const [isPerfilTypeDisabled, setIsPerfilTypeDisabled] = useState(false);

  const { data, isLoading: isLoadingUsers } = useGetUsers({
    search: search,
    page: page,
    limit: limit,
    order: order.toUpperCase(),
    status: filterStatus,
    role: 'ESTADO',
    idRegionalPartner: filterRegional?.id,
    city: filterCity,
    profileType: filterPerfilType,
  });

  useEffect(() => {
    const list = [];

    setQntPage(data?.meta?.totalPages);

    data?.items?.map((x) => {
      list.push(
        createData(
          x.id,
          x.name,
          x.email,
          x?.access_profile?.name,
          x?.subRole,
          x.city,
          x?.regionalPartner?.name,
          x.active,
        ),
      );
    });
    setRows(list);
  }, [data?.items, data?.meta?.totalPages]);

  const { componentRef, handlePrint } = useGeneratePdf();

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setSelectedColumn(property);
  };

  useEffect(() => {
    setDisablePrev(page === 1 ? true : false);
    setDisableNext(page === qntPage ? true : false);
  }, [qntPage, page]);

  const handleChangePage2 = (direction) => {
    if (direction === 'prev') {
      setPage(page - 1);
    } else {
      setPage(page + 1);
    }
  };
  const handleChangeLimit = (event) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
  };

  const [rows, setRows] = useState([]);
  const tableBody = useRef();

  const loadRegionais = async () => {
    const data: IGetRegional = {
      search: null,
      page: 1,
      limit: 99999,
      order: 'ASC',
      status: 1,
    };
    const resp = await getRegionais(data);
    setRegionais(resp.data.items);
  };

  useEffect(() => {
    if (user?.access_profile?.role === 'ESTADO' || user?.subRole === 'ADMIN') {
      loadRegionais();
      setIsRegionalDisabled(false);
      // if (user?.access_profile?.role === 'ESTADO') {
      //   setListType([
      //     {
      //       name: 'Admin',
      //       value: 'ADMIN',
      //     },
      //   ]);
      //   setSelectedPerfilType({
      //     name: 'Admin',
      //     value: 'ADMIN',
      //   });
      //   setIsPerfilTypeDisabled(true);
      // }
    }
    if (user?.access_profile?.role === 'REGIONAL') {
      setRegionais([user?.regionalPartner]);
      setSelectedRegional(user?.regionalPartner);
      setFilterRegional(user?.regionalPartner);
      setCities(user?.regionalPartner?.cities);
      setIsCityDisabled(false);
    }
    if (user?.access_profile?.role === 'MUNICIPIO') {
      setSelectedRegional(user?.regionalPartner);
      setFilterRegional(user?.regionalPartner);
      setSelectedCity(user?.city);
      setFilterCity(user?.city);

      setCities([user?.city]);

      setListType([
        {
          name: 'Bolsista',
          value: 'BOLSISTA',
        },
      ]);
      setSelectedPerfilType({
        name: 'Bolsista',
        value: 'BOLSISTA',
      });
      setIsPerfilTypeDisabled(true);
    }
  }, [user]);

  const handleSelectRegional = (newValue) => {
    setSelectedRegional(newValue);
    setCities(newValue?.cities);
    setIsCityDisabled(false);
  };

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSelectStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  const filterSelected = () => {
    setPage(1);
    setFilterStatus(selectedStatus);
    setFilterPerfilType(selectedPerfilType?.value);
    setFilterCity(selectedCity);
    setFilterRegional(selectedRegional);
  };

  const changeShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;
    return (
      <Link
        href={`/painel/${user?.partner_state?.slug}/usuario-admin/${row.id}`}
        key={row.id}
        passHref
      >
        <TableRowStyled role="checkbox" tabIndex={-1}>
          <TableCell component="th" id={labelId} scope="row" padding="normal">
            {row.name}
          </TableCell>
          <TableCellBorder>{row.email}</TableCellBorder>
          <TableCellBorder>{row.perfil}</TableCellBorder>
          <TableCellBorder>
            {row.perfilType === 'BOLSISTA' ? 'Bolsista' : 'Admin'}
          </TableCellBorder>
          <TableCellBorder>{row.city ? row.city : 'N/A'}</TableCellBorder>
          <TableCellBorder>
            {row.regionalPartner ? row.regionalPartner : 'N/A'}
          </TableCellBorder>
          <TableCellBorder>
            {row.active ? (
              <Status status={row.active}>
                <Circle color={row.active} />
                <div>Ativo</div>
                <div />
              </Status>
            ) : (
              <Status>
                <Circle color={row.active} />
                <div>Inativo</div>
                <div />
              </Status>
            )}
            {row.active}
          </TableCellBorder>
        </TableRowStyled>
      </Link>
    );
  };

  const downloadCsv = async () => {
    const resp = await getExportUsersStateExcel({
      page: 1,
      limit: 10,
      order: order?.toUpperCase(),
      search: search,
      role: 'ESTADO',
      idRegionalPartner: filterRegional?.id,
      city: filterCity,
      status: filterStatus,
    } as IGetUser);
    saveAs(resp?.data, 'Usuários Admin');
  };

  return (
    <>
      <Container>
        {mobile && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ marginRight: 30, padding: 10 }}>
              <ButtonMenu handlePrint={null} handleCsv={downloadCsv} />
            </div>
            <div style={{ width: 163, padding: 10 }}>
              <ButtonDefault
                onClick={() => {
                  Router.push(
                    `/painel/${user?.partner_state?.slug}/usuario-admin`,
                  );
                }}
              >
                Adicionar Usuário
              </ButtonDefault>
            </div>
          </div>
        )}
        <TopContainer>
          <div className="d-flex mb-2">
            <OverlayTrigger
              key={'toolTip'}
              placement={'top'}
              overlay={<Tooltip id={`tooltip-top`}>Filtro Avançado</Tooltip>}
            >
              <Marker onClick={changeShowFilter}>
                <MdOutlineFilterAlt color="#FFF" size={24} />
              </Marker>
            </OverlayTrigger>
            <div className="d-flex flex-row-reverse align-items-center ">
              <InputSearch
                size={16}
                type="text"
                placeholder="Pesquise"
                name="searchTerm"
                onChange={handleChangeSearch}
                mobile={mobile}
              />
              <IconSearch color={'#7C7C7C'} />
            </div>
          </div>
          {!mobile && (
            <div style={{ display: 'flex' }}>
              <div style={{ marginRight: 30 }}>
                <ButtonMenu handlePrint={null} handleCsv={downloadCsv} />
              </div>
              {user?.access_profile?.role !== 'MUNICIPIO' && (
                <div>
                  <ButtonDefault
                    onClick={() => {
                      Router.push(
                        `/painel/${user?.partner_state?.slug}/usuario-admin`,
                      );
                    }}
                  >
                    Adicionar Usuário
                  </ButtonDefault>
                </div>
              )}
            </div>
          )}
        </TopContainer>
        {showFilter && (
          <FilterSelectedContainer>
            <div className="me-2">
              <Autocomplete
                sx={{ width: 142, backgroundColor: '#FFFFFF' }}
                className="col me-1"
                id="size-small-outlined"
                size="small"
                noOptionsText="Regional"
                options={regionais}
                value={selectedRegional}
                getOptionLabel={(option) => option.name}
                onChange={(_event, newValue) => {
                  handleSelectRegional(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Regional" />
                )}
                disabled={isRegionalDisabled}
              />
            </div>
            <div className="pe-2 me-2 border-end border-white">
              <Autocomplete
                sx={{ width: 142, backgroundColor: '#FFFFFF' }}
                className="col me-1"
                id="size-small-outlined"
                size="small"
                noOptionsText="Município"
                value={selectedCity}
                options={cities}
                onChange={(_event, newValue) => {
                  setSelectedCity(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Município" />
                )}
                disabled={isCityDisabled}
              />
            </div>
            <div className="me-2">
              <FormControl
                fullWidth
                size="small"
                style={{ width: 142, backgroundColor: '#FFFFFF' }}
              >
                <InputLabel id="Status">Status</InputLabel>
                <Select
                  labelId="Status"
                  id="Status"
                  value={selectedStatus}
                  label="Status"
                  onChange={(e) => handleSelectStatus(e)}
                >
                  <MenuItem value={null}>Todos</MenuItem>
                  <MenuItem value={1}>Ativo</MenuItem>
                  <MenuItem value={0}>Inativo</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="pe-2 me-2 border-end border-white">
              <Autocomplete
                sx={{ width: 142, backgroundColor: '#FFFFFF' }}
                className="col me-1"
                id="size-small-outlined"
                size="small"
                noOptionsText="Tipo"
                options={listType}
                value={selectedPerfilType}
                getOptionLabel={(option) => option.name}
                onChange={(_event, newValue) => {
                  setSelectedPerfilType(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Tipo" />
                )}
                disabled={isPerfilTypeDisabled}
              />
            </div>
            <div>
              <ButtonStyled
                onClick={() => {
                  filterSelected();
                }}
              >
                Filtrar
              </ButtonStyled>
            </div>
          </FilterSelectedContainer>
        )}
        <Box sx={{ width: '100%' }}>
          <Paper
            sx={{
              width: '100%',
              mb: 2,
              borderBottomLeftRadius: '10px',
              borderBottomRightRadius: '10px',
            }}
          >
            {isLoadingUsers ? (
              <Loading />
            ) : (
              <TableContainer>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={'medium'}
                >
                  <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                  />
                  <TableBody id="tableBody" ref={tableBody}>
                    {rows.map((row, index) => {
                      return setRow(row, index);
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <Pagination>
              Linhas por página:
              <FormSelectStyled value={limit} onChange={handleChangeLimit}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </FormSelectStyled>
              <p
                style={{
                  marginLeft: '25px',
                }}
              ></p>
              {page} - {qntPage}
              <p
                style={{
                  marginRight: '25px',
                }}
              ></p>
              <ButtonPage
                onClick={() => handleChangePage2('prev')}
                disabled={disablePrev}
              >
                <MdNavigateBefore size={24} />
              </ButtonPage>
              <ButtonPage
                onClick={() => handleChangePage2('next')}
                disabled={disableNext}
              >
                <MdNavigateNext size={24} />
              </ButtonPage>
            </Pagination>
          </Paper>
        </Box>
      </Container>

      <GeneratedPdf componentRef={componentRef}>
        <Container>
          <Box sx={{ width: '100%' }}>
            <Paper
              sx={{
                width: '100%',
                mb: 2,
                borderBottomLeftRadius: '10px',
                borderBottomRightRadius: '10px',
              }}
            >
              <TableContainer>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={'medium'}
                >
                  <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                  />
                  <TableBody id="tableBody" ref={tableBody}>
                    {rows.map((row, index) => {
                      return setRow(row, index);
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Pagination>
                Linhas por página:
                <FormSelectStyled value={limit} onChange={handleChangeLimit}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </FormSelectStyled>
                <p
                  style={{
                    marginLeft: '25px',
                  }}
                ></p>
                {page} - {qntPage}
                <p
                  style={{
                    marginRight: '25px',
                  }}
                ></p>
                <ButtonPage
                  onClick={() => handleChangePage2('prev')}
                  disabled={disablePrev}
                >
                  <MdNavigateBefore size={24} />
                </ButtonPage>
                <ButtonPage
                  onClick={() => handleChangePage2('next')}
                  disabled={disableNext}
                >
                  <MdNavigateNext size={24} />
                </ButtonPage>
              </Pagination>
            </Paper>
          </Box>
        </Container>
      </GeneratedPdf>
    </>
  );
}

function GeneratedPdf({ componentRef, children }) {
  return (
    <div className="pdf">
      <div ref={componentRef} className="print-container">
        <h3 style={{ margin: '8px' }}>Usuários do Estado</h3>
        <br />
        {children}
      </div>
    </div>
  );
}
