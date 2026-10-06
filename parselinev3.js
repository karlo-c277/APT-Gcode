let func;
func = await import("./WinNC.js"); 
export class catiav5_1_0{
    constructor(settings, func){
        this.func = func;
        this.tool_i;
        this.tool_j;
        this.tool_k;
        this.multax;
        this.autops = false;

    }
    parseline(line){
        const {
            compensation_chg,   tlaxis,         loadtl,     writeComment,   selectl,
            insideToler,        outsideToler,   Toler,      programEnd,     partno,
            tlon
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
                    write("ERROR with compensation-compensation_chg ***"+ line+"\nElements: "+elements2);
                    console.error("ERROR with compensation compensation_chg \n***"+ line);
                    console.error("Elements: "+elements2);
                }                
            break;
            
            case "TLAXIS":
                D = tlaxis(elements2);
                if (D[0]){
                    this.tool_i = D[1];
                    this.tool_j = D[2];
                    this.tool_k = D[3];
                    this.multax = false;
                    console.log("***"+line);
                }
                else{
                    if (D[1] === "notSingleVec"){
                        write("ERROR with TLAXIS-given vectors indicate multi axial tool axis, which is not supported");
                        write(line);
                        console.error("ERROR with TLAXIS-given vectors indicate multi axial tool axis, which is not supported\n*"+line);
                    }
                    else{
                        write("ERROR with TLAXIS-given vectors aren't complete");
                        write(line);
                        console.error("ERROR with TLAXIS-given vectors aren't complete\n*"+line);
                        console.log(elements2);
                    }
                }
            break;

            case "MULTAX":
                if (line.includes("OFF")){
                    this.multax = false;
                }
                else {
                    this.multax = true;
                    write("ERROR multi axial work is not supported");
                    console.error("ERROR multi axial work is not supported");
                }
            break;

            case "LOADTL":
                D = loadtl(elements2);
                if (D) {
                    console.log("***"+line);
                }
                else{
                    write( "ERROR with LOADTL, check for empty elements or incomplete elements\n*"+line);
                    console.error("ERROR with LOADTL, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "SELECTL":
                D = line.split("/")[1].trim();
                selectl(D);
                if (D) {
                    console.log("***"+line);
                }
                else{
                    write( "ERROR with SELECTL, check for empty elements or incomplete elements\n*"+line);
                    console.error("ERROR with SELECTL, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "INTOL":
                D = insideToler(elements2[1].trim());
                if (D) {
                    console.log("***"+line);
                }
                else{
                    write( "ERROR with INTOL, check for empty elements or incomplete elements\n*"+line);
                    console.error("ERROR with INTOL, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "OUTTOL":
                D = outsideToler(elements2[1].trim());
                if (D) {
                    console.log("***"+line);
                }
                else{
                    write( "ERROR with OUTTOL, check for empty elements or incomplete elements\n*"+line);
                    console.error("ERROR with OUTTOL, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "TOLER":
                D = Toler(elements2[1].trim());
                if (D) {
                    console.log("***"+line);
                }
                else{
                    write( "ERROR with TOLER, check for empty elements or incomplete elements\n*"+line);
                    console.error("ERROR with TOLER, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "END":
                D = programEnd(true);
                if (!D){
                    write( "ERROR with END, check for empty elements or incomplete elements\n*"+line);
                    console.error("ERROR with END, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "PARTNO":
                els = line.replace(/^PARTNO/, "Part number: ");
                D =partno(els);
                if (!D){
                    write( "ERROR with PARTNO, check for empty elements or incomplete elements\n*"+line);
                    console.error("ERROR with PARTNO, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "PPRINT":
            case "TPRINT":
            case "TOOLNO":
            case "REWIND":
            case "PARTNO":
            case "OPERATION NAME":
                D = writeComment(line);
                if (!D){
                    write( "ERROR with OPERATION NAME, check for empty elements or incomplete elements\n*"+line);
                    console.error("ERROR with OPERATION NAME, check for empty elements or incomplete elements\n*"+line);
                }
            break;

            case "AUTOPS":
                this.autops = true;
            break;

            case "TLON":
                D = tlon(line);
        }
    }
}