import {getSettings, validateSettings} from "./settings.js";
import {MyParseline} from "./parseline-catiav5-apt1.js";
import {OutputFilter} from "output.js";

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("translateButton");
    button.addEventListener("click", translateAPT);});

async function translateAPT(){
    try {
        const settings = getSettings();
        validateSettings(settings);
        const aptText = await loadAPT(settings);
        const commands =splitAPT(aptText);
        const parser = new MyParseline(settings);
        for (const command of commands) {
            parser.parseLine(command);
        }
        const output = parser.getOutput();
        document.getElementById("terminalOutput").textContent =
        output.join("\n");
        const filter = new OutputFilter(settings);
        filter.download(output);
    }
    catch (error) {
        document.getElementById("terminalOutput").textContent=
            error.messagte;
        console.error(error);
    }
}
async function loadAPT(settings) {
    if (settings.file) {
        return await settings.file.text();
    }
    if (settings.demo) {
        const response = await fetch("demo/"+settings.demo);
        if (!response.ok)
            throw new Error("Demo file not found.");
        return await response.text();
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
            command.puch(current);
        }
        current = "";
    }
    return commands;
}

{}
[]