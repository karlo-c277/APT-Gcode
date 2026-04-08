import json

class parseline:
    def __init__(self):
        # Učitati biblioteku naredbi iz json tablice: bible1.json
        with open("bible1.json", "r", encoding="utf-8") as f:
            self.commands = json.load(f)
        

  
    
    def Parse(line):
        # Parsirati liniju i izvršiti odgovarajuću naredbu
        if(line.contains("/")):
            elements = line.split("/")
            command = elements[0].strip()
            print(f"Parsiranje naredbe: {command}")
            if(command == "GOTO"):
                coords = elements[1].strip().split(",")
                x = coords[0].strip()
                y = coords[1].strip()
                z = coords[2].strip()
                if float(y) == 0:
                    print("G1 ")
                    print(f"X{x} Z{z}")
                elif float(y) != 0 and float(z) == 0 and float(x) != 0:
                    #g kod komanda za XY ravan
                    print("G17 ")
                    print("G1 ")
                    print(f"X{x} Y{y}")
                elif float(y) != 0 and float(z) != 0 and float(x) == 0:
                    #g kod komanda za YZ ravan
                    print("G19 ")
                    print("G1 ")
                    print(f"Y{y} Z{z}")
                else:
                    print(f"Provjeriti koordinate: {line}")
                
            elif command =="SPINDL":
                spindlDT = elements[1].strip().split(",")
                rpm = spindlDT[0].strip()
                sfm = spindlDT[1].strip()
                rotation = spindlDT[2].strip()
                if float(rpm) > 20:
                    print("S"+rpm)
                else:
                    print(f"Provjeriti rpm vrijednost: {line}")
                # trebavidjeti sta je sfm pa napraviti if else za to
                if rotation == "CLW":
                    print("M3")
                elif rotation == "CCLW":
                    print("M4")
                else:
                    print(f"Provjeriti teću vrijednost(smjer vrtnje): {line}")
            elif command == "FEDRAT":
                feed = elements[1].strip().split(",")
                num = feed[0].strip()
                vrsta = feed[1].strip()
                #if vrsta == "MMPR":
                    #print() g komanda za mmpr
                #elif vrsta == "": koja je druga vsta feedratea, treba vidjeti  
                    #print() g komanda za tu vrstu feedratea
                if float(num) > 0 and float(num) < 1 and vrsta == "MMPR":
                    print("F"+num)
                else:
                    print(f"Provjeriti feedrate vrijednost: {line}")
            else:
                print(f"Neispravna linija: {line}")
        else:
            print(f"Neispravna linija: {line}")