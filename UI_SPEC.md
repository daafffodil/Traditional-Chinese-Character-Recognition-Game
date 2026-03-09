# UI_SPEC.md

## Project
Traditional-Chinese-Character-Recognition-Game

## Purpose

This document defines the UI/visual design rules for the project.

The goal is to upgrade the current interface from a basic engineering-style UI into a **premium children’s learning app UI**.

This file is for design direction only.  
It should guide future UI implementation, but should not change product logic.

---

# 1. Design Goal

The product should feel like:

- a children’s educational app
- friendly
- playful
- soft
- modern
- polished
- easy to understand
- visually premium

It should **not** feel like:

- an admin dashboard
- a developer demo
- a plain HTML form
- a spreadsheet-like table app
- a dark or serious tool

---

# 2. Style Direction

The target style is:

**Lingokids-style children’s learning app + Dribbble-quality polished educational UI**

This means:

- rounded cards
- soft gradients
- warm and friendly interface
- large buttons
- strong readability
- clear visual hierarchy
- game-like but still web-friendly
- premium look without becoming overly flashy

---

# 3. Core Visual Keywords

Use these visual keywords consistently:

- friendly
- playful
- soft
- clean
- bright
- rounded
- lightweight
- game-inspired
- modern children’s education app
- premium but simple

---

# 4. Layout Rules

## Overall layout

The page should feel spacious and centered.

Preferred structure:

1. Header area
2. Main game card
3. Answer options area
4. Feedback/result card
5. History and ranking area

Avoid overly dense layouts.

Use generous spacing between sections.

---

## Desktop layout

Desktop should feel like a polished educational app page.

Suggested structure:

- top header with title + player controls
- central game card as the visual focus
- answer buttons below the card
- result/feedback area below
- history and ranking as clean bottom sections

---

## Mobile / narrow screens

On smaller screens:

- stack sections vertically
- keep buttons large
- keep cards readable
- preserve generous spacing
- avoid tiny table-like layouts

---

# 5. Header Design Rules

The header should contain:

- app title / logo area
- player name input
- mode switcher

The header should feel:

- simple
- friendly
- lightweight
- not crowded

Use soft visual separation instead of hard borders.

---

# 6. Main Game Card Rules

The main game card is the visual center of the page.

It should contain:

- current simplified character
- question sentence
- current blank highlight state
- optional small helper label / status

The main card should be:

- large
- centered
- rounded
- visually calm
- easy to scan

This card must have enough padding and white space.

Avoid cramped text.

---

# 7. Answer Button Rules

Answer buttons are a major interactive element.

They should be:

- large
- easy to click
- rounded
- visually distinct
- evenly spaced
- suitable for children

Use button states clearly:

- default
- hover
- active
- selected
- correct
- incorrect
- disabled

Buttons should feel tactile and playful.

Avoid plain rectangular form buttons.

---

# 8. Feedback Card Rules

The feedback card should appear after answering.

It should feel like encouragement, not system output.

Examples of emotional tone:

- positive
- warm
- supportive
- teacher-like
- rewarding

Success state:
- visually cheerful
- clear confirmation
- explanation visible

Error / partial success state:
- still friendly
- not harsh
- encourages retry / learning

Avoid “error message” styling.

---

# 9. History and Ranking Design Rules

History and ranking sections should not feel like raw database tables.

They should feel more like:

- clean learning records
- child-friendly score panels
- soft cards or list rows

Avoid:
- harsh borders
- dense spreadsheet style
- overly technical columns

Each row should be easy to read at a glance.

---

# 10. Multi-Mapping Mode Display Rules

Multi-mapping mode has a different information priority than single-mapping mode.

## Multi-mapping recent history

Should focus on:

- Name
- Simplified
- Accuracy
- Perfect
- Date

Do not emphasize:
- Grid
- Time
- raw blank count as a separate column

Accuracy should be visually clear.

Perfect status should be represented with:

- ✅ for perfect answers
- empty otherwise

---

## Multi-mapping ranking

The second table should use a correctness-oriented identity.

It should not look like a speed leaderboard.

The UI label should reflect accuracy/correctness ranking.

This section should visually communicate:

- who performed best
- who got the most blanks correct
- who achieved perfect answers

---

# 11. Blank Interaction Visual Rules

In multi-mapping mode, blanks are a key visual element.

Each blank should visually communicate one of these states:

