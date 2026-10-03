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

