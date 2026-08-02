

export function generateHeader(settings){
    return settings.output.header.replace("{filename}", settings.output.filename);
}
export function getSettings(){
    const preset = document.getElementById("preset").value;

    let settings = {
        preset: preset,
        file: document.getElementById("costumFilename").files[0],
        demo: document.getElementById("demoSelect").value,
        inputEncoding: "utf-8",
        downloadOutput: document.getElementById("downloadOutputCheck").checked,
        output: {}
    };
    if (preset === "costum"){
        settings.output.filename = document.getElementById("filename").value;
        settings.output.encoding = document.getElementById("enc_output").value;
        settings.output.extension = document.getElementById("extension").value;
        settings.output.header = document.getElementById("output_header").value;

    }
    else if (preset === "WinNC Sinumerik") {
        settings.output.filename = document.getElementById("filename").value;
        settings.output.encoding = "utf-8";
        settings.output.extension = ".mpf";
        settings.output.header = "%_N_{filename}_MPF";
    }
    else if (preset === "ISO6983"){
        settings.output.filename = document.getElementById("filename").value;
        settings.output.encoding = "utf-8";
        settings.output.extension = ".txt";
        settings.output.header = "";
    }
    else if (preset === "Karlov_kod"){
        settings.output.filename = document.getElementById("filename").value;
        settings.output.encoding = "utf-8";
        settings.output.extension = ".txt";
        settings.output.header = "";
    }
    return settings;
}
export function validateSettings(){}
