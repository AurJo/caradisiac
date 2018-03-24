var jsonfile = require('jsonfile');
var elasticsearch = require('elasticsearch'); 

var pathJsonFile = "./public/models.json"; 

var models = jsonfile.readFileSync(pathJsonFile); 

var clientConnexion = new elasticsearch.Client({
    host: 'localhost:9200', 
    log: 'trace'
}); 

var listModels = []; 
for (var i=1; i< models.length; i++)
{
    // insertion de la ligne index 
    var indexLineJson = { index :{ _index :  'models', _type :'model' , _id: models[i].uuid }}; 
    // ajout dans le nouveau tableau
    listModels.push(indexLineJson); 
    listModels.push(models[i]);  
}

clientConnexion.bulk({
    body: listModels
}, function(error, response){
    if (error){
        console.error(error); 
        return; 
    }
    else {
        console.log(response); 
    }
}); 