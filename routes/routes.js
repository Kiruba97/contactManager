const express = require('express');
const router = express.Router();
const Model = require('../model/model');

const { parse } = require('json2csv');
const fs = require('fs');

//export csv
router.post('/export', async (req, res) => {
    Model.find({}, {__id:0,__v:0},(err,post) => {
        console.log("post", post);

        const fields = ['name', 'number'];
        const opts = { fields };

        try{
            const csv = parse(post, opts);
            fs.writeFile("post1.csv", csv, function(error){
                if(error) throw error;
                console.log("write successfully")
            });
            console.log(csv);
        } catch (err) {
            console.error(err);
        }
    })
})

//Post Method
router.post('/post', async (req, res) => {
    const data = new Model({
        name: req.body.name,
        number: req.body.number
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }

})

//Get all Method
router.get('/getAll', async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    try{
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Contact of ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})



module.exports = router;