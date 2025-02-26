import db from "@/utils/mongo";
 
import { v4 } from "uuid";
export async function POST(request) {
    let replyId =v4().split("-")[0];
      const body = await request.json();
      
      let user = await db.collection("users").findOneAndUpdate(
        {
          "posts.id": body.postId // Find the correct post
        },
        { 
          $push: { 
            "posts.$.comments.$[comment].replies": {  // Push reply into the correct comment's replies array
              replyId: replyId,
              reply: body.reply, 
              replier: body.replier,
              avatar: body.avatar,
              likes: [],
              replyCreatedAt: new Date()
            } 
          } 
        },
        {
          arrayFilters: [{ "comment.commentId": body.commentId }], // Specify which comment to update
          returnDocument: "after"
        }
      );
      console.log("Checking",user.posts.filter(eachPost => eachPost.id === body.postId)[0].comments.filter(comment => comment.commentId ===body.commentId))
      if(body.self === false){
      await db.collection("notifications").findOneAndUpdate(
        { author: body.author }, // Find document by author
        {
          $addToSet: {
            notifications: {
              reply: body.reply, 
              commentId:body.commentId,
              notifier: body.replier,
              postId: body.postId,
              notificationType: 'reply',
              createdAt:new Date()

            }
          }
        },
        { returnDocument: 'after' } // Insert if not found, return updated document
      );
    }
    return Response.json({replies:user.posts.filter(eachPost => eachPost.id === body.postId)[0].comments})
    }