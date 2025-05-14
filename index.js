import { Client, Account, Databases, Users, Permission, Role, Query, ID } from 'node-appwrite';

export default async ({ req, res, log, error }) => {

  const userId = req.headers['x-appwrite-user-id'];
  
  const client = new Client()
     .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
     .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
     .setKey(req.headers['x-appwrite-key'] ?? '');
  
  const account = new Account(client);
  const users = new Users(client);
  const db = new Databases(client);

  
  if (req.path === "/") 
  { 
    const event = req.headers['x-appwrite-event'];
    
    if(event === "users." + userId + ".create")
    {
        const createUserDoc = await db.createDocument('db', 'users', userId, { name: req.body.name, picture: "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"}, [ Permission.delete(Role.user(userId)) ]);
    }
    else if(event === "users." + userId + ".sessions." + req.body.$id + ".create")
    {
       const googleToken = req.body.providerAccessToken;
      
       try 
       {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleToken}`, {
          method: 'GET'
        });

        const data = await response.json();
        const updateUserDoc = await db.updateDocument('db', 'users', userId, { name: data.name, picture: data.picture.split("=").slice(0, -1).join("=") }, [ Permission.delete(Role.user(userId)) ]);
  
      }
      catch (err) 
      {
        error('Error fetching user info:' + err);
      }

    }
    else if(event === "databases.db.collections.users.documents." + userId + ".delete")
    {
        const deleteAccount = await users.delete(userId);
    }
    else
    {
        //Gemini implementation to check to see if the post is good
    }
  }
  else if(req.path === "/setup")
  {
      log(userId);
      log(req.body);
      log(req.headers);


      const body = JSON.parse(req.body); // this is how you parse a string into JSON 

    
      const promise = await users.updateLabels(
          userId,
          [ body.gender ]
      );
      
  }
  return res.json({ status: "complete" });
};
