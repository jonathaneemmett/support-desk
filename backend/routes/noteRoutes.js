const {Router} = require('express');
const {protect} = require('../middleware/authMiddleware');
const {getNotes, addNote} = require('../controllers/noteController');

const router = Router({mergeParams: true});

router.get('/', protect, getNotes);
router.post('/', protect, addNote);

module.exports = router;