# Ladder brief: fact-check and implementation-ready decisions

Review date: 17 November 2026. Reviewed document: *Ladder: Evidence-Led Investigation and Build Verdict* (17 Nov 2026, including the section 11 update).

## 1. Bottom line

The brief holds up. Most of its factual claims check out, and its core warnings are correct: children can't get a cloud AI path on Google's stack, App Check breaks inside a Chrome extension, and fading support is not evidence of learning. But it has three kinds of problem that block implementation:

1. **It contradicts itself.** Sections 1–10 say "adults only, remove Ada from the video". Section 11 says "keep children in the product" and makes Ada the example user. It never says which one the hackathon build is.
2. **Several claims are wrong, out of date or unverifiable** (section 3 below). One of them changes a design decision: the multi-classroom study found that spaced review didn't help either, not only retrieval. Another changes the context: on 3 November 2026 Google switched Gemini **off by default** for K-12 student accounts, and the brief misses this.
3. **It is not yet buildable.** The repo has only a README and a licence. The brief names no dictionary or word list and no data schema. It refers to an Apache licence, but the repo uses **MIT**.

**Verified resolution:** two products with one shared core, built in sequence.

| Track | Audience | AI | When |
|---|---|---|---|
| **A. Hackathon build** | Adults 18+ who read English fluently, studying on a laptop | Firebase AI Logic: on-device sense picker plus a cloud paragraph explanation the reader asks for | Now to 30 Nov |
| **B. Child reader** | Children who already read independently, with an adult involved | **None** (reviewed reading packs) | After the hackathon, only if Track A's retention test is not a "stop" |

Both tracks share one core: the dictionary schema, the review scheduler and the highlight renderer. Track B is **not** a hackathon entry, because the hackathon requires Firebase AI Logic hybrid inference, and both Google cloud backends bar child-directed apps (section 3.2).

## 2. What I could and could not check

From this session, web search worked, and `cloud.google.com` could be fetched directly. Direct fetches of `devpost.com`, `ai.google.dev`, `firebase.google.com`, `developer.chrome.com` and `support.google.com` were blocked by the session's network policy. For those sites I checked claims through search results that quote the pages, not by reading the pages myself. Where that leaves a claim unconfirmed, the table says so. **You should read the official hackathon rules page yourself before submitting.** It is the one source I could not read in any form.

Verdict key: ✅ confirmed · ⚠️ partly right or needs rewording · ❌ wrong or out of date · ❓ could not verify

## 3. Fact-check

### 3.1 Hackathon and platform

| Brief's claim | Verdict | What the sources say | Fix |
|---|---|---|---|
| Submissions close 30 Nov, 2:00 PM PT (23:00 Lagos) | ✅ | Several listings give 30 Nov, 2:00 PM PT. PST is UTC−8 and Lagos is UTC+1, so 23:00 Lagos is right | None |
| Submissions opened 11 Nov, 1:30 PM PT | ⚠️ | Firebase's own post says submissions "officially open November 9" | Irrelevant now; drop it |
| $30,000 pool: $10k / $7k / $4k / 3 × $3k | ⚠️ | Firebase confirms $30,000 in prizes. Aggregators disagree on how it is split. The brief's split does add up to $30k | Confirm the split on the rules page |
| Four equally weighted criteria; must call Firebase AI Logic; video ≤ 3 min; debug tokens accepted | ❓ | The criteria match one third-party listing. I could not read the rules page for the rest | Read the rules page yourself |
| App Check enforcement required since 2 Nov 2026 | ✅ | Firebase's AI Logic security checklist, App Check page and FAQ all say so. It is on by default for new projects since July 2026, and once enforced it can't be switched off | None |
| `inferenceSource` arrived in JS SDK 12.5.0 | ✅ | Release notes for 12.5.0 (30 Oct 2025). **12.7.0 fixed a bug where `generateContentStream()` reported the wrong `inferenceSource`** | Pin **≥ 12.7.0**, not 12.5.0 |
| On-device structured output uses `onDeviceParams.promptOptions.responseConstraint` | ✅ | Firebase's web structured-output guide and the Oct 2025 Firebase blog | None |
| Firebase requires `initializeDeviceModel()` after a user action | ⚠️ | Not found in official docs. Two community hackathon repos call it from a button click "because it needs a user gesture" | Keep the button. Treat this as the reason step 2 of the test exists, not as a documented fact |
| Hardware: 22 GB free; >4 GB VRAM or 16 GB RAM with 4 cores; Chromebook Plus only; no mobile | ✅ | Chrome's built-in AI docs. A Chrome Help page reportedly says "~20 GB" | None |
| Prompt API stable on ordinary web pages since Chrome 148 | ✅ | Chrome docs: Prompt API available on desktop from 148 | None. A hosted web page is a real fallback |
| Chrome 147+ downloads the model automatically; admins can block it | ✅ | Press reports from May 2026. The policy is `GenAILocalFoundationalModelSettings` (1 = block and remove) | None |
| Prompt API is "not available in workers", so the side panel must host it | ❌ | The spec excludes *web* workers. Chromium's extension doc says extensions can find `LanguageModel` "from extension window **and worker** scripts" | Keep the side panel, but for the right reason: the model download needs a click, and the service worker can't receive one |
| reCAPTCHA can't run in an MV3 extension; use the debug provider | ✅ | MV3 bans remotely hosted code. A Firebase JS SDK issue (#9114) shows a store rejection for leftover `recaptcha/api.js` URLs. Another entrant's repo, **secondlook**, uses the debug provider in its extension "because reCAPTCHA can't load in MV3" | None |
| Production route: run reCAPTCHA through an offscreen document, the way Firebase Auth does | ⚠️ | Firebase documents this pattern for **Auth**, not App Check. It is plausible but untested for AI Logic, and the bundle must still contain no remote script URLs | Leave it as a later problem, as the brief says |
| Reference implementation: "IBITI Guardian" | ❓ | No search found it | Use **im-Amrith/secondlook** instead: MV3 side panel, AI Logic hybrid, debug App Check |

