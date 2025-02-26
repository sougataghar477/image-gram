import db from "@/utils/mongo";
export async function POST(request) {
    const body = await request.json();
    
   const email=await body.email;
  const user =await db.collection("users").findOne({email:email});
 let userProfile={avatar:user.avatar,username:user.username,follows:[...user.follows]}
 
 
   
 
 
  return Response.json({user:userProfile })
  }