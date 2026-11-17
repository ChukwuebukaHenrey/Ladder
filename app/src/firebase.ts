// Firebase setup. App Check MUST be initialised before getAI(), otherwise
// AI requests go out without an App Check token and fail with 403.
import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { getAI, GoogleAIBackend } from 'firebase/ai'

const env = import.meta.env

// The web config is public by design (it ships inside every web app).
export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

export const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId)

// Local development only: the debug token lives in .env.local (git-ignored)
// and must also be registered in Firebase console > App Check > Manage debug tokens.
if (env.DEV) {
  ;(self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN =
    env.VITE_APPCHECK_DEBUG_TOKEN || true
}

function init() {
  if (!isConfigured) return null
  const app = initializeApp(firebaseConfig)
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(env.VITE_RECAPTCHA_SITE_KEY ?? ''),
    isTokenAutoRefreshEnabled: true,
  })
  const ai = getAI(app, { backend: new GoogleAIBackend() })
  return { app, ai }
}

export const firebase = init()

// Cloud model used when the device can't run Gemini Nano.
// Default matches the SDK's own default for hybrid inference.
export const CLOUD_MODEL = env.VITE_GEMINI_CLOUD_MODEL || 'gemini-3.5-flash-lite'
