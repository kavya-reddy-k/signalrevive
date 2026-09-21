let originalBits = "";
let encodedBits = "";
let corruptedBits = "";

function textToBinary(text) {
    let binary = "";

    for (let i = 0; i < text.length; i++) {
        binary += text.charCodeAt(i).toString(2).padStart(8, "0");
    }

    return binary;
}


// Hamming(12,8) Encoding
function hammingEncode(data) {

    let h = new Array(13).fill(0);

    // Put data bits
    h[3] = Number(data[0]);
    h[5] = Number(data[1]);
    h[6] = Number(data[2]);
    h[7] = Number(data[3]);
    h[9] = Number(data[4]);
    h[10] = Number(data[5]);
    h[11] = Number(data[6]);
    h[12] = Number(data[7]);

    // Calculate parity bits
    h[1] = h[3] ^ h[5] ^ h[7] ^ h[9] ^ h[11];
    h[2] = h[3] ^ h[6] ^ h[7] ^ h[10] ^ h[11];
    h[4] = h[5] ^ h[6] ^ h[7] ^ h[12];
    h[8] = h[9] ^ h[10] ^ h[11] ^ h[12];

    return h.slice(1).join("");
}


// Encode complete message
function encodeMessage() {

    let message = document.getElementById("message").value;

    if (message === "") {
        alert("Please enter a message!");
        return;
    }

    originalBits = textToBinary(message);

    encodedBits = "";

    // Encode every 8 bits
    for (let i = 0; i < originalBits.length; i += 8) {

        let byte = originalBits.substring(i, i + 8);

        encodedBits += hammingEncode(byte);
    }

    // Create corrupted data
    let corrupted = encodedBits.split("");

    // Change one bit
    let errorPosition = 5;

    corrupted[errorPosition] =
        corrupted[errorPosition] === "0" ? "1" : "0";

    corruptedBits = corrupted.join("");

    document.getElementById("original").innerText =
        originalBits;

    document.getElementById("encoded").innerText =
        encodedBits;

    document.getElementById("corrupted").innerText =
        corruptedBits;

    document.getElementById("errorPosition").innerText =
        "Error introduced at position: " + (errorPosition + 1);

    document.getElementById("status").innerText =
        "⚠️ One bit was corrupted during transmission.";

    document.getElementById("recovered").innerText =
        "---";
}


// Hamming Error Detection and Correction
function detectError() {

    if (corruptedBits === "") {
        alert("Please encode a message first!");
        return;
    }

    let received = corruptedBits.split("");

    // Convert position to 1-based position
    let p1 = 0;
    let p2 = 0;
    let p4 = 0;
    let p8 = 0;

    // Check parity groups
    for (let i = 1; i <= 12; i++) {

        let bit = Number(received[i - 1]);

        if (i & 1) {
            p1 ^= bit;
        }

        if (i & 2) {
            p2 ^= bit;
        }

        if (i & 4) {
            p4 ^= bit;
        }

        if (i & 8) {
            p8 ^= bit;
        }
    }

    let errorPosition = p1 + (p2 * 2) + (p4 * 4) + (p8 * 8);

    if (errorPosition === 0) {

        document.getElementById("status").innerText =
            "✓ No error detected.";

        return;
    }

    // Correct the error
    received[errorPosition - 1] =
        received[errorPosition - 1] === "0" ? "1" : "0";

    let corrected = received.join("");

    // Extract original data bits
    let recoveredBits = "";

    for (let i = 0; i < corrected.length; i += 12) {

        let block = corrected.substring(i, i + 12);

        recoveredBits +=
            block[2] +
            block[4] +
            block[5] +
            block[6] +
            block[8] +
            block[9] +
            block[10] +
            block[11];
    }

    document.getElementById("errorPosition").innerText =
        "✓ Error detected at Hamming position: " + errorPosition;

    document.getElementById("recovered").innerText =
        recoveredBits;
        let recoveredMessage = "";

for (let i = 0; i < recoveredBits.length; i += 8) {

    let byte = recoveredBits.substring(i, i + 8);

    if (byte.length === 8) {
        recoveredMessage +=
            String.fromCharCode(parseInt(byte, 2));
    }
}

document.getElementById("recoveredMessage").innerText =
    recoveredMessage + " ✓";

    document.getElementById("status").innerText =
        "✓ Error detected and corrected successfully!";
}