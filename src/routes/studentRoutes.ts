import express, {
        Router,
  type Request,
  type Response,
} from "express";
import { students , courses1 } from "../db/db.js";
import {
  zStudentId,
  zStudentDeleteBody,
  zStudentPostBody,
  zStudentPutBody,
} from "../schemas/studentValidator.js";
import type { Student } from "../libs/types.js";
const router = Router();


router.get("/students/:studentIa/courses", (req: Request, res: Response )=> {

try {
    const studentId = req.params.studentIa;
    const studentresult = zStudentId.safeParse(studentId)
    // validate req.body with predefined validator
    if (!studentresult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: studentresult.error.issues[0]?.message,
      });
    }

    //check duplicate studentId
    const foundIndex = students.findIndex(
      (student) => student.studentId === studentId
    );

    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Student does not exists",
      });
    }

    return res.json({
      success: true,
      message: `Get courses detail of student ${studentId}`,
      data: {
        studentId,
        courses: students.filter((stud) => stud.studentId == studentId)[0]?.courses?.map((course) => {
            const coursesWithoutInstructors = courses1.map(({ instructors, ...rest }) => rest);
            return coursesWithoutInstructors.find(cou => cou.courseId === course)
        })
        }
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }

});

router.get("/", (req: Request, res: Response) => {
    res.send("test")
});

export default router;
