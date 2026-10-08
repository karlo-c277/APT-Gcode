import {write, findDirection2D} from "./output.js";

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
        this.plane;

    }
    gcoder(line){
        let elements;
        let element;
        let movement;
        let type;
        let speed;
        let direction;
        let x;
        let y;
        let z;
        let x_2;
        let y_2;
        let z_2;
        let i;
        let j;
        let k;
        let kraj_x;
        let kraj_y;
        let kraj_z;
        let number_dt;
        let number;
        let coord;
        let D;

        let start;

    console.log(line);
    if (!line || !line.trim()) {return};

    elements = line.split(" ");
    element = line.split(/[:,]/);
    start = line.split(/[\/,:]+/);

    switch (start[0].trim()){

        case "COMMENT":
        elements = line.split("COMMENT:")[1].trim();
        if (elements !== ""){
        write(";"+elements);
        }
        break;
        
        case "rawG":
            D = line.replace("rawG:", "");
            write(D);
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
            this.plane = "xy";
        }
        else if (line.includes("xz")){
            write("G18");
            this.plane = "xz";
        }
        else if (line.includes("zy")){
            write("G19");
            this.plane = "zy";
        }
        break;

        case "SPINDLE":
        if (line.includes("off")){
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
        else if (line.includes("air")){
            write("ERROR: this controler doesn't have an option to output compressed air throught the coolant nozzle, see AIR_purge SYNTACS")
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

        case "COMPENSATION_SET":
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

        case "TOOL":
            write("T="+element[1].trim());
            break;

        case "ROTHED":
        write("Rotation of the head: axis "+element[1].trim()+" type of angle (absolute/incremental) "+element[2].trim()+" direction of rotation "+element[3].trim()+" angle "+element[4].trim());
        break;

        case "ROTABL":
        write("Rotation of the table axis "+element[1].trim()+" type of angle (absolute/incremental) "+element[2].trim()+" direction of rotation "+element[3].trim()+" angle "+element[4].trim());
        break;

        case "MILL_TURRET_INVERSION":
        write("The mill turret is inverted");
        break;

        case "TLAXIS":
        this.tool_i = +element[1];
        this.tool_j = +element[2];
        this.tool_k = +element[3];
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

             if (i === "I++"){
                i = "";
            }

             if (j === "J++"){
                j = "";
            }

             if (k === "K++"){
                k = "";
            }
            write(x+" "+y+" "+z+" "+i+" "+j+" "+k);
            write("This program does not yet support multi axial machining")
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
    
        case "ARCH":
            switch(start[1].trim()){

                case "INFO":
                    this.arch_radius = +element[1];
                    this.arch_direction = +element[2];
                    this.arch_angle = +element[3];
                break;

                case "END":
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
            }
            break;

                    console.log(element);
        case "#":
        write(line);
        break;
    
        case "CYCLE":
            switch (start[1].trim()){

                case "NAME":
                    D = line.replace("CYCLE/NAME,",";Cycle ");
                    write(D);
                break;

            case "DATA":
                this.total_depth = +element[1];
                this.clearance = +element[2];
                this.feed_1 = +element[3];
                this.feed_typ = element[4].trim();
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

            case "CY0":
                this.cy = 0;
            break;

            case "CY1":
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

            case "CY2":
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

            case "CY3":
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

            case "CY4":
                this.cy = 4;
                this.pitch = +element[1];
            break;

            case "COORD":
            number_dt = line.split("COORD/")[1].split("/").map(xyz => xyz.trim()).filter(Boolean);

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
                else{
                    write("ERROR wrongly define tool axis")
                }
            }
            else {
                write("ERROR: Multi axial work is not supported");
            }
            for (const xyz of number_dt){
                if (this.multax===false){
                    elements = xyz.split(",");
                    x = +elements[0];
                    y = +elements[1];
                    z = +elements[2];
                    coord = "X"+x+" Y"+y+" Z"+z;

                    this.ls_x = x;
                    this.ls_y = y;
                    this.ls_z = z;
                }
                else {
                    write("NO MULTI AXIAL WORK SUPPORTED");
                    console.error("MULTI AXIAL WORK TYPE");
                }
                let currentDepth = 0;
                if (Math.abs(this.tool_k)===1){
                    switch (this.cy){
                        case 0:
                            write("G0 "+coord);
                            write("G91");
                            write("Z"+(this.clearance*this.tool_k));

                            if (this.feed_typ === "MMPR"){
                                write("G95 F"+this.feed_1);
                            }
                            else{
                                write("G94 F"+this.feed_1);
                            }

                            if (this.spindle_unit === "RPM"){
                                write ("G97 S"+this.spindle);
                            }
                            else{
                                write ("G96 S"+this.spindle);
                            }

                            write("G1 Z"+this.total_depth*this.tool_k);
                            write("G90");

                            if (this.feed_2 === "rapid"){
                                write("G0 "+coord);
                            }
                            else{
                                if (this.feed_typ === "MMPR"){
                                    write("G95 F"+this.feed_2);
                                }
                                else{
                                    write("G94 F"+this.feed_2);
                                }
                                write(coord);
                            }
                        break;

                        case 1:
                            write("G0 "+coord);
                            write("G91");
                            write("Z"+(this.clearance*this.tool_k));

                            if (this.feed_typ === "MMPR"){
                                write("G95 F"+this.feed_1);
                            }
                            else{
                                write("G94 F"+this.feed_1);
                            }

                            if (this.spindle_unit === "RPM"){
                                write ("G97 S"+this.spindle);
                            }
                            else{
                                write ("G96 S"+this.spindle);
                            }

                            write("G1 Z"+this.total_depth*this.tool_k);
                            write(this.cyc_dwell);

                            if (this.feed_2 === "rapid"){
                                write("G90");
                                write("G0 "+coord);
                            }
                            else{
                                if (this.feed_typ === "MMPR"){
                                    write("G95 F"+this.feed_2);
                                }
                                else{
                                    write("G94 F"+this.feed_2);
                                }
                                write("G90");
                                write(coord);
                            }
                        break;

                        case 2:
                            write("G0 "+coord);
                            write("G91");
                            write("Z"+(this.clearance*this.tool_k));

                            if (this.feed_typ === "MMPR"){
                                write("G95 F"+this.feed_1);
                            }
                            else{
                                write("G94 F"+this.feed_1);
                            }

                            if (this.spindle_unit === "RPM"){
                                write ("G97 S"+this.spindle);
                            }
                            else{
                                write ("G96 S"+this.spindle);
                            }
                            while (this.total_depth > currentDepth){
                                write("G1 Z"+(this.peck*this.tool_k));
                                D = this.total_depth - currentDepth;
                                currentDepth += this.peck;
                                write(this.cyc_dwell);
                            }

                            write("G1 Z"+(D*this.tool_k));
                            write(this.cyc_dwell);

                            if (this.feed_2 === "rapid"){
                                write("G90");
                                write("G0 "+coord);
                            }
                            else{
                                if (this.feed_typ === "MMPR"){
                                    write("G95 F"+this.feed_2);
                                }
                                else{
                                    write("G94 F"+this.feed_2);
                                }
                                write("G90");
                                write(coord);
                            }
                        break;
                        
                        case 3:
                            write("G0 "+coord);
                            write("G91");
                            write("Z"+(this.clearance*this.tool_k));

                            if (this.feed_typ === "MMPR"){
                                write("G95 F"+this.feed_1);
                            }
                            else{
                                write("G94 F"+this.feed_1);
                            }

                            if (this.spindle_unit === "RPM"){
                                write ("G97 S"+this.spindle);
                            }
                            else{
                                write ("G96 S"+this.spindle);
                            }
                            let loop_nr = 0;
                            let currentPeck = this.peck;

                            while (this.total_depth > currentDepth){
                                if (loop_nr <= this.decrement_limit && currentPeck >= 0.05*this.peck){
                                    currentPeck = this.peck*Math.pow((1-this.decrement), loop_nr);
                                }
                                loop_nr += 1;
                                write("G1 Z"+(currentPeck*this.tool_k));
                                D = this.total_depth - currentDepth;
                                currentDepth += currentPeck;
                                write(this.cyc_dwell);
                            }

                            write("G1 Z"+(D*this.tool_k));
                            write(this.cyc_dwell);

                            if (this.feed_2 === "rapid"){
                                write("G90");
                                write("G0 "+coord);
                            }
                            else{
                                if (this.feed_typ === "MMPR"){
                                    write("G95 F"+this.feed_2);
                                }
                                else{
                                    write("G94 F"+this.feed_2);
                                }
                                write("G90");
                                write(coord);
                            }
                        break;

                        case 4:
                            write("Please output this cycle in the CNC controler since this is thread cutting operation");
                            write("Coordinates: "+coord+" Total depth "+ this.total_depth+" clearance"+ this.clearance+" forward feed"+ this.feed_1+ ", back feed"+this.retract+" feed type "+this.feed_typ);
                            write("Spindle speed & unit "+this.spindle+", "+this.spindle_unit);
                            write("Tool pitch "+ this.pitch);
                        break;

                    }
                }
                else if (Math.abs(this.tool_j)===1){
                    switch (this.cy){
                        case 0:
                            write("G0 "+coord);
                            write("G91");
                            write("Y"+(this.clearance*this.tool_j));

                            if (this.feed_typ === "MMPR"){
                                write("G95 F"+this.feed_1);
                            }
                            else{
                                write("G94 F"+this.feed_1);
                            }

                            if (this.spindle_unit === "RPM"){
                                write ("G97 S"+this.spindle);
                            }
                            else{
                                write ("G96 S"+this.spindle);
                            }

                            write("G1 Y"+this.total_depth*this.tool_j);
                            write("G90");

                            if (this.feed_2 === "rapid"){
                                write("G0 "+coord);
                            }
                            else{
                                if (this.feed_typ === "MMPR"){
                                    write("G95 F"+this.feed_2);
                                }
                                else{
                                    write("G94 F"+this.feed_2);
                                }
                                write(coord);
                            }
                        break;

                        case 1:
                            write("G0 "+coord);
                            write("G91");
                            write("Y"+(this.clearance*this.tool_j));

                            if (this.feed_typ === "MMPR"){
                                write("G95 F"+this.feed_1);
                            }
                            else{
                                write("G94 F"+this.feed_1);
                            }

                            if (this.spindle_unit === "RPM"){
                                write ("G97 S"+this.spindle);
                            }
                            else{
                                write ("G96 S"+this.spindle);
                            }

                            write("G1 Y"+this.total_depth*this.tool_j);
                            write(this.cyc_dwell);

                            if (this.feed_2 === "rapid"){
                                write("G90");
                                write("G0 "+coord);
                            }
                            else{
                                if (this.feed_typ === "MMPR"){
                                    write("G95 F"+this.feed_2);
                                }
                                else{
                                    write("G94 F"+this.feed_2);
                                }
                                write("G90");
                                write(coord);
                            }
                        break;

                        case 2:
                            write("G0 "+coord);
                            write("G91");
                            write("Y"+(this.clearance*this.tool_j));

                            if (this.feed_typ === "MMPR"){
                                write("G95 F"+this.feed_1);
                            }
                            else{
                                write("G94 F"+this.feed_1);
                            }

                            if (this.spindle_unit === "RPM"){
                                write ("G97 S"+this.spindle);
                            }
                            else{
                                write ("G96 S"+this.spindle);
                            }
                            while (this.total_depth > currentDepth){
                                write("G1 Y"+(this.peck*this.tool_j));
                                D = this.total_depth - currentDepth;
                                currentDepth += this.peck;
                                write(this.cyc_dwell);
                            }

                            write("G1 Y"+(D*this.tool_j));
                            write(this.cyc_dwell);

                            if (this.feed_2 === "rapid"){
                                write("G90");
                                write("G0 "+coord);
                            }
                            else{
                                if (this.feed_typ === "MMPR"){
                                    write("G95 F"+this.feed_2);
                                }
                                else{
                                    write("G94 F"+this.feed_2);
                                }
                                write("G90");
                                write(coord);
                            }
                        break;
                        
                        case 3:
                            write("G0 "+coord);
                            write("G91");
                            write("Y"+(this.clearance*this.tool_j));

                            if (this.feed_typ === "MMPR"){
                                write("G95 F"+this.feed_1);
                            }
                            else{
                                write("G94 F"+this.feed_1);
                            }

                            if (this.spindle_unit === "RPM"){
                                write ("G97 S"+this.spindle);
                            }
                            else{
                                write ("G96 S"+this.spindle);
                            }
                            let loop_nr = 0;
                            let currentPeck = this.peck;
                            while (this.total_depth > currentDepth){
                                if (loop_nr <= this.decrement_limit && currentPeck >= 0.05*this.peck){
                                    currentPeck = this.peck*Math.pow((1-this.decrement), loop_nr);
                                }
                                loop_nr += 1;
                                write("G1 Y"+(currentPeck*this.tool_j));
                                D = this.total_depth - currentDepth;
                                currentDepth += currentPeck;
                                write(this.cyc_dwell);
                            }

                            write("G1 Y"+(D*this.tool_j));
                            write(this.cyc_dwell);

                            if (this.feed_2 === "rapid"){
                                write("G90");
                                write("G0 "+coord);
                            }
                            else{
                                if (this.feed_typ === "MMPR"){
                                    write("G95 F"+this.feed_2);
                                }
                                else{
                                    write("G94 F"+this.feed_2);
                                }
                                write("G90");
                                write(coord);
                            }
                        break;

                        case 4:
                            write("Please output this cycle in the CNC controler since this is thread cutting operation");
                            write("Coordinates: "+coord+" Total depth "+ this.total_depth+" clearance"+ this.clearance+" forward feed"+ this.feed_1+ ", back feed"+this.retract+" feed type "+this.feed_typ);
                            write("Spindle speed & unit "+this.spindle+", "+this.spindle_unit);
                            write("Tool pitch "+ this.pitch);
                        break;

                    }
                }
                else if (Math.abs(this.tool_i)===1){
                    switch (this.cy){
                        case 0:
                            write("G0 "+coord);
                            write("G91");
                            write("X"+(this.clearance*this.tool_i));

                            if (this.feed_typ === "MMPR"){
                                write("G95 F"+this.feed_1);
                            }
                            else{
                                write("G94 F"+this.feed_1);
                            }

                            if (this.spindle_unit === "RPM"){
                                write ("G97 S"+this.spindle);
                            }
                            else{
                                write ("G96 S"+this.spindle);
                            }

                            write("G1 X"+this.total_depth*this.tool_i);
                            write("G90");

                            if (this.feed_2 === "rapid"){
                                write("G0 "+coord);
                            }
                            else{
                                if (this.feed_typ === "MMPR"){
                                    write("G95 F"+this.feed_2);
                                }
                                else{
                                    write("G94 F"+this.feed_2);
                                }
                                write(coord);
                            }
                        break;

                        case 1:
                            write("G0 "+coord);
                            write("G91");
                            write("X"+(this.clearance*this.tool_i));

                            if (this.feed_typ === "MMPR"){
                                write("G95 F"+this.feed_1);
                            }
                            else{
                                write("G94 F"+this.feed_1);
                            }

                            if (this.spindle_unit === "RPM"){
                                write ("G97 S"+this.spindle);
                            }
                            else{
                                write ("G96 S"+this.spindle);
                            }

                            write("G1 X"+this.total_depth*this.tool_i);
                            write(this.cyc_dwell);

                            if (this.feed_2 === "rapid"){
                                write("G90");
                                write("G0 "+coord);
                            }
                            else{
                                if (this.feed_typ === "MMPR"){
                                    write("G95 F"+this.feed_2);
                                }
                                else{
                                    write("G94 F"+this.feed_2);
                                }
                                write("G90");
                                write(coord);
                            }
                        break;

                        case 2:
                            write("G0 "+coord);
                            write("G91");
                            write("X"+(this.clearance*this.tool_i));

                            if (this.feed_typ === "MMPR"){
                                write("G95 F"+this.feed_1);
                            }
                            else{
                                write("G94 F"+this.feed_1);
                            }

                            if (this.spindle_unit === "RPM"){
                                write ("G97 S"+this.spindle);
                            }
                            else{
                                write ("G96 S"+this.spindle);
                            }
                            while (this.total_depth > currentDepth){
                                write("G1 X"+(this.peck*this.tool_i));
                                D = this.total_depth - currentDepth;
                                currentDepth += this.peck;
                                write(this.cyc_dwell);
                            }

                            write("G1 X"+(D*this.tool_i));
                            write(this.cyc_dwell);

                            if (this.feed_2 === "rapid"){
                                write("G90");
                                write("G0 "+coord);
                            }
                            else{
                                if (this.feed_typ === "MMPR"){
                                    write("G95 F"+this.feed_2);
                                }
                                else{
                                    write("G94 F"+this.feed_2);
                                }
                                write("G90");
                                write(coord);
                            }
                        break;
                        
                        case 3:
                            write("G0 "+coord);
                            write("G91");
                            write("X"+(this.clearance*this.tool_i));

                            if (this.feed_typ === "MMPR"){
                                write("G95 F"+this.feed_1);
                            }
                            else{
                                write("G94 F"+this.feed_1);
                            }

                            if (this.spindle_unit === "RPM"){
                                write ("G97 S"+this.spindle);
                            }
                            else{
                                write ("G96 S"+this.spindle);
                            }
                            let loop_nr = 0;
                            let currentPeck = this.peck;
                            while (this.total_depth > currentDepth){
                                if (loop_nr <= this.decrement_limit && currentPeck >= 0.05*this.peck){
                                    currentPeck = this.peck*Math.pow((1-this.decrement), loop_nr);
                                }
                                loop_nr += 1;
                                write("G1 X"+(currentPeck*this.tool_i));
                                D = this.total_depth - currentDepth;
                                currentDepth += currentPeck;
                                write(this.cyc_dwell);
                            }

                            write("G1 X"+(D*this.tool_i));
                            write(this.cyc_dwell);

                            if (this.feed_2 === "rapid"){
                                write("G90");
                                write("G0 "+coord);
                            }
                            else{
                                if (this.feed_typ === "MMPR"){
                                    write("G95 F"+this.feed_2);
                                }
                                else{
                                    write("G94 F"+this.feed_2);
                                }
                                write("G90");
                                write(coord);
                            }
                        break;

                        case 4:
                            write("Please output this cycle in the CNC controler since this is thread cutting operation");
                            write("Coordinates: "+coord+" Total depth "+ this.total_depth+" clearance"+ this.clearance+" forward feed"+ this.feed_1+ ", back feed"+this.retract+" feed type "+this.feed_typ);
                            write("Spindle speed & unit "+this.spindle+", "+this.spindle_unit);
                            write("Tool pitch "+ this.pitch);
                        break;

                    }
                }
            }
            break;
            }
        break;

        case "SINUS":
            write("ERROR this controler does not support sinusoidal movement");
            break;
   
        case "HELIX":
            switch (start[1].trim()){

                case "CENTER":
                    this.helix_center_x = +element[1];
                    this.helix_center_y = +element[2];
                    this.helix_center_z = +element[3];
                break;

                case "TANGENT":
                    this.ls_i = +element[1];
                    this.ls_j = +element[2];
                    this.ls_k = +element[3];
                break;

                case "AXIS":
                    this.helix_axis_i = +element[1];
                    this.helix_axis_j = +element[2];
                    this.helix_axis_k = +element[3];
                break;

                case "INFO":
                    this.helix_pitch = +element[1];
                    this.helix_radius = +element[2];
                    this.helix_height = +element[3];
                    this.helix_turns = +element[4];
                break;

                case "END":
                    kraj_x = +element[1];
                    kraj_y = +element[2];
                    kraj_z = +element[3];

                    getPlane(
                        ["cor", this.ls_x, this.ls_y, this.ls_z],
                        ["cor", this.helix_center_x, this.helix_center_y, this.helix_center_z],
                        ["ver", this.ls_i, this.ls_j, this.ls_k]
                    );
                
                    if (Math.abs(this.helix_axis_j) === 1){
                        movement = findDirection2D(this.ls_k, this.ls_z, this.helix_center_z, this.ls_i, this.ls_x, this.helix_center_x);
                        if (this.plane !== "xz"){
                            write("G18");
                        }
                        coord = ("I"+this.helix_center_x+" K"+this.helix_center_z);
                    }   
                    else if (Math.abs(this.helix_axis_k)=== 1){
                        movement = findDirection2D(this.ls_i, this.ls_x, this.helix_center_x, this.ls_j, this.ls_y, this.helix_center_y);
                        if (this.plane !== "xy"){
                            write("G17");
                        }
                        coord = ("I"+this.helix_center_x+" J"+this.helix_center_y);
                    }
                    else if (Math.abs(this.helix_axis_i) === 1){
                        movement = findDirection2D(this.ls_j, this.ls_y, this.helix_center_y, this.ls_k, this.ls_z, this.helix_center_z);
                        if (this.plane !== "zy"){
                            write("G19");
                        }

                        coord = ("J"+this.helix_center_y+" K"+this.helix_center_z);
                    }
                    if (!movement){
                        write("ERROR center is on the arch tangent");
                    }
                write(movement+" X"+kraj_x+" Y"+kraj_y+" Z"+kraj_z+" "+coord+" TURN="+this.helix_turns);
                this.ls_x = kraj_x;
                this.ls_y = kraj_y;
                this.ls_z = kraj_z;
                break;

            }
        break;

        default:
        write("UNREGISTERD COMMAND" + line);
        break;
        }
    }
}
export class Karlov_kod{
    gcoder(line){
        write(line);
    }
}