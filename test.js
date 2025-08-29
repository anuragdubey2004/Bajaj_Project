// Test file to verify API functionality
const testCases = [
    {
        name: "Example A",
        input: ["a","1","334","4","R", "$"],
        expected: {
            odd_numbers: ["1"],
            even_numbers: ["334","4"],
            alphabets: ["A","R"],
            special_characters: ["$"],
            sum: "339"
        }
    },
    {
        name: "Example B", 
        input: ["2","a", "y", "4", "&", "-", "*", "5","92","b"],
        expected: {
            odd_numbers: ["5"],
            even_numbers: ["2","4","92"],
            alphabets: ["A", "Y", "B"],
            special_characters: ["&", "-", "*"],
            sum: "103"
        }
    },
    {
        name: "Example C",
        input: ["A","ABcD","DOE"],
        expected: {
            odd_numbers: [],
            even_numbers: [],
            alphabets: ["A","ABCD","DOE"],
            special_characters: [],
            sum: "0"
        }
    }
];

// Mock the processing logic for testing
function processData(data) {
    const oddNumbers = [];
    const evenNumbers = [];
    const alphabets = [];
    const specialCharacters = [];
    let sum = 0;

    function isAlpha(char) {
        return /^[A-Za-z]$/.test(char);
    }

    function isNumeric(char) {
        return /^[0-9]$/.test(char);
    }

    function processAlphabetsConcat(alphabets) {
        const allChars = [];
        
        alphabets.forEach(item => {
            for (let char of item) {
                if (isAlpha(char)) {
                    allChars.push(char.toLowerCase());
                }
            }
        });
        
        allChars.reverse();
        
        let result = '';
        for (let i = 0; i < allChars.length; i++) {
            if (i % 2 === 0) {
                result += allChars[i].toLowerCase();
            } else {
                result += allChars[i].toUpperCase();
            }
        }
        
        return result;
    }

    data.forEach(item => {
        const itemStr = String(item);
        
        if (isNumeric(itemStr) || (itemStr.length > 1 && /^-?\d+$/.test(itemStr))) {
            const num = parseInt(itemStr);
            sum += num;
            
            if (num % 2 === 0) {
                evenNumbers.push(itemStr);
            } else {
                oddNumbers.push(itemStr);
            }
        }
        else if (/^[A-Za-z]+$/.test(itemStr)) {
            alphabets.push(itemStr.toUpperCase());
        }
        else if (itemStr.length === 1) {
            if (isAlpha(itemStr)) {
                alphabets.push(itemStr.toUpperCase());
            } else if (isNumeric(itemStr)) {
                const num = parseInt(itemStr);
                sum += num;
                
                if (num % 2 === 0) {
                    evenNumbers.push(itemStr);
                } else {
                    oddNumbers.push(itemStr);
                }
            } else {
                specialCharacters.push(itemStr);
            }
        }
        else {
            for (let char of itemStr) {
                if (isNumeric(char)) {
                    const num = parseInt(char);
                    sum += num;
                    
                    if (num % 2 === 0) {
                        evenNumbers.push(char);
                    } else {
                        oddNumbers.push(char);
                    }
                } else if (isAlpha(char)) {
                    alphabets.push(char.toUpperCase());
                } else {
                    specialCharacters.push(char);
                }
            }
        }
    });

    return {
        odd_numbers: oddNumbers,
        even_numbers: evenNumbers,
        alphabets: alphabets,
        special_characters: specialCharacters,
        sum: String(sum),
        concat_string: processAlphabetsConcat(alphabets)
    };
}

// Run tests
testCases.forEach((testCase, index) => {
    console.log(`\n--- Test Case ${index + 1}: ${testCase.name} ---`);
    console.log("Input:", testCase.input);
    
    const result = processData(testCase.input);
    
    console.log("Output:");
    console.log("  Odd numbers:", result.odd_numbers);
    console.log("  Even numbers:", result.even_numbers);
    console.log("  Alphabets:", result.alphabets);
    console.log("  Special characters:", result.special_characters);
    console.log("  Sum:", result.sum);
    console.log("  Concat string:", result.concat_string);
    
    console.log("Expected concat for", testCase.name, ":", 
        testCase.name === "Example A" ? "Ra" : 
        testCase.name === "Example B" ? "ByA" : "EoDdCbAa");
});

console.log("\n✅ Test completed! Check the outputs above.");
console.log("\n🚀 To run the server:");
console.log("1. npm install");
console.log("2. npm start");
console.log("3. Test with: curl -X POST http://localhost:3000/bfhl -H \"Content-Type: application/json\" -d '{\"data\": [\"a\",\"1\",\"334\",\"4\",\"R\",\"$\"]}'");