# JetBrains Junie and Google Jules Instructions for AI Next Supabase

This file provides comprehensive guidance for JetBrains Junie, Google Jules, and other AI-assisted development tools when working with the AI Next Supabase codebase.

-----

## 🚀 Quick Start Commands

### Development Server

  - `npm run dev` - Development server on http://localhost:3000

### Build & Testing

  - `npm run build` - Production build
  - `npm run start` - Start production server
  - `npm run test` - Run Jest tests
  - `npm run test:watch` - Run tests in watch mode
  - `npm run test:coverage` - Run tests with coverage
  - `npm run test -- -u` - Update test snapshots

### Code Quality

  - `npm run lint` - Run ESLint (max 0 warnings)
  - `npm run lint:fix` - Run ESLint with auto-fix

### Single Test Commands

  - `npm run test path/to/test.test.js` - Run specific test files
  - `npm run test --testNamePattern="pattern"` - Run tests matching pattern
  - `npm run test:debug path/to/test.test.js` - Debug specific test

-----

## 🏗️ Project Architecture Overview

### Core Technology Stack

  - **Frontend**: Next.js 15 with TypeScript
  - **State Management**: React Context, **Formik** for forms
  - **Routing**: Next.js App Router
  - **Styling**: **Tailwind CSS** for a utility-first approach
  - **Database**: Supabase
  - **Testing**: Jest with React Testing Library
  - **Node Version**: 22.11.x (required)

### Business Domain

This is a template with two primary user types:

1.  **User-Facing**

      - Exposes features to standard users.

2.  **Admin**

      - Admin and super admin system administration, and data management.

-----

## 📁 Directory Structure & Organization

### Core Directories

```
src/
├── app/               # Next.js App Router for pages and routes
│   ├── (user)/        # User-facing routes
│   ├── (admin)/       # Administrative routes
│   └── layout.tsx     # Root layout file
├── features/          # Feature-based modules
│   ├── sample-a/      # Example: Feature A
│   │   ├── components/
│   │   ├── constants/
│   │   ├── contexts/
│   │   ├── helpers/
│   │   ├── hooks/
│   │   └── types/
│   └── sample-b/      # Example: Feature B
│       ├── components/
│       ├── ...
├── lib/               # Shared libraries, utilities, and SDK
│   ├── api/           # Core API client setup
│   ├── sdk/           # Data interaction layer
│   │   ├── models/    # TypeScript models/types for entities
│   │   ├── fetchers/  # Functions for retrieving data
│   │   ├── creators/  # Functions for creating new data
│   │   ├── updaters/  # Functions for updating existing data
│   │   └── deleters/  # Functions for deleting data
│   └── supabase/      # Supabase client and helpers
├── styles/            # Global styles (e.g., Tailwind base styles)
└── __mocks__/         # Jest mocks
```

### Component Structure Convention

Follow the established folder-per-component pattern within each feature's `components` directory:

```
ComponentName/
├── ComponentName.tsx      # Main component file
├── ComponentName.test.tsx # Unit tests
└── components/            # Child components specific to this component
    └── ChildComponent/
```

-----

## 🎯 Development Standards & AI Coding Guidelines

### 🏗️ TypeScript Standards

#### Type Declarations

  - **PREFER** `type` over `interface` for defining object shapes
  - **RATIONALE**: Better for union types and computed properties

<!-- end list -->

```tsx
// ✅ Preferred
type UserData = {
    id: string;
    name: string;
    email: string;
};

// ❌ Avoid
interface UserData {
    id: string;
    name: string;
    email: string;
}
```

#### Entity Type Management

**BEFORE** creating new entity models:

1.  **CHECK** `src/lib/sdk/models/` for existing models
2.  **REUSE** existing models when suitable
3.  **CREATE** new models only when necessary
4.  **FOLLOW** existing patterns in `src/lib/sdk/models/` as templates

### ⚛️ React & Next.js Standards

#### `use client` Directive

  - **MUST** use the `"use client";` directive at the top of files for components that rely on state, hooks, or event listeners.
  - **RATIONALE**: The App Router defaults to server components; this directive correctly marks a component for client-side rendering.

#### Import Strategy

  - Importing `React` is **not mandatory** in Next.js components, but it can be included if needed.
  - **Use individual imports** for tree-shaking optimization.

#### Component Definition

  - **MUST** use arrow function syntax

<!-- end list -->

