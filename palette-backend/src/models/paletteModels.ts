import mongoose, { Schema } from "mongoose";
export interface Color {
  hex: string;
  rgb: [number, number, number];
}
export interface Palette {
  paletteId: string;
  userId: string; 
  colors: Color[];
  createdAt: Date;
  shades: Color[][];
}

const ColorSchema = new Schema<Color>({
  hex: { type: String, required: true }, 
  rgb: { type: [Number], required: true },
});

const PaletteSchema = new Schema<Palette>({
  paletteId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  colors: [ColorSchema],
  createdAt: { type: Date, default: Date.now },
  shades: [ColorSchema],
});

/*const userSchema = new Schema<User>({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});*/
export default mongoose.model<Palette>("Palette", PaletteSchema);
