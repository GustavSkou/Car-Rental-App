This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Project Context

- **App:** Peer-to-Peer Car Rental Mobile App (SDU Mobile Software Development, Fall 2026).

## UI & Design System Tokens (Plane 5.1 Strict Compliance)

Never hallucinate or use default Tailwind / raw hex colors outside these approved tokens:

### Colors

- `Background`: `#FFFFFF`
- `Surface (cards/inputs)`: `#F4F5F6`
- `Primary (text/main buttons)`: `#111418`
- `Secondary Text`: `#5A6272`
- `Accent`: `#F2A93B` (**Reserved exclusively** for "Request a car" and active states; must use dark text)
- `Error`: `#C8281E`
- `Success`: `#0F7F40`

### Spacing & Metrics

- 4-pt spacing grid only: `4`, `8`, `12`, `16`, `24`, `32`.
- Screen horizontal padding: `16`.
- Card & image border-radius: `16`.
- Minimum touch target for interactive elements: **44 x 44 pt**.
- Typography: Apple SF Pro using standard Dynamic Type scales.

## Agent Prohibitions

- **No Unbounded States:** Always implement **Loading**, **Empty**, **Error**, and **Offline** states for data-driven screens
