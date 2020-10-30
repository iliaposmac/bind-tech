import mongoose from 'mongoose'
const Schema = mongoose.Schema

const articleSchema = Schema ({
    id: mongoose.Types.ObjectId,
    userId: {
        type: String,
        required: true
    },
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
    },
    time: {
        type: Date,
        required: true
    },
    posted: {
        type: Boolean,
        required: true,
    }
})

export default mongoose.model("Article", articleSchema)