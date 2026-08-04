import { searchProducts, suggestProducts } from './search.service.js';

export async function search(req, res, next) {
  try {
    const results = await searchProducts(req.query);
    res.json(results);
  } catch (err) {
    next(err);
  }
}

export async function suggest(req, res, next) {
  try {
    const results = await suggestProducts(req.query);
    res.json(results);
  } catch (err) {
    next(err);
  }
}
