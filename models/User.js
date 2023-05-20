const Thought = require("./Thought");
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, 'Has to match an email address'],
        },
        thoughts: [ 
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

userSchema.pre("findOneAndDelete", { document: false, query: true }, async function() {
    console.log("User pre-delete");
    const doc = await this.model.findOne(this.getFilter());
    console.log(doc.username);
    await Thought.deleteMany({ username: doc.username });
});

const User = model('User', userSchema);

module.exports = User;