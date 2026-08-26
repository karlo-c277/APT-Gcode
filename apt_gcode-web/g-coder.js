import {write} from "./output.js";

export class WinNC_sinumerik {
    constructor(settings){
        this.tool_i;
        this.tool_j;
        this.tool_k;
        this.multax = false;
        this.ax_dir;
        this.spindle_dir;

    }
    gcoder(line){
        let elements;
        let type;
        let speed;
        let direction;
        let name;
        let magazine;
        let compensation;
        let x;
        let y;
        let z;
        let i;
        let j;
        let k;
        let centar_x;
        let centar_y;
        let centar_z;
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
        let currentDepth;
        let next_peck;

console.log(line);

    if (line.startsWith("COMMENT")){
        line = line.replace("COMMENT:", ";");
        write(line);
    }
    else if (line.startsWith("ADD")){
        if (line.includes("RADIUS")){
            write("DIAMOF");
        }
        else if (line.includes("DIAMETER")){
            write("DIAMON");
        }
    }
    else if (line.startsWith("UNIT")){
        if (line.includes("MM")){
            write("G71");
        }
        else if (line.includes("INCH")){
            write("G70");
        }
    }
    else if (line.startsWith("PLANE")){
        if (line.includes("xy")){
            write("G17");
        }
        else if (line.includes("xz")){
            write("G18");
        }
        else if (line.includes("zy")){
            write("G19");
        }
    }
    else if (line.startsWith("TOOL")){
        let elements = line.split(" ");
        let name = elements[1];
        let magazine = elements[2];
        let compensation = elements[3];

        write(name + " " + magazine + " " + compensation);
    }
    else if (line.startsWith("SPINDLE")){
        if (line.includes("off")){
            write("M05");
        }
        else if (line.includes("on")){
            elements = line.split(" ");
            speed = elements[3].split(":")[1];
            
            if(line.includes ("fix")){
                type = "G97";
            }
            else if (line.includes("surface")){
                type = "G96";
            }
            if (line.includes("cw")){
                direction = "M03";
                this.spindle_dir = "cw";
            }
            else if (line.includes("ccw")){
                direction="M04";
                this.spindle_dir = "ccw";
            }
            write(type+" S"+speed+" "+" "+direction);
        }
    }
    else if (line.startsWith("FEEDRATE")){
        elements = line.split(" ");
        speed = elements[2].split(":")[1];
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
    }
    else if (line.startsWith("COOLANT")){
        if (line.includes("off")){
            write("M09");
        }
        else if (line.includes("mist")){
            write("M07");
        }
        else if (line.includes("flood")){
            write("M08");
        }
    }
    else if (line.startsWith("AIR_PURGE")){
        if (line.includes("on")){
            write("M71");
        }
        else if (line.includes("off")){
            write("M72");
        }
    }
    else if (line.startsWith("MOVEMENT")){
        if (line.includes("incremental")){
            write("G91");
        }
        else if (line.includes("absolute")){
            write("G90");
        }
    }
    else if (line.startsWith("TLAXIS")){
        elements = line.split(" ");
        this.tool_i = +elements[1];
        this.tool_j = +elements[2];
        this.tool_k = +elements[3];
    }
    else if (line.startsWith("AIR")){

        write("G0");
    }
    else if (line.startsWith("CUT")){
        write("G1");
    }
    else if (line.startsWith("END")){
        write("M30");
    }
    else if (line.startsWith("ERROR")){
        write(line);
    }
    else if (line.startsWith("MULTAX")){
        this.multax = true;
    }
    else if (line.startsWith("LINE")){
        elements = line.split(" ");
        if (elements.length === 4 ){
            x = elements[1];
            y = elements[2];
            z = elements[3];

            if (x === "X++"){
                x = "";
            }
            if (y === "Y++"){
                y = "";
            }
            if (z === "Z++"){
                z = "";
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

    }
    else if (line.startsWith("DWELL")){
        number_dt = line.split(" ")[2];
        number = number_dt.split(":")[1];
        if (line.includes("time")){
            write("G4 S" + number);
        }
        else if (line.includes("rev")){
            write("G4 R" + number);
        }            
    }
    else if (line.startsWith("ARCH")){
        elements = line.split(" ");
        direction = elements[20];
        radius = +elements[2];
        x = +elements[12];
        y = +elements[13];
        z = +elements[14];
        angle = +elements[22];

        if (direction === "cw"){
            direction = "G2";
        }
        else if (direction === "ccw"){
            direction = "G3";
        }
        if (angle > 180){
            radius = (-1)*radius;
        }
        write(direction + " X" + x + " Y" +  y + " Z" +  z + " R" +  radius);

    }
    else if (line.startsWith("#")){
        write(line);
    }
    else if (line.startsWith("COMPENSATION")){
        compensation = line.split(":")[1];
        compensation = compensation.trim;
        switch (compensation) {
                case "TR":
                    elements ="1";
                    break;
                case "TL":
                    elements ="2";
                    break;
                case "BL":
                    elements ="3";
                    break;
                case "BR":
                    elements ="4";
                    break;
                case "CR":
                    elements ="5";
                    break;
                case "TC":
                    elements ="6";
                    break;
                case "CL":
                    elements ="7";
                    break;
                case "BC":
                    elements ="8";
                    break;
                case "CC":
                    elements ="9";
                    break;
                default:
                    elements ="OFF";
            }
        write("Go to https://github.com/karlo-c277/APT-Gcode/blob/main/DOCUMENTATIONS/Images/image.png to confirm that all tools have matching compensation. This one is "+elements);
    }
    else if (line.startsWith("CYCLE")) {
        elements = line.split("/");

        data = elements[1].trim;
        data = data.split(" ");
        el_0 = data[0].trim;
        el_1 = +data[1];
        el_2 = +data[2];
        el_3 = +data[3];
        el_4 = +data[4];
        el_5 = +data[5];
        el_6 = +data[6];
        el_7 = +data[7];

        number = elements[0].trim;
        number = number.split(":")[2];
        
        number_dt = number.match(/\([^)]*\)/g);

        if (multax===false){
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

        for (const xyz of number_dt) {
            if (multax===false){

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
            }
        
        if (el_0.includes("DRILL"))  {
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
            }
            else {
                if (el_7 === 0){
                    el_7 = el_1;
                }

                next_peck=(el_7*this.ax_dir);
                el_9 = (el_9*this.ax_dir);

                write("G0 X" + x + " Y" + y + " Z" + z);
                write("G91");
                write("G95 F" + el_5);
                write("G97 S" + el_6);

                while (true){
                    left = el_1 - currentDepth;

                    if (currentDepth + next_peck >= el_1) {
                        break;
                    }
                    currentDepth += next_peck;

                    write("G1 " + d + next_peck);
                    if (el_3 !== 0){
                        write("G4 F"+el_3);
                    }

                    next_peck = (next_peck*(1-el_8));

                    if ((el_9 !== 0) && (currentDepth + next_peck >= el_1)){
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
                write("G0 X" + x + " Y" + y + " Z" + z);

            }
            
        }
        else if (el_0.includes("REAM")){
            write("G0 X" + x + " Y" + y + " Z" + z);
            write("G91");
            write("G95 F" + el_5);
            write("G97 S" + el_6);

            if (el_3 !== 0){
                write("G4 F"+el_3);
            }
            write("G1 " + d + (el_1*this.ax_dir));
            write("F"+el_9);
            write("G1 X" + x + " Y" + y + " Z" + z);
        }
        else if (el_0.includes("TAP")){
            write("G97 S" + el_6);
            write("G291");
            write("G98");
            if (this.spindle_dir === "cw") {
                pre_data = "G84";
            }
            else {
                pre_data = "G74";
            }
            data = ("F"+el_5);

            write(pre_data +" "+ coord +" "+ data);
            write("G80");
            write("G290");
        }
        }

    }
    else {
        write(line);
    }
}
}
export class Karlov_kod{
    gcoder(line){
        write(line);
    }
}