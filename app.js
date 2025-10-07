import express from 'express'
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Rota inicial!')
})

app.get('/usuarios', (req, res) => {
  res.send('Rota usuário')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port} - Acesse: http://localhost:3000/`)
})
