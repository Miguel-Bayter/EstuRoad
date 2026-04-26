import { Schema, model } from 'mongoose';

const perfilSchema = new Schema(
  {
    publicId:    { type: String, unique: true, sparse: true },
    ciudad:      { type: String, required: true, trim: true },
    regionId:    { type: String, default: 'andina' },
    estrato:     { type: Number, min: 1, max: 6, default: 3 },
    grado:       { type: String, default: '' },
    colegioTipo: { type: String, default: '' },
    promedio:    { type: Number, min: 1, max: 5, default: 3.5 },
    saber:       { type: String, default: '' },
    presupuesto: { type: Number, min: 0, default: 2000000 },
    icetex:      { type: String, default: '' },
    trabajar:    { type: String, default: '' },
    materias:    { type: [String], default: [] },
    intereses:   { type: [String], default: [] },
    riasec:      { type: [String], default: [] },
    habilidades: { type: [String], default: [] },
    mudarse:     { type: Number, min: 0, max: 100, default: 50 },
    modalidad:   { type: String, enum: ['presencial', 'virtual', 'hibrido', ''], default: '' },
    internacional: { type: String, default: '' },
    completed:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Perfil = model('Perfil', perfilSchema);
