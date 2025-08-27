# JetBrains Junie and Google Jules Instructions for AI Next Supabase

This file provides comprehensive guidance for JetBrains Junie, Google Jules, and other AI-assisted development tools when working with the AI Next Supabase codebase.

**Note:** This file is mirrored at `.github/guidelines.md`. Any changes made to one file **must** be duplicated in the other.

---

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

---

## 🏗️ Project Architecture Overview

### Core Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **State Management**: React Context, **Formik** for forms
- **Routing**: Next.js App Router
- **Styling**: **Tailwind CSS** for a utility-first approach
- **Icons**: **Lucide** from **React Icons**
- **Database**: Supabase
- **Testing**: Jest with React Testing Library
- **Node Version**: 22.11.x (required)

### Business Domain

This is a template with two primary user types:

1.  **User-Facing**
    - Exposes features to standard users.

2.  **Admin**
    - Admin and super admin system administration, and data management.

---

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
│   └── common/        # Shared hooks, components, etc.
│       ├── hooks/
│       └── ...
├── lib/               # Shared libraries, utilities, and SDK
│   ├── api/           # Core API client setup
│   ├── sdk/           # Data interaction layer
│   │   ├── models/    # TypeScript models/types for entities
│   │   ├── fetchers/  # Functions for retrieving data
│   │   ├── creators/  # Functions for creating new data
│   │   ├── updaters/  # Functions for updating existing data
│   │   └── deleters/  # Functions for deleting data
│   ├── supabase/      # Supabase client and helpers
│   └── ui-kit/        # Shared UI components
├── styles/            # Global styles (e.g., Tailwind base styles)
└── __mocks__/         # Jest mocks
```

### File Naming Conventions

- **MUST** suffix constants files with `-constants.ts`.
- **MUST** suffix helper files with `-helpers.ts`.
- **RATIONALE**: This provides a consistent naming scheme across the codebase, making it easier to identify the purpose of files at a glance.

### Constants Naming Convention
- **MUST** use `UPPER_SNAKE_CASE` for all constants defined in `.ts` files.
- **AVOID** using camelCase or PascalCase for constant names outside of React components.
- **RATIONALE**: This is a widely-accepted convention for defining constants and makes them easily distinguishable from other variables.

### Logic in Render
- **MUST** define elaborated constants and methods before the `return` statement.
- **AVOID** placing complex logic directly in the render block.
- **RATIONALE**: This improves readability and separates logic from the view.

<!-- end list -->

```tsx
// ❌ Incorrect - Logic inside useFormik
export const LoginProvider = ({ children }: LoginProviderProps) => {
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const formikInstance = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: getValidationSchema(),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error) setError(error);
      else router.push(PATHS.app);
      setSubmitting(false);
    },
  });
  // ...
};

// ✅ Correct - Logic extracted to a separate function
export const LoginProvider = ({ children }: LoginProviderProps) => {
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) setError(error);
    else router.push(PATHS.app);
    setSubmitting(false);
  };

  const formikInstance = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: getValidationSchema(),
    onSubmit,
  });
  // ...
};
```

```tsx
// ❌ Incorrect - clsx call inside JSX
const AppLayout = ({ children }: AppLayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={clsx('fixed...', { 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen })}
      >
        ...
      </div>
      ...
    </div>
  );
};

// ✅ Correct - className defined in a constant
const AppLayout = ({ children }: AppLayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarClassName = clsx('fixed...', { 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen });

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={sidebarClassName}>
        ...
      </div>
      ...
    </div>
  );
};
```

```
// ✅ Correct
├── constants/
│   └── signup-constants.ts
├── helpers/
│   └── validation-helpers.ts
```

### Component Structure Convention

- **MUST** keep a flat structure for components within the `components` directory of a feature.
- **AVOID** creating a separate folder for each component, even if they are related. A folder should only be used to group a component and its dedicated, non-reusable child components.
- **RATIONALE**: This avoids deep nesting and makes components easier to find.

<!-- end list -->

```tsx
// ✅ Correct
export const PATHS = {
  login: '/login',
  app: '/app',
};

// ❌ Incorrect
export const paths = {
  login: '/login',
  app: '/app',
};
```

```
// ✅ Correct (Simple or Complex Component)
components/
├── Button.tsx
└── Button.test.tsx
├── ButtonIcon.tsx
└── ButtonIcon.test.tsx
```

```
// ❌ Incorrect
components/
└── Button/
    ├── Button.tsx
    └── Button.test.tsx
└── ButtonIcon/
    ├── ButtonIcon.tsx
    └── ButtonIcon.test.tsx
```

---

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

#### `yup` Import Casing
- **MUST** import `yup` in all lowercase.
- **RATIONALE**: Ensures consistency across the codebase.

<!-- end list -->
```tsx
// ✅ Correct
import * as yup from 'yup';

// ❌ Incorrect
import * as Yup from 'yup';
```

### ⚛️ React & Next.js Standards

#### `use client` Directive

- **MUST** use the `"use client";` directive at the top of files for components that rely on state, hooks, or event listeners.
- **RATIONALE**: The App Router defaults to server components; this directive correctly marks a component for client-side rendering.

#### Import Strategy

- **MUST** use individual imports for tree-shaking optimization.
- **AVOID** using the `React.` notation (e.g., `React.ReactNode`). Import types directly (e.g., `import type { ReactNode } from 'react';`).
- Importing `React` itself is **not mandatory** in Next.js components.

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

#### Component Export
- **MUST** use default exports for components.
- **AVOID** exporting components on the `const` definition line.
- **RATIONALE**: Enforces a consistent module structure.

<!-- end list -->
```tsx
// ✅ Correct
const MyComponent = () => {
  return <div>Content</div>;
};
export default MyComponent;

