const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const personSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number
    },
    work:{
        type:String,
        enum:['chef','waiter','manager'],
        require:true
    },
    mobile:{
        type:String,
        require:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String
    },
    salary:{
        type:Number,
        required:true
    },
    username:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    }
})
// press is callback funcyion

personSchema.pre('save',async function(next){
    const person = this;
    if(!person.isModified('password')) return next();
    try{
        const salt = await bcrypt.genSalt(10);

        const hashPassword = await bcrypt.hash(person.password, salt);
        person.password = hashPassword;
        next();
    }
    catch(err){
        return next(err);
    }
})

personSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw new Error('Error comparing password'); // More descriptive error message
    }
};


//creating model;
const Person = mongoose.model('Person',personSchema);

module.exports = Person;