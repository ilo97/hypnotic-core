# 💃 Nisro Motion Language — Easing Reference

> **Regel:** Keine linearen Bewegungen. Alles muss atmen, federn, fließen.

---

## 1. CSS Easing Curves (Copy & Paste)

### Elastic / Federnd — Für Buttons, Cards, Interaktionen
```css
/* Sanftes Überschwingen — unser Standard für Interaktionen */
--ease-elastic: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Stärkeres Überschwingen — für heroische Entrances */
--ease-bounce: cubic-bezier(0.18, 0.89, 0.32, 1.28);

/* Mikro-Überschwingen — für subtile Hover */
--ease-micro: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### Float / Schwebend — Für schwebende Elemente, Backgrounds
```css
/* Sanftes Schweben — unser Standard für Float-Animationen */
--ease-float: cubic-bezier(0.42, 0, 0.58, 1);

/* Langsames Atmen — für Hintergrund-Pulsationen */
--ease-breathe: cubic-bezier(0.45, 0, 0.55, 1);
```

### Smooth / Fließend — Für Übergänge, Transitions
```css
/* Sanftes Ein- und Ausblenden */
--ease-smooth: cubic-bezier(0.65, 0, 0.35, 1);

/* Beschleunigt rein, sanft raus — für Reveals */
--ease-out: cubic-bezier(0, 0, 0.2, 1);

/* Sanft rein, beschleunigt raus — für Exits */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

### Magnetic / Anziehend — Für Cursor-Interaktionen
```css
/* Beschleunigt zum Cursor hin */
--ease-magnetic: cubic-bezier(0.1, 0.9, 0.2, 1);

/* Träge, nachziehend — für Liquid-Effekte */
--ease-liquid: cubic-bezier(0.25, 0.1, 0.25, 1);
```

---

## 2. GSAP Easing (Copy & Paste)

```javascript
// === ELASTIC (Buttons, Cards, Micro-Interactions) ===
// Standard Elastic
gsap.to(el, { scale: 1.05, ease: "elastic.out(1, 0.3)", duration: 0.6 });

// Soft Elastic
gsap.to(el, { y: -20, ease: "elastic.out(1, 0.5)", duration: 0.8 });

// Strong Bounce
gsap.to(el, { scale: 1.1, ease: "back.out(3)", duration: 0.5 });

// === FLOAT (Hero Elements, Backgrounds) ===
// Sanftes Schweben (Sine-Welle)
gsap.to(el, { 
  y: -15, 
  ease: "sine.inOut", 
  duration: 2, 
  yoyo: true, 
  repeat: -1 
});

// === SMOOTH (Transitions, Page Loads) ===
gsap.to(el, { 
  opacity: 1, 
  y: 0, 
  ease: "power4.out", 
  duration: 1.2 
});

// Stagger für Listen
gsap.to(items, { 
  opacity: 1, 
  y: 0, 
  ease: "power3.out", 
  duration: 0.8, 
  stagger: 0.08 
});

// === LIQUID (Flowing, Morphing) ===
gsap.to(el, { 
  scaleX: 1.2, 
  scaleY: 0.8, 
  ease: "sine.inOut", 
  duration: 1.5, 
  yoyo: true, 
  repeat: -1 
});
```

---

## 3. Framer Motion (Copy & Paste)

```jsx
// === ELASTIC (Standard für Interaktionen) ===
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
/>

// === FLOAT (Schwebendes Element) ===
<motion.div
  animate={{ y: [0, -20, 0] }}
  transition={{ 
    duration: 3, 
    repeat: Infinity, 
    ease: "easeInOut" 
  }}
/>

// === STAGGER (Listen-Animation) ===
<motion.div
  variants={{
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }}
  initial="hidden"
  animate="visible"
  transition={{ staggerChildren: 0.1 }}
/>

// === MAGNETIC (Cursor folgen) ===
<motion.div
  animate={{ x: mouseX * 0.05, y: mouseY * 0.05 }}
  transition={{ type: "spring", stiffness: 150, damping: 15 }}
/>
```

---

## 4. Timing-Referenz

| Bewegung | Dauer | Easing | Kontext |
|----------|-------|--------|---------|
| **Mikro-Hover** | 150-200ms | elastic.out | Button, Link |
| **Card Hover** | 300-400ms | back.out(2) | Cards, Panels |
| **Page Enter** | 800-1200ms | power4.out | Hero, Headline |
| **Page Exit** | 400-600ms | power2.in | Navigation |
| **Float Loop** | 2000-4000ms | sine.inOut | Schwebende Elemente |
| **Scroll Reveal** | 600-900ms | power3.out | Scroll-Animationen |
| **Particle Drift** | 3000-8000ms | linear | Partikel-Leben |
| **Colour Shift** | 1000-2000ms | ease-in-out | Hintergrund-Übergänge |

---

## 5. Die Goldene Regel

```
schnell rein (100-200ms) → federt kurz über → bleibt (overshoot) 
→ bei User-Interaktion sofort reagieren → Feedback geben
→ dann langsam in Ruhezustand zurück
```

**Die Nisro-Signatur:** Immer einen Tick mehr Elasticity, als man denkt.  
Ein Element das federt, fühlt sich lebendig an. Ein Element das linear ist, fühlt sich tot an.

---

> **Wenn unsicher:** `cubic-bezier(0.34, 1.56, 0.64, 1)` und Duration 0.6s  
> Das ist unser Haus-Easing. Überschwingend, federnd, befriedigend.