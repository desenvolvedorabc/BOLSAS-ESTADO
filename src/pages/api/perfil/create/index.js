import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { __session: token } = req.cookies;
    delete req.body.data['token'];
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/profiles/base`, req.body.data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        res
          .status(200)
          .json({
            status: 401,
            message:
              error.response.data.message ||
              'Erro ao cadastrar perfil, tente mais tarde',
          });
      });
  }
}