```tsx
// ✅ Correct
const MyComponent = ({ prop1, prop2 }: MyComponentProps) => {
    return <div>Content</div>;
};

// ❌ Avoid FC<> wrapper
// const MyComponent: FC<MyComponentProps> = ({ prop1, prop2 }) => { ... };
```

#### Props Typing

  - **NAMING**: `<ComponentName>Props` convention
  - **APPLICATION**: Apply type directly to destructured props (no `FC` wrapper)

<!-- end list -->

```tsx
// ✅ Correct approach
type ButtonProps = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
};

const Button = ({ label, onClick, disabled = false }: ButtonProps) => {
    return (
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                onClick={onClick}
                disabled={disabled}>
            {label}
        </button>
    );
};
```

### 🎨 Styling Standards

#### Text Formatting

  - **USE** Tailwind CSS utility classes like `font-bold` for bold text
  - **RATIONALE**: This is the standard, utility-first approach for styling in this project. Avoid `<b>` or `<strong>` tags unless they carry semantic meaning.

<!-- end list -->

```jsx
// ✅ Preferred
<span className="font-bold">Important text</span>

// ❌ Avoid
<b>Important text</b>
```

### 📁 Import Path Standards

#### Available Import Aliases

Use these configured import aliases from `tsconfig.json`:

```tsx
// ✅ Use these absolute paths
import { Button } from '@/features/sample-a/components/Button/Button';
import { useSampleAuth } from '@/features/sample-a/hooks/useSampleAuth';
import { API_ENDPOINTS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { userModel } from '@/lib/sdk/models';
import { fetchUsers } from '@/lib/sdk/fetchers';
```

#### Complete Import Alias Reference

  - `@/app/*` - Next.js App Router
  - `@/features/*` - Feature-based modules
  - `@/lib/*` - Constants, utils, types, and services
  - `@/lib/sdk/*` - SDK for data interaction (models, fetchers, etc.)
  - `@/lib/supabase/*` - Supabase client and helpers
  - `@/styles/*` - Global styles
  - `@/tests/*` - Test helpers and fixtures

#### Path Resolution Guidelines

  - **PREFER** absolute paths using configured aliases
  - **ALLOW** relative paths for same-level or up to 2 levels up (`../..`)
  - **AVOID** deep relative paths (`../../../`)

-----

## 🚨 **CRITICAL: Non-Regression & Code Preservation Principles**

### Core Principle

**AI-generated code MUST NOT introduce regressions or unintended refactors unless explicitly requested.** This means:

1.  **Preserve existing functionality exactly as-is**
2.  **Maintain existing code patterns and conventions**
3.  **Only modify what is specifically requested**
4.  **Do not "improve" or "optimize" unrequested code**

### ✅ Acceptable Changes (Examples)

#### When asked to "Add a loading state to the LoginForm component":

```tsx
// ✅ GOOD - Only adds the requested loading state
const LoginForm = ({ onSubmit }: LoginFormProps) => {
    "use client";
    const [isLoading, setIsLoading] = useState(false); // ← NEW: Added loading state

    // ...existing form state code remains unchanged...

    const handleSubmit = async (formData) => {
        setIsLoading(true); // ← NEW: Set loading
        try {
            await onSubmit(formData);
        } finally {
            setIsLoading(false); // ← NEW: Clear loading
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* ...existing form JSX remains unchanged... */}
            <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
                {isLoading ? 'Logging in...' : 'Login'}
                {/* ← NEW: Loading text */}
            </button>
        </form>
    );
};
```

### ❌ Unacceptable Changes (Examples)

#### When asked to "Add a loading state" - DON'T do this:

```tsx
// ❌ BAD - Introduces unrequested refactors
const LoginForm = ({ onSubmit }: LoginFormProps) => {
    "use client";
    const [isLoading, setIsLoading] = useState(false);

    // ❌ BAD: Refactored existing code to use useCallback (not requested)
    const handleSubmit = useCallback(async (formData) => {
        setIsLoading(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsLoading(false);
        }
    }, [onSubmit]);

    // ❌ BAD: Refactored existing JSX structure (not requested)
    const renderSubmitButton = useMemo(() => (
                <button type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            ),
            [isLoading]
        )
    ;

    return (
        <form onSubmit={handleSubmit}>
            {/* existing form fields */}
            {
                renderSubmitButton
            }
        </form>
    );
};
```

### Implementation Guidelines

