import {write, checkVector} from "./output.js";
export function compensation_chg(el){
    if(el.length === 6 && el.every((x,i)=> i in el && x !== undefined && x.trim()!=="")){
        write("For correction register nr. "+el[1].trim()+", tool tip quadrant is P"+el[2].trim()+", tool offset values are X"+el[3].trim()+", Y"+el[4].trim()+", Z"+el[5].trim()+", nose radius is "+el[6].trim());
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
        return true;
    }
    else{
        return false;
    }
}