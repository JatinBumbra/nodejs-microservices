import express from 'express'

const router = express.Router()

router.get('/api/users/signout',(req,res) => {
    res.send('/api/users/signout')
})

export {router as signOutRouter}
