# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm start                        # Start Expo dev server
npm run dev                      # Dev server with localhost + cache reset
npm run android / ios / web      # Platform-specific dev builds

# Quality
npm run lint                     # Expo linter
npm test                         # Jest with coverage
npm run test:ci                  # Jest CI mode

# EAS Builds
npm run build:android:preview    # Android preview build via EAS
npm run build:android:production # Android production build
npm run build:ios:preview        # iOS preview build
npm run build:ios:production     # iOS production build

# Release
npm run release:patch/minor/major  # Bump version, tag, and push
```

## Architecture

### Routing & Navigation

Expo Router (file-based) with two tab groups:
- `app/(tabs)/` — Student routes: `home`, `classes`, `books`, `fees`, `progress_sheet`, `settings`
- `app/(tabsT)/` — Teacher routes: `homeTeacher`, `booksTeacher`, `reservationsTeacher`, `settings`

`app/index.tsx` reads from the Zustand auth store and redirects to the correct tab group based on `status` and `user.role`. During `pending` status it shows a loading animation.

`app/_layout.tsx` initializes fonts and wraps everything in `AppProvider`.

### Provider Stack

`AppProvider` (`src/context/AppProvider.tsx`) composes providers in order:
`PermissionsProvider` → `AuthProvider` → `AlertProvider`

`AuthProvider` checks `firebase/auth` state on mount, fetches the current user from Firestore, and syncs to the Zustand auth store. This is the single source of truth for authentication.

### State Management

Zustand stores live in `src/store/[domain]/[domain].store.ts`. The auth store persists to AsyncStorage. All other stores are in-memory.

Typical store pattern:
```typescript
create<State & Actions>(persist(set => ({
  // state
  // actions that call services and update state
}), { name: 'store-key', storage: createJSONStorage(() => AsyncStorage) }))
```

### Service Layer

`src/services/[domain]/[domain].service.ts` — All Firebase (Auth, Firestore, Storage) and external API calls go here. Stores call services; components call stores or services via hooks.

Low-level Firestore helpers (`src/helpers/firestoreHelper.ts`) provide typed wrappers:
`createDocument`, `getDocumentById<T>`, `getQueryDocuments<T>`, `updateDocument`, `deleteDocument`.

### Firebase Collections

Collection names are in `src/constants/ContantsFirebase.ts`. Firebase is initialized natively via `@react-native-firebase/*` (not the JS SDK).

### REST API

Axios instance at `src/api/api.ts`, base URL points to `countriesnow.space` for country/city data used in registration forms.

### Component Organization

Components in `src/components/[category]/` with barrel exports via `index.ts`. Screens in `src/screen/[role]/` consume these components and call stores/services.

### Theming

`theme/Theme.ts` defines `LightTheme` and `DarkTheme` for React Native Paper. `app/theme/theme.ts` exports NativeWind-compatible tokens. Auto-switches via `useColorScheme()`.

### TypeScript Path Alias

`@/*` maps to the repo root (configured in `tsconfig.json`).

### Form Validation

React Hook Form + Zod. Schemas are co-located with interfaces in `src/interfaces/`. `RegisterSchema` and `ProfileSchema` are the primary validation schemas.

### CI/CD

EAS Build via GitHub Actions. See `CI-CD-SETUP.md` for environment variable and secrets setup. The `eas.json` profiles: `development`, `preview`, `production`, `production-apk`.

### Feature Specs

Active design specs live in `.kiro/specs/` (e.g., `vcard-redesign/`). Check there for planned work before modifying those screens.
