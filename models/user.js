const mongoose = require('mongoose')

const mongooseHidden = require('mongoose-hidden')({ defaultHidden: { password: true } })





const TravelSchema = new mongoose.Schema({ 
    country: { type: String, required: true },
    place: { type: String, required: true },
     hasBeen: { type: Boolean, required: true},
     review: { type: String, required: false},
     rating: { type: Number, required: false},
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
     shareYourTravel: { type: Boolean, required: true},
     destination: [TravelSchema],
}); 


const User = mongoose.model('User', UserSchema)
UserSchema.plugin(mongooseHidden)

module.exports = User;