// ❌ Incorrect
export const MyComponent = () => {
  return <div>Content</div>;
};
```

#### `PropsWithChildren` Convention
- **PREFER** using a type alias with `PropsWithChildren` for components that accept `children`.
- **RATIONALE**: This provides a consistent and extensible pattern for typing components with children.

<!-- end list -->
```tsx
// ✅ Correct
import type { PropsWithChildren } from 'react';

type MyComponentProps = PropsWithChildren<{
  // other props
}>;

// ✅ Also correct, for components with only children
type MySimpleComponentProps = PropsWithChildren<{}>;

const MyComponent = ({ children }: MySimpleComponentProps) => {
  return <div>{children}</div>;
};

// ❌ Incorrect - Inline typing
const MyComponentWithInlineTyping = ({ children }: PropsWithChildren) => {
  return <div>{children}</div>;
};
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
    <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
```

#### `PropsWithChildren` Convention

- **PREFER** using a type alias with `PropsWithChildren` for components that accept `children`.
- **RATIONALE**: This provides a consistent and extensible pattern for typing components with children.

<!-- end list -->

```tsx
// ✅ Correct
import type { PropsWithChildren } from 'react';

type MyComponentProps = PropsWithChildren<{
  // other props
}>;

const MyComponent = ({ children, ...otherProps }: MyComponentProps) => {
  return <div>{children}</div>;
};

// Also correct, for components with only children
type MySimpleComponentProps = PropsWithChildren;

const MySimpleComponent = ({ children }: MySimpleComponentProps) => {
  return <div>{children}</div>;
};
```

### 🎨 Styling Standards

#### Text Formatting

- **USE** Tailwind CSS utility classes like `font-bold` for bold text
- **RATIONALE**: This is the standard, utility-first approach for styling in this project. Avoid `<b>` or `<strong>` tags unless they carry semantic meaning.

<!-- end list -->

### Conditional ClassNames
- **MUST** use a library like `clsx` to handle conditional class names.
- **AVOID** using ternary operators for conditional classes in JSX.
- **RATIONALE**: Improves readability and maintainability of complex class logic.

<!-- end list -->

### Layout and Spacing
- **MUST** use `grid` with `gap` for layout and spacing between elements.
- **AVOID** using margins (e.g., `mt-4`, `mb-2`) on individual components.
- **MUST** reset default margins on semantic tags (e.g., `h1`, `p`) by using `m-0`.
- **RATIONALE**: Using a grid system with gaps provides more consistent and predictable spacing than individual margins, which can sometimes stack or collapse unexpectedly.

<!-- end list -->

```tsx
// ❌ Incorrect - Using margins
const MyComponent = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Title</h1>
      <p className="text-gray-600 mt-2">Some text here.</p>
      <button className="mt-4">Click me</button>
    </div>
  );
};

// ✅ Correct - Using grid and gap
const MyComponent = () => {
  return (
    <div className="grid gap-2.5">
      <h1 className="text-2xl font-bold m-0">Title</h1>
      <p className="text-gray-600 m-0">Some text here.</p>
      <button>Click me</button>
    </div>
  );
};
```

```tsx
// ✅ Correct
import clsx from 'clsx';

const MyComponent = ({ isActive, isPrimary }) => {
  const className = clsx('base-class', {
    'active-class': isActive,
    'primary-class': isPrimary,
  });
  return <div className={className}>...</div>;
};

// ❌ Incorrect
const MyComponentWithTernary = ({ isActive, isPrimary }) => {
  return <div className={`base-class ${isActive ? 'active-class' : ''} ${isPrimary ? 'primary-class' : ''}`}>...</div>;
};
```

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

- **MUST** prefer absolute paths using configured aliases (`@/`) for imports outside of the current feature module.
- **ALLOW** relative paths for imports within the same feature module (e.g., `../helpers`).
- **AVOID** deep relative paths (`../../../`).

#### Route Management
- **MUST** use the `paths` object from `src/app/paths.ts` for all internal navigation links.
- **AVOID** hardcoding route strings directly in components or hooks.
- **RATIONALE**: Centralizing path definitions makes the codebase easier to maintain and prevents broken links when routes change.

```tsx
// ✅ Correct
import { PATHS } from '@/app/paths';
// ...
router.push(PATHS.app);
```

```tsx
// ❌ Incorrect
router.push('/app');
```

---

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
  'use client';
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
  'use client';
  const [isLoading, setIsLoading] = useState(false);

  // ❌ BAD: Refactored existing code to use useCallback (not requested)
  const handleSubmit = useCallback(
    async (formData) => {
      setIsLoading(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsLoading(false);
      }
    },
    [onSubmit],
  );

  // ❌ BAD: Refactored existing JSX structure (not requested)
  const renderSubmitButton = useMemo(
    () => (
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    ),
    [isLoading],
  );
  return (
    <form onSubmit={handleSubmit}>
      {/* existing form fields */}
      {renderSubmitButton}
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

---

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

---

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

  return <MyFormContext.Provider value={contextValue}>{children}</MyFormContext.Provider>;
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

---

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

---

## 🌐 Integration Points

### API Configuration

- **Supabase** endpoint and keys
- **SDK** located in `src/lib/sdk/`

### Environment Variables

- `NODE_ENV` - development/production
- `NEXT_PUBLIC_*` - Environment-specific client-side variables
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase API key

---

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

---

## 📚 Additional Resources

- **Feature Examples**: Look in `src/features/` for established patterns
- **SDK**: Check `src/lib/sdk/` for data interaction patterns
- **Layout System**: Review `src/app/` for Next.js layout patterns
- **Testing Examples**: See existing `.test.tsx` files for testing approaches

---

_This document should be referenced for all AI-assisted development to ensure consistency, quality, and preservation of existing functionality._
