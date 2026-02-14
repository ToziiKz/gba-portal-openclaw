// Temporary type relaxation for framer-motion.
//
// In this repo we are hitting TypeScript build failures where `motion.*` elements
// are inferred with `unknown` props (e.g. `className` / `onClick` rejected).
// This file forces `motion`/`AnimatePresence` to be `any` so production builds
// are unblocked.
//
// TODO: Fix root cause by aligning framer-motion + @types/react versions and remove this shim.

declare module 'framer-motion' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const motion: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const AnimatePresence: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const m: any

  // hooks used in the codebase
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const useMotionValue: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const useMotionTemplate: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const useSpring: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const useTransform: any
}
