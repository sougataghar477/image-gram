import { v4 } from "uuid";
import db from "@/utils/mongo";

export async function POST(request) {
  let commentId =v4().split("-")[0];
    const body = await request.json();
    console.log(body)
    let user= await db.collection("users").findOneAndUpdate( { 
          
        "posts.id": body.postId
      }, // Find user by username and specific post ID
      { 
        $addToSet: { "posts.$.comments": {
          commentId:commentId,
          comment: body.comment, 
          commenter:body.commenter,
          avatar:body.avatar,
          likes:[],
          replies:[],
          commentCreatedAt:new Date()
          } } 
      },
      { returnDocument: "after" });
      if(body.self===false){
        await db.collection("notifications").findOneAndUpdate(
        { author: body.author },
        {
          $addToSet: {
            notifications: {
              comment: body.comment,
              notifier: body.commenter,
              postId: body.postId,
              notificationType: "comment",
               commentId:commentId,
              createdAt: new Date(),
            },
          },

        },
        { returnDocument: "after" }
      );
    }

  return Response.json({comments:user?.posts?.filter(post => post.id === body.postId)[0].comments})
  }