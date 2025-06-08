const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://luisalejandropineruavivas:${password}@cluster0.bqnm00v.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
})

if (process.argv.length < 4) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(phone => {
        console.log(`${phone.name} ${phone.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log('Invalid number of arguments. Use: node mongo.js <password> [<name> <number>]')
    mongoose.connection.close()
}

