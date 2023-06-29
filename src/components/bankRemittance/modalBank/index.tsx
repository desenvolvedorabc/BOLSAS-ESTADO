import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import {
  IDownloadRemittance,
  getBankRemittancesApproved,
  getBankRemittancesNoValidation,
  getBankRemittancesReproved,
} from 'src/services/bank';
import { saveAs } from 'file-saver';

export default function ModalBank(props) {
  const [selectedType, setSelectedType] = useState('Remessa bancária');
  const [isDisabled, setIsDisabled] = useState(false);

  const handleDownload = async () => {
    setIsDisabled(true);
    const data: IDownloadRemittance = {
      regionalPartnerId: props.idRegionalPartner,
      month: props.month,
      year: props.year,
    };

    let response;

    try {
      if (selectedType === 'Remessa bancária') {
        response = await getBankRemittancesApproved(data);
      } else if (selectedType === 'Reprovação do relatório mensal') {
        response = await getBankRemittancesReproved(data);
      } else if (selectedType === 'Falta de validação') {
        response = await getBankRemittancesNoValidation(data);
      }

      saveAs(response?.data, selectedType);

      props.onHide();
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className=" justify-content-center border-0 px-5">
        <Modal.Title id="contained-modal-title-vcenter">
          <strong>Opções de Remessa</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center text-center px-5">
        <Autocomplete
          fullWidth
          id="month"
          size="small"
          noOptionsText="Escolha o tipo de remessa"
          value={selectedType}
          options={[
            'Remessa bancária',
            'Reprovação do relatório mensal',
            'Falta de validação',
          ]}
          // getOptionLabel={(option) => option}
          onChange={(_event, newValue) => {
            setSelectedType(newValue);
          }}
          renderInput={(params) => (
            <TextField
              size="small"
              {...params}
              label="Escolha o tipo de remessa"
            />
          )}
          sx={{ backgroundColor: '#fff', margin: '20px 0' }}
        />
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center border-0 px-5">
        <ButtonDefault disable={isDisabled} onClick={handleDownload}>
          Download
        </ButtonDefault>
        <ButtonWhite border={false} onClick={props.onHide}>
          Fechar
        </ButtonWhite>
      </Modal.Footer>
    </Modal>
  );
}
