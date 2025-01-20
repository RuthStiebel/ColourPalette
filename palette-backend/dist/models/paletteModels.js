"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLimitModel = exports.PaletteModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define Color Schema
const ColorSchema = new mongoose_1.Schema({
    hex: { type: String, required: true },
    rgb: { type: [Number], required: true },
});
// Define Palette Schema
const PaletteSchema = new mongoose_1.Schema({
    paletteId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    colors: [ColorSchema],
    createdAt: { type: Date, default: Date.now },
    shades: [[ColorSchema]],
});
const UserLimitSchema = new mongoose_1.Schema({
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
exports.PaletteModel = mongoose_1.default.model("Palette", PaletteSchema);
exports.UserLimitModel = mongoose_1.default.model("UserLimit", UserLimitSchema);
