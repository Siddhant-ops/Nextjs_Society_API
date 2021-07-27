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
const society_model_1 = __importDefault(require("../../Schema/society.model"));
const router = express_1.default.Router();
const roles = {
    secretary: "SECRETARY",
    member: "MEMBER",
    chairman: "CHAIRMAN",
    treasurer: "TREASURER",
};
// const PAYLOAD = {
//   societyName: doc.name,
//   userName: doc.users[0].name,
//   email: doc.users[0].email,
//   phone: doc.users[0].phone,
//   role: doc.users[0].role,
// };
// Create secretary
router.post("/register/user/secretary", [
    express_validator_1.body("name").isString().withMessage("should be a valid name"),
    express_validator_1.body("address").isString().withMessage("should be a valid address"),
    express_validator_1.body("users[0].name")
        .isString()
        .withMessage("secretary name should be a valid name"),
    express_validator_1.body("users[0].phone")
        .isNumeric()
        .withMessage("should be a valid phone Number"),
    express_validator_1.body("users[0].email")
        .isEmail()
        .withMessage("should be a valid email")
        .normalizeEmail()
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        return yield society_model_1.default.findOne({
            users: {
                $elemMatch: {
                    email: value,
                },
            },
        })
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
    express_validator_1.body("users[0].password")
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
        .withMessage("must contain a special character")
        .isStrongPassword()
        .withMessage("should be a strong password"),
    express_validator_1.body("users[0].role")
        .notEmpty()
        .withMessage("is a required field")
        .isString()
        .withMessage("should be a valid string")
        .isUppercase()
        .withMessage("value should be in uppercase"),
], (req, res) => {
    var _a, _b, _c;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    var referralNum = Math.floor(Math.random() * 999999) + 100000;
    society_model_1.default.findOne({
        referral: referralNum,
    }, (err, doc) => {
        if (err)
            throw err;
        if (doc) {
            while (doc.referral === referralNum) {
                referralNum = Math.floor(Math.random() * 999999) + 100000;
            }
        }
    });
    const data = {
        name: (_a = req.body) === null || _a === void 0 ? void 0 : _a.name,
        address: (_b = req.body) === null || _b === void 0 ? void 0 : _b.address,
        users: (_c = req.body) === null || _c === void 0 ? void 0 : _c.users,
        referral: referralNum,
    };
    const societyModel = new society_model_1.default(data);
    bcrypt_1.genSalt(10, (saltErr, salt) => __awaiter(void 0, void 0, void 0, function* () {
        if (saltErr)
            throw saltErr;
        if (salt) {
            bcrypt_1.hash(societyModel.users[0].password, salt, (hashErr, hash) => __awaiter(void 0, void 0, void 0, function* () {
                if (hashErr)
                    throw hashErr;
                if (hash) {
                    societyModel.users[0].password = hash;
                    societyModel.save((docErr, doc) => {
                        if (docErr)
                            throw docErr;
                        if (doc) {
                            const PAYLOAD = {
                                societyName: doc.name,
                                userName: doc.users[0].name,
                                email: doc.users[0].email,
                                phone: doc.users[0].phone,
                                role: doc.users[0].role,
                            };
                            const jwtSecret = process.env.SECRET;
                            jsonwebtoken_1.sign(PAYLOAD, jwtSecret, { expiresIn: "40d" }, (signErr, token) => {
                                if (signErr) {
                                    console.error(signErr);
                                    throw signErr;
                                }
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
    express_validator_1.body("phone")
        .isMobilePhone("en-IN")
        .withMessage("should be a valid Phone Number"),
    express_validator_1.body("email")
        .isEmail()
        .withMessage("should be a valid email")
        .normalizeEmail()
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        return yield society_model_1.default.findOne({
            users: {
                $elemMatch: {
                    email: value,
                },
            },
        })
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
        .withMessage("must contain a special character")
        .isStrongPassword()
        .withMessage("should be a strong password"),
    express_validator_1.body("role")
        .notEmpty()
        .withMessage("is a required field")
        .isString()
        .withMessage("should be a of type string")
        .isUppercase()
        .withMessage("should be uppercase"),
    express_validator_1.body("referral")
        .notEmpty()
        .withMessage("is a required field")
        .isNumeric()
        .withMessage("should be of type number")
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        return yield society_model_1.default.findOne({
            referral: value,
        })
            .then((doc) => {
            if (!doc) {
                return Promise.reject("No society is registered with this referral code, Please ask your society secretary to register with a secretary account in order to create a referral code");
            }
        })
            .catch((err) => {
            if (err)
                throw err;
        });
    })),
], (req, res) => {
    var _a, _b, _c, _d, _e;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const data = {
        name: (_a = req.body) === null || _a === void 0 ? void 0 : _a.name,
        email: (_b = req.body) === null || _b === void 0 ? void 0 : _b.email,
        password: (_c = req.body) === null || _c === void 0 ? void 0 : _c.password,
        phone: (_d = req.body) === null || _d === void 0 ? void 0 : _d.phone,
        role: (_e = req.body) === null || _e === void 0 ? void 0 : _e.role,
    };
    bcrypt_1.genSalt(10, (saltErr, salt) => __awaiter(void 0, void 0, void 0, function* () {
        if (saltErr)
            throw saltErr;
        if (salt) {
            bcrypt_1.hash(data.password, salt, (hashErr, hash) => __awaiter(void 0, void 0, void 0, function* () {
                var _f;
                if (hashErr)
                    throw hashErr;
                if (hash) {
                    data.password = hash;
                    society_model_1.default.findOneAndUpdate({
                        referral: (_f = req.body) === null || _f === void 0 ? void 0 : _f.referral,
                    }, {
                        $push: {
                            users: data,
                        },
                    }, null, (err, doc) => {
                        if (err)
                            throw err;
                        if (doc) {
                            const PAYLOAD = {
                                societyName: doc.name,
                                userName: data.name,
                                email: data.email,
                                phone: data.phone,
                                role: data.role,
                            };
                            const jwtSecret = process.env.SECRET;
                            jsonwebtoken_1.sign(PAYLOAD, jwtSecret, { expiresIn: "40d" }, (signErr, token) => {
                                if (signErr)
                                    throw signErr;
                                if (token)
                                    res.json({ token: token });
                            });
                        }
                    });
                }
            }));
        }
    }));
});
function verifyToken(req, res, next) {
    if (req.headers["authorization"]) {
        // Get auth header value
        const bearerHeader = req.headers["authorization"];
        // Check if auth header is undefined
        if (typeof bearerHeader !== undefined) {
            // split at the space
            const bearer = bearerHeader.split(" ");
            // Get token from array
            const bearerToken = bearer[1];
            // Set token onto the req
            req.token = bearerToken;
            // call next
            next();
        }
        else {
            return res.sendStatus(403);
        }
    }
    else {
        return res.json({
            message: "there is no jwt token in the header",
        });
    }
}
router.post("/login", [
    express_validator_1.body("email")
        .notEmpty()
        .withMessage("is a required field")
        .isEmail()
        .withMessage("should be a valid mail id")
        .normalizeEmail(),
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
        .withMessage("must contain a special character")
        .isStrongPassword()
        .withMessage("should be a strong password"),
], (req, res) => {
    var _a, _b;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const data = {
        email: (_a = req.body) === null || _a === void 0 ? void 0 : _a.email,
        password: (_b = req.body) === null || _b === void 0 ? void 0 : _b.password,
    };
    society_model_1.default.findOne({
        users: {
            $elemMatch: {
                email: data.email,
            },
        },
    }, {
        users: {
            $elemMatch: {
                email: data.email,
            },
        },
    }, null, (err, doc) => {
        if (err)
            throw err;
        if (doc) {
            const userDoc = doc.users[0];
            bcrypt_1.compare(data.password, userDoc.password, (err, isMatch) => __awaiter(void 0, void 0, void 0, function* () {
                if (err)
                    throw err;
                if (isMatch) {
                    yield society_model_1.default.findOne({
                        _id: doc._id,
                    }, ["name"], null, (err, societyDoc) => {
                        if (err)
                            throw err;
                        if (societyDoc) {
                            const PAYLOAD = {
                                societyName: societyDoc.name,
                                userName: userDoc.name,
                                email: userDoc.email,
                                phone: userDoc.phone,
                                role: userDoc.role,
                            };
                            const jwtSecret = process.env.SECRET;
                            jsonwebtoken_1.sign(PAYLOAD, jwtSecret, { expiresIn: "40d" }, (signErr, token) => {
                                if (signErr)
                                    throw signErr;
                                if (token)
                                    res.json({ token: token });
                            });
                        }
                    });
                }
                else {
                    return res.json({ message: "Incorrect credentials" });
                }
            }));
        }
        else
            return res.json({ message: "User not found" });
    });
});
exports.default = router;
