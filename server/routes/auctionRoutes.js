import { Router } from 'express';
const router = Router();
import { createAuction, getAllAuctions, getAuctionById, placeBid, getMyBids,updateAuction } from '../controllers/auctionController.js';
import { protect ,adminOnly } from '../middleware/authMiddleware.js';

router.get('/', getAllAuctions);
router.get('/:id', getAuctionById);

router.post('/create-auction', protect,adminOnly, createAuction);
router.post('/:id/bid', protect, placeBid);
router.get('/user/mybids', protect, getMyBids);
router.put('/:id', protect, adminOnly, updateAuction);


export default router;