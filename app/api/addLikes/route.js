import db from "@/utils/mongo";
import { comment } from "postcss";
 
export async function POST(request) {
    const body =await request.json();
      console.log('Hello',body);
      if(body.commentType==='Main Comment'){
            if(body.isLiked){
                let post2 = await db.collection("users").findOneAndUpdate(
                    {
                      "posts.id": body.postId // Find the correct post
                    },
                    { 
                      $pull: { 
                        "posts.$.comments.$[comment].likes": body.username // Remove the username from likes array
                      } 
                    },
                    {
                      arrayFilters: [
                        { "comment.commentId": body.commentId } // Find the correct comment
                      ],
                      returnDocument: "after"
                    }
                  );
                  
                
                  
                  return Response.json({ data: post2.posts.filter(post => post.id === body.postId)[0].comments });
                  
            }
            else{

                // Step 1: Add like to the comment
let post1 = await db.collection("users").findOneAndUpdate(
  {
    "posts.id": body.postId, // Find the correct post
  },
  {
    $addToSet: {
      "posts.$.comments.$[comment].likes": body.username,
    },
  },
  {
    arrayFilters: [{ "comment.commentId": body.commentId }], // Find the correct comment
    returnDocument: "after",
  }
);

// Step 2: Add notification
if(body.self === false){
   await db.collection("notifications").findOneAndUpdate(
  { author: body.commentAuthor },
  {
    $addToSet: {
      notifications: {
        commentAuthor:body.commentAuthor,
        postAuthor:body.postAuthor,
        comment: body.comment,
        notifier: body.username,
        postId: body.postId,
        commentId: body.commentId,
        notificationType: "liked comment",
    
        createdAt: new Date(),
      },
    },
  },
  { returnDocument: "after" }
);
}
 
 

                return Response.json({data:post1.posts.filter( post => post.id === body.postId)[0].comments})
            }
      }
      else if (body.commentType === "Nested Comment") {
        console.log(body);
    
        if (body.isLiked) {
            let post3 = await db.collection("users").findOneAndUpdate(
                {
                    "posts.id": body.postId // Find the correct post
                },
                { 
                    $pull: { 
                        "posts.$.comments.$[comment].replies.$[reply].likes": body.username 
                    } 
                },
                {
                    arrayFilters: [
                        { "comment.commentId": body.commentId }, // Find the correct comment
                        { "reply.replyId": body.replyId } // Find the correct reply
                    ],
                    returnDocument: "after"
                }
            );
    
                console.log(post3.posts.filter( post => post.id === body.postId)[0].comments)
    
            return Response.json({data: post3.posts.filter( post => post.id === body.postId)[0].comments}); // Fixed message
        } else {
            let post4 = await db.collection("users").findOneAndUpdate(
                {
                    "posts.id": body.postId // Find the correct post
                },
                { 
                    $addToSet: { 
                        "posts.$.comments.$[comment].replies.$[reply].likes": body.username 
                    } 
                },
                {
                    arrayFilters: [
                        { "comment.commentId": body.commentId }, // Find the correct comment
                        { "reply.replyId": body.replyId } // Find the correct reply
                    ],
                    returnDocument: "after"
                }
            );
            if(body.self === false){
            await db.collection("notifications").findOneAndUpdate(
              { author: body.commentAuthor },
              {
                $addToSet: {
                  notifications: {
                    commentAuthor:body.commentAuthor,
                    postAuthor:body.postAuthor,
                    comment:body.comment,
                    notifier: body.username,
                    postId: body.postId,
                    replyId:body.replyId,
                    commentId:body.commentId,
                    notificationType: "liked reply",
                     
                    createdAt: new Date(),
                  },
                },
               
              },
              { returnDocument: "after" }
            );
          }
            return Response.json({ data: post4.posts.filter( post => post.id === body.postId)[0].comments }); // Fixed message
        }
    }
    
      
    }