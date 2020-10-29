import mongoose from 'mongoose'
const Schema = mongoose.Schema

const commentSchema = Schema ({
    id: mongoose.Types.ObjectId,
    username: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true
    },
    articleId: {
        type: String,
        required: true
    }, 
    userId: {
        type: String,
        default: 'guest_comment'
    }
})

export default mongoose.model("Comments", commentSchema)