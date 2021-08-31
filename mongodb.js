const mongoose = require('mongoose');
//connect to mongodb
const dburl = 'mongodb+srv://netninja:test1234@nodetuts.y2ugo.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true}) ;
// get notified if we connect successfully or if a connection error occurs//dor
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

//get a reference to it and define our kittens //dor
const kittySchema = new mongoose.Schema({
    name: String
  });
//compiling our schema into a Model.//dor
const Kitten = mongoose.model('Kitten', kittySchema);
//create a kitten document representing the little guy we just met on the sidewalk outside//dor
const silence = new Kitten({ name: 'Silence' });
console.log(silence.name); // 'Silence'

//how to add "speak" functionality to our documents//dor
// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function () {
    const greeting = this.name
      ? "Meow name is " + this.name
      : "I don't have a name";
    console.log(greeting);
  }
  
  const Kitten = mongoose.model('Kitten', kittySchema);
 
//Functions added to the methods property of a schema get                      compiled into the Model prototype and exposed on each document instance//dor
const fluffy = new Kitten({ name: 'fluffy' });
fluffy.speak(); // "Meow name is fluffy"

//The first argument to the callback will be an error if any occurred.//dor
fluffy.save(function (err, fluffy) {
    if (err) return console.error(err);
    fluffy.speak();
  });
//access all of the kitten documents through our Kitten model.//dor
Kitten.find(function (err, kittens) {
    if (err) return console.error(err);
    console.log(kittens);
  })
//filter our kittens by name, Mongoose supports MongoDBs rich querying syntax.//dor
Kitten.find({ name: /^fluff/ }, callback);
//123-160
// var groups = [];
                    // person.memberInGroups.forEach((groupId) => {
                    //     // console.log(groupId);
                    //     Group.findOne({
                    //         _id: groupId
                    //     })
                    //         .exec(
                    //             function(err, group) {
                    //                 if (err) {
                    //                     res.send('an error occured');
                    //                 }
                    //                 else {
                    //                     groups.push(group.groupName);
                    //                     console.log(group.groupName);
                    //                 }
                    //             }
                    //         )
                    // });

                    // var groups = person.memberInGroups.map((groupId) => {
                    //     Group.findOne({
                    //         _id: groupId
                    //     })
                    //         .exec(
                    //             function(err, group) {
                    //                 if (err) {
                    //                     res.send('an error occured');
                    //                 }
                    //                 else {
                    //                     console.log(group.groupName);
                    //                     return group.groupName;
                    //                 }
                    //             }
                    //         )
                    // });
                    // console.log(groups);

                    // res.send(groups);



                    //41-57
                    //define
// app.get('/persons/:id', (req, res) => {
//     Person.findOne({
//         _id: req.params.id,
//     })
//         .exec(
//             function(err, person) {
//                 if (err) {
//                     res.send('an error occured');
//                 }
//                 else {
//                     console.log(person);
//                     res.json(person);
//                 }
//             }
//         )
// });
