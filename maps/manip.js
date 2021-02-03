// Helper to normalise maps
var fs = require('fs');
var map = JSON.parse(fs.readFileSync("maps/major0.json", 'utf8'));
let layers = []
map.layers.forEach(l => {
    let layer = l
    let newData = []
    if (l.data) {
        l.data.forEach(el => {
            if(el>=4096) {
                el = el%4096
            } else {
                // el =     
            }
            newData.push(el)
        })
        layer.data = newData
    }
    layers.push(layer)
})
map.layers= layers
map.tilesets = [map.tilesets[0]]
let writableObject = JSON.stringify(map)
console.log(`Map ready ${writableObject}`)
fs.writeFileSync("./maps/major.json", writableObject, (err) => { 
    if (err) 
      console.log(err); 
    else { 
      console.log("File written successfully\n"); 
    } 
}); 