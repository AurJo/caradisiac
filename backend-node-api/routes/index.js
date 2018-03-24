var express = require('express'); 
var router = express.Router(); 

var fs = require("fs");
var jsonfile = require('jsonfile');
var elasticsearch = require('elasticsearch'); 

const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');

var clientConnexion = new elasticsearch.Client({
    host: 'localhost:9200', 
    log: 'trace'
}); 

router.get('/populate', function(req, res, next){

    async function printBrands(){
        
        const brands = await getBrands();
        
        brands.forEach(async brand => {
            const models = await getModels(brand); 
            var listModelsPerBrand = []
            models.forEach(model => {

                var indexLine = { index :{ _index :  'models', _type :'model' , _id: model.uuid }}; 
                var modelLine = { brand : model.brand , image : model.image, model : model.model , volume : model.volume , uuid : model.uuid , name : model.name};  
                listModelsPerBrand.push(indexLine); 
                listModelsPerBrand.push(modelLine);        
            });

            clientConnexion.bulk({
                body: listModelsPerBrand
            }, function(error, response){
                if (error){
                    console.error(error); 
                    return; 
                }
                else {
                    console.log(response); 
                }
            });

        });
     
    }
    printBrands(); 

    res.render('index', {title : 'ElasticSearch'}); 

})

router.get('/cars', function(req, res, next){

    res.setHeader('Access-Control-Allow-Origin', '*');
    
    var nbr; 
    if (req.query.nbr != undefined){
        nbr = req.query.nbr; 
    }
    else{
        nbr = 10; 
    }

    clientConnexion.search({
        index: 'models', 
        type : 'model', 
        body: {
            size:nbr, 
            query:{
                match_all:{}
            }, 
            sort:{
                "volume.keyword":{
                    order: "desc"
                }
            }
        }
    }).then(function(res2){
        var jsonModel = []
        res2.hits.hits.forEach(model => {
            console.log(model['_source']); 
            jsonModel.push(model['_source']);
        });
        res.json(jsonModel);
    }, function(err){
        console.trace(err.message); 
    }); 
    //res.render('index'); 
});


module.exports = router; 