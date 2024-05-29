const express = require('express');
const MenuItem = require('./../models/MenuItem')
const router = express.Router();
router.post('/' , async(req,res)=>{
    try{
        const data = req.body;
        const newMenuItem = await new MenuItem(data);
        const response = await newMenuItem.save();
        console.log("Menu Data Saved");
        res.status(200).json(response);
    }catch(err){
        console.log("Error while creating menu");
        res.status(500).json({err:"Error while creating menu"});
    }
})
router.get('/' , async(req,res)=>{
    try{
        const data = await MenuItem.find();
        console.log("Menu Data Fetched");
        res.status(200).json(data);
    }catch(err){
        console.log("error in getting menu data");
        res.status(500).json({err : "Error in menu data"})
    }
})

module.exports = router;