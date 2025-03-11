import { Client, Account, Databases, Users, Permission, Role, Query, ID } from 'node-appwrite';

export default async ({ req, res, log, error }) => {

  if (req.path === "/") 
  {
    try {
        log(req.headers);
        return res.json({ status: true }, 200, {
          'Access-Control-Allow-Origin': 'https://9000-idx-lds-1737864063978.cluster-aj77uug3sjd4iut4ev6a4jbtf2.cloudworkstations.dev',
        });     
    } 
    catch (err) {
         return res.json({ status: false }, 200, {
          'Access-Control-Allow-Origin': 'https://9000-idx-lds-1737864063978.cluster-aj77uug3sjd4iut4ev6a4jbtf2.cloudworkstations.dev',
        });     
        error(err);
      }
  }
  return res.json({
    status: "Success"
  });
};
