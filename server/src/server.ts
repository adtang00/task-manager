import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()

//Supabase Setup
const anon_key: string = process.env.ANON_KEY || '';
const supabase_url: string = process.env.SUPABASE_URL || '';
const supabase = createClient(supabase_url, anon_key);

const app = express();
app.use(express.json());
app.use(cookieParser())

const corsOptions = {
  origin: 'http://localhost:5173',  
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT'],
  allowedHeaders: ['Content-Type'],
  credentials: true,  
};
app.use(cors(corsOptions));


//Check for active user
app.get('/auth/user', async (req: Request, res: Response): Promise<any> => {
  const token = req.cookies.token
  //console.log('Cookies:', req.cookies);
  if(!token){
    return res.status(401).json({ message: 'No token provided' });
  }
  else{
    const {data, error} = await supabase.auth.getUser(token)
    if(error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    else {
      //console.log('Success getting user')
      return res.status(200).json({ user: data.user });
    }
  }
});

//Signing in
app.post('/auth/signin', async(req: Request, res: Response): Promise<any> => {
  const {email, password} = req.body
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  if (error){
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  else {
    const token = data.session.access_token

    // Set the token as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      //sameSite: 'Strict',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    //return res.status(200)
    })
    return res.status(200).json({ message: 'Signed in successfully' });
  }
});

//Signing Out
app.post('/auth/logout', async(req: Request, res:Response): Promise<any> => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    return res.status(401).json({message: "Sign-out failed"})
  }
  else{
    res.clearCookie('token', {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      //sameSite: 'Strict',
    });
    return res.status(200).json({message: "Sign-out successful"})
  }
});

//Signing up
app.post('/auth/signup', async(req: Request, res: Response): Promise<any> => {
  const {email, password} = req.body
  const {data, error} = await supabase.auth.signUp({email: email, password: password})
  if(error) {
    return res.status(401).json({message: "Signup failed."})
  }
  else {
    return res.status(200).json({message: "Signup successful."})
  }
})

//Quering from supabase
app.get('/task/get', async (req: Request, res: Response): Promise<any> => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token found' });
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData?.user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
  else{
    const userId = userData.user.id;

    const {data, error} = await supabase.from('Tasks').select('*').eq('user_id', userId);
    if (error) {
      console.error('Error fetching data in GET:', error.message);
      return res.sendStatus(500);
    }
    else {
      return res.json(data)
  }}
});

//Inserting into supabase
app.post('/task/add', async (req: Request, res: Response): Promise<any> => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token found' });
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData?.user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
  else{
    const userId = userData.user.id;
    const {data, error} = await supabase
      .from('Tasks')
      .insert({task: req.body['task'], description: req.body['description'], priority: req.body['priority'], user_id: userId})
      .select(); 
    if (error) {
      console.error('Error fetching data in POST:', error.message);
      return res.sendStatus(500); 
    }
    else {
      return res.sendStatus(201); 
    }
  } 
});

//Delete from supabase
app.delete('/task/delete', async (req: Request, res: Response): Promise<any> => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token found' });
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData?.user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
  else{
    const userId = userData.user.id;
    try {
      const id = Number(req.body?.id);
      console.log('Parsed ID:', id, typeof id);
      const {error} = await supabase
        .from('Tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      res.sendStatus(201);
    }
    catch (err) {
      console.error('Error deleting data:', err);
      return res.sendStatus(500);
    }
  }
});

//Updating into supabase
app.put('/task/update', async (req: Request, res: Response): Promise<any> => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token found' });
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData?.user) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
  else{
    const userId = userData.user.id;
    const {data, error} = await supabase
      .from('Tasks')
      .update({task: req.body['task'], description: req.body['description'], priority: req.body['priority'], user_id: userId})
      .eq('id', req.body['id'])
      .select(); 
    if (error) {
      console.error('Error updating data:', error.message);
      return res.sendStatus(500); 
    }
    else {
      return res.sendStatus(201); 
    }
  } 
});

//Starting the server
const port = process.env.PORT || 5000; // You can use environment variables for port configuration
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});