import { v4 } from "uuid";
import db from "@/utils/mongo";

export async function POST(request) {
  try {
    let commentId = v4().split("-")[0];
    const body = await request.json();
    console.log(body);

    // Update the post with a new comment
    const user = await db.collection("users").findOneAndUpdate(
      { "posts.id": body.postId }, // Find the user with the post
      {
        $addToSet: {
          "posts.$.comments": {
            commentId,
            comment: body.comment,
            commenter: body.commenter,
            avatar: body.avatar,
            likes: [],
            replies: [],
            commentCreatedAt: new Date(),
          },
        },
      },
      { returnDocument: "after" }
    );

    // If the post author is not the commenter, add a notification
    if (body.self === false) {
      await db.collection("notifications").findOneAndUpdate(
        { author: body.author },
        {
          $addToSet: {
            notifications: {
              comment: body.comment,
              notifier: body.commenter,
              postId: body.postId,
              notificationType: "comment",
              commentId,
              createdAt: new Date(),
            },
          },
        },
        { returnDocument: "after" }
      );
    }

    // Ensure user exists before accessing properties
    const comments =
      user?.posts?.find((post) => post.id === body.postId)?.comments || [];

    return Response.json({ comments });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
