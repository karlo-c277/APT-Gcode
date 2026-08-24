# V5R21
-here is this CATIA vesrion APT explained
-NOTE 4 and 5 axis motion is untested

## Line starters
Starter                     Explanation

$$                  -Ignore this line in final G-code
TPRINT              -This is a comment
PPRINT              -This is a comment
LOADTL              -This is a tool and it's data                   Not sure
SELECTL             -This is a tool and it's data                   Not sure
TOOLNO              -This is tools position on the machine          Not sure
REWIND  -unknown
CUTTER              -Radius of cutting tool bit
INTOL               -Inside tolerance to the path                   Not sure
OUTOL               -Outside tolerance to the path                  Not sure
TOLER               -General tolerance to the path                  Not sure
END                 -End of program
FINI                -End of program
PARTNO              -Part number / name                             Not sure/sure
OPERATION NAME      -Operation name
TLAXIS              -Tool axis                                      Not sure for >3 axis machining
CUTCOM  -unknown
SWITCH  -unknown might be tool compensation set
PPFUN   -unknown seen only a few times
INDIRP  -unknown
UNITS               -Set units
AUTOPS              -Circular motion to be defined note* not helical
INDIRV              -IJK for a vector tangent to the starting point of circular motion
TLON,GOFWD          -Circular motion defined                        Not sure about the consistency might be correct
GOTO                -Move tool to this absolute coordinates
GODLTA              -Move tool to this incremental coordinates
SPINDL              -Sets new value for spindle
FEDRAT              -Sets new value for feerate
RAPID               -Next movement is a non cutting motion
COOLNT              -Sets new value for coolant
DELAY               -Wait this much until next line
DWELL               -Wait this much until next line
CYCLE               -Cycle is to be defined

$$
-basically just means to not show next lines in the final G-code