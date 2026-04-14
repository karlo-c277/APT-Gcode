import json
import re
import math
lsmovement=""
lsplane=""
lstiprotation=""
lsrotation=""
lstipfedrejt=""

ls_i=""
ls_j=""
ls_k=""



class Myparseline:
    koord_x = 0
    koord_y = 0
    koord_z = 0
    ls_x = 0
    ls_y = 0
    ls_z = 0
    lssklop=""
    def __init__(self):
        self.koord_x = 0
        self.koord_y = 0
        self.koord_z = 0
        self.ls_x = 0
        self.ls_y = 0
        self.ls_z = 0
        self.lssklop=""
        
        with open("bible1.json", "r", encoding="utf-8") as f:
            self.commands = json.load(f)

    def parseline(self, line):
     
        if "CIRCLE" in line:
            elements = line.split(" ")
            command = elements[0].strip()
            circle = elements[1].strip()
            centar_x = elements[2].strip()
            centar_y = elements[3].strip()
            centar_z = elements[4].strip()
            
                
                
            
        
        elif "/" in line:
            elements = line.split("/")
            command = elements[0].strip()
            
            
            if command == "GOTO":
                coords = elements[1].strip().split(",")
                x = coords[0].strip()
                y = coords[1].strip()
                z = coords[2].strip()
                
                if y==self.ls_y:
                    ravnina="G18"
                    if x==self.ls_x:
                        self.koord_x=""
                    else:
                        self.koord_x=(f"X{x}")
                    if z==self.ls_z:
                        self.koord_z=""                    
                    else:
                        self.koord_z=(f"Z{z}")
                        
                elif x!=self.ls_x:
                    ravnina="G17"
                    if x==self.ls_x:
                        self.koord_x=""
                    else:
                        self.koord_x=(f"X{x}")
                    if y==self.ls_y:
                        self.koord_y=""
                    else:
                        self.koord_y=(f"Y{y}")
                        
                elif z!=self.ls_z:
                    ravnina="G19"
                    if y==self.ls_y:
                        self.koord_y=""
                    else:
                        self.koord_y=(f"Y{y}")
                    if z==self.ls_z:
                        self.koord_z=""                    
                    else:
                        self.koord_z=(f"Z{z}")
                else:
                    print(f"Provjeriti koordinate: {line}")
                           
   #             if float(y) == 0:
    #                ravnina="G18"
     #               koord=(f"X{x} Z{z}")
      #          elif float(x) != 0:
       #             ravnina="G17"
        #            koord=(f"X{x} Y{y}")
         #       elif float(z) != 0:
          #          ravnina="G19"
           #         koord=(f"Y{y} Z{z}")
            #    else:
             #       print(f"Provjeriti koordinate: {line}")
                
                if lsplane != ravnina:
                    print(ravnina, end=" ")
                    lsplane=ravnina                  
                else:
                    print(end="")
                    
                print(self.koord_x, self.koord_y, self.koord_z)
                self.ls_x=x
                self.ls_y=y
                self.ls_z=z
                
            elif command =="SPINDL":
                spindlDT = elements[1].strip().split(",")
                num = spindlDT[0].strip()
                tip = spindlDT[1].strip()
                rotation = spindlDT[2].strip()
                
                if tip == "SFM":
                    tipfedrejt=("G96 ")
                elif tip == "RPM":
                    tipfedrejt=("G97 ")
                else:
                    print(f"Provjeriti tip vrijednosti(spm ili rpm): {line}")
                    
                if lstiprotation != tipfedrejt:
                    print(tipfedrejt, end=" ")
                    lstiprotation=tipfedrejt
                else:
                    print(end="")
                    
                if rotation == "CLW":
                    smjervrtnje=("M3 ")
                elif rotation == "CCLW":
                    smjervrtnje=("M4 ")
                else:
                    print(f"Provjeriti treću vrijednost (smjer vrtnje): {line}")
                    
                if lsrotation != smjervrtnje:
                    print(smjervrtnje, end=" ")
                    lsrotation=smjervrtnje
                else:
                    print(end="")
                
                print("S"+num)
                
            elif command == "FEDRAT":
                feed = elements[1].strip().split(",")
                numf = feed[0].strip()
                vrstaf = feed[1].strip()
                
                if vrstaf == "MMPR":
                    fedrejt=("G95")   
                elif vrstaf == "MMPM":  
                    fedrejt=("G94")
                else:
                    print(f"Provjeriti feedrate vrijednost: {line}")
                    
                if lstipfedrejt != fedrejt:
                    print(fedrejt, end=" ")
                    lstipfedrejt=fedrejt
                else:
                    print(end="")
                    
                movement="G1"
                
                if lsmovement != movement:
                        print(movement, end=" ")
                        lsmovement=movement
                else:
                        print(end="")
                
                print("F"+numf)
                
            elif command == "TPRINT":
                izbor_alat = elements[1].strip().split(",")
                sklop = izbor_alat[0].strip()
                drzac = izbor_alat[1].strip()
                ostrica = izbor_alat[2].strip()
                
                if self.lssklop != sklop:
                    print(f"T={sklop}")
                    self.lssklop=sklop
                else:
                    print(end="")
                
            elif command == "SWITCH" or command == "LOADTL" or command == "CUTTER" or command == "TOOLNO" or command == "INTOL" or command =="OUTTOL" or command == "INDIRV":
                print(end="")
            
            elif command == "INDIRV":
                vektor = elements[1].strip().split(",")
                ls_i=vektor[0].strip()
                ls_j=vektor[1].strip()
                ls_k=vektor[2].strip()
               
            else:
                    print(f"#Neispravna linija: {line}")
        
        elif "$$ OPERATION NAME :" in line:
            opname = line.split(":")
            opname1 = opname[0].strip()
            opname2 = opname[1].strip()
            
            if "Tool" in opname2:
                print(end="")
            else:
                print(f"#{opname2}")
                
        elif "RAPID" in line:
            if lsmovement != "G0":
                print("G0 ")
                lsmovement="G0"
            else:
                print(end="")
            
        elif "FINI" in line:
            print(" G18 G1 X40 Z90\n M30")
            
        elif "PARTNO" in line:
            print("G55" + "\n" + "DIAMOF" + "\n" + "#DEFINIRATI SIROVAC")
        
        elif "$$" in line:
            print(end="")
        else:
            print("Provjeriti: " + line)
      