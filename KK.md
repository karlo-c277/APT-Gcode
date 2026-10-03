In this project KK language is used to translate different APT codes into one universal language and then into G-code
Use "rawKK" if you want to bypass a translation layer into KK meaning the code you are writing after "rawKK" id written in KK

# KK SYNTACS  
<br>

***
<br>

- all elements must be defined in all cases as decribed with no exeptions   
- elements must be separated from eachother with a comma except for the command name (first one) and the first element    
<br>

## $  
- break line sign  
- in case you run out of writing space use a single `$` to break a line into two  
    - there is no need to use any other syntacs before nor after the sign  
<br>

## COMMENT  
- comment  
- if you want to write a comment in the final G-code output write it as following  
    `COMMENT:I have written a comment`  
    - output  
    `I have written a comment`  
    - NOTE: before the beginning of the line there will be a dedicated comment sign if one is defined  
- the output will begin right after the colon sign ":"  
<br>

## rawG  
- raw G-code  
- if you want to write G-code because some of the commands that your machine needs isn't here you can use `rawG to bypass the translation layer from KK into G-code  
    - this isn't limited to G commands only you may write anything you wish  
    `rawG:G55`  
    - output  
    `G55`  
- the output will begin right after the colon sign ":"  
<br>

## rawKK
- in case of using a dedicated CAM software and using a manually inserted post processor instruction or something in that sense the `rawKK` will be ignored in the translation layer from APT and removed for the translation layer from KK into G-code  
    - this is limited to KK commands only  
    `rawKK:COMMENT:I have written a comment`  
    - output (in KK)  
    `COMMENT:I have written a comment`  
- the output will begin right after the colon sign ":"  
<br>

## UNIT  
- if you have a CNC controler whose default units aren't same as the ones that the APT or KK is written in you use `UNIT: desired_unit`  
- this will NOT affect the numbers that are being written in the final output  
    - `UNIT: MM` for milimiters  
    - `UNIT: INCH` for inches  
- if you can't find your units here use `rawG` command  
<br>

## PLANE  
- for some operations the working plane must be defined (it is specified under the operation)  
    - `PLANE: xy` for xy plane  
    - `PLANE: xz` for xz plane  
    - `PLANE: zy` for zy plane  
<br>

## TOOL
- tool change operation  
- a tool call must define the tool name, tool slot, tool compensation register and coolant type  
    - `TOOL: bean_cutter, 4, 5, flood`  
        - the coolant types are defined in the definition of the coolant section  
        - the elements must be defined in this order  
        - if an element is empty or not defined the element slot remains including the commas  
    - `TOOL: bean_cutter, 4,, flood`  
<br>

## SPINDLE  
- defining spindle speeds and parameters 
- the spindle syntacs must define the spindle state, type of speed, value, and direction  
    - `SPINDLE: on, fix, 1500, cw`  
        - spindle state can be `on` or `off`  
        - type of speed defines whether it is surface speed `surface` or fixed in RPM `fix`  
        - value defining the actual value  
        - direction defining whether the spindle is rotating clockwise `cw` or counter-clockwise `ccw`  
        - spindle number defining what spindle head is being utilized  
<br>  
  
- if the spindle is being turned off the spindle state is `off`  
    - `SPINDLE:  off`  
        - the rest of the syntacs may go undefined  
<br>
    
- if the spindle maximum RPM is being set the spindle state is `MAX`  
    - `SPINDLE: MAX, 1500`  
        - the spindle value must be set and it is defined in RPM  
<br> 
    
- if the spindle minimum RPM is being set the spindle state is `MIN`  
    - `SPINDLE: MIN, 1500`  
        - the spindle value must be set and it is defined in RPM  
<br> 
<br>

## FEEDRATE  
- defines the machinning feedrate  
- the feedrate syntacs must define the feedrate type and speed  
    - `FEEDRATE: rev, 0.05`  
        - feedrate type defines whether the feedrate is set in distance per revolution `rev` or in distance per time unit `time`  
<br>

