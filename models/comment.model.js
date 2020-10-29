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
    }
})

export default mongoose.model("Comments", commentSchema)