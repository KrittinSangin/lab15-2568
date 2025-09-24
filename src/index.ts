import { Router, type Request, type Response } from "express";
import express from "express";
import morgan from 'morgan';
import router from "./routes/studentRoutes.js";
import { json } from "node:stream/consumers";
import courseRouter from "./routes/courseRoutes.js";
const app: any = express();

//Middleware
app.use(express.json());
app.use(morgan('dev'));


app.use("/api/v2/",router);
app.use("/api/v2/",courseRouter);
app.get("/me", (req: Request, res: Response) => {

return res.json(
 {
  "success": true,
  "message": "Student Information",
  "data": {
    "studentId": "670610672",
    "firstName": "Krittin",
    "lastName": "Sangin",
    "program": "CPE",
    "section": "001"
  }
}
)

});
app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);


export default app;
