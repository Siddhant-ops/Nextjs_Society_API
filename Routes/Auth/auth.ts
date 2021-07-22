import { genSalt, hash } from "bcrypt";
import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Secret, sign } from "jsonwebtoken";
import { CallbackError } from "mongoose";
import UserModel from "../../Schema/User.model";

const router = express.Router();

const roles = {
  secretary: "SECRETARY",
  member: "MEMBER",
  chairman: "CHAIRMAN",
  treasurer: "TREASURER",
};

const returnPayload = (doc: any) => {
  return {
    email: doc.email,
    name: doc.name,
    role: doc.role,
  };
};

// Create secretary
router.post(
  "/register/user/secretary",
  [
    body("name").isString().withMessage("should be a valid name"),
    body("email")
      .isEmail()
      .withMessage("should be a valid email")
      .normalizeEmail()
      .custom(async (value) => {
        return await UserModel.findOne({ email: value })
          .then((user: any) => {
            if (user) {
              return Promise.reject("Account already exists with this email");
            }
          })
          .catch((err: CallbackError) => {
            if (err) throw err;
          });
      }),
    body("password")
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
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const data = {
      name: req.body?.name,
      email: req.body?.email,
      password: req.body?.password,
      role: roles.secretary,
    };

    const userModel = new UserModel(data);

    genSalt(10, async (saltErr, salt) => {
      if (saltErr) throw saltErr;

      if (salt) {
        hash(userModel.password, salt, async (hashErr, hash) => {
          if (hashErr) throw hashErr;

          if (hash) {
            userModel.password = hash;
            userModel.save((docErr: Error | undefined, doc: any) => {
              if (docErr) throw docErr;

              if (doc) {
                const PAYLOAD = returnPayload(doc);

                const jwtSecret: Secret = process.env.SECRET!;

                sign(
                  PAYLOAD,
                  jwtSecret,
                  { expiresIn: "40d" },
                  (signErr, token) => {
                    if (signErr) throw signErr;
                    if (token) {
                      res.json({
                        token: token,
                      });
                    }
                  }
                );
              }
            });
          }
        });
      }
    });
  }
);

// Create member
router.post(
  "/register/user/member",
  [
    body("name").isString().withMessage("should be a valid name"),
    body("email")
      .isEmail()
      .withMessage("should be a valid email")
      .normalizeEmail()
      .custom(async (value) => {
        return await UserModel.findOne({ email: value })
          .then((user: any) => {
            if (user) {
              return Promise.reject("Account already exists with this email");
            }
          })
          .catch((err: CallbackError) => {
            if (err) throw err;
          });
      }),
    body("password")
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
    body("role")
      .notEmpty()
      .withMessage("is a required field")
      .isString()
      .withMessage("should be a of type string")
      .isUppercase()
      .withMessage("should be uppercase"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const data = {
      name: req.body?.name,
      email: req.body?.email,
      password: req.body?.password,
      role: req.body?.role,
    };

    const userModel = new UserModel(data);

    genSalt(10, async (saltErr, salt) => {
      if (saltErr) throw saltErr;

      if (salt) {
        hash(userModel.password, salt, async (hashErr, hash) => {
          if (hashErr) throw hashErr;

          if (hash) {
            userModel.password = hash;
            userModel.save((docErr: Error | undefined, doc: any) => {
              if (docErr) throw docErr;

              if (doc) {
                const PAYLOAD = returnPayload(doc);

                const jwtSecret: Secret = process.env.SECRET!;

                sign(
                  PAYLOAD,
                  jwtSecret,
                  { expiresIn: "40d" },
                  (signErr, token) => {
                    if (signErr) throw signErr;
                    if (token) {
                      res.json({
                        token: token,
                      });
                    }
                  }
                );
              }
            });
          }
        });
      }
    });
  }
);

export default router;
