import express from "express"
import { configDotenv } from "dotenv"
import authRoutes from "./routes/auth.routes.js";
import imageRoutes from "./routes/image.routes.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cloudinaryConnect from "./config/cloudinaryConfig.js";

configDotenv();
cloudinaryConnect();

const app = express()
const port = process.env.PORT ||4000

app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/images", imageRoutes);




app.listen(port, () => {
    console.log(`Servier is running at port: ${port}`)
})

app.get("/", (req, res) => {
    res.json({
        message: "This is Image Upload App"
    })
});