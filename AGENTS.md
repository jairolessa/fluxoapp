# AGENTS.md — Fluxo

## 1. Project Overview

**Fluxo** is a mobile personal-finance application focused on **financial health**, not merely expense tracking.

The application is built with:

- React Native
- Expo
- TypeScript

The product goal is to automatically transform financial data into useful information and actionable recommendations.

The core questions the application should answer are:

- How is my financial health?
- How much can I safely spend?
- What are my biggest financial problems?
- What should I do to improve my financial situation?

The application should minimize manual financial data entry.

---

# 2. Product Principles

When implementing or modifying functionality, prioritize these principles in order:

1. **Financial clarity**
2. **Automation**
3. **Actionable information**
4. **Simple UX**
5. **Data correctness**
6. **Maintainability**
7. **Performance**

The application should not become a simple CRUD system for financial transactions.

A feature should ideally help the user:

- understand their financial situation;
- predict future financial behavior;
- control spending;
- organize their budget;
- identify problems;
- improve financial health.

---

# 3. Source of Truth

The existing codebase is the source of truth for implementation details.

This document describes the product and engineering intent, but it does **not** guarantee that every architectural concept described here already exists in the repository.

Before modifying code:

1. Inspect the existing project structure.
2. Inspect `package.json`.
3. Identify the Expo and React Native versions.
4. Identify existing architectural patterns.
5. Reuse existing abstractions where appropriate.
6. Do not introduce a new architecture merely because it is preferred.
7. Do not rewrite working code unnecessarily.

When this document conflicts with the existing implementation, preserve working behavior unless the requested task explicitly requires architectural changes.

---

# 4. Repository Inspection

Before implementing a non-trivial task, inspect:

```text
package.json
tsconfig.json
app.json / app.config.*
babel.config.*
metro.config.*
src/
app/
components/
hooks/
services/
repositories/
types/
```

The actual directories may differ.

Do not assume a specific folder structure before inspecting the repository.

Also inspect:

- existing navigation;
- authentication;
- API clients;
- state management;
- data persistence;
- reusable UI components;
- theme/design system;
- tests;
- lint configuration;
- formatting configuration.

---

# 5. Technology Constraints

## React Native / Expo

The project uses Expo.

Do not migrate away from Expo unless explicitly requested.

Do not upgrade Expo major versions as part of an unrelated task.

Before changing Expo-related packages, verify compatibility between:

- Expo;
- React Native;
- React;
- Expo SDK packages;
- Metro;
- native modules.

Prefer Expo-supported commands and dependency versions.

---

# 6. Dependency Management

Dependency changes must be conservative.

Before adding a dependency, ask:

1. Is the functionality already available in the project?
2. Can it be implemented with existing dependencies?
3. Is the dependency compatible with the current Expo SDK?
4. Does it significantly increase bundle size?
5. Does it introduce native dependencies?
6. Is it actively maintained?

Do not add dependencies simply to solve small problems.

### Security updates

Never blindly execute:

```bash
npm audit fix --force
```

especially when it causes a major Expo upgrade.

Security fixes must be evaluated against the current Expo/React Native compatibility matrix.

When `npm audit` reports vulnerabilities in transitive dependencies, determine:

- which package introduces the vulnerable dependency;
- whether it affects production runtime or only development/build tooling;
- whether a compatible update exists;
- whether the vulnerability is realistically exploitable in the application context.

Do not downgrade security simply because the audit is inconvenient, but also do not perform destructive upgrades without evaluation.

---

# 7. TypeScript

Use TypeScript throughout the application.

Prefer explicit domain types.

Avoid:

```ts
any
```

unless there is a documented technical reason.

Prefer:

```ts
unknown
```

followed by validation when handling untrusted data.

Avoid excessive type assertions:

```ts
value as SomeType
```

Use runtime validation when external data cannot be trusted.

---

# 8. Architecture

Prefer separation between presentation, application logic, domain logic and data access.

A conceptual architecture is:

```text
Screen / Component
        ↓
Hook / Controller
        ↓
Use Case / Application Service
        ↓
Domain Logic
        ↓
Repository
        ↓
API / Local Database / External Provider
```

Not every feature requires every layer.

Do not create unnecessary abstractions.

However:

- UI components should not contain complex financial calculations;
- screens should not directly implement API protocols;
- repositories should not contain UI logic;
- API clients should not contain business rules;
- business rules should be testable independently of React Native.

---

# 9. Components

React components should primarily be responsible for:

- rendering;
- user interaction;
- composition;
- presentation state.

Avoid placing complex business rules directly inside components.

Bad:

```ts
const available = income - expenses - installments - reservedAmount;
```

inside a large screen component.

Prefer a domain/application function:

```ts
const available = calculateAvailableSpending(financialData);
```

