import db from "@/utils/mongo";
export async function POST(request) {
    const body = await request.json(); // Parse request body
   const username=body.username;
  const user =await db.collection("users").find({username:username}).toArray();
    return Response.json({user:user[0]})
  }