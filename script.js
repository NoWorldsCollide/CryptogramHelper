document.addEventListener('DOMContentLoaded', () => {
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
                inputBox.dataset.char = char;
                inputBox.addEventListener('input', () => updateInputs(char, inputBox.value.toUpperCase()));
                inputs[char].push(inputBox);
            }
        }

        for (let char in inputs) {
            const charBox = document.createElement('div');
            charBox.classList.add('char-box');
            charBox.innerHTML = `<strong>${char}</strong> `;
            inputs[char].forEach(input => charBox.appendChild(input));
            inputArea.appendChild(charBox);
        }
    };

    function updateInputs(char, value) {
        const allInputs = document.querySelectorAll(`[data-char="${char}"]`);
        allInputs.forEach(input => input.value = value);

        // Highlight duplicates
        const usedValues = {};
        document.querySelectorAll('.input-box').forEach(input => {
            const inputValue = input.value;
            if (inputValue) {
                if (usedValues[inputValue]) {
                    usedValues[inputValue].forEach(dupInput => dupInput.classList.add('duplicate'));
                    input.classList.add('duplicate');
                } else {
                    usedValues[inputValue] = [input];
                    input.classList.remove('duplicate');
                }
            } else {
                input.classList.remove('duplicate');
            }
        });
    }
});
