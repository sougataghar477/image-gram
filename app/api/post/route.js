import db from "@/utils/mongo";
export async function POST(request) {
    const body = await request.json();
    
   const username=body.username;
  const user =await db.collection("users").find({username:username}).toArray();
  const post = user[0].posts.filter(post => post.id === body.id);
   if(post)
    {
    return Response.json({post,username,avatar:user[0].avatar})
  }
  else{
    Response.json({message:'Post Not Found'})
  }
  }