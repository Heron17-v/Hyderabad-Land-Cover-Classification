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
