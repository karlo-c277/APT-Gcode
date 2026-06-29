import os
import sys
from parseline import Myparseline
from jezici import HR, EN

while True:
    izbor = input("Choose language (HR/EN): ").strip().upper()

    opcije_hr = ("HR", "1", "HRV", "HRVATSKI", "CRO")
    opcije_en = ("EN", "2", "ENG", "ENGLISH")

    if izbor in opcije_hr:
        LANG = HR
        break
    elif izbor in opcije_en:
        LANG = EN
        break
    else:
        print("- Invalid choice. Please enter HR or EN.")

print(LANG["def programa"])

while True:
    catia_comments = input(LANG["catia komentari"]).strip().upper()

    # 1. Definiraj prihvatljive opcije za DA i NE
    opcije_da = ("DA", "YES", "1")
    opcije_ne = ("NE", "NO", "0")

    # 2. Čista provjera bez beskonačnih "or" ponavljanja
    if catia_comments in opcije_da:
        ccmt = 1
        break
    elif catia_comments in opcije_ne:
        ccmt = 0
        break
    else:
        print(LANG["kriv odabir za komt"])

while True:
    # 1. Traži od korisnika da unese naziv datoteke
    input_file = input(LANG["unesite datoteku"]).strip()

    # 2. Provjera postoji li datoteka uopće
    if not os.path.exists(input_file):
        print(
            LANG["Nepostojeća datoteka."] + "\n"
        )  # Sigurno dodavanje novog reda pomoću prijevoda
        continue

    # 3. Provjera je li vrsta datoteke ispravna (mora biti .txt)
    if not os.path.isfile(input_file) or not input_file.lower().endswith(".txt"):
        print(
            LANG["Neispravna vrsta"] + "\n"
        )  # Sigurno dodavanje novog reda pomoću prijevoda
        continue

    # Ako prođe obje provjere, prekini petlju i nastavi s izvršavanjem programa
    break
print(LANG["Datoteka učitana:"], input_file)
print(LANG["Učitavanje linija"])
print("G55\nDIAMOF\n#DEFINIRATI SIROVAC")

parse = Myparseline(LANG, ccmt)

try:
    with open(input_file, "r", encoding="utf-8") as f:
        myline = ""
        for line in f:
            myline += line.strip()
            if myline.endswith("$"):
                myline = myline[:-1]
                continue
            else:
                parse.parseline(myline)
                myline = ""

except UnicodeDecodeError:
    print(LANG["Neispravna vrsta"])
    # input("Klikni Enter za dalje...")
    exit(1003)

except Exception as e:
    print(LANG["error"] + str(e))
    # input("Klikni Enter za dalje...")
    exit(1004)

print("\n" + LANG["Gotovo."])
exit(0)
