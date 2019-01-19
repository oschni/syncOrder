import express      from 'express'
const router        = express.Router()

import root         from './root'
import auth         from './auth'

router.use(root)
router.use(auth)

export default router