## COOLANT  
- defines coolant usage  
- note this is for a single coolant nozzle  
    - in case of the NC program controlling multiple nozzles via different commands the selected nozzle in the final output will NOT be a through tool nozzle, it will be a first available nozzle, if you want to utilize a diffrenet nozzle use `rawG`  
- the coolant syntacs must define the current state and type of coolant  
    - `COOLANT: on, flood`  
        - current state defines the nozzle as `on` or `off`  
        - type of coolant defines if the coolant is in heavy usage `flood` or in minimal usage `mist` or `air` for utlization of compressed air  
            - NOTE `air` is NOT same as air purge, in this case compressed air is going to be comming out of the coolant nozzle (if possible)  
        - if the state is `off` the type of coolant doe not have to be defined  
<br>

## AIR_PURGE  
- activation or deactivation of a dedicated source of compressed air  
- this does NOT activate compressed air through the coolan nozzle  
- the air_purge syntacs must define the current state  
    - `AIR_PURGE: on`  
<br>

## MOVEMENT  
- defines movement type  
- movement type is define either as `absolute` or `incremental`  
    - `MOVEMENT: absolute`  
<br>

## AIR
- rapid motion  
    - `AIR`  
<br>

## CUT  
- cutting motion  
    - `CUT`  
<br>

## END
- end of program  
    - `END`  
<br>

## ERROR  
- an error has occured  
    - `ERROR: circular movement trought 3 dimensions`  
<br>

## MULTAX   
- multiaxial machinning process  
- multax value defines if the operation is multiaxial `on` or not `off`  
    - `MULTAX: off`  
<br>
 
## COMPENSATION_SET  
- defines that this tool is taking a different compensation register  
- compensation set values are tool number and the new compensation register  
    - `COMPENSATION_SET: 1, 3`  
<br>

## COMPENSATION_CHG  
- redefines a compensation register  
- compensation change values are compensation register, cutter quadrant, tool tip offset, nose radius  
    - `COMPENSATION_CHG: 1, TC, 12, 34.5, 6, 0.7`  
        - compensation register defines what register is being edited--  
        - cutter quadrant defines what point on cutter is being looked at  
            - values are following: `BR` for (P4), `BC` for (P8), `BL` for (P3), `CR` for (P5), `CC` for (P9), `CL` for (P7), `TR` for (P1), `TC` for (P6), `TL` for (P2), and `OFF`  
            - look at image.png in DOCUMENTATIONS  
        - tool tip offset defines the tool offset in X Y Z coordinates  
        - nose radius defines the radius on the tip of the tool  
<br>

## CUTCOM  
- cutting compensation  
- it cutcom value is defined with `on` (activates the last value) `off` (deactivates the last value) `left` and `right`  
    - NOTE Catia also has NORMDS/NORMPS ON/OFF but unknown use  
    - `CUTCOM:right`  
<br>

## ROTHED  
- multiaxial rotation of the tool head  
- rothed value defines the axis of rotation, type of rotation, direction of rotation and amount to rotate  
    - `ROTHED: k, ABS, cw, 15`  
        - axis of rotation defines around what axis is the tool head rotated it can be valued as: `X, Y, Z, I, J` or `K`  
        - type of rotation is valued as `ABS` for the absolute angle or `INC` for incremental angle  
        - direction of rotation is valued as `cw` or `ccw`  
        - amount of rotation defining the axis angle  
<br>

## ROTABL
- check ROTHED syntacs except ROTHED => ROTABL
<br>

## TLAXIS
- for canned cycles tool axis is needed to determine which way does the tool need to go  
- tlaxis values are defining a unit vector over the I J K vector axies   
    - `TLAXIS: 0.7071, 0, -0.7071`  
<br>
 
## LINE  
- defines a linear movement  
- line is defined by the 3 coordinates and 3 vectors or 3 angles  
    - `LINE: X10 Y++ Z30 A24 B35 C++`  
        - if the multax is off the 3 vectors or angles must not be defined  
        - if the numerical value hasn't changed or is equal to 0 in incremental it may be valued ++  
<br>

## DWELL  
- defines a pause before the next line  
- dwell values must define type of waiting and amount to wait  
    - `DWELL: time, 12`  
        - type can be valued as `time` for time units or `rev` for number of rotations  
