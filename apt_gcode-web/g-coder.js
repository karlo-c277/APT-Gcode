import {write} from "./output.js";

export class WinNC_sinumerik{
    constructor(settings){
        this.tool_i;
        this.tool_j;
        this.tool_k;
        this.multax = false;
        this.ax_dir;
        this.spindle_dir;
        this.rapid = false;
        this.post_cycle = false;
        this.ls_x;
        this.ls_y;
        this.ls_z;
        this.coolant;
        this.arch_radius;
        this.arch_direction;
        this.arch_angle;
        this.ls_on_cutcom;
        this.helix_center_x;
        this.helix_center_y;
        this.helix_center_z;
        this.helix_axis_i;
        this.helix_axis_j;
        this.helix_axis_k;
        this.helix_pitch;
        this.helix_radius;
        this.helix_height;
        this.helix_turns;
        this.total_depth ;
        this.clearance;
        this.feed_1;
        this.feed_2
        this.feed_typ;
        this.spindle;
        this.spindle_unit;
        this.retract;
        this.cy;
        this.cyc_dwell;
        this.peck;
        this.decrement;
        this.decrement_limit;
        this.pitch;

    }
    gcoder(line){
        let elements;
        let element;
        let movement;
        let type;
        let speed;
        let direction;
        let magazine;
        let compensation;
        let x;
        let y;
        let z;
        let x_2;
        let y_2;
        let z_2;
        let i;
        let j;
        let k;
        let i_2;
        let j_2;
        let k_2;
        let vektor2_x;
        let vektor2_y;
        let vektor2_z;
        let kraj_x;
        let kraj_y;
        let kraj_z;
        let radius;
        let angle;
        let number_dt;
        let number;
        let pre_data;
        let data;
        let coord;
        let cancel;
        let bottom;
        let plane;
        let turn;
        let D;

        let el_0;
        let el_1;
        let el_2;
        let el_3;
        let el_4;
        let el_5;
        let el_6;
        let el_7;
        let el_8;
        let el_9;
        let r;
        let d;
        let left;
        let next_peck;

        let start;

    console.log(line);

    if (line.startsWith ("COMMENT")){
            line = line.replace("COMMENT:", "COMMENT: ");
    }

    elements = line.split(" ");
    element = line.split(/[:,]/);
    start = line.split(/[\/,:\s]+/);

    switch (start[0]){

        case "COMMENT":
        elements = line.split("COMMENT:")[1].trim();
        if (elements !== ""){
        write(";"+elements);
        }
        break;
    
        case "ADD":
        if (line.includes("RADIUS")){
            write("DIAMOF");
        }
        else if (line.includes("DIAMETER")){
            write("DIAMON");
        }
        break;
    
        case "UNIT":
        if (line.includes("MM")){
            write("G71");
        }
        else if (line.includes("INCH")){
            write("G70");
        }
        else{
            write("ERROR: invalid unit type")
        }
        break;
    
        case "PLANE":
        if (line.includes("xy")){
            write("G17");
        }
        else if (line.includes("xz")){
            write("G18");
        }
        else if (line.includes("zy")){
            write("G19");
        }
        break;
    
        case "TOOL":
        name = element[1];
        magazine = element[2];
        compensation = element[3];
        this.coolant = element[4];

        write(name + " " + magazine + " " + compensation);
        this.rapid = false;
        break;
    
        case "SPINDLE":
        if (line.includes("off")){
            if (element[2].trim()!=="1"){
                write("; Spindle nr."+element[2].trim()+" is off but there is no separate spindle control");
            }
            write("M05");
        }
        else if (line.includes("on")){
            
            speed = element[3].trim();
            
            if (line.includes ("fix")){
                type = "G97";
            }
            else if (line.includes("surface")){
                type = "G96";
            }
            if (line.includes("ccw")){
                direction = "M04";
                this.spindle_dir = "ccw";
            }
            else if (line.includes("cw")){
                direction = "M03";
                this.spindle_dir = "cw";
            }
            if (element[2].trim()!=="1"){
                write("; Spindle nr."+element[2].trim()+" is being set but there is no separate spindle control");
            }
            write(type+" S"+speed+" "+" "+direction);
        }
        else{
            speed = element[2].trim();
            write("G26 S"+speed);
        }
        break;
    
        case "FEEDRATE":
        speed = element[2].trim();
        if (line.includes("time")){
            type = "G94";
        }
        else if (line.includes("rev")){
            type = "G95";
        }
        else if (line.includes("inver")){
            type = "G93";
        }
        write(type + " F" + speed);
        break;
    
        case "COOLANT":
        if (line.includes("off")){
            write("M09");
        }
        else if (line.includes("mist")){
            write("M07");
        }
        else if (line.includes("flood")){
            write("M08");
        }
        break;
    
        case "AIR_PURGE":
        if (line.includes("on")){
            write("M71");
        }
        else if (line.includes("off")){
            write("M72");
        }
        break;
    
        case "MOVEMENT":
        if (line.includes("incremental")){
            write("G91");
        }
        else if (line.includes("absolute")){
            write("G90");
        }
        break;
    
        case "AIR":
        if (!this.rapid){
            write("G0");
            this.rapid = true;
        }
        this.post_cycle = false;
        break;
    
        case "CUT":
        if (this.rapid){
            write("G1");
            this.rapid = false;
        }
        this.post_cycle = false;
        break;
    
        case "END":
        write("M30");
        break;
    
        case "ERROR":
        write(line);
        break;
    
        case "MULTAX":
        if (line.includes("on")){
            this.multax = true;
            write("NO MULTI AXIAL WORK SUPPORTED");
        }
        else {
            this.multax = false;
        }
        break;
        
        case "COMPENSATION_CHG":
        write("For correction register nr."+element[1].trim()+" compensation values are: tool tip quadrant: "+element[2].trim()+" xyz values: "+element[3].trim()+" "+element[4].trim()+" "+element[5].trim()+" nose radius is: "+element[6].trim());
        break;

        case "COMPENSATION_CHG":
        write("For tool on slot nr."+element[1].trim()+" the set compensation register is: "+element[2].trim());
        break;

        case "CUTCOM":
        switch (element[1].trim()){

            case "OFF":
                write("G40");
            break;
            
            case "ON":
                write(this.ls_on_cutcom);
            break;

            case "LEFT":
                write("G41");
                this.ls_on_cutcom = "G41";
            break;

            case "RIGHT":
                write("G42");
                this.ls_on_cutcom = "G42";
            break;

            default:
                write("ERROR unknown cutcom value: "+line);
                this.ls_on_cutcom = "ERROR unknown cutcom value";
            break;
        }
        break;

        case("ROTHED"):
        write("Rotation of the head: axis "+element[1].trim()+" type of angle (absolute/incremental) "+element[2].trim()+" direction of rotation "+element[3].trim()+" angle "+element[4].trim());
        break;

        case("ROTABL"):
        write("Rotation of the table axis "+element[1].trim()+" type of angle (absolute/incremental) "+element[2].trim()+" direction of rotation "+element[3].trim()+" angle "+element[4].trim());
        break;

        case("MILL_TURRET_INVERSION"):
        write("The mill turret is inverted");
        break;

        case "TLAXIS":
        this.tool_i = +elements[1];
        this.tool_j = +elements[2];
        this.tool_k = +elements[3];
        break;
        
        case "LINE":
        elements = line.split(/ +/);
        if (elements.length === 4 ){
            x = elements[1];
            y = elements[2];
            z = elements[3];

            x_2 = String(x).replace(/^X/, "");
            y_2 = String(y).replace(/^Y/, "");
            z_2 = String(z).replace(/^Z/, "");

            if (x === "X++"){
                x = "";
            }
            else {
                this.ls_x = +x_2;
            }
            if (y === "Y++"){
                y = "";
            }
            else {
                this.ls_y = +y_2;
            }
            if (z === "Z++"){
                z = "";
            }
            else {
                this.ls_z = +z_2;
            }
            write(x+" "+y+" "+z);

        }
        else if (elements.length === 7){
            x = elements[1];
            y = elements[2];
            z = elements[3];
            i = elements[4];
            j = elements[5];
            k = elements[6];

            if (x === "X++"){
                x = "";
            }
            else if (y === "Y++"){
                y = "";
            }
            else if (z === "Z++"){
                z = "";
            }
            else if (i === "I++"){
                i = "";
            }
            else if (j === "J++"){
                j = "";
            }
            else if (k === "K++"){
                k = "";
            }
            write(x+" "+y+" "+z+" "+i+" "+j+" "+k);
        }
        break;
    
        case "DWELL":
        number_dt = line.split(/ +/)[2];
        number = number_dt.split(":")[1];
        if (line.includes("time")){
            write("G4 S" + number);
        }
        else if (line.includes("rev")){
            write("G4 R" + number);
        }            
        break;
    
        case "ARCH/CENTER":
        case "ARCH/AXIS":
        case "ARCH/TANGENT":
        break;

        case "ARCH/INFO":
            this.arch_radius = +element[1];
            this.arch_direction = +element[2];
            this.arch_angle = +element[3];
        break;
        
        case "ARCH/END":
        this.ls_x = +element[1];
        this.ls_y = +element[2];
        this.ls_z = +element[3];


        if (this.arch_direction === "cw"){
            this.arch_direction = "G2";
        }
        else if (this.arch_direction === "ccw"){
            this.arch_direction = "G3";
        }
        if (this.arch_angle > 180){
            this.arch_radius = (-1)*this.arch_radius;
        }
        write(this.arch_direction + " X" + this.ls_x + " Y" +  this.ls_y + " Z" +  this.ls_z + " R" +  this.arch_radius);
        this.rapid = false;
        break;
    
        case "#":
        write(line);
        break;
    
        case "CYCLE/NAME":
            let name = line.split("NAME,");
            write(";Cycle "+name);
        break;

        case "CYCLE/DATA":
            this.total_depth = +element[1];
            this.clearance = +element[2];
            this.feed_1 = +element[3];
            this.feed_typ = +element[4];
            this.spindle = +element[5];
            this.spindle_unit = +element[6];
            this.retract = +element[7];

            if (this.retract === 0){
                this.feed_2 = +element[8];
            }
            else{
                this.feed_2 = "rapid";
            }
        break;

        case "CYCLE/CY0":
            this.cy = 0;
        break;

        case "CYCLE/CY1":
            this.cy = 1;
            if (+element[1] === 1){
                this.cyc_dwell = "G4 S"+ element[2].trim();
            }
            else if (+element[1] === 2){
                this.cyc_dwell = "G4 R"+ element[3].trim();
            }
            else{
                this.cyc_dwell = "";
            }
        break;

        case "CYCLE/CY2":
            this.cy = 2;
            if (+element[1] === 1){
                this.cyc_dwell = "G4 S"+ element[2].trim();
            }
            else if (+element[1] === 2){
                this.cyc_dwell = "G4 R"+ element[3].trim();
            }
            else{
                this.cyc_dwell = "";
            }
            this.peck = +element[4];
        break;

        case "CYCLE/CY3":
            this.cy = 3;
            if (+element[1] === 1){
                this.cyc_dwell = "G4 S"+ element[2].trim();
            }
            else if (+element[1] === 2){
                this.cyc_dwell = "G4 R"+ element[3].trim();
            }
            else{
                this.cyc_dwell = "";
            }
            this.peck = +element[4];
            this.decrement = +element[5];
            this.decrement_limit = +element[6];
        break;

        case "CYCLE/CY4":
            this.cy = 4;
            this.pitch = +element[1];
        break;

        case "CYCLE/COORD":

        number = elements[0].trim();
        number = number.split(":")[2];
        number_dt = number.match(/\([^)]*\)/g);

        if (this.multax===false){
            if (Math.abs(this.tool_i) === 1){
                write("G19");
                this.ax_dir = this.tool_i;
            }
            else if (Math.abs(this.tool_j) === 1){
                write("G18");
                this.ax_dir = this.tool_j;
            }
            else if (Math.abs(this.tool_k) === 1){
                write("G17");
                this.ax_dir = this.tool_k;
            }
        }
        else {
            write("ERROR: Multi axial work is not supported");
        }
        for (const xyz of number_dt){
            if (this.multax===false){
                if (Math.abs(this.tool_i) === 1){
                        elements = xyz.slice(1, -1).trim().split(/\s+/);
                        x = elements[0].trim();
                        y = elements[1].trim();
                        z = elements[2].trim();

                        x = Number(x.slice(1));
                        kraj_x = x-(el_1+el_4);
                        bottom = ("X" + kraj_x);
                        d = "X";

                        r = (x - el_4 + el_4*0.2);

                        coord = (y + " " + z);
                }
                else if (Math.abs(this.tool_j) === 1){
                        elements = xyz.slice(1, -1).trim().split(/\s+/);
                        x = elements[0].trim();
                        y = elements[1].trim();
                        z = elements[2].trim();

                        y = Number(y.slice(1));
                        kraj_y = y-(el_1+el_4);
                        bottom = ("Y" + kraj_y);
                        d = "Y";

                        r = (y - el_4 + el_4*0.2);

                        coord = (x + " " + z);
                }
                else if (Math.abs(this.tool_k) === 1){
                        elements = xyz.slice(1, -1).trim().split(/\s+/);
                        x = elements[0].trim();
                        y = elements[1].trim();
                        z = elements[2].trim();

                        z = Number(z.slice(1));
                        kraj_z = z-(el_1+el_4);
                        bottom = ("Z" + kraj_z);
                        d = "Z";

                        r = (z - el_4 + el_4*0.2);

                        coord = (x + " " + y + "R"+r+" "+bottom);
                }
                else {
                    console.log("ERROR");
                }
                x_2 = String(x).replace(/^X/, "");
                y_2 = String(y).replace(/^Y/, "");
                z_2 = String(z).replace(/^Z/, "");
            }
            else {
                write("NO MULTI AXIAL WORK SUPPORTED");
                console.error("MULTI AXIAL WORK TYPE");
            }
        
        if (el_0.includes("DRILL_1")){
            el_8 = +data[8];
            el_9 = +data[9];

            if (el_3 === 0 && el_7 === 0 && el_8 === 0 && el_9 === 0) {
                write("G97 S" + el_6);
                write("G291");
                write("G98");

                pre_data = "G84";
                data = ("F"+el_5);

                write(pre_data +" "+ coord +" "+ data);
                write("G80");
                write("G290");
                this.post_cycle = true;
            }
            else if (el_7 === 0 && el_8 === 0 && el_9 === 0) {
                write("G97 S" + el_6);
                write("G291");
                write("G98");

                pre_data = "G82";
                data = "P" + (el_3*1000) + " F"+el_5;

                write(pre_data +" "+ coord +" "+ data);
                write("G80");
                write("G290");
                this.post_cycle = true;
            }
            else {
                if (el_7 === 0){
                    el_7 = el_1;
                }

                next_peck=(el_7*this.ax_dir);
                el_9 = (el_9*this.ax_dir);

                write("G0 X" + x_2 + " Y" + y_2 + " Z" + z_2);
                write("G91");
                write("G95 F" + el_5);
                write("G97 S" + el_6);

                let currentDepth = 0;

                while (true){
                    left = el_1 - currentDepth;

                    if (Math.abs(currentDepth + next_peck) >= el_1) {
                        break;
                    }
                    currentDepth += next_peck;

                    write("G1 " + d + next_peck);
                    if (el_3 !== 0){
                        write("G4 F"+el_3);
                    }

                    next_peck = (next_peck*(1-el_8));

                    if ((el_9 !== 0) && (Math.abs(currentDepth + next_peck) >= el_1)){
                        write("G0 " + d + (el_9*(-1)));
                        write ("G1 " + d + el_9);
                    }
                    else {
                        write("G0 " + d + (el_9*(-1)));
                        write("G1 " + d + (el_9+next_peck));
                    }                
                }
                write("G1 " + (currentDepth-el_1));
                write("G90");
                write("G0 X" + x_2 + " Y" + y_2 + " Z" + z_2);
                this.rapid = true;

            }
            
        }
        else if (el_0.includes("DRILL_2")){
            if (el_3 === 0 && el_8 === 0){
                write("G97 S" + el_6);
                write("G291");
                write("G98");

                pre_data = "G83";
                data = "Q" + el_7 + " F"+el_5;

                write(pre_data +" "+ coord +" "+ data);
                write("G80");
                write("G290");
                this.post_cycle = true;
            }
            else {
                if (el_7 === 0){
                    el_7 = el_1;
                }

                next_peck=(el_7*this.ax_dir);
                el_9 = (el_9*this.ax_dir);

                write("G0 X" + x_2 + " Y" + y_2 + " Z" + z_2);
                write("G91");
                write("G95 F" + el_5);
                write("G97 S" + el_6);

                while (true){
                    if (Math.abs(currentDepth + next_peck) >= el_1) {
                        break;
                    }
                    currentDepth += next_peck;

                    write("G1 " + d + next_peck);
                    if (el_3 !== 0){
                        write("G4 F"+el_3);
                    }

                    next_peck = (next_peck*(1-el_8));

                    if ((el_9 !== 0) && (Math.abs(currentDepth + next_peck) >= el_1)){
                        write("G0 " + d + (currentDepth*(-1)));
                        write ("G1 " + d + currentDepth);
                    }
                    else {
                        write("G0 " + d + (currentDepth*(-1)));
                        write("G1 " + d + (currentDepth+next_peck));
                    }                
                }
                write("G1 " + (currentDepth-el_1));
                write("G90");
                write("G0 X" + x_2 + " Y" + y_2 + " Z" + z_2);
                this.rapid = true;

            }
        }
        else if (el_0.includes("REAM")){

            if (el_7 !== 0 && el_7 !== el_5 && el_3 !== 0){
                write("G0 X" + x_2 + " Y" + y_2 + " Z" + z_2);
                write("G91");
                write("G95 F" + el_5);
                write("G97 S" + el_6);

                if (el_3 !== 0){
                    write("G4 F"+el_3);
                }
                write("G1 " + d + (el_1*this.ax_dir));
                write("F"+el_7);
                write("G90");
                write("G1 X" + x_2 + " Y" + y_2 + " Z" + z_2);
                this.rapid = false;
            }
            else {
                write("G97 S" + el_6);
                write("G291");
                write("G98");

                write("G85 " + coord + " F" + el_5);

                write("G80");
                write("G290");
                this.post_cycle = true;
            }
        }
        else if (el_0.includes("TAP")){
            write("G97 S" + el_6);
            write("G291");
            write("G98");
            if (this.spindle_dir === "cw"){
                pre_data = "G84";
            }
            else {
                pre_data = "G74";
            }
            data = ("F"+el_5);

            write(pre_data +" "+ coord +" "+ data);
            write("G80");
            write("G290");
            this.post_cycle = true;
        }

        this.ls_x = +x_2;
        this.ls_y = +y_2;
        this.ls_z = +z_2;
        }
        break;
        
        case "SINUS/CENTER":
        case "SINUS/AXIS":
        case "SINUS/TANGENT":
        case "SINUS/INFO":
        case "SINUS/END":
            write("ERROR this controler does not support sinusoidal movement");
            break;

        case "HELIX/CENTER":
            this.helix_center_x = +element[1];
            this.helix_center_y = +element[2];
            this.helix_center_z = +element[3];
        break;

        case "HELIX/TANGENT":
            this.ls_i = +element[1];
            this.ls_j = +element[2];
            this.ls_k = +element[3];
        break;

        case "HELIX/AXIS":
            this.helix_axis_i = +element[1];
            this.helix_axis_j = +element[2];
            this.helix_axis_k = +element[3];
        break;

        case "HELIX/INFO":
            this.helix_pitch = +element[1];
            this.helix_radius = +element[2];
            this.helix_height = +element[3];
            this.helix_turns = +element[4];
        break;

        case "HELIX/END":
            kraj_x = +elements[1];
            kraj_y = +elements[2];
            kraj_z = +elements[3];

        
        if (Math.abs(this.helix_axis_j) === 1){
                        vektor2_x = this.ls_x - this.helix_center_x;
                        vektor2_z = this.ls_z - this.helix_center_z;
                        D = this.ls_i * vektor2_z - vektor2_x * this.ls_k;
        
                        if (D<0){
                            movement = "G2";
                        }
                        else if (D>0){
                            movement = "G3";
                        }
                        else {
                            write("ERROR CIRCLE CENTER XZ IS ON THE CIRCLE TANGENT " + line)
                        }
                        coord = ("I"+this.helix_center_x+" K"+this.helix_center_z);
        }
        else if (Math.abs(this.helix_axis_k)=== 1){
                            vektor2_x = this.ls_x - this.helix_center_x;
                            vektor2_y = this.ls_y - this.helix_center_y;
                            D = this.ls_i * vektor2_y - vektor2_x * this.ls_j;

                            console.log(this.ls_x+" "+this.helix_center_x+" "+this.ls_y+" "+this.helix_center_y);

                            console.log(vektor2_x);
                            console.log(vektor2_y);
        
                            if (D<0){
                                movement = "G2";
                            }
                            else if (D>0){
                                movement = "G3";
                            }
                            else {
                                write("ERROR CIRCLE CENTER XY IS ON THE CIRCLE TANGENT " + line)
                            }
                            coord = ("I"+this.helix_center_x+" J"+this.helix_center_y);
        }
        else if (Math.abs(this.helix_axis_2) === 1){
                            vektor2_y = this.ls_y - this.helix_center_y;
                            vektor2_z = this.ls_z - this.helix_center_z;
                            D = this.ls_j * vektor2_z - vektor2_y * this.ls_k;
        
                            if (D<0){
                            movement = "G2";
                            }
                            else if (D>0){
                                movement = "G3";
                            }
                            else {
                                write("ERROR CIRCLE CENTER ZY IS ON THE CIRCLE TANGENT " + line)
                            }
                            coord = ("J"+this.helix_center_y+" K"+this.helix_center_z);
        }
        write(movement+" X"+kraj_x+" Y"+kraj_y+" Z"+kraj_z+" "+coord+" TURN="+this.helix_turns);
        this.ls_x = +kraj_x;
        this.ls_y = +kraj_y;
        this.ls_z = +kraj_z;
        break;
    
        default:
        write("UNREGISTERD CYCLE" + line);
        break;
}
}
}
export class Karlov_kod{
    gcoder(line){
        write(line);
    }
}