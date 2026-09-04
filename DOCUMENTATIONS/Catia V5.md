# V5R21
-here is this CATIA vesrion APT explained  
-NOTE 4 and 5 axis motion is untested
## Setup
-cycle syntacs for Taping is mandatory  
-please select Include GOTO for tool change  
-3D circular interpolation MUST be off  
-for shorter syntacs: --select Helical Interpolation and set it to AllHelix  
--Turn off Use rapid feedrate insted of RAPID syntacs and Set rapid feedrate at start of operations  
-Depending on your machine and desired accuracy you can edit Formats for both coordinates and axial components  
![alt text](<Images/Snimka zaslona 2026-08-25 092603.png>)
![alt text](<Images/Snimka zaslona 2026-08-25 092210.png>)  
-when chosing what to print in the final output, or setting the number of digits  
![alt text](<Images/Snimka zaslona 2026-08-25 092103.png>)  

For more information on CATIA APT sytacs visit this [website](https://catiahelp.azurewebsites.net/English/NcgUserMap/ncg-r-rf-AptFormat-SyntAptImport.htm#hj-top)

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
