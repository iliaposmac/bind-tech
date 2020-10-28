import mongoose from 'mongoose'
const Schema = mongoose.Schema

const articleSchema = Schema ({
    id: mongoose.Types.ObjectId,
    title: {
        type: String,
        required: true,
    },
    shortDescription: {
        type: String,
        required: true
    },
    textContent: {
        type: String,
        required: true
    }
})

export default mongoose.model("Article", articleSchema)