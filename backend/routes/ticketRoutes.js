const {Router} = require('express');
const router = Router();
const {getTickets, getTicket, createTicket, deleteTicket, updateTicket} = require('../controllers/ticketController');

const {protect} = require('../middleware/authMiddleware');

// Reroute into note router
const noteRouter = require('./noteRoutes');
router.use('/:ticketId/notes', noteRouter);

router.get('/', protect, getTickets);
router.get('/:id', protect, getTicket);
router.post('/', protect, createTicket);
router.delete('/:id', protect, deleteTicket);
router.put('/:id', protect, updateTicket);

module.exports = router;