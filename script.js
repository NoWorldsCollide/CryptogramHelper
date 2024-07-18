document.addEventListener('DOMContentLoaded', () => {
    const ctToPtMap = {};
    const ptToCtMap = {};

    window.createInputs = () => {
        const ciphertext = document.getElementById('ciphertext').value.toUpperCase();
        const inputArea = document.getElementById('input-area');
        inputArea.innerHTML = ''; // Clear previous inputs

        const inputs = {};
        for (let i = 0; i < ciphertext.length; i++) {
            const char = ciphertext[i];
            if (char.match(/[A-Z]/)) {
                if (!inputs[char]) {
                    inputs[char] = [];
                }
                const inputBox = document.createElement('input');
                inputBox.setAttribute('maxlength', '1');
                inputBox.classList.add('input-box');
                inputBox.dataset.index = i;
                inputBox.dataset.char = char;
                inputBox.addEventListener('input', (event) => updateInputs(char, event.target.value.toUpperCase()));
                inputs[char].push(inputBox);
            } else {
                const span = document.createElement('span');
                span.textContent = char;
                inputArea.appendChild(span);
            }
        }

        for (let char in inputs) {
            const charBox = document.createElement('div');
            charBox.classList.add('char-box');
            charBox.innerHTML = `<strong>${char}</strong> `;
            inputs[char].forEach(input => charBox.appendChild(input));
            inputArea.appendChild(charBox);
        }

        updateOutput();
    };

    function updateInputs(char, value) {
        const allInputs = document.querySelectorAll(`[data-char="${char}"]`);
        allInputs.forEach(input => input.value = value);

        // Update ctToPtMap and ptToCtMap
        if (value) {
            ctToPtMap[char] = value;
            ptToCtMap[value] = ptToCtMap[value] || new Set();
            ptToCtMap[value].add(char);
        } else {
            delete ctToPtMap[char];
            for (const key in ptToCtMap) {
                ptToCtMap[key].delete(char);
                if (ptToCtMap[key].size === 0) {
                    delete ptToCtMap[key];
                }
            }
        }

        // Highlight duplicates
        const usedValues = {};
        document.querySelectorAll('.input-box').forEach(input => {
            const inputValue = input.value;
            const inputChar = input.dataset.char;
            if (inputValue) {
                if (!usedValues[inputValue]) {
                    usedValues[inputValue] = [];
                }
                usedValues[inputValue].push(input);
            }
        });

        for (const value in usedValues) {
            if (usedValues[value].length > 1) {
                usedValues[value].forEach(input => {
                    if (ptToCtMap[value] && ptToCtMap[value].size > 1) {
                        input.classList.add('duplicate');
                    } else {
                        input.classList.remove('duplicate');
                    }
                });
            } else {
                usedValues[value][0].classList.remove('duplicate');
            }
        }

        updateOutput();
    }

    function updateOutput() {
        const ciphertext = document.getElementById('ciphertext').value.toUpperCase();
        let outputText = '';

        for (let i = 0; i < ciphertext.length; i++) {
            const char = ciphertext[i];
            if (char.match(/[A-Z]/)) {
                outputText += ctToPtMap[char] || '_';
            } else {
                outputText += char;
            }
        }

        document.getElementById('output-text').textContent = outputText;
    }
});
