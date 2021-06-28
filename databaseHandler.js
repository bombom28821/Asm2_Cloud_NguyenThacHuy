const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://thachuy:0974394812@cluster0.c9nup.mongodb.net/test";
const dbName = "Asm2";

async function searchProduct(condition, collectionName){
    const dbo = await getDbo();
    const searchCondition = new RegExp(condition, 'i');
    var results = await dbo.collection(collectionName).find({name:searchCondition}).toArray();
    return results;
}
async function findById(id){
    const ObjectID = require('mongodb').ObjectID;
    const condition = {"_id": ObjectID(id)};

    const dbo = await getDbo();
    const product = await dbo.collection('Products').findOne(condition);
    return product;
}
async function updateProduct(newValue, id){
    const ObjectID = require('mongodb').ObjectID;
    const condition = {"_id": ObjectID(id)};

    const dbo = await getDbo();
    await dbo.collection('Products').updateOne(condition, newValue);
}

async function deleteProduct(id){
    const ObjectID = require('mongodb').ObjectID;
    const condition = {"_id": ObjectID(id)};

    const dbo = await getDbo();
    await dbo.collection("Products").deleteOne(condition);
}

async function insertOneIntoCollection(documentToInsert, collectionName){
    const dbo = await getDbo();
    await dbo.collection(collectionName).insertOne(documentToInsert);
}

async function getDbo(){
    const client = await MongoClient.connect(url);
    const dbo = client.db(dbName);
    return dbo;
}

async function checkUser(nameIn, passwordIn){
    const dbo = await getDbo();
    const results = await dbo.collection('Users').findOne({$and:[{username: nameIn},{password: passwordIn}]});
    if(results !=  null){
        return true;
    }else{
        return false;
    }
}

module.exports = {insertOneIntoCollection, checkUser,searchProduct,findById,updateProduct,deleteProduct}