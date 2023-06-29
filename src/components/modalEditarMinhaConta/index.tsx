/* eslint-disable no-useless-escape */
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField } from '@mui/material';
import Image from 'next/image';
import Router from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ButtonDefault } from 'src/components/buttons/buttonDefault';
import ButtonWhite from 'src/components/buttons/buttonWhite';
import ModalConfirmacao from 'src/components/modalConfirmacao';
import { IUserForm, editUser } from 'src/services/usuarios.service';
import { maskCPF, maskPhone } from 'src/utils/masks';
import { isValidCPF } from 'src/utils/validate';
import * as yup from 'yup';
import { parseCookies, setCookie } from '../../utils/cookies';
import { Button, Logo } from './styledComponents';

const schemaSchedule = yup.object().shape({
  name: yup
    .string()
    .required('Campo obrigatório')
    .min(6, 'Deve ter no mínimo 6 caracteres'),
  email: yup
    .string()
    .required('Campo obrigatório')
    .email('Email com formato inválido'),
  cpf: yup
    .string()
    .required('Campo obrigatório')
    .test(
      'Documento com formato inválido',
      'Documento com formato inválido',
      (cpf) => isValidCPF(cpf),
    ),
  telephone: yup
    .string()
    .required('Campo obrigatório')
    .min(11, 'Telefone com formato inválido')
    .max(11, 'Telefone com formato inválido'),
});

export default function ModalEditarMinhaConta(props) {
  const [_show, setShow] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [modalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalStatus, setModalStatus] = useState(true);
  const [tel, setTel] = useState(
    props?.usuario?.telephone ? props?.usuario?.telephone : '',
  );
  const [cpf, setCpf] = useState(
    props?.usuario?.telephone ? props?.usuario?.telephone : '',
  );

  useEffect(() => {
    resetForm();
  }, [props.isReset]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<IUserForm>({
    defaultValues: {
      name: props?.usuario?.name,
      email: props?.usuario?.email,
      cpf: props?.usuario?.cpf,
      telephone: props?.usuario?.telephone,
      image_profile: props?.usuario?.image_profile,
    },
    resolver: yupResolver(schemaSchedule),
  });

  const onSubmit: SubmitHandler<IUserForm> = async (data) => {
    // let file = null;
    // if (userAvatar) {
    //   file = new FormData();
    //   file.append('avatar', userAvatar);
    // }

    data.cpf = data.cpf.replace(/\D/g, '');
    data.telephone = data.telephone.replace(/\D/g, '');
    const response = await editUser(
      props?.usuario.id,
      data,
      userAvatar,
      false,
      false,
    );
    if (response.status === 200) {
      const cookies = parseCookies();
      const userCookie = cookies['USUARIO'];
      const usuario = JSON.parse(userCookie ? userCookie : null);

      usuario.name = data.name;
      usuario.email = data.email;
      usuario.cpf = data.cpf.replace(/\D/g, '');
      usuario.telephone = data.telephone.replace(/\D/g, '');
      usuario.image_profile = response?.data?.image_profile;

      delete usuario?.access_profile?.areas;

      setCookie(null, 'USUARIO', JSON.stringify(usuario), {
        path: '/',
      });

      setModalStatus(true);
      setModalShowConfirm(true);
    } else {
      setModalStatus(false);
      setModalShowConfirm(true);
    }
  };

  const hiddenFileInput = useRef(null);

  const uploadAvatar = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setUserAvatar(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const handleClickImage = (event) => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    setAvatar(props?.usuario.image_profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeTel = (e) => {
    setTel(e.target.value);
    setValue('telephone', e.target.value.replace(/\D/g, ''), {
      shouldValidate: true,
    });
    // formik.validateForm()
  };

  const handleChangeCpf = (e) => {
    setCpf(e.target.value);
    setValue('cpf', e.target.value.replace(/\D/g, ''), {
      shouldValidate: true,
    });
  };

  const handleChangeName = (e) => {
    setValue('name', e.target.value, {
      shouldValidate: true,
    });
  };

  const handleChangeEmail = (e) => {
    setValue('email', e.target.value, {
      shouldValidate: true,
    });
  };
  const resetForm = () => {
    reset();
    setCpf(props?.usuario?.cpf ? props?.usuario?.cpf : '');
    setTel(props?.usuario?.telephone ? props?.usuario?.telephone : '');
    setUserAvatar(null);
    setCreateObjectURL(null);
  };

  return (
    <>
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Editando Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center mt-3">
          <Logo className="rounded-circle mb-3">
            {createObjectURL ? (
              <Image
                src={createObjectURL}
                className="rounded-circle"
                width={170}
                height={170}
                alt="avatar"
              />
            ) : (
              <>
                {avatar ? (
                  <>
                    <img
                      src={`${props?.usuario?.image_profile_url}`}
                      className="rounded-circle"
                      width={170}
                      height={170}
                      alt="avatar"
                    />
                  </>
                ) : (
                  <Image
                    src="/assets/images/avatar.png"
                    className="rounded-circle"
                    width={170}
                    height={170}
                    alt="avatar"
                  />
                )}
              </>
            )}
          </Logo>
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={uploadAvatar}
            style={{ display: 'none' }}
          />
          <div style={{ width: 205 }}>
            <ButtonWhite onClick={handleClickImage}>
              Alterar foto de perfil
            </ButtonWhite>
          </div>
          <div className="d-flex flex-column mt-3 col-12 px-5 pb-4 pt-2 justify-content-center">
            <div className="my-2">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={handleChangeName}
                    label="Nome"
                    error={!!errors.name}
                    size="small"
                    helperText={errors.name ? errors.name?.message : ''}
                    fullWidth
                    sx={{ backgroundColor: '#fff' }}
                  />
                )}
              />
            </div>
            <div className="my-2">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={handleChangeEmail}
                    label="Email"
                    error={!!errors.email}
                    size="small"
                    helperText={errors.email ? errors.email?.message : ''}
                    fullWidth
                    sx={{ backgroundColor: '#fff' }}
                  />
                )}
              />
            </div>
            <div className="my-2">
              <TextField
                label="CPF"
                error={!!errors.cpf}
                value={maskCPF(cpf)}
                onChange={handleChangeCpf}
                inputProps={{ maxLength: 14 }}
                size="small"
                helperText={errors.cpf ? errors.cpf?.message : ''}
                fullWidth
                sx={{ backgroundColor: '#fff' }}
              />
            </div>
            <div className="my-2">
              <TextField
                label="Telefone"
                error={!!errors.telephone}
                value={maskPhone(tel)}
                onChange={handleChangeTel}
                inputProps={{ maxLength: 14 }}
                size="small"
                helperText={errors.telephone ? errors.telephone?.message : ''}
                fullWidth
                sx={{ backgroundColor: '#fff' }}
              />
            </div>
            <div className="my-3">
              <ButtonDefault
                type="button"
                onClick={handleSubmit(onSubmit)}
                disable={!isValid}
              >
                Salvar
              </ButtonDefault>
            </div>
            <div className="d-flex justify-content-center">
              <Button type="button" onClick={props.onHide}>
                Cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <ModalConfirmacao
        show={modalShowConfirm}
        onHide={() => {
          setModalShowConfirm(false);
          modalStatus && Router.reload();
        }}
        text={
          modalStatus
            ? `Usuário ${props?.usuario?.name} alterado com sucesso!`
            : `Erro ao alterar usuário`
        }
        status={modalStatus}
      />
    </>
  );
}
