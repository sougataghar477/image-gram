import db from "@/utils/mongo";
export async function POST(request) {
    const body = await request.json();
     
    const author=await db.collection("notifications").findOne({
        author:body.author
    });
    
    return Response.json({notifications:author?.notifications})
}