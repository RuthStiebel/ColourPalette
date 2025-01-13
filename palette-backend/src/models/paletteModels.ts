import mongoose, { Schema, Document, Types } from "mongoose";

export interface Color {
  hex: string;
  rgb: [number, number, number];
}

export interface Palette extends Document {
  paletteId: string;
  userId: string;
  colors: Color[];
  createdAt: Date;
  history: Types.ObjectId[]; // References to other Palette documents
}

// Color schema
const ColorSchema = new Schema<Color>({
  hex: { type: String, required: true },
  rgb: { type: [Number], required: true },
});

// Palette schema
const PaletteSchema = new Schema<Palette>({
  paletteId: { type: String, required: true },
  userId: { type: String, required: true },
  colors: [ColorSchema],
  createdAt: { type: Date, default: Date.now },
  history: [{ type: Schema.Types.ObjectId, ref: "Palette" }], // References other palettes
});

export default mongoose.model<Palette>("Palette", PaletteSchema);
