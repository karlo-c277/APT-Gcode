import { wError,  write} from "./output.js";
let func;
func = await import("./WinNC.js"); 
export class catiav5_1_0{
    constructor(settings, func){
        this.func = func;
        this.tool_axis;
        this.multax;
        this.autops = false;
        this.ls_coord;
        this.ls_circle_tan;
        this.helix_center;
        this.helix_tan;
        this.helix_axis;
        this.helix_info;
        this.helix_end;

    }
    parseline(line){
        const {
            compensation_chg,   tlaxis,         loadtl,     writeComment,   selectl,
            insideToler,        outsideToler,   Toler,      programEnd,     partno,
            tlon,               helix,          godlta
        } = this.func;

        let D;
        let els;
        let elements = line.split(/[,/ ]+/);
        let elements2 = line.split(/[,/:]/);

        switch (elements[0].trim()){
            case "COMPENSATION":
                D = compensation_chg(elements2);
                if (D){
                    console.log(line);
                }
                else{
                    wError("ERROR with compensation compensation_chg \n***"+ line+"\nElements: "+elements2);
                }                
            break;
            
            case "TLAXIS":
                D = tlaxis(elements2);
                if (D[0]){
                    this.tool_axis = [+D[1], +D[2], +D[3]];
                    this.multax = false;
                    console.log("***"+line);
                }
                else{
                    if (D[1] === "notSingleVec"){
                        wError("ERROR with TLAXIS-given vectors indicate multi axial tool axis, which is not supported\n*"+line);
                    }
                    else{
                        wError("ERROR with TLAXIS-given vectors aren't complete\n*"+line+"\n"+elements2);
                    }
                }
            break;

            case "MULTAX":
                if (line.includes("OFF")){
                    this.multax = false;
                }
                else {
                    this.multax = true;
                    wError("ERROR multi axial work is not supported");
                }
            break;

            case "LOADTL":
                D = loadtl(elements2);
                if (D) {
                    console.log("***"+line);
                }
                else{
                    wError("ERROR with LOADTL, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "SELECTL":
                D = line.split("/")[1].trim();
                selectl(D);
                if (D) {
                    console.log("***"+line);
                }
                else{
                    wError("ERROR with SELECTL, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "INTOL":
                D = insideToler(elements2[1].trim());
                if (D) {
                    console.log("***"+line);
                }
                else{
                    wError("ERROR with INTOL, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "OUTTOL":
                D = outsideToler(elements2[1].trim());
                if (D) {
                    console.log("***"+line);
                }
                else{
                    wError("ERROR with OUTTOL, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "TOLER":
                D = Toler(elements2[1].trim());
                if (D) {
                    console.log("***"+line);
                }
                else{
                    wError("ERROR with TOLER, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "END":
                D = programEnd(true);
                if (!D){
                    wError("ERROR with END, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "PARTNO":
                els = line.replace(/^PARTNO/, "Part number: ");
                D =partno(els);
                if (!D){
                    wError("ERROR with PARTNO, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "PPRINT":
            case "TPRINT":
            case "TOOLNO":
            case "REWIND":
            case "PARTNO":
            case "AUTOPS":
            case "OPERATION NAME":
                D = writeComment(line);
                if (!D){
                    wError("ERROR with OPERATION NAME, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "TLON":
                D = tlon(line, ...this.ls_coord, ...this.ls_circle_tan);
                if(!D[0]){
                    wError("ERROR unknown command/error with command recognition-should be a gofwd\n"+line);
                }
                else{
                    if (!D[1]){
                        wError("ERROR unknown command/error with command recognition-should be a circle or a cylind(sinusoide)\n"+line);
                    }
                    else if(D[1]==="circle"){
                        if (!D[2][0]){
                            wError("ERROR with element determination (cw or ccw/plane definition)");
                        }
                        else{
                            this.ls_coord = D[2][1];
                        }
                    }
                }
            break;
            
            case "HELICAL":
                switch (elements[1].trim()){
                    case "CENTER":
                        this.helix_center = [+elements[2],+elements[2],+elements[4]];
                    break;
                    case "TANGENT":
                        this.helix_tan = [+elements[2],+elements[2],+elements[4]];
                    break;
                    case "AXIS":
                        this.helix_axis = [+elements[2],+elements[2],+elements[4]];
                    break;
                    case "INFO":
                        this.helix_info = [+elements[2],+elements[2],+elements[4],+elements[5]];
                    break;
                    case "END":
                        this.helix_end = [+elements[2],+elements[2],+elements[4]];
                        D = helix(this.ls_coord,this.helix_center, this.helix_tan, this.helix_axis, this.helix_info, this.helix_end);
                        if (!D[0]){
                            wError("ERROR with element determination (cw or ccw/plane definition)");
                        }
                        else{
                            this.ls_coord = D[1];
                        }
                    break;
                }
            break;

            case "GODLTA":
                if (elements.length===4){
                    els = [+elements[1],+elements[2],+elements[3]];
                }
                else if (elements.length===2){
                    els = [0,0,+elements[1]];
                }
                else{
                    wError("Invalid godlta syntacs "+line+"\n"+elements+"\n"+els);
                }

                this.ls_coord = coord.map((v, i) => v + abc[i]);
                if (this.cycleon){
                    this.cyc_coord.push(this.ls_coord);
                }
                else{
                    D = godlta(coord, this.rapid, this.ls_dim_typ, this.rapto, this.rapto_num, this.ls_movement);
                    this.rapto = false;
                    this.ls_dim_typ = D[0];
                    this.ls_movement = D[1];
                }

                   


        }
    }
}