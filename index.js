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
    log(req);
    
    const sessionId = "test";
    //const session = req.headers[
    if(event === "users." + userId + ".create")
    {
        log("New user created");
    }
    else if(event === "users." + userId + ".sessions." + sessionId + ".create")
    {
        log("New session created");

       /* const sessionClient = new Client()
           .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
           .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
           .setSession(sessionId);
  
        const account = new Account(sessionClient);
    
        const result = await account.getSession(
            '<SESSION_ID>'
        );*/
    }
  }
  return res.json({ status: "complete" });
};
