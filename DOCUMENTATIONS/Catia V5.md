# V5R21
- NOTE 4 and 5 axis motion is untested
## Setup
- Downlad CATIA.pptable  
- Import CATIA.pptable to /DassultSystemes/B21/Intel_a/Startup/Manufacturing/PPTables
- Select APT as output code  
- Select CATIA.pptable as Post Processor words table
- 3D circular interpolation MUST be off  
- Helical interpolation only for helix with axis parallel to X Y or Z axis  
- Depending on your machine and desired accuracy you can edit Formats for both coordinates and axial components  
![alt text](<Images/Snimka zaslona 2026-08-25 092603.png>)
![alt text](<Images/Snimka zaslona 2026-08-25 092210.png>)  
- Adjust the digist according to the CNC controller in use  
![alt text](<Images/Snimka zaslona 2026-08-25 092103.png>)  

## Post Processor instructions  
- you can write APT code that complies with CATIA.pptable  
- you can write G-code using `rawG`
    - DO NOT write ANY data that may change or affect tool compensation / what tool is being being used, tool coordinates, machinning parameters (feedrate or spindle)
    - other things as secondary coolant, fans on/off etc. can be written
    

|CYCLES|VALID|
|:---|:---:|
|Drill|YES|
|Drill with dwell delay|YES|
|Spot drilling|YES|
|Counter-boring with a dedicated bit|YES|
|Counter-sinking with a dedicated bit|YES|
|Deep hole drilling|YES|
|Drill with break chip|YES|
|Taping|YES|
|Boring with a dedicated bit|YES|
|Reaming with a dedicated bit|YES|
|Any other cycle|NO|
