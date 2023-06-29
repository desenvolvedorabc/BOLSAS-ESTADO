import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Card, ButtonGroupBetween, InputGroup } from 'src/shared/styledForms';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { useState, useContext } from 'react';
import Router from 'next/router';
import ModalPergunta from 'src/components/modalPergunta';
import { Autocomplete, TextField } from '@mui/material';
import { ThemeContext } from 'src/context/ThemeContext';
import { maskAccount, maskAgency, maskCPF, maskPhone } from 'src/utils/masks';
import InputFile from 'src/components/InputFile';
import {
  approveCompleteScholarship,
  reproveCompleteScholarship,
  updateCompleteScholarship,
} from 'src/services/bolsista.service';
import { MdOutlineDownload } from 'react-icons/md';
import { ButtonDownload } from './styledComponents';
import ErrorText from 'src/components/ErrorText';
import { useGetPerfis } from 'src/services/perfis.service';
import { ModalReprove } from '../../ModalReprove';
import { StatusField } from '../StatusField';
import { ModalJustificationReprove } from '../ModalJustificationReprove';

export default function FormScholarshipApprove({ scholarship, user, url }) {
  const [ModalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalShowWarning, setModalShowWarning] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [modalMessageError, setModalMessageError] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const { mobile } = useContext(ThemeContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(
    scholarship?.user?.access_profile,
  );
  const [errorProfile, setErrorProfile] = useState(false);
  const [modalShowReprove, setModalShowReprove] = useState(false);
  const [modalShowJustificationReprove, setModalShowJustificationReprove] =
    useState(false);
  const [justification, setJustification] = useState(null);

  const { data: listPerfis, isLoading: isLoadingPerfis } = useGetPerfis({
    search: null,
    page: 1,
    limit: 99999,
    order: 'ASC',
    accessProfileRole: null,
    status: 1,
    forApproveScholar: true,
  });

  const updateRegistration = async () => {
    setIsDisabled(true);
    let response = null;
    try {
      response = await updateCompleteScholarship(scholarship?.id);
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }
    if (response.status === 200) {
      setModalMessage('Status do cadastro atualizado com sucesso!');
      setModalStatus(true);
      setModalShowConfirm(true);
    } else {
      setModalStatus(false);
      setModalShowConfirm(true);
      setModalMessageError(
        response.data.message || 'Erro ao atualizar cadastro',
      );
    }
  };

  const handleChangePerfil = (newValue) => {
    setSelectedProfile(newValue);
  };

  const approveRegistration = async () => {
    if (user?.access_profile?.role === 'REGIONAL' && !selectedProfile) {
      setErrorProfile(true);
      return;
    }
    setIsDisabled(true);

    setErrorProfile(false);
    let response = null;
    try {
      response = await approveCompleteScholarship(
        scholarship?.id,
        selectedProfile?.id,
      );
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }
    if (response.status === 200) {
      setModalMessage('Cadastro aprovado com sucesso!');
      setModalStatus(true);
      setModalShowConfirm(true);
    } else {
      setModalStatus(false);
      setModalShowConfirm(true);
      setModalMessageError(response.data.message || 'Erro ao aprovar cadastro');
    }
  };

  const handleChangeJustification = (newValue) => {
    setJustification(newValue);
  };

  const reproveRegistration = async () => {
    setIsDisabled(true);

    setErrorProfile(false);
    let response = null;
    try {
      response = await reproveCompleteScholarship(
        scholarship?.id,
        justification,
      );
    } catch (err) {
      setIsDisabled(false);
    } finally {
      setIsDisabled(false);
    }
    if (response.status === 200) {
      setModalMessage('Cadastro reprovado com sucesso!');
      setModalStatus(true);
      setModalShowConfirm(true);
    } else {
      setModalStatus(false);
      setModalShowConfirm(true);
      setModalMessageError(
        response.data.message || 'Erro ao reprovar cadastro',
      );
    }
  };

  return (
    <>
      <div className="mb-3" style={{ fontSize: 21 }}>
        <strong>Dados Pessoais</strong>
      </div>
      {user?.access_profile?.role === 'REGIONAL' && (
        <div style={{ marginBottom: 20 }}>Atrelar Perfil de Acesso</div>
      )}
      <div>
        <div
          style={{
            display: 'flex',
            marginBottom: 20,
            flexDirection: mobile ? 'column' : 'row',
          }}
        >
          {user?.access_profile?.role === 'REGIONAL' && (
            <div
              style={{
                width: '15.125rem',
                marginRight: '1.25rem',
                marginBottom: mobile ? 20 : 0,
              }}
            >
              <Autocomplete
                fullWidth
                id="size-small-outlined"
                size="small"
                noOptionsText="Selecione um perfil"
                value={selectedProfile}
                options={listPerfis?.items ? listPerfis.items : []}
                getOptionLabel={(option) => option.name}
                onChange={(_event, newValue) => {
                  handleChangePerfil(newValue);
                }}
                disabled={
                  scholarship?.statusRegistration !== 'EM_VALIDACAO' &&
                  scholarship?.statusRegistration !== 'PENDENTE_VALIDACAO'
                }
                loading={isLoadingPerfis}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    {...params}
                    label="Perfil de Acesso"
                  />
                )}
                sx={{
                  backgroundColor: '#fff',
                }}
              />
              {errorProfile ? <ErrorText>Campo Obrigatório</ErrorText> : null}
            </div>
          )}
          <div style={{ marginRight: 20 }}>
            <StatusField scholarship={scholarship} />
          </div>
          {scholarship?.statusRegistration === 'REPROVADO' && (
            <div style={{ width: 200 }}>
              <ButtonWhite
                onClick={() => setModalShowJustificationReprove(true)}
                type="button"
              >
                Motivo Da Reprovação
              </ButtonWhite>
            </div>
          )}
        </div>
      </div>
      <Form>
        <Card>
          <InputGroup mobile={mobile} columns={'1fr 1fr'}>
            <div>
              <TextField
                value={scholarship?.user?.name}
                label="Nome"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
            <div>
              <TextField
                value={scholarship?.user?.email}
                label="Email"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr 1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <div>
              <TextField
                value={
                  scholarship?.user?.cpf ? maskCPF(scholarship?.user?.cpf) : ''
                }
                label="CPF"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
            <div>
              <TextField
                value={
                  scholarship?.user?.telephone
                    ? maskPhone(scholarship?.user?.telephone)
                    : scholarship?.user?.telephone
                }
                label="Telefone"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
            <div>
              <TextField
                value={scholarship?.axle}
                label="Eixo"
                size="small"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
            {!mobile && <div></div>}
            <div>
              <TextField
                value={scholarship?.user?.regionalPartner?.name}
                size="small"
                label="Regional"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
            <div>
              <TextField
                value={scholarship?.user?.city}
                size="small"
                label="Município"
                fullWidth
                sx={{ backgroundColor: '#fff' }}
                disabled
              />
            </div>
          </InputGroup>
        </Card>
        <Card style={{ marginTop: 20 }}>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr 1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <TextField
              value={scholarship?.rg}
              label="RG"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              value={scholarship?.sex}
              label="Sexo"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              value={scholarship?.maritalStatus}
              label="Estado Civil"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              value={scholarship?.dateOfBirth}
              label="Data de Nascimento"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <TextField
              value={scholarship?.motherName}
              label="Nome da Mãe"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              value={scholarship?.fatherName}
              label="Nome do Pai"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr 1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <TextField
              value={scholarship?.cep}
              label="CEP"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              value={scholarship?.state}
              label="Estado"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              value={scholarship?.city}
              label="Cidade"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              value={scholarship?.address}
              label="Endereço"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr 1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <TextField
              value={scholarship?.bank}
              label="Banco"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              value={maskAgency(scholarship?.agency)}
              label="Agência"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              value={maskAccount(scholarship?.accountNumber)}
              label="Número da Conta"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              value={maskAccount(scholarship?.accountType)}
              label="Tipo de Conta"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr 1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <TextField
              value={scholarship?.trainingArea}
              label="Área de Formação"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              value={scholarship?.highestDegree}
              label="Titulação Mais Elevada"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              value={scholarship?.employmentRelationship}
              label="Vinculo Empregatício"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              value={scholarship?.instituteOfOrigin}
              label="Instituto de Origem"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 3fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <TextField
              value={scholarship?.functionalStatus}
              label="Situação Funcional"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              value={scholarship?.bagDescription}
              label="Descrição da Bolsa"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <TextField
              value={scholarship?.locationDevelopWorkPlan}
              label="Local Onde Desenvolverá o Plano de Trabalho"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              value={scholarship?.agreementOfTheEducationNetwork}
              label="Concordância da Rede de Ensino"
              size="small"
              fullWidth
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
          </InputGroup>
          <InputGroup
            mobile={mobile}
            columns={'1fr 1fr 1fr 1fr'}
            gap={'30px'}
            paddingTop={'30px'}
          >
            <div>
              <div style={{ height: mobile ? 'auto' : 58 }}>
                RG (Frente e Verso)
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  <InputFile
                    label="Upload do Arquivo"
                    onChange={null}
                    error={null}
                    acceptFile={'*'}
                    disabled={true}
                  />
                </div>
                {scholarship?.copyRgFrontAndVerse && (
                  <OverlayTrigger
                    key={'toolTip_Arq'}
                    placement={'bottom'}
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        {scholarship?.copyRgFrontAndVerse}
                      </Tooltip>
                    }
                  >
                    <ButtonDownload
                      href={`${url}/scholars/files/${scholarship?.copyRgFrontAndVerse}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MdOutlineDownload size={20} />
                    </ButtonDownload>
                  </OverlayTrigger>
                )}
              </div>
            </div>
            <div>
              <div style={{ height: mobile ? 'auto' : 58 }}>
                CPF (Frente e Verso)
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  <InputFile
                    label="Upload do Arquivo"
                    onChange={null}
                    error={null}
                    acceptFile={'*'}
                    disabled={true}
                  />
                </div>
                {scholarship?.copyCpfFrontAndVerse && (
                  <OverlayTrigger
                    key={'toolTip_Arq'}
                    placement={'bottom'}
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        {scholarship?.copyCpfFrontAndVerse}
                      </Tooltip>
                    }
                  >
                    <ButtonDownload
                      href={`${url}/scholars/files/${scholarship?.copyCpfFrontAndVerse}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MdOutlineDownload size={20} />
                    </ButtonDownload>
                  </OverlayTrigger>
                )}
              </div>
            </div>
            <div>
              <div style={{ height: mobile ? 'auto' : 58 }}>
                Cópia da Conta Corrente / Conta Poupança
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  <InputFile
                    label="Upload do Arquivo"
                    onChange={null}
                    error={null}
                    acceptFile={'*'}
                    disabled={true}
                  />
                </div>
                {scholarship?.currentAccountCopy && (
                  <OverlayTrigger
                    key={'toolTip_Arq'}
                    placement={'bottom'}
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        {scholarship?.currentAccountCopy}
                      </Tooltip>
                    }
                  >
                    <ButtonDownload
                      href={`${url}/scholars/files/${scholarship?.currentAccountCopy}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MdOutlineDownload size={20} />
                    </ButtonDownload>
                  </OverlayTrigger>
                )}
              </div>
            </div>
            <div>
              <div style={{ height: mobile ? 'auto' : 58 }}>
                Curriculum Vitae
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  <InputFile
                    label="Upload do Arquivo"
                    onChange={null}
                    error={null}
                    acceptFile={'*'}
                    disabled={true}
                  />
                </div>
                {scholarship?.curriculumVitae && (
                  <OverlayTrigger
                    key={'toolTip_Arq'}
                    placement={'bottom'}
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        {scholarship?.curriculumVitae}
                      </Tooltip>
                    }
                  >
                    <ButtonDownload
                      href={`${url}/scholars/files/${scholarship?.curriculumVitae}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MdOutlineDownload size={20} />
                    </ButtonDownload>
                  </OverlayTrigger>
                )}
              </div>
            </div>
            <div>
              <div style={{ marginBottom: 20 }}>Cópia da maior titulação </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  <InputFile
                    label="Upload do Arquivo"
                    onChange={null}
                    error={null}
                    acceptFile={'*'}
                    disabled={true}
                  />
                </div>
                {scholarship?.copyHigherTitle && (
                  <OverlayTrigger
                    key={'toolTip_Arq'}
                    placement={'bottom'}
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        {scholarship?.copyHigherTitle}
                      </Tooltip>
                    }
                  >
                    <ButtonDownload
                      href={`${url}/scholars/files/${scholarship?.copyHigherTitle}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MdOutlineDownload size={20} />
                    </ButtonDownload>
                  </OverlayTrigger>
                )}
              </div>
            </div>
            <div>
              <div style={{ marginBottom: 20 }}>Comprovante de Residência</div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  <InputFile
                    label="Upload do Arquivo"
                    onChange={null}
                    error={null}
                    acceptFile={'*'}
                    disabled={true}
                  />
                </div>
                {scholarship?.proofOfAddress && (
                  <OverlayTrigger
                    key={'toolTip_Arq'}
                    placement={'bottom'}
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        {scholarship?.proofOfAddress}
                      </Tooltip>
                    }
                  >
                    <ButtonDownload
                      href={`${url}/scholars/files/${scholarship?.proofOfAddress}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MdOutlineDownload size={20} />
                    </ButtonDownload>
                  </OverlayTrigger>
                )}
              </div>
            </div>
            <div>
              <div style={{ marginBottom: 20 }}>Atestado Médico</div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }}>
                  <InputFile
                    label="Upload do Arquivo"
                    onChange={null}
                    error={null}
                    acceptFile={'*'}
                    disabled={true}
                  />
                </div>
                {scholarship?.medicalCertificate && (
                  <OverlayTrigger
                    key={'toolTip_Arq'}
                    placement={'bottom'}
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        {scholarship?.medicalCertificate}
                      </Tooltip>
                    }
                  >
                    <ButtonDownload
                      href={`${url}/scholars/files/${scholarship?.medicalCertificate}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MdOutlineDownload size={20} />
                    </ButtonDownload>
                  </OverlayTrigger>
                )}
              </div>
            </div>
          </InputGroup>
        </Card>
        {user?.subRole !== 'ADMIN' && (
          <ButtonGroupBetween
            border={true}
            style={{ marginTop: 30 }}
            justify={mobile ? 'center' : null}
          >
            {!mobile && <div></div>}
            <div>
              {user?.access_profile?.role ===
                scholarship?.levelApproveRegistration &&
                (scholarship?.statusRegistration === 'EM_VALIDACAO' ||
                  scholarship?.statusRegistration === 'PENDENTE_VALIDACAO') && (
                  <>
                    <div style={{ display: 'flex' }}>
                      <div style={{ width: 137, marginRight: 25 }}>
                        <ButtonWhite
                          type="button"
                          disable={isDisabled}
                          onClick={() => {
                            setModalShowReprove(true);
                          }}
                        >
                          Reprovar
                        </ButtonWhite>
                      </div>
                      {scholarship?.statusRegistration ===
                        'PENDENTE_VALIDACAO' && (
                        <div style={{ width: 137, marginRight: 25 }}>
                          <ButtonWhite
                            type="button"
                            disable={isDisabled}
                            onClick={() => {
                              updateRegistration();
                            }}
                          >
                            Atualizar
                          </ButtonWhite>
                        </div>
                      )}
                      {!mobile && (
                        <div style={{ width: 137, marginRight: 25 }}>
                          <ButtonWhite
                            type="button"
                            disable={isDisabled}
                            onClick={() => {
                              approveRegistration();
                            }}
                          >
                            Aprovar
                          </ButtonWhite>
                        </div>
                      )}
                    </div>
                    {mobile && (
                      <div
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <div
                          style={{
                            width: 137,
                            marginRight: 25,
                            marginTop: 20,
                            justifyContent: 'center',
                          }}
                        >
                          <ButtonWhite
                            type="button"
                            disable={isDisabled}
                            onClick={() => {
                              approveRegistration();
                            }}
                          >
                            Aprovar
                          </ButtonWhite>
                        </div>
                      </div>
                    )}
                  </>
                )}
            </div>
          </ButtonGroupBetween>
        )}
      </Form>
      <ModalConfirmacao
        show={ModalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false), modalStatus && Router.reload();
        }}
        text={modalStatus ? modalMessage : modalMessageError}
        status={modalStatus}
      />
      <ModalPergunta
        show={modalShowWarning}
        onHide={() => setModalShowWarning(false)}
        onConfirm={null}
        buttonNo={'Não, desejo voltar'}
        buttonYes={'Sim, Desejo Enviar'}
        text={`Você está prestes a enviar esse formulário para aprovação. Tem certeza que deseja prosseguir? `}
        status={false}
        warning={true}
        size="md"
      />
      <ModalReprove
        show={modalShowReprove}
        onHide={() => {
          setModalShowReprove(false);
        }}
        text={
          'Você está prestes a reprovar o cadastro desse Bolsista. Por favor, digite abaixo a justificativa da reprovação.'
        }
        placeholder={'Espaço para detalhar a reprovação do cadastro aqui...'}
        buttonText={'Reprovar Bolsista'}
        changeJustification={handleChangeJustification}
        justification={justification}
        edit={
          scholarship?.statusRegistration != 'REPROVADO' &&
          scholarship?.statusRegistration != 'APROVADO'
        }
        onConfirm={reproveRegistration}
      />
      <ModalJustificationReprove
        show={modalShowJustificationReprove}
        onHide={() => {
          setModalShowJustificationReprove(false);
        }}
        text={
          'Você está prestes a reprovar o cadastro desse Bolsista. Por favor, digite abaixo a justificativa da reprovação.'
        }
        changeJustification={null}
        validationCounty={scholarship?.validationHistoryCounty}
        validationRegional={scholarship?.validationHistoryRegional}
        edit={false}
        onConfirm={() => {
          setModalShowJustificationReprove(false);
        }}
      />
    </>
  );
}
