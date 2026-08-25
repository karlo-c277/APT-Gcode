# APT-Gcode
**Karlo Ugrin** --developer  
    This is a post processor for APT code, into G-code commands.  
For now it is developing around Catia V5R21 and WinNC Sinumerik, but as time progresses there will be added support for Autodesk, LinuxCNC, WinNC Fanuc etc.  

## LOGIC BEHIND
    Ok, so, you finished your machining simulation and now you have to create your part on an actual CNC machine.  
Usually you have to put it through a post processor, but those can be expensive or limitng on maximum number of lines. But here the only limit is how much RAM does your web browser give.  
So then, you download the file containing APT code, it can have various names like .APT .APTsource and such, but the extension is not important, the encoding is.  
apt_gcode-web -> startup.js --line 93 as you can see the encoding is quite thorough.  
But also, in APT code there is a limit on max characters in each line so in case of line breaks, at the end of each line thre is a $ sign, so those line will be merged before being sent to parselinev2.js, parselinev2 then creates JSON file written in Karlov Kod, and then is sent to g-coder.js that then turns Karlov Kod that is then translated into final G-code for CNC machines.  
-> Karlov kod  
  
#### parselinev2
    This is a second version of APT translator. This one has a different architecture in comparison to the first one.  
The first one did everything, it read APT lines and translated them directly into G-code, this one however reads the line and translates it into Karlov Kod, via kk function.  
-> output.js  
Now this saves one whole line without breaks into a new row in .JSON as a string, it is prefered to use it this way since then it has more flexibility towards the structure.  
It is written in JavaScript since it has esier implementation for website usage  
For starters it has different classes for different input files. 
##### Class Karlov kod
    Since g-coder.js requires lines written in Karlov kod, and the input file is written in Karlov kod it simply turns recieved text into .JSON  
##### Class catiav5_1_0
    This is translates APT output written by CATIA V5R21, now there may have been some aditional pathces and changes that might differentiate this APT from the latest R21 APT or may have not been, since the news on official websites are very poor mostly since those happened more than a decade ago, but again, it may not have been like that.  
So firstly we have defined the variables that have to be remembered trough 2 or more cycles of translating lines.
Then we have temporary lines that are needed for this specific line.

Then there goes a check if there is a header entered, if no it adds it
-check if the line is empty, if so it exits the cycle
Now comes the actual translation
-if the line starts with units it saves kk for units
Comments -now if the line starts a word saved in this.comments variable it means that this line is a comment and starts translationg it as a coment
Autops -if line starts with AUTOPS, AUTOPS meand that a circular motion is going to be stated and it saves that information
Circle -if line includes cricle, well it means that here is stated an arch or a circular motion,
        in this line there are stated center and end coords, as well as radius and we know the last coord which is saved in this.ls_x y z
        to define a line we need 2 fixed points to define a plane we need 3, beginning, center and end of the arch, in case of it being a 180deg arch or a 360deg well, work in progress
        otherwise we have 3 points so we can define a plane which can **_ONLY_** be xy, xz and yz planes and those need to be defined
        now the most complex part where **_I have used AI_** to determine if an arch is cw or ccw I have used ChatGPT's help to find the formula to do so, it was 2D cross product from -> Documentations -> DOCUMENTATION line 7
        note that there is know vector direction tangent to the begining of the arch / circle from INDIRV
        the rest of program is about making as much as possible data for different CNC controlers
Godlta -go delta, incremental movement, consists of cheking if movement is set to incremental, what is written in innit and if rapto is active, and saving the last position
Goto -absolute coordinates, consits of cheking if movement is in absolute units, what is written innit and if rapto is active, and saving the last position
Spindl -extracting data from spindle command, there is setting to new value turn off/on
Fedrat -extracting data from fedrat command, there is only setting feedrate to new values, and rapto
        -Rapto, meand rapid to, a certian distance from the next point
Rapid -there is a normal rapid, rapid with goto or godlta, rapid goto and godlta means movement to this location is rapid, normal rapid means also that the next movement is rapid, but due to lack of documentation and flexibility of CATIA meand that anything can happen
Coolnt -means that new value for coolan is set, it can be flood mist air off and on
Delay / Dwell -again due to documentation and flexibility it checks both
Cycle -there are a lot of cycles in CATIA and of most of them are broken in this version more info in Documentations under Catia V5
"$$" -means ignore this line
Indirv -it comes after Autops and gives a vector tanmgent to the begining of arch or circular motion

### Karlov kod
This is used to universally transfer data from parselinev2 to g-coder

### g-coder
This reads the Karlov kod from JSON and translates it to G-code
There is no need to make stuff up here, so simply https://www.emco-world.com/fileadmin/user_upload/_Group/pics_products/Training_Software/software_manuals/WinNC_SinOperate/WINNC_SinOperate_EN/EMCO_WinNC_for_Sinumerik_Operate_Mill_EN_1848_D2020-07_REV01.pdf
In short it goes through the JSON file and according to this file up here it prints the final g code in terminal oand in output file