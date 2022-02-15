const express = require('express');
const app = express();
const bodyParser= require("body-parser");
const dbConnection = require('./db');
const { ObjectId, FindCursor } = require('mongodb');
const req = require('express/lib/request');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
let db = null;

 dbConnection.connection.then((connection)=>{
    db = connection
    console.log("DB is now connected")
 }).catch((err)=>{
    console.log(err)
 })

 //create user

 app.post('/post', async (req,res)=>{
    try {
         const dataJson = req.body;
         const createUser = await db.collection('users').insertOne(dataJson);
         res.json(createUser);
         console.log(createUser);
 
    } catch (error) {
        console.log(error)
    }
 
 })

 //create user
 app.get('/post',async(req,res)=>{
     try{
        const user= db.collection('users')
        const userFind=user.find()
        const foundUser=await userFind.toArray()
        res.json(foundUser)
     }catch(error){
         console.log(error)
     }
 })

 //find  a single user
 app.get('/post/:id',getUser, async (req,res)=>{
    res.json(res.user)
})

//edit a user


app.patch('/post/:id',getUser, async(req,res)=>{
    const id = req.params.id
    if(req.body.name != null){
        res.user.name = req.body.name
    }
    if(req.body.age != null){
        res.user.age = req.body.age
    }
    if(req.body.mobile != null){
        res.user.mobile = req.body.mobile
    }
    try {
    const updatedUser = res.user
    const updateUser= await db.collection('users').updateOne(
        { _id: new ObjectId(id) },
        { $set:updatedUser},
        { upsert: true }
    )
    res.json({ message : "updated user"})
    } catch (error) {
        console.log(error)
    }
    
})
app.delete('/post/:id',getUser,(req,res)=>{
    const {id}=req.params
    try{
        const deleteUser=db.collection('users').deleteOne({
            _id:ObjectId(id)
        })
        res.json({message:'deleted the user'})
    } catch (error) {
        console.log(error)
    }
 })


async function getUser(req,res,next){
    const id = req.params.id;
        let user
        try {
            user = await db.collection('users').findOne(ObjectId(id)) 
            if(user === null){
                return res.status(404).json({message: 'cannot find user'})
            }
        } catch (error) {
            console.log(error);
        }
        res.user = user;
        next();
        
    
}

 app.listen(3000, ()=>{
    console.log("server listening on 3000");
})