**Two things the brief missed:**

- **Initialisation order.** A reported cause of 403 errors is initialising App Check *after* `getAI()`, which leaves requests without a token. Initialise App Check first.
- **Template-only mode** (Preview) blocks every request that doesn't use a server prompt template. Don't turn it on for the hackathon build, or your direct `generateContent` calls will return 403.

### 3.2 Law, policy and Google's age rules

| Brief's claim | Verdict | What the sources say | Fix |
|---|---|---|---|
| The Gemini API terms bar apps "directed towards or likely to be accessed by" under-18s | ✅ | Present in the archived terms from May 2024 and Nov 2025, and in the current **preview** of the next version. So new terms are coming, and the clause stays | Recheck the live terms before submitting. I couldn't fetch the effective date (claimed as 23 Mar 2026) |
| Section 11: Google Cloud Service Specific Terms §20(d) also bar under-18 apps | ✅ | Fetched directly (page last modified **11 Nov 2026**): *"Customer will not, and will not allow End Users to, use a Generative AI Service as part of a website, Customer Application, or other online service that is directed towards or is likely to be accessed by individuals under the age of 18."* | None. "Switch to Vertex" is ruled out as a fix, as section 11 says |
| Amended COPPA rule: compliance date 22 Apr 2026 | ✅ | Federal Register 90 FR 16918. In force from 23 Jun 2025, compliance required by 22 Apr 2026 | None |
| Gemini in Chrome's minimum age is now 13 | ⚠️ | The Gemini Apps and Chromebook help pages say 13+. Google One's benefit page lists Gemini in Chrome as 18+, US and India | Say "13+ per Gemini Help (some Google pages still say 18)". Either way, the brief is right to delete "Google excludes children" |
| Aug 2026: Gemini in Classroom opened to K-12 students of all ages | ✅ but ❌ out of date | Confirmed from 10 Aug 2026. **On 3 Nov 2026 Google announced that Gemini, Gemini in Classroom and Search will be off by default for K-12 student accounts until an admin turns them on** (start date reported as early 2027) | Add to section 7. Drop the line about assuming every pupil already has a default AI helper. Schools now have to opt in to AI, which makes Track B's no-AI design easier to adopt |

### 3.3 Competitors and market

