import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import {
  listAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} from './addresses.controller.js';
import {
  validateCreateAddress,
  validateUpdateAddress,
  validateAddressId,
} from './addresses.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', listAddresses);
router.post('/', validateCreateAddress, createAddress);
router.get('/:addressId', validateAddressId, getAddress);
router.put('/:addressId', validateAddressId, validateUpdateAddress, updateAddress);
router.delete('/:addressId', validateAddressId, deleteAddress);

export default router;
