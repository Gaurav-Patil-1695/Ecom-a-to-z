import {
  listAddressesService,
  getAddressService,
  createAddressService,
  updateAddressService,
  deleteAddressService,
} from './addresses.service.js';

export async function listAddresses(req, res, next) {
  try {
    const userId = req.user.id;
    const addresses = await listAddressesService(userId);
    res.status(200).json({ addresses });
  } catch (err) {
    next(err);
  }
}

export async function getAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const address = await getAddressService(userId, addressId);
    res.status(200).json({ address });
  } catch (err) {
    next(err);
  }
}

export async function createAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const address = await createAddressService(userId, req.body);
    res.status(201).json({ address });
  } catch (err) {
    next(err);
  }
}

export async function updateAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const address = await updateAddressService(userId, addressId, req.body);
    res.status(200).json({ address });
  } catch (err) {
    next(err);
  }
}

export async function deleteAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    await deleteAddressService(userId, addressId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