This allows the rule to be reused and tested.

---

# 10. Hooks

Hooks should coordinate React state and application services.

Good uses:

```text
useAuth()
useTransactions()
useAccounts()
useBudget()
useFinancialHealth()
```

Avoid putting large amounts of business logic directly into hooks.

A hook should preferably orchestrate:

```text
UI
 ↓
Hook
 ↓
Service / Use Case
```

rather than becoming a large business-logic container.

---

# 11. Services / Use Cases

Business operations should be represented by clear functions or services.

Examples:

```text
calculateFinancialHealth()
calculateAvailableSpending()
calculateBudget()
forecastBalance()
categorizeTransaction()
detectRecurringExpense()
calculateCreditCardUsage()
```

These functions should ideally be:

- deterministic;
- independently testable;
- free from UI dependencies;
- free from React-specific concerns.

---

# 12. Repository Pattern

Data access should be isolated where practical.

Conceptually:

```ts
interface TransactionRepository {
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | null>;
}
```

Possible implementations:

```text
ApiTransactionRepository
LocalTransactionRepository
MockTransactionRepository
```

The application should not need to know whether the data came from:

- REST API;
- local database;
- mock data;
- future financial provider.

This is particularly important for testing.

---

# 13. Financial Domain

The core domain contains financial concepts such as:

```text
User
Account
Transaction
Category
CreditCard
Invoice
Installment
Income
Expense
RecurringTransaction
Budget
FinancialHealth
FinancialGoal
```

Use domain terminology consistently.

Avoid different names for the same concept.

---

# 14. Money Handling

Never use floating-point arithmetic for financial calculations when precision matters.

Avoid relying on:

```ts
0.1 + 0.2
```

for monetary calculations.

Prefer integer minor units where possible:

```ts
amountInCents: number;
```

Example:

```text
R$ 100,50
→ 10050 cents
```

Formatting should occur at the presentation layer.

Do not mix formatted currency strings with numeric financial values.

Bad:

```ts
amount = "R$ 1.250,50";
```

Prefer:

```ts
amountInCents = 125050;
```

---

# 15. Transaction Model

A transaction should preserve enough information to support financial analysis.

Potential fields include:

```ts
id
description
amount
date
type
categoryId
accountId
cardId
paymentMethod
status
merchant
```

Transaction types should be represented using explicit types/enums where appropriate.

For example:

```text
INCOME
EXPENSE
TRANSFER
```

Transfers should not accidentally be interpreted as income or expenses.

---

# 16. Credit Cards

Credit-card purchases must be modeled separately from bank-account cash flow when necessary.

The system should support:

- card;
- credit limit;
- available limit;
- statement/invoice;
- closing date;
- due date;
- purchases;
- installments;
- future installments.

An installment purchase should preserve its relationship with the original purchase.

Conceptually:

```text
Purchase
   ↓
Installment Plan
   ↓
Installment 1
Installment 2
Installment 3
...
```

Do not duplicate business logic for each installment.

---

# 17. Recurring Transactions

The system should distinguish between:

```text
One-time transaction
Recurring transaction
Installment transaction
Transfer
```

Recurring transactions may represent:

- salary;
- rent;
- subscriptions;
- utilities;
- memberships;
- recurring bills.

Recurrence detection and recurrence prediction belong in business/domain logic rather than UI components.

---

# 18. Budget

The budget system should not depend exclusively on manual user input.

Where sufficient historical data exists, the application should be able to infer or suggest:

- spending limits;
- category budgets;
- expected expenses;
- available spending;
- unusual spending;
- spending trends.

Budget calculations must be explainable.

The user should be able to understand why a suggested budget exists.

---

# 19. Financial Health

Financial health is one of the central domain concepts.

The score should not be treated as an arbitrary number.

A financial-health calculation may consider:

- income;
- fixed expenses;
- variable expenses;
- savings;
- debt;
- credit utilization;
- recurring commitments;
- financial reserve;
- payment behavior;
- spending trends.

The calculation must be isolated from the UI.

Example:

```ts
const health = calculateFinancialHealth(financialProfile);
```

The result should ideally provide both:

```text
score
```

and explanatory factors:

```text
positiveFactors
negativeFactors
recommendations
```

Avoid presenting financial recommendations without an identifiable reason.

---

# 20. Financial Recommendations

Recommendations should be:

- contextual;
- actionable;
- understandable;
- based on available data;
- proportional to the user's situation.

Prefer:

```text
"Your food spending is 18% higher than your monthly average."
```

over:

```text
"You spend too much."
```

Recommendations should not claim certainty when the underlying data is estimated.

Use language such as:

- estimated;
- projected;
- likely;
- approximately;

when appropriate.

---

# 21. Forecasting

Financial forecasts are estimates.

