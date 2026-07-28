# Portfolio UI Overhaul Design

## Overview

Modernize the Mahmud Portfolio with "Glow & Motion" — adding glassmorphism, scroll animations, and subtle visual polish while keeping the dark theme.

## Tech Stack

- Gatsby (React)
- Tailwind CSS v4
- Framer Motion (installed but unused)

---

## 1. Global Enhancements

### CSS Additions

- **Scrollbar:** Thin, teal accent color
- **Smooth scroll:** `html { scroll-behavior: smooth; }`
- **Selection:** Teal background, navy text
- **Glow utilities:** Reusable classes for glow effects

### Animation Strategy

- Use Framer Motion `whileInView` for scroll-triggered animations
- `viewport={{ once: true, margin: "-100px" }}` — animations play once when section enters view
- Stagger children for lists (experience, projects, skills)

---

## 2. Layout Component

### Navbar

- **Glassmorphism:** `backdrop-blur-md bg-navy-900/80`
- **Border:** Subtle bottom border `border-b border-teal/10`
- **Mobile menu:** Add hamburger icon → slide-in menu from right
- (Optional) Shrink nav on scroll

### Footer

- Keep simple, subtle top glow line

---

## 3. Hero Section

### Visual

- Subtle radial gradient glow behind profile image (CSS)
- Text gradient on name: `text-slate-lightest → text-teal` (subtle)

### Animation

- Staggered entrance: greeting → name → subtitle → description → buttons
- Each element fades up with slight delay
- Profile image: scale up from 0.9 with fade
- Buttons: subtle pulse or float

---

## 4. About Section

### Visual

- Left border accent on section

### Animation

- Section title: fade-up
- Paragraphs: fade-up with 0.2s stagger
- Highlights list: stagger each bullet

---

## 5. Experience Section

### Visual

- Card glassmorphism: `bg-navy-800/50 backdrop-blur-sm`
- Subtle border glow on hover: `border-teal/30`

### Animation

- Timeline dots: fade-in with scale
- Cards: fade-up, stagger by 0.1s
- Tags: fade-in with stagger

---

## 6. Projects Section

### Visual

- Card glassmorphism: `bg-navy-800/50 backdrop-blur-sm`
- Subtle glow behind cards on hover
- Folder icon: subtle pulse animation

### Animation

- Cards: fade-up with stagger
- Hover: scale 1.02 + glow intensify

---

## 7. Skills Section

### Visual

- Card glassmorphism
- Subtle gradient border (animated gradient using CSS)

### Animation

- Category cards: fade-up with stagger
- Skill tags: fade-in with stagger

---

## 8. Blog Section

### Visual

- Card glassmorphism
- Arrow icon that animates on hover

### Animation

- Cards: fade-up with stagger

---

## 9. Speaking Section

### Visual

- Keep image treatment, enhance offset border effect

### Animation

- Image: fade-in with slide
- Text content: fade-up

---

## 10. Contact Section

### Visual

- Subtle glow behind CTA area

### Animation

- Title: fade-up
- Text: fade-up (delayed)
- Button: pulse animation
- Social icons: stagger fade-in

---

## Implementation Order

1. Global CSS (scrollbar, smooth scroll, glow utilities)
2. Layout (glassmorphism + mobile menu)
3. Hero (animations + glow)
4. Remaining sections (add glassmorphism + animations)

---

## Summary

| Component | Visual | Animation |
|-----------|--------|-----------|
| Layout | Glassmorphism nav, mobile menu | Nav shrink on scroll |
| Hero | Gradient glow, text gradient | Staggered entrance |
| About | Border accent | Fade-up stagger |
| Experience | Glass cards, hover glow | Timeline + cards fade-up |
| Projects | Glass cards, hover glow | Cards fade-up stagger |
| Skills | Glass cards, gradient border | Cards fade-up stagger |
| Blog | Glass cards, animated arrow | Cards fade-up |
| Speaking | Enhanced image effect | Image + text fade-up |
| Contact | Glow behind CTA | Staggered fade-up |