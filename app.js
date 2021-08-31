// inport lib
const express = require('express');
const mongoose = require('mongoose');
const Person = require('./models/Person');
const Group = require('./models/Group');

// create instance
const app = express();
const port = 3000;

//connect to mongodb
const dburl = 'mongodb+srv://netninja:test1234@nodetuts.y2ugo.mongodb.net/nodetuts?retryWrites=true&w=majority';
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

// listen to port 3000
app.listen(port);

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.urlencoded({extended: true}));

// TODO: TypeScript

///////////////////////////////////////////////////////////////////////// Persons CRUD /////////////////////////////////////////////////////////////////////////
app.get('/persons', (req, res) => {//get all persons
    Person.find({})
        .exec(
            function(err, persons) {
                if (err) {
                    res.send('an error occured');
                }
                else {
                    console.log(persons);
                    res.json(persons);
                }
            }
        )
});

app.get('/persons/:fullName', (req, res) => {//get person by name     
    Person.findOne({
        fullName: req.params.fullName,
    })
        .exec(
            function(err, person) {
                if (err) {
                    res.send('an error occured');
                }
                else {
                    console.log(person);
                    res.json(person);
                }
            }
        )
});

//create a new person
app.post('/person', (req, res) => {
    var newPerson = new Person();

    newPerson.fullName = req.body.fullName;


    newPerson.save(function(err, person) {
        if (err) {
            res.send(err);
        }
        else {
            console.log(person);
            res.send(person);
        }
    })
});

//delete person by his id
app.delete('/person/:id',function(req,res) {
    Person.findOneAndRemove({
        _id:req.params.id
    },function(err,person){
        if(err){
            res.send('error deleting');
        }else{
            res.send('the person was deleted').status(204);
            
            //you can add massage that the person was deleted
        }
        });
    });

//
app.post('/getPersonGroups/:id', (req, res) => {//get all groups that person in them.
    Person.findOne({
        _id: req.params.id,
    })
        .exec(
            function(err, person) {
                if (err) {
                    res.send('an error occured');
                }
                else {
                    console.log(person);
                     res.json(person.memberInGroupsByName);

                    
                }
            }
        )
});


///////////////////////////////////////////////////////////////////////// Groups CRUD /////////////////////////////////////////////////////////////////////////



app.get('/groups', (req, res) => {//get all groups
    Group.find({})
        .exec(
            function(err, groups) {
                if (err) {
                    res.send('an error occured');
                }
                else {
                    console.log(groups);
                    res.json(groups);
                }
            }
        )
});

app.get('/groups/:id', (req, res) => {//get group by id
    Group.findOne({
        _id: req.params.id
    })
        .exec(
            function(err, group) {
                if (err) {
                    res.send('an error occured');
                }
                else {
                    console.log(group);
                    res.json(group);
                }
            }
        )
});



app.get('/getAllGroupGroupsAndMembers/:id', (req, res) => {//get all groups and persons in the group
    Group.findOne({
        _id: req.params.id
    })
        .exec(
            function(err, group) {
                if (err) {
                    res.send('an error occured');
                }
                else {
                    console.log(group);
                    res.json({ members: group.members, groups: group.subsetGroups });
                }
            }
        )
});



//create a new group
app.post('/group', (req, res) => {
    var newGroup = new Group();

    newGroup.groupName = req.body.groupName;

    newGroup.save(function(err, group) {
        if (err) {
            res.send('an error occured');
        }
        else {
            console.log(group);
            res.send(group);
        }
    })
});

app.post('/group/:id', (req, res) => {//change the name of a group
    Group.findOne({
        _id: req.params.id
    })
    .exec(
        function(err, group) {
            if (err) {
                res.send('an error occured');
            }
            else {
                group.groupName=req.body.groupName;
                group.save(function(err, group) {
                    if (err) {
                        res.send('an error occured');
                    }
                    else {
                        console.log(group);
                        res.send(group);
                    }
                })
            }
        }
    )
});


app.post('/groupAddMember/:id', (req, res) => {//add member to the group
    Group.findOne({
        _id: req.params.id
    })
        .exec(
            function(err, group) {
                if (err) {
                    res.send('an error occured on fetching group');
                }
                else {
                    console.log(group);
                    if (group.members.findIndex((groupMemberId) => req.body.memberId === groupMemberId) > -1) {
                        res.send(group);
                    }
                    else {
                        if(req.body.memberId===req.params.id){
                            console.log("an error group can not be in another group");
                            res.send("an error group can not be in another group");
                        }
                        else{
                        group.members.push(req.body.memberId);

                        
                        Person.findOne({
                            _id: req.body.memberId
                        })
                        .exec(
                            function(err, person) {
                                if (err) {
                                    res.send('an error occured on fetching person');
                                }
                                else{//you can not add it inside the himself.
                                    if (req.params.id in person.memberInGroups){
                                        res.send('an error because this person already in the group');
                                    }
                                    else{
                                    person.memberInGroups.push(req.params.id);
                                    person.memberInGroupsByName.push(group.groupName);
                                    person.save(function(err, personResult) {
                                        if (err) {
                                            res.send('an error occured on adding member');
                                        }
                                        else {
                                            console.log(personResult);
                                            //res.send(groupResult);
                                        }
                                    })
                                }
                                }
                                
                            }
                        );

                        group.save(function(err, groupResult) {
                            if (err) {
                                res.send('an error occured on adding member');
                            }
                            else {
                                console.log(groupResult);
                                res.send(groupResult);
                            }
                        })
                    }
                    }
                }
            }
        )
});

