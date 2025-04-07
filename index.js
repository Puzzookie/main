import { Client, Account, Databases, Users, Permission, Role, Query, ID } from 'node-appwrite';

export default async ({ req, res, log, error }) => {

  if (req.path === "/") 
  {
    const userId = req.headers['x-appwrite-user-id'];
    const client = new Client()
       .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
       .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
       .setKey(req.headers['x-appwrite-key'] ?? '');
    
    const db = new Databases(client);
    const event = req.headers['x-appwrite-event'];
    
    let sessionId = "";
    if(req.body.$id)
    {
      sessionId = req.body.$id;
    }

    log(userId);
    log(sessionId);
    
    if(event === "users." + userId + ".create")
    {
        let createUserDoc = await db.createDocument('db', 'users', userId, { name: req.body.name, picture: "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"}, [ Permission.delete(Role.user(userId)) ]);
      
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
        const updateUserDoc = await db.updateDocument('db', 'users', userId, { name: data.name, picture: data.picture.split("=").slice(0, -1).join("=") }, [ Permission.delete(Role.user(userId)) ]);

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
