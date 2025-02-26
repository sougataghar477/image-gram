import db from "@/utils/mongo";
import { v4 } from "uuid";
export async function POST(request) {
   const body =await request.json();
   
   console.log(body)
   let newPost = await db.collection("users").findOneAndUpdate(
    { username: body.username }, // Find user by ID
    { $push: { posts: {
     id:v4().split("-")[0],
     author:body.username,
     description:body.description,
     image:body.image,
     createdAt:new Date(),
     comments:[],
     likes:[],
} } }, // Add new post to the posts array
    { returnDocument: "after" } // Return the updated user document
);

    return Response.json({ message: 'Hello World' })
  }