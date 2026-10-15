# CATIA - Gcode 101
## Very fast user guide
1. Download Catia.pptable
2. Put Catia.pptable in /Program Files (x86)/Dassult Systemes/B21/Intel_a/Startup/Manufacturing/PPTables folder
3. When selecting the machine go to: Numerical Control (card) / Post Processor words table (selector) /  Catia.pptable (select it)
4. Complete the CAM program
5. R-click Manufacturing program / Manufacturing program object (bottom) / Generate NC code Interactively
6. In/Out (card) / select APT as output file type
7. Formatting (card) / Tool motion statement (selector) / Point (x,y,z) (select it) / Select digit formats you want
8. NC Code / Make sure you have selected Catia.pptable
9. Execute
10. Go to http://karlougrin.com/apt_gcode-web/index-apt.html
11. Select a file / Choose file (button) / select your file
12. Automatically download output file (button) if you want to
13. Choose APT code type (selector) / CATIAV5 APT 1.0
14. File name (text enter) / mandatory if File output
15. Choose output settings (selector)
16. If you haven't selected Costum go to: redkuhvbgfkhgdv
17. Costum settings (panel) / First selector is the type of core G-code output (selector) / Header (text enter)
18. If you haven't selected Automatically download output file go to: wzdsgjhf
19. Output settings (card) / Output file encoding (selector) / File extension (text enter)
20. Click <strong>THE BIG RED BUTTON</strong>
<br>

## Complete user guide
### CATIA
Firstly you need to download the Catia.pptable file.  
Thet file tells CATIA what to write in the output file. It contains function and variable calls that are specific to CATIA, similar how this project works. If you go to DOCUMENTATIONS/DOCUMENTATION.md you are going to see Catia PPTable, that's what used to write this PPTable.  
The main problem is that translating CATIA APT file into G-code is very complex. For example:  
- THREADS   
    - threads are very poorly described and defined in APT  
    - the original CNC software thta I used for development  WinNC Sinumerik has his own special canned cycles that requires background data  
    - if the CNC controller can't accept G-code I can't translate  
    - also threads are very complicated and dangerous so it is better to perform them in the dedicated controller  
- CANNED CYCLES  
    - CATIA has pretty solidly defined canned cycles but again WinNC Sinumerik requires back-data that I do not have  
- Multi-axial operations  
    - CATIA outputs vectors IJK conrollers accept angles ABC  
    - thta part still isn't covered but shouldn't be too much of an issue  
- NURBS
    - Non-uniform rational B-spline  
    - That doesn't even exist in WinNC Sinumerik;
#### Post Processor instructions  
CATIA has something neat like post processor instructions.  
You can insert it in between anything.  
It can contain APT code explained in the DOCUMENTATIONS/CATIA V5.md and `rawG`  
- `rawG`  
    - it just means the following syntacs is written in G-code, no additional post processing nothing  
    - there are syntaxes that shouldn't or must NOT be written with `rawG` see Catia V5.md  
    - in short do not use ang syntax that affects tool position, what tool is being used, feedrate, spindle, units, incremental/absolute measurements  
        - if you want to put like a whole part operation in `rawG` the final values MUST be same as they where before   
#### Circular interpolation  
Must be set in 2 dimensions, otherwise I can't determine if it is cw or ccw   
Same applies for helical interpolation  
### APT-Gcode
This is my final school project written in JavaScript, CSS and HTML (and PPTable)  
The core is very simple:  
1. User uploads a file or selects the demo file or enters manual code  
2. User then doodles with other settings
3. User hits ***THE BIG RED***  
4. the parselinev3 gets a line, it goes trought a switch case which determines the what this command means  
5. parselinev3 then calls a function from a file that user selected via output settings  
6. in a matter of miliseconds the file is translated into G-code
7. then line by line is being written into the terminal on the screen with a little delay for a better look



