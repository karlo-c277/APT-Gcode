
import importlib.util
import os
import sys
from parseline import Myparseline

try:
    from jezici import HR, EN
except ImportError:
    spec = importlib.util.spec_from_file_location("jezici", os.path.join(SCRIPT_DIR, "jezici.py"))
    if spec and spec.loader:
        jezici = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(jezici)
        HR = jezici.HR
        EN = jezici.EN
    else:
        print("Missing jezici module.")
        sys.exit(1005)



izbor = input("Choose language (HR/EN): ").strip().upper()
if izbor == "HR":
    LANG = HR
elif izbor == "EN":
    LANG = EN
else:
    print("Invalid language choice. Defaulting to English.")
    LANG = EN

print(LANG["def programa"])

# check if file was first argument
if len(sys.argv) < 2:
    print(LANG["Nije predana datoteka."])
    # input("Klikni Enter za dalje...")
    exit(1000)

# this is the file you dropped
input_file = sys.argv[1]

# provjeriti da li postoji file
if not os.path.exists(input_file):
    print(LANG["Nepostojeća datoteka."])
    # input("Klikni Enter za dalje...")
    exit(1001)


# provjeriti da li je file tekstualni
if not os.path.isfile(input_file):
    print(LANG["Neispravna vrsta datoteke (potrebno je .txt)."])
    exit(1002)

print(LANG["Datoteka učitana:"], input_file)
print(LANG["Učitavanje linija"])

parse = Myparseline(LANG)   

# provjeriti da li je zaista tekstualna datoteka
try:
    with open(input_file, "r", encoding="utf-8") as f:
        myline = ""
        for line in f:           
            myline += line.strip()
            if(myline.endswith("$")):
                myline = myline[:-1]
                continue
            else:
                parse.parseline(myline)
                myline = ""

except UnicodeDecodeError:
    print(LANG["kriva vrsta"])
    #input("Klikni Enter za dalje...")
    exit(1003)
except Exception as e:
    print(LANG["error" + str(e)])
    #input("Klikni Enter za dalje...")
    exit(1004)

print("\n" + LANG["Gotovo."])
exit(0)