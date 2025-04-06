import { Client, Account, Databases, Users, Permission, Role, Query, ID } from 'node-appwrite';

export default async ({ req, res, log, error }) => {

  if (req.path === "/") 
  {
    const userId = req.headers['x-appwrite-user-id'];
    
    const client = new Client()
       .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
       .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
       .setKey(process.env.APPWRITE_API_KEY);
    
    const db = new Databases(client);
    const event = req.headers['x-appwrite-event'];
    
    let sessionId = "";
    if(req.body.$id)
    {
      sessionId = req.body.$id;
    }
    
    if(event === "users." + userId + ".create")
    {
        log(req.body);
        //create a collection for userId
        //create a document in users collection where the id is the userId of the user, it has a name, and a picture. Anyone can read on collection level, if deleted, delete collection and user
        //create a document to store the latest post of each user
        const createUserDoc = await db.createDocument('db', 'users', userId, { name: "null", picture: "null"}, [ 
          Permission.read(Role.user(userId)),    // Allow the user to read the document
          Permission.update(Role.user(userId)),  // Allow the user to update the document
          Permission.delete(Role.user(userId)),  // Allow the user to delete the document
          Permission.read(Role.any())     
        ]);
        log("New user created");
      
    }
    else if(event === "users." + userId + ".sessions." + sessionId + ".create")
    {
      /*
       const googleToken = req.body.providerAccessToken;
      
       try {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleToken}`, {
          method: 'GET'
        });
        const data = await response.json();
        log(userId);
        log(data.name);
        log(data.picture.split("=").slice(0, -1).join("="));
        const updateUserDoc = await db.updateDocument('db', 'users', userId, { name: data.name, picture: data.picture.split("=").slice(0, -1).join("=") }, [ Permission.read(Role.any()), Permission.delete(Role.user(userId)) ]);

        //update document with their name, picture, userId that's in the users collection
        
      } catch (err) {
        error('Error fetching user info:' + err);
      }
      */

    }
    else
    {
        //Gemini implementation to check to see if the post is good
    }
  }
  return res.json({ status: "complete" });
};
