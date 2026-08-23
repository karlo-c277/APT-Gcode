
const presetSelect = document.getElementById("preset");
const costumOptions = document.getElementById("costumOptions");
const costumOutput = document.getElementById("costumOutput");
const downloadCheckbox = document.getElementById("downloadOutputCheck");
const errorBox = document.getElementById("errorBox");
const root = document.documentElement;

function updateCostumPanels() {
    const isCostum = presetSelect.value === "costum";
    const isDownload = downloadCheckbox.checked;

    costumOptions.style.display = "none";
    costumOutput.style.display= "none";

    if (isCostum) {
        costumOptions.style.display = "block";
        if (isDownload) {
            costumOutput.style.display = "block"
        }
    }
};
presetSelect.addEventListener(
    "change", updateCostumPanels
);
downloadCheckbox.addEventListener("change", updateCostumPanels);
updateCostumPanels();

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let targetX = mouseX;
let targetY = mouseX;

document.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
});

function animateMouseEffect() {
    mouseX += (targetX - mouseX) * 0.08;
    mouseY += (targetY - mouseY) * 0.08;

    root.style.setProperty(
        "--mouse-x",
        `${mouseY}px`
    );
    root.style.setProperty(
        "--mouse-y",
        `${mouseY}px`
    );
    requestAnimationFrame(animateMouseEffect);
}
animateMouseEffect();

document.addEventListener("mouseover", (event) => {
    if (event.target.closest("#translateButtton")) {
        root.style.setProperty("--mouse-color", "0, 180, 50");
        return;
    }
    if (event.target.closest("input, select")) {
        root.style.setProperty("--mouse-color", "212, 169, 0");
        return;
    }
    if (event.target.closest(".hiddenPanel")) {
        root.style.setProperty("--mouse-color", "255, 145, 0");
        return;
    }
    if (event.target.closest(".terminal-container")) {
        root.style.setProperty("--mouse-color", "40, 150, 255");
        return;
    }
    root.style.setProperty("--mouse-color", "0, 180, 50");
});