<br>

## ARCH  
- defines a circular movement  
- this movement must be executed in the 3 planes but does not need to have a predefined plane  
- one arch must have a defined centre, circle axis, a vector tangent to it's beginning point, aditional information and the end point  
    - `ARCH/CENTER, 10, 20, 30`  
        - defines the center point of the arch  
        - all 3 coordinates must be defined with numbers  
    - `ARCH/AXIS, 0.707, -0.707, 0`  
        - defines the vector of the axis of the arch  
        - all 3 base vectors must be defined with numbers  
    - `ARCH/TANGENT, 0.707, -0.707, 0`  
        - defines the tangent vector to the beginning point  
        - all 3 base vectors must be defined with numbers  
    - `ARCH/INFO, 12, cw, 34`  
        - it must define the arch radius, direction of movement (`cw` or `ccw`)  and the angle between the endpoints and the centre  
    - `ARCH/END, 11, 22, 33`  
        - defines the end point of the arch  
<br>

## SINUS  
- defines a sinusoidal movement  
- this movement must be executed in the 3 planes but does not need to have a predefined plane  
- one sinus must have a defined centre, circle axis, a vector tangent to it's beginning point, aditional information and the end point  
    - `SINUS/CENTER, 10, 20, 30`  
        - defines the center point of the sinus  
        - all 3 coordinates must be defined with numbers  
    - `SINUS/AXIS, 0.707, -0.707, 0`  
        - defines the vector of the axis of the sinus  
        - all 3 base vectors must be defined with numbers   
    - `SINUS/TANGENT, 0.707, -0.707, 0`  
        - defines the tangent vector to the beginning point  
        - all 3 base vectors must be defined with numbers  
    - `SINUS/INFO, 12`  
        - it must define the sinus amplitude  
    - `SINUS/END, 11, 22, 33`  
        - defines the end point of the sinus  
<br>

## HELIX
- defines a helical/spiral movement  
- this movement must be executed in the 3 planes but does not need to have a predefined plane  
- one sinus must have a defined centre, circle axis, a vector tangent to it's beginning point, aditional information and the end point  
    - `HELIX/CENTER, 10, 20, 30`  
        - defines the center point of the helix  
        - all 3 coordinates must be defined with numbers  
    - `HELIX/AXIS, 0.707, -0.707, 0`  
        - defines the vector of the axis of the helix  
        - all 3 base vectors must be defined with numbers   
    - `HELIX/TANGENT, 0.707, -0.707, 0`  
        - defines the tangent vector to the beginning point  
        - all 3 base vectors must be defined with numbers  
    - `HELIX/INFO, 12, cw, 34`  
        - it must define the helix pitch, radius, height and full turns  
    - `HELIX/END, 11, 22, 33`  
        - defines the end point of the helix  
<br>

## CYCLE  
- defines a cycle  
- this movement needs a predefined `TLAXIS` to work  
- a complete `CYCLE` syntacs must have defined name, general information, specific cycle definition and it's data and coordinates  
    - `CYCLE/NAME,`  
        - the name of the cycle  
    - `CYCLE/DATA,`  
        - it must define total depth, clearance (not counted in total depth), feedrate type and value, spindle type and value, retaction type (1 = rapid 0 = feed) retract feed  
        - all of the information must be defined and written with numbers exept for spindle and feed types  
        - retract feed may be excluded if the retraction type is rapid   
    - `CYCLE/`:  
        - `CY0,` 
            -no aditional parameters  
        - `CY1,`  
            - dwell mode defining if it set in time `2` revolutions `1` or none `0`  
            - dwell value a numerical value  
        - `CY2,`  
            - dwell mode defining if it set in time `2` revolutions `1` or none `0`  
            - dwell value a numerical value  
            - peck size  
        - `CY3,`  
            - dwell mode defining if it set in time `2` revolutions `1` or none `0`  
            - dwell value a numerical value  
            - peck size  
            - decrement rate defining how much does the peck size get smaller in comparison to the previous one  
            - decrement limit defining how many times will the peck get smaller  
        - `CY4,`  
            - thread pitch  