| Brief's claim | Verdict | What the sources say | Fix |
|---|---|---|---|
| Rewordify stops rewording words the reader has learned | ✅ | Rewordify's `helpskiplearned` page. It also has a manual skip list | None. "Only tool that fades" is false |
| Rewordify is part of Read&Write | ✅ | Pages from Rewordify, Texthelp and Everway | None |
| Read&Write has about 18 million Chrome installs | ⚠️ | Snapshots range from 3M to 20M depending on the source and date | Say "millions of Chrome users" |
| Readlang: 550,000+ people; Premium $6, Premium Plus $15 | ⚠️ | Prices confirmed ($6/mo or $48/yr; $15/mo or $120/yr). I couldn't confirm the user count | Keep the prices; mark the user count as Readlang's own claim |
| Relingo has about 40,000 users | ✅ | Chrome Web Store listing: 40K+, rated 4.6 | None |
| 16% of US adults are smartphone-only (Pew) | ⚠️ | The latest figure I could confirm is **15% (2021)**. I couldn't read the 2024 page | Cite 15% (2021), or read the 2024 page yourself |
| About a third of adults at PIAAC Level 1 or below were born outside the US | ✅ | LEO PIAAC 2023 table: **33.0%** | None |

### 3.4 Research

| Brief's claim | Verdict | What the sources say | Fix |
|---|---|---|---|
| Yano, Long & Ross: simplified text was best for comprehension, elaborated text not significantly different, n = 483 | ✅ | *Language Learning* 44(2), 1994 | None |
| Yanagisawa et al. 2020: multiple-choice glosses most effective across **42 studies** | ✅ | *SSLA* 42(2), 411–438. 42 studies, 359 effect sizes, N = 3,802 | **The link is broken.** `/core/product/CC5373…` doesn't resolve; the correct one is `/core/product/38124150D59DF3039EE1FF5AE88FE922` |
| "The same analysis found first-language glosses beat target-language glosses" | ⚠️ | In Yanagisawa et al. the L1 advantage was about 4 points and **not significant (p = .075)**. The evidence for L1 glosses comes from a **different** meta-analysis: Kim, Lee & Lee 2020 (26 studies, g = .33, strongest for beginners) | Cite Kim et al. 2020 for the L1 claim |
| Incidental learning: 9–18% of words immediately, 6–17% later | ✅ | Webb, Uchihara & Yanagisawa 2023, *Language Teaching* (24 studies, N = 2,771) | None |
| Elleman et al. 2009: 37 studies; d = 0.50 on custom tests, 0.10 on standardised tests | ✅ / ❓ | 37 studies and the larger gains for struggling readers are confirmed. I couldn't re-read the two d values | Cite the paper itself (DOI 10.1080/19345740802539200), not typeset.io |
| Belland et al. 2017: 144 studies, g = 0.46, no difference with or without fading | ✅ | *Review of Educational Research*, abstract | None |
| Belland 2015 pilot: designs without fading beat fixed fading | ✅ | Pilot meta-analysis, 35 studies, g = 0.53 | None |
| Goossens et al. 2014: with nine-year-olds, retrieval beat restudy on fill-in-the-blank after a week; no difference on multiple choice | ✅ | *JARMAC* 3(3) | None |
| Goossens et al. 2016 multi-classroom study: "no benefit at all" | ⚠️ **incomplete, and it matters** | It found no benefit from **long-lag (spaced) repetition** as well as none from retrieval practice, in real classrooms across grades 2, 3, 4 and 6 | Say so. Ladder's review loop rests on spacing *and* retrieval, and this study found neither helped in a real setting. That makes the retention test in section 8 more important, not less |
| Bastani et al. 2025 (PNAS): +48% in practice, −17% on the exam; the safeguarded tutor didn't beat the control group | ✅ | Matches the paper and Wharton's summary | None |
| IES K-3 guide: academic language rated minimal evidence, decoding strong | ✅ / ⚠️ | "Minimal" is confirmed. "Strong" for decoding matches the guide as I know it, but I couldn't confirm it in this session | Fine as written |

## 4. Problems inside the brief and how to resolve them

