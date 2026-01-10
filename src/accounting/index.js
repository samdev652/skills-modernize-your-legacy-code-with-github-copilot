/**
 * School Accounting System - Node.js Implementation
 * Modernized from COBOL legacy application
 * 
 * This application maintains the same business logic, data integrity,
 * and menu options as the original COBOL implementation.
 */

const readline = require('readline');

// ============================================================================
// DATA LAYER (equivalent to data.cob - DataProgram)
// ============================================================================

class DataProgram {
    constructor() {
        // STORAGE-BALANCE PIC 9(6)V99 VALUE 1000.00
        this.storageBalance = 1000.00;
    }

    /**
     * READ/WRITE operations for balance management
     * @param {string} operation - 'READ' or 'WRITE'
     * @param {number|null} balance - Balance value for WRITE operation
     * @returns {number} - Current balance for READ operation
     */
    execute(operation, balance = null) {
        if (operation === 'READ') {
            return this.storageBalance;
        } else if (operation === 'WRITE') {
            this.storageBalance = balance;
            return this.storageBalance;
        }
    }
}

// ============================================================================
// BUSINESS LOGIC LAYER (equivalent to operations.cob - Operations)
// ============================================================================

class Operations {
    constructor(dataProgram, rl) {
        this.dataProgram = dataProgram;
        this.rl = rl;
    }

    /**
     * Execute operation based on type
     * @param {string} operationType - 'TOTAL ', 'CREDIT', or 'DEBIT '
     * @returns {Promise<void>}
     */
    async execute(operationType) {
        if (operationType === 'TOTAL ') {
            await this.viewBalance();
        } else if (operationType === 'CREDIT') {
            await this.creditAccount();
        } else if (operationType === 'DEBIT ') {
            await this.debitAccount();
        }
    }

    /**
     * View current balance (READ operation)
     */
    async viewBalance() {
        const finalBalance = this.dataProgram.execute('READ');
        console.log(`Current balance: ${this.formatBalance(finalBalance)}`);
    }

    /**
     * Credit account - add funds
     */
    async creditAccount() {
        const amount = await this.promptForAmount('Enter credit amount: ');
        
        // Read current balance
        let finalBalance = this.dataProgram.execute('READ');
        
        // Add amount to balance
        finalBalance += amount;
        
        // Write updated balance
        this.dataProgram.execute('WRITE', finalBalance);
        
        console.log(`Amount credited. New balance: ${this.formatBalance(finalBalance)}`);
    }

    /**
     * Debit account - withdraw funds with overdraft protection
     */
    async debitAccount() {
        const amount = await this.promptForAmount('Enter debit amount: ');
        
        // Read current balance
        let finalBalance = this.dataProgram.execute('READ');
        
        // Check for sufficient funds (business rule: no negative balances)
        if (finalBalance >= amount) {
            // Subtract amount from balance
            finalBalance -= amount;
            
            // Write updated balance
            this.dataProgram.execute('WRITE', finalBalance);
            
            console.log(`Amount debited. New balance: ${this.formatBalance(finalBalance)}`);
        } else {
            console.log('Insufficient funds for this debit.');
        }
    }

    /**
     * Prompt user for transaction amount
     * @param {string} prompt - Prompt message
     * @returns {Promise<number>} - Amount entered by user
     */
    promptForAmount(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, (input) => {
                const amount = parseFloat(input);
                // Validate and round to 2 decimal places (currency precision)
                const validAmount = isNaN(amount) ? 0 : Math.round(amount * 100) / 100;
                resolve(validAmount);
            });
        });
    }

    /**
     * Format balance for display (PIC 9(6)V99 format)
     * @param {number} balance - Balance amount
     * @returns {string} - Formatted balance string
     */
    formatBalance(balance) {
        // Format to match COBOL output: 6 digits before decimal, 2 after
        return balance.toFixed(2).padStart(9, '0');
    }
}

// ============================================================================
// PRESENTATION LAYER (equivalent to main.cob - MainProgram)
// ============================================================================

class MainProgram {
    constructor() {
        this.continueFlag = 'YES';
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.dataProgram = new DataProgram();
        this.operations = new Operations(this.dataProgram, this.rl);
    }

    /**
     * Display main menu
     */
    displayMenu() {
        console.log('--------------------------------');
        console.log('Account Management System');
        console.log('1. View Balance');
        console.log('2. Credit Account');
        console.log('3. Debit Account');
        console.log('4. Exit');
        console.log('--------------------------------');
    }

    /**
     * Prompt for user choice
     * @returns {Promise<string>} - User's menu choice
     */
    getUserChoice() {
        return new Promise((resolve) => {
            this.rl.question('Enter your choice (1-4): ', (answer) => {
                resolve(answer.trim());
            });
        });
    }

    /**
     * Process user's menu choice
     * @param {string} userChoice - User's selected option
     */
    async evaluateChoice(userChoice) {
        switch (userChoice) {
            case '1':
                await this.operations.execute('TOTAL ');
                break;
            case '2':
                await this.operations.execute('CREDIT');
                break;
            case '3':
                await this.operations.execute('DEBIT ');
                break;
            case '4':
                this.continueFlag = 'NO';
                break;
            default:
                console.log('Invalid choice, please select 1-4.');
                break;
        }
    }

    /**
     * Main program loop
     */
    async run() {
        while (this.continueFlag === 'YES') {
            this.displayMenu();
            const userChoice = await this.getUserChoice();
            await this.evaluateChoice(userChoice);
        }
        
        console.log('Exiting the program. Goodbye!');
        this.rl.close();
    }
}

// ============================================================================
// PROGRAM ENTRY POINT
// ============================================================================

// Export classes for testing
module.exports = { DataProgram, Operations, MainProgram };

// Start the application only if this file is run directly (not imported for testing)
if (require.main === module) {
    const app = new MainProgram();
    app.run().catch((error) => {
        console.error('An error occurred:', error);
        process.exit(1);
    });
}
