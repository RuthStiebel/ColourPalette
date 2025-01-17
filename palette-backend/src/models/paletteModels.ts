import mongoose, { Schema, Model, Document } from "mongoose";
export interface Color {
  hex: string;
  rgb: [number, number, number];
}
export interface Palette extends Document {
  paletteId: string;
  userId: string;
  colors: Color[];
  createdAt: Date;
  shades: Color[][];
}

export interface UserLimit extends Document {
  userId: string;
  count: number;
  lastReset: Date;
}

// Define Color Schema
const ColorSchema: Schema<Color> = new Schema({
  hex: { type: String, required: true }, 
  rgb: { type: [Number], required: true },
});

// Define Palette Schema
const PaletteSchema: Schema<Palette> = new Schema({
  paletteId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  colors: [ColorSchema],
  createdAt: { type: Date, default: Date.now },
  shades: [ColorSchema],
});

const UserLimitSchema: Schema<UserLimit> = new Schema({
  userId: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 0 },
  lastReset: { type: Date, required: true, default: Date.now },
});


/*const userSchema = new Schema<User>({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});*/

// Export Models
export const PaletteModel: Model<Palette> = mongoose.model<Palette>("Palette", PaletteSchema);
export const UserLimitModel: Model<UserLimit> = mongoose.model<UserLimit>("UserLimit", UserLimitSchema);