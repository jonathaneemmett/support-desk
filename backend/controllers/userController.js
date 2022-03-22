const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @dec     Register a new user
// @route   /api/users
// @access  public
const registerUser = async (req, res, next) => {
    const {name, email, password} = req.body;

    // validation
    if(!name || !email || !password) {
        res.status(400);
        next(new Error('Please include all fields.'));
    }

    // Does Users exists
    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400);
        next(new Error('User already exists.'));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        next(new Error('Invalid user data'));
    }

};

// @dec     Login a user
// @route   /api/users/login
// @access  public
const loginUser = async (req, res, next) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});

        if(user && (await bcrypt.compare(password, user.password))){
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401);
            return next(new Error('Username or Password is incorrect.'))
        }

    } catch (e) {
        res.status(500);
        return next(new Error(e))
    }
}


// @dec     Get Current User
// @route   /api/users/me
// @access  private
const getMe = async (req, res, next) => {
    try{
        const user = {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name
        }
        res.status(200).json(user);
    } catch (e) {
        res.status(500);
        return next(new Error('Not Authorized'));
    }
}


// generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe
}