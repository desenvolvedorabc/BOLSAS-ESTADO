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
  Marker,
  FilterSelectedContainer,
  ButtonStyled,
} from 'src/shared/styledTables';
import {
  MdNavigateNext,
  MdNavigateBefore,
  MdOutlineFilterAlt,
  MdOutlineFileDownload,
} from 'react-icons/md';

import { ThemeContext } from 'src/context/ThemeContext';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Autocomplete, TextField } from '@mui/material';
import { Loading } from 'src/components/Loading';
import { getMonths } from 'src/utils/anos';
import { useGetBankRemittances } from 'src/services/bank';
import { useGetRegionais } from 'src/services/regionais.service';
import ModalBank from '../modalBank';

interface Data {
  id: string;
  name: string;
  scholarsQuantity: string;
  totalValue: string;
  bankRemittance: string;
}

function createData(
  id: string,
  name: string,
  scholarsQuantity: string,
  totalValue: string,
  bankRemittance: string,
): Data {
  return {
    id,
    name,
    scholarsQuantity,
    totalValue,
    bankRemittance,
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
    label: 'NOME DA REGIONAL',
  },
  {
    id: 'scholarsQuantity',
    numeric: false,
    label: 'QUANTIDADE DE BOLSISTAS',
  },
  {
    id: 'totalValue',
    numeric: false,
    label: 'VALOR TOTAL',
  },
  {
    id: 'bankRemittance',
    numeric: true,
    label: 'REMESSA BANCÁRIA',
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
            align={headCell.numeric ? 'center' : 'left'}
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

export default function TableBankRemittance() {
  const date = new Date();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState(null);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [filterMonth, setFilterMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());
  const [filterYear, setFilterYear] = useState(date.getFullYear());
  const [selectedRemittance, setSelectedRemittance] = useState(null);
  const [selectedRegional, setSelectedRegional] = useState(null);
  const [filterRegional, setFilterRegional] = useState(null);
  const [modalShowRemittance, setModalShowRemittance] = useState(false);
  const { mobile } = useContext(ThemeContext);
  const monthList = getMonths();

  const handleRequestSort = () => {
    const isAsc = order === 'asc';
    const formattedOrder = isAsc ? 'desc' : 'asc';
    setOrder(formattedOrder);
    setPage(1);
  };

  const { data, isLoading: isLoading } = useGetBankRemittances({
    search: search,
    page: page,
    limit: limit,
    order: order.toUpperCase(),
    year: filterYear,
    month: filterMonth,
    regionalPartnerId: filterRegional,
  });

  const { data: listRegionais, isLoading: isLoadingRegionais } =
    useGetRegionais({
      search: null,
      page: 1,
      limit: 9999999,
      order: 'ASC',
      status: 1,
    });

  useEffect(() => {
    const list = [];

    setQntPage(data?.meta?.totalPages);

    data?.items?.map((x) => {
      list.push(
        createData(
          x.id,
          x?.name,
          x.totalScholars,
          x.totalScholarshipValueInCents,
          null,
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

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSelectYear = (newValue) => {
    setSelectedYear(newValue);
  };

  const handleSelectMonth = (newValue) => {
    setSelectedMonth(newValue);
  };

  const handleSelectRegional = (newValue) => {
    setSelectedRegional(newValue);
  };

  const filterSelected = () => {
    setFilterYear(selectedYear);
    setFilterMonth(selectedMonth?.number);
    setFilterRegional(selectedRegional?.id);
    setPage(1);
  };

  const handleOpenModal = (remittance) => {
    setSelectedRemittance(remittance);
    setModalShowRemittance(true);
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
              id="referenceYear"
              size="small"
              noOptionsText="Ano de Referência"
              value={selectedYear}
              options={[
                date.getFullYear() - 1,
                date.getFullYear(),
                date.getFullYear() + 1,
              ]}
              // getOptionLabel={(option) => option.nome}
              onChange={(_event, newValue) => {
                handleSelectYear(newValue);
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Ano de Referência" />
              )}
              sx={{ width: 142, backgroundColor: '#fff' }}
            />
          </div>
          <div className="pe-2 me-2 border-end border-white">
            <Autocomplete
              id="month"
              size="small"
              noOptionsText="Mês"
              value={selectedMonth}
              options={monthList}
              getOptionLabel={(option) => option.name}
              onChange={(_event, newValue) => {
                handleSelectMonth(newValue);
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Mês" />
              )}
              sx={{ width: 142, backgroundColor: '#fff' }}
            />
          </div>
          <div className="pe-2 me-2 border-end border-white">
            <Autocomplete
              id="month"
              size="small"
              noOptionsText="Regional"
              value={selectedRegional}
              options={listRegionais?.items}
              getOptionLabel={(option) => option.name}
              onChange={(_event, newValue) => {
                handleSelectRegional(newValue);
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} label="Regional" />
              )}
              sx={{ width: 142, backgroundColor: '#fff' }}
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
                      <TableRowStyled
                        key={row.id}
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="normal"
                        >
                          {row.name}
                        </TableCell>
                        <TableCellBorder>
                          {row.scholarsQuantity}
                        </TableCellBorder>
                        <TableCellBorder>
                          {row.totalValue?.toLocaleString('pt-BR')}
                        </TableCellBorder>
                        <TableCellBorder align="center">
                          <button
                            type="button"
                            onClick={() => handleOpenModal(row.id)}
                          >
                            <MdOutlineFileDownload
                              size={26}
                              color={'#3D0330'}
                            />
                          </button>
                        </TableCellBorder>
                      </TableRowStyled>
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
      <ModalBank
        show={modalShowRemittance}
        onHide={() => setModalShowRemittance(false)}
        idRegionalPartner={selectedRemittance}
        month={filterMonth}
        year={filterYear}
      />
    </Container>
  );
}
