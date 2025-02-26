import db from "@/utils/mongo";

export async function POST(request) {
    const body = await request.json();
    console.log(body);

    let update;
    
    if (body.isPostLiked) {
        // Unlike: Remove the username from the likes array
        update = { $pull: { "posts.$[post].likes": body.username } };
    } else {
        // Like: Add the username to the likes array
        update = { $addToSet: { "posts.$[post].likes": body.username } };
    }

    let post = await db.collection("users").findOneAndUpdate(
        {
            "posts.id": body.postId // Find the user who has this post
        },
        update,
        {
            arrayFilters: [{ "post.id": body.postId }], // Target the correct post
            returnDocument: "after"
        }
    );
// Add Notification
if(body.isPostLiked === false && body.self === false){
await db.collection("notifications").updateOne(
    { author: body.author },
    {
      $addToSet: {
        notifications: {
          notifier: body.username,
          postId: body.postId,
          notificationType: "like",
           
          createdAt: new Date(), // Ensure this is a Date object
        },
      },
    }
  );}
  
 
 
  
  
    if (!post) {
        return Response.json({ msg: 'Post not found or update failed' }, { status: 400 });
    }

    return Response.json({ 
        data: post.posts.filter(eachPost => eachPost.id === body.postId) 
    });
}
