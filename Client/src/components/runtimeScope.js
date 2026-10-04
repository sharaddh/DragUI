import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Libraries admin-created components may import - import lines are stripped,
// so every identifier they reference must exist in the live scope.
export const RUNTIME_SCOPE_LIBS = { motion, AnimatePresence, confetti };