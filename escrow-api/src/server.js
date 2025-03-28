
import express from 'express';
import { signupSchema, signinSchema } from './schema/user.schema.js';
import { prisma } from './lib/db.js';
import bodyParser from 'body-parser';
import jwt from "jsonwebtoken"

const app = express();

app.use(bodyParser.json());


app.post("/api/signup", async (req, res) => {
  try {
    const bodyy = req.body;
    const parsedBody = signupSchema.safeParse(bodyy);
    if (!parsedBody.success)
      return res.status(400).json({ message: "Invalid Request", error: parsedBody.error });

    try {
      const user = await prisma.usr.create({
        data: bodyy
      });
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret");
      res.status(200).json({ token });
    }
    catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Database is down" });
    }
  }
  catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(e);
  }
});

app.post("/api/signin", async (req, res) => {
  try {
    const bodyy = req.body;
    const parsedBody = signinSchema.safeParse(bodyy);
    if (!parsedBody.success)
      return res.status(400).json({ message: "Invalid Request", error: parsedBody.error });

    try {
      const user = await prisma.usr.findFirst({
        where: {
          email: bodyy.email
        }
      })

      if (!user) {
        return res.status(400).json({
          message: "user not found"
        })
      }

      if (user.password !== bodyy.password) {
        return res.status(400).json({
          message: "Credentials did'nt match"
        })
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret");
      res.status(200).json({ token });
    }
    catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Database is down" });
    }
  }
  catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(e);
  }
});



app.get("/api/health", (_req, res) => {
  res.json({ message: "Server is running" });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

