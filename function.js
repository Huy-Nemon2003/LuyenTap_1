

// const alphabet = (() => {
//   let result = '';
//   for (let i = 65; i <= 90; i++) {
//     result += String.fromCharCode(i); // 65 -> 'A', 90 -> 'Z'
//   }
//   return result;
// })();

const alphabet = (() => {
        let vietnameseChars = [];
        for (let i = 0x0021; i <= 0xFFFF; i++) {
            let char = String.fromCharCode(i);
            if (/^[\u00C0-\u00FF\u0102\u0110\u0128\u0130\u20AB\u00A7\u00AB\u00BB\u0152\u0168\u01A0\u01AF\u2013\u2026\u201c\u201d\u0129\u1EA0-\u1EFFa-zA-Z0-9,.!()?\"'+=;:{}$%&#<>@_\-\s]$/.test(char))
            {
                if ( !/^[\u2000-\u200A\u00A0\u2028\u2029\u202F\u205F\u3000\uFEFF\u1eff\u00c4\u00c6\u00c7\u00cb\u00eb\u00ce\u00cf\u00d1\u00d6\u00d8\u00db\u00dc\u00de\u00ee\u00df\u00e4\u00e5\u00e6\u00e7\u00f0\u00f1\u00f6\u00f8\u00fb\u00fc\u00fe\u00ff\u0152\u1efa\u00EF\u1efb\u1efc\u1efd\u1efe]$/.test(char))
                    {
                        vietnameseChars.push(char);
                    }
                }
            }
            vietnameseChars.splice(5, 0, '\u0020');
            vietnameseChars.splice(10, 0, '\u0009');
            return vietnameseChars.join('');
        })();

        // function checkCharacterCount() {
        //     let input = document.getElementById("keyText").value;
        //     document.getElementById("charCount").textContent = "Số ký tự: " + input.length;
        // }

        function generateUniqueNumbers() {
            let numbers = shuffleArray([1, 2, 3, 4, 5, 6]);
            document.getElementById("key").value  = numbers;
        }

        function shuffleArray(arr, index = arr.length - 1) {
            if (index === 0)
                return arr.join('');
            let j = Math.floor(Math.random() * (index + 1));
            [arr[index], arr[j]] = [arr[j], arr[index]];
            return shuffleArray(arr, index - 1);
        }

        function generateRandomKey() {
            let characters = alphabet.split("");
            for (let i = characters.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [characters[i], characters[j]] = [characters[j], characters[i]];
            }
            const resultKey = characters.join("");
            document.getElementById("keyText").value  = resultKey;
            displayAlphabet(alphabet);
            displayRandomKey(characters.join(''));
        }

        function displayAlphabet(alphabet) {
            const alphabetDiv = document.getElementById("alphabet");
            alphabetDiv.innerHTML = '';
            alphabet.split('').forEach(letter => {
                let letterDiv = document.createElement("div");
                letterDiv.classList.add("letter");
                letterDiv.textContent = letter;
                alphabetDiv.appendChild(letterDiv);
            });
        }

        function displayRandomKey(key) {
            const randomKeyDiv = document.getElementById("randomKey");
            randomKeyDiv.innerHTML = '';
            key.split('').forEach(letter => {
                let letterDiv = document.createElement("div");
                letterDiv.classList.add("letter");
                letterDiv.textContent = letter;
                randomKeyDiv.appendChild(letterDiv);
            });
        }

        function completeKey(key) {
            // key = key.toUpperCase();
            let used = new Set(key.split(""));
            let remaining = alphabet.split("").filter(char => !used.has(char));
            return key + remaining.join("");
        }


        function generateKeyMapping(key) {
            let alphabetArray = alphabet.split("");
            let fullKey = completeKey(key);
            // displayRandomKey(fullKey);
            // displayAlphabet(alphabet);
            let pairs = alphabetArray.map((char, i) => ({ char, key: fullKey[i] }));
            pairs.sort((a, b) => a.char.localeCompare(b.char));
            return function findKey(char) {
                let left = 0, right = pairs.length - 1;
                while (left <= right) {
                    let mid = Math.floor((left + right) / 2);
                    let cmp = pairs[mid].char.localeCompare(char);
                    if (cmp === 0)
                        return pairs[mid].key;
                    if (cmp < 0) {
                        left = mid + 1;
                    } else {
                        right = mid - 1;
                    }
                }
                return null;
            };
        }

        function generateReverseKeyMapping(key) {
            let alphabetArray = alphabet.split("");
            const fullKey = completeKey(key);
            let keyArray = fullKey.split("");
            let pairs = keyArray.map((k, i) => ({ key: k, char: alphabetArray[i] }));
            pairs.sort((a, b) => a.key.localeCompare(b.key));
            return function findOriginal(char) {
                let left = 0, right = pairs.length - 1;
                while (left <= right) {
                    let mid = Math.floor((left + right) / 2);
                    let cmp = pairs[mid].key.localeCompare(char);
                    if (cmp === 0) return pairs[mid].char;
                    if (cmp < 0) {
                        left = mid + 1;
                    } else {
                        right = mid - 1;
                    }
                }
                return null;
            };
        }


        function monoalphabeticEncryptSpaces(plaintext, key) {
            let findKey = generateKeyMapping(key);
            let ciphertext = "";
            for (let char of plaintext) {
                let encryptedChar = findKey(char);
                ciphertext += encryptedChar ? encryptedChar : char;
                
            }
            return ciphertext;
        }

        function monoalphabeticDecryptSpaces(ciphertext, key) {
            let findOriginal = generateReverseKeyMapping(key);
            let plaintext = "";

            for (let char of ciphertext) {
                let DecryptedChar = findOriginal(char);
                plaintext += DecryptedChar ? DecryptedChar : char;
                // plaintext += DecryptedChar;
            }

            return plaintext;
        }

        function rowEncryptWithSpaces(text, key) {
            let rows = Math.ceil(text.length / key.length);
            let matrix = Array.from({ length: rows }, () => Array(key.length).fill(" "));
            let index = 0;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < key.length; j++) {
                    if (index < text.length)
                        matrix[i][j] = text[index++];
                }
            }
            key = key.split("").map((c, i) => ({ c, i })).sort((a, b) => a.c.localeCompare(b.c));
            return key.map(k => matrix.map(row => row[k.i]).join("")).join("");
        }

        function rowDecryptWithSpaces(text, key) {
            let rows = Math.ceil(text.length / key.length);
            let matrix = Array.from({ length: rows }, () => Array(key.length).fill(" "));

            key = key.split("").map((c, i) => ({ c, i })).sort((a, b) => a.c.localeCompare(b.c));

            let index = 0;
            key.forEach(k => {
                for (let i = 0; i < rows; i++) {
                    if (index < text.length)
                        matrix[i][k.i] = text[index++];
                }
            });

            return matrix.map(row => row.join("")).join("");
        }

        function monoalphabeticEncrypt() {
            let text = document.getElementById("inputText").value;
            let keytext = document.getElementById("keyText").value;
            const kq = monoalphabeticEncryptSpaces(text, keytext);
            document.getElementById("output").value = kq;
        }

        function monoalphabeticDecrypt() {
            let text = document.getElementById("inputText").value;
            let keytext = document.getElementById("keyText").value;
            const kq = monoalphabeticDecryptSpaces(text,keytext);
            document.getElementById("output").value = kq;
        }


        function encryptRow() {
            let text = document.getElementById("inputText").value;
            let key = document.getElementById("key").value;
            if (!key || isNaN(key)) {
                alert("Vui lòng nhập khóa hợp lệ (chỉ chứa số)!");
                return;
            }
            let encrypted = encryptRowCipherWithNewlines(key, text);
            document.getElementById("output").value = encrypted;
        }

        function encryptRowCipherWithNewlines(key, text) {
            let lines = text.split("\n");
            let encryptedLines = lines.map(line => rowEncryptWithSpaces(line, key));
            return encryptedLines.join("\n");
        }

        function decryptRow() {
            let text = document.getElementById("inputText").value;
            let key = document.getElementById("key").value;
            if (!key || isNaN(key)) {
                alert("Vui lòng nhập khóa hợp lệ (chỉ chứa số)!");
                return;
            }
            // text = chuyendoi(text);
            let decrypted = decryptRowCipherWithNewlines(key, text);

            document.getElementById("output").value = decrypted;

        }

        function decryptRowCipherWithNewlines(key, text) {
            let lines = text.split("\n");
            let decryptedLines = lines.map(line => rowDecryptWithSpaces(line, key));
            return decryptedLines.join("\n");
        }
        

        function hybridEncrypt(text, key, keytext) {
            // Mã hóa Hàng trước
            let rowEncrypted = encryptRowCipherWithNewlines(key, text);

            // Sau đó mã hóa monoal
            return monoalphabeticEncryptSpaces(rowEncrypted,keytext);
        }

        function hybridDecrypt(text, key, keytext) {
            // Giải mã monoal trước
            let monoalDecrypted = monoalphabeticDecryptSpaces(text, keytext);

            // Sau đó giải mã Hàng
            return decryptRowCipherWithNewlines(key,monoalDecrypted);
        }

    function encryptHybrid() {
        let text = document.getElementById("inputText").value;
        let keytext = document.getElementById("keyText").value;
        let key = document.getElementById("key").value;
        if (!key || isNaN(key)) {
            alert("Vui lòng nhập khóa hợp lệ (chỉ chứa số)!");
            return;
        }
        document.getElementById("output").value = hybridEncrypt(text, key, keytext);
    }

    function decryptHybrid() {
        let text = document.getElementById("inputText").value;
        let keytext = document.getElementById("keyText").value;
        let key = document.getElementById("key").value;
        if (!key || isNaN(key)) {
            alert("Vui lòng nhập khóa hợp lệ (chỉ chứa số)!");
            return;
        }
        document.getElementById("output").value = hybridDecrypt(text, key, keytext);
    }


    document.getElementById('fileInput').addEventListener('change', function(event) {
        const fileInput = event.target;
        const file = fileInput.files[0];

        if (!file) {
            alert("Vui lòng chọn một file!");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('inputText').value = e.target.result;
            fileInput.value = "";
        };
        reader.readAsText(file);
    });

    function exportToFile() {
        const content = document.getElementById("output").value;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "KetQua.txt";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }


        function toggleDisplay() {
            const div1 = document.getElementById("info");
            div1.style.display = "block";

            const div2 = document.getElementById("matma");
            div2.style.display = "none";
        }
        function BackDisplay() {

            const div1 = document.getElementById("matma");
            div1.style.display = "block";

            const div2 = document.getElementById("info");
            div2.style.display = "none";
        }

        function exitPage() {
            window.close();
        }

        function clearText() {
            var textarea = document.getElementById("inputText");
            textarea.value = "";
        }

        function copyToClipboard() {
            const text = document.getElementById("output").value;
            
            navigator.clipboard.writeText(text).then(() => {
                const alertBox = document.getElementById("copyAlert");
                alertBox.style.opacity = "1";

                
                setTimeout(() => {
                    alertBox.style.opacity = "0";
                }, 1500);
            }).catch(err => {
                console.error("Lỗi khi sao chép: ", err);
            });
        }