1.  **Read the existing code carefully** before making changes
2.  **Identify the minimal change** required to fulfill the request
3.  **Preserve existing patterns** (function vs arrow functions, class vs functional components, etc.)
4.  **Keep existing variable names, method signatures, and data structures**
5.  **Don't update imports unless necessary** for the specific change
6.  **Don't refactor surrounding code** even if it could be "improved"
7.  **Test that your changes don't break existing functionality**

### Exception: When Refactoring IS Requested

Only perform broader changes when explicitly asked with terms like:

  - "Refactor this component"
  - "Optimize this code"
  - "Update this to follow new patterns"
  - "Modernize this component"

-----

## 🧪 Testing Strategy

### Testing Framework

  - **Jest** with React Testing Library
  - Test files co-located with components (`.test.js` or `.test.tsx`)
  - Mocks directory at `src/__mocks__/` for module mocks
  - Test setup in `jest.setup.js`

### Testing Guidelines

1.  **Import** `@testing-library/jest-dom` for enhanced matchers
2.  **Test behavior, not implementation**
3.  **Cover happy path and error cases**

### Example Test Structure

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import Button from '@/features/sample-a/components/Button/Button';

describe('Button Component', () => {
    it('renders with correct text', () => {
        render(<Button label="Click me" onClick={jest.fn()} />);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const mockClick = jest.fn();
        render(<Button label="Click me" onClick={mockClick} />);

        fireEvent.click(screen.getByText('Click me'));
        expect(mockClick).toHaveBeenCalledTimes(1);
    });
});
```

-----

## 📋 **Form Building & Component Development Standards**

### Core Form Building Principle

**ALWAYS use Formik for form handling in new components.** This ensures consistent form state management, validation, and user experience across the platform.

### 🔧 Formik Integration Pattern

#### Form Context Pattern

When building forms, **ALWAYS** create a context provider that manages:

```tsx
// ✅ GOOD - Context provider with Formik instance
type MyFormContextProps = {
    formikInstance: FormikInstanceType<MyFormType>;
    isLoading: boolean;
    onSubmit: (values: MyFormType) => void;
    // Additional form-related state and functions
};

const MyFormContext = createContext<MyFormContextProps>({} as MyFormContextProps);

const MyFormProvider = ({ children }: PropsWithChildren) => {
    const [isLoading, setIsLoading] = useState(false);
    const formikInstance = useFormik<MyFormType>({
        initialValues: getInitialValues(),
        validationSchema: getValidationSchema(),
        onSubmit: handleSubmit,
    });

    const contextValue = {
        formikInstance,
        isLoading,
        onSubmit: handleSubmit,
    };

    return (
        <MyFormContext.Provider value={contextValue}>
            {children}
        </MyFormContext.Provider>
    );
};
```

#### Form Component Pattern

Form components should be minimal and focused:

```tsx
// ✅ GOOD - Minimal form component using context
const MyForm = ({ readOnly = false }: MyFormProps) => {
    const { formikInstance, isLoading } = useContext(MyFormContext);
    const { values, errors } = formikInstance;

    return (
        <form>
            <FormControl label="Field Label">
                <SomeFormField
                    value={values.fieldName}
                    onChange={(value) => formikInstance.setFieldValue('fieldName', value)}
                    error={errors.fieldName}
                    disabled={isLoading || readOnly}
                />
            </FormControl>
        </form>
    );
};
```

### 🎯 Component Development Guidelines

#### 1\. Context Usage is Mandatory

  - **MUST** use React Context for logical abstractions
  - **DON'T** create custom hooks that simply wrap `useContext`
  - **DO** use context to share form state, loading states, and related functionality

<!-- end list -->

```tsx
// ✅ GOOD - Direct context usage
const MyComponent = () => {
    const { formikInstance, isLoading } = useContext(MyFormContext);
    // ...component logic
};
```

```tsx
// ❌ BAD - Unnecessary custom hook wrapper
const useMyForm = () => useContext(MyFormContext);
const MyComponent = () => {
    const { formikInstance, isLoading } = useMyForm();
    // ...component logic
};
```

#### 2\. SDK Integration Pattern

  - **USE** the SDK functions (`fetchers`, `creators`, etc.) for all data interactions.
  - **INTEGRATE** SDK calls within feature hooks or directly in handlers.

<!-- end list -->

```tsx
import { createUser } from '@/lib/sdk/creators';