| # | Problem | Resolution |
|---|---|---|
| 1 | Section 11 supersedes "adults only", but sections 2, 3 and 9 still tell you to remove Ada, and section 9's demo is built around an adult student | **Track A (adults) is the hackathon build and the video.** Ada belongs to Track B's pilot plan only. Don't put a child in the video, because that suggests the hybrid app is aimed at children |
| 2 | Section 11 proposes a mobile web reader with prepared content, 13 days before the deadline, next to the extension | Defer Track B until after 30 Nov. Building both now hits the scope overload the brief itself warns against |
| 3 | The brief says "Apache-licensed repo", but `LICENSE` is MIT | Keep MIT. It meets "open-source licence" as the brief summarises the rules. Licence dictionary data separately (section 5.4) |
| 4 | No dictionary, word list or data schema is chosen, so the sense picker and its benchmark can't be built | Choices are made in section 5.4 |
| 5 | The 85% sense-picker target with a 3+ option enum isn't realistic on a fine-grained dictionary (WordNet lists dozens of senses for "run") | Limit the enum to the **top 3 senses for that part of speech, plus `NONE`**. Measure against the same capped list. Any sense outside the cap goes to "show all senses" |
| 6 | Feasibility test step 4 ("remove the token and assert the call fails") reads as if enforcement might be off | Since 2 Nov enforcement is mandatory and permanent. The step still works as a check that tokens are being sent. Add a separate check: App Check is initialised **before** `getAI()` |
| 7 | The retention test needs a next-day session and day-3 and day-7 checks, while the video freezes on 25 Nov | Run sessions by **20–21 Nov**: day-3 results arrive 23–24 Nov, before the freeze. Day-7 results arrive 27–28 Nov, before submission. If sessions slip past 21 Nov, the video reports day-3 results only and says so |
| 8 | It names only two sources of uncertainty (feasibility and learning value) | Add a third: **whether readers will use the cloud button at all.** If nobody presses "Explain", the hybrid story is on-device only. Log button presses in the pilot |

## 5. Implementation-ready decisions for Track A

### 5.1 Scope (v1, hackathon)

- **User:** adults 18+ who read English fluently and study on a laptop. Start with university students who were schooled in English as an additional language.
- **Must ship:**
  - underlining by word frequency and level
  - tap a word to get the sense that fits the sentence, chosen on-device
  - "Explain this paragraph", sent to the cloud only after a click and only on allowlisted public sites, with the text shown before sending
  - an "on this device" or "Google cloud" badge on every answer
  - the meaning is shown on first encounter; the reader is asked for it when the word comes back
  - a next-day recall card
  - a softened underline that one tap restores
  - local storage only, with a "Clear history" button
- **Out of scope:** child mode, read-aloud, phone review, sync, store listing, Spanish, and explanations on legal, medical or financial pages.

### 5.2 Architecture

```
content script ──(word, sentence, url)──▶ service worker ──▶ side panel (AI host)
  CSS Custom Highlight API                  storage + review      ├─ initializeAppCheck()  ← first
  no DOM wrapping, no model                 scheduling            ├─ getAI()
                                                                  ├─ model_device  (ONLY_ON_DEVICE)
                                                                  └─ model_cloud   (ONLY_IN_CLOUD)
```

- Firebase JS SDK **pinned at ≥ 12.7.0** and bundled locally with no CDN imports. The built bundle must not contain the string `recaptcha` or any `https://…/*.js` URL.
- App Check: **debug provider** registered in the console. The token is supplied only to judges through private testing instructions and is never committed.
- Two explicit model instances. Never use `PREFER_*`. Assert `response.inferenceSource` exactly on every call, and fail on `undefined`.
- Model download starts from a button click in the side panel, and the panel shows download progress.
- `manifest.json`: `side_panel`, `storage` and `activeTab`. Request host permissions only when needed, to avoid the "read all sites" warning.

### 5.3 Data stored locally (`chrome.storage.local`)

```ts
type SenseId = string;                 // e.g. "oewn-reluctant-a-01"
interface WordRecord {
  lemma: string;
  senses: Record<SenseId, {
    firstSeen: number;                 // epoch ms
    lookups: number;
    reviews: { at: number; correct: boolean; format: "cloze" | "typed" }[];
    softened: boolean;                 // display preference only; never shown as "mastered"
  }>;
  knownByUser?: boolean;               // the reader marked it as known
}
// Never store page text from sites that aren't allowlisted. Store an example sentence from the dictionary instead.
```

Softening rule: two correct recalls on different days soften the underline. Any miss, or one tap, restores it.

### 5.4 Data sources and licences

Check each licence on the source's own page before bundling. I couldn't open these pages from this session, so the licences below are from my own knowledge.

| Need | Recommended source | Licence (verify) | Notes |
|---|---|---|---|
| Senses and definitions | **Open English WordNet** | CC BY 4.0 | Senses are very fine-grained. Use the cap of three per part of speech from section 4, row 5 |
| Plainer learner-style definitions | Wiktionary data via **wiktextract** | CC BY-SA | Share-alike applies to the data file, not your MIT code. Keep it in `data/` with its own LICENSE file |
| Word frequency for underlining | **wordfreq** data | CC BY-SA 4.0 (data) | Its data stopped updating in 2024, which doesn't matter here |

