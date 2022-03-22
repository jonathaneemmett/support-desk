const User = require('../models/User');
const Ticket = require('../models/Ticket');
const bcrypt = require("bcryptjs");

// @dec     Get User Tickets
// @route   GET /api/tickets
// @access  private
const getTickets = async (req, res, next) => {
    // Get user usin the id in the JWT
    const user = await User.findById(req.user.id);
    if(!user){
        res.status(401);
        next(new Error('User not found.'));
    }

    const tickets = await Ticket.find({user: req.user.id});


    res.status(200).json(tickets);
}

// @dec     Get User Ticket
// @route   GET /api/tickets/:id
// @access  private
const getTicket = async (req, res, next) => {
    // Get user usin the id in the JWT
    const user = await User.findById(req.user.id);
    if(!user){
        res.status(401);
        next(new Error('User not found.'));
    }

    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        res.status(404);
        next(new Error('Ticket not found.'));
    }

    if(ticket.user.toString() !== req.user.id){
        res.status(401);
        next(new Error('Not Authorized'));
    }

    res.status(200).json(ticket);
}

// @dec     Create a new ticket
// @route   POST /api/tickets
// @access  private
const createTicket = async (req, res, next) => {
    const {product, description} = req.body;
    console.log(product, description)
    if(!product || !description){
        res.status(400);
        next(new Error('Please add product and description.'));
    }

    // Get user usin the id in the JWT
    const user = await User.findById(req.user.id);
    if(!user){
        res.status(401);
        next(new Error('User not found.'));
    }

    const ticket = await Ticket.create({
        product,
        description,
        user: req.user.id,
        status: 'new'
    });

    res.status(201).json(ticket);
}

// @dec     Delete User Ticket
// @route   DELETE /api/tickets/:id
// @access  private
const deleteTicket = async (req, res, next) => {
    // Get user usin the id in the JWT
    const user = await User.findById(req.user.id);
    if(!user){
        res.status(401);
        next(new Error('User not found.'));
    }

    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        res.status(404);
        next(new Error('Ticket not found.'));
    }

    if(ticket.user.toString() !== req.user.id){
        res.status(401);
        next(new Error('Not Authorized'));
    }

    await ticket.remove();

    res.status(200).json({success: true});
}

// @dec     Update Ticket
// @route   UPDATE /api/tickets/:ud
// @access  private
const updateTicket = async (req, res, next) => {
    // Get user usin the id in the JWT
    const user = await User.findById(req.user.id);
    if(!user){
        res.status(401);
        next(new Error('User not found.'));
    }

    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        res.status(404);
        next(new Error('Ticket not found.'));
    }

    if(ticket.user.toString() !== req.user.id){
        res.status(401);
        next(new Error('Not Authorized'));
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json(updatedTicket);
}

module.exports = {
    getTickets,
    getTicket,
    createTicket,
    deleteTicket,
    updateTicket
}