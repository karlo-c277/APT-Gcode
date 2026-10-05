let func;
func = await import("./WinNC.js"); 
export class catiav5_1_0{
    constructor(settings, func){
        this.func = func;
        this.tool_i;
        this.tool_j;
        this.tool_k;
        this.multax;

    }
    parseline(line){
        const {compensation_chg, tlaxis, loadtl} = this.func;

        let D;
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
                    console.log(line);
                }
                else{
                    if (D[1] === "notSingleVec"){
                        write("ERROR with TLAXIS-given vectors indicate multi axial tool axis, which is not supported");
                        write(line);
                        console.error("ERROR with TLAXIS-given vectors indicate multi axial tool axis, which is not supported\n***"+line);
                    }
                    else{
                        write("ERROR with TLAXIS-given vectors aren't complete");
                        write(line);
                        console.error("ERROR with TLAXIS-given vectors aren't complete\n***"+line);  
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
                    console.log("ERROR multi axial work is not supported");
                }
            break;

            case "LOADTL":
                D = loadtl(elements2);
                //loadtl func, i error stuff
        }
    }
}