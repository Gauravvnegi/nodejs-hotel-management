const express = require('express');
const Person = require('./../models/Person');
const router = express.Router();
router.post('/',async(req,res)=>{
    try{
        const data = req.body;
        const newPerson = new Person(data);
        const response = await newPerson.save();
        console.log("Data Saved");
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Error while saving"})
    }
})
router.get('/',async(req,res)=>{
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

router.get('/:workType', async(req, res)=>{
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
