"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = require("jsonwebtoken");
const User_model_1 = __importDefault(require("../../Schema/User.model"));
const router = express_1.default.Router();
const roles = {
    secretary: "SECRETARY",
    member: "MEMBER",
    chairman: "CHAIRMAN",
    treasurer: "TREASURER",
};
const returnPayload = (doc) => {
    return {
        email: doc.email,
        name: doc.name,
        role: doc.role,
    };
};
// Create secretary
router.post("/register/user/secretary", [
    express_validator_1.body("name").isString().withMessage("should be a valid name"),
    express_validator_1.body("email")
        .isEmail()
        .withMessage("should be a valid email")
        .normalizeEmail()
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        return yield User_model_1.default.findOne({ email: value })
            .then((user) => {
            if (user) {
                return Promise.reject("Account already exists with this email");
            }
        })
            .catch((err) => {
            if (err)
                throw err;
        });
    })),
    express_validator_1.body("password")
        .notEmpty()
        .withMessage("password is a required field")
        .isString()
        .withMessage("password must be of type string")
        .isLength({
        min: 8,
    })
        .withMessage("Password must be atleast of 8 characters")
        .matches(/[a-zA-Z]/)
        .withMessage("must contain alphabets")
        .matches(/[A-Z]/)
        .withMessage("must contain one Uppercase Alphabet")
        .matches(/[a-z]/)
        .withMessage("must contain one Lowercase Alphabet")
        .matches(/\d/)
        .withMessage("must contain a number")
        .matches(/[!@#$%^&*()\\]/)
        .withMessage("must contain a special character"),
], (req, res) => {
    var _a, _b, _c;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const data = {
        name: (_a = req.body) === null || _a === void 0 ? void 0 : _a.name,
        email: (_b = req.body) === null || _b === void 0 ? void 0 : _b.email,
        password: (_c = req.body) === null || _c === void 0 ? void 0 : _c.password,
        role: roles.secretary,
    };
    const userModel = new User_model_1.default(data);
    bcrypt_1.genSalt(10, (saltErr, salt) => __awaiter(void 0, void 0, void 0, function* () {
        if (saltErr)
            throw saltErr;
        if (salt) {
            bcrypt_1.hash(userModel.password, salt, (hashErr, hash) => __awaiter(void 0, void 0, void 0, function* () {
                if (hashErr)
                    throw hashErr;
                if (hash) {
                    userModel.password = hash;
                    userModel.save((docErr, doc) => {
                        if (docErr)
                            throw docErr;
                        if (doc) {
                            const PAYLOAD = returnPayload(doc);
                            const jwtSecret = process.env.SECRET;
                            jsonwebtoken_1.sign(PAYLOAD, jwtSecret, { expiresIn: "40d" }, (signErr, token) => {
                                if (signErr)
                                    throw signErr;
                                if (token) {
                                    res.json({
                                        token: token,
                                    });
                                }
                            });
                        }
                    });
                }
            }));
        }
    }));
});
// Create member
router.post("/register/user/member", [
    express_validator_1.body("name").isString().withMessage("should be a valid name"),
    express_validator_1.body("email")
        .isEmail()
        .withMessage("should be a valid email")
        .normalizeEmail()
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        return yield User_model_1.default.findOne({ email: value })
            .then((user) => {
            if (user) {
                return Promise.reject("Account already exists with this email");
            }
        })
            .catch((err) => {
            if (err)
                throw err;
        });
    })),
    express_validator_1.body("password")
        .notEmpty()
        .withMessage("password is a required field")
        .isString()
        .withMessage("password must be of type string")
        .isLength({
        min: 8,
    })
        .withMessage("Password must be atleast of 8 characters")
        .matches(/[a-zA-Z]/)
        .withMessage("must contain alphabets")
        .matches(/[A-Z]/)
        .withMessage("must contain one Uppercase Alphabet")
        .matches(/[a-z]/)
        .withMessage("must contain one Lowercase Alphabet")
        .matches(/\d/)
        .withMessage("must contain a number")
        .matches(/[!@#$%^&*()\\]/)
        .withMessage("must contain a special character"),
    express_validator_1.body("role")
        .notEmpty()
        .withMessage("is a required field")
        .isString()
        .withMessage("should be a of type string")
        .isUppercase()
        .withMessage("should be uppercase"),
], (req, res) => {
    var _a, _b, _c, _d;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const data = {
        name: (_a = req.body) === null || _a === void 0 ? void 0 : _a.name,
        email: (_b = req.body) === null || _b === void 0 ? void 0 : _b.email,
        password: (_c = req.body) === null || _c === void 0 ? void 0 : _c.password,
        role: (_d = req.body) === null || _d === void 0 ? void 0 : _d.role,
    };
    const userModel = new User_model_1.default(data);
    bcrypt_1.genSalt(10, (saltErr, salt) => __awaiter(void 0, void 0, void 0, function* () {
        if (saltErr)
            throw saltErr;
        if (salt) {
            bcrypt_1.hash(userModel.password, salt, (hashErr, hash) => __awaiter(void 0, void 0, void 0, function* () {
                if (hashErr)
                    throw hashErr;
                if (hash) {
                    userModel.password = hash;
                    userModel.save((docErr, doc) => {
                        if (docErr)
                            throw docErr;
                        if (doc) {
                            const PAYLOAD = returnPayload(doc);
                            const jwtSecret = process.env.SECRET;
                            jsonwebtoken_1.sign(PAYLOAD, jwtSecret, { expiresIn: "40d" }, (signErr, token) => {
                                if (signErr)
                                    throw signErr;
                                if (token) {
                                    res.json({
                                        token: token,
                                    });
                                }
                            });
                        }
                    });
                }
            }));
        }
    }));
});
exports.default = router;
