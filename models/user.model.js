import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = Schema ({
    id: mongoose.Types.ObjectId,
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    }
})

userSchema.pre('save', (next)=>{
    next()
})

export default mongoose.model("User", userSchema)