### 5.5 Feasibility test (revised): run it today, budget 4 hours

1. On your laptop, open DevTools and run `await LanguageModel.availability()`. If it returns `unavailable`, borrow a machine that can run the model before doing anything else.
2. Use a fresh Chrome profile with the unpacked MV3 extension, a side panel, and the SDK pinned to ≥ 12.7.0.
3. Assert that `typeof model.initializeDeviceModel === "function"`, then call it from a button and show progress.
4. Run five known-answer sentences with a **four-value enum (three senses plus NONE)** in `ONLY_ON_DEVICE`. Assert `inferenceSource` is the on-device value. Record accuracy and latency.
5. Initialise App Check with the debug provider **before** `getAI()`. Make one `ONLY_IN_CLOUD` call and assert the cloud value. Then clear the debug token and assert you get a 403.
6. Go offline: the device call must still answer, and the cloud call must fail with a visible message.
7. Run `grep -r "recaptcha\|https://.*\.js" dist/`. It must find nothing.

If step 4 fails in the extension, run the same code on a hosted page (Chrome 148+) and ship a web reader. If neither works by 20 Nov, stop pursuing this idea for the hackathon.

### 5.6 Validation checkpoints (unchanged from the brief except where noted)

| By | Check | Pass |
|---|---|---|
| 18 Nov | Feasibility test 5.5 | All 7 steps pass |
| 20–21 Nov | Recruit 10–12 students, record a device census, start the paper-mock-up retention test | Sessions run (moved one day earlier than the brief) |
| 21 Nov | Sense picker on 50 labelled sentences, capped enum | ≥ 85% and ≥ 10 points above choosing the first-listed sense |
| 24 Nov | 20 paragraphs for explanations, 10 of them adversarial | No error that changes the meaning after the code check |
| 25 Nov | Feature freeze, record the video | Day-3 retention results shown |
| 28–29 Nov | Day-7 results; submit on the 29th | Use the brief's thresholds in section 8 |

## 6. Track B (children): what needs to be true before it starts

