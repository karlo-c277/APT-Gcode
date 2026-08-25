# V5R21
-here is this CATIA vesrion APT explained  
-NOTE 4 and 5 axis motion is untested
## Setup
-cycle syntacs for Taping is mandatory  
![alt text](<Snimka zaslona 2026-08-25 092603.png>)
![alt text](<Snimka zaslona 2026-08-25 092210.png>)
-when chosing what to print in the final output, or setting the number of digits
![alt text](<Snimka zaslona 2026-08-25 092103.png>)
-note number of digits depend on what your CNC conrtoler requires
## Line starters
|Starter|Explanation|Note|
|:---|:---:|:---:|
|$$|-Ignore this line in final G-code| |
|TPRINT|-This is a comment|might be more|
|PPRINT|-This is a comment| |
|LOADTL|-This is a tool and it's data|Not sure|
|SELECTL|-This is a tool and it's data|Not sure|
|TOOLNO|-This is tools position on the machine|Not sure|
|REWIND| |Unknown|
|CUTTER|-Radius of cutting tool bit|Not sure|
|INTOL|-Inside tolerance to the path|Not sure|
|OUTOL|-Outside tolerance to the path|Not sure|
|TOLER|-General tolerance to the path|Not sure|
|END|-End of program|Not sure|
|FINI|-End of program|Not sure|
|PARTNO|-Part number / name|Not sure/sure|
|OPERATION NAME|-Operation name|Not sure/sure|
|TLAXIS|-Tool axis|Not sure for >3 axis machining|
|SWITCH|might be tool compensation set| |
|AUTOPS|-Circular motion to be defined| |
|INDIRV|-IJK for a vector tangent to the starting point of circular motion| |
|TLON,GOFWD|-Circular motion defined|Not sure about the consistency|
|GOTO|-Move tool to this absolute coordinates| |
|GODLTA|-Move tool to this incremental coordinates| |
|SPINDL|-Sets new value for spindle| |
|FEDRAT|-Sets new value for feerate|-missing part|
|RAPID|-Next movement is a non cutting motion| |
|COOLNT|-Sets new value for coolant| |
|DELAY|-Wait this much until next line| |
|DWELL|-Wait this much until next line| |
|CYCLE|-Cycle is to be defined| |
|MULTAX|-Means that this operation is multiaxial|Not sure|
|CUTCOM| |-unknown|

## Other main commands
|Command|Meaning|
|:---|:---:|
|$|Break line|
|CIRCLE|The next numbers define a circle|
|LINE|The next numbers define coordinates to 2 end points of a line|


### $
-if a line is too long the APT creator will break the using $  
-for some cycles or toolpaths helical paht for example is intentionally broken on cerian parts
### $$
-basically just means to not show next lines in the final G-code
### PPRINT
-following text in line is a comment
### TPRINT
TPRINT/SDJCL 1210 D07,SDJCL 1210 D07,SDJCL 1210 D07  
-it contains what would seem as Tool name, Holder name and Cutter name  
-have note that this might not be correct
### LOADTL
LOADTL/1,1,1  
-it contains what would seem as id number for Tool name, Holder name and Cutter name  
-have note that this is most likely not correct
### SELECTL
-it contains what would seem as id number for Tool name, Holder name and Cutter name  
-have note that this is most likely not correct  
-it has had appeared a few times during test files
### TOOLNO
-it contains what would seem as tool specifications  
TOOLNO/1,TURN,1,0,3,    0.400000,$  
    0.000000,    0.000000,    0.100000,MMPR,  500.000000,SFM,$  
CCLW,ON,    0.000000,NOTE  
-TURN -it MIGHT mean that this tool is for turning operation  
-0.4 -this might mean that the cutter radius is 0.4, but the line before that is CUTTER/0.8  
-0.1,MMPR is set feedrate for the tool  
-500,SFM is set rpm or in this case set surface speed  
-CCLW is the workpiece turning direction
### CUTTER
CUTTER/ 10.000000,  0.000000,  5.000000,  2.886751, 30.000000,$  
         0.000000, 50.000000  
