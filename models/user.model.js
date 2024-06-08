const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

UserSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

UserSchema.methods.removeToken = async function(token) {
    const user = this;
    user.tokens = user.tokens.filter((tokenDoc) => tokenDoc.token !== token);
    await user.save();
}

UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Unable to login: user does not exist');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable to login: password doesnt match');
    }
    return user;
}

const User = mongoose.model('User', UserSchema);
module.exports = User;