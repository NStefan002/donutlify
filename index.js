const defaultRadius = 40;
const innerToOuterRatio = 4;
const aspectRatio = 0.5;

/**
 * Calculates the area of a donut.
 *
 * @param {number} radius - Radius of a donut.
 * @returns {number} Donut area.
 */
function calcDonutArea(radius) {
    const outerRadius = radius;
    const innerRadius = radius / innerToOuterRatio;
    const outerArea = Math.PI * Math.pow(outerRadius, 2);
    const innerArea = Math.PI * Math.pow(innerRadius, 2);
    return Math.round(outerArea - innerArea);
}

/**
 * Deteremines the maximum outer radius based on the text length.
 *
 * @param {number} textLen - Length of the input text.
 * @param {boolean} repeatText - Whether to repeat the text.
 * @returns {number} The maximum outer radius.
 */
function determineRadius(textLen, repeatText = false) {
    if (repeatText) {
        return defaultRadius;
    }

    let bestRadius = 0;
    for (let outerRadius = 60; outerRadius >= 7; outerRadius--) {
        const donutArea = calcDonutArea(outerRadius);

        if (donutArea <= textLen) {
            bestRadius = outerRadius;
            break;
        }
    }

    return bestRadius;
}

/**
 * Formats the input text into a donut shape.
 *
 * @param {string} text - The text to be formatted.
 * @param {number} outerRadius - The outer radius of the donut.
 * @param {boolean} repeatText - Whether to repeat the text.
 * @returns {string} The formatted text in a donut shape.
 */
function donutlify(text, outerRadius, repeatText = false) {
    const height = Math.round(outerRadius * 2 * aspectRatio);
    const width = Math.round(outerRadius * 2);
    const innerRadius = outerRadius / innerToOuterRatio;
    const centerX = Math.round(width / 2);
    const centerY = Math.round(height / 2);

    let donut = [];
    let textIdx = 0;
    const textLen = text.length;

    for (let y = 0; y < height; y++) {
        let row = [];
        for (let x = 0; x < width; x++) {
            const dx = x - centerX;
            const dy = (y - centerY) / aspectRatio;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (innerRadius <= distance && distance <= outerRadius) {
                row.push(text[textIdx]);
                textIdx++;

                if (textIdx >= textLen) {
                    if (repeatText) {
                        textIdx = 0;
                    } else {
                        donut.push(row.join(""));
                        return donut.join("\n");
                    }
                }
            } else {
                row.push(" ");
            }
        }
        donut.push(row.join(""));
    }
    return donut.join("\n");
}

document.addEventListener("DOMContentLoaded", () => {
    const modeToggleButton = document.getElementById("mode-toggle");
    const formatButton = document.getElementById("format-button");
    const spinner = document.getElementById("spinner");
    const input = document.getElementById("text-input");
    const output = document.getElementById("output-box");
    const copyButton = document.getElementById("copy-button");
    const radiusInput = document.getElementById("radius-input");
    const repeatInput = document.getElementById("repeat-text-checkbox");

    // Toggle dark mode
    modeToggleButton.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDarkMode = document.body.classList.contains("dark");
        modeToggleButton.textContent = isDarkMode ? "🌙" : "☀️";
    });

    formatButton.addEventListener("click", () => {
        if (!spinner.classList.contains("active")) {
            spinner.classList.add("active");
            output.textContent = "";
            setTimeout(() => {
                spinner.classList.remove("active");

                copyButton.textContent = "Copy to clipboard";

                let radius = radiusInput.value;
                const text = input.value;
                const repeat = repeatInput.checked;

                if (radius === 0) {
                    radius = determineRadius(text.length, repeat);
                }

                if (!repeat && text.length < calcDonutArea(radius)) {
                    copyButton.disabled = true;
                    alert(
                        "Not enough text to generate a donut! Try checking the 'Repeat Text' box."
                    );
                    return;
                }
                const donut = donutlify(text, radius, repeatInput.checked);
                output.textContent = donut;
                copyButton.disabled = false;
            }, 1000);
        }
    });

    copyButton.addEventListener("click", () => {
        const textToCopy = output.textContent;

        // Use the Clipboard API to copy the text
        navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
                copyButton.textContent = "Copied to clipboard!";
                copyButton.disabled = true;
            })
            .catch((err) => {
                alert("Failed to copy text: " + err);
            });
    });
});
