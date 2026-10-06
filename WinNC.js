import {write, checkVector} from "./output.js";
export function compensation_chg(el){
    if(el.length === 6 && el.every((x,i)=> i in el && x !== undefined && x.trim()!=="")){
        write("For correction register nr. "+el[1].trim()+", tool tip quadrant is P"+el[2].trim()+", tool offset values are X"+el[3].trim()+", Y"+el[4].trim()+", Z"+el[5].trim()+", nose radius is "+el[6].trim());
        console.log("**.**For correction register nr. "+el[1].trim()+", tool tip quadrant is P"+el[2].trim()+", tool offset values are X"+el[3].trim()+", Y"+el[4].trim()+", Z"+el[5].trim()+", nose radius is "+el[6].trim());
        return true;
    }
    else{
        return false;
    }
}

export function tlaxis(el){
    let vals;
    if (el.length === 4){
        vals = checkVector(+el[1],+el[2],+el[3]);
        if (!vals[2]){
            return [false, "notSingleVec"];
        }
        else{
            return [true,+el[1],+el[2],+el[3]];
        }
    }
    else{
        return [false, "length"];
    }
}

export function loadtl(el){
    if ((el.length == 3)&&(el[1].trim()!=="")&&(el[2].trim()!=="")){
        write("For tool on slot nr."+el[1].trim()+" the set compensation register is: "+el[2].trim());
        console.log("**.**For tool on slot nr."+el[1].trim()+" the set compensation register is: "+el[2].trim());
        return true;
    }
    else{
        return false;
    }
}

export function selectl(el){
    if (el != "undefined" || el.trim()!== ""){
        writeComment(";"+el);
        return true;
    }
    else{
        return false;
    }
}

export function insideToler(el){
    if (el != "undefined" || el.trim()!== ""){
        writeComment("Inside path tolerance is "+el);
        return true;
    }
    else{
        return false;
    }
}

export function outsideToler(el){
    if (el != "undefined" || el.trim()!== ""){
        writeComment("Outside path tolerance is "+el);
        return true;
    }
    else{
        return false;
    }
}

export function Toler(el){
    if (el != "undefined" || el.trim()!== ""){
        writeComment("Path tolerance is "+el);
        return true;
    }
    else{
        return false;
    }
}

export function programEnd(el){
    if (el){
        write("M30");
        console.log("**.**M30");
        return true;
    }
    else{
        return false;
    }
    
}

export function partno(el){
    if (el != "undefined" || el.trim()!== ""){
        writeComment(el);
        return true;
    }
    else{
        return false;
    }
}

export function tlon(line){
    if (!(line.includes("GOFWD"))){
        return [false];
    }
    else{
        if (line.includes("CIRCLE")){
            D = circle(line);
            return [true, "circle", D];
        }
        else if (line.includes("CYLNDR")){
            D = sinus(line);
            return [true, "sinus", D];
        }
        else{
            return [true, false];
        }
    }
}

export function circle(line){
    line = line.replace(/[()]/g, "");
    elements = line.split(/[,/]/);
    let center_x = +elements[3];
    let center_y = +elements[4];
    let center_z = +elements[5];
}


export function writeComment(el){
    write(";"+el);
    console.log("**.**;"+el)
    return true;
}

TLON,GOFWD/ (CIRCLE/ Xc, Yc, Zc,Rad),ON,(LINE/ Xc, Yc, Zc, Xe, Ye, Ze)
TLON,GOFWD/ CIRCLE/ Xc, Yc, Zc,Rad,ON,LINE/ Xc, Yc, Zc, Xe, Ye, Ze

TLON,GOFWD/ (CIRCLE/ Xc, Yc, Zc,Rad),ON,2,INTOF,(LINE/ Xc, Yc, Zc, Xe, Ye, Ze)