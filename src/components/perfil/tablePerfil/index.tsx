import { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { Container, TopContainer } from './styledComponents';
import {
  InputSearch,
  IconSearch,
  TableCellBorder,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  TableCellStyled,
  TableRowStyled,
  TableSortLabelStyled,
  Status,
  Circle,
  Marker,
  FilterSelectedContainer,
  ButtonStyled,
} from 'src/shared/styledTables';
import {
  MdNavigateNext,
  MdNavigateBefore,
  MdOutlineFilterAlt,
} from 'react-icons/md';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';

import Router from 'next/router';
import Link from 'next/link';
import { ProfileRole, useGetPerfis } from 'src/services/perfis.service';
import { ThemeContext } from 'src/context/ThemeContext';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Loading } from 'src/components/Loading';
import { useAuth } from 'src/context/AuthContext';

interface Data {
  id: string;
  createdByUser: string;
  name: string;
  perfil: string;
  areas: string;
  status: boolean;
}

function createData(
  id: string,
  createdByUser: string,
  name: string,
  perfil: string,
  areas: string,
  status: boolean,
): Data {
  return {
    id,
    createdByUser,
    name,
    perfil,
    areas,
    status,
  };
}

interface HeadCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'perfil',
    numeric: false,
    label: 'HIERARQUIA DE ACESSO',
  },
  {
    id: 'name',
    numeric: false,
    label: 'NOME DO PERFIL',
  },
  {
    id: 'createdByUser',
    numeric: false,
    label: 'CRIADO POR',
  },
  {
    id: 'areas',
    numeric: false,
    label: 'ÁREAS HABILITADAS',
  },
  {
    id: 'status',
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

export default function TablePerfil() {
  const { state } = useContext(ThemeContext);
  const { user } = useAuth();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [listProfiles, setListProfiles] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterProfile, setFilterProfile] = useState(null);
  const { mobile } = useContext(ThemeContext);
  const handleRequestSort = () => {
    const isAsc = order === 'asc';
    const formattedOrder = isAsc ? 'desc' : 'asc';
    setOrder(formattedOrder);
    setPage(1);
  };

  const { data, isLoading: isLoading } = useGetPerfis({
    search: search,
    page: page,
    limit: limit,
    order: order.toUpperCase(),
    accessProfileRole: filterProfile,
    status: filterStatus,
    forApproveScholar: null,
  });

  useEffect(() => {
    const list = [];

    setQntPage(data?.meta?.totalPages);

    data?.items?.map((x) => {
      list.push(
        createData(
          x.id,
          x.createdByUser?.name,
          x.name,
          x.role,
          getAreas(x.areas),
          x.active,
        ),
      );
    });
    setRows(list);
  }, [data?.items, data?.meta?.totalPages]);

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

  const changeShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const [rows, setRows] = useState([]);

  const getAreas = (areasList) => {
    let list = '';
    areasList.map((x, index) => {
      if (index != areasList.length - 1) list = list.concat(x.name, ', ');
      else list = list.concat(x.name);
    });

    return list;
  };

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSelectProfile = (newValue) => {
    setSelectedProfile(newValue);
  };

  const handleSelectStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  const filterSelected = () => {
    setFilterProfile(selectedProfile);
    setFilterStatus(selectedStatus);
    setPage(1);
  };

  useEffect(() => {
    if (user?.subRole === 'ADMIN') {
      setListProfiles(['BOLSISTA', 'MUNICIPIO', 'REGIONAL', 'ESTADO']);
    } else if (user?.access_profile?.role === 'ESTADO') {
      setListProfiles(['MUNICIPIO', 'REGIONAL']);
    } else if (user?.access_profile?.role === 'REGIONAL') {
      setListProfiles(['BOLSISTA', 'MUNICIPIO']);
    } else if (user?.access_profile?.role === 'MUNICIPIO') {
      setListProfiles(['BOLSISTA']);
      setSelectedProfile('BOLSISTA');
    }
  }, [user]);

  return (
    <Container>
      {mobile && (
        <div style={{ width: 163, padding: 10 }}>
          <ButtonDefault
            onClick={() => {
              Router.push(`/painel/${state.slug}/perfil-de-acesso`);
            }}
          >
            Adicionar Perfil
          </ButtonDefault>
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
          <div>
            <ButtonDefault
              onClick={() => {
                Router.push(`/painel/${state.slug}/perfil-de-acesso`);
              }}
            >
              Adicionar Perfil
            </ButtonDefault>
          </div>
        )}
      </TopContainer>
      {showFilter && (
        <FilterSelectedContainer>
          <div className="me-2">
            <Autocomplete
              id="Profile"
              size="small"
              fullWidth
              noOptionsText="Hierarquia de acessoo"
              value={selectedProfile}
              options={listProfiles}
              onChange={(_event, newValue) => {
                handleSelectProfile(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  size="small"
                  {...params}
                  label="Hierarquia de acesso"
                />
              )}
              disabled={user?.access_profile?.role === 'MUNICIPIO'}
              sx={{
                backgroundColor: '#fff',
                width: 142,
              }}
            />
            {/* <FormControl
              fullWidth
              size="small"
              style={{ width: 142, backgroundColor: '#FFFFFF' }}
            >
              <InputLabel id="Status">Hierarquia de acesso</InputLabel>
              <Select
                labelId="Profile"
                id="Profile"
                value={selectedProfile}
                label="Hierarquia de acesso"
                onChange={(e) => handleSelectProfile(e)}
                disabled={user?.access_profile?.role === 'MUNICIPIO'}
              >
                <MenuItem value={null}>Todos</MenuItem>
                {listProfiles.map((role) => {
                  return (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl> */}
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
          {isLoading ? (
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

                <TableBody>
                  {rows.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <Link
                        href={`/painel/${state?.slug}/perfil-de-acesso/editar/${row.id}`}
                        key={row.id}
                        passHref
                      >
                        <TableRowStyled role="checkbox" tabIndex={-1}>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="normal"
                          >
                            {row.perfil}
                          </TableCell>
                          <TableCellBorder>{row.name}</TableCellBorder>
                          <TableCellBorder>{row.createdByUser}</TableCellBorder>
                          <TableCellBorder style={{ maxWidth: '15.625rem' }}>
                            {row.areas}
                          </TableCellBorder>
                          <TableCellBorder>
                            {row.status ? (
                              <Status status={row.status}>
                                <Circle color={row.status} />
                                <div>Ativo</div>
                                <div />
                              </Status>
                            ) : (
                              <Status>
                                <Circle color={row.status} />
                                <div>Inativo</div>
                                <div />
                              </Status>
                            )}
                            {row.active}
                          </TableCellBorder>
                        </TableRowStyled>
                      </Link>
                    );
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
  );
}
