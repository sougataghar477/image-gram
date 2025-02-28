import db from "@/utils/mongo";
export async function POST(request) {
    const body = await request.json();
 
    let query =await body.query;
    if(query.split(" ").length>1){
        console.log(query.split(" "));
        let users = await db.collection("users").find().toArray();
        let foundUsers = users.filter(user=> user.name.toLowerCase().includes(query.toLowerCase()))
        console.log(foundUsers,"Name");
        if(foundUsers.length>0){
            let returnedUsers = foundUsers.map(user=> {return {name:user.name,username:user.username,avatar:user.avatar}})
            return Response.json({users:returnedUsers})
        }
        else{
            return Response.json({users:[]})
        }
    }
    else{
        let users2 =await db.collection("users").find().toArray();
        let foundUsers=users2.filter(user => user.username.toLowerCase().includes(query.toLowerCase()));
        if(foundUsers.length>0){
            let returnedUsers =foundUsers.map(user=> {return {name:user.name,username:user.username,avatar:user.avatar}})
            console.log('Usernames',users2)
            return Response.json({users:returnedUsers})
        }
        else{
            return Response.json({users:[]})

        }
    }
 
  }