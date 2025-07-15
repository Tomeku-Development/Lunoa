# Changelog - 2025-07-16

This update focuses on stabilizing the backend testing suite, fixing critical bugs in the quest and user controllers, and improving the reliability of the Aptos blockchain integration.

## Features & Fixes

-   **Quest Verification (`verifyQuestCompletion`)**:
    -   Successfully implemented a robust Jest test suite for the `verifyQuestCompletion` endpoint.
    -   Fixed all previously failing tests by correcting middleware mocking, resolving test timeouts, and preventing state leakage between tests.
    -   Refactored the controller to use the dynamic `reward_amount` from the quest details instead of a hardcoded value.
    -   Added comprehensive test coverage for success, error (403 Forbidden), and edge cases (e.g., participant status not 'submitted', user has no Aptos address).

-   **User Controller (`users.controller.ts`)**:
    -   Fixed a critical bug in the `getUserActivity` function where `userId` was used without being defined, causing runtime errors.

-   **Project Management**:
    -   Updated `Backend-Todolist.md` to accurately reflect the completion of the quest verification testing tasks.

## Technical Improvements

-   **Testing Framework**: Stabilized the Jest and Supertest environment by correcting the implementation and isolation of mocked middleware (`protect`).
-   **Code Quality**: Cleaned up redundant code in `users.controller.ts` and improved type safety in test files.
