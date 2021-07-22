"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    societyName: {
        type: [String],
    },
    societyId: {
        type: [mongoose_1.Schema.Types.ObjectId],
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.model("UserSchema", exports.userSchema, "Users");
