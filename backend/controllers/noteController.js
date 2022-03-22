const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Note = require('../models/Note');
// @dec     Get notes or a ticket
// @route   GET /api/tickets/:ticketId/notes
// @access  private
const getNotes = async (req, res, next) => {
    // Get user usin the id in the JWT
    const user = await User.findById(req.user.id);
    if(!user){
        res.status(401);
        next(new Error('User not found.'));
    }

    const ticket = await Ticket.findById(req.params.ticketId);

    if(ticket.user.toString() !== req.user.id){
        res.status(401);
        throw new Error('User not authorized.');
    }

    const notes = await Note.find({ticket: req.params.ticketId});


    res.status(200).json(notes);
}

// @dec     Create a note for a ticket
// @route   POST /api/tickets/:ticketId/notes
// @access  private
const addNote = async (req, res, next) => {
    // Get user usin the id in the JWT
    const user = await User.findById(req.user.id);
    if(!user){
        res.status(401);
        next(new Error('User not found.'));
    }

    const ticket = await Ticket.findById(req.params.ticketId);

    if(ticket.user.toString() !== req.user.id){
        res.status(401);
        next(new Error('User not authorized.'));
    }

    const note = await Note.create({
        text: req.body.text,
        isStaff: false,
        ticket: req.params.ticketId,
        user: req.user.id
    });

    res.status(200).json(note);
}

module.exports = {
    getNotes,
    addNote
}