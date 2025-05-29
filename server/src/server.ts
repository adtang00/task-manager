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
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,  
};
app.use(cors(corsOptions));



app.get('/auth/user', async (req: Request, res: Response): Promise<any> => {
  const token = req.cookies.token
  console.log('Cookies:', req.cookies);
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

//Quering from supabase
app.get('/task/get', async (req: Request, res: Response) => {
  const {data, error} = await supabase.from('Tasks').select('*');
  if (error) {
    console.error('Error fetching data in GET:', error.message);
    res.sendStatus(500);
  }
  else {
    res.json(data)
  }
});

//Inserting into supabase
app.post('/task/post', async (req: Request, res: Response) => {
  const {data, error} = await supabase
    .from('Tasks')
    .insert({task: req.body['task'], description: req.body['description'], priority: req.body['priority'],})
    .select(); 
  if (error) {
    console.error('Error fetching data in POST:', error.message);
    res.sendStatus(500); 
  }
  else {
    res.sendStatus(201); 
  }
});

//Delete from supabase
app.delete('/task/delete', async (req: Request, res: Response) => {
  try {
    const id = Number(req.body?.id);
    console.log('Parsed ID:', id, typeof id);
    const {error} = await supabase
      .from('Tasks')
      .delete()
      .eq('id', id)
    res.sendStatus(201);
  }
  catch (err) {
    console.error('Error deleting data:', err);
    res.sendStatus(500);
  }
});

//Starting the server
const port = process.env.PORT || 5000; // You can use environment variables for port configuration
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});