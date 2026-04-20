import { Perfil } from '../models/Perfil.js';

const ok = (res, data, status = 200) =>
  res.status(status).json({ success: true, data });

export async function createPerfil(req, res, next) {
  try {
    const perfil = await Perfil.create(req.body);
    ok(res, perfil, 201);
  } catch (err) {
    next(err);
  }
}

export async function getPerfil(req, res, next) {
  try {
    const perfil = await Perfil.findById(req.params.id).lean();
    if (!perfil) {
      const err = new Error('Perfil no encontrado');
      err.status = 404;
      return next(err);
    }
    ok(res, perfil);
  } catch (err) {
    next(err);
  }
}

export async function updatePerfil(req, res, next) {
  try {
    const perfil = await Perfil.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!perfil) {
      const err = new Error('Perfil no encontrado');
      err.status = 404;
      return next(err);
    }
    ok(res, perfil);
  } catch (err) {
    next(err);
  }
}
