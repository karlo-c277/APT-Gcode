# APT-Gcode
This is an open source post processor for ATP files outputed by CAM programs  
It features - translating ATP commands into G-code, also it has select presets for output files, so you dont need to worry if your controler will open the file. But also it allows to make a costum file header, name and extension  


# Usage
Just open up this link below, there are some DEMO files there for those who dont have APT files ready
http://karlougrin.com/apt_gcode-web/index-apt.html
<img width="1907" height="915" alt="2026-08-03_10-36" src="https://github.com/user-attachments/assets/ce7ee5c7-b728-498e-b0b4-ac643e6e9783" />


# Documentatuion and recources
Most of information about APT and Gcode that I used is directly from school  
    https://archive.org/details/numericalcontrol0000stan for APT commands
    DOCUMENTATIONS -> Demo outputs -> All of those files 


# Main problem and some other issues
CATIA APT1.0 has 0 documentation, all that I could find were like 2 or 3 notifications about how they changed output for some commands and that is it.
Costs of Catia License, for the future I would like to test the newer Catia and other programs as well but they cost a lot


# Development plan
v0.9 CYCLE/ commands full support  
v1.0 Helix tool path support  
v1.+ G-code output in ISO 6983, WinNC Sinumerik, WinNC Fanuc  
v2.0 SolidWorks APT code support  
v2.+ Support for other CNC controlers and APT codes


# Local run
1. Download VS Code or Codium
2. Download Live server extension
3. Under folder "apt_gcode-web" click on file "index-apt.html"
4. In bottom right corner there is a button "Go Live", click it
5. Once done so the extension will automatically open a card in a dedicated browser routed a local port where you can use it

NOTE: doing so will open the newest version which may include some minor issues or bugs but it will contain some newer features that aren't available on website version


# More info
For more information you can look in folder DOCUMENTATIONS or contact karlo.ugrin@gmail.com