Forecasting may use:

- recurring income;
- recurring expenses;
- credit-card installments;
- upcoming invoices;
- historical spending;
- budget limits.

Never represent a prediction as guaranteed future cash flow.

Keep forecasting logic separate from UI.

---

# 22. API Layer

The API layer should be isolated.

Avoid making raw HTTP calls throughout screens/components.

Prefer:

```text
Screen
 ↓
Hook
 ↓
Service
 ↓
Repository/API client
 ↓
Backend
```

Centralize:

- base URL;
- authentication headers;
- error handling;
- serialization;
- common HTTP behavior.

---

# 23. Local Persistence

Local persistence may be used for:

- cache;
- offline support;
- temporary data;
- development;
- tests.

Do not assume local data is automatically the source of truth.

The architecture should allow local persistence to coexist with remote persistence.

For tests, mock repositories or an in-memory implementation are preferred when possible.

---

# 24. Authentication

Authentication should be isolated from business features.

Components should not directly manage low-level token behavior.

Conceptually:

```text
Auth Service
 ├── login
 ├── logout
 ├── refreshSession
 └── getCurrentUser
```

Sensitive credentials and tokens must not be logged.

Use secure storage appropriate to the mobile platform for sensitive authentication material.

---

# 25. Error Handling

Errors must be handled deliberately.

Do not silently swallow exceptions:

```ts
try {
  ...
} catch {
}
```

unless there is a documented reason.

Differentiate:

```text
Network error
Authentication error
Validation error
Business error
Unexpected application error
```

User-facing errors should be understandable.

Developer diagnostics should contain enough information to troubleshoot without exposing sensitive financial information.

---

# 26. Loading and Empty States

Every data-driven screen should consider:

```text
Loading
Success
Empty
Error
```

Do not leave the user staring at a blank screen while data is loading.

Empty states should explain what the user can do next.

---

# 27. Navigation

Navigation should remain predictable.

Avoid placing business logic inside navigation configuration.

Authentication-related navigation should be separated conceptually from authenticated application navigation.

Deep-link and navigation changes should be tested when relevant.

---

# 28. UI / UX

The application should prioritize:

- readability;
- accessibility;
- clear hierarchy;
- minimal cognitive load;
- consistent spacing;
- reusable components;
- consistent typography;
- consistent financial formatting.

The dashboard should answer the most important questions first:

```text
How am I doing?
How much can I spend?
What is happening with my money?
What should I do?
```

Do not overload the home screen with unnecessary charts.

---

# 29. Accessibility

Interactive elements should have appropriate accessibility information.

Consider:

- screen readers;
- touch target size;
- readable text;
- sufficient contrast;
- meaningful labels;
- error messages that are understandable without relying solely on color.

Do not communicate financial status only through colors.

For example, avoid:

```text
green = good
red = bad
```

without textual context.

---

# 30. Testing

Business rules should be tested independently from React Native whenever possible.

Prioritize tests for:

```text
calculateFinancialHealth()
calculateAvailableSpending()
calculateBudget()
forecastBalance()
categorizeTransaction()
calculateInstallments()
detectRecurringTransactions()
```

Test edge cases such as:

- zero income;
- zero expenses;
- negative balance;
- missing data;
- very large values;
- multiple accounts;
- multiple cards;
- installment purchases;
- transfers;
- recurring transactions.

---

# 31. Test Data

Mock financial data must be realistic enough to exercise business rules.

Do not hardcode fake financial data throughout UI components.

Centralize fixtures where practical.

Example:

```text
tests/
fixtures/
mocks/
```

Use factories when test data becomes complex.

---

# 32. Code Style

Prefer:

- small functions;
- descriptive names;
- early returns;
- explicit types;
- composition;
- reusable utilities;
- immutable transformations.

Avoid:

- deeply nested conditionals;
- giant components;
- duplicated business rules;
- unnecessary abstractions;
- magic numbers;
- unexplained constants.

Bad:

```ts
if (x === 3) {
  ...
}
```

Prefer:

```ts
const MAX_INSTALLMENTS = 3;
```

when the value has domain meaning.

---

# 33. File Naming

Follow the existing project's naming convention.

If no convention exists, prefer:

```text
PascalCase.tsx
```

for React components and:

```text
camelCase.ts
```

for utilities, services and hooks where appropriate.

Examples:

```text
FinancialHealthCard.tsx
TransactionList.tsx
useFinancialHealth.ts
calculateBudget.ts
transactionRepository.ts
```

Do not rename existing files solely to enforce personal preferences.

---

# 34. Comments

Prefer self-explanatory code.

Comments should explain **why**, not simply **what**.

Bad:

```ts
// Subtract expenses from income
const available = income - expenses;
```

Good:

