# Implementation Plan: Portfolio UI Overhaul

## Phase 1: Global Foundation

### 1.1 Update Global CSS
**File:** `src/styles/global.css`

- [ ] Add smooth scroll: `html { scroll-behavior: smooth; }`
- [ ] Style scrollbar (thin, teal accent)
- [ ] Update selection color: `::selection { background: teal; color: navy-900; }`
- [ ] Add glow utility classes:
  - `.glow-teal` — box-shadow with teal
  - `.text-gradient` — for gradient text effects

---

## Phase 2: Layout Component

### 2.1 Navbar Glassmorphism
**File:** `src/components/Layout.tsx`

- [ ] Update nav background: `bg-navy-900/80 backdrop-blur-md`
- [ ] Add border: `border-b border-teal/10`

### 2.2 Mobile Menu
**File:** `src/components/Layout.tsx`

- [ ] Add hamburger icon button (visible on md and below)
- [ ] Create mobile menu state (`useState`)
- [ ] Add slide-in menu panel from right
- [ ] Include all nav links + resume button in mobile menu
- [ ] Close menu on link click
- [ ] Add animations for open/close

---

## Phase 3: Hero Section

### 3.1 Visual Enhancements
**File:** `src/components/Hero.tsx`

- [ ] Add radial gradient glow behind profile image (CSS pseudo-element)
- [ ] Add subtle text gradient on name

### 3.2 Animations (Framer Motion)
**File:** `src/components/Hero.tsx`

- [ ] Import `motion` from framer-motion
- [ ] Wrap greeting in `<motion.p>` — fade-up, initial opacity 0
- [ ] Wrap name in `<motion.h1>` — fade-up, delay 0.1
- [ ] Wrap subtitle in `<motion.h2>` — fade-up, delay 0.2
- [ ] Wrap description in `<motion.p>` — fade-up, delay 0.3
- [ ] Wrap buttons in `<motion.div>` — fade-up, delay 0.4, stagger children
- [ ] Wrap profile image — scale from 0.9, fade, delay 0.3

---

## Phase 4: About Section

### 4.1 Visual
**File:** `src/components/About.tsx`

- [ ] Add left border accent on section

### 4.2 Animations
**File:** `src/components/About.tsx`

- [ ] Title: `<motion.h2>` with fade-up
- [ ] Paragraphs: wrap in motion elements, stagger
- [ ] Highlights list: stagger each `<li>` with 0.1s delay

---

## Phase 5: Experience Section

### 5.1 Visual
**File:** `src/components/Experience.tsx`

- [ ] Update card background: `bg-navy-800/50 backdrop-blur-sm`
- [ ] Add hover border: `hover:border-teal/30`

### 5.2 Animations
**File:** `src/components/Experience.tsx`

- [ ] Timeline dots: `<motion.span>` with scale animation
- [ ] Job cards: wrap in `<motion.div>` — fade-up, stagger 0.1s
- [ ] Tags: fade-in with stagger

---

## Phase 6: Projects Section

### 6.1 Visual
**File:** `src/components/Projects.tsx`

- [ ] Update card background: `bg-navy-800/50 backdrop-blur-sm`
- [ ] Add hover glow effect (box-shadow on hover)
- [ ] Add pulse animation to folder icon

### 6.2 Animations
**File:** `src/components/Projects.tsx`

- [ ] Title: fade-up
- [ ] Project cards: fade-up with stagger 0.1s
- [ ] Add hover scale: `whileHover={{ scale: 1.02 }}`

---

## Phase 7: Skills Section

### 7.1 Visual
**File:** `src/components/Skills.tsx`

- [ ] Update card background: `bg-navy-800/50 backdrop-blur-sm`
- [ ] Add gradient border effect on cards

### 7.2 Animations
**File:** `src/components/Skills.tsx`

- [ ] Title: fade-up
- [ ] Category cards: fade-up with stagger
- [ ] Skill tags: fade-in with stagger

---

## Phase 8: Blog Section

### 8.1 Visual
**File:** `src/components/Blog.tsx`

- [ ] Update card background: `bg-navy-800/50 backdrop-blur-sm`
- [ ] Add animated arrow icon on hover

### 8.2 Animations
**File:** `src/components/Blog.tsx`

- [ ] Title: fade-up
- [ ] Article cards: fade-up with stagger

---

## Phase 9: Speaking Section

### 9.1 Visual
**File:** `src/components/Speaking.tsx`

- [ ] Enhance offset border effect on image

### 9.2 Animations
**File:** `src/components/Speaking.tsx`

- [ ] Image: fade-in with slide from left
- [ ] Text content: fade-up (delayed)

---

## Phase 10: Contact Section

### 10.1 Visual
**File:** `src/components/Contact.tsx`

- [ ] Add subtle glow behind CTA area (CSS)

### 10.2 Animations
**File:** `src/components/Contact.tsx`

- [ ] Title: fade-up
- [ ] Description: fade-up with delay
- [ ] Button: add pulse animation
- [ ] Social icons: stagger fade-in

---

## Testing Checklist

- [ ] Verify all animations work on scroll
- [ ] Test mobile menu on various screen sizes
- [ ] Check glassmorphism effect visibility
- [ ] Ensure no layout shifts from animations
- [ ] Verify smooth scroll works
- [ ] Test hover states on all interactive elements

---

## Estimated Time

- Phase 1: 15 min
- Phase 2: 30 min
- Phase 3: 25 min
- Phase 4-10: ~20 min each
- Testing: 15 min

**Total: ~3.5 hours**