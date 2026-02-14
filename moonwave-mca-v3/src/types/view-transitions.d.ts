// Type declarations for View Transitions API
// https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition

interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition(): void;
}

interface Document {
  startViewTransition?(callback: () => void | Promise<void>): ViewTransition;
}
