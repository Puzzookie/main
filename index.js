import { Client, Account, Databases, Users, Permission, Role, Query, ID } from 'node-appwrite';

export default async ({ req, res, log, error }) => {

  if (req.path === "/") 
  {
    const userId = req.headers['x-appwrite-user-id'];
    const client = new Client()
       .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
       .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
       .setKey(req.headers['x-appwrite-key'] ?? '');
    
    const event = req.headers['x-appwrite-event'];
    
    let sessionId = "";
    if(req.body.$id)
    {
      sessionId = req.body.$id;
    }
    
    if(event === "users." + userId + ".create")
    {
        //create a collection for userId
        //create a document in users collection where the id is the userId of the user, it has a name, and a picture. Anyone can read on collection level, if deleted, delete collection and user
        //create a document to store the latest post of each user
        log("New user created");
    }
    else if(event === "users." + userId + ".sessions." + sessionId + ".create")
    {
       const googleToken = req.body.providerAccessToken;
      
       try {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleToken}`, {
          method: 'GET'
        });
        const data = await response.json();
        log(userId);
        log(data.name);
        log(data.picture.split("=").slice(0, -1).join("="));

        //update document with their name, picture, userId that's in the users collection
        
      } catch (err) {
        error('Error fetching user info:' + err);
      }

    }
    else
    {
        //Gemini implementation to check to see if the post is good
    }
  }
  return res.json({ status: "complete" });
};
