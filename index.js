import { Client, Account, Databases, Users, Permission, Role, Query, ID } from 'node-appwrite';

export default async ({ req, res, log, error }) => {

  if (req.path === "/") 
  {
     const jwt = req.headers['x-appwrite-user-jwt'];
      if (jwt) {
        const client = new Client()
            .setEndpoint('https://cloud.appwrite.io/v1')
            .setProject('66f17bf2003d23b70795')
            .setJWT(jwt);
        
        const databases = new Databases(client);
        
        const documents = await databases.listDocuments(
            'db',
            'test'
        );
        
        log(documents);

      } else {
        log('No authenticated user');
      }
      return res.json({ status: 'ok' });
    log(req.headers);
  }
  return res.json({ status: "other" });
};
