import * as React from 'react';
import { useState, useEffect, useRef, useContext } from 'react';
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
} from 'src/shared/styledTables';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  MdOutlineFilterAlt,
  MdNavigateNext,
  MdNavigateBefore,
} from 'react-icons/md';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import Link from 'next/link';
import { Autocomplete, TextField } from '@mui/material';
import { ThemeContext } from 'src/context/ThemeContext';
import Router from 'next/router';
import { useAuth } from 'src/context/AuthContext';
import { Loading } from 'src/components/Loading';
import { useGetContract } from 'src/services/contract';
import { format } from 'date-fns';
import { IGetRegional, getRegionais } from 'src/services/regionais.service';

interface Data {
  id: string;
  name: string;
  createdAt: string;
  status: boolean;
}

function createData(
  id: string,
  name: string,
  createdAt: string,
  status: boolean,
): Data {
  return {
    id,
    name,
    createdAt,
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
    id: 'id',
    numeric: false,
    label: 'N° TERMO DE COMPROMISSO',
  },
  {
    id: 'name',
    numeric: false,
    label: 'NOME',
  },
  {
    id: 'createdAt',
    numeric: false,
    label: 'DATA CRIAÇÃO',
  },
  {
    id: 'status',
    numeric: false,
    label: 'STATUS',
  },
];

enum StatusName {
  ASSINADO = 'Assinado',
  PENDENTE_ASSINATURA = 'Pendente Assinatura',
  INATIVADO = 'Inativado',
  CANCELADO = 'Cancelado',
}

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

export function TableContractAdhesion({ url }) {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy] = useState('name');
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filterCity, setFilterCity] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [listCity, setListCity] = useState([]);
  const { mobile } = useContext(ThemeContext);
  const { user } = useAuth();

  const { data, isLoading: isLoadingUsers } = useGetContract({
    search: search,
    page: page,
    limit: limit,
    order: order.toUpperCase(),
    status: filterStatus,
    city: filterCity,
  });

  useEffect(() => {
    const list = [];

    setQntPage(data?.meta?.totalPages);

    data?.items?.map((x) => {
      list.push(createData(x.id, x.scholar?.user?.name, x.createdAt, x.status));
    });
    setRows(list);
  }, [data?.items, data?.meta?.totalPages]);

  useEffect(() => {
    if (user?.subRole === 'ADMIN') {
      loadRegionais();
    }
    if (user?.access_profile?.role === 'REGIONAL') {
      setListCity(user?.regionalPartner?.cities);
    }
  }, [user]);

  const loadRegionais = async () => {
    const data: IGetRegional = {
      page: 1,
      limit: 999999,
      order: 'ASC',
      status: 1,
    };
    const resp = await getRegionais(data);

    if (resp.data?.items) {
      const list = listCity;

      resp?.data?.items.forEach((item) => {
        item?.cities.forEach((city) => {
          if (!list.includes(city)) {
            list.push(city);
          }
        });
      });

      const sortedList = list.sort((a, b) => {
        if (a > b) return 1;
        else if (a < b) return -1;
        return 0;
      });
      setListCity(sortedList);
    }
  };

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

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const filterSelected = () => {
    setPage(1);
    setFilterStatus(selectedStatus);
    setFilterCity(selectedCity);
  };

  const changeShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;
    return (
      <Link
        href={`/painel/${user?.partner_state?.slug}/termo-de-compromisso/${row.id}`}
        key={row.id}
        passHref
      >
        <TableRowStyled role="checkbox" tabIndex={-1}>
          <TableCell component="th" id={labelId} scope="row" padding="normal">
            {row.id}
          </TableCell>
          <TableCellBorder>{row.name}</TableCellBorder>
          <TableCellBorder>
            {format(new Date(row?.createdAt), 'dd/MM/yyyy')}
          </TableCellBorder>
          <TableCellBorder>{StatusName[row.status]}</TableCellBorder>
        </TableRowStyled>
      </Link>
    );
  };

  return (
    <>
      <Container>
        {mobile && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: 163, padding: 10 }}>
              <ButtonDefault
                onClick={() => {
                  Router.push(
                    `/painel/${user?.partner_state?.slug}/termo-de-compromisso/novo-termo`,
                  );
                }}
              >
                Adicionar Novo Termo
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
              <div>
                <ButtonDefault
                  onClick={() => {
                    Router.push(
                      `/painel/${user?.partner_state?.slug}/termo-de-compromisso/novo-termo`,
                    );
                  }}
                >
                  Adicionar Novo Termo
                </ButtonDefault>
              </div>
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
                noOptionsText="Status"
                value={selectedStatus}
                options={Object.keys(StatusName)}
                getOptionLabel={(option) => StatusName[option]}
                onChange={(_event, newValue) => {
                  setSelectedStatus(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Status" />
                )}
              />
            </div>
            <div className="pe-2 me-2 border-end border-white">
              <Autocomplete
                sx={{ width: 142, backgroundColor: '#FFFFFF' }}
                className="col me-1"
                id="size-small-outlined"
                size="small"
                noOptionsText="Município"
                options={listCity}
                value={selectedCity}
                onChange={(_event, newValue) => {
                  setSelectedCity(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" {...params} label="Município" />
                )}
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
    </>
  );
}
