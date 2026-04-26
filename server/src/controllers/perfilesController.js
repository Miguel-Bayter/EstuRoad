import { randomUUID } from 'crypto';
import { Perfil } from '../models/Perfil.js';
import { signToken } from '../utils/sessionToken.js';
import { auditLog } from '../utils/auditLog.js';

const ok = (res, data, status = 200) =>
  res.status(status).json({ success: true, data });

const IS_PROD = process.env.NODE_ENV === 'production';

function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'strict',
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  };
}

export async function createPerfil(req, res, next) {
  try {
    const publicId = randomUUID();
    const perfil = await Perfil.create({ ...req.body, publicId });

    const token = signToken(publicId);
    res.cookie('session', token, sessionCookieOptions());

    auditLog('CREATE_PERFIL', publicId, req);

    ok(res, {
      perfil: {
        publicId,
        ciudad: perfil.ciudad,
        estrato: perfil.estrato,
        presupuesto: perfil.presupuesto,
        intereses: perfil.intereses,
      },
    }, 201);
  } catch (err) {
    next(err);
  }
}

export async function getPerfil(req, res, next) {
  try {
    const perfil = await Perfil.findOne({ publicId: req.params.id }).lean();
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
    const perfil = await Perfil.findOneAndUpdate(
      { publicId: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!perfil) {
      const err = new Error('Perfil no encontrado');
      err.status = 404;
      return next(err);
    }

    auditLog('UPDATE_PERFIL', req.params.id, req);
    ok(res, perfil);
  } catch (err) {
    next(err);
  }
}
