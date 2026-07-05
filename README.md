# Land Cover Classification of Hyderabad using Sentinel-2 and Google Earth Engine
## Overview
This project performs supervised land cover classification of Hyderabad, India using Sentinel-2 imagery in Google Earth Engine. A Random Forest classifier was employed to map the city's major land cover types, while QGIS was used for visualization of the final maps.

Four land cover classes were identified:
- Urban - Buildings and roads
- Vegetation - Forests, parks, cropland
- Water - Rivers, lakes, reservoirs
- Bare Land - Exposed soil and barren surfaces

The project also computes three spectral indices:
- Normalized Difference Vegetation Index (NDVI) – Highlights vegetation health and density
- Normalized Difference Water Index (NDWI) - Identifies surface water bodies
- Normalized Difference Built-up Index (NDBI) - Detects urban and built-up areas

These spectral indices, together with the original Sentinel-2 spectral bands, were used as input features for the Random Forest classifier. The classifier was trained using manually digitized ground-truth samples  to produce the final land cover classification.

<img width="3507" height="2480" alt="RGB_hyd (1)" src="https://github.com/user-attachments/assets/548773be-130f-4ae2-9c1f-9beab5a3d645" />
The RGB composite (Bands 4-3-2) provides a natural-colour representation of Hyderabad and serves as the base image for the analysis. 

## Dataset
- Source: Google Earth Engine - Harmonized Sentinel-2 MSI: MultiSpectral Instrument, Level-2A (SR)
- Ground Truth Data: Digitized 200 sample points in GEE for training (60%) and validation (40%)
- Study Area: Hyderabad, Telangana, India
- Time of the year: 2025-01-01 - 2025-12-31
- Number of land-cover classes: 4
- Spatial Resolution: 10 m
- Classifier: Random Forest

## Methodology
1. Acquire Sentinel-2 imagery.
2. Filter the collection and create a composite image and add to map
3. Calculate NDVI, NDWI, and NDBI.
4. Collect training points and divide them into training and testing.
5. Sample training points.
6. Train a Random Forest classifier.
7. Classify the image into four land cover classes.
8. Assess classification accuracy.
9. Export maps and visualize them in QGIS.

## Results

<img width="3507" height="2480" alt="Landcover map hyd" src="https://github.com/user-attachments/assets/f7c965a9-179b-4dbc-83cb-4efb768b7462" />
The Random Forest classifier categorized Hyderabad into four land cover classes: Urban, Vegetation, Water, and Bare Land. Urban areas dominate the central and western parts of the city. 
Vegetation is distributed throughout the city with larger continuous patches visible in some peripheral areas. Water bodies such as Hussain Sagar and several reservoirs were successfully identified, and bare land is primarily observed around the urban fringe. 


<img width="3507" height="2480" alt="NDVI_hyd" src="https://github.com/user-attachments/assets/3bcc533a-aabb-4e54-a82f-7eece8acc3e4" />
NDVI measures the presence and health of vegetation using the red and near-infrared bands of Sentinel-2. Higher NDVI values indicate dense and healthy vegetation, whereas lower values correspond to urban surfaces and bare soil. Water bodies exhibit negative NDVI values, making them easily distinguishable from vegetated areas.


<img width="3507" height="2480" alt="NDBI_hyd (1)" src="https://github.com/user-attachments/assets/d533b736-90ec-4735-a0f0-920c7703c9b6" />
NDBI is used to identify built-up and impervious surfaces by comparing the short-wave infrared and near-infrared bands. Areas with higher NDBI values correspond to urban development, while vegetation and water generally produce lower values. 


<img width="3507" height="2480" alt="NDWI_hyd" src="https://github.com/user-attachments/assets/81577bd7-7579-407a-b6c1-e8b5e0c12344" />
NDWI enhances the detection of surface water by comparing the green and near-infrared bands. Water bodies appear with higher NDWI values, while urban areas, vegetation, and dry land generally have lower values. The index clearly highlights major lakes and reservoirs within Hyderabad.

Accuracy Assessment - The Random Forest classifier was evaluated using the 40% validation dataset with an overall accuracy of 96.34%.
- Rows = Actual 
- Columns = Predicted 
 <img width="496" height="209" alt="Screenshot 2026-07-05 at 1 48 26 PM" src="https://github.com/user-attachments/assets/3ddb739a-2050-47dc-b74a-405645d14105" />

