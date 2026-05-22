import re
import math
# Tapping obavezno preko Output "CYCLE"
# Naziv, parametri, kompenzacije i svi podaci alata u CATIA-i se MORAJU poklapati sa onima u WinNC-u
class Myparseline:
  
        

    def __init__(self, LANG, ccmt, ss):
        self.LANG = LANG
        
        self.ccmt = ccmt
        
        self.ss = ss
        
        self.lsmovement=""
        self.lsplane=""
        self.lstiprotation=""
        self.lsrotation=""
        self.lstipfedrejt=""
        self.lssklop=""
        self.lstip_rev=""
        self.ls_x = 0.00000
        self.ls_y = 0.00000
        self.ls_z = 0.00000
        self.ls_i = 0.00000
        self.ls_j = 0.00000
        self.ls_k = 0.00000
        self.lsnum = 0.00000
        self.circlefeed = 0
        self.ls_on_rotation = ""
        self.ls_dim_typ = ""
        self.ls_clnt_typ = ""
        self.ls_clnt = ""
        self.ls_cycle = ""
        
        
    def parseline(self, line):

            if not line.strip():
                pass
            
            elif line.startswith("$$"):
                if "$$ OPERATION NAME" in line:
                    opname = line.split(":")
                    opname2 = opname[1].strip()

                    print(f";{opname2}")
                
                elif self.ccmt==1:
                    line = re.sub(r"\$+", "", line)
                    print(f";{line}")
            
            elif line.startswith("SWITCH/") or line.startswith("TOOLNO/") or line.startswith("GO/") or line.startswith("AUTOPS/") or line.startswith("REWIND/") or line.startswith("INDIRP/"):
                print(f"(nije def);{line}")
            
            elif self.ccmt==1 and (line.startswith("LOADTL/") or line.startswith("SELCTL/") or line.startswith("CUTTER/")) or line.startswith("INTOL/") or line.startswith("OUTTOL/") or line.startswith("TOLER/"):
                
                if line.startswith("LOADTL/") or line.startswith("SELCTL/"):
                    tooln = line.split("/")
                    tool_slot = tooln[1].strip()
                    print(self.LANG["magazine slot"] + tool_slot)            
                elif line.startswith("CUTTER/"):
                    cutter = line.split("/")
                    r_ostrice = cutter[1].strip()
                    print(self.LANG["insert r"] + r_ostrice + "mm")                    
                elif line.startswith("INTOL/"):
                    intol = line.split("/")[1].strip()
                    print(self.LANG["intol"]+ intol + "mm")
                elif line.startswith("OUTTOL/"):
                    outtol = line.split("/")[1].strip()
                    print(self.LANG["outtol"]+ outtol + "mm")
                elif line.startswith("TOLER/"):
                    toler = line.split("/")[1].strip()
                    print(self.LANG["toler"]+ toler + "mm")
            
            elif line.startswith("TPRINT"):
                izbor_alat = re.split(r'[,/]+', line)
                sklop = izbor_alat[1].strip()
                
                if self.lssklop != sklop:
                    print(f"T=\"{sklop}\"")
                    self.lssklop=sklop
                    
            elif "CIRCLE" in line:
                elements = re.split(r'[ ,/()]+', line)
                centar_x = elements[3].strip()
                centar_y = elements[4].strip()
                centar_z = elements[5].strip()
                #radius = elements[6].strip()
                centar2_x = elements[9].strip()
                centar2_y = elements[10].strip()
                centar2_z = elements[11].strip()
                kraj_x = elements[12].strip()
                kraj_y = elements[13].strip()
                kraj_z = elements[14].strip()
                
                kraj_x = float(kraj_x)
                kraj_y = float(kraj_y)
                kraj_z = float(kraj_z)
                
                kraj_x = round(kraj_x, 3)
                kraj_y = round(kraj_y, 3)
                kraj_z = round(kraj_z, 3)

                if centar_x!=centar2_x or centar_y!=centar2_y or centar_z!=centar2_z:
                    print(self.LANG["cta crc cent nije isti"], line)
            
                if self.lsplane == "G18":
                    vektor2_x=float(self.ls_x)-float(centar_x)
                    vektor2_z=float(self.ls_z)-float(centar_z)
                    D=float(self.ls_i)*vektor2_z-vektor2_x*float(self.ls_k)
                    
                    vektor2_x=round(-(vektor2_x), 3)
                    vektor2_z=round(-(vektor2_z), 3)
                
                    if D<0:
                        movement="G2"
                    elif D>0:
                        movement="G3"
                    else:
                        print(self.LANG["sredina na tang"] + line)
                        
                    koord=f"X{kraj_x} Z{kraj_z} I{vektor2_x} K{vektor2_z}"
                    
                elif self.lsplane == "G17":
                    vektor2_y=float(self.ls_y)-float(centar_y)
                    vektor2_x=float(self.ls_x)-float(centar_x)
                    D=float(self.ls_i)*vektor2_y-vektor2_x*float(self.ls_j)

                    vektor2_y=round(-(vektor2_y), 3)
                    vektor2_x=round(-(vektor2_x), 3)
                    
                    if D<0:
                        movement="G2"
                    elif D>0:
                        movement="G3"
                    else:
                        print(self.LANG["sredina na tang"] + line)
                         
                    koord=f"X{kraj_x} Y{kraj_y} I{vektor2_x} J{vektor2_y}"
                    
                elif self.lsplane == "G19":
                    vektor2_y=float(self.ls_y)-float(centar_y)
                    vektor2_z=float(self.ls_z)-float(centar_z)
                    D=float(self.ls_j)*vektor2_z-vektor2_y*float(self.ls_k)

                    vektor2_y=round(-(vektor2_y), 3)
                    vektor2_z=round(-(vektor2_z), 3)  
                    
                    if D<0:
                        movement="G2"
                    elif D>0:
                        movement="G3"
                    else:
                        print(self.LANG["sredina na tang"] + line)
                    koord=f"Y{kraj_y} Z{kraj_z} J{vektor2_y} K{vektor2_z}"
                else:
                    print(self.LANG["nepoznata ravnina"] + line)
                    
                if not (self.circlefeed > 0):
                    self.circlefeed = round(float(input(self.LANG["circle feed"])), 3)
            
                print(movement, koord, self.circlefeed)
            
                self.ls_x=kraj_x
                self.ls_y=kraj_y
                self.ls_z=kraj_z
                self.lsmovement=movement
            
            elif line.startswith("GODLTA"):
                
                if self.ls_dim_typ != "G91":
                    print("G91", end=" ")
                    self.ls_dim_typ="G91"
                    
                coords = re.split(r'[,/]+', line)
                if len(coords)==4:
                    x = coords[1].strip()
                    y = coords[2].strip()
                    z = coords[3].strip()
                    
                elif len(coords)==2:
                    x = "0"
                    y = "0"
                    z = coords[1].strip()
                    
                else:
                    print(self.LANG["neispravan godlta"] + line)
                    return
                
                x = float(x)
                y = float(y)
                z = float(z)
                
                if y==0:
                    koord_y=" "
                    ravnina="G18"
                    if x==0:
                        koord_x=" "
                    else:
                        koord_x=(f"X{round(x, 3)}")
                    if z==0:
                        koord_z=" "                    
                    else:
                        koord_z=(f"Z{round(z, 3)}")      
                elif x!=0:
                    koord_z=" "
                    ravnina="G17"
                    if x==0:
                        koord_x=" "
                    else:
                        koord_x=(f"X{round(x, 3)}")
                    if y==0:
                        koord_y=" "
                    else:
                        koord_y=(f"Y{round(y, 3)}")       
                elif z!=0:  
                    koord_x=" "
                    ravnina="G19"
                    if y==0:
                        koord_y=" "
                    else:
                        koord_y=(f"Y{round(y, 3)}")
                    if z==0:
                        koord_z=" "                    
                    else:
                        koord_z=(f"Z{round(z, 3)}")       
                else:
                    print(self.LANG["promjena 3x koord"] + line)
                    
                if self.lsplane != ravnina:
                    print(ravnina, end=" ")
                    self.lsplane=ravnina
                    
                self.ls_x = round((self.ls_x + float(x)), 3)
                self.ls_y = round((self.ls_y + float(y)), 3)
                self.ls_z = round((self.ls_z + float(z)), 3)

                print(koord_x, koord_y, koord_z)
        
            elif line.startswith("GOTO"):
                if self.ls_dim_typ != "G90":
                    print("G90", end=" ")
                    self.ls_dim_typ="G90"
                
                coords = re.split(r'[,/]+', line)
                x = coords[1].strip()
                y = coords[2].strip()
                z = coords[3].strip()
                
                x = float(x)
                y = float(y)
                z = float(z)
                
                if y==self.ls_y:
                    koord_y=" "
                    ravnina="G18"
                    if x==self.ls_x:
                        koord_x=" "
                    else:
                        koord_x=(f"X{round(x, 3)}")
                    if z==self.ls_z:
                        koord_z=" "                    
                    else:
                        koord_z=(f"Z{round(z, 3)}")      
                elif x!=self.ls_x:
                    koord_z=" "
                    ravnina="G17"
                    if x==self.ls_x:
                        koord_x=" "
                    else:
                        koord_x=(f"X{round(x, 3)}")
                    if y==self.ls_y:
                        koord_y=" "
                    else:
                        koord_y=(f"Y{round(y, 3)}")       
                elif z!=self.ls_z:
                    koord_x=" "
                    ravnina="G19"
                    if y==self.ls_y:
                        koord_y=" "
                    else:
                        koord_y=(f"Y{round(y, 3)}")
                    if z==self.ls_z:
                        koord_z=" "                    
                    else:
                        koord_z=(f"Z{round(z, 3)}")       
                else:
                    print(self.LANG["promjena 3x koord"] + line)
                           
                if self.lsplane != ravnina:
                    print(ravnina, end=" ")
                    self.lsplane=ravnina                  
                    
                print(koord_x, koord_y, koord_z)
                
                self.ls_x=x
                self.ls_y=y
                self.ls_z=z
                
            elif line.startswith("SPINDL"):
                if "OFF" in line:
                    rotation="OFF"
                elif not ("ON" in line):
                    spindlDT = re.split(r'[,/]+', line)
                    num = spindlDT[1].strip()
                    tip = spindlDT[2].strip()
                    rotation = spindlDT[3].strip()
                
                    self.lsnum = round(float(num), 3)

                    while True:
                        if tip == "SFM":
                            tipfedrejt=("G96 ")
                            self.lstip_rev=tip
                            break
                        elif tip == "RPM":
                            tipfedrejt=("G97 ")
                            self.lstip_rev=tip
                            break
                        else:
                            print(self.LANG["nepoznat posmak"] + line)
                            tip = input(self.LANG["posmak"]).strip().upper()
                    
                    if self.lstiprotation != tipfedrejt:
                        print(tipfedrejt, end=" ")
                        self.lstiprotation=tipfedrejt
                    
                    print("S"+ str(round(float(num), 3)))
                    
                elif "ON" in line:
                    print(self.ls_on_rotation)
                    if self.ss==1:
                        print("S"+ str(self.lsnum)+ " " + self.lstip_rev)
                    

                while True:    
                    if rotation == "CLW":
                        smjervrtnje=("M3 ")
                        self.ls_on_rotation="M3 "
                        break
                    elif rotation == "CCLW":
                        smjervrtnje=("M4 ")
                        self.ls_on_rotation="M4 "
                        break
                    elif rotation== "OFF":
                        smjervrtnje=("M5 ")
                        break
                    else:
                        rotation = input(self.LANG["spindle m3/m4"] + f" ({line})       : ").strip().upper()
                        continue
                    
                if self.lsrotation != smjervrtnje:
                    print(smjervrtnje, end=" ")
                    
                    if smjervrtnje==("M5 "):
                        print(" ")
                        
                    self.lsrotation=smjervrtnje
                    
            elif line.startswith("FEDRAT"):
                if "RAPTO" in line:
                    line = line.split("RAPTO")[0].strip()
                
                feed = re.split(r'[,/]+', line)
                numf = feed[1].strip()
                vrstaf = feed[2].strip()
                
                while True:
                    if vrstaf == "MMPR" or vrstaf == "REV":
                        fedrejt=("G95")
                        break   
                    elif vrstaf == "MMPM" or vrstaf == "MIN":  
                        fedrejt=("G94")
                        break
                    else:
                        print(self.LANG["feedrat err"] + line)
                        vrstaf = input(self.LANG["feedrat"]).strip().upper()
                    
                if self.lstipfedrejt != fedrejt:
                    print(fedrejt, end=" ")
                    self.lstipfedrejt=fedrejt
                    
                movement="G1"
                
                if self.lsmovement != movement:
                        print(movement, end=" ")
                        self.lsmovement=movement
                
                print("F"+ str(round(float(numf), 3)))
                
            elif line.startswith("INDIRV"):
                vektor = re.split(r'[,/]+', line)
                self.ls_i=vektor[1].strip()
                self.ls_j=vektor[2].strip()
                self.ls_k=vektor[3].strip()
                
            elif line.startswith("RAPID"):
                if self.lsmovement != "G0":
                    print("G0 ")
                    self.lsmovement="G0"
                    
                if "GOTO" in line:
                    if self.ls_dim_typ != "G90":
                        print("G90", end=" ")
                        self.ls_dim_typ="G90"
                    
                    elements = re.split(r'[ ,/]+', line)
                    x = elements[2].strip()
                    y = elements[3].strip()
                    z = elements[4].strip()
                    
                    x = float(x)
                    y = float(y)
                    z = float(z)
                    
                    if y==self.ls_y:
                        koord_y=" "
                        ravnina="G18"
                        if x==self.ls_x:
                            koord_x=" "
                        else:
                            koord_x=(f"X{round(x, 3)}")
                        if z==self.ls_z:
                            koord_z=" "                    
                        else:
                            koord_z=(f"Z{round(z, 3)}")      
                    elif x!=self.ls_x:
                        koord_z=" "
                        ravnina="G17"
                        if x==self.ls_x:
                            koord_x=" "
                        else:
                            koord_x=(f"X{round(x, 3)}")
                        if y==self.ls_y:
                            koord_y=" "
                        else:
                            koord_y=(f"Y{round(y, 3)}")       
                    elif z!=self.ls_z:
                        koord_x=" "
                        ravnina="G19"
                        if y==self.ls_y:
                            koord_y=" "
                        else:
                            koord_y=(f"Y{round(y, 3)}")
                        if z==self.ls_z:
                            koord_z=" "                    
                        else:
                            koord_z=(f"Z{round(z, 3)}")       
                    else:
                        print(self.LANG["promjena 3x koord"] + line)
                           
                    if self.lsplane != ravnina:
                        print(ravnina, end=" ")
                        self.lsplane=ravnina                  
                
                    self.ls_x=x
                    self.ls_y=y
                    self.ls_z=z
                    
                elif "GODLTA" in line:
                    if self.ls_dim_typ != "G91":
                        print("G91", end=" ")
                        self.ls_dim_typ="G91"
                    
                    
                    elements = re.split(r'[,/]+', line)
                    
                    if len(elements)==4:
                        x = elements[2].strip()
                        y = elements[3].strip()
                        z = elements[4].strip()
                    elif len(elements)==2:
                        x = "0"
                        y = "0"
                        z = elements[2].strip()
                    else:
                        print(self.LANG["neispravan godlta"] + line)
                        
                    x = float(x)
                    y = float(y)
                    z = float(z)
                
                    if y==0:
                        koord_y=" "
                        ravnina="G18"
                        if x==0:
                            koord_x=" "
                        else:
                            koord_x=(f"X{round(x, 3)}")
                        if z==0:
                            koord_z=" "                    
                        else:
                            koord_z=(f"Z{round(z, 3)}")      
                    elif x!=0:
                        koord_z=" "
                        ravnina="G17"
                        if x==0:
                            koord_x=" "
                        else:
                            koord_x=(f"X{round(x, 3)}")
                        if y==0:
                            koord_y=" "
                        else:
                            koord_y=(f"Y{round(y, 3)}")       
                    elif z!=0:  
                        koord_x=" "
                        ravnina="G19"
                        if y==0:
                            koord_y=" "
                        else:
                            koord_y=(f"Y{round(y, 3)}")
                        if z==0:
                            koord_z=" "                    
                        else:
                            koord_z=(f"Z{round(z, 3)}")       
                    else:
                        print(self.LANG["promjena 3x koord"] + line)
                    
                    if self.lsplane != ravnina:
                        print(ravnina, end=" ")
                        self.lsplane=ravnina
                        
                    self.ls_x = round((self.ls_x + x), 3)
                    self.ls_y = round((self.ls_y + y), 3)
                    self.ls_z = round((self.ls_z + z), 3)
                    
                    print(koord_x, koord_y, koord_z)
                               
            elif line.startswith("FINI") or line.startswith("END"):
                print("M30")
            
            elif line.startswith("PARTNO"):
                print("G55" + "\n" + "DIAMOF" + "\n" + "#DEFINIRATI SIROVAC")

            elif line.startswith("CYCLE/"):
                
                if "TAP" in line:
                    tap= line.split(",")
                    depth= tap[1].strip()
                    pitch= tap[2].strip()
                
                    while True:
                        if self.lsrotation == "M3 " or self.lsrotation == "CLW ":
                            returnsmj = "M4"
                            break
                        elif self.lsrotation == "M4 " or self.lsrotation == "CCLW ":
                            returnsmj = "M3"
                            break
                        else:
                            self.lsrotation = input(self.LANG["spindle m3/m4"]).strip().upper() + " "
                            continue
                    while True:
                        holder = input(self.LANG["holder type"]).strip()
                        if holder == "0":
                            if self.lstip_rev == "SFM":
                                F = self.lsnum * pitch
                            elif self.lstip_rev == "RPM":
                                F = pitch
                            else:
                                print(self.LANG["nepoznat posmak"] + line)
                            print(f"G63 Z{depth} F{F} \n G63 Z{self.ls_z} F{F} {returnsmj}")
                            self.ls_cycle="G63 Z"+str(depth)+" F"+str(F)+" "+returnsmj
                            break
                        elif holder == "1":
                            print(f"G331 Z{depth} F{pitch} \n G332 Z{depth} {returnsmj}")
                            self.ls_cycle="G331 Z"+str(depth)+" F"+str(pitch)+" \n G332 Z"+str(depth)+" "+returnsmj
                            break
                        else:
                            print(self.LANG[";Krivi broj"])
                            continue
                        
                elif "CYCLE/ON" in line:
                    if self.ls_cycle != "":
                        print(self.ls_cycle)
                    else:
                        print(self.LANG["Nema ciklusa"])
                        
                elif line.startswith("CYCLE/DRILL"):
                    elements = line.split(",")
                    depth = elements[1].strip()
                    fedrejt = elements[2].strip()
                    posmak = elements[3].strip()
                    clearance = elements[4].strip()
                    
                    while True:
                        os=input(self.LANG["cycle drill"]).strip().upper()
                        povrsina=float(input).strip()
                        smjer=input.strip().upper()
                        
                        if os == "X" or os == "Y" or os == "Z":
                            break
                        else:
                            print(self.LANG["krivi spindle start"]+ " (X/Y/Z)")
                            continue
                        
                    
                                      
                    if os == "X" or os == "Z":
                        r_povrsina="G18"                           
                    elif os == "Y":
                        r_povrsina="G17"
                        
                    if posmak == "UZ" or posmak == "+":
                        clearance_koord = round((float(povrsina) + float(clearance)),3)
                    elif posmak == "NIZ" or posmak == "-":
                        clearance_koord = round((float(povrsina) - float(clearance)),3)                         
                            
                        
            
            elif line.startswith("COOLNT"):
                while True:
                    if "OFF" in line or "FLOOD" in line or "MIST" in line:
                        coolnt=line.split("/")
                        clon=coolnt[1].strip()
                        break
                    else:
                        clon = input(self.LANG["coolnt on off"] + line + "--> : ").strip().upper()
                        continue
                    
                while True:
                    if clon=="ON" or clon=="1":
                        print(self.ls_clnt_typ)

                        break
                    elif clon=="OFF" or clon=="0":
                        print("M9")
                        self.ls_clnt="M9"
                        break
                    elif clon=="FLOOD" or clon=="2":
                        print("M8")
                        self.ls_clnt_typ="M8"
                        self.ls_clnt="M8"
                        break
                    elif clon=="MIST" or clon=="3":
                        print("M7")
                        self.ls_clnt_typ="M7"
                        self.ls_clnt="M7"
                        break
                    else:
                        print(self.LANG["coolnt on off"] + line)
                        clon = input(self.LANG["coolant"]).strip().upper()
                        continue
            
            elif line.startswith("DELAY"):
                delay=line.split("/")
                dwell=delay[1].strip()
                
                if "REV" in dwell:
                    dwell=dwell.split(",")
                    vrijeme=dwell[0].strip()
                    
                    print(f"G4 R{vrijeme}")
                else:
                    print(f"G4 S{round(float(dwell), 3)}")
            
            else:
                print(self.LANG["Nepoznata naredba"], line)
      
      #or line.startswith("GORGT") or line.startswith("GOLFT") or line.startswith("GOFWD") or line.startswith("GOBACK") or line.startswith("GODOWN") or line.startswith("GOUP") or line.startswith("TLON") or line.startswith("TLRGT")  or line.startswith("TLLFT")