function isAncestorGroup(groupdIdToSearchFor, groupdId) {
    Group.findOne({
        _id: groupdId
    })
    .exec(function(err, group) {
        group.subsetGroups.forEach(subsetGroupId => {
            if (groupdIdToSearchFor === subsetGroupId || isAncestorGroup(groupdIdToSearchFor, subsetGroupId)) {
                return true;
            }
        });

        return false;
    });
}


app.post('/groupAddGroup/:id', (req, res) => {
    Group.findOne({
        _id: req.params.id
    })
        .exec(
            function(err, group) {
                if (err) {
                    res.send('an error occured on fetching group');
                }
                else {
                    console.log(group);
                    if (req.params.id === req.body.groupId) { // && group.subsetGroups.findIndex((subsetGroupId) => req.body.groupId === subsetGroupId) > -1) {
                        res.send(group);
                    }
                    else {
                        if (group.subsetGroups.length > 0 && group.subsetGroups.some(subsetGroupId => isAncestorGroup(req.body.groupId, subsetGroupId))) {
                            res.send(group);
                        }
                        else {
                            if (req.body.groupId in group.members){
                                res.send('an error because this group already in the group');
                            }
                            else{
                                //if(group.parentGroup!==undefined   && req.body.groupId in group.parentGroup){res.send("error ancestor")}
                                //else{
                                group.subsetGroups.push(req.body.groupId);
                            
                                group.save(function(err, groupResult) {
                                if (err) {
                                    res.send('an error occured on adding group');
                                }
                                else {
                                    // console.log(groupResult);
                                    
                                    Group.findOne({
                                        _id: req.body.groupId
                                    })
                                        .exec(
                                            function(innerErr, innerGroup) {
                                                if (innerErr) {
                                                    res.send('an error occured on adding group');
                                                }
                                                else {
                                                    innerGroup.parentGroup = req.params.id;

                                                    console.log(innerGroup);

                                                    innerGroup.save(function(err, innerGroupResult) {
                                                        console.log(innerGroupResult);
                                                        res.send(groupResult);
                                                    });
                                                }
                                            });
                                }
                            })
                            //}
                        }//
                        }//
                    }
                }
            }
        )
});


// delete groups by and his sons
/////////////////////////////////////////
app.delete('/group/:id',function(req,res) {
    deleteGroup(req.params.id);
    res.send('the group was deleted').status(204);
});

function deleteGroup(groupdId) {
    Group.findOneAndRemove({
        _id: groupdId
    },function(err,group){
        if(err){
            // res.send('error deleting');
        } else {
            // remove group from parent subset groups
            
            if (group.parentGroup !== null && group.parentGroup !== undefined && group.parentGroup !== "") {
                Group.findOne({
                    _id: group.parentGroup
                })
                .exec(
                    function(err, parentGroup) {
                        if (err) {
                            // res.send('an error occured on fetching group');
                            console.log(err);
                        }
                        else {
                            if (parentGroup !== null && parentGroup !== undefined) {
                                groupIndex = parentGroup.subsetGroups.indexOf(groupdId);
                                parentGroup.subsetGroups.splice(groupIndex, 1);
                                parentGroup.save(function(err, parentGroupResult) {
                                    console.log(parentGroupResult);
                                    // res.send("delete son also").status(204);
                                });
                            }
                        }
                    });
            }

            // update persons group memebership
            group.members.map((personid) => {
                Person.findOne({
                    _id: personid,
                })
                    .exec(
                        function(err, person) {
                            if (err) {
                                // res.send('an error occured');
                            }
                            else {
                                let groupIndex = person.memberInGroups.indexOf(req.params.id);
                                let groupNameIndex = person.memberInGroupsByName.indexOf(group.groupName);

                                person.memberInGroups.splice(groupIndex, 1);
                                person.memberInGroupsByName.splice(groupNameIndex, 1);

                                person.save(function(err, personResult) {
                                    if (err) {
                                        // res.send('an error occured on adding group');
                                    }
                                    else {
                                        // res.send(personResult);
                                    }
                                });
                            }
                        }
                    )
            });
            
            // res.status(204).send('the group was deleted');

            
            // delete subset groups
            group.subsetGroups.forEach((subsetGroupId) => {
                deleteGroup(subsetGroupId);
            });
        }
    });
}