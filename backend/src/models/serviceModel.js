import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ServiceSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            index: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        imageUrl: {
            type: String,
        },
        category: {
            type: String,
            required: true,
            index: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        location: {
            type: String,
            trim: true
        },
        provider: {
            type: Schema.Types.ObjectId,
            ref: "User", // Links to the User model
            required: true
        },
        status: {
            type: String,
            enum: ["available", "unavailable"],
            default: "available"
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        numReviews: {
            type: Number,
            default: 0
        },
        slug: {
            type: String,
            unique: true
        }
    },
    {
        timestamps: true,
        autoIndex: true
    }
);

// Generate a unique slug from the title before saving
ServiceSchema.pre("save", function (next) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, "-");
    next();
});

const ServiceScheme = mongoose.model("Service", ServiceSchema);
export default ServiceScheme;
