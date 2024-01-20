import mongoose from "mongoose";

const URLModel = mongoose.model('URL', {
    originalURL: {
        type: String,
        required: true
    },
    shortURL: {
        type: String,
        required: true
    }
})


export default URLModel;