- inactive blank
- current active blank
- filled blank
- correct blank
- incorrect blank

The current active blank must be visually obvious.

Recommended feel:

- soft highlight
- colored outline
- slightly elevated or accented state

Avoid weak or invisible blank state differences.

---

# 12. Color Rules

Use a bright but soft children’s learning palette.

Do not use overly saturated cheap “kindergarten poster” colors.

The palette should feel modern and premium.

## Color roles

### Primary color
Used for:
- main highlights
- important buttons
- selected states
- title emphasis

Preferred feeling:
- safe
- educational
- energetic but controlled

### Secondary accent
Used for:
- playful highlights
- reward accents
- supporting UI tags

### Success color
Used for:
- correct states
- positive feedback
- perfect answers

### Soft warm accent
Used sparingly for:
- badges
- decorative emphasis
- child-friendly warmth

### Neutral background colors
Use:
- off-white
- very pale blue
- very pale warm cream
- very light pastel background

Avoid:
- stark pure white everywhere
- heavy dark themes
- harsh high-contrast enterprise colors

---

# 13. Background Rules

The page background should not be plain, flat white.

Preferred direction:

- very soft gradient
- light educational app feeling
- subtle depth
- calm and bright

Background must stay subtle.

It should support the cards, not compete with them.

Avoid:
- busy illustrations in the background
- noisy patterns
- overly decorative scene art

---

# 14. Typography Rules

Typography must prioritize readability for children.

Requirements:

- clear hierarchy
- large title
- large question text
- large answer buttons
- readable supporting text
- comfortable line spacing

The simplified character prompt should be visually prominent.

Avoid:
- small font sizes
- overly thin text
- tightly packed text
- overly formal or academic typography feeling

---

# 15. Shape Rules

Rounded shapes are essential.

Use rounded design consistently across:

- cards
- buttons
- inputs
- tags
- feedback areas

Overall visual tone should feel soft and toy-like, not rigid.

Avoid sharp corners as the dominant style.

---

# 16. Shadow and Depth Rules

Use soft shadows and gentle depth.

The UI should feel lightly layered.

Use shadows to:

- separate cards from background
- make buttons feel tappable
- create a polished app-like feel

Avoid:
- heavy dark shadows
- old-school web shadows
- extreme glassmorphism
- overly dramatic floating effects

---

# 17. Component Behavior Rules

## Inputs
Player name input should feel soft and app-like.

Avoid plain browser-default form styling.

## Mode switch
Mode switch should feel like part of the game UI, not a developer toggle.

## Buttons
Buttons should feel playful, not technical.

## Cards
Cards should be soft, rounded, and roomy.

## Tags / status pills
Use small rounded status indicators where helpful.

---

# 18. Icon / Decorative Rules

Icons and decorative elements may be used sparingly.

Good use cases:

- title icon
- result icon
- section labels
- small status accents

Preferred icon feeling:

- friendly
- educational
- lightweight
- playful

Avoid overloading the UI with too many icons.

Do not make the interface feel noisy.

---

# 19. Animation / Motion Rules

If motion is used, keep it subtle.

Recommended:

- soft hover lift
- button press feedback
- smooth transitions
- gentle success emphasis

Avoid:
- exaggerated bouncing everywhere
- distracting motion
- arcade-like chaos

This is a children’s education app, not a fast arcade game.

---

# 20. Accessibility Rules

Even though the style is playful, the interface must remain accessible.

Requirements:

- high enough contrast
- large click targets
- large readable text
- obvious active states
- obvious correct/incorrect states

Do not sacrifice usability for decoration.

---

# 21. UI Priority Rules

When redesigning the interface, preserve this priority:

1. readability
2. clarity
3. friendliness
4. interaction quality
5. polish
6. decoration

Decoration should never reduce usability.

---

# 22. Implementation Boundary

The UI redesign should:

- improve visuals significantly
- preserve current logic
- preserve current data flow
- preserve database behavior
- avoid unnecessary architecture changes

This is a UI refinement pass, not a full product rewrite.

---

# 23. Final Design Summary

The final interface should feel like:

- a polished children’s literacy app
- more like Lingokids than a dashboard
- more refined than Duolingo’s default UI
- modern, rounded, soft, bright, and premium
- easy for children to understand
- pleasant for adults to trust

The ideal result is:

**children’s educational app visual quality, built with practical web UI components**
