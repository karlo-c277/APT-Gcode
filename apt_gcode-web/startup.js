console.log("startup")
import {getSettings, validateSettings} from "./settings.js";
//import {MyParseline} from "./parseline.js";
import {clearOutput, buildOutput, downloadOutput} from "./output.js";
import {catiav5_1_0} from "./parselinev2.js";



document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("translateButton");
    button.addEventListener("click", translateAPT);});

async function translateAPT(){
    clearOutput();
    try {
        
        const settings = getSettings();
        validateSettings(settings);
        const aptText = await loadAPT(settings);
        const commands =splitAPT(aptText);
        const parserType =
        document.getElementById("apt-code-version").value;

        let parser;

        switch (parserType) {
            case "catiav5_1_0":
                parser = new catiav5_1_0(settings);
                break;
            default:
                throw new Error("APT parser not selected");
        }

        for (const command of commands) {
            parser.parseline(command);
        }
        console.log(typeof parser)
        for (const command of commands) {
            parser.parseline(command);
        }
        const result = buildOutput(settings);
        document.getElementById("terminalOutput").textContent = result;
        if (settings.downloadOutput) {
            downloadOutput(result, settings);
        }
    }
    catch (error) {
        document.getElementById("terminalOutput").textContent=
            error.message;
        console.error(error);
    }
}
async function loadAPT(settings) {
    if (settings.file) {
        const buffer = await settings.file.arrayBuffer();
        const decoder = new TextDecoder(settings.inputEncoding);
        return decoder.decode(buffer);
    }
    if (settings.demo) {
        const response = await fetch("demo/"+settings.demo);
        if (!response.ok) {
            throw new Error("Demo file not found.");}
        return await response.text();
        const buffer = await response.arrayBuffer();
        const decoder = new TextDecoder(settings.inputEncoding);
        return decoder.decode(buffer);
    }
    throw new Error("No input file selected.");
}
function splitAPT(text) {
    const commands = [];
    const lines = text.split(/\r?\n/);
    let current = "";
    for (const line of lines) {
        current += line.trim();
        if (current.endsWith("$")){
            current = current.slice(0, -1);
            continue;
        }
        if (current !==""){
            commands.push(current);
        }
        current = "";
    }
    return commands;
}
console.log("startup end")
{}
[]