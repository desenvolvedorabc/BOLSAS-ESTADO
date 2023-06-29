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
import Link from 'next/link';
import { Autocomplete, TextField } from '@mui/material';
import { useAuth } from 'src/context/AuthContext';
import { ThemeContext } from 'src/context/ThemeContext';
import Router from 'next/router';
import { StatusReport, maskCPF } from 'src/utils/masks';
import { getApproveScholarshipsQuery } from 'src/services/bolsista.service';
import { useQuery } from 'react-query';
import { getRegionais, IGetRegional } from 'src/services/regionais.service';
import { visuallyHidden } from '@mui/utils';

interface Data {
  id: string;
  name: string;
  email: string;
  cpf: string;
  city: string;
  regional: string;
  status: string;
}

function createData(
  id: string,
  name: string,
  email: string,
  cpf: string,
  city: string,
  regional: string,
  status: string,
): Data {
  return {
    id,
    name,
    email,
    cpf,
    city,
    regional,
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
    id: 'cpf',
    numeric: false,
    label: 'CPF',
  },
  {
    id: 'city',
    numeric: false,
    label: 'MUNICÍPIO',
  },
  {
    id: 'regional',
    numeric: false,
    label: 'REGIONAL',
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

export function TableAcceptScholarship() {
  const { user } = useAuth();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy] = useState('name');
  const [selectedMun, setSelectedMun] = useState(null);
  const [city, setCity] = useState(null);
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [search, setSearch] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const { mobile } = useContext(ThemeContext);
  const [listCity, setListCity] = useState([]);

  const [rows, setRows] = useState([]);
  const tableBody = useRef();

  const { data } = useQuery(
    ['approveScholars', { search, page, limit, order, city }],
    () =>
      getApproveScholarshipsQuery({
        search,
        page,
        limit,
        order: order?.toUpperCase(),
        city,
      }),
    {
      staleTime: 1000 * 60 * 60, // 1 minuto
    },
  );

  useEffect(() => {
    setQntPage(data?.meta?.totalPages);

    const list = [];
    data?.items?.map((x) => {
      list.push(
        createData(
          x.id,
          x.user?.name,
          x?.user?.email,
          x?.user?.cpf ? maskCPF(x?.user?.cpf) : '',
          x?.user?.city,
          x?.user?.regionalPartner?.name,
          StatusReport[x.statusRegistration],
        ),
      );
    });

    setRows(list);
  }, [data]);

  useEffect(() => {
    if (user?.access_profile?.role === 'ESTADO' || user?.subRole === 'ADMIN') {
      loadRegionais();
    }
    if (user?.access_profile?.role === 'REGIONAL') {
      setListCity(user?.regionalPartner?.cities);
    }
    if (user?.access_profile?.role === 'MUNICIPIO') {
      setListCity([user?.city]);
      setSelectedMun(user?.city);
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
    // setSelectedColumn(property);
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

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSelectMun = (newValue) => {
    setSelectedMun(newValue);
  };

  const filterSelected = () => {
    setPage(1);
    setCity(selectedMun);
  };

  const changeShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const setRow = (row, index) => {
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <Link
        href={`/painel/${user?.partner_state?.slug}/aprovacao-de-cadastro-do-bolsista/${row.id}`}
        key={row.id}
        passHref
      >
        <TableRowStyled role="checkbox" tabIndex={-1}>
          <TableCell component="th" id={labelId} scope="row" padding="normal">
            {row.name}
          </TableCell>
          <TableCellBorder>{row.email}</TableCellBorder>
          <TableCellBorder>{row.cpf}</TableCellBorder>
          <TableCellBorder>{row.city}</TableCellBorder>
          <TableCellBorder>{row.regional}</TableCellBorder>
          <TableCellBorder>{row.status}</TableCellBorder>
        </TableRowStyled>
      </Link>
    );
  };

  return (
    <Container>
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
      </TopContainer>
      {showFilter && (
        <FilterSelectedContainer>
          <div className="pe-2 me-2 border-end border-white">
            <Autocomplete
              id="city"
              size="small"
              noOptionsText="Município"
              value={selectedMun}
              options={listCity}
              // getOptionLabel={(option) => option.nome}
              onChange={(_event, newValue) => {
                handleSelectMun(newValue);
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Município" />
              )}
              sx={{ width: 142, backgroundColor: '#fff' }}
              disabled={user?.access_profile?.role === 'MUNICIPIO'}
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
  );
}
