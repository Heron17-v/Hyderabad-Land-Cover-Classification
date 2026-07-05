

var image = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")

// filtering image

var filteredCollection = image
 .filterBounds(hyd) 
 .filterDate('2025-01-01', '2025-12-31')
 .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20));

var sentinelImage = filteredCollection.median();

// center the map

Map.centerObject(hyd, '10')

// define visual parameters

var visParams1 = {
  min: 0,
  max: 3000,
  bands: ['B4', 'B3', 'B2'],
}

print(sentinelImage.bandNames())

// add to map

Map.addLayer(sentinelImage.clip(hyd), visParams1, 'Sentinel2')

// calculate NDVI, NDWI, NDBI, rename, and map them

var ndvi = sentinelImage.normalizedDifference(['B8', 'B4']).rename('NDVI')
var ndwi = sentinelImage.normalizedDifference(['B3','B8']).rename('NDWI')
var ndbi = sentinelImage.normalizedDifference(['B11','B8']).rename('NDBI')

var visParams1 = {
  min:-1,
  max:1,
  palette:[ 
    'blue', //water
    'white', //bare
    'green'] //vegetation
}

var visParams2 = {
  min:-1,
  max:1,
  palette:[ 
    'brown', //bare
    'white', //mixed
    'blue'] //water
}

var visParams3 = {
  min:-1,
  max:1,
  palette:[ 
    'green', //vegetation
    'white', //mixed
    'red'] //urban
}

Map.addLayer(ndvi.clip(hyd), visParams1, 'NDVI')
Map.addLayer(ndwi.clip(hyd), visParams2, 'NDWI')
Map.addLayer(ndbi.clip(hyd), visParams3, 'NDBI')

// Combining the indices with the bands

var addingBands = sentinelImage 
 .addBands(ndvi) 
 .addBands(ndwi) 
 .addBands(ndbi);
 
print(addingBands.bandNames());

// collect training points and merge all imports into one

var trainingFeatures = ee.FeatureCollection(
  [urban , vegetation, water , bare])
  .flatten();
  
  print(trainingFeatures)

// Define prediction bands.
var predictionBands = [
   'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B11', 'B12', 'NDVI' , 'NDWI' , 'NDBI'
  ]
  
// divide points into training and testing

var gcps = trainingFeatures.randomColumn()
var trainingGcps = gcps.filter(ee.Filter.lt('random', 0.6)) //taking 60%
var testingGcps = gcps.filter(ee.Filter.gte('random', 0.6))
  
// sample training points

var training = addingBands.select(predictionBands).sampleRegions({
  collection: trainingGcps,
  properties: ['class'], 
  scale: 10})
  
 print(training) 
  
// train a classifier

var classifier = ee.Classifier.smileRandomForest(50).train({
  features: training,
  classProperty: 'class',
  inputProperties: predictionBands, 
  });
  
// classify the image

var classified = addingBands.select(predictionBands).classify(classifier);
var classifiedRemapped = classified.remap([0, 1, 2, 3], [1, 2, 3, 4]);

// adding classified image to map

var visParams = {
  min: 1,
  max: 4,
  palette: ['#e41a1c' , '#377eb8' , '#F4C430', '#4daf4a']
};

Map.addLayer(classifiedRemapped.clip(hyd), visParams, 'Classified Image')

// Accuracy assessment, sampling testing gcps

var validation = classified.sampleRegions({
  collection: testingGcps,
  properties: ['class'], 
  scale: 10
});

// print to see real and classified class

print(validation)
print(training)

// creating confusion matrix

var confusionMatrix = validation.errorMatrix({
  actual: 'class', 
  predicted: 'classification'})
  
// printing the results 
  
print('Confusion matrix:', confusionMatrix);
print('Overall Accuracy:', confusionMatrix.accuracy());
print('Producers Accuracy:',confusionMatrix.producersAccuracy());
print('Consumers Accuracy:',
confusionMatrix.consumersAccuracy());
print('Kappa:', confusionMatrix.kappa());

// Exporting images

var sentinelImage1 = sentinelImage.select(['B4', 'B3', 'B2']).clip(hyd)

print(sentinelImage1.bandNames())

Export.image.toDrive({
  image : sentinelImage1, 
  description : 'RGB', 
  folder: 'Hyd_supervised', 
  fileNamePrefix: 'RGB',
  region : hyd, 
  scale : 10, 
  maxPixels : 1e10
})

Export.image.toDrive({
  image : ndvi,
  description: 'NDVI', 
  folder: 'Hyd_supervised', 
  fileNamePrefix : 'NDVI',
  region : hyd, 
  scale : 10,
  maxPixels :  1e10
  })
  
Export.image.toDrive({
  image : ndwi, 
  description: 'NDWI', 
  folder : 'Hyd_supervised', 
  fileNamePrefix : 'NDWI',
  region : hyd, 
  scale: 10, 
  maxPixels : 1e10
  })
  
Export.image.toDrive({
  image: ndbi,
  description : 'NDVI', 
  folder :  'Hyd_supervised', 
  fileNamePrefix : 'NDBI', 
  region : hyd, 
  scale : 10, 
  maxPixels: 1e10
  })
  
Export.image.toDrive({
  image: classifiedRemapped.clip(hyd), 
  description : 'Classified_Image', 
  folder: 'Hyd_supervised', 
  fileNamePrefix: 'Classified', 
  region: hyd, 
  scale: 10, 
  maxPixels: 1e10, 
  })
  
Export.table.toDrive({
  collection: ee.FeatureCollection(hyd),
  description: 'study_area',
  fileFormat: 'SHP'
});

Export.table.toDrive({
  collection: trainingFeatures,
  description: 'training_points',
  fileFormat: 'SHP'
});
