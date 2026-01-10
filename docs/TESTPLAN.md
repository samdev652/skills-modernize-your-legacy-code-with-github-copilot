# Test Plan - School Accounting System

## Overview
This test plan validates the business logic and functionality of the school accounting system. It covers all operations including account balance viewing, credit transactions, debit transactions, and system navigation.

**Purpose:** Validate business requirements before modernization to Node.js  
**Scope:** All business logic and user interactions in the COBOL accounting system  
**Initial Balance:** $1,000.00

---

## Test Cases

### 1. System Initialization and Menu Display

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-INIT-001 | Verify system starts with correct initial balance | System not running | 1. Start application<br>2. Select option 1 (View Balance) | System displays balance of $1,000.00 | | | |
| TC-MENU-001 | Verify main menu displays correctly | System running | 1. Observe main menu | Menu displays options:<br>1. View Balance<br>2. Credit Account<br>3. Debit Account<br>4. Exit | | | |
| TC-MENU-002 | Verify menu loops after operation | System running | 1. Select any option 1-3<br>2. Complete operation | System returns to main menu | | | |

---

### 2. View Balance Functionality

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-BAL-001 | View initial balance | Balance is $1,000.00 | 1. Select option 1 | System displays "Current balance: 001000.00" | | | |
| TC-BAL-002 | View balance after credit | Balance has been modified by credit | 1. Credit $500.00<br>2. Select option 1 | System displays updated balance $1,500.00 | | | |
| TC-BAL-003 | View balance after debit | Balance has been modified by debit | 1. Debit $300.00<br>2. Select option 1 | System displays updated balance $700.00 | | | |
| TC-BAL-004 | View balance multiple times | System running | 1. Select option 1<br>2. Note balance<br>3. Select option 1 again | Balance remains unchanged between views | | | |
| TC-BAL-005 | Verify balance does not modify data | Current balance is $1,000.00 | 1. Select option 1<br>2. Select option 1 again | Both displays show same balance (read-only operation) | | | |

---

### 3. Credit Account Functionality

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-CREDIT-001 | Credit account with valid amount | Balance is $1,000.00 | 1. Select option 2<br>2. Enter 500.00<br>3. Submit | System displays "Amount credited. New balance: 001500.00" | | | |
| TC-CREDIT-002 | Credit account with small amount (cents only) | Balance is $1,000.00 | 1. Select option 2<br>2. Enter 0.50<br>3. Submit | System displays "Amount credited. New balance: 001000.50" | | | |
| TC-CREDIT-003 | Credit account with zero amount | Balance is $1,000.00 | 1. Select option 2<br>2. Enter 0.00<br>3. Submit | System displays "Amount credited. New balance: 001000.00" | | | |
| TC-CREDIT-004 | Credit account with large amount | Balance is $1,000.00 | 1. Select option 2<br>2. Enter 99999.99<br>3. Submit | System displays "Amount credited. New balance: 100999.99" | | | |
| TC-CREDIT-005 | Credit account to maximum balance | Balance is $900,000.00 | 1. Select option 2<br>2. Enter 99999.99<br>3. Submit | System displays "Amount credited. New balance: 999999.99" | | | |
| TC-CREDIT-006 | Credit amount with two decimal places | Balance is $1,000.00 | 1. Select option 2<br>2. Enter 123.45<br>3. Submit | System displays "Amount credited. New balance: 001123.45" | | | |
| TC-CREDIT-007 | Multiple consecutive credits | Balance is $1,000.00 | 1. Credit $100.00<br>2. Credit $200.00<br>3. Credit $300.00<br>4. View balance | Final balance is $1,600.00 | | | |
| TC-CREDIT-008 | Balance persistence after credit | Balance is $1,000.00 | 1. Select option 2<br>2. Enter 500.00<br>3. Select option 1 | Balance view shows $1,500.00 | | | |

---

