import db from "@/utils/mongo";

export async function POST(request) {
    const body = await request.json();
    console.log(body);
    const removeFromNotifications = await db.collection("notifications").findOneAndUpdate(
        { author: body.author },
        {
          $pull: {
            notifications: {
               
              createdAt: { $lt: new Date(Date.now() - (24 *60 * 60 * 1000 * 30)) }, // Older than 30 days
            },
          },
        },
        { returnDocument: "after" }
      );

    return Response.json({ 
        data: 1 
    });
}
