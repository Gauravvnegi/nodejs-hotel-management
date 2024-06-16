const express = require('express');
const Person = require('./../models/Person');
const router = express.Router();
const {jwtAuthMiddleware , generateToken} = require('./../jwt')
router.post('/signup',async(req,res)=>{
    try{
        const data = req.body;
        const newPerson = new Person(data);
        const response = await newPerson.save();
        console.log("Data Saved");

        // const token = generateToken(response.username);
        const payload ={
            id:response.id,
            username:response.username
        }
        console.log(payload)
        const token = generateToken(payload);
        console.log("Token is  : " , token);
        res.status(200).json({response :response , token :token});
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Error while saving"})
    }
})

router.post('/login',async(req,res)=>{
    try{
        const {username , password} = req.body;

        const user = await Person.findOne({username: username});
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({err:"Invalid username or password"});
        }

        const payload={
            id:user.id,
            username:user.username
        }
        const token = generateToken(payload);
        res.json({token})
    }catch(error){
        console.log(error);
        res.status
    }
})

router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        console.log("User Data:", userData);
        const userId = userData.id; // Assuming `id` is the correct property in `req.user`

        // Fetch user data from MongoDB
        const user = await Person.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }}
) 
router.get('/' ,jwtAuthMiddleware,async(req,res)=>{
    try{
        const data = await Person.find();
        console.log("Data Fetched");
        res.status(200).json(data);

    }catch(err){
        console.log("Error while fetching person, Data");
        res.status(500).json({err:"Error while fetching person"})
    }
})


///Params

router.get('/:workType',jwtAuthMiddleware, async(req, res)=>{
    try{
        const workType = req.params.workType;
        if(workType=='waiter' || workType=='chef' || workType=='manager'){
            const response  = await Person.findOne({work:workType});
            console.log("Data Fetched");
            res.status(200).json(response);
        }
    }catch(err){
        console.log("Error while fetching person, Data");
        res.status(500).json({err:"Error while fetching person"})
    }
})


//put
router.put('/:id', async (req, res) => {
    try {
        const personID = req.params.id;
        const personData = req.body;

        const response = await Person.findByIdAndUpdate(personID, personData, {
            new: true,
            runValidators: true
        });

        // if (!response) {
        //     return res.status(404).json({ message: 'Person not found' });
        // }

        console.log("Data updated");
        res.status(200).json(response);
    } catch (err) {
        console.error("Error while putting person", err);
        res.status(500).json({ err: "Error in Put Method" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const removeId = req.params.id;
        const removePersonData = await Person.findByIdAndDelete(removeId);

        if (!removePersonData) {
            console.log("Person not found");
            return res.status(404).json({ error: "Person not found" });
        }

        console.log("Person delete success");
        res.status(200).json(removePersonData);
    } catch (err) {
        console.error("Error in deleting person data", err);
        res.status(500).json({ err: "Error in deleting person data" });
    }
});
module.exports = router;
