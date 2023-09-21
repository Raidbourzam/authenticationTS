import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDb  from "./db/dbconnection";
import route from "./routes/authRoute";
import cookieParser from "cookie-parser";
//import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';

const PORT = process.env.PORT as string || 3000;

const app = express();


// Middleware: XSS protection
//app.use(xss());

// Middleware: Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware: Helmet for security headers
app.use(helmet());

// Middleware: HTTP Parameter Pollution protection
app.use(hpp());


connectDb();
// Middleware to parse JSON data
app.use(bodyParser.json());

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();

app.use(cookieParser());

app.use('/authentication', route);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));