-it contains radius of the cutter bit somwhere  
-in another case after CUTTER there is only one number meaning cutter radius, maybe
### INTOL
INTOL /    0.01000  
-it defines inside tolerance of the path  
-it has appeared when doing any nonlinear path via bunch of coordinates  
### OUTOL
-same for INTOL
### TOLER
-appeared on a few test
### END
-end of program, or might be an end of a sub-program or macro
### FINI
-end of program, or might be an end of a sub-program or macro
### PARTNO
-part number, but it also can be edited
### OPERATION NAME
-operation name, but it also can be edited
### TLAXIS
-defines tools cutting axis in IJK
### SWITCH
-tool compenstion set
### AUTOPS
-come single in line before every circle definition
### INDIRV
INDIRV/    0.12533,    0.99211,    0.00000  
-defines a vector with total lenght of 1  
-that vector is tangent to the first pointof the arch / circular motion  
### TLON,GOFWD
-usually comes before the Circle coordinates but if line.contains circle is used  
TLON,GOFWD/      (CIRCLE/      0.00000,      0.00000,      2.00000,$  
       5.00000),ON,(LINE/      0.00000,      0.00000,      2.00000,$  
                               0.62667,      4.96057,      2.00000)  
-numbers are: center xzy radius center xyz end xyz  
-what is assumable is tool on path, go forward in this circle on or untill the line, then it gives 2 ponts for the lines
### GOTO
GOTO  /    1.15552,   -4.86464,   -1.98288, 0.000000, 0.000000,-1.000000  
-in case of specifically setting multi axial we get XYZ IJK  
-it gives the next position in absolute coordinates
### GODLTA
-it has appeared a few times when thread cutting was used  
-it gives what changes along what axies are needed to get to new position  
-not sure about multi axial positioning for IJK details
### SPINDL
SPINDL/  500.0000,SFM,CLW  
-it contains a numerical value, wether it is in Surface speed or RPM and what direction  
-it can also be set to ON activating the last value or OFF/STOP to stop the spindle
### FEDRAT
FEDRAT/    0.1000,MMPR  
-it consits of a numerical value and if it is Distance per revolution, Distance per minute or Time per distance  
-Time per distance MIGHT exist in Catia for multi axial surface machining
### RAPID
-ONLY the next line is set in non cutting/air speed
### COOLNT
-it can be valued with FLOOD MIST AIR ON OFF  
-Flood as max coolant
-Mist as minimal coolant
-ON as for activating the last coolant value
-OFF as for turning off the coolant
-Air is mentioned on internet but not seen here
### DELAY / DWELL
DELAY/   50.000000  
-it has a numerical value and if it is set in revolutions has , REV after otherwise it is in seconds  
-both DELAY and DWELL have been seen, if it is DWELL or DELAY may be dependent of usege if it is in a hole or just getween 2 cuts
### MULTAX
-it comes aline in the line and defines that this is multi axial  
-the globality of this command is in question, it is just for this tool, this part operation or the whole document  
-best guess is this tool change  
-it would seem this command replaces TLAXIS and since it is multi axial it shows it under GOTO and GODLTA
### CYCLE
-defines that this line contains information about a cycle  
-the coordinates until CYCLE/END are explicitly for the beginings or stated action
CYCLE/DRILL,  126.000000,   85.000000,    1.000000,MMPR  
GOTO  /    0.00000,    0.00000,    0.00000  
CYCLE/OFF  
-due to bus in CATIA V5R21 for APT output you are allowed to ONLY to use CYCLE output for following elements
**__Drilling, drilling with dwell delay, deep hole drilling, drilling with chip break, spot dilling, counter boring, counter sinking, normal taping, reaming__**  
And that is IT, other cycles have incomplete data making final G-code dangerous  
For other cycles there is an active support, NOTE for Taping you **__MUST USE__** cycle syntacs
### CUTCOM
-Unknown