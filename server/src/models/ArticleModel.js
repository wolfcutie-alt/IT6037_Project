import mongoose, {Schema} from "mongoose";

const articleSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    born: {
        type: String,
    },
    died: {
        type: String,
    },
    known_for: {
        type: String,
    },
    designed_by: {
        type: String,
    },
    medium: {
        type: String,
    },
    dimensions: {
        type: String,
    },
    location: {
        type: String,
    },
    developer: {
        type: String,
    },
    notable_work: {
        type: String,
    },
    year: {
        type: String,
    }
});

const Article = mongoose.model("Article", articleSchema);

export default Article;