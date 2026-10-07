import {write, checkVector, getPlane, findDirection} from "./output.js";
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

export function tlon(line, start_x, start_y, start_z, tan_x, tan_y, tan_z){
    if (!(line.includes("GOFWD"))){
        return [false];
    }
    else{
        if (line.includes("CIRCLE")){
            D = circle(line,start_x, start_y, start_z, tan_x, tan_y, tan_z);
            return [true, "circle", D];
        }
        else if (line.includes("CYLNDR")){
            D = sinus(line,start_x, start_y, start_z, tan_x, tan_y, tan_z);
            return [true, "sinus", D];
        }
        else{
            return [true, false];
        }
    }
}

export function circle(line, start_x, start_y, start_z, tan_x, tan_y, tan_z){
    line = line.replace(/[()]/g, "");
    let elements = line.split(/[,/]/);

    if (elements.includes("INTOF")){
        ["ON", "INTOF"].forEach(r => {
        const i = elements.indexOf(r);
        if (i !== -1) elements.splice(i, 1);
        });
    }


    let center_x = +elements[3];
    let center_y = +elements[4];
    let center_z = +elements[5];
    let end_x = +elements[12];
    let end_y = +elements[13];
    let end_z = +elements[14];
    let direction;
    let D;
    let report_data;
    let report_data2;

    D = getPlane(
        ["cor",center_x,center_y,center_z],
        ["cor",end_x,end_y,end_z],
        ["cor",start_x,start_y,start_z],
        ["vec",tan_x,tan_y,tan_z]
    );
    if (D === null){
        write("ERROR with plane definition not enough data to define a plane, check console log");
        console.error("ERROR with plane definition not enough data to define a plane, this are the given inputs",{
        center:     ["cor",center_x,center_y,center_z],
        end:        ["cor",end_x,end_y,end_z],
        start:      ["cor",start_x,start_y,start_z],
        tangent:    ["vec",tan_x,tan_y,tan_z]}
        );
        return false;
    }
    else if (!D){
        write("ERROR with plane definition, check console log");
        console.error("ERROR with plane definition, this are the given inputs",{
        center:     ["cor",center_x,center_y,center_z],
        end:        ["cor",end_x,end_y,end_z],
        start:      ["cor",start_x,start_y,start_z],
        tangent:    ["vec",tan_x,tan_y,tan_z]}
        );
        return false
    }
    else{
        switch (D.trim()){
            case "xy":
                write("G17");
                direction =findDirection(tan_x,start_x,center_x,tan_y,start_y,center_y);
                report_data = [tan_x,start_x,center_x,tan_y,start_y,center_y];
                report_data2 ="tan_x,start_x,center_x,tan_y,start_y,center_y";
            break;
            case "xz":
                write("G18");
                direction =findDirection(tan_z,start_z,center_z,tan_x,start_x,center_x);
                report_data = [tan_z,start_z,center_z,tan_x,start_x,center_x];
                report_data2 ="tan_z,start_z,center_z,tan_x,start_x,center_x";
            break;
            case "yz":
                write("G19");
                direction =findDirection(tan_y,start_y,center_y,tan_z,start_z,center_z);
                report_data = [tan_y,start_y,center_y,tan_z,start_z,center_z];
                report_data2 ="tan_y,start_y,center_y,tan_z,start_z,center_z";
            break;
        }
    

        if (!direction){
            write("ERROR with direction definition check console log"+ report_data+"\n"+report_data2);
            console.error("ERROR with direction definition check this is the given data: "+ report_data+"\n"+report_data2);
            return [false];
        }
        else if (direction === "cw"){
            write("G2 X"+end_x+" Y"+end_y+" Z"+end_z+" I=AC("+center_x+") J=AC("+center_y+") K=AC("+center_z+")");
            return [true,[end_x,end_y,end_z]];
        }
        else{
            write("G3 X"+end_x+" Y"+end_y+" Z"+end_z+" I=AC("+center_x+") J=AC("+center_y+") K=AC("+center_z+")");
            return [true,[end_x,end_y,end_z]];
        }
    }
}


export function writeComment(el){
    write(";"+el);
    console.log("**.**;"+el)
    return true;
}

TLON,GOFWD/ (CIRCLE/ Xc, Yc, Zc,Rad),ON,(LINE/ Xc, Yc, Zc, Xe, Ye, Ze)
TLON,GOFWD/ CIRCLE/ Xc, Yc, Zc,Rad,ON,LINE/ Xc, Yc, Zc, Xe, Ye, Ze

TLON,GOFWD/ (CIRCLE/ Xc, Yc, Zc,Rad),ON,2,INTOF,(LINE/ Xc, Yc, Zc, Xe, Ye, Ze)
TLON,GOFWD/ CIRCLE/ Xc, Yc, Zc,Rad,2,LINE/ Xc, Yc, Zc, Xe, Ye, Ze
