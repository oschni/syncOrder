import config       from '../../config'

import express      from 'express'
const router        = express.Router()

import debug	    from 'debug'
const log           = debug('root:info')
const logerror      = debug('root:error')
const logdebug      = debug('root:debug')
log.log             = console.log.bind(console)
logdebug.log        = console.log.bind(console)

router.get('/', (req, res) => {
    
    return res.redirect('/home')
})

export default router