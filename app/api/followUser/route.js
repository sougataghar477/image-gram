import db from "@/utils/mongo";

export async function POST(request) {
  const body = await request.json();
  console.log(body);

  try {
    let userProfile;
    if (body.followStatus === "Follow") {
      // Add to follows array
      userProfile = await db.collection("users").findOneAndUpdate(
        { username: body.followerUsername },
        { $addToSet: { follows: body.followingUsername } }, // Add if not already there
        { returnDocument: 'after' } // Ensure the updated document is returned
        
      );
      
      return Response.json({user: userProfile})



    } else if (body.followStatus === "Following") {
      // Remove from follows array
      userProfile = await db.collection("users").findOneAndUpdate(
        { username: body?.followerUsername },
        { $pull: { follows: body?.followingUsername } }, // Remove from follows
        { returnDocument: 'after' }
      );
 
    return Response.json({user: userProfile })

    }

    // If the userProfile is null, return an error
    if (!userProfile.value) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }


  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }), { status: 500 });
  }
}
