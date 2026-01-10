/**
 * Unit Tests for School Accounting System
 * 
 * These tests mirror the scenarios defined in docs/TESTPLAN.md
 * and validate the business logic from the original COBOL application.
 */

const { DataProgram, Operations } = require('./index.js');

// Mock readline interface for testing
class MockReadline {
    constructor() {
        this.responses = [];
        this.currentIndex = 0;
    }

    setResponses(responses) {
        this.responses = responses;
        this.currentIndex = 0;
    }

    question(prompt, callback) {
        const response = this.responses[this.currentIndex++] || '0';
        callback(response);
    }
}

describe('School Accounting System - Unit Tests', () => {

    // ============================================================================
    // 1. System Initialization and Data Layer Tests
    // ============================================================================

    describe('1. System Initialization and Menu Display', () => {
        
        test('TC-INIT-001: System starts with correct initial balance of $1,000.00', () => {
            const dataProgram = new DataProgram();
            const balance = dataProgram.execute('READ');
            expect(balance).toBe(1000.00);
        });

        test('TC-INIT-001: Verify initial balance displays correctly', () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            const balance = dataProgram.execute('READ');
            const formatted = operations.formatBalance(balance);
            expect(formatted).toBe('001000.00');
        });
    });

    // ============================================================================
    // 2. View Balance Functionality
    // ============================================================================

    describe('2. View Balance Functionality', () => {

        test('TC-BAL-001: View initial balance displays 001000.00', () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            const balance = dataProgram.execute('READ');
            expect(operations.formatBalance(balance)).toBe('001000.00');
        });

        test('TC-BAL-002: View balance after credit shows updated balance', () => {
            const dataProgram = new DataProgram();
            const balance = dataProgram.execute('READ');
            const newBalance = balance + 500.00;
            dataProgram.execute('WRITE', newBalance);
            
            expect(dataProgram.execute('READ')).toBe(1500.00);
        });

        test('TC-BAL-003: View balance after debit shows updated balance', () => {
            const dataProgram = new DataProgram();
            const balance = dataProgram.execute('READ');
            const newBalance = balance - 300.00;
            dataProgram.execute('WRITE', newBalance);
            
            expect(dataProgram.execute('READ')).toBe(700.00);
        });

        test('TC-BAL-004: View balance multiple times shows same value (read-only)', () => {
            const dataProgram = new DataProgram();
            const balance1 = dataProgram.execute('READ');
            const balance2 = dataProgram.execute('READ');
            const balance3 = dataProgram.execute('READ');
            
            expect(balance1).toBe(balance2);
            expect(balance2).toBe(balance3);
            expect(balance1).toBe(1000.00);
        });

        test('TC-BAL-005: Balance does not modify data (read is non-destructive)', () => {
            const dataProgram = new DataProgram();
            dataProgram.execute('READ');
            dataProgram.execute('READ');
            const balance = dataProgram.execute('READ');
            
            expect(balance).toBe(1000.00);
        });
    });

    // ============================================================================
    // 3. Credit Account Functionality
    // ============================================================================

    describe('3. Credit Account Functionality', () => {

        test('TC-CREDIT-001: Credit account with valid amount $500.00', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['500']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.creditAccount();
            expect(dataProgram.execute('READ')).toBe(1500.00);
        });

        test('TC-CREDIT-002: Credit account with small amount (cents only) $0.50', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['0.50']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.creditAccount();
            expect(dataProgram.execute('READ')).toBe(1000.50);
        });

        test('TC-CREDIT-003: Credit account with zero amount', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['0.00']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.creditAccount();
            expect(dataProgram.execute('READ')).toBe(1000.00);
        });

        test('TC-CREDIT-004: Credit account with large amount $99,999.99', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['99999.99']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.creditAccount();
            expect(dataProgram.execute('READ')).toBe(100999.99);
        });

        test('TC-CREDIT-006: Credit amount with two decimal places $123.45', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['123.45']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.creditAccount();
            expect(dataProgram.execute('READ')).toBe(1123.45);
        });

        test('TC-CREDIT-007: Multiple consecutive credits', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['100', '200', '300']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.creditAccount(); // +100
            await operations.creditAccount(); // +200
            await operations.creditAccount(); // +300
            
            expect(dataProgram.execute('READ')).toBe(1600.00);
        });

        test('TC-CREDIT-008: Balance persistence after credit', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['500']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.creditAccount();
            const balance = dataProgram.execute('READ');
            expect(balance).toBe(1500.00);
        });
    });

    // ============================================================================
    // 4. Debit Account Functionality - Success Cases
    // ============================================================================

    describe('4. Debit Account Functionality - Success Cases', () => {

        test('TC-DEBIT-001: Debit account with valid amount (sufficient funds) $500.00', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['500']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.debitAccount();
            expect(dataProgram.execute('READ')).toBe(500.00);
        });

        test('TC-DEBIT-002: Debit exact balance amount $1,000.00', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['1000']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.debitAccount();
            expect(dataProgram.execute('READ')).toBe(0.00);
        });

        test('TC-DEBIT-003: Debit small amount (cents only) $0.50', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['0.50']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.debitAccount();
            expect(dataProgram.execute('READ')).toBe(999.50);
        });

        test('TC-DEBIT-004: Debit zero amount', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['0.00']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.debitAccount();
            expect(dataProgram.execute('READ')).toBe(1000.00);
        });

        test('TC-DEBIT-005: Multiple consecutive debits', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['100', '200', '300']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.debitAccount(); // -100
            await operations.debitAccount(); // -200
            await operations.debitAccount(); // -300
            
            expect(dataProgram.execute('READ')).toBe(400.00);
        });

        test('TC-DEBIT-006: Balance persistence after debit', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['500']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.debitAccount();
            const balance = dataProgram.execute('READ');
            expect(balance).toBe(500.00);
        });

        test('TC-DEBIT-007: Debit with two decimal places $123.45', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['123.45']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.debitAccount();
            expect(dataProgram.execute('READ')).toBe(876.55);
        });
    });

    // ============================================================================
    // 5. Debit Account Functionality - Insufficient Funds
    // ============================================================================

    describe('5. Debit Account Functionality - Insufficient Funds', () => {

        test('TC-DEBIT-ERR-001: Debit exceeds current balance - rejected', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['1500']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Mock console.log to verify error message
            const consoleSpy = jest.spyOn(console, 'log');
            
            await operations.debitAccount();
            
            expect(dataProgram.execute('READ')).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            
            consoleSpy.mockRestore();
        });

        test('TC-DEBIT-ERR-002: Debit exceeds balance by small amount', async () => {
            const dataProgram = new DataProgram();
            dataProgram.execute('WRITE', 100.00); // Set balance to $100
            
            const mockRl = new MockReadline();
            mockRl.setResponses(['100.01']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            await operations.debitAccount();
            
            expect(dataProgram.execute('READ')).toBe(100.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            
            consoleSpy.mockRestore();
        });

        test('TC-DEBIT-ERR-003: Debit from zero balance', async () => {
            const dataProgram = new DataProgram();
            dataProgram.execute('WRITE', 0.00); // Set balance to $0
            
            const mockRl = new MockReadline();
            mockRl.setResponses(['0.01']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            await operations.debitAccount();
            
            expect(dataProgram.execute('READ')).toBe(0.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            
            consoleSpy.mockRestore();
        });

        test('TC-DEBIT-ERR-004: Balance unchanged after insufficient funds', async () => {
            const dataProgram = new DataProgram();
            dataProgram.execute('WRITE', 500.00);
            
            const mockRl = new MockReadline();
            mockRl.setResponses(['1000']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.debitAccount();
            expect(dataProgram.execute('READ')).toBe(500.00); // No modification
        });

        test('TC-DEBIT-ERR-005: Multiple insufficient funds attempts', async () => {
            const dataProgram = new DataProgram();
            dataProgram.execute('WRITE', 100.00);
            
            const mockRl = new MockReadline();
            mockRl.setResponses(['200', '150']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.debitAccount(); // Attempt $200 (fail)
            await operations.debitAccount(); // Attempt $150 (fail)
            
            expect(dataProgram.execute('READ')).toBe(100.00); // Still $100
        });
    });

    // ============================================================================
    // 6. Mixed Transaction Scenarios
    // ============================================================================

    describe('6. Mixed Transaction Scenarios', () => {

        test('TC-MIX-001: Credit followed by debit', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['500', '300']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.creditAccount(); // +500 = 1500
            await operations.debitAccount();  // -300 = 1200
            
            expect(dataProgram.execute('READ')).toBe(1200.00);
        });

        test('TC-MIX-002: Debit followed by credit', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['300', '500']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.debitAccount();  // -300 = 700
            await operations.creditAccount(); // +500 = 1200
            
            expect(dataProgram.execute('READ')).toBe(1200.00);
        });

        test('TC-MIX-003: Multiple mixed transactions', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['200', '150', '50', '100']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.creditAccount(); // +200 = 1200
            await operations.debitAccount();  // -150 = 1050
            await operations.creditAccount(); // +50  = 1100
            await operations.debitAccount();  // -100 = 1000
            
            expect(dataProgram.execute('READ')).toBe(1000.00);
        });

        test('TC-MIX-004: Transaction after insufficient funds', async () => {
            const dataProgram = new DataProgram();
            dataProgram.execute('WRITE', 100.00);
            
            const mockRl = new MockReadline();
            mockRl.setResponses(['200', '150']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.debitAccount();  // Attempt -200 (fail, still 100)
            await operations.creditAccount(); // +150 = 250
            
            expect(dataProgram.execute('READ')).toBe(250.00);
        });

        test('TC-MIX-005: Complex transaction sequence', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['500', '300', '400', '600']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.debitAccount();  // -500 = 500
            await operations.creditAccount(); // +300 = 800
            await operations.debitAccount();  // -400 = 400
            await operations.creditAccount(); // +600 = 1000
            
            expect(dataProgram.execute('READ')).toBe(1000.00);
        });
    });

    // ============================================================================
    // 7. Boundary Value Testing
    // ============================================================================

    describe('8. Boundary Value Testing', () => {

        test('TC-BOUND-001: Maximum balance limit $999,999.99', () => {
            const dataProgram = new DataProgram();
            dataProgram.execute('WRITE', 999999.99);
            
            expect(dataProgram.execute('READ')).toBe(999999.99);
        });

        test('TC-BOUND-002: Minimum balance (zero)', () => {
            const dataProgram = new DataProgram();
            dataProgram.execute('WRITE', 0.00);
            
            expect(dataProgram.execute('READ')).toBe(0.00);
        });

        test('TC-BOUND-003: Credit smallest amount (1 cent)', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['0.01']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.creditAccount();
            expect(dataProgram.execute('READ')).toBe(1000.01);
        });

        test('TC-BOUND-004: Debit smallest amount (1 cent)', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['0.01']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.debitAccount();
            expect(dataProgram.execute('READ')).toBe(999.99);
        });

        test('TC-BOUND-006: Precision test (2 decimal places)', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['123.45', '23.45']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.creditAccount(); // +123.45 = 1123.45
            await operations.debitAccount();  // -23.45  = 1100.00
            
            expect(dataProgram.execute('READ')).toBe(1100.00);
        });
    });

    // ============================================================================
    // 9. Data Integrity and Persistence
    // ============================================================================

    describe('9. Data Integrity and Persistence', () => {

        test('TC-DATA-001: Balance persists across operations', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['100', '50']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.creditAccount(); // +100 = 1100
            const balance1 = dataProgram.execute('READ');
            expect(balance1).toBe(1100.00);
            
            await operations.debitAccount();  // -50 = 1050
            const balance2 = dataProgram.execute('READ');
            expect(balance2).toBe(1050.00);
        });

        test('TC-DATA-002: Failed debit does not modify balance', async () => {
            const dataProgram = new DataProgram();
            dataProgram.execute('WRITE', 500.00);
            
            const mockRl = new MockReadline();
            mockRl.setResponses(['1000']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.debitAccount(); // Attempt fails
            expect(dataProgram.execute('READ')).toBe(500.00); // Unchanged
        });

        test('TC-DATA-003: Balance accuracy after multiple operations', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['100', '50', '200', '75', '25', '150', '100', '80', '60', '40']);
            const operations = new Operations(dataProgram, mockRl);
            
            // Starting: 1000
            await operations.creditAccount(); // +100 = 1100
            await operations.debitAccount();  // -50  = 1050
            await operations.creditAccount(); // +200 = 1250
            await operations.debitAccount();  // -75  = 1175
            await operations.creditAccount(); // +25  = 1200
            await operations.debitAccount();  // -150 = 1050
            await operations.creditAccount(); // +100 = 1150
            await operations.debitAccount();  // -80  = 1070
            await operations.creditAccount(); // +60  = 1130
            await operations.debitAccount();  // -40  = 1090
            
            expect(dataProgram.execute('READ')).toBe(1090.00);
        });

        test('TC-DATA-004: Zero balance handling', async () => {
            const dataProgram = new DataProgram();
            dataProgram.execute('WRITE', 100.00);
            
            const mockRl = new MockReadline();
            mockRl.setResponses(['100', '0.01']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.debitAccount(); // -100 = 0
            expect(dataProgram.execute('READ')).toBe(0.00);
            
            const consoleSpy = jest.spyOn(console, 'log');
            await operations.debitAccount(); // Attempt -0.01 (fail)
            
            expect(dataProgram.execute('READ')).toBe(0.00);
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            
            consoleSpy.mockRestore();
        });
    });

    // ============================================================================
    // 10. Business Rule Validation
    // ============================================================================

    describe('10. Business Rule Validation', () => {

        test('TC-RULE-001: Overdraft protection enforced', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['1500']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            await operations.debitAccount();
            
            expect(dataProgram.execute('READ')).toBe(1000.00); // Unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            
            consoleSpy.mockRestore();
        });

        test('TC-RULE-002: No negative balance allowed', async () => {
            const dataProgram = new DataProgram();
            dataProgram.execute('WRITE', 0.01);
            
            const mockRl = new MockReadline();
            mockRl.setResponses(['0.02']);
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            await operations.debitAccount();
            
            expect(dataProgram.execute('READ')).toBe(0.01); // Unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            
            consoleSpy.mockRestore();
        });

        test('TC-RULE-003: Credit has no upper limit validation', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['50000']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.creditAccount();
            expect(dataProgram.execute('READ')).toBe(51000.00);
        });

        test('TC-RULE-004: Balance format with 2 decimal precision', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['0.5']);
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.creditAccount();
            const balance = dataProgram.execute('READ');
            const formatted = operations.formatBalance(balance);
            
            expect(formatted).toBe('001000.50'); // Not 001000.5
        });

        test('TC-RULE-005: All amounts use currency precision (2 decimals)', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Test various amounts
            const amounts = [100, 50.5, 0.01, 999.99];
            const expectedFormatted = ['000100.00', '000050.50', '000000.01', '000999.99'];
            
            amounts.forEach((amount, index) => {
                const formatted = operations.formatBalance(amount);
                expect(formatted).toBe(expectedFormatted[index]);
            });
        });

        test('TC-RULE-006: Amount validation rounds to 2 decimal places', async () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            mockRl.setResponses(['123.456']); // 3 decimals
            const operations = new Operations(dataProgram, mockRl);
            
            await operations.creditAccount();
            // Should round to 123.46
            expect(dataProgram.execute('READ')).toBe(1123.46);
        });
    });

    // ============================================================================
    // Additional Format and Display Tests
    // ============================================================================

    describe('Format and Display Tests', () => {

        test('Format balance matches COBOL PIC 9(6)V99 format', () => {
            const dataProgram = new DataProgram();
            const mockRl = new MockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Test various balances
            expect(operations.formatBalance(0)).toBe('000000.00');
            expect(operations.formatBalance(1)).toBe('000001.00');
            expect(operations.formatBalance(10.5)).toBe('000010.50');
            expect(operations.formatBalance(100.99)).toBe('000100.99');
            expect(operations.formatBalance(1000.00)).toBe('001000.00');
            expect(operations.formatBalance(12345.67)).toBe('012345.67');
            expect(operations.formatBalance(999999.99)).toBe('999999.99');
        });

        test('READ operation returns correct balance', () => {
            const dataProgram = new DataProgram();
            expect(dataProgram.execute('READ')).toBe(1000.00);
        });

        test('WRITE operation updates balance', () => {
            const dataProgram = new DataProgram();
            dataProgram.execute('WRITE', 2500.50);
            expect(dataProgram.execute('READ')).toBe(2500.50);
        });

        test('WRITE then READ maintains precision', () => {
            const dataProgram = new DataProgram();
            dataProgram.execute('WRITE', 1234.56);
            expect(dataProgram.execute('READ')).toBe(1234.56);
        });
    });
});
