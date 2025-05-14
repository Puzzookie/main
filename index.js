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

  const user = await users.get(userId);

  if (req.path === "/") 
  { 
    const event = req.headers['x-appwrite-event'];
    
    if(event === "users." + userId + ".create")
    {
        const createUserDoc = await db.createDocument('db', 'users', userId, { name: req.body.name, picture: "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"}, [ Permission.read(Role.user(userId)) ]);
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
         
        if(user.labels.length === 0)
        {
          const updateUserDoc = await db.updateDocument('db', 'users', userId, { name: data.name, picture: data.picture.split("=").slice(0, -1).join("=") }, [ Permission.read(Role.user(userId)) ]);
        }
        else
        {
            if(user.labels.includes("male"))
            {
                const updateUserDoc = await db.updateDocument('db', 'users', userId, { name: data.name, picture: data.picture.split("=").slice(0, -1).join("=") }, [ Permission.read(Role.label("female")), Permission.read(Role.user(userId))  ]);
            }
            else
            {
                const updateUserDoc = await db.updateDocument('db', 'users', userId, { name: data.name, picture: data.picture.split("=").slice(0, -1).join("=") }, [ Permission.read(Role.label("male")), Permission.read(Role.user(userId)) ]);
            }
        }
  
      }
      catch (err) 
      {
        error('Error fetching user info:' + err);
      }

    }
  }
  else if(req.path === "/setup")
  {
      if(user.labels.length === 0)
      {
          const body = JSON.parse(req.body); 
          log(body);
    
          const getUserDoc = await db.getDocument('db', 'users', userId);

          if(getUserDoc)
          {
            try
            {
              if(body.gender === "male")
              {
                const updateUserDoc = await db.updateDocument('db', 'users', userId, { name: getUserDoc.name, picture: getUserDoc.picture }, [ Permission.read(Role.label("female")), Permission.read(Role.user(userId)) ]);
                const createProfileDoc = await db.createDocument('db', 'profiles', userId, {bio: body.bio, height: body.height, zip: body.zip, birthYear: body.birthYear}, [ Permission.read(Role.label("female")), Permission.read(Role.user(userId)), Permission.update(Role.user(userId)) ]);

              }
              else
              {
                const updateUserDoc = await db.updateDocument('db', 'users', userId, { name: getUserDoc.name, picture: getUserDoc.picture }, [ Permission.read(Role.label("male")), Permission.read(Role.user(userId)) ]);
                const createProfileDoc = await db.createDocument('db', 'profiles', userId, {bio: body.bio, height: body.height, zip: body.zip, birthYear: body.birthYear}, [ Permission.read(Role.label("male")), Permission.read(Role.user(userId)), Permission.update(Role.user(userId)) ]);
              }
    
              const promise = await users.updateLabels(
                  userId,
                  [ body.gender ]
              );
            }
            catch(err)
            {
                error(err);
            }
          }
      }
  }
  else if(req.path === "/delete")
  {
      try
      {
        const getUserDoc = await db.getDocument('db', 'users', userId);
        const deleteUserDoc = await db.deleteDocument('db', 'users', userId);
      }
      catch(err)
      {
          error(err);
      }
      finally
      {
        try
        {
          const getProfileDoc = await db.getDocument('db', 'profiles', userId);
          const deleteProfileDoc = await db.deleteDocument('db', 'profiles', userId);
        }
        catch(err2)
        {
          error(err2);
        }
        finally
        {
          const deleteAccount = await users.delete(userId);
        }
      }
  }
  return res.json({ status: "complete" });
};
