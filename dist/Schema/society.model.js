"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const User_model_1 = require("./User.model");
const societySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    users: {
        type: [User_model_1.userSchema],
        required: true,
    },
    referral: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.model("SocietySchema", societySchema, "Society");