- Track A's day-7 result is "proceed" or "redesign", not "stop".
- No generative AI: reviewed passages, reviewed meanings, optional recorded audio. Changing to another AI provider doesn't fix the under-18 bar unless that provider's terms are checked first (the brief's section 11 is right here).
- School route: because of Google's 3 Nov change, admins now have to opt in to every AI tool. Present Track B as a reading tool with no AI. That is the easier thing for a school to approve.
- Before any public launch, get a COPPA and privacy review for each country served. A supervised pilot is not an exemption.

## 7. Still open: check these yourself

1. The **official rules page**: video length, testing-access wording, the "no live secrets" clause and the prize split.
2. The **live Gemini API terms** effective date, since a preview of new terms exists.
3. Whether your own laptop returns `available` (feasibility step 1).
4. Readlang's user count and Pew's 2024 smartphone-only figure, if you keep them in the pitch.

## Sources

- Hackathon: [Devpost event page](https://firebasehybridaihackathon.devpost.com/) · [Firebase announcement on X](https://x.com/Firebase/status/2118467336143286458) · [hackathonradar listing](https://www.hackathonradar.com/database/hackathon/buildhybridai-2026)
- Firebase: [App Check for AI Logic](https://firebase.google.com/docs/ai-logic/app-check) · [Security checklist](https://firebase.google.com/docs/ai-logic/security-checklist) · [Template-only mode](https://firebase.google.com/docs/ai-logic/server-prompt-templates/template-only-mode) · [Web structured output](https://firebase.google.com/docs/ai-logic/hybrid/web/generate-structured-output) · [JS release notes](https://firebase.google.com/support/release-notes/js) · [12.5.0 release](https://newreleases.io/project/github/firebase/firebase-js-sdk/release/firebase@12.5.0) · [Auth in Chrome extensions](https://firebase.google.com/docs/auth/web/chrome-extension) · [SDK issue #9114](https://github.com/firebase/firebase-js-sdk/issues/9114) · [pyric issue #1299 (App Check order)](https://github.com/davideast/pyric/issues/1299) · [secondlook reference repo](https://github.com/im-Amrith/secondlook)
- Chrome: [Prompt API for extensions (Chromium doc)](https://chromium.googlesource.com/chromium/src/+/main/docs/experiments/prompt-api-for-extension.md) · [Language Model guide](https://developer.chrome.com/docs/modern-web-guidance/guides/built-in-ai/language-model) · [Model management](https://developer.chrome.com/docs/ai/understand-built-in-model-management) · [Auto-download policy (Windows Report)](https://windowsreport.com/you-can-now-block-automatic-ai-model-downloads-in-edge-and-chrome/) · [Neowin on the 4 GB download](https://www.neowin.net/news/google-chrome-is-reportedly-auto-installing-a-massive-4gb-ai-model-without-your-consent/)
- Terms and law: [Google Cloud Service Specific Terms §20(d)](https://cloud.google.com/terms/service-terms) · [Gemini API terms preview](https://ai.google.dev/gemini-api/terms_preview) · [Gemini API terms, Nov 2025 archive](https://ai.google.dev/gemini-api/terms-archive/terms_11_20_25) · [COPPA final rule](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule) · [Hunton on the compliance date](https://www.hunton.com/privacy-and-cybersecurity-law-blog/coppa-rule-amendment-compliance-deadline-approaches)
- Google age and education policy: [Gemini in Chrome help](https://support.google.com/gemini/answer/16283624) · [Google One benefit restrictions](https://support.google.com/googleone/answer/16105039?hl=en) · [Workspace update, Aug 2026](https://workspaceupdates.googleblog.com/2026/08/gemini-in-google-classroom-is-expanding-to-users-of-all-ages-with-contextualized-Gemini-starter-prompts-for-students.html) · [EdWeek, Sep 2026](https://www.edweek.org/technology/schools-caught-flat-footed-after-google-makes-gemini-chatbot-available-to-all-students/2026/09) · [Google turns AI off by default for K-12 (Yahoo News)](https://www.yahoo.com/news/us/articles/google-turns-off-ai-schoolchildren-195022393.html) · [Eastern Herald, 4 Nov 2026](https://easternherald.com/2026/11/04/google-turns-off-gemini-search-student-accounts-default/)
- Competitors: [Rewordify learned words](https://rewordify.com/helpskiplearned.php) · [Rewordify in Read&Write](https://website-us.texthelp.com/en-gb/products/read-and-write-education/rewordify/) · [Read&Write on Chromeboard](https://chromeboard.com/extension/readwrite-for-google-chro-inoeonmfapjbbkmdafoankkfajkcphgd) · [Readlang](https://readlang.com/) · [Relingo store listing](https://chromewebstore.google.com/detail/relingo-master-vocabulary/dpphkcfmnbkdpmgneljgdhfnccnhmfig)
- Research: [Yano, Long & Ross 1994](https://core.ac.uk/download/32302657.pdf) · [Yanagisawa, Webb & Uchihara 2020](https://cambridge.org/core/journals/studies-in-second-language-acquisition/article/how-do-different-forms-of-glossing-contribute-to-l2-vocabulary-learning-from-reading/38124150D59DF3039EE1FF5AE88FE922) · [Kim, Lee & Lee 2020, L1 vs L2 glosses](https://www.researchgate.net/publication/347660326_The_relative_effects_of_L1_and_L2_glosses_on_L2_learning_A_meta-analysis) · [Webb, Uchihara & Yanagisawa 2023](https://www.cambridge.org/core/product/E38E3468FD2090B1FA3051051DE8E70C) · [Elleman et al. 2009 summary](https://dev.taleafrica.com/2021/04/01/the-impact-of-vocabulary-instruction-on-passage-level-comprehension-of-school-age-children-a-meta-analysis/) · [Belland et al. 2017](https://pure.psu.edu/en/publications/synthesizing-results-from-empirical-research-on-computer-based-sc/) · [Belland pilot](https://cadrek12.org/resources/pilot-meta-analysis-computer-based-scaffolding-stem-education) · [Goossens et al. 2014](https://repub.eur.nl/pub/58790) · [Goossens et al. 2016](https://research.ou.nl/en/publications/distributed-practice-and-retrieval-practice-in-primary-school-voc/) · [Bastani et al. 2025](https://ideas.repec.org/a/nas/journl/v122y2025pe2422633122.html) · [Wharton summary](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education/) · [IES K-3 guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/21) · [LEO PIAAC 2023 US table](https://leo.blogs.uni-hamburg.de/wp-content/uploads/2025/09/LEO-PIAAC-2023-Brochure_CountryStoryTable_USA-v3.pdf) · [Pew 2021 smartphone-only](https://www.pewresearch.org/internet/2021/06/03/mobile-technology-and-home-broadband-2021/)
