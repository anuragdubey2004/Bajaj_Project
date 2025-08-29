const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


const USER_DETAILS = {
    full_name: "anurag_dubey", 
    birth_date: "22012004", 
    email: "anuragdubey2022@vitbhopal.ac.in",
    roll_number: "22BCE10262" 
};


function isAlpha(char) {
    return /^[A-Za-z]$/.test(char);
}


function isNumeric(char) {
    return /^[0-9]$/.test(char);
}


function isSpecialChar(char) {
    return !isAlpha(char) && !isNumeric(char);
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


app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;
        
    
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input: 'data' must be an array"
            });
        }

        
        const oddNumbers = [];
        const evenNumbers = [];
        const alphabets = [];
        const specialCharacters = [];
        let sum = 0;

        
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
                let hasNumber = false;
                let hasAlpha = false;
                
                for (let char of itemStr) {
                    if (isNumeric(char)) {
                        hasNumber = true;
                        const num = parseInt(char);
                        sum += num;
                        
                        if (num % 2 === 0) {
                            evenNumbers.push(char);
                        } else {
                            oddNumbers.push(char);
                        }
                    } else if (isAlpha(char)) {
                        hasAlpha = true;
                        alphabets.push(char.toUpperCase());
                    } else {
                        specialCharacters.push(char);
                    }
                }
                
                
                if (hasAlpha && !hasNumber && !/[^A-Za-z]/.test(itemStr)) {
                    
                    const charsToRemove = itemStr.split('');
                    charsToRemove.forEach(char => {
                        const index = alphabets.indexOf(char.toUpperCase());
                        if (index > -1) {
                            alphabets.splice(index, 1);
                        }
                    });
                    alphabets.push(itemStr.toUpperCase());
                }
            }
        });

        
        const concatString = processAlphabetsConcat(alphabets);

        
        const user_id = `${USER_DETAILS.full_name}_${USER_DETAILS.birth_date}`;

        
        const response = {
            is_success: true,
            user_id: user_id,
            email: USER_DETAILS.email,
            roll_number: USER_DETAILS.roll_number,
            odd_numbers: oddNumbers,
            even_numbers: evenNumbers,
            alphabets: alphabets,
            special_characters: specialCharacters,
            sum: String(sum),
            concat_string: concatString
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});


app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});


app.get('/', (req, res) => {
    res.json({
        message: "BFHL API is running",
        endpoints: {
            POST: "/bfhl",
            GET: "/bfhl"
        }
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        is_success: false,
        error: "Something went wrong!"
    });
});


app.use('*', (req, res) => {
    res.status(404).json({
        is_success: false,
        error: "Route not found"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;