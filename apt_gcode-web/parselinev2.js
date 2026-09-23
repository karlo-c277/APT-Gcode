import {getLastJSON, kk} from "./output.js";
import {getSettings} from "./settings.js";

export class catiav5_1_0{
    constructor(settings){
            this.tolr_coord = 1e-3;
            this.lsplane;
            this.lsrotation;
            this.ls_tip_rev;
            this.ls_tip_posmak;
            this.lssklop;
            this.ls_x;
            this.ls_y;
            this.ls_z;
            this.ls_i;
            this.ls_j;
            this.ls_k;
            this.ls_spindle_speed;
            this.ls_on_rotation;
            this.ls_dim_typ;
            this.ls_clnt_typ;
            this.ls_cycle;
            this.ls_cycle_data;
            this.ls_cycle_coord = "";
            this.lsunits;
            this.ls_units_word = "mm";
            this.multax;
            this.lsautops = false;
            this.ls_feed_speed;
            this.rapid = false;
            this.ls_movement = "CUT";
            this.rapto;
            this.header = false;
            this.cycleon = false;
            this.ls_tool_axis;
            this.psis = false;
            this.rejected_cyc = false;
            this.ls_spindle;
            this.ls_normds = false;
            this.ls_normps = false;
            this.ls_l_r = "";
        }
    parseline(line){
            let elements;
            let elements2;
            let centar_x;
            let centar_y;
            let centar_z;
            let centar2_x;
            let centar2_y;
            let centar2_z;
            let kraj_x;
            let kraj_y;
            let kraj_z;
            let vektor2_x;
            let vektor2_y;
            let vektor2_z;
            let D;
            let movement;
            let koord_x;
            let koord_y;
            let koord_z;
            let x;
            let y;
            let z;
            let dist;
            let ratio;
            let rdtx;
            let rdty;
            let rdtz;
            let koord__x;
            let koord__y;
            let koord__z;
            let dtx;
            let dty;
            let dtz;
            let radius;
            let start;
            let end;
            let angle;

            let cycle_typ;
            let total_depth;
            let plunge;
            let axial_depth;
            let dwell_in_time;
            let clearance;
            let cycle_feed;
            let cycle_spindle;
            let depth_decrement;
            let aditional_element;

            let amplitude;
            let element;
            let begin;

        if (!this.header){
            kk(window.add_command);
            this.header = true;
        }
        if (!line || !line.trim()) {return};
        console.log(line);
        

        elements = line.split(/[,/ ]+/);
        elements2 = line.split(/[,/]/);
        begin = elements[0];
        element = line.split("/");
        console.log(line);

        switch (begin){

        case "COMPENSATION":
            switch (elements2[2].trim()) {
                case "1":
                    x ="TR";
                    break;
                case "2":
                    x ="TL";
                    break;
                case "3":
                    x ="BL";
                    break;
                case "4":
                    x ="BR";
                    break;
                case "5":
                    x ="CR";
                    break;
                case "6":
                    x ="TC";
                    break;
                case "7":
                    x ="CL";
                    break;
                case "8":
                    x ="BC";
                    break;
                case "9":
                    x ="CC";
                    break;
                default:
                    x ="OFF";
            }
            kk("COMPENSATION_CHG: "+elements2[1].trim()+", "+x+", "+elements2[3].trim()+", "+elements2[4].trim()+", "+elements2[5].trim()+", "+elements2[6].trim());
            break;
        
        case "TLAXIS":
            x = elements[1].trim();
            y = elements[2].trim();
            z = elements[3].trim();
            kk("TLAXIS "+x+" "+y+" "+z);
            this.multax = false;
            kk("MULTAX: off")
            break;
        
        case "MULTAX":
            if (line.includes("OFF")){
                kk("MULTAX: off");
                this.multax = false;
            }
            else {
                kk("MULTAX: on");
                kk("ERROR: multi axial machining is not supported")
                this.multax = true;
            }
            break;
        
        case "LOADTL":
            D = line.replace("LOADTL/","COMPENSATION_SET:");
            break;

        case "SELECTL":
            D = element[1].trim();
            kk("COMMENT:Magazine slot number: " + D);
            break;
        
        case "INTOL":
            D = element[1].trim();
            kk("COMMENT:Inside tolerance from the path: " + D +" "+ this.ls_units_word);
            break;
        
        case "OUTTOL":
            D = element[1].trim();
            kk("COMMENT:Outside tolerance from the path: "+ D +" "+ this.ls_units_word);
            break;
        
        case "TOLER":
            D = element[1].trim();
            kk("COMMENT:Tolerance from the path: " + D +" "+ this.ls_units_word);
            break;
        
        case "END":
            kk("COMMENT:End of program");
            break;
        
        case "PARTNO":
            D = line.replace(/^PARTNO/, "COMMENT:Part number: ");
            kk(D);
            break;
        
        case "OPERATION NAME":
            D = line.replace(/^OPERATION NAME/, "COMMENT:").replace(/^:/, "");
            kk(D);
            break;
        
        case "PPRINT":
        case "TPRINT":
            D = element[1];
            kk("COMMENT: ")
            break;
        
        case "TOOLNO":
        case "REWIND":
        case "PARTNO":
            kk("COMMENT: " + line);
            break;
        
        case "AUTOPS":
            this.autops = true;
            break;
        
        case "TLON":
            if (line.includes("GOFWD")){
            elements = line.split(/[,\/()]+/).map(e=> e.trim()).filter(e=>e.length>0);
            console.log(elements);
            if (line.includes("CIRCLE")){
                centar_x = +elements[3];
                centar_y = +elements[4];
                centar_z = +elements[5];
                radius = +elements[6];
                if (!line.includes("INTOF")&& elements.length == 15){
                kraj_x = +elements[12];
                kraj_y = +elements[13];
                kraj_z = +elements[14];
                }
                else if (line.includes("INTOF")&& elements.length == 17){
                    kraj_x = +elements[14];
                    kraj_y = +elements[15];
                    kraj_z = +elements[16];
                }
                else {
                    kk("COMMENT: Circle syntacs is invalid, there fore command rejected, for correct syntacs visit: https://catiahelp.azurewebsites.net/English/NcgUserMap/ncg-r-rf-AptFormat-SyntAptImport.htm#ncg-r-rf-AptFormat-SyntAptImport__rs-CircularInterpolationCIRCLE");
                }

                if (Math.abs(centar_x - kraj_x) <= this.tolr_coord && Math.abs(centar_x - this.ls_x) <= this.tolr_coord){
                    this.lsplane = "zy";
                }
                else if (Math.abs(centar_y - kraj_y) <= this.tolr_coord && Math.abs(centar_y - this.ls_y) <= this.tolr_coord){
                    this.lsplane = "xz";
                }
                else if (Math.abs(centar_z - kraj_z) <= this.tolr_coord && Math.abs(centar_z - this.ls_z) <= this.tolr_coord){
                    this.lsplane = "xy";
                }
                else {
                    kk("ERROR CHANGE OF ALL 3 COORDINATES RE-DO THE APT OUTPUT " + line);
                    break;
                }
                kk("PLANE: "+this.lsplane);

                if (this.lsplane == "xz"){
                    vektor2_x = this.ls_x - centar_x;
                    vektor2_z = this.ls_z - centar_z;
                    D = this.ls_i * vektor2_z - vektor2_x * this.ls_k;


                    if (D<0){
                        movement = "cw";
                    }
                    else if (D>0){
                        movement = "ccw";
                    }
                    else {
                        kk("ERROR CIRCLE CENTER XZ IS ON THE CIRCLE TANGENT " + line);
                        break;
                    }

                    start = Math.atan2(this.ls_x-centar_x, this.ls_z-centar_z);
                    end = Math.atan2(kraj_x-centar_x, kraj_z-centar_z);

                    if (movement === "ccw") {
                        angle = end - start;
                        if (angle < 0){
                            angle += 2*Math.PI;
                        }
                        }
                    else if (movement === "cw") {
                        angle = start - end;
                        if (angle < 0){
                            angle += 2*Math.PI;
                        }
                        }  
                }
                else if (this.lsplane == "xy"){
                    vektor2_x = +this.ls_x - +centar_x;
                    vektor2_y = +this.ls_y - +centar_y;
                    D = +this.ls_i * vektor2_y - vektor2_x * +this.ls_j;


                    if (D<0){
                        movement = "cw";
                    }
                    else if (D>0){
                        movement = "ccw";
                    }
                    else {
                        kk("ERROR CIRCLE CENTER XY IS ON THE CIRCLE TANGENT " + line);
                        break;
                    }
                    start = Math.atan2(this.ls_x-centar_x, this.ls_y-centar_y);
                    end = Math.atan2(kraj_x-centar_x, kraj_y-centar_y);

                    if (movement === "ccw") {
                        angle = end - start;
                        if (angle < 0){
                            angle += 2*Math.PI;
                        }
                    }
                    else if (movement === "cw") {
                        angle = start - end;
                        if (angle < 0){
                            angle += 2*Math.PI;
                        }
                    }  

                }
                else if (this.lsplane == "zy"){
                    vektor2_y = +this.ls_y - +centar_y;
                    vektor2_z = +this.ls_z - +centar_z;
                    D = +this.ls_j * vektor2_z - vektor2_y * +this.ls_k;

                    if (D<0){
                    movement = "cw";
                    }
                    else if (D>0){
                        movement = "ccw";
                    }
                    else {
                        kk("ERROR CIRCLE CENTER ZY IS ON THE CIRCLE TANGENT " + line);
                        break;
                    }
                    start = Math.atan2(this.ls_z-centar_z, this.ls_y-centar_y);
                    end = Math.atan2(kraj_z-centar_z, kraj_y-centar_y);

                    if (movement === "ccw") {
                        angle = end - start;
                        if (angle < 0){
                            angle += 2*Math.PI;
                        }
                    }
                    else if (movement === "cw") {
                        angle = start - end;
                        if (angle < 0){
                            angle += 2*Math.PI;
                        }
                    }  
                }
                kk("ARCH/CENTER, "+centar_x+", "+centar_y+", "+centar_z);
                kk("ARCH/AXIS");
                kk("ARCH/TANGENT, "+this.ls_i+", "+this.ls_j+", "+this.ls_k);
                kk("ARCH/INFO, "+radius+", "+movement+", "+angle);
                kk("ARCH/END, "+kraj_x+", "+kraj_y+", "+kraj_z);

                this.lsautops = 0;
            }
            else if (line.includes("CYLNDR")){
                centar_x = +elements[3];
                centar_y = +elements[4];
                centar_z = +elements[5];
                amplitude = +elements[9];
                if (!line.includes("INTOF")){
                    kraj_x = +elements[28];
                    kraj_y = +elements[29];
                    kraj_z = +elements[30];
                }
                else if (line.includes("INTOF")){
                    kraj_x = +elements[30];
                    kraj_y = +elements[31];
                    kraj_z = +elements[32];
                }
                kk("SINUS/CENTER, "+centar_x+", "+centar_y+", "+centar_z);
                kk("SINUS/AXIS");
                kk("SINUS/TANGENT, "+this.ls_i+", "+this.ls_j+", "+this.ls_k);
                kk("SINUS/INFO, "+amplitude);
                kk("SINUS/END,"+kraj_x+", "+kraj_y+", "+kraj_z);
                this.ls_x = kraj_x;
                this.ls_y = kraj_y;
                this.ls_z = kraj_z;
            }
            else{
                kk("COMMENT: Unknown command "+line);
            }
            this.ls_x = kraj_x;
            this.ls_y = kraj_y;
            this.ls_z = kraj_z;
            }
            else {
            kk("ERROR: unrecognized command " + line);
            }
            break;
        
        case "HELICAL":
            D = line.replace("HELICAL","HELIX");
            break;
        
        case "GODLTA":
            if (this.cycleon === true) {
                x = +elements[1];
                y = +elements[2];
                z = +elements[3];

                this.ls_x += x;
                this.ls_y += y;
                this.ls_z += z;


                this.ls_cyc_coord += "/ "+ this.ls_x +", "+ this.ls_y +", "+ this.ls_z+" ";
            }
            else {
            if (this.rapid === true){
                if (this.ls_movement === "CUT"){
                    kk("AIR");
                    this.ls_movement = "AIR";
                }
            }
            else {
                if (this.ls_movement === "AIR"){
                    kk("CUT");
                    this.ls_movement = "CUT";
                }
            }
            koord_x="";
             koord_y="";
             koord_z="";

            if (this.ls_dim_typ !== "MOVEMENT: incremental"){
                kk("MOVEMENT: incremental");
                this.ls_dim_typ = "MOVEMENT: incremental";
            }
            if (elements.length === 4){
                x = +elements[1];
                y = +elements[2];
                z = +elements[3];
            }
            else if (elements.length === 2){
                x = "++";
                y = "++";
                z = +elements[1];
            }
            else {
                kk("ERROR: GODLTA ELEMENTS ARE INCOMPLETE" + line);
                break;
            }
            this.ls_x += x;
            this.ls_y +=y;
            this.ls_z +=z;
            
            if (x !== "++"){
                koord_x = " X" + x;
            }
            if (y !== "++"){
                koord_y = " Y" + y;
            }
            if (z !== "++"){
                koord_z = " Z" + z;
            }

            if (this.rapto === 1) {
                 dist = Math.hypot(x, y, z);
                 ratio = dist !== 0 ? this.rapto_num / dist : 0;
                 rdtx = ratio*x;
                 rdty = ratio*y;
                 rdtz = ratio*z;
                 koord__x = koord_x-rdtx;
                 koord__y = koord_y-rdty;
                 koord__z = koord_z-rdtz;

                kk("AIR");
                kk("LINE: X" + koord__x + " Y" + koord__y + " Z" + koord__z);
                kk("CUT");

                this.rapto = 0;
            }
            kk("LINE:" + koord_x + koord_y + koord_z);
            }
            break;
        
        case "GOTO":
            if (this.cycleon === true) {
                x = +elements[1];
                y = +elements[2];
                z = +elements[3];

                this.ls_x = x;
                this.ls_y = y;
                this.ls_z = z;


                this.ls_cyc_coord += "/ "+ this.ls_x +", "+ this.ls_y +", "+ this.ls_z+" ";
            }
            else {
            if (this.rapid === true){
                if (this.ls_movement === "CUT"){
                    kk("AIR");
                    this.ls_movement = "AIR";
                }
            }
            else {
                if (this.ls_movement === "AIR"){
                    kk("CUT");
                    this.ls_movement = "CUT";
                }
            }

             koord_x=" X++";
             koord_y=" Y++";
             koord_z=" Z++";

            if (this.ls_dim_typ !== "MOVEMENT: absolute"){
                kk("MOVEMENT: absolute");
                this.ls_dim_typ = "MOVEMENT: absolute";
            }
             x = +elements[1];
             y = +elements[2];
             z = +elements[3];

            if (x !== this.ls_x){
                 koord_x = " X" + x;
            }
            if (y !== this.ls_y){
                 koord_y = " Y" + y;
            }
            if (z !== this.ls_z){
                 koord_z = " Z" + z;
            }
            if (this.rapto === 1){
                 dtx = this.ls_x - x;
                 dty = this.ls_y - y;
                 dtz = this.ls_z - z;
                 dist = Math.hypot(dtx, dty, dtz);
                 ratio = dist !== 0 ? this.rapto_num / dist : 0;
                 rdtx = ratio*dtx;
                 rdty = ratio*dty;
                 rdtz = ratio*dtz;
                 koord__x = koord_x-rdtx;
                 koord__y = koord_y-rdty;
                 koord__z = koord_z-rdtz;
                kk("AIR");
                kk("LINE: X"+ koord__x + " Y" + koord__y + " Z" + koord__z);
                kk("CUT");

                this.rapto = 0;
            }
            kk("LINE:"+koord_x + koord_y + koord_z);

            this.ls_x=x;
            this.ls_y=y;
            this.ls_z=z;
            }
            break;
        
        case "SPINDL":
            switch(elements2[1].trim()){
                case "ON":
                    kk(this.ls_spindle);
                    break;
                case "OFF":
                    kk("SPINDLE: off");
                    break;
                case "LOCK":
                    kk("SPINDLE: lock");
                    break;
                default:
                    switch(elements2[3].trim()){
                        case "CLW":
                            D = "cw";
                            break;
                        case "CCLW":
                            D = "ccw";
                            break;
                    }

                    switch(elements2[2].trim()){
                        case "RPM":
                            x = "fix";
                            break;
                        case "SFM":
                            x = "surface";
                            break;
                    }
                    this.ls_spindle = "SPINDLE: on, "+elements2[1].trim()+", "+x+", "+D+", 1";
                    break;
            }
            break;
        
        case "FEDRAT":
            switch(elements2[2].trim()){
                case "MMPM":
                    D = "time";
                    break;
                case "MMPR":
                    D = "rev";
                    break;
            }
            this.ls_tip_posmak = D;
            kk("FEEDRATE: "+D+", "+elements[1].trim());
            break;
        
        case "RAPID":
            if (line.includes("GOTO")){
                 koord_x=" X++";
                 koord_y=" Y++";
                 koord_z=" Z++";

                if (this.ls_dim_typ !== "MOVEMENT: absolute"){
                    kk("MOVEMENT: absolute");
                    this.ls_dim_typ = "MOVEMENT: absolute";
                }
                 x = +elements[1];
                 y = +elements[2];
                 z = +elements[3];

                if (x !== this.ls_x){
                     koord_x = " X" + x;
                }
                if (y !== this.ls_y){
                     koord_y = " Y" + y;
                }
                if (z !== this.ls_z){
                     koord_z = " Z" + z;
                }

                if (this.rapto === 1){
                     dtx = this.ls_x - x;
                     dty = this.ls_y - y;
                     dtz = this.ls_z - z;
                     dist = Math.hypot(dtx, dty, dtz);
                     ratio = dist !== 0 ? this.rapto_num / dist : 0;
                     rdtx = ratio*dtx;
                     rdty = ratio*dty;
                     rdtz = ratio*dtz;
                     koord__x = koord_x-rdtx;
                     koord__y = koord_y-rdty;
                     koord__z = koord_z-rdtz;
                    kk("AIR");
                    kk("LINE: X" + koord__x + " Y" + koord__y + " Z" + koord__z);
                    kk("CUT");

                    this.rapto = 0;
                }
                kk("AIR");
                kk("LINE: " + koord_x + koord_y + koord_z);
                kk("CUT");
            
                this.ls_x=x;
                this.ls_y=y;
                this.ls_z=z;

            }
            else if (line.includes("GODLTA")){
                 koord_x="";
                 koord_y="";
                 koord_z="";

                if (this.ls_dim_typ !== "MOVEMENT: incremental"){
                    kk("MOVEMENT: incremental");
                    this.ls_dim_typ = "MOVEMENT: incremental";
                }
                if (elements.length === 4){
                     x = +elements[1];
                     y = +elements[2];
                     z = +elements[3];
                }
                else if (elements.length === 2){
                     x = "++";
                     y = "++";
                     z = +elements[1];
                }
                else {
                    kk("ERROR: GODLTA ELEMENTS ARE INCOMPLETE " + line);
                    break;
                }
                this.ls_x = (this.ls_x + x);
                this.ls_y = (this.ls_y + y);
                this.ls_z = (this.ls_z + z);
                
                if (x !== 0){
                    koord_x = " X" + x;
                }
                if (y !== 0){
                    koord_y = " Y" + y;
                }
                if (z !== 0){
                    koord_z = " Z" + z;
                }

                if (this.rapto === 1) {
                     dist = Math.hypot(x, y, z);
                    ratio = dist !== 0 ? this.rapto_num / dist : 0;
                     rdtx = ratio*x;
                     rdty = ratio*y;
                     rdtz = ratio*z;
                     koord__x = koord_x-rdtx;
                     koord__y = koord_y-rdty;
                     koord__z = koord_z-rdtz;

                    kk("AIR");
                    kk("LINE: X" + koord__x + " Y" + koord__y + " Z" + koord__z);
                    kk("CUT");

                    this.rapto = 0;
                }
                kk("AIR");
                kk("LINE: " + koord_x + koord_y + koord_z);
                kk("CUT");

            }
            else {
                this.rapid = true;
            }
            break;
        
        case "COOLNT":
            if (line.includes("FLOOD")){
                this.ls_clnt_typ = "COOLANT: on, flood";
                kk("COOLANT: on, flood");
            }
            else if (line.includes("MIST")){
                this.ls_clnt_typ = "COOLANT: on, mist";
                kk("COOLANT: on, mist");
            }
            else if (line.includes("AIR")){
                this.ls_clnt_typ = "COOLANT: on, air";
                kk("COOLANT: on, air");
            }
            else if (line.includes("OFF")){
                kk("COOLANT: off");
            }
            else if (line.includes("ON")){
                if (this.ls_clnt_typ === ""){
                    kk("ERROR: THERE IS NO PREDEFINED COOLANT TYPE, FUNTION ON CANNOT WORK");
                }
                else {
                    kk(this.ls_clnt_typ+" ");
                }
            }
            break;
        
        case "DELAY":
            D=elements2[1];
            if (line.includes("REV")){
                x=D.split(",").trim();
                kk("DWELL: rev, " + x);
            }
            else{
                kk("DWELL: time, " + D.trim());
            }
            break;
        
        case "CYCLE":
            switch(elements2[1].trim()){
                case "NAME":
                    this.ls_cyc_name = line.trim();
                    break;
                case "DATA":
                    this.ls_cyc_data = line.trim();
                    break;
                case "OFF":
                    kk(this.ls_cyc_name);
                    kk(this.ls_cyc_data);
                    kk(this.ls_cyc_specific);
                    kk("CYCLE/COORD"+this.ls_cyc_coord);
                    break;
                default:
                    this.ls_cyc_specific = line.trim();
                    break;
            }
            break;
        
        case "PSIS":
            this.psis = true;
            elements = line.split(/[,\/()]+/).map(e=> e.trim()).filter(e=>e.length>0);
            this.ls_i = +elements[8];
            this.ls_j = +elements[9];
            this.ls_k = +elements[10];
            x = +elements[3];
            y = +elements[4];
            z = +elements[5];
            koord_x=" X++";
            koord_y=" Y++";
            koord_z=" Z++";
            
            this.ls_x=x;
            this.ls_y=y;
            this.ls_z=z;
            let plane_counter = 0;

            if (this.ls_i !== 0){
                kk("PLANE: yz");
                plane_counter += 1;
            }
            if (this.ls_j !== 0){
                kk("PLANE: xz");
                plane_counter += 1;
            }
            if (this.ls_k !== 0){
                kk("PLANE: xy");
                plane_counter += 1;
            }
            if (plane_counter > 1){
                kk("ERROR: more than one vector is defined for this circular movement meaning it is not in a standard plane\n"+line);
            }
            break;
        
        case "INDIRV":
            elements=line.split(/[,\/\s]+/).filter(Boolean);
            this.ls_i = +elements[1];
            this.ls_j = +elements[2];
            this.ls_k = +elements[3];
            break;

        case "MAXSPNDL":
            kk("SPINDLE: MAX, "+elements[1].trim());
            break;

        case "$$":
            D = line.split("$$")[1];
            kk("COMMENT:" + D);
            break;
        
        case "CUTCOM":
            switch(elements2[1].trim()){
                case "ON":
                    kk(this.ls_normds);
                    kk(this.ls_normps);
                    kk(this.ls_l_r);
                    break;
                case "OFF":
                    kk("CUTCOM: off");
                    break;
                case "NORMDS_ON":
                    this.ls_normds = true;
                    break;
                case "NORMDS_OFF":
                    this.ls_normds = false;
                    break;
                case "NORMPS_ON":
                    this.ls_normps = true;
                    break;
                case "NORMPS_OFF":
                    this.ls_normps = false;
                    break
                case "LEFT":
                    this.ls_l_r = "left";
                    break;
                case "RIGHT":
                    this.ls_l_r = "right";
                    break;
                default:
                    kk("ERROR: invalid CUTCOM "+line);
                    break;
            }
            break;
        
        case "CHANGE_TOOL":
            if (elements2[4].trim() === ""){
                D = "++";
            }
            else{
                D = elements2[4];
            }
            kk("TOOL: "+elements2[1].trim()+", "+elements2[2].trim()+", "+elements2[3].trim()+", "+D.trim());
            this.ls_clnt_typ = elements2[4];
            break;
        
        default:
            if (line.startsWith("ERROR")){
                kk(line);
            }
            else{
                kk("ERROR: unrecognized command " + line);
            }
            break;

    }
    if (!line.startsWith("RAPID")) {
            this.rapid = false;
    }
    console.log(line);
    }
}
export class kkod{
    parseline(line){
        kk(line);
    }
}