function ok(res, payload, status = 200) {
  return res.status(status).json(payload);
}

function created(res, payload) {
  return res.status(201).json(payload);
}

function notFound(res, message = 'Registro não encontrado.') {
  return res.status(404).json({ message });
}

function badRequest(res, message = 'Dados inválidos.') {
  return res.status(400).json({ message });
}

module.exports = {
  ok,
  created,
  notFound,
  badRequest,
};
