import {write} from "./output.js";

console.log("parser")

export class MyParseline{
    constructor(settings){
            this.tolr_coord = 1e-3;
            this.lsmovement = "";
            this.lsplane = "";
            this.lsroation = "";
            this.ls_tip_rev = "";
            this.ls_tip_posmak = "";
            this.lssklop = "";
            this.ls_x = 0.0;
            this.ls_y = 0.0;
            this.ls_z = 0.0;
            this.ls_i = 0.0;
            this.ls_j = 0.0;
            this.ls_k = 0.0;
            this.ls_spindle_speed = 0.0;
            this.ls_on_rotation = "";
            this.ls_dim_typ = "";
            this.ls_clnt = "";
            this.ls_cycle = "";
            this.lsunits = document.getElementById ? document.getElementById(settings.output.default_units) : null;
            this.comments = ["TPRINT", "PPRINT", "LOADTL/", "TOOLNO/", "REWIND/", "SELECTL/", "CUTTER/", "INTOL/", "OUTOL/", "TOLER/", "FINI", "END", "PARTNO", "$$", "OPERATION NAME", "TLAXIS", "CUTCOM"];
            this.non_def = ["SWITCH/", "PPFUN", "GO/", "INDIRP/"];
            this.lsautops = 0;
            this.ls_feed_speed = 0.0;
            this.ls_ls_x = 0.0;
            this.ls_ls_y = 0.0;
            this.ls_ls_z = 0.0;
            this.rapto=0;
            if (this.lsunits === "G21"){
                this.ls_units_word = "MM";
                this.rnd_num=3;
            }
            else if (this.lsunits === "G20"){
                this.ls_units_word = "INCH";
                this.rnd_num=4;
            }
            else {
                write("Unit value not determined")
            }
        }
    parseline(line){
        if (!line || !line.trim()) return;

        if (line.startsWith("UNITS")){
            if (line.includes("MM")){
                if (this.lsunits !== "G21"){
                    write("G21");
                    this.lsunits = "G21";
                }
            } else if (line.includes("INCH")){
                if (this.lsunits !== "G20"){
                    write("G20");
                    this.lsunits = "G20";
                }
            } else {
                write("Unknown unit size " + line);
            }
        }
        else if (line.startsWith("$$")){
            line = line.replace(/^\$\$/,";");
            write(line);
        }
        else if (line.startsWith(this.non_def)){
            write("not defined:" + line);
        }
        else if (line.startWith(this.comments)){
            if (line.startsWith("LOADTL/") || line.startWith("SELECTL/")){
                let tooln = line.split("/")[1].trim();
                write(";Magazine slot number: " + tool_slot);
            }
            else if (line.startsWith("CUTTER/")){
                if (line.split(" ").length < 3){
                    let cutter = line.split("/")[1].trim();
                    write(";Tool cutter radius: " + r_cuter + this.ls_units_word);
                }
                else if (line.split(" ").length >=3){
                    let cutter = line.split("/")[1].trim();
                    write("Tool cutter radius: " + r_cuter + this.ls_units_word);
                }
            }
            else if (line.startsWith("INTOL/")){
                let intol = line.split("/")[1].trim();
                write(";Inside tolerance from the path: " + intol + this.ls_units_word);
            }
            else if (line.startsWith("OUTOL/")){
                let outtol = line.split("/")[1].trim();
                write(";Outside tolerance from the path: "+ outtol + this.ls_units_word);
            }
            else if (line.startsWith("TOLER/")){
                let toler = line.split("/")[1].trim();
                write(";Tolerance from the path: " + toler + this.ls_units_word);
            }
            else if (line.startsWith("FINI") || line.startsWith("END")){
                write(";End of program")
            }
            else if (line.startsWith("PARTNO")){
                let line = line.replace(/^PARTNO/, ";Part number: ");
                write(line);
            }
            else if (line.startsWith("OPERATION NAME")){
                let line = line.replace(/^OPERATION NAME/, ";").replace(/^:/, "");
                write(line);
            }
            else if (line.startsWith("TLAXIS")){
                let elements = line.split(" ");
                write(";Tool axies are I" + elements[1].trim() + " J" + elements[2].trim() + " K" + elements[3].trim());
            }
            else {
                write(";" + line);
            }
        }
        else if (line.startWith("AUTOPS")){
            this.autops = 1;
        }
        else if (line.includes("CIRCLE") && self.lsautops === 1){
            let elements = line.split(/[,\/()]+/).filter(Boolean);
            let centar_x = +elements[3];
            let centar_y = +elements[4];
            let centar_z = +elements[5];
            let centar2_x = +elements[9];
            let centar2_y = +elements[10];
            let centar2_z = +elements[11];
            let kraj_x = +elements[12];
            let kraj_x = +elements[13];
            let kraj_x = +elements[14];

            if (this.lsplane === "0"){
                if (Math.abs(centar_x - kraj_x) <= this.tolr_coord && Math.abs(centar_x - this.ls_x) <= this.tolr_coord){
                    this.lsplane = "G19";
                }
                else if (Math.abs(centar_y - kraj_y) <= this.tolr_coord && Math.abs(centar_y - this.ls_y) <= this.tolr_coord){
                    this.lsplane = "G18";
                }
                else if (Math.abs(centar_z - kraj_z) <= this.tolr_coord && Math.abs(centar_z - this.ls_z) <= this.tolr_coord){
                    this.lsplane = "G17";
                }
                else {
                    write("ERROR CHANGE OF ALL 3 COORDINATES RE-DO THE APT OUTPUT " + line);
                }
                write(this.lsplane);
            }
            let kraj_x = +kraj_x.toFixed(this.rnd_num);
            let kraj_y = +kraj_y.toFixed(this.rnd_num);
            let kraj_z = +kraj_z.toFixed(this.rnd_num);

            if (Math.abs(centar_x - centar2_x) <= this.tolr_coord || Math.abs(centar_y - centar2_y) <= this.tolr_coord || Math.abs(centar_z - centar2_z) <= this.tolr_coord){
                write("; ERROR Circle centers are not matching");
            }

            if (this.lsplane == "G18"){
                let vektor2_x = +this.ls_x - +centar_x;
                let vektor2_z = +this.ls_z - +centar_z;
                let D = +this.ls_i * vektor2_z - vektor2_x * +this.ls_k;
                
                let vektor2_x = +vektor2_x.toFixed(this.rnd_num)
                let vektor2_z = +vektor2_z.toFixed(this.rnd_num)


                if (D<0){
                    let movement = "G2";
                }
                else if (D>0){
                    let movement = "G3"
                }
                else {
                    write("ERROR CIRCLE CENTER IS ON THE CIRCLE TANGENT " + line)
                }

                let koord=(" X" + kraj_x + " Z" + kraj_z + " I" + vektor2_x + " K" + vektor2_z);
            }
            else if (this.lsplane == "G17"){
                let vektor2_x = +this.ls_x - +centar_x;
                let vektor2_y = +this.ls_y - +centar_y;
                let D = +this.ls_i * vektor2_y - vektor2_x * +this.ls_j;
                
                let vektor2_x = +vektor2_x.toFixed(this.rnd_num)
                let vektor2_y = +vektor2_y.toFixed(this.rnd_num)


                if (D<0){
                    let movement = "G2";
                }
                else if (D>0){
                    let movement = "G3"
                }
                else {
                    write("ERROR CIRCLE CENTER IS ON THE CIRCLE TANGENT " + line)
                }

                let koord=(" X" + kraj_x + " Y" + kraj_y + " I" + vektor2_x + " J" + vektor2_y);
            }
            else if (this.lsplane == "G19"){
                let vektor2_y = +this.ls_y - +centar_y;
                let vektor2_z = +this.ls_z - +centar_z;
                let D = +this.ls_j * vektor2_z - vektor2_y * +this.ls_k;
                
                let vektor2_y = +vektor2_y.toFixed(this.rnd_num)
                let vektor2_z = +vektor2_z.toFixed(this.rnd_num)


                if (D<0){
                    let movement = "G2";
                }
                else if (D>0){
                    let movement = "G3"
                }
                else {
                    write("ERROR CIRCLE CENTER IS ON THE CIRCLE TANGENT " + line)
                }

                let koord=(" Y" + kraj_Y + " Z" + kraj_z + " J" + vektor2_Y + " K" + vektor2_z);
            }
            write(movement, koord, this.ls_feed_speed, this.ls_tip_posmak);

            this.ls_x = kraj_x;
            this.ls_y = kraj_y;
            this.ls_z = kraj_z;
            this.lsmovement = movement;
            this.lsautops = 0;
        }
        else if (line.startsWith("GODLTA")){
            let koord_x="";
            let koord_y="";
            let koord_z="";

            if (this.ls_dim_typ !== "G91"){
                write("G91");
                this.ls_dim_typ = "G91";
            }
            let coords = line.split(/[,/]+/)
            if (coords.length === 4){
                let x = +coords[1];
                let y = +coords[2];
                let z = +coords[3];
            }
            else if (coords.length === 2){
                let x = 0;
                let y = 0;
                let z = +coords[1];
            }
            else {
                write("ERROR GODLTA ")
            }
        }
    }
}
{}
||
[]
\
^
console.log("parser end")