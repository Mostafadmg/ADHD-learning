# Image style guide and prompts

One house style for every teaching image, so the course looks designed, not assembled.

## House style (paste at the start of every prompt)

> Soft, warm, semi-realistic digital painting, like a premium editorial illustration. Natural daylight,
> bright clean interiors, plants, pale blue and warm cream palette with teal (#0b6664) and coral (#a8432e)
> accents, deep navy (#16324f) for text. Diverse, realistic adults and children with natural expressions,
> no caricature. Each scene sits in a soft brush-edged vignette on a white background. 16:9, 1672 × 941 px.
> UK setting (UK school uniforms, UK offices and homes). Professional, calm and respectful; never mocking.

## Text rules (AI images often get text wrong)

- Prefer **no text in the image**: the page adds titles and labels, which keeps them accurate,
  translatable and readable by screen readers.
- If you do want text, keep it to a title and 2–4 short labels, then **check every word letter by letter**
  before using the image. (The current "whole person" image has the typo "functi'oning".)
- Never put clinical facts (doses, criteria, numbers) in an image.

## Module 1 images to make

### 1. Replace `m1-whole-person.webp` (fix the typo)
> [house style] Title: "Understanding the whole person". Subtitle: "ADHD assessment brings together history,
> experiences and clinical judgement." Centre: an adult patient in a teal cardigan talking with a clinician
> holding notes in a calm consulting room. Four round vignettes: top left "Developmental history" (school
> photo and old school report book); top right "Information from others" (the patient with a partner);
> bottom left "Everyday functioning" (the patient working at home, partner cooking); bottom right
> "Health and other possible explanations" (clinician reviewing notes, small moon icon for sleep).
> Bottom banner: "Questionnaires can support the conversation."

### 2. Replace `m1-classroom` (Lesson 1, child walkthrough)
> [house style] No text. A UK primary classroom. Left: an 8-year-old boy gazing out of the window with an
> unfinished worksheet. Centre: a classmate working steadily on the same task. Right: a kind teacher
> observing from the front with a clipboard. Space around each person (numbered markers will be placed on
> the boy, the classmate, the teacher and the worksheet).

### 3. Replace `m1-adult-work` (Lesson 6, adult walkthrough)
> [house style] No text. A woman in her thirties at a cluttered home-office desk, head in one hand, phone in
> the other, a wall of sticky notes and an over-full wall calendar behind her, an open diary, piles of
> paper, a cold cup of coffee, one foot jiggling under the desk. Overwhelmed but sympathetic, not comic.

### 4. Replace `m1-symptom-domains` (Lesson 2, the two symptom groups)
> [house style] No text. Split scene with a soft divider. Left half, "inattention": a young adult at a desk
> drifting off, half-written notes, keys left on the table, a calendar reminder being ignored. Right half,
> "hyperactivity-impulsivity": the same person restless in a meeting, tapping a pen, about to interrupt,
> standing up early. Same character on both sides.

## After a new image arrives

1. Save it in `images/` as `.webp`, same name as the one it replaces.
2. Walkthrough figures have numbered markers positioned by percentage (`style="left:..%;top:..%"` on each
   `.wk-mark` in `index.html`). Move each marker so it sits on the right detail in the new picture.
3. Bump the `?v=` version on the CSS/JS links in `index.html` if you also changed code.
