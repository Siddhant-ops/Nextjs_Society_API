import { compare, genSalt, hash } from "bcrypt";
import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Secret, sign } from "jsonwebtoken";
import { CallbackError } from "mongoose";
import SocietyModel from "../../Schema/society.model";

const router = express.Router();

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
router.post(
  "/register/user/secretary",
  [
    body("name").isString().withMessage("should be a valid name"),
    body("address").isString().withMessage("should be a valid address"),
    body("users[0].name")
      .isString()
      .withMessage("secretary name should be a valid name"),
    body("users[0].phone")
      .isNumeric()
      .withMessage("should be a valid phone Number"),
    body("users[0].email")
      .isEmail()
      .withMessage("should be a valid email")
      .normalizeEmail()
      .custom(async (value: string) => {
        return await SocietyModel.findOne({
          users: {
            $elemMatch: {
              email: value,
            },
          },
        })
          .then((user: any) => {
            if (user) {
              return Promise.reject("Account already exists with this email");
            }
          })
          .catch((err: CallbackError) => {
            if (err) throw err;
          });
      }),
    body("users[0].password")
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
    body("users[0].role")
      .notEmpty()
      .withMessage("is a required field")
      .isString()
      .withMessage("should be a valid string")
      .isUppercase()
      .withMessage("value should be in uppercase"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    var referralNum = Math.floor(Math.random() * 999999) + 100000;

    SocietyModel.findOne(
      {
        referral: referralNum,
      },
      (err: CallbackError, doc: any) => {
        if (err) throw err;
        if (doc) {
          while (doc.referral === referralNum) {
            referralNum = Math.floor(Math.random() * 999999) + 100000;
          }
        }
      }
    );

    const data = {
      name: req.body?.name,
      address: req.body?.address,
      users: req.body?.users,
      referral: referralNum,
    };

    const societyModel = new SocietyModel(data);

    genSalt(10, async (saltErr, salt) => {
      if (saltErr) throw saltErr;

      if (salt) {
        hash(societyModel.users[0].password, salt, async (hashErr, hash) => {
          if (hashErr) throw hashErr;

          if (hash) {
            societyModel.users[0].password = hash;
            societyModel.save((docErr: Error | undefined, doc: any) => {
              if (docErr) throw docErr;

              if (doc) {
                const PAYLOAD = {
                  societyName: doc.name,
                  userName: doc.users[0].name,
                  email: doc.users[0].email,
                  phone: doc.users[0].phone,
                  role: doc.users[0].role,
                };

                const jwtSecret: Secret = process.env.SECRET!;

                sign(
                  PAYLOAD,
                  jwtSecret,
                  { expiresIn: "40d" },
                  (signErr, token) => {
                    if (signErr) {
                      console.error(signErr);
                      throw signErr;
                    }
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
    body("phone")
      .isMobilePhone("en-IN")
      .withMessage("should be a valid Phone Number"),
    body("email")
      .isEmail()
      .withMessage("should be a valid email")
      .normalizeEmail()
      .custom(async (value) => {
        return await SocietyModel.findOne({
          users: {
            $elemMatch: {
              email: value,
            },
          },
        })
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
      .withMessage("must contain a special character")
      .isStrongPassword()
      .withMessage("should be a strong password"),
    body("role")
      .notEmpty()
      .withMessage("is a required field")
      .isString()
      .withMessage("should be a of type string")
      .isUppercase()
      .withMessage("should be uppercase"),
    body("referral")
      .notEmpty()
      .withMessage("is a required field")
      .isNumeric()
      .withMessage("should be of type number")
      .custom(async (value) => {
        return await SocietyModel.findOne({
          referral: value,
        })
          .then((doc: any) => {
            if (!doc) {
              return Promise.reject(
                "No society is registered with this referral code, Please ask your society secretary to register with a secretary account in order to create a referral code"
              );
            }
          })
          .catch((err: CallbackError) => {
            if (err) throw err;
          });
      }),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const data = {
      name: req.body?.name,
      email: req.body?.email,
      password: req.body?.password,
      phone: req.body?.phone,
      role: req.body?.role,
    };

    genSalt(10, async (saltErr, salt) => {
      if (saltErr) throw saltErr;

      if (salt) {
        hash(data.password, salt, async (hashErr, hash) => {
          if (hashErr) throw hashErr;

          if (hash) {
            data.password = hash;
            SocietyModel.findOneAndUpdate(
              {
                referral: req.body?.referral,
              },
              {
                $push: {
                  users: data,
                },
              },
              null,
              (err: CallbackError, doc: any) => {
                if (err) throw err;
                if (doc) {
                  const PAYLOAD = {
                    societyName: doc.name,
                    userName: data.name,
                    email: data.email,
                    phone: data.phone,
                    role: data.role,
                  };

                  const jwtSecret: Secret = process.env.SECRET!;

                  sign(
                    PAYLOAD,
                    jwtSecret,
                    { expiresIn: "40d" },
                    (signErr, token) => {
                      if (signErr) throw signErr;
                      if (token) res.json({ token: token });
                    }
                  );
                }
              }
            );
          }
        });
      }
    });
  }
);
interface TokenRequest extends Request {
  token?: string;
}

function verifyToken(req: TokenRequest, res: Response, next: NextFunction) {
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
    } else {
      return res.sendStatus(403);
    }
  } else {
    return res.json({
      message: "there is no jwt token in the header",
    });
  }
}

router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("is a required field")
      .isEmail()
      .withMessage("should be a valid mail id")
      .normalizeEmail(),
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
      .withMessage("must contain a special character")
      .isStrongPassword()
      .withMessage("should be a strong password"),
  ],
  (req: TokenRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const data = {
      email: req.body?.email,
      password: req.body?.password,
    };

    SocietyModel.findOne(
      {
        users: {
          $elemMatch: {
            email: data.email,
          },
        },
      },
      {
        users: {
          $elemMatch: {
            email: data.email,
          },
        },
      },
      null,
      (err: CallbackError, doc: any) => {
        if (err) throw err;
        if (doc) {
          const userDoc = doc.users[0];
          compare(data.password, userDoc.password, async (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              await SocietyModel.findOne(
                {
                  _id: doc._id,
                },
                ["name"],
                null,
                (err: CallbackError, societyDoc: any) => {
                  if (err) throw err;
                  if (societyDoc) {
                    const PAYLOAD = {
                      societyName: societyDoc.name,
                      userName: userDoc.name,
                      email: userDoc.email,
                      phone: userDoc.phone,
                      role: userDoc.role,
                    };

                    const jwtSecret: Secret = process.env.SECRET!;

                    sign(
                      PAYLOAD,
                      jwtSecret,
                      { expiresIn: "40d" },
                      (signErr, token) => {
                        if (signErr) throw signErr;
                        if (token) res.json({ token: token });
                      }
                    );
                  }
                }
              );
            } else {
              return res.json({ message: "Incorrect credentials" });
            }
          });
        } else return res.json({ message: "User not found" });
      }
    );
  }
);

export default router;
