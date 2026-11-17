# Ladder: project brief (v3)

Written 17 November 2026. **This file is the single source of truth.** It replaces the "Evidence-Led Investigation and Build Verdict", the friend's v2 brief and `docs/brief-review.md` wherever they disagree. Paste it into a new chat to continue.

**Repo:** `ChukwuebukaHenrey/Ladder`, branch **`ccr-f02846ec-onsynf`**. Commit only there and never open a pull request unless asked.

---

## 0. What changed from v2 (and why)

| v2 said | v3 says | Why |
|---|---|---|
| Dictionary grounding: "decide on day 2" | **Dictionary first, AI second**, in version 1 | Without it, an offline phone or Private mode on a phone shows nothing, and the AI can invent meanings |
| AI on every tap | AI only when a word has more than one meaning; answers cached; daily limit per user | The free Gemini quota is shared by **all** users of the Firebase project |
| Save stores the source sentence in Firestore | Source sentence stays **on the device**; Firestore holds only word, meaning and review results | Shared text often comes from private WhatsApp chats |
| "I know / I don't know" counts in review | Only a correct **pick from four meanings** counts | Self-report isn't evidence of remembering |
| AI writes new review sentences | Dictionary example first; AI sentence only if the sense checker confirms the same meaning; else the original sentence with the word blanked | AI may use a different meaning ("bank" for money vs river) |
| Demo: "Wi-Fi off" on the cloud VM | Chrome DevTools > Network > **Offline** on the VM; airplane mode clip on the phone | Turning off the VM's network also cuts the remote-desktop link |
| Sign-in + sync are must-haves | Data stored on the device first; sign-in + sync only after the 25 Nov freeze | Scope: 12 days |
| SDK 12.5.0+ | Firebase JS SDK **13.4.0** is installed (≥ 12.7.0 needed for a correct `inferenceSource` when streaming) | Checked in the SDK source and release notes |
| Competitors: Rewordify / Read&Write in one line | Everway Read&Write analysed in section 12 | It overlaps more than v2 assumed |
| Builder learning test | **Dropped for now** (builder's decision). No claim of proven remembering | See section 12 |
| On-device demo on a $300-credit VM | **On hold** (credits not available). Options in section 5 | Builder's situation |

## 1. One-line definition

> **Select any text on your phone or laptop. Ladder tells you what the word means *in that sentence*, then brings the word back later so you remember it.**

Ladder is a reading companion, not a chatbot or a dictionary website. It does two things: the right meaning at the moment you're stuck, and later practice so the word stays.

## 2. Why it exists

- Readers hit unfamiliar words in course material, work documents and messages. Switching to a dictionary or chatbot breaks their reading, and dictionaries list every meaning without saying which one fits.
- Words looked up once are usually forgotten. Short recall later helps on delayed recall tests in controlled studies. That isn't proof for every setting (section 13).
- Many readers only have a phone, or a laptop too weak for on-device AI. **The core must work on any device**; AI makes it smarter where possible.

## 3. Who it's for (version 1)

**Adults 18+ who read English for study or work and get stuck on words**, especially people reading English as a second language (for example, students and workers in Nigeria).

- They must already read fluently. Ladder helps with *meaning*, not with sounding words out.
- **18+ is required:** the Gemini API terms and Google Cloud's Service Specific Terms §20(d) both bar apps aimed at, or likely to be used by, under-18s. Say "18+" in onboarding.
- **Children:** out of scope. A separate children's reader with no AI is parked until after 30 November.

## 4. The hackathon (#BuildHybridAI 2026)

From the Devpost page (17 Nov 2026):

- **Deadline:** 30 Nov 2026, 11:00 PM GMT+1 (Lagos). **Target: submit 29 Nov.**
- **Platform we enter:** Web (Chrome). The page lists "Gemini Nano 4 via Firebase AI Logic. Build a web app or a Chrome extension."
- **Core requirement:** the app runs prompts on-device when a local model is available and falls back to the cloud when it isn't, through the Firebase AI Logic hybrid SDK.
- **Must have:**
  - Firebase AI Logic imported and **called at runtime** in the code, not just named in the README.
  - **App Check.** Debug tokens are accepted in submissions.
  - Public GitHub repo with an open-source licence visible in the About section. MIT is present; Apache is "preferred" but not required.
  - YouTube video, **3 minutes or less**, English, showing the project working on its platform.
  - Text description: how Firebase AI Logic is used, the features, the value proposition.
  - **Free of charge** to use.
- **Strongly encouraged:** a hosted URL for judging; other Firebase products (App Check, Remote Config, Firestore, Auth).
- **Prizes:** $10k Grand, $7k, $4k, plus $3k **Best Web/Chrome App**. Apps on more than one platform get "strong consideration" for the Grand Prize.
- **Judging, equal weight:**
  - **Technological implementation:** how effectively hybrid inference is used.
  - **Design:** a complete product, not a proof of concept.
  - **Potential impact:** a specific real problem for a real audience, judged on what's demonstrated.
  - **Quality of the idea:** creative, with genuine understanding of the problem.
- **No secrets in the repo:** no debug tokens, no reCAPTCHA secret key, no service-account keys.

## 5. Hardware reality

- **The builder's laptop** (HP EliteBook 840 G2, 8 GB RAM, 2-core i5) **can't run Gemini Nano**. The builder's **Android 13 phone** can't either, because web pages on phones have no built-in model. Both are fine for building and testing the cloud path, and they represent typical users.
- **What Chrome's built-in model needs:** Chrome **139+ on desktop**; about 22 GB free disk; and either a GPU with more than 4 GB VRAM **or** 16 GB RAM with 4+ CPU cores.
- **No GPU is needed anywhere.** We never host a model.
- **Tried on the build machine (17 Nov):** Chromium only fakes the API (it echoes the prompt back). Google Chrome 158 reports `unavailable` (15 GB RAM, no GPU). The on-device path can't be tested there.
- **On-device testing and filming** happen on another machine, needed once around 23–27 Nov. In order of preference:
  1. Borrow any 16 GB laptop or M-series Mac for an hour.
  2. Google Cloud free trial VM (`e2-standard-8`, 8 vCPU, 32 GB RAM; about $0.25–0.30/hour from the $300 credit). **On hold:** credits aren't available yet. Use a separate GCP project, and stop the VM after each session. Not yet known whether Chrome enables the model inside a VM.
  3. Last resort: submit without on-device footage. The code still runs on-device for judges with capable machines. This loses points under technological implementation.

## 6. Platform

**One installable web app (PWA) on Firebase Hosting.** React + TypeScript + Vite, in `app/`.

| Where | How the reader gets help | Which AI answers |
|---|---|---|
| Android phone | Install from Chrome. Select text in **any app**, tap **Share**, then **Ladder** (Web Share Target) | Cloud, or no AI (dictionary only) |
| Capable laptop (Chrome 139+) | Open Ladder, paste or share text | On-device (Gemini Nano) |
| Weak laptop / other browser | Same | Cloud, or dictionary only |
| iPhone | Paste text (no Web Share Target on iOS) | Cloud, or dictionary only |

**Limits to state openly:**
- On Android it takes one extra tap through Share.
- Ladder can't underline words inside other apps; it only sees the text that was shared.
- If one bare word is shared, there's no sentence to work from, so Ladder asks for the whole sentence.

**Stretch (only if the core is done by 25 Nov):** a Chrome extension that underlines likely-unfamiliar words on web pages and opens the same core in a side panel.

## 7. Features

### Version 1 (must have)

1. **Meaning in context, dictionary first.** Shared or pasted text appears with tappable words. On tap:
   1. The **dictionary meaning appears instantly**, with no network needed: plain meaning, part of speech, one example.
   2. If the word has **more than one meaning**, the AI picks which one fits *this* sentence from the dictionary's top senses (A–D or NONE). The chosen meaning is highlighted, with the other meanings one tap away.
   3. If the AI says NONE or isn't available, Ladder shows all the meanings and the reader picks.
   4. A word that isn't in the dictionary gets an AI-written meaning, labelled **"AI-written"**.
2. **Hear the word (read-aloud).** Uses the browser's built-in voice (Web Speech API): no AI, no cost, works offline on most phones. Read&Write leads with read-aloud, and it helps readers who stumble on pronunciation.
3. **Explain this paragraph.** A plain-English explanation shown **beside the untouched original**, never replacing it.
4. **Save word.** Stores the word, the chosen meaning and the review history. The source sentence stays on the device only.
5. **Daily review.** Two or three saved words. Each card:
   1. shows the word in a sentence: the dictionary example for that meaning; otherwise an AI sentence that the sense checker confirms uses the same meaning; otherwise the original sentence with the word blanked;
   2. the reader thinks of the meaning (typing is optional);
   3. the reader **picks from four meanings**, and only this step counts.
   - "Learned" means correct on two different days (a 1-in-16 chance by guessing). "I know" and "Skip" exist but don't count. Learned words move down the list; help never disappears.
6. **Source label** on every AI answer: "On this device" or "Google cloud", read from `response.inferenceSource`, never assumed. "Dictionary" when no AI was used.
7. **Private mode.** On-device AI only; nothing is sent to the cloud and nothing syncs. On devices without Gemini Nano, the dictionary still works and AI features say plainly that they're unavailable.
8. **Daily AI limit per user**, for example 50 AI answers a day; after that, "AI limit reached for today, here are the dictionary meanings". The limit is set in Remote Config.
9. **Onboarding and consent.** States: 18+; what runs on the device vs in Google's cloud; that text sent to the cloud goes to Google, and on the free tier Google may use it to improve its products.

### Stretch (in order)

1. Sign-in (anonymous plus optional Google) and syncing words between phone and laptop through Firestore. **Don't sync source sentences.**
2. Chrome extension with underlining (section 6).
3. Pictures for concrete nouns from Wikimedia (no AI image generation).
4. Explanations in the reader's first language (Yoruba, Igbo, Hausa, Pidgin). Cloud only, and checked by a native speaker before shipping.

### Dropped (don't reintroduce)

- Quizzing *before* showing the meaning. Ladder tells first and asks later.
- Fading underlines as the selling point, or "the only tool that fades its help". Rewordify already does this.
- Child mode, Ada in the demo, and "serves the children Google excludes".
- Two-option multiple choice as proof of learning.
- Spanish, separate child/adult modes, the public-site allowlist.
- Any claim that Ladder "improves reading" or is "proven" to help memory.

## 8. How the AI is used

All AI goes through **Firebase AI Logic (web SDK)** with the **Gemini Developer API**.

**Verified in the installed SDK (13.4.0) and Firebase's hybrid docs, 17 Nov 2026:**
- Modes are `InferenceMode.PREFER_ON_DEVICE`, `ONLY_ON_DEVICE`, `ONLY_IN_CLOUD` and `PREFER_IN_CLOUD`. `response.inferenceSource` is `"on_device"` or `"in_cloud"`.
- `model.initializeDeviceModel(onProgress)` **must be called on or after a user interaction**. If it isn't and a download is needed, it errors. Hence the "Set up on-device AI" button.
- The default cloud model for hybrid is `gemini-3.5-flash-lite`. It can be overridden through Remote Config.
- **Limited-choice (enum) output:** in the cloud, `responseMimeType: 'text/x.enum'` with `responseSchema: Schema.enumString(...)`; on-device, the same schema as `onDeviceParams.promptOptions.responseConstraint`.
- On-device needs Chrome 139+ on desktop. **Not supported on-device:** multi-turn chat, tools or grounding, and AI monitoring in the console. Server prompt templates aren't supported in hybrid at all.
- **App Check must be initialised before `getAI()`.**

| Task | Mode | Notes |
|---|---|---|
| Pick the sense for this sentence | `PREFER_ON_DEVICE` (`ONLY_ON_DEVICE` in Private mode) | Enum A–D or NONE. Only when the word has more than one meaning. Cached per word and sentence |
| Explain a paragraph | `PREFER_ON_DEVICE` (`ONLY_ON_DEVICE` in Private mode) | If on-device explanations are clearly worse in testing, switch to `PREFER_IN_CLOUD` and say why in the README |
| Review sentence when no dictionary example exists | `PREFER_ON_DEVICE` | Must pass the sense checker |
| Meaning for a word not in the dictionary | `PREFER_ON_DEVICE` | Labelled "AI-written" |
| Underlining, scheduling, limits | Plain code | No AI |

**Rules:**
- Treat shared text as untrusted. No tools, length caps, and output rendered as plain text only.
- The original text is always visible next to an explanation.

## 9. Data

- **Dictionary:** Open English WordNet (CC BY 4.0; check the licence file when downloading). Trimmed by a build script to the roughly 30,000 most common words and their top 3–4 senses per part of speech. Shipped as static files that are cached for offline use. Keep the data licence in `app/public/dict/`.
- **Word frequency** (for deciding which words count as hard): a permissively licensed list. Choose it during the dictionary build and record its licence.
- **Stored on the device (IndexedDB):** saved words, chosen meanings, review results, source sentences, the AI answer cache and the daily counter.
- **Firestore (stretch only):** word, sense id and review results. Never source sentences, never in Private mode.
- **Never stored:** whole shared documents. No analytics in version 1. A "Clear my data" button removes everything.

## 10. Firebase products

| Product | Use | Version 1? |
|---|---|---|
| **AI Logic** | All inference, hybrid | Yes |
| **App Check** (reCAPTCHA v3) | Required for AI Logic. Debug token for development only, never committed | Yes |
| **Hosting** | Public URL for users and judges | Yes |
| **Remote Config** | Cloud model name, daily AI limit, feature switches, prompt text | Yes |
| **Auth + Firestore** | Sync between phone and laptop | Stretch |

All of this works on the free **Spark** plan.

## 11. Built so far (17 Nov)

- `app/`: Vite + React + TypeScript; `firebase`, `idb` and `vite-plugin-pwa` installed; builds cleanly.
- `app/src/firebase.ts`: config from `.env.local`, App Check before `getAI()`, Gemini Developer API backend.
- `app/src/ai/pickSense.ts`: the hybrid sense picker (enum A–D or NONE), source and time recorded.
- `app/src/App.tsx`: the **setup-check page**. It shows device status, the "Set up on-device AI" button with progress, a mode selector and five known-answer sentences with ✅/❌, time and source label.
- `firebase.json`: Hosting serves `app/dist` with SPA rewrites.
- **Waiting on the builder:** the Firebase web config and the reCAPTCHA v3 **site** key. Then the builder registers an App Check debug token that Claude provides, so the cloud path can be tested from the build machine.

## 12. Competitors and positioning

| Product | What it does | Where it beats Ladder | Where Ladder wins |
|---|---|---|---|
| **Everway Read&Write** (formerly Texthelp; Rewordify is part of it) | Read-aloud, dictionary, picture dictionary, vocabulary lists (a document with meanings and images), Rewordify (swaps hard words, stops once learned, learning sessions), AI Simplify and summary, translation. Windows, Mac, Chrome, Edge, iPad, Android. Schools: about $2.75–18 per seat; **individuals about $184 a year**; free for teachers; limited free version | Mature, trusted by schools, read-aloud, many platforms | Built for adults reading English as a second language, not Western schools; **free**; meaning for *this exact* sentence; brings words back in new sentences and checks recall; share from any app on the phone; on-device privacy |
| **Gemini app** / Circle to Search | Ask about any selected text | Free, smarter, already on many phones | One tap gives a short, consistent answer; picks from dictionary senses instead of inventing; **remembers your words and reviews them**; dictionary works offline; Private mode |
| **Readlang** | Click-to-translate, AI context explanations, flashcards. Free tier, then $6 or $15 a month | Translation into your own language; mature | English explanations for readers schooled in English; free on-device use |
| **Gemini in Chrome** | Explains the page on request | Built in, strong model | No asking needed; private on-device; review |
| **Edge Immersive Reader** | Read-aloud, picture dictionary, translation | Free, built in | Any learning loop at all |

**Positioning line:**
> *Read&Write is built for schools and costs about $184 a year. Gemini answers a question and forgets it. Ladder is free, works from the phone in your pocket, gives the meaning for your exact sentence, and brings your words back until you know them.*

**Don't claim:** the only app that explains words in context; the only app that helps you remember words; that Ladder improves reading.

## 13. What we can and can't claim

- **Can claim:**
  - the right meaning for the sentence, inside your reading flow
  - works on any phone or laptop (dictionary everywhere, AI where available)
  - private on-device processing where the hardware allows
  - a **measured accuracy figure** on our labelled test set
- **Can't claim (yet):** proven gains in memory or reading, literacy teaching, suitability for children. Say: "designed to help you remember the words you look up. A retention study is next."
- **Research basis:**
  - Glossed reading teaches more words than plain reading (Yanagisawa et al. 2020, 42 studies of second-language learners).
  - Retrieval practice helped on a delayed recall test in a controlled study (Goossens et al. 2014), but neither retrieval nor spacing helped in a multi-classroom study (Goossens et al. 2016).
  - Vocabulary teaching lifts general comprehension only slightly (Elleman et al. 2009).

## 14. Timeline (today is 17 Nov)

| Dates | Work | Done when |
|---|---|---|
| **18 Nov** | Builder creates the Firebase project and sends the config and site key; App Check debug token registered; decide how to deploy (section 16) | The setup-check page gets correct **cloud** answers with the "Google cloud" label |
| 19–22 Nov | Dictionary build script and data; meaning card (dictionary, then AI pick); read-aloud; Share target and PWA install; paragraph explanation; labels; Private mode | Share a sentence from WhatsApp on the Android phone and the right meaning appears |
| 23–25 Nov | Save words, daily review, daily AI limit, answer cache, Remote Config, onboarding and consent | A full loop on the phone: share, tap, save, then a review card the next day |
| **25 Nov** | **Feature freeze.** If time allows: sign-in and sync, or the extension | |
| 23–27 Nov | On-device check and filming on a capable machine (section 5) | "On this device" label shown on camera |
| 26–27 Nov | Polish; accessibility (keyboard, screen-reader labels, text size); accuracy check on 30 sentences with ambiguous words vs a "first dictionary meaning" baseline; README | Accuracy figure recorded |
| 28 Nov | Record and upload the video | Public on YouTube |
| 29 Nov | Submit on Devpost | |
| 30 Nov | Buffer only | |

## 15. Demo video plan (3 minutes or less)

| Time | Show |
|---|---|
| 0:00–0:20 | The problem: a student reading course material on their phone hits a word; a dictionary lists six meanings; Read&Write costs $184 a year; Gemini forgets |
| 0:20–1:00 | Android: select a sentence in WhatsApp, Share, Ladder, meaning for this sentence ("Google cloud"). Same word in a different sentence gives a different meaning. Hear the word |
| 1:00–1:30 | Capable laptop: same flow, "On this device". DevTools Offline: still works. Private mode on |
| 1:30–2:00 | Phone in airplane mode: dictionary meanings still appear. "Explain this paragraph" beside the original. Save word |
| 2:00–2:30 | Next-day review card (pick the meaning in a new sentence). The accuracy figure, AI pick vs first dictionary meaning |
| 2:30–3:00 | Architecture picture (device ↔ Firebase AI Logic ↔ cloud), what it costs the user (nothing), stated limits |

## 16. Open items

1. **Firebase project:** the builder sends the web config and the reCAPTCHA v3 site key.
2. **Deploying without a laptop.** The builder is often only on a phone. Options:
   - (a) GitHub Actions deploys on every push, using a Firebase service-account key stored as a GitHub secret;
   - (b) the builder runs `firebase deploy` on the laptop;
   - (c) a one-time `firebase login --no-localhost` from the build machine, with the builder approving on the phone.

   Pick one on 18 Nov.
3. **On-device machine** (section 5).
4. Choose the frequency list during the dictionary build (section 9).

## 17. Instructions for the next AI session

- Follow this brief. Don't reopen sections 3, 6 and 7 ("Dropped") unless the builder asks.
- Install whatever the build needs in the session yourself. **Don't ask the builder to install things.** They're often on a phone.
- Keep messages to the builder short and free of jargon.
- Check the current Firebase AI Logic hybrid docs before changing inference code. If `firebase.google.com` is blocked for the web tool, `curl https://firebase.google.com/docs/ai-logic/hybrid/web/get-started.md.txt` works through the session proxy.
- Never put the App Check debug token, reCAPTCHA secret key, API secrets or service-account keys in the repo.
