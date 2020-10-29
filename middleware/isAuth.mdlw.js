import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const auth = async (req, res, next) => {
    try {
        const cookie = req.get('cookie')
        const token = cookie
                .split(';')
                .find(c => c.includes('bind_tech='))
                .trim()
                .split('bind_tech=')
                .filter(x => x !=='')[0]
        const data = await jwt.decode(token, process.env.JWT_KEY)
        const user = await User.findOne({username: data.username})
        if (!user) {
            throw new Error('Incorect token')
        }
        req.user = user
        req.token = token
        next()
    } catch (err) {
        console.log("Not accepted auth")
        res.redirect('/')
    }
}
 
export default auth