const MyFormProvider = ({ children }: PropsWithChildren) => {
    // A feature hook might fetch initial data using an SDK fetcher
    const { data, isLoading } = useSomeFeatureData();

    const formikInstance = useFormik({
        initialValues: getInitialValues(data),
        validationSchema: getValidationSchema(),
        onSubmit: async (values) => {
            // ✅ GOOD - Using an SDK creator on submit
            await createUser(values);
        },
    });

    // ...rest of provider
};
```

#### 3\. Component Optimization

  - **MINIMIZE** props to essential data only
  - **OPTIMIZE** for reusability
  - **AVOID** passing complex objects when simple values suffice

<!-- end list -->

```tsx
// ✅ GOOD - Minimal, optimized props
type ButtonProps = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
};

// ❌ BAD - Overly complex props
type ButtonProps = {
    formState: ComplexFormState;
    config: ButtonConfiguration;
    handlers: EventHandlers;
};
```

#### 4\. Constants and Helpers

  - **ALWAYS** create constants for form field definitions
  - **ALWAYS** create helper functions for complex logic
  - **ALWAYS** add tests for helper functions

### 📋 Form Development Checklist

When creating new forms, ensure:

  - [ ] **Formik Integration**: Form uses `useFormik` hook with proper validation schema
  - [ ] **Context Provider**: Created for managing form state and related logic
  - [ ] **Minimal Components**: Form components are focused and reusable
  - [ ] **SDK Integration**: Uses SDK functions for data interaction
  - [ ] **Constants**: Form field definitions in a constants file
  - [ ] **Helpers**: Complex logic extracted to helper functions
  - [ ] **Helper Tests**: All helper functions have comprehensive tests
  - [ ] **Type Safety**: TypeScript types defined for form values and props
  - [ ] **Error Handling**: Proper error display and validation feedback
  - [ ] **Loading States**: Loading indicators during form submission

### 🔍 Form Development Anti-Patterns

#### ❌ What NOT to do:

```tsx
// ❌ BAD - No Formik integration
const MyForm = () => {
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    // Manual form state management
};

// ❌ BAD - Unnecessary hook wrapper for context
const useMyFormContext = () => {
    const context = useContext(MyFormContext);
    if (!context) throw new Error('Must be used within provider');
    return context;
};

// ❌ BAD - No helper functions, complex inline logic
const MyComponent = () => {
    const validationSchema = yup.object().shape({
        // Complex validation logic directly in component
    });
};
```

-----

## 🔗 Key Architectural Patterns

### Component Patterns

  - Use arrow functions for custom methods
  - Use double arrow functions for dynamic props to prevent re-renders
  - Destructure props when using multiple properties
  - New components MUST be in TypeScript (`.tsx`)
  - Use React Context Providers for global state management where appropriate

### Styling Conventions

  - **Tailwind CSS** utility classes for component-level styling
  - Global styles in `src/styles/globals.css`
  - Use existing Tailwind configuration and plugins

### State Management

  - **React Context** for global state and data sharing
  - **SWR** or similar libraries for data fetching and caching
  - **Formik** for local component form state

-----

## 🌐 Integration Points

### API Configuration

  - **Supabase** endpoint and keys
  - **SDK** located in `src/lib/sdk/`

### Environment Variables

  - `NODE_ENV` - development/production
  - `NEXT_PUBLIC_*` - Environment-specific client-side variables
  - `SUPABASE_URL` - Supabase project URL
  - `SUPABASE_KEY` - Supabase API key

-----

## ✅ Code Review Checklist

Before submitting any AI-generated code, ensure:

  - [ ] **Non-regression**: Only requested changes made, no unintended refactors
  - [ ] **TypeScript**: Uses `type` instead of `interface` where applicable
  - [ ] **React imports**: `"use client"` directive present where needed
  - [ ] **Component syntax**: Uses arrow function syntax
  - [ ] **Props typing**: Follows `ComponentNameProps` convention
  - [ ] **Import paths**: Uses absolute paths with configured aliases
  - [ ] **Styling**: Uses Tailwind classes for styling, not deprecated HTML tags
  - [ ] **Types**: Checked existing models in `src/lib/sdk/models/`
  - [ ] **Output**: Code is complete and ready to use
  - [ ] **Testing**: Tests added for new functionality
  - [ ] **Functionality**: Existing features work exactly as before

-----

## 📚 Additional Resources

  - **Feature Examples**: Look in `src/features/` for established patterns
  - **SDK**: Check `src/lib/sdk/` for data interaction patterns
  - **Layout System**: Review `src/app/` for Next.js layout patterns
  - **Testing Examples**: See existing `.test.tsx` files for testing approaches

-----

*This document should be referenced for all AI-assisted development to ensure consistency, quality, and preservation of existing functionality.*
