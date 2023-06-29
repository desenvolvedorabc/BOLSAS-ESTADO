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
import {
  getExportExcelRegional,
  useGetRegionais,
} from 'src/services/regionais.service';
import { ThemeContext } from 'src/context/ThemeContext';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ButtonMenu } from 'src/components/ButtonMenu';
import { saveAs } from 'file-saver';
import { Loading } from 'src/components/Loading';
import { loadUf } from 'src/utils/combos';

interface Data {
  id: string;
  ibge: string;
  regional: string;
  status: boolean;
}

function createData(
  id: string,
  ibge: string,
  regional: string,
  status: boolean,
): Data {
  return {
    id,
    ibge,
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
    id: 'ibge',
    numeric: false,
    label: 'CÓDIGO IBGE',
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
            {headCell.id === 'regional' ? (
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
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('regional');
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [listUf, setListUf] = useState([]);
  const { mobile } = useContext(ThemeContext);
  const handleRequestSort = () => {
    const isAsc = order === 'asc';
    const formattedOrder = isAsc ? 'desc' : 'asc';
    setOrder(formattedOrder);
    setPage(1);
  };

  useEffect(() => {
    async function fetchAPI() {
      const ufs = await loadUf();
      setListUf(ufs);
    }
    fetchAPI();
  }, []);

  const { data, isLoading } = useGetRegionais({
    search: search,
    page: page,
    limit: limit,
    order: order?.toUpperCase(),
    status: filterStatus,
  });

  const getIbge = (abbreviation) => {
    const findUf = listUf.find((uf) => uf.sigla === abbreviation);

    if (findUf) return findUf.id;
  };

  useEffect(() => {
    const list = [];

    setQntPage(data?.meta?.totalPages);

    data?.items?.map((x) => {
      list.push(createData(x.id, getIbge(x.abbreviation), x.name, x.active));
    });
    setRows(list);
  }, [data?.items, data?.meta?.totalPages, listUf]);

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

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSelectStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  const filterSelected = () => {
    setFilterStatus(selectedStatus);
    setPage(1);
  };

  const downloadCsv = async () => {
    const resp = await getExportExcelRegional({
      page: 1,
      limit: 10,
      order: order?.toUpperCase(),
      search,
      status: selectedStatus,
    });
    saveAs(resp?.data, 'Regionais Parceiras');
  };

  return (
    <Container>
      {mobile && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ marginRight: 30, padding: 10 }}>
            <ButtonMenu handlePrint={null} handleCsv={downloadCsv} />
          </div>
          <div style={{ width: 163, padding: 10 }}>
            <ButtonDefault
              onClick={() => {
                Router.push(`/painel/${state.slug}/regional-parceira`);
              }}
            >
              Adicionar Regional
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
            <div>
              <ButtonDefault
                onClick={() => {
                  Router.push(`/painel/${state.slug}/regional-parceira`);
                }}
              >
                Adicionar Regional
              </ButtonDefault>
            </div>
          </div>
        )}
      </TopContainer>
      {showFilter && (
        <FilterSelectedContainer>
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
                        href={`/painel/${state?.slug}/regional-parceira/editar/${row.id}`}
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
                            {row.ibge}
                          </TableCell>
                          <TableCellBorder>{row.regional}</TableCellBorder>
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