```ts
// Keep the emergency reserve excluded from discretionary spending.
const available = income - expenses - emergencyReserve;
```

---

# 35. Git and Changes

Keep changes focused.

A task should not unexpectedly modify unrelated files.

Do not:

- reformat the entire project;
- upgrade unrelated dependencies;
- rename unrelated components;
- rewrite architecture unnecessarily;
- delete existing functionality without reason.

Before finishing a task, inspect the changed files and verify that unrelated modifications were not introduced.

---

# 36. Before Coding

For every non-trivial task:

### Step 1 — Understand

Identify:

- requested behavior;
- affected screens;
- affected domain entities;
- dependencies;
- existing implementation.

### Step 2 — Plan

Determine:

- files to modify;
- files to create;
- possible side effects;
- tests required.

### Step 3 — Implement

Make the smallest coherent change that solves the problem.

### Step 4 — Validate

Run available:

```bash
npm test
npm run lint
npx tsc --noEmit
```

or the project's equivalent scripts.

Do not run commands that are not configured in the project without first checking available scripts.

---

# 37. After Coding

After implementation:

1. Run TypeScript validation.
2. Run lint.
3. Run relevant tests.
4. Check imports.
5. Check navigation.
6. Check loading/error/empty states.
7. Check mobile-specific behavior when relevant.
8. Review changed files.
9. Confirm no secrets were introduced.
10. Confirm no unrelated dependency changes occurred.

If a validation command cannot be run, report that fact.

Do not claim that tests passed if they were not executed.

---

# 38. Database and Backend Assumptions

The mobile application should remain decoupled from the backend's database technology.

Do not introduce backend-specific database assumptions into mobile domain models unless required by the API contract.

The mobile app should consume API contracts, not directly depend on:

```text
PostgreSQL
H2
MySQL
MongoDB
```

or any other backend database.

---

# 39. External Financial Integrations

The application may eventually consume financial information from external providers.

Keep external-provider-specific models at the integration boundary.

Prefer:

```text
External Provider DTO
        ↓
Mapper
        ↓
Fluxo Domain Model
```

rather than allowing provider-specific objects to spread through the application.

This allows the financial provider to be changed without rewriting the domain.

---

# 40. Security Rules

Never commit:

- API keys;
- passwords;
- access tokens;
- refresh tokens;
- private keys;
- production credentials;
- real banking credentials;
- real financial data belonging to users.

Use environment variables or secure configuration mechanisms where appropriate.

Never log:

```text
Authorization headers
passwords
tokens
full account numbers
sensitive financial information
```

---

# 41. Privacy

Financial information is sensitive.

Treat all financial data as private by default.

Do not expose financial information in:

- logs;
- analytics events;
- error messages;
- screenshots used in tests;
- debugging output;
- repository fixtures.

Use synthetic data for development.

---

# 42. Performance

Avoid premature optimization.

However, pay attention to:

- unnecessary re-renders;
- large transaction lists;
- expensive calculations executed during every render;
- unnecessary API requests;
- excessive local-storage operations.

For large transaction lists, prefer appropriate list virtualization rather than rendering thousands of elements directly.

---

# 43. Offline and Synchronization

If offline functionality is implemented, clearly distinguish:

```text
local state
cached remote state
pending synchronization
confirmed server state
```

Do not silently overwrite newer server data with stale local data.

Synchronization rules should be explicit.

---

# 44. Product Decision Rule

When choosing between two technically valid implementations, prefer the one that makes the following easier:

```text
Automatic data ingestion
        ↓
Correct financial model
        ↓
Financial analysis
        ↓
Clear explanation
        ↓
Actionable recommendation
```

The application should evolve toward an intelligent financial assistant rather than a traditional expense tracker.

---

# 45. Definition of Done

A task is considered complete when:

- [ ] Requested functionality is implemented.
- [ ] Existing functionality remains intact.
- [ ] TypeScript has no new errors.
- [ ] Relevant tests pass.
- [ ] Lint passes when configured.
- [ ] Loading, empty and error states are handled when relevant.
- [ ] Financial calculations are covered by tests when applicable.
- [ ] No sensitive information is exposed.
- [ ] No unnecessary dependency was added.
- [ ] No unrelated files were changed.
- [ ] Expo compatibility was preserved.
- [ ] The implementation follows existing project conventions.
- [ ] The final change is understandable and maintainable.

---

# 46. Important Instruction to Codex

**Do not assume. Inspect first.**

Before changing code, determine how the current project actually works.

When uncertain:

1. inspect the relevant files;
2. search for existing implementations;
3. follow established project conventions;
4. make the smallest safe change;
5. validate the result.

Do not replace existing architecture merely because another architecture may be theoretically better.

The goal is to evolve the Fluxo codebase incrementally toward a robust, maintainable financial application.