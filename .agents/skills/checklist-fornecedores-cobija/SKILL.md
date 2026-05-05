```markdown
# checklist-fornecedores-cobija Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns, coding conventions, and workflows used in the `checklist-fornecedores-cobija` repository. The project is a JavaScript application scaffolded with Vite, focusing on maintainable code structure, consistent naming, and efficient development practices. You'll learn how to structure files, write imports/exports, and follow the project's conventions for commits and testing.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `supplierList.js`, `checklistForm.jsx`

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```js
    import supplierService from './services/supplierService'
    import ChecklistForm from '../components/ChecklistForm'
    ```

### Export Style
- Use **default exports** for modules and components.
  - Example:
    ```js
    // supplierService.js
    const supplierService = { /* ... */ }
    export default supplierService
    ```

### Commit Message Pattern
- Commit messages are **freeform** with optional prefixes.
- Average commit message length: ~63 characters.
  - Example:
    ```
    Add validation to supplier checklist form
    ```

## Workflows

### Adding a New Feature
**Trigger:** When implementing a new feature or component  
**Command:** `/add-feature`

1. Create a new file using camelCase naming (e.g., `newFeature.js`).
2. Implement the feature using relative imports for dependencies.
3. Export the main function or component as default.
4. Write or update tests in a corresponding `*.test.*` file.
5. Commit changes with a clear, descriptive message.

### Refactoring Code
**Trigger:** When improving or restructuring existing code  
**Command:** `/refactor`

1. Identify the code to refactor.
2. Update file and variable names to use camelCase if needed.
3. Adjust imports to maintain relative paths.
4. Ensure exports remain default.
5. Run tests to verify no regressions.
6. Commit with a message describing the refactor.

### Running Tests
**Trigger:** To verify code correctness after changes  
**Command:** `/run-tests`

1. Locate test files matching the `*.test.*` pattern.
2. Run the project's test command (framework unknown; typically `npm test` or `yarn test`).
3. Review test output and fix any failures.
4. Commit any necessary fixes.

## Testing Patterns

- Test files follow the `*.test.*` naming convention (e.g., `supplierService.test.js`).
- The specific test framework is not detected, but standard JavaScript testing practices apply.
- Place tests alongside or near the code they validate.

  Example:
  ```
  src/
    supplierService.js
    supplierService.test.js
  ```

## Commands
| Command        | Purpose                                              |
|----------------|------------------------------------------------------|
| /add-feature   | Scaffold and implement a new feature or component    |
| /refactor      | Refactor existing code while following conventions   |
| /run-tests     | Run all test files to verify code correctness        |
```
