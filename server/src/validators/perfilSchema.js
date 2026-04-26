import Joi from 'joi';

const RIASEC_CODES = ['R', 'I', 'A', 'S', 'E', 'C'];

export const createPerfilSchema = Joi.object({
  ciudad:       Joi.string().trim().min(2).max(100).required(),
  regionId:     Joi.string().trim().max(50).default('andina'),
  estrato:      Joi.number().integer().min(1).max(6).default(3),
  grado:        Joi.string().allow('').max(50).default(''),
  colegioTipo:  Joi.string().allow('').max(50).default(''),
  promedio:     Joi.number().min(1).max(5).default(3.5),
  saber:        Joi.string().allow('').max(20).default(''),
  presupuesto:  Joi.number().min(0).max(50_000_000).default(2_000_000),
  icetex:       Joi.string().allow('').max(20).default(''),
  trabajar:     Joi.string().allow('').max(20).default(''),
  materias:     Joi.array().items(Joi.string().max(50)).max(20).default([]),
  intereses:    Joi.array().items(Joi.string().max(50)).max(20).default([]),
  riasec:       Joi.array().items(Joi.string().valid(...RIASEC_CODES)).max(3).default([]),
  habilidades:  Joi.array().items(Joi.string().max(50)).max(10).default([]),
  mudarse:      Joi.number().min(0).max(100).default(50),
  modalidad:    Joi.string().valid('presencial', 'virtual', 'hibrido', '').default(''),
  internacional: Joi.string().allow('').max(20).default(''),
  completed:    Joi.boolean().default(false),
}).options({ stripUnknown: true });

export const updatePerfilSchema = Joi.object({
  ciudad:       Joi.string().trim().min(2).max(100),
  regionId:     Joi.string().trim().max(50),
  estrato:      Joi.number().integer().min(1).max(6),
  grado:        Joi.string().allow('').max(50),
  colegioTipo:  Joi.string().allow('').max(50),
  promedio:     Joi.number().min(1).max(5),
  saber:        Joi.string().allow('').max(20),
  presupuesto:  Joi.number().min(0).max(50_000_000),
  icetex:       Joi.string().allow('').max(20),
  trabajar:     Joi.string().allow('').max(20),
  materias:     Joi.array().items(Joi.string().max(50)).max(20),
  intereses:    Joi.array().items(Joi.string().max(50)).max(20),
  riasec:       Joi.array().items(Joi.string().valid(...RIASEC_CODES)).max(3),
  habilidades:  Joi.array().items(Joi.string().max(50)).max(10),
  mudarse:      Joi.number().min(0).max(100),
  modalidad:    Joi.string().valid('presencial', 'virtual', 'hibrido', ''),
  internacional: Joi.string().allow('').max(20),
  completed:    Joi.boolean(),
}).options({ stripUnknown: true });
