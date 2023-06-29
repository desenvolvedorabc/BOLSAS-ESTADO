/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { Container } from './styledComponents';
import {
  TableCellBorder,
  Pagination,
  FormSelectStyled,
  ButtonPage,
  TableCellStyled,
  TableSortLabelStyled,
} from 'src/shared/styledTables';
import {
  MdNavigateNext,
  MdNavigateBefore,
  MdOutlineDownload,
} from 'react-icons/md';
import { ModalActionDetail } from '../ModalActionDetail';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import { Autocomplete, TextField } from '@mui/material';
import { ModalResultDetail } from '../ModalResultDetail';
import InputFile from 'src/components/InputFile';
import { getMonthsName } from 'src/utils/anos';
import { ButtonDownload } from 'src/components/scholarshipRegistration/FormScholarshipApprove/styledComponents';
import { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface Data {
  date: string;
  action: string;
  actionDetail: string;
  result: string;
  status: string;
}

interface Props {
  actions: any[];
  edit: boolean;
  actionsReport;
  file: any;
  changeFile: (file: any) => void;
  url;
  isPdf?: boolean;
}

interface HeadCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: 'date',
    numeric: false,
    label: 'MÊS / ANO',
  },
  {
    id: 'action',
    numeric: false,
    label: 'AÇÃO',
  },
  {
    id: 'actionDetail',
    numeric: false,
    label: 'DETALHAMENTO',
  },
  {
    id: 'result',
    numeric: false,
    label: 'RESULTADOS',
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
  headCellsEdit: HeadCell[];
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort, headCellsEdit } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCellsEdit.map((headCell) => (
          <TableCellStyled
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id === 'date' ? (
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

export function TableResult({
  actions,
  edit,
  actionsReport,
  file,
  changeFile,
  url,
  isPdf,
}: Props) {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy] = useState('month');
  const [page, setPage] = useState(1);
  const [qntPage, setQntPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [modalShowActionDetail, setModalShowActionDetail] = useState(false);
  const [modalShowResultDetail, setModalShowResultDetail] = useState(false);
  const [action, setAction] = useState(null);
  const [rows, setRows] = useState([]);
  const [changedAction, setChangedAction] = useState(false);

  enum StatusName {
    EM_ANDAMENTO = 'Em andamento',
    CONCLUIDO = 'Concluído',
    NAO_REALIZADO = 'Não realizado',
  }

  const statusOptions = ['EM_ANDAMENTO', 'CONCLUIDO', 'NAO_REALIZADO'];

  const handleRequestSort = () => {
    const isAsc = order === 'asc';
    const formattedOrder = isAsc ? 'desc' : 'asc';
    setOrder(formattedOrder);
    setPage(1);
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

  async function loadActions() {
    if (actions?.length > 0) {
      let rowsPage;

      if (isPdf) {
        rowsPage = actions;
      } else {
        rowsPage = actions?.slice(
          limit * (page - 1),
          limit * (page - 1) + limit,
        );
      }

      if (order === 'asc')
        rowsPage = rowsPage.sort((a, b) => a.month - b.month);
      if (order === 'desc')
        rowsPage = rowsPage.sort((a, b) => b.month - a.month);

      setRows(rowsPage);
      const qnt = Math.ceil(actions.length / limit);

      if (isPdf) {
        setQntPage(1);
        setLimit(actions.length);
      } else {
        setQntPage(qnt > 0 ? qnt : 1);
      }
    } else {
      setRows([]);
      setQntPage(1);
    }
  }

  useEffect(() => {
    loadActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, page, limit, order]);

  const handleOpenModalDetail = (row) => {
    // const find = actionsReport.find(
    //   (action) => action.scheduleWorkPlanId === row.id,
    // );
    setModalShowActionDetail(true);
    setAction(row);
    setChangedAction(!changedAction);
  };

  const handleOpenModalResult = (row) => {
    setModalShowResultDetail(true);
    setAction(row);
    setChangedAction(!changedAction);
  };
  const handleChangeDetail = (id, detailing) => {
    actions.map((action) => {
      if (action.id === id) {
        action.detailing = detailing;
      }
    });
  };

  const handleChangeResult = (id, result) => {
    actions.map((action) => {
      if (action.id === id) {
        action.detailingResult = result.detailingResult;
        action.workloadInMinutes = result.workloadInMinutes;
        action.qntExpectedGraduates = result.qntExpectedGraduates;
        action.qntFormedGifts = result.qntFormedGifts;
        action.trainingModality = result.trainingModality;
        action.trainingDate = result.trainingDate;
      }
    });
  };

  const handleChangeStatus = (newValue, row) => {
    actions.map((action) => {
      if (action.id === row.id) {
        action.status = newValue;
      }
    });
    loadActions();
    actionsReport.map((action) => {
      if (action.scheduleWorkPlanId === row.id) {
        action.status = newValue;
      }
    });
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ width: 240, marginBottom: 20, backgroundColor: '#fff' }}>
          <InputFile
            onChange={(e) => changeFile(e)}
            disabled={!edit}
            acceptFile={'*'}
            label={'Arquivo de Comprovação'}
            error={null}
          />
        </div>
        {file && (
          <OverlayTrigger
            key={'toolTip_Arq'}
            placement={'bottom'}
            overlay={<Tooltip id={`tooltip-bottom`}>{file}</Tooltip>}
          >
            <ButtonDownload
              href={`${url}/monthly-reports/files/${file}`}
              target="_blank"
              rel="noreferrer"
            >
              <MdOutlineDownload size={20} />
            </ButtonDownload>
          </OverlayTrigger>
        )}
      </div>
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
                  headCellsEdit={headCells}
                />

                <TableBody>
                  {rows?.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        key={index}
                        role="checkbox"
                        tabIndex={-1}
                        style={{ width: '100%' }}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="normal"
                        >
                          {getMonthsName(row?.scheduleWorkPlan?.month)}/
                          {row?.scheduleWorkPlan?.year}
                        </TableCell>
                        <TableCellBorder
                          style={{ maxWidth: 350, maxHeight: 50 }}
                        >
                          <div
                            style={{
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {row?.scheduleWorkPlan?.action}
                          </div>
                        </TableCellBorder>
                        <TableCellBorder>
                          <ButtonWhite
                            type="button"
                            onClick={() => handleOpenModalDetail(row)}
                          >
                            Ver Detalhes
                          </ButtonWhite>
                        </TableCellBorder>
                        <TableCellBorder align="center">
                          <ButtonWhite
                            type="button"
                            onClick={() => handleOpenModalResult(row)}
                          >
                            Ver Detalhes
                          </ButtonWhite>
                        </TableCellBorder>
                        <TableCellBorder>
                          <Autocomplete
                            id="size-small-outlined"
                            size="small"
                            noOptionsText="Status"
                            value={row.status}
                            options={statusOptions}
                            getOptionLabel={(option) => StatusName[option]}
                            onChange={(_event, newValue) => {
                              handleChangeStatus(newValue, row);
                            }}
                            renderInput={(params) => (
                              <TextField
                                size="small"
                                {...params}
                                label="Status"
                              />
                            )}
                            disabled={!edit}
                          />
                        </TableCellBorder>
                      </TableRow>
                    );
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
                {isPdf && <option value={limit}>{limit}</option>}
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
                type="button"
                onClick={() => handleChangePage2('prev')}
                disabled={disablePrev}
              >
                <MdNavigateBefore size={24} />
              </ButtonPage>
              <ButtonPage
                type="button"
                onClick={() => handleChangePage2('next')}
                disabled={disableNext}
              >
                <MdNavigateNext size={24} />
              </ButtonPage>
            </Pagination>
          </Paper>
        </Box>
      </Container>
      <ModalActionDetail
        show={modalShowActionDetail}
        onHide={() => {
          setModalShowActionDetail(false);
        }}
        action={action}
        edit={edit}
        changedAction={changedAction}
        handleChangeDetail={handleChangeDetail}
      />
      <ModalResultDetail
        show={modalShowResultDetail}
        onHide={() => {
          setModalShowResultDetail(false);
        }}
        action={action}
        edit={edit}
        changedAction={changedAction}
        handleChangeResult={handleChangeResult}
        isFormer={action?.scheduleWorkPlan?.isFormer}
      />
    </>
  );
}
