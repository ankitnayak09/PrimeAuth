const healthcheck = (req, res) => {
  return res.status(200).send('OK');
}

export { healthcheck }