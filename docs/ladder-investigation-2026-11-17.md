# Ladder: evidence-led investigation

**Research date:** 17 November 2026. "Last 12 months" means 17 Nov 2025 – 17 Nov 2026.
**Scope note:** your prompt describes the *original* specification: a Chrome extension for children aged 8–14 and adults with low literacy, quiz before reveal, fading underlines. In this conversation you have since adopted *brief v3* (`docs/LADDER_BRIEF.md`): an installable web app for adults 18+, dictionary first, Share-to-Ladder on Android. I judge both, and where they differ the verdict says which one it means.

---

## Is Ladder good enough, for which objective, and under what conditions?

| Objective | Verdict | Confidence | Conditions |
|---|---|---|---|
| **Hackathon entry (#BuildHybridAI 2026)** | **Build brief v3, not the original spec.** | Moderate | (1) The cloud path works from the hosted app by about 20 Nov. (2) The on-device path is shown working at least once on a real capable machine, in stable Chrome with no flags. (3) The demo shows a measured comparison against a plain dictionary, not just a working feature |
| **Original spec as written** (extension, children 8–14 plus low-literacy adults, quiz first, fading) | **Don't build.** | High | None. The blockers are structural: provider age terms, extension security in production, no extensions or on-device AI on phones, and a mismatch between the intervention and the users' real difficulty |
| **Lasting product** | **Narrow and redesign, then test before investing past December.** It isn't proven to deserve to exist yet | Low to moderate | The save-and-review loop must beat "dictionary pop-up plus a saved list" on unaided recall a week later, without readers reading less. Separately, the AI sense picker must beat "show the first dictionary meaning" by a margin users would notice |
| **Business** | **No evidence yet.** | Low | Nobody has shown willingness to pay. Cloud costs grow with every tap, and scaling past the free tier needs prepayment |

**Strongest supporting reason.** The v3 design suits the hackathon unusually well. The rules explicitly accept web apps and Chrome extensions on the Web (Chrome) platform ([official rules §5](https://firebasehybridaihackathon.devpost.com/rules)). Chrome's on-device Prompt API has been stable on ordinary web pages since Chrome 148 (released 5 May 2026; [Prompt API docs](https://developer.chrome.com/docs/ai/prompt-api), [Chrome 148 release notes](https://developer.chrome.com/release-notes/148)). Picking one meaning out of a few dictionary senses is a small, bounded job that a small on-device model can plausibly do, with the cloud as a fallback.

**Most serious unresolved risk.** Nothing yet shows that Ladder's distinctive part, bringing looked-up words back for review, beats what free tools already do. The evidence for spaced retrieval is strong in controlled studies but disappeared in a real multi-classroom implementation ([Goossens et al. 2016](https://repub.eur.nl/pub/98666)). For the hackathon, the equivalent risk is that **the on-device path has never run on any machine you control**. Your HP and Android phone can't run it, and Google Chrome on the build server reported `unavailable`.

---

## 1. Current state

### What's proposed, built, tested and unsupported

| Item | Status | Basis |
|---|---|---|
| Original spec: extension, children plus low-literacy adults, quiz before reveal, fading | Proposed, then **superseded** by v3 | Your prompt; `docs/LADDER_BRIEF.md` |
| v3: web app, adults 18+, dictionary first, AI picks the sense, review, Share target | Proposed | `docs/LADDER_BRIEF.md` |
| React/Vite app, Firebase SDK 13.4.0, App Check initialised before AI, hybrid sense picker restricted to the choices A–D or NONE, setup-check page | **Built.** Compiles; renders in headless Chromium with no errors | `app/src/*` on branch `ccr-f02846ec-onsynf` |
| Cloud answer through Firebase | **Not tested.** No Firebase project yet | — |
| On-device answer through Firebase | **Not tested on real hardware.** Chromium only fakes the model; Google Chrome 158 reported `unavailable` on the 15 GB, GPU-less build server | Run in this session, 17 Nov |
| Dictionary data, review, Share target, consent | Not built | — |
| Learning benefit, demand, willingness to pay | **No evidence of any kind** | — |

### Facts established from primary sources today

- **The event.** #BuildHybridAI 2026, run by Google and administered by Devpost. Submissions: 11 Nov 2026, 1:30 PM PT to **30 Nov 2026, 2:00 PM PT** (23:00 Lagos). Judging 10–16 Dec; winners around 21 Dec ([rules §4](https://firebasehybridaihackathon.devpost.com/rules)).
- **Eligibility.** You must be above the age of majority. Brazil, Italy, Quebec, Crimea, Cuba, Iran, Syria, North Korea, Sudan, Belarus and Russia are excluded, plus OFAC-sanctioned places. **Nigeria is not excluded** ([rules §3](https://firebasehybridaihackathon.devpost.com/rules)).
- **What to build.** An app using Firebase AI Logic on at least one platform: Web (Chrome) or Android with "Gemini Nano 4", or iOS with Apple Foundation Models. Multi-platform is "preferred". *"Firebase AI Logic requires App Check; debug tokens are accepted in submissions."* ([rules](https://firebasehybridaihackathon.devpost.com/rules)).
- **What to submit.**
  - A public GitHub or GitLab repo that shows AI Logic "imported and actually called", with a detectable open-source licence ("Apache is preferred").
  - A public YouTube video of 3 minutes or less, in English.
  - A text description.
  - Free testing access until judging ends.
  - **No production API keys, live Google Cloud secrets or personal data.**
  - You must **disclose pre-existing code or work**, which includes bundled dictionary data ([rules](https://firebasehybridaihackathon.devpost.com/rules)).
- **Judging.** Stage One is pass/fail on completeness. Stage Two has four equally weighted criteria scored 1–5: technological implementation (how well hybrid inference is used), design (a "complete, coherent product experience, not just a technical proof of concept"), potential impact (judged "based on what's demonstrated") and quality of the idea. Prizes: $10k, $7k, $4k, and $3k each for Best iOS, Android and Web/Chrome ([rules](https://firebasehybridaihackathon.devpost.com/rules)).
- **Two consequential clauses.** First: *"Judges are not required to test the Project and may choose to judge based solely on the text description, images, and video."* Second, judging "may utilize … automated AI-driven analysis" ([rules](https://firebasehybridaihackathon.devpost.com/rules)). **The video and the written description carry most of the weight.**

### Corrections to earlier documents

| Earlier claim | What the sources say | Source |
|---|---|---|
| Firebase hybrid needs SDK ≥ 12.5.0 | `inferenceSource` arrived in 12.5.0, but the default cloud model `gemini-3.5-flash-lite` dates from **13.0.0**, and 12.7.0 fixed a streaming bug. Use 13.x | [Firebase config options](https://firebase.google.com/docs/ai-logic/hybrid/web/configuration-options) |
| "The Prompt API is not available in workers" (first brief) and "extension workers can see it" (my review) | Chrome's own page: **not available in Web Workers**. Stable in extensions since Chrome 138 and on the web since 148 | [Prompt API](https://developer.chrome.com/docs/ai/prompt-api) |
| On-device needs only Chrome 139+ | Firebase's limitations section says "Chrome on Desktop (version 139 or higher) **with the required flags enabled**", and its setup steps tell developers to enable `#prompt-api-for-gemini-nano-multimodal-input`. Chrome's page says the API is stable in 148. **Whether ordinary users without flags get on-device answers through Firebase hasn't been demonstrated.** Test it (§4) | [Firebase hybrid get-started](https://firebase.google.com/docs/ai-logic/hybrid/web/get-started) |
| The $300 Google Cloud credit can fund cloud AI | Firebase: the credits "*cannot* be used towards Gemini Developer API costs". From 16 Nov 2026, new free-trial accounts can't use them for the Agent Platform (Vertex) Gemini API either | [AI Logic pricing](https://firebase.google.com/docs/ai-logic/pricing), [FAQ](https://firebase.google.com/docs/ai-logic/faq-and-troubleshooting) |
| Gemini in Chrome is 13+ | Confirmed on Google's help page: "Be 13 or older (or the applicable age in your country)" | [Gemini in Chrome help](https://support.google.com/gemini/answer/16283624?hl=en) |
| The model downloads on demand / Chrome auto-downloads it | Chrome's model-management page (Oct 2025) says "downloaded on demand", triggered by the first `create()`. Press reports from May 2026 describe Chrome 147 downloading the model without being asked. **Both may be true for different setups; don't rely on the model already being present** | [Model management](https://developer.chrome.com/docs/ai/understand-built-in-model-management), [Neowin](https://www.neowin.net/news/google-chrome-is-reportedly-auto-installing-a-massive-4gb-ai-model-without-your-consent/) |
| Goossens et al. 2014 (repub 58790) used fill-in-the-blank tests | That record is the *Applied Cognitive Psychology* study: cued recall and multiple choice. "Recalled better … no difference in recognition." The fill-in-the-blank study is a different 2014 paper in *JARMAC*. The conclusion is the same | [repub.eur.nl/pub/58790](https://repub.eur.nl/pub/58790) |
| Read&Write has "about 18 million" Chrome users | The current store page shows **2.4★ from 1.6K ratings** but no user count I could read. Third-party trackers range from 3M to 20M. Say "millions" | [Chrome Web Store](https://chromewebstore.google.com/detail/readwrite-for-google-chro/inoeonmfapjbbkmdafoankkfajkcphgd) |

**What I couldn't open:** `ai.google.dev`, which hosts the Gemini API terms, pricing and rate limits, refused connections from this session even after it was allowed. Terms claims below rely on archived versions surfaced by search, plus Google Cloud's terms, which I opened directly.

### Two conclusions

- **Hackathon readiness: not ready, reachable.** Every remaining step is documented. The one gap is on-device verification, which needs hardware you don't have.
- **Product viability: not established.** No user has seen it. The differentiating loop is untested, and every candidate user group already has free alternatives (§3).

---

## 2. The three most important insights most people miss

### Insight 1. For Ladder's users, "hybrid" will mostly mean "cloud", so the privacy and cost story flips

**Mechanism.** On-device inference only happens when the reader's own hardware qualifies. Chrome requires:
- a desktop OS (Windows 10/11, macOS 13+, Linux or Chromebook Plus);
- at least 22 GB free;
- a GPU with **more than 4 GB VRAM**, **or 16 GB RAM with 4+ CPU cores**.

*"Chrome for Android, iOS, and ChromeOS on non-Chromebook Plus devices are not yet supported"* ([Prompt API requirements](https://developer.chrome.com/docs/ai/prompt-api)).

Firebase's `PREFER_ON_DEVICE` mode only uses the device when Chrome reports `available`. Otherwise it **silently uses the cloud**. I confirmed this in the SDK source (`ChromeAdapterImpl.isAvailable`, `@firebase/ai` 13.4.0).

**Evidence that this is the common case for your users:**
- Your own laptop (8 GB, 2 cores) and phone fail the requirements.
- Phones are a large share of web use where you live: StatCounter's 2026 snapshots for Nigeria range from 54% to 75% mobile ([StatCounter](https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/nigeria)). They're inconsistent, so use them only as a direction.

**The money side:**
- Firebase AI Logic itself is free, but the Gemini Developer API's free tier is limited.
- The paid tier needs a billing account, and "*prepayment usually required*" ([AI Logic pricing](https://firebase.google.com/docs/ai-logic/pricing)).
- The $300 trial credit can't be used for it (same page).
- Free-tier limits are per project and aren't published on the official page I could reach. Third-party summaries cite about 500 requests per day for Flash-Lite ([scriptbyai](https://www.scriptbyai.com/gemini-api-free-tier-limits/)). **Unverified; check in AI Studio.**
- Firebase's default per-user limit is 100 requests per minute ([FAQ](https://firebase.google.com/docs/ai-logic/faq-and-troubleshooting)). That protects you from one abuser, not from many legitimate users.

**Why it changes a decision.**
- "Private, free, on-device" describes the experience of a minority of capable laptop owners.
- For everyone else, each AI tap sends text to Google and spends your shared quota. On the free tier, archived Gemini API terms say Google may use that text to improve its products, with human review ([archived terms, Oct 2025](https://ai.google.dev/gemini-api/terms-archive/terms_10_07_25)).
- A product whose core needs AI on every tap will either hit the free ceiling or need prepaid spending you may struggle to make from Nigeria.

**Action.**
- Keep v3's **dictionary first** design: the meaning appears with no AI.
- Call AI only for words with more than one meaning, cache answers, and cap use per user.
- Describe privacy precisely: "on supported laptops, nothing leaves your device; otherwise the sentence you choose is sent to Google."
- Measure what share of AI answers in your test came from the device, and report it.

### Insight 2. The Chrome-extension form makes Firebase's cloud half impossible to ship safely, and the web form doesn't

**Mechanism.**
- App Check proves that requests come from your real app. On the web, the attestation providers are reCAPTCHA v3 and reCAPTCHA Enterprise ([reCAPTCHA v3 provider](https://firebase.google.com/docs/app-check/web/recaptcha-provider)). Both load Google's script from the network.
- Manifest V3 bans remotely hosted code with **no exception for Google's own libraries**: *"Even though this was a first party (i.e. Google owned) library, no exception is given for RHC"* ([Chrome: remote hosted code](https://developer.chrome.com/docs/extensions/develop/migrate/remote-hosted-code)).
- That leaves an extension two options. **Debug tokens:** Firebase says "*don't ship your debug token … in production builds*" ([App Check for AI Logic](https://firebase.google.com/docs/ai-logic/app-check)). **A custom provider:** it needs your own token server ([custom provider](https://firebase.google.com/docs/app-check/web/custom-provider)), which can't tell your real extension from a copied script, so it only moves the problem.
- Since **2 November 2026**, App Check is enforced for AI Logic in all projects; the latest you can delay it is 21 January 2027 ([App Check page](https://firebase.google.com/docs/ai-logic/app-check), [FAQ](https://firebase.google.com/docs/ai-logic/faq-and-troubleshooting)).
- **A hosted web app can use reCAPTCHA normally.**
- Separately, Chrome on phones has no extensions at all, so the extension form shuts out phone users.

**Why it changes a decision.**
- The original "extension-page AI host" design can pass the hackathon, because debug tokens are accepted, but **it has no defensible production path for the cloud half without a backend**.
- The web form fixes security and phone reach together, and the rules accept it.
- Firebase's hybrid docs never mention extensions (I searched the get-started and App Check pages), so the extension route also carries undocumented risk.

**Action.**
- Build the web app (PWA) with reCAPTCHA v3 App Check.
- Treat a Chrome extension as a later thin client: it would send selected text to the web app, not hold Firebase keys itself.

### Insight 3. The AI is aimed at the step where its added value is least certain, while the step that makes Ladder distinctive is unproven

**Mechanism.** Ladder makes two promises:
1. **The right meaning for this sentence** (AI picks the dictionary sense).
2. **Remembering the word later** (the review loop).

**Promise 1** competes with a strong, free baseline: show the most common sense first. Amazon's Kindle Word Wise has shown "our best guess" above hard words since 2014. For ambiguous words it offers **multiple-choice hints that let the reader pick the meaning that fits the sentence** (Kindle user guide, as reproduced in [ManualsLib](https://www.manualslib.com/manual/960098/Amazon-Voyage.html?page=27); third-party copy, not Amazon's live help).

Recent studies report that large models do well at sense disambiguation without examples, but don't beat specialised systems ([Findings of ACL 2024](https://aclanthology.org/2024.findings-acl.967.pdf); [arXiv 2503.08662](https://fugumt.com/fugumt/paper_check/2503.08662v1_enmode)). I found **no published figure for Gemini Nano** on this task, and the gain over "first sense" on a 3–4 option list is unknown.

**Promise 2** is the real difference from Gemini and Read&Write. But its evidence depends on the setting:
- In a controlled study, retrieval practice improved children's **recall** of word meanings a week later but **not recognition** ([Goossens et al. 2014](https://repub.eur.nl/pub/58790)).
- In real classrooms across grades 2–6, **neither spaced practice nor retrieval practice** helped on recall or multiple-choice tests ([Goossens et al. 2016](https://repub.eur.nl/pub/98666)).

**Why it changes a decision.** You could polish the AI step while the loop that justifies the product goes unmeasured. The hackathon judges also score "potential impact … based on what's demonstrated", and a sense-picking accuracy figure without a baseline proves little.

**Action.**
- Benchmark the sense picker against "first dictionary sense" on 50 ambiguous sentences. Keep the AI step only if it clearly wins.
- Make the **retention test against a dictionary-only baseline** the go/no-go for the product (§8). It needs no AI and can run as a mock-up.

---

## 3. Learning value, target user and competitive position

### Which reading problems Ladder touches

| Difficulty | Ladder's effect | Notes |
|---|---|---|
| Unknown word, fluent reader | **Addresses directly** | The core case |
| English as an additional language | Addresses vocabulary | L1 glosses help beginners most (below). On-device AI only accepts `en`, `ja`, `es`, `de`, `fr` ([Prompt API](https://developer.chrome.com/docs/ai/prompt-api)), so Yoruba, Igbo, Hausa and Pidgin explanations would be cloud-only |
| Thin background knowledge | Assists, through paragraph explanation | Can't supply a topic |
| **Slow or inaccurate decoding** | **Doesn't address; risks misdiagnosing** | US fourth graders below NAEP Basic are much more likely to have weak fluency, word reading and decoding ([NCES ORF study](https://nces.ed.gov/nationsreportcard/studies/orf/implications.aspx)) |
| Cognitive accessibility needs | Not designed for | Highlights add visual load |
| Inference and text structure | Doesn't address | — |

### Evidence by mechanism, with transfer limits

| Mechanism | Evidence | Population | What Ladder may claim |
|---|---|---|---|
| Glosses while reading | 42 studies: glossing helps L2 vocabulary; multiple-choice glosses most effective; L1 gloss advantage about 4 points, *p* = .075 ([Yanagisawa, Webb & Uchihara 2020](https://cambridge.org/core/journals/studies-in-second-language-acquisition/article/how-do-different-forms-of-glossing-contribute-to-l2-vocabulary-learning-from-reading/38124150D59DF3039EE1FF5AE88FE922)). L1 beats L2 glosses, g = .33, strongest for beginners ([Kim, Lee & Lee 2020](https://www.researchgate.net/publication/347660326_The_relative_effects_of_L1_and_L2_glosses_on_L2_learning_A_meta-analysis)). Computer glosses: medium effect on comprehension, large on incidental vocabulary (Abraham 2008, 11 studies; abstract only) | **Second-language learners** | Likely helps adult L2 readers. **Not established for native-speaking children** |
| Simplify vs explain | Simplified text gave the highest comprehension; elaborated text not significantly different (483 Japanese college students, [Yano, Long & Ross 1994](https://core.ac.uk/download/32302657.pdf); full text blocked by a bot check, abstract via search) | L2 adults | "No worse for comprehension." Nothing about learning |
| Retrieval and spacing | Recall benefit in a controlled study; none in a multi-classroom study ([2014](https://repub.eur.nl/pub/58790), [2016](https://repub.eur.nl/pub/98666)) | Dutch primary pupils | A bet to test, not a claim |
| Guessing before the answer | Guessing meanings before feedback improved later memory, even though guesses were almost always wrong ([Potts & Shanks 2014](https://discovery-pp.ucl.ac.uk/id/eprint/1399515/1/RPottsLastRevision.pdf)). A replication found no cued-recall benefit (Seabrooke et al., via search) | Adults, lab | Optional "guess first" in review is defensible; compulsory guessing during reading is not shown |
| Fading support | No difference between scaffolds that fade and those that don't (144 studies, g = .46 overall; [Belland et al. 2017](https://pure.psu.edu/en/publications/synthesizing-results-from-empirical-research-on-computer-based-sc/)) | STEM learners | No learning claim from fading |
| Learning from plain reading | About 15% of unknown words learned per encounter, native readers ([Swanborn & de Glopper 1999](https://www.lextutor.ca/text_encounters/Ch03.doc), secondary summary). 9–18% immediately and 6–17% delayed, L2 ([Webb, Uchihara & Yanagisawa 2023](https://www.cambridge.org/core/product/E38E3468FD2090B1FA3051051DE8E70C)) | Both | **This is the bar to beat** |
| Vocabulary teaching → comprehension | Large on texts containing the taught words, small on general tests (37 studies, Elleman et al. 2009; values not re-checked) | School-age | Word-level claims only |

**Four outcomes, kept separate:**
- **Finishing today's reading:** plausible, testable now.
- **Remembering looked-up words:** testable in 1–2 weeks.
- **Recognising them in unfamiliar texts:** needs a cloze or new-sentence test.
- **Broader literacy:** Ladder can't claim it.

**Interruptions.** I found no study testing whether *compulsory* questions during reading harm comprehension. Glossing research shows readers who *choose* to look up words don't lose comprehension (Abraham 2008). The pretesting research shows that *guessing* helps memory, but in lab tasks, not mid-paragraph. Recommendation:
- **Help is instant the first time a word is tapped.**
- Questions appear only (a) when a saved word comes back in new text the reader shares, as a one-tap optional guess, and (b) in review.
- One tap always skips.

### Who the first version is for

|  | Children 8–14 | Adults with low literacy | **Adults reading English as an additional language for study or work** |
|---|---|---|---|
| Main barrier | Often decoding ([NCES](https://nces.ed.gov/nationsreportcard/studies/orf/implications.aspx)) | Decoding or language | **Vocabulary in specialised texts** |
| Can Ladder use cloud Gemini? | **No.** Gemini API terms bar apps "directed towards or likely to be accessed by individuals under the age of 18" ([archived terms, Nov 2025](https://ai.google.dev/gemini-api/terms-archive/terms_11_20_25)), and so does Google Cloud §20(d) ([service terms, modified 11 Nov 2026](https://cloud.google.com/terms/service-terms)) | Yes | Yes |
| Install path | Parent or school admin; schools now opt in to AI (§7) | Self, unlikely | **Self** |
| Device | School Chromebooks, mostly not Plus; phones | Mostly phones | Phone plus sometimes a laptop |
| Evidence match | Weak (L2 evidence doesn't transfer cleanly; decoding comes first) | Weak | **Best** |
| Free substitutes | Google Read Along (free; in Classroom for all education users from June 2026, [Workspace Updates](https://workspaceupdates.googleblog.com/2026/06/read-along-in-google-classroom-is-now-available-to-all-education-users-to-support-foundational-literacy.html)); Microsoft Reading Coach (free, [TechCrunch](https://techcrunch.com/2024/01/18/microsoft-makes-its-ai-powered-reading-tutor-free)) | Read-aloud tools | Gemini, Kindle, Readlang |
| Reachable by you this month | No | No | **Yes** |

**Recommendation.**
- **User:** adults 18+ who read fluently but meet unfamiliar words in English they read for study or work, anywhere in the world. Start with university students who learned English as an additional language.
- **Recurring situation:** reading assigned or work material on a phone or laptop and getting stuck on a word.
- **One outcome:** the share of looked-up words whose meaning the reader can give, unaided, in a new sentence 7 days later.

**What narrowing costs:** the emotional story about children, the school channel where Read&Write earns per-seat revenue, and the users with the deepest need. Those users need a different product: decoding and read-aloud support, delivered through adults, without generative AI.

### Competitors for the same task

| Product | Verified current capability | Beats Ladder on | Ladder could win on |
|---|---|---|---|
| **Kindle Word Wise + Vocabulary Builder** (Amazon) | Hints above hard words with an adjustable slider; "best guess" sense with multiple-choice hints; looked-up words saved automatically; flashcards. Kindle books only (user guides; not re-checked on Amazon's live help) | Seamless, free with books, years of use. **It's prior art for most of Ladder's loop** | Any text from any app; review in *new* sentences that checks recall |
| **Rewordify** / **Everway Read&Write** | Rewordify: reading levels, hard words reworded, "Once you learn them, the site no longer rewordifies it", Learning Sessions with "research-based practices" ([Rewordify help](https://rewordify.com/helpskiplearned.php), [learning sessions](https://rewordify.com/helplearnsession.php)). Read&Write: read-aloud, text and picture dictionaries, Vocabulary List, Rewordify, simplify and summarise ([store listing](https://chromewebstore.google.com/detail/readwrite-for-google-chro/inoeonmfapjbbkmdafoankkfajkcphgd)). **$184/year individual; $2.75–$18.30/seat for schools; free for K-12 teachers** ([pricing](https://www.everway.com/products/read-and-write-education/pricing/)). Store rating 2.4★ | Schools, read-aloud, maturity | Free for individuals; meaning chosen for the sentence; phone share flow; review in new contexts |
| **Gemini app / Gemini in Chrome** | Explains the shared page on request; 13+ ([help](https://support.google.com/gemini/answer/16283624?hl=en)) | Smarter, free, built in | One tap; consistent short answer; dictionary-grounded; **remembers and reviews**; works offline at the dictionary level |
| **Readlang** | Click to translate, flashcards ([site](https://readlang.com/)). Premium $6/mo, Premium Plus $15/mo (price from search of its site) | Translation into your own language | English-first learners; free |
| **A teacher pre-teaching key words** | What most of the research studies | Judgement about which words matter | Available at any hour, on any text |

**The defensible differentiator:** *"the meaning for this sentence in one tap, from any app on your phone, and the word comes back in a new sentence until you can recall it, free."* Privacy is a supporting point on capable laptops. "AI-powered", "hybrid" and "personalised" aren't advantages in themselves.

**Features that carry it:** dictionary-first meaning card, sense choice (if it beats the baseline), save, recall review in new sentences, Share target.
**Features that add complexity without enough value now:** child mode, fading as a selling point, automatic public-page detection, sync between devices, the extension.

**Switching, staying, paying.**
- A reader switches if one tap is faster than a dictionary or a Gemini query and the meaning is right.
- They stay if review is short and the words are theirs.
- **Nobody has shown they'd pay.** Readlang and Read&Write show that language learners and institutions pay in rich markets. That says nothing about your users.
- The plausible payers are universities, language schools and employers buying seats for L2 staff. That's untested.

---

## 4. Technical feasibility and prioritised problems

### Recommended architecture (v3)

```
Any app ─(Share text)─▶ Ladder PWA (Firebase Hosting, HTTPS)
                         ├─ Dictionary lookup (static files, cached offline)      ← no AI
                         ├─ App Check (reCAPTCHA v3) → initialised BEFORE getAI()
                         ├─ AI Logic hybrid model, PREFER_ON_DEVICE
                         │    ├─ on-device: Chrome Prompt API (Gemini Nano), desktop only
                         │    └─ cloud: gemini-3.5-flash-lite (Gemini Developer API)
                         ├─ IndexedDB: saved words, review results, answer cache, daily counter
                         └─ Remote Config: model name, daily cap, prompts, switches
```

**Terms that matter.**
- The **Prompt API** is Chrome's own browser interface to Gemini Nano.
- **Firebase AI Logic** wraps it: on-device calls go through the Prompt API, and cloud calls go through Google's servers, behind one interface ([Firebase hybrid get-started](https://firebase.google.com/docs/ai-logic/hybrid/web/get-started)).
- The hackathon requires the wrapper.

**Verified in SDK 13.4.0 source and docs:**
- `initializeDeviceModel()` must be called "*after or on* an end-user page interaction" ([Firebase docs](https://firebase.google.com/docs/ai-logic/hybrid/web/get-started)).
- `PREFER_ON_DEVICE` uses the device only when availability is `available`. Otherwise it uses the cloud without saying so.
- `inferenceSource` is `on_device` or `in_cloud`.
- Enum output: `text/x.enum` plus `responseSchema` in the cloud, and the same schema as `responseConstraint` on the device ([structured output](https://firebase.google.com/docs/ai-logic/hybrid/web/generate-structured-output)).
- The SDK **creates a new on-device session for every request** (`createSession()`), so latency per tap must be measured.
- The SDK's default `expectedInputs` include **image** input. Ladder's code overrides this to text-only, which matters because Firebase's dev setup tells you to enable the multimodal flag.

### Status of each requirement

| Requirement | Status |
|---|---|
| Web app (PWA) accepted as a Web (Chrome) entry | **Documented** in the rules |
| Firebase hybrid on a hosted web page | **Documented** |
| Firebase hybrid inside an extension page | **Not documented** by Firebase. Plausible; the rules allow extensions |
| App Check on a hosted web app (reCAPTCHA v3) | **Documented** |
| App Check in an MV3 extension, production | **Blocked** without a backend (Insight 2) |
| On-device answers for users **without Chrome flags** | **Assumption**, conflicting docs. Must be demonstrated |
| On-device answers on your hardware | **Blocked** (hardware) |
| Text sharing from Android apps | **Plausible**: Web Share Target in installed PWAs on Android Chrome. Not tested on your phone |
| iOS sharing into the app | Not available; iPhone users paste |
| Dictionary-first core without AI | Ordinary engineering; nothing here is unusual |

### Ranked problems

**Fatal dependencies (must resolve before the demo)**

| # | Problem and mechanism | Evidence, confidence | If unresolved | Mitigation | Validation test | When |
|---|---|---|---|---|---|---|
| 1 | **On-device path never demonstrated.** You have no qualifying hardware. Firebase docs mention flags. Non-Gemini browser implementations can report `on_device`: Chromium's stub echoes the prompt, and Edge's preview Prompt API runs Phi-4-mini ([Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-edge/web-platform/prompt-api)) | High that this is unverified | No on-device footage; weaker technical-implementation score | Borrow a 16 GB laptop or M-series Mac for an hour. If none is available by 27 Nov, submit honestly without on-device footage | Clean profile, **Chrome stable, no flags**: `availability()` → click setup → 5 known-answer sentences in `ONLY_ON_DEVICE`; assert `inferenceSource === 'on_device'` **and** answers correct (a badge alone isn't proof) | Demo |
| 2 | **Child-directed use breaches provider terms** (original spec) | High (terms text) | Breach of the Gemini and Google Cloud terms; rework | Adults 18+ (v3); state it in onboarding | — | Done in v3 |
| 3 | **Extension cloud path can't be secured** (original spec) | High | Unshippable cloud half | PWA (v3) | — | Done in v3 |

**Fixable weaknesses**

| # | Problem and mechanism | Evidence, confidence | Consequence | Mitigation | Test | When |
|---|---|---|---|---|---|---|
| 4 | **A valid sense that's wrong for the sentence.** The enum stops invention, not error | No benchmark exists; moderate | Confidently wrong meanings | Chosen sense first, others one tap away; NONE → show all | 50 ambiguous sentences labelled by two people; AI vs first-sense baseline | Demo |
| 5 | **Explanations keep keywords but change meaning** (negation, numbers, conditions, cause) | Simplification systems insert and omit facts ([Devaraj et al. 2022](https://arxiv.org/abs/2204.07562)); high | A reader acts on a wrong reading | Original always visible; flag numbers or negations missing from the output; refuse legal, medical and financial text | 20 paragraphs, 10 built around negation and quantities, human-checked | Demo |
| 6 | **"Mastery" from two multiple-choice answers; one sense covering all senses** | Recognition overstates learning ([Goossens 2014](https://repub.eur.nl/pub/58790)); high | Help hidden while the word is still unknown | Track **per sense**; learned = correct on 2 different days; help never removed, only demoted | Review logs in the pilot | Pilot |
| 7 | **Review driven by memory of the original sentence** | Reasoned | Overstated retention | Review in a *new* sentence (dictionary example; AI sentence only if the sense checker agrees); never the source sentence first | Compare same-sentence vs new-sentence accuracy in logs | Pilot |
| 8 | **Uncommon ≠ difficult, and common ≠ easy** ("bank", "fair" have common forms but rare senses) | Reasoned | Missing or noisy highlights | Allow tapping *any* word; frequency only for optional hints | Readers' tap log vs highlighted words | Pilot |
| 9 | **"No accounts" ≠ no personal data.** Shared text plus IP reach Google; archived unpaid terms allow product-improvement use and human review | High | Misleading privacy claim | Consent text; Private mode; send only the sentence, not the paragraph, for sense picking | Read the consent screen against the terms | Demo |
| 10 | **Sensitive sentences stored on shared phones** | Design inspection | Exposure on shared devices | Source sentence stored locally only, optional; "Clear my data" | Inspect IndexedDB after a WhatsApp share | Pilot |
| 11 | **Untrusted text steers the model** | Standard; high | Wrong or injected output | Enum for senses; plain-text rendering; length caps; no tools | A sentence containing instructions | Demo |
| 12 | **Quota exhaustion during judging** | Free tier per project; limits unverified | Ladder stops answering for judges | Dictionary first; cache; per-user daily cap in Remote Config; check limits in AI Studio | Simulate 300 taps; watch the console | Demo |
| 13 | **On-device latency** (CPU path; new session per request) | SDK source; unmeasured | Slow taps | Show the dictionary instantly; AI result replaces it when ready; cancel if over about 3 s, labelled as such | Time 20 taps on the borrowed machine | Demo |
| 14 | **Accessibility.** Custom highlights aren't exposed to assistive technology ([Chrome guidance](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/highlight-text-ranges); [W3C issue #6498](https://github.com/w3c/csswg-drafts/issues/6498)) | High | Screen-reader users can't find the hints | Render the text as real buttons in Ladder's own reader view; keyboard support; adjustable text size | Keyboard-only pass; TalkBack pass | Pilot |
| 15 | **Install friction:** PWA install is needed for the Share target; iOS has no share target | High | Fewer users reach the core flow | Paste box as the fallback; one-screen install guide | Time first use on 3 phones | Pilot |

**Later-stage problems**

| # | Problem | Preferred resolution | When |
|---|---|---|---|
| 16 | Paid tier needs prepayment; credits don't apply | Seat-based pricing for institutions before scaling free users | Wider release |
| 17 | Dictionary licence and attribution (Open English WordNet, CC BY 4.0; verify when downloading); disclosure under the rules | Attribution in the app and README; data licence in the repo | Demo |
| 18 | Children (if ever) | Separate reader with no generative AI, distributed through adults; COPPA review ([amended rule](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule)) | After product validation |

**Residual limits after mitigation:**
- Row 5's check can't catch reversed cause and effect.
- Row 9 can't stop a reader sharing someone else's personal message.
- Row 1 may end with no on-device footage at all.

### How the existing setup-check page could pass without proving anything

Checked against `app/src/App.tsx` and `pickSense.ts`:
- **A badge isn't a model.** A stub implementation or Edge's Phi model would show "On this device". The page also shows ✅/❌ against known answers. **Keep that, and require correct answers, not just the badge.**
- **Five easy sentences prove little.** With three options, all 5 correct by luck is about 0.4%, but a strong model will ace them anyway. The real test is the 50-sentence set against the first-sense baseline.
- **`PREFER_ON_DEVICE` hides fallback.** Use `ONLY_ON_DEVICE` when proving the device path. The page has a selector for this.
- **A model already downloaded hides first-run friction.** Use a clean profile and record the download.
- **Flags.** Test in stable Chrome **without** `chrome://flags` changes; Firebase's instructions enable one.
- **App Check.** A cloud success with a debug token proves nothing about production. On the hosted site, test with reCAPTCHA v3 and no debug token.
- **Small code fix:** compare `inferenceSource` against the SDK's `InferenceSource.ON_DEVICE` and `IN_CLOUD` constants rather than string literals. Firebase's docs print the names `ON_DEVICE` and `IN_CLOUD`, while the SDK's values are `on_device` and `in_cloud`.

---

## 5. Where experts genuinely disagree

| Question | Position A | Position B | Nature of the disagreement | Best fit for Ladder |
|---|---|---|---|---|
| Ask before telling? | Guessing before feedback boosts later memory, even when wrong ([Potts & Shanks 2014](https://discovery-pp.ucl.ac.uk/id/eprint/1399515/1/RPottsLastRevision.pdf)) | Benefits on cued recall didn't replicate in some follow-ups (Seabrooke et al., via search), and nothing tests guessing mid-reading | **Outcome measures and implementation conditions** (lab word lists vs real reading) | Tell first during reading. Offer an optional "guess first" when a saved word returns and in review |
| Simplify or explain? | Simplified text gave the best comprehension ([Yano et al. 1994](https://core.ac.uk/download/32302657.pdf)) | Elaborated text was statistically level, and keeps the words worth learning | **Outcome measures** (understanding now vs exposure to vocabulary) | Explain beside the untouched original |
| First-language or English glosses? | No significant L1 advantage in the 42-study meta-analysis ([Yanagisawa et al. 2020](https://cambridge.org/core/journals/studies-in-second-language-acquisition/article/how-do-different-forms-of-glossing-contribute-to-l2-vocabulary-learning-from-reading/38124150D59DF3039EE1FF5AE88FE922)) | L1 glosses better, g = .33, strongest for beginners ([Kim et al. 2020](https://www.researchgate.net/publication/347660326_The_relative_effects_of_L1_and_L2_glosses_on_L2_learning_A_meta-analysis)) | **Populations** (proficiency) and study selection | English first for fluent readers; L1 explanations later for beginners, cloud only |
| Does retrieval and spacing survive real use? | Yes on recall in a controlled study ([2014](https://repub.eur.nl/pub/58790)) | No effect in real classrooms ([2016](https://repub.eur.nl/pub/98666)) | **Implementation conditions** (dose, delay, what the comparison group did) | Self-motivated adults reviewing their own words resemble the controlled case more, but **test it** |

**Merely incomplete, not disputed:**
- whether gloss findings transfer to native-speaking children or adults with low literacy;
- whether in-flow questions harm comprehension;
- how an LLM-chosen sense compares with a well-written learner's dictionary;
- Gemini Nano's accuracy on this task.

---

## 6. The strongest argument against the mainstream view

**Mainstream claim:** looking up unknown words while reading and practising them later is an efficient way to grow vocabulary, and AI makes the lookup better. It has real support: glossing helps L2 learners (above), and retrieval helps recall in controlled settings.

**Counterargument, in four steps:**
1. **Reading volume does most of the work.** Readers pick up about 15% of unknown words per encounter without any help (Swanborn & de Glopper 1999). If Ladder's prompts make people read less, they can cost more words than they teach.
2. **The weakest readers need something else.** Below-Basic young readers are held back by decoding and fluency ([NCES](https://nces.ed.gov/nationsreportcard/studies/orf/implications.aspx)). The free tools aimed at them, Read Along and Reading Coach, practise reading aloud, not definitions.
3. **Real-world practice may not stick.** Spacing and retrieval vanished in real classrooms ([Goossens 2016](https://repub.eur.nl/pub/98666)).
4. **AI help can lower unaided performance.** High-school students given an unguarded GPT tutor scored 48% higher in practice and 17% lower on the later unaided exam. A guarded version avoided the harm but didn't beat the control group ([Bastani et al. 2025, PNAS](https://www.pnas.org/doi/10.1073/pnas.2422633122)). That was maths, so transfer to vocabulary is uncertain.

**Does it change the recommendation?**
- For children and low-literacy adults: **yes**, steps 2 and 3. It confirms excluding them from this product.
- For fluent adult readers, it sets conditions:
  - reading volume must not fall (measure it);
  - help must be instant and practice optional;
  - success must be judged on **unaided** delayed recall, not in-app accuracy.

---

## 7. What changed in the last 12 months (17 Nov 2025 – 17 Nov 2026)

| When it happened | What changed | Before | What Ladder should do |
|---|---|---|---|
| **5 May 2026** | Prompt API stable on ordinary web pages in Chrome 148 ([Prompt API](https://developer.chrome.com/docs/ai/prompt-api); [release notes](https://developer.chrome.com/release-notes/148)) | Stable only in extensions (Chrome 138) | Build a web app; the extension isn't needed for on-device AI |
| **May 2026** (press reports) | Chrome 147 reportedly downloads Gemini Nano without being asked; admins can block it with `GenAILocalFoundationalModelSettings` ([Neowin](https://www.neowin.net/news/google-chrome-is-reportedly-auto-installing-a-massive-4gb-ai-model-without-your-consent/); [Windows Report](https://windowsreport.com/you-can-now-block-automatic-ai-model-downloads-in-edge-and-chrome/)) | Download on first use | Detect `available`, `downloadable` and policy-blocked states, and explain each |
| **17 Apr 2026** (Android, experimental); **June 2026** (iOS preview) | Firebase hybrid expanded to Android (Gemini Nano via ML Kit) and Apple Foundation Models ([Android blog](https://android-developers.googleblog.com/2026/04/Hybrid-inference-and-new-AI-models-are-coming-to-Android.html); [Firebase blog](https://firebase.blog/posts/2026/06/apple-foundation-models-gemini)) | Web only | A multi-platform route exists later; not for this hackathon |
| **SDK 13.0.0** (date not found) | Default hybrid cloud model became `gemini-3.5-flash-lite` ([config](https://firebase.google.com/docs/ai-logic/hybrid/web/configuration-options)) | Older default | Use the default; make it configurable in Remote Config |
| **2 Nov 2026** | App Check auto-enforced for AI Logic in all projects; delay possible until 21 Jan 2027 ([App Check](https://firebase.google.com/docs/ai-logic/app-check)) | Recommended, then default for new projects | Use a PWA with reCAPTCHA v3 (Insight 2) |
| **16 Nov 2026** | New free-trial accounts can't use $300 credits for the Agent Platform Gemini API; the credits never covered the Gemini Developer API ([FAQ](https://firebase.google.com/docs/ai-logic/faq-and-troubleshooting); [pricing](https://firebase.google.com/docs/ai-logic/pricing)) | Credits usable for Vertex | Don't plan AI costs around credits; credits only help the demo VM |
| **10 Aug 2026**, then **3 Nov 2026** | Gemini in Classroom opened to all K-12 ages, then Google announced Gemini, Gemini in Classroom and Search would be **off by default** for K-12 student accounts (rollout date not given) ([Workspace update](https://workspaceupdates.googleblog.com/2026/08/gemini-in-google-classroom-is-expanding-to-users-of-all-ages-with-contextualized-Gemini-starter-prompts-for-students.html); [EdWeek](https://www.edweek.org/technology/schools-caught-flat-footed-after-google-makes-gemini-chatbot-available-to-all-students/2026/09); [Yahoo/AP-style report](https://www.yahoo.com/news/us/articles/google-turns-off-ai-schoolchildren-195022393.html)) | Gemini for students 18+ only | A future children's product should be AI-free to be adoptable |
| **June 2026** | Read Along in Classroom free for all education users ([Workspace Updates](https://workspaceupdates.googleblog.com/2026/06/read-along-in-google-classroom-is-now-available-to-all-education-users-to-support-foundational-literacy.html)) | Narrower availability | A strong free substitute for young readers |
| **22 Apr 2026** | Compliance date for the amended COPPA rule ([Federal Register](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule)) | 2013 rule | Any US child product needs consent work first |
| **23 Mar 2026** (per search; page blocked) | Current Gemini API terms version; EEA, Swiss and UK users get paid-tier data terms even on unpaid quota ([archive index via search](https://ai.google.dev/gemini-api/terms-archive/terms_12_18_25)) | Paid tier required in those regions (Apr 2025 version) | Recheck the live terms before launch; keep the 18+ scope |

---

## 8. The one assumption that could reverse the verdict

**Assumption:** *for fluent adult readers, saving a looked-up word and getting a short recall review in new sentences leads to better unaided recall a week later than a dictionary pop-up with a saved list, without reducing how much they read.*

- **Why everything depends on it.** Without it, Ladder is a dictionary pop-up with AI attached, competing with Kindle, Gemini and free extensions. The product verdict, any business, and the "potential impact" story all rest on it.
- **Evidence for:** retrieval improved delayed recall in a controlled study ([2014](https://repub.eur.nl/pub/58790)); glossing helps L2 vocabulary ([2020](https://cambridge.org/core/journals/studies-in-second-language-acquisition/article/how-do-different-forms-of-glossing-contribute-to-l2-vocabulary-learning-from-reading/38124150D59DF3039EE1FF5AE88FE922)).
- **Evidence against:** null effects in real classrooms ([2016](https://repub.eur.nl/pub/98666)); recognition gains don't mean recall gains; no study covers self-directed adult review of words from any text.
- **What would falsify it:** any of these: no recall gain over the baseline; less reading in the Ladder condition; most review prompts skipped.

**Cheapest credible test (no AI, no finished app):**
- **People:** 8–12 adults who read English as an additional language. Recruit remotely through a WhatsApp group; testing on yourself can't work, because you already know which words are targets.
- **Materials:** two matched 500–600-word passages, 10 target words each, with a pre-check that readers don't know them.
- **Design:** each person does both conditions, with order and passage swapped.
  - A = word list with meanings (dictionary baseline).
  - B = the same, plus a 3-minute recall review the next day (a Google Form with new sentences).
- **Measures:**
  - comprehension questions straight after reading;
  - unaided recall of meanings at day 7;
  - a new-sentence cloze item per word (transfer);
  - time spent and share of each passage read (interruption);
  - how many review items were skipped (reliance and engagement).
- **Cost:** your time only. Run it after the hackathon if time is short; the hackathon doesn't depend on it.

**What each result means** (thresholds are my recommendations, not research findings):

| Day-7 result | Decision |
|---|---|
| B beats A by 2 or more of 10 words on average, reading time within about 10%, fewer than half of reviews skipped | **Proceed.** Build the loop as the core; run a larger test with the real app |
| Gain under 2 words, or reading clearly reduced, or most reviews skipped | **Redesign.** Make review lighter and more optional; test again |
| No gain or a loss | **Stop the learning claims.** Ship it as a reading aid, or end the project after the hackathon |

---

## 9. The version worth building, and how to validate it

**Build v3 with the changes below:** an installable web app for adults 18+ who read English for study or work.

**Core workflow:**
1. Share or paste text; Ladder shows it with tappable words.
2. Tap → dictionary meaning instantly → if the word has several senses, AI picks the one for this sentence (labelled "On this device" or "Google cloud"); other senses one tap away; "Hear the word".
3. Save → stored per sense on the device.
4. When a saved word appears in newly shared text: an optional one-tap "What does it mean here?" before showing it.
5. Daily review: 2–3 words in new sentences; pick the meaning; learned = correct on two different days; help never removed.

| Keep | Change | Postpone | Remove |
|---|---|---|---|
| Dictionary-first card; enum sense picker; labels; Private mode; explanation beside the original; local storage; daily cap | Sense picker kept only if it beats first-sense by your threshold; review tracked per sense; optional guess on re-encounter | Sign-in and sync; extension; L1 explanations; pictures | Child mode; fading as a selling point; quiz before the first reveal; "only tool" and "improves reading" claims |

**Minimum technical feasibility test (about 1 hour once Firebase exists, plus 1 hour on a borrowed machine):**
1. Hosted app with App Check on **reCAPTCHA v3 (no debug token)** → 5 cloud answers correct, label `in_cloud`. Then confirm requests without a valid token fail.
2. Android phone: install, share a sentence from WhatsApp, answer appears.
3. Borrowed capable laptop, clean profile, Chrome stable, **no flags** → `availability()`, then the setup button with download progress, then **`ONLY_ON_DEVICE`** with 5 known answers correct and `inferenceSource === 'on_device'`. Record latency for 20 taps.
4. Offline (DevTools > Network > Offline): on-device still answers; cloud fails visibly; dictionary still works.

**Minimum user-value test:**
- **Before the demo:** the 50-sentence sense benchmark (two labellers, AI vs first-sense baseline) and the 20-paragraph explanation check.
- **After the demo:** the §8 retention test. These are separate questions; don't let the first stand in for the second.

**Outcome measures:**

| Outcome | Measure |
|---|---|
| Comprehension | Questions on today's text |
| Delayed retention | Unaided recall at day 7 |
| Transfer | Cloze in a new sentence |
| Interruption | Time on text; share of text read; taps per 100 words |
| Reliance | AI calls per word over sessions; review skips |

**Credible 3-minute demo:**

| Time | Shows |
|---|---|
| 0:00–0:20 | A student stuck on "bank" in course reading; a dictionary lists many meanings; Gemini answers but forgets |
| 0:20–1:00 | Android: Share from WhatsApp → meaning for this sentence ("Google cloud"); the same word in another sentence gets another meaning; airplane mode → dictionary still works |
| 1:00–1:30 | Capable laptop: "On this device", DevTools Offline still answers, Private mode |
| 1:30–2:10 | Save → saved word returns in new text with an optional guess → next-day review card in a new sentence |
| 2:10–2:40 | **Your numbers:** sense accuracy vs first-sense baseline on 50 sentences; on-device vs cloud latency; share of answers from the device in your own use |
| 2:40–3:00 | Architecture; stated limits; what's next (the retention test) |

**What it proves:** hybrid routing works in a real product flow; the sense picker has a measured advantage (or not) over a simple baseline; the core works offline and on cheap phones.
**What it can't prove:** learning, adoption, willingness to pay, safety on arbitrary text, any benefit for children.

**Proceed, redesign and stop conditions:**

| Checkpoint | Proceed | Redesign | Stop |
|---|---|---|---|
| Cloud path, by 20 Nov | Steps 1–2 pass | App Check issues → ask in #hackathon-help the same day | Still not working by 23 Nov → don't enter. A version without Firebase AI Logic doesn't qualify |
| On-device, by 27 Nov | Step 3 passes | Works only with flags → state it plainly; keep the code path | No machine available → submit without on-device footage, said honestly |
| Sense picker, by 24 Nov | ≥ 10 points over the first-sense baseline *(recommended threshold)* | Smaller gain → show all senses with the AI choice first | No gain → drop the AI from this step and say so; AI stays for explanations |
| Retention, after the hackathon | §8 proceed | §8 redesign | §8 stop |

Order the work by the uncertainty it removes: cloud path → dictionary core → benchmark → on-device check → review loop → polish.

---

## 10. What to read or explore next

| Rank | Source | Question it answers | Decision it could change |
|---|---|---|---|
| 1 | [Firebase hybrid web get-started](https://firebase.google.com/docs/ai-logic/hybrid/web/get-started) and [configuration options](https://firebase.google.com/docs/ai-logic/hybrid/web/configuration-options) | Flags, modes, download rules, unsupported features | How the on-device test is run and what to promise |
| 2 | [Official rules](https://firebasehybridaihackathon.devpost.com/rules) | Exact submission duties, disclosure, "judges may not test" | Video-first effort; README content |
| 3 | [Chrome Prompt API](https://developer.chrome.com/docs/ai/prompt-api) | Hardware, languages, contexts | Who gets on-device; L1 plans |
| 4 | [AI Logic pricing](https://firebase.google.com/docs/ai-logic/pricing) plus your project's limits in AI Studio | Free ceiling; prepayment | Daily cap; business model |
| 5 | [Goossens et al. 2016](https://repub.eur.nl/pub/98666) | Why retrieval and spacing failed in real use | Review design and the §8 test |
| 6 | [Yanagisawa, Webb & Uchihara 2020](https://cambridge.org/core/journals/studies-in-second-language-acquisition/article/how-do-different-forms-of-glossing-contribute-to-l2-vocabulary-learning-from-reading/38124150D59DF3039EE1FF5AE88FE922) | Which gloss forms teach most, for whom | Card format; L1 support |
| 7 | [Potts & Shanks 2014](https://discovery-pp.ucl.ac.uk/id/eprint/1399515/1/RPottsLastRevision.pdf) | Does guessing before feedback help? | The optional "guess first" feature |
| 8 | [Rewordify learned words](https://rewordify.com/helpskiplearned.php) and Kindle Word Wise (user guide) | How existing tools judge "learned" and pick senses | Your differentiator wording |
| 9 | [Devaraj et al. 2022](https://arxiv.org/abs/2204.07562) | How simplification changes facts | The explanation guardrails |
| 10 | [Bastani et al. 2025](https://www.pnas.org/doi/10.1073/pnas.2422633122) | How AI help can harm unaided performance | Unaided testing; how much help to give |

### The three most valuable next actions, in order

1. **Create the Firebase project today and send the web config and reCAPTCHA site key.** I wire the hosted app; you run the setup-check page from your phone. This retires the biggest dependency you control.
2. **Line up one capable machine for one hour before 27 Nov** (a friend's 16 GB laptop or an M-series Mac). Meanwhile, build the dictionary-first core, which doesn't depend on it.
3. **Build the 50-sentence sense benchmark by 24 Nov.** It decides whether the AI step earns its place and gives the video a real number. Schedule the §8 retention test for after the hackathon: it decides the product.
