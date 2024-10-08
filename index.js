const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override')
const app = express();

app.use(methodOverride('_method'));
const port = 3000;

app.use(express.static(path.join(__dirname,"public")))
app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))

main().then(
    console.log("succesfully connected with database")
).catch(
    err=>console.log(err)
)

 async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/chat-data")
    
}

const userSchema = mongoose.Schema({
    username: String,
    age: Number,


    from:{
        type: String,
        require: true
    },

    to:{
        type :String,
        require :true
    },

    msg:{
        type: String,
        maxLenght:50
    },
    date:{
        type: Date
    }
})

const Chat = mongoose.model("Chat",userSchema);

const users = ([
    {
    from : "akash",
    to: "maithili",
    msg: "hello",
    date: new Date()

},
{
    from : "maithili",
    to: "akash",
    msg: "hi",
    date: new Date()

}]);

Chat.insertMany(users);



app.get("/chats",async(req,res)=>{
     const users = await Chat.find();
    res.render("allchats.ejs",{users});
})

app.get("/chats/:id",async(req,res)=>{
 const {id} = req.params;
    const singleChat = await Chat.findById(id);
    //const users = await Chat.find();
  // console.log(singleChat);
    res.render("singleUser.ejs",{singleChat});
})

app.get("/chats/:id/edit", async (req,res)=>{
    const {id} = req.params;
   // console.log(id);
    const singleChat = await Chat.findById(id);
    res.render("edit.ejs",{singleChat});
    
})

app.put("/chats/:id",async(req,res)=>{
    const{id} = req.params;
    //console.log(id);
    const{msg} = req.body;
    let newMsg = await Chat.findByIdAndUpdate(id,{msg : msg},{new:true});
    console.log(newMsg);
    res.redirect("/chats");
})

app.delete("/chats/:id",async (req,res)=>{
    const {id}  = req.params;
    await Chat.findByIdAndDelete(id);
    res.redirect("/chats");

})

app.listen(port,()=>{ 
    console.log(`listening on port ${port}`);
})