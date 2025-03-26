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
    log(event);
    let sessionId = "";
    
    if(req.body.$id)
    {
      sessionId = req.body.$id;
    };

    //const session = req.headers[
    if(event === "users." + userId + ".create")
    {
        log("New user created");
    }
    else if(event === "users." + userId + ".sessions." + sessionId + ".create")
    {
        log("New session created");
        const googleToken = req.body.providerAccessToken;
        log(googleToken);
      
       try {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleToken}`, {
          method: 'GET'
        });
        const data = await response.json();
        log(data);
        log(data.picture);
      } catch (error) {
        error('Error fetching user info:', error);
      }

    }
  }
  return res.json({ status: "complete" });
};
