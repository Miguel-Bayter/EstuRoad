import { Schema, model } from 'mongoose';

const universidadSchema = new Schema(
  {
    nombre: { type: String, required: true },
    ciudad: { type: String, required: true },
    publica: { type: Boolean, required: true },
    costoSem: { type: Number, required: true, min: 0 },
    ranking: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const stayVsLeaveSchema = new Schema(
  {
    stay: { type: String, required: true },
    leave: { type: String, required: true },
  },
  { _id: false }
);

const carreraSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    nombre: { type: String, required: true },
    tipo: {
      type: String,
      required: true,
      enum: ['Universitaria', 'Tecnológica (SENA)', 'Tecnológica'],
    },
    duracion: { type: String, required: true },
    categoria: { type: String, required: true, index: true },
    ematch: { type: [String], required: true },
    intereses: { type: [String], required: true },
    resumen: { type: String, required: true },
    salarioEntrada: { type: Number, required: true, min: 0 },
    salarioMedio: { type: Number, required: true, min: 0 },
    salarioAlto: { type: Number, required: true, min: 0 },
    empleabilidad: { type: Number, required: true, min: 0, max: 100 },
    demanda: { type: String, required: true },
    costoSemestre: { type: Number, required: true, min: 0 },
    becasICETEX: { type: Boolean, required: true, default: false },
    regionesDemanda: { type: [String], default: [] },
    demandaPorRegion: {
      andina: { type: Number, min: 0, max: 100, default: 0 },
      caribe: { type: Number, min: 0, max: 100, default: 0 },
      pacifico: { type: Number, min: 0, max: 100, default: 0 },
      orinoquia: { type: Number, min: 0, max: 100, default: 0 },
      amazonia: { type: Number, min: 0, max: 100, default: 0 },
      insular: { type: Number, min: 0, max: 100, default: 0 },
    },
    universidades: { type: [universidadSchema], default: [] },
    stayVsLeave: { type: stayVsLeaveSchema, required: true },
    proyeccion2030: { type: String, required: true },
  },
  { timestamps: true }
);

export const Carrera = model('Carrera', carreraSchema);
