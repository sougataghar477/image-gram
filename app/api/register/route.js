import db from "@/utils/mongo";
import { v4 } from "uuid";
export async function POST(request) {
   const body =await request.json();
   
   console.log(body)
   let newUser = await db.collection("users").insertOne(
    {   
        avatar:body.image,
        name:body.name,
        username: body.username,
        email:body.email,
        password:body.password,
        bio:body.bio,
        posts:[],
        follows:[]
     });
     await db.collection("notifications").insertOne({
        author:body.username,
        notifications:[]
     })
    return Response.json({ message: 'Hello World' })
  }