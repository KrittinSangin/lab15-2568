import { Router, type Request, type Response } from "express";
import { courses1 } from "../db/db.js";
import { zCourseDeleteBody, zCourseId, zCoursePostBody, zCoursePutBody } from "../schemas/courseValidator.js";
import { type Course } from "../libs/types.js";
// import { success } from "zod";
const courseRouter = Router();

// READ all
courseRouter.get("/courses/:courseid", (req: Request, res: Response) => {
    try
    {
        const courseid1 = req.params.courseid;
        const courseid = parseInt(courseid1? courseid1 : "0")
        const courseresult = zCourseId.safeParse(courseid)
            if (!courseresult.success) {
              return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: courseresult.error.issues[0]?.message,
              });
            }
            const foundIndex = courses1.findIndex(
                  (courses) => courses.courseId === courseid
                );
            if(foundIndex === -1){
                return res.status(404).json({
                    success: "false",
                    message: "Course Id does not exists"
                })
            }
            return res.json({
                success: true,
                message: `Get course ${courseid} successfully`,
                data:  courses1.find(id => id.courseId === courseid)
            })
    }
    catch(err)
    {
         return res.json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
    }
 
});

// Params URL 
// courseRouter.get("/", () => {
// });

courseRouter.post("/courses", (req : Request, res : Response) => {
  try
  {
    const body = req.body as Course;
    const courseresult = zCourseId.safeParse(body.courseId);
    if(!courseresult.success){
        return res.status(400).json({
          success: false,
            message: "Validation failed",
            errors: courseresult.error.issues[0]?.message,
        })
    }
    
    // const result = zCoursePostBody.safeParse(body)
    // if(!result.success){
    //     return res.status(400).json({
    //         success: false,
    //         message: "Bad JSON request Syntax",
    //         errors: result.error.issues[0]?.message,
    //     })
    // }

    const found = courses1.find(
      (course) => course.courseId === body.courseId
    );
    if (found) {
      return res.status(409).json({
        success: false,
        message: "Course Id already exists",
      });
    }

    courses1.push(body)
  return res.json({
      success: true,
      message: `course ${body.courseId} has been added successfully`,
      data: body
    });
  }catch(err){
     return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }


});

courseRouter.put("/courses", (req : Request, res : Response) => {
    try{
      const body = req.body as Course
      const courseresult = zCoursePutBody.safeParse(body);
       if(!courseresult.success){
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: courseresult.error.issues[0]?.message,
        })
    }
    const foundIndex = courses1.findIndex(
      (course) => course.courseId === body.courseId
    );
    if(foundIndex === -1){
      return res.status(404).json({
        success: false,
        message: "Course Id does not exists"
      })
    }
     courses1[foundIndex] = { ...courses1[foundIndex], ...body };
     return res.json({
      success: true,
      message: `Student ${body.courseId} has been updated successfully`,
      data: courses1[foundIndex],
    });
  }catch(err){
  return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

courseRouter.delete("/courses",(req : Request, res : Response) => {
  try{
    const body = req.body
    const pass = zCourseDeleteBody.safeParse(body)
    if(!pass.success){
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: pass.error.issues[0]?.message,
      })
    }
    const course = body.courseId
    const find = courses1.findIndex(_course => _course.courseId === course)
     if(find === -1){
      return res.status(404).json({
        success: false,
        message: "Course Id does not exists"
      })
    }
    courses1.splice(find, 1);
    return res.status(204).json({});
  } catch (err){
    return res.status(500).json({
       success: false,
      message: "Something is wrong, please try again",
      error: err,
    })
  }
});

export default courseRouter;
