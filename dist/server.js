"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
const mongoURI = process.env.MONGODB_URI;
mongoose_1.default
    .connect(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
})
    .then((mongoRes) => {
    const DBname = mongoRes.connections[0].name;
    console.log(`Mongoose connected to DB : ${DBname}`);
})
    .catch((err) => console.error(err));
const auth_1 = __importDefault(require("./Routes/Auth/auth"));
app.use("/api/auth", auth_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port : ${PORT}`);
});
