
import mongoose, { Schema, Document } from "mongoose";

export interface Color {
  rgb: [number, number, number];
}

export interface Palette extends Document {
  paletteId: string;
  colors: Color[];
  createdAt: Date;
  history: string[];
}

const ColorSchema = new Schema<Color>({
  rgb: { type: [Number], required: true },
});

const PaletteSchema = new Schema<Palette>({
  paletteId: { type: String, required: true, unique: true },
  colors: [ColorSchema],
  createdAt: { type: Date, default: Date.now },
  history: [String],
});

export default mongoose.model<Palette>("Palette", PaletteSchema);