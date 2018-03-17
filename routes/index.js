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
                var modelLine = { brand : model.brand , model : model.model , volume : model.volume , uuid : model.uuid , name : model.name};  
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



module.exports = router; 