### 4. Debit Account Functionality - Success Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-DEBIT-001 | Debit account with valid amount (sufficient funds) | Balance is $1,000.00 | 1. Select option 3<br>2. Enter 500.00<br>3. Submit | System displays "Amount debited. New balance: 000500.00" | | | |
| TC-DEBIT-002 | Debit exact balance amount | Balance is $1,000.00 | 1. Select option 3<br>2. Enter 1000.00<br>3. Submit | System displays "Amount debited. New balance: 000000.00" | | | |
| TC-DEBIT-003 | Debit small amount (cents only) | Balance is $1,000.00 | 1. Select option 3<br>2. Enter 0.50<br>3. Submit | System displays "Amount debited. New balance: 000999.50" | | | |
| TC-DEBIT-004 | Debit zero amount | Balance is $1,000.00 | 1. Select option 3<br>2. Enter 0.00<br>3. Submit | System displays "Amount debited. New balance: 001000.00" | | | |
| TC-DEBIT-005 | Multiple consecutive debits | Balance is $1,000.00 | 1. Debit $100.00<br>2. Debit $200.00<br>3. Debit $300.00<br>4. View balance | Final balance is $400.00 | | | |
| TC-DEBIT-006 | Balance persistence after debit | Balance is $1,000.00 | 1. Select option 3<br>2. Enter 500.00<br>3. Select option 1 | Balance view shows $500.00 | | | |
| TC-DEBIT-007 | Debit with two decimal places | Balance is $1,000.00 | 1. Select option 3<br>2. Enter 123.45<br>3. Submit | System displays "Amount debited. New balance: 000876.55" | | | |

---

### 5. Debit Account Functionality - Insufficient Funds

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-DEBIT-ERR-001 | Debit exceeds current balance | Balance is $1,000.00 | 1. Select option 3<br>2. Enter 1500.00<br>3. Submit | System displays "Insufficient funds for this debit."<br>Balance remains $1,000.00 | | | |
| TC-DEBIT-ERR-002 | Debit exceeds balance by small amount | Balance is $100.00 | 1. Select option 3<br>2. Enter 100.01<br>3. Submit | System displays "Insufficient funds for this debit."<br>Balance remains $100.00 | | | |
| TC-DEBIT-ERR-003 | Debit from zero balance | Balance is $0.00 | 1. Select option 3<br>2. Enter 0.01<br>3. Submit | System displays "Insufficient funds for this debit."<br>Balance remains $0.00 | | | |
| TC-DEBIT-ERR-004 | Balance unchanged after insufficient funds | Balance is $500.00 | 1. Select option 3<br>2. Enter 1000.00<br>3. View balance | Balance still shows $500.00 (no modification) | | | |
| TC-DEBIT-ERR-005 | Multiple insufficient funds attempts | Balance is $100.00 | 1. Attempt debit $200.00 (fail)<br>2. Attempt debit $150.00 (fail)<br>3. View balance | Balance still shows $100.00 | | | |

---

### 6. Mixed Transaction Scenarios

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-MIX-001 | Credit followed by debit | Balance is $1,000.00 | 1. Credit $500.00<br>2. Debit $300.00<br>3. View balance | Final balance is $1,200.00 | | | |
| TC-MIX-002 | Debit followed by credit | Balance is $1,000.00 | 1. Debit $300.00<br>2. Credit $500.00<br>3. View balance | Final balance is $1,200.00 | | | |
| TC-MIX-003 | Multiple mixed transactions | Balance is $1,000.00 | 1. Credit $200.00<br>2. Debit $150.00<br>3. Credit $50.00<br>4. Debit $100.00<br>5. View balance | Final balance is $1,000.00 | | | |
| TC-MIX-004 | Transaction after insufficient funds | Balance is $100.00 | 1. Attempt debit $200.00 (fail)<br>2. Credit $150.00 (success)<br>3. View balance | Final balance is $250.00 | | | |
| TC-MIX-005 | Complex transaction sequence | Balance is $1,000.00 | 1. Debit $500.00<br>2. Credit $300.00<br>3. Debit $400.00<br>4. Credit $600.00<br>5. View balance | Final balance is $1,000.00 | | | |

---

### 7. Input Validation and Menu Navigation

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-NAV-001 | Invalid menu choice (out of range high) | System at main menu | 1. Enter 5 at menu | System displays "Invalid choice, please select 1-4."<br>Returns to menu | | | |
| TC-NAV-002 | Invalid menu choice (out of range low) | System at main menu | 1. Enter 0 at menu | System displays "Invalid choice, please select 1-4."<br>Returns to menu | | | |
| TC-NAV-003 | Invalid menu choice (non-numeric) | System at main menu | 1. Enter letter 'A' at menu | System handles invalid input appropriately | | | |
| TC-NAV-004 | Menu choice 1 navigates to View Balance | System at main menu | 1. Enter 1 | System executes View Balance operation | | | |
| TC-NAV-005 | Menu choice 2 navigates to Credit | System at main menu | 1. Enter 2 | System prompts for credit amount | | | |
| TC-NAV-006 | Menu choice 3 navigates to Debit | System at main menu | 1. Enter 3 | System prompts for debit amount | | | |
| TC-NAV-007 | Menu choice 4 exits program | System at main menu | 1. Enter 4 | System displays "Exiting the program. Goodbye!"<br>Program terminates | | | |

---

### 8. Boundary Value Testing

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-BOUND-001 | Maximum balance limit | Balance is $999,999.99 | 1. Select option 1 | System displays balance $999,999.99 | | | |
| TC-BOUND-002 | Minimum balance (zero) | Balance is $0.00 | 1. Select option 1 | System displays balance $0.00 | | | |
| TC-BOUND-003 | Credit smallest amount (1 cent) | Balance is $1,000.00 | 1. Credit $0.01 | New balance is $1,000.01 | | | |
| TC-BOUND-004 | Debit smallest amount (1 cent) | Balance is $1,000.00 | 1. Debit $0.01 | New balance is $999.99 | | | |
| TC-BOUND-005 | Maximum transaction amount | Balance is $1,000.00 | 1. Credit $999,999.99 | System processes or handles appropriately | | | |
| TC-BOUND-006 | Precision test (2 decimal places) | Balance is $1,000.00 | 1. Credit $123.45<br>2. Debit $23.45<br>3. View balance | Balance shows exactly $1,100.00 | | | |

---

### 9. Data Integrity and Persistence

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-DATA-001 | Balance persists across operations | Balance is $1,000.00 | 1. Credit $100.00<br>2. View balance<br>3. Debit $50.00<br>4. View balance | Each view shows correct accumulated balance | | | |
| TC-DATA-002 | Failed debit does not modify balance | Balance is $500.00 | 1. Attempt debit $1000.00<br>2. View balance | Balance still shows $500.00 (unchanged) | | | |
| TC-DATA-003 | Balance accuracy after multiple operations | Balance is $1,000.00 | 1. Perform 10 transactions (mix of credits/debits)<br>2. Calculate expected balance<br>3. View balance | Displayed balance matches calculated value | | | |
| TC-DATA-004 | Zero balance handling | Balance is $100.00 | 1. Debit $100.00<br>2. View balance<br>3. Attempt debit $0.01 | Balance is $0.00, debit attempt fails | | | |

---

### 10. Business Rule Validation

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|---------|----------|
| TC-RULE-001 | Overdraft protection enforced | Balance is $1,000.00 | 1. Attempt debit $1,500.00 | Transaction rejected, balance unchanged | | | |
| TC-RULE-002 | No negative balance allowed | Balance is $0.01 | 1. Attempt debit $0.02 | Transaction rejected with insufficient funds message | | | |
| TC-RULE-003 | Credit has no upper limit validation | Balance is $1,000.00 | 1. Credit $50,000.00 | Transaction succeeds (limited only by field size) | | | |
| TC-RULE-004 | Balance format with 2 decimal precision | Balance is $1,000.00 | 1. Credit $0.5<br>2. View balance | Balance displays as $1,000.50 (not $1,000.5) | | | |
| TC-RULE-005 | All amounts use currency precision | Any balance | 1. Perform any credit or debit<br>2. View result | All displayed amounts show exactly 2 decimal places | | | |

---

## Test Execution Summary

**Total Test Cases:** 75  
**Test Cases Passed:** _To be filled during execution_  
**Test Cases Failed:** _To be filled during execution_  
**Pass Rate:** _To be calculated_  

---

## Notes for Test Execution

1. **Test Environment:** Execute tests on compiled COBOL application
2. **Test Data Reset:** Each test should start with documented pre-conditions
3. **Balance Verification:** Always verify balance after operations using View Balance (option 1)
4. **Documentation:** Record any deviations from expected results in Comments column
5. **Edge Cases:** Pay special attention to boundary values and error conditions
6. **Actual Result Column:** Fill in during test execution with observed system behavior
7. **Status Column:** Mark as "Pass" if actual matches expected, "Fail" otherwise

---

## Business Stakeholder Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Business Owner | | | |
| Product Manager | | | |
| QA Lead | | | |
| Development Lead | | | |

---

## Modernization Notes

This test plan will be used to create automated unit and integration tests for the Node.js implementation. All test cases marked as "Pass" represent the required behavior for the modernized application.

**Key Requirements for Node.js Implementation:**
- Maintain all business rules (especially overdraft protection)
- Preserve 2-decimal precision for currency values
- Implement identical transaction logic
- Add comprehensive error handling
- Include input validation
- Maintain data integrity across operations
- Consider adding transaction history logging (enhancement)
- Consider adding user authentication (enhancement)
