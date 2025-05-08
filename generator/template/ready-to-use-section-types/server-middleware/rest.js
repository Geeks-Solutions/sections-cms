const bodyParser = require('body-parser')
const {sha256} = require("js-sha256");
const app = require('express')()

app.use(bodyParser.json())
app.all('/getWLHash', (req, res) => {

  const hash = sha256.hmac(process.env.WHITELIST_HASH_PRIVATE_KEY, req.body.dataString)
  const finalHash = req.body.timestamp.concat('=').concat(hash)

  res.json({ data: finalHash })
})

module.exports = app
