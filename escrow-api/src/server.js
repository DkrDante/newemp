import express from 'express';
import {signupSchema} from './schema/user.schema.js';
import {prisma} from './lib/db.js';
import bodyParser from 'body-parser';
import cors from "cors";

const app=express();

app.use(bodyParser.json());
app.use(cors());

app.post("/api/signup",async(req,res)=>{
  try {
    const bodyy=req.body;
    console.log(bodyy);
    const parsedBody=signupSchema.safeParse(bodyy);
    if(!parsedBody.success){
      return res.status(400).json({message: "Invalid Request", error: parsedBody.error});

      return res.json({hwdsd:"dhjkasdhfj"})
    try{
      const user=await prisma.user.create({
      data:bodyy
      });
      const token=jwt.sign({userId: user.id},process.env.JWT_SECRET || "secret");
      res.status(200).json({token});
    }
      catch(e){
      console.log(e);
      return res.status(400).json({message: "Database is down"});
    }
    }
  }
   catch (e) {
      res.status(500).json({message: "Internal Server Error"});
      console.log(e);
  }
});


app.get("/api/health",(_req,res)=>{
  res.json({message: "Server is running"});
});

app.listen(3000,()=>{
  console.log('Server is running on port 3000');
});

