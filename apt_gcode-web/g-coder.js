import {write} from "./output.js";

export class WinNC_sinumerik {
    constructor(settings){
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
        let compensation = elemnts[3];

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
            if (line.includes("ccw")){
                direction = "M03";
            }
            else if (line.includes("cw")){
                direction="M04";
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