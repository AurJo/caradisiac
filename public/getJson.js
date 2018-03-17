var fs = require("fs");
const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');

const pathJsonModels = "./public/models.json"; 
const textfile = '[\n'; 
fs.writeFileSync(pathJsonModels, textfile)


printBrands()

async function printBrands(){
    const brands = await getBrands();
    
    brands.forEach(async brand => {
        const models = await getModels(brand); 
        console.log(brand);
        models.forEach(model => {
            fs.appendFileSync(pathJsonModels,'{"brand":"'+model.brand+'","model":"'+model.model+'","volume":"'+model.volume+'","uuid":"'+model.uuid+'","name":"'+model.name+'"},\n');        
        });
    });

}