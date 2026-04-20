import { Carrera } from '../models/Carrera.js';
import { scoreCarrera } from '../utils/scoring.js';

const ok = (res, data, meta = {}) =>
  res.json({ success: true, data, ...meta });

export async function getCarreras(req, res, next) {
  try {
    const { categoria, tipo } = req.query;
    const filter = {};
    if (categoria) filter.categoria = categoria;
    if (tipo) filter.tipo = tipo;

    const carreras = await Carrera.find(filter).sort({ nombre: 1 }).lean();
    ok(res, carreras);
  } catch (err) {
    next(err);
  }
}

export async function getCarrera(req, res, next) {
  try {
    const carrera = await Carrera.findOne({ slug: req.params.slug }).lean();
    if (!carrera) {
      const err = new Error('Carrera no encontrada');
      err.status = 404;
      return next(err);
    }
    ok(res, carrera);
  } catch (err) {
    next(err);
  }
}

export async function getRecomendaciones(req, res, next) {
  try {
    const perfil = req.body;

    const carreras = await Carrera.find({}).lean();
    const scored = carreras
      .map((c) => ({ ...c, score: scoreCarrera(c, perfil) }))
      .sort((a, b) => b.score - a.score);

    ok(res, scored);
  } catch (err) {
    next(err);
  }
}
