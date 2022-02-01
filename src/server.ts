import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import helmet from 'helmet'
import connect from './database/connect'
import logger from './utils/logger';
import errorHandler from './middlewares/errorHandler'
import router from './routes/api.router';
const PORT = process.env.PORT || 5000
const app = express()

app.use(helmet())
app.use(express.json())

app.use('/api', router)
app.use(errorHandler)

async function start() {
  try {
    await connect()
    app.listen(PORT, () => {
      logger.info(`Server started http://localhost:${PORT}`)
    })
    } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

start()
