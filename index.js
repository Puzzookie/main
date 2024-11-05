import { Client, Account, Databases, Users, Permission, Role, Query, ID } from 'node-appwrite';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async ({ req, res, log, error }) => {

    /*
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(req.headers['x-appwrite-key'] ?? '');
  
    const account = new Account(client);
    const db = new Databases(client);
    const users = new Users(client);
    */

    log(req.headers);

    return res.json({
        status: "Success"
    });
};
