# 🎨 Nisro Color System — Creative Reference

> **Philosophie:** Jede Farbe muss einen Zweck haben, eine Emotion transportieren.  
> Keine zufälligen Farben. Jede Palette erzählt eine Geschichte.

---

## 1. LUXURY PREMIUM — "Goldener Dunst"
*Für: High-End Brands, Premium Produkte, Luxus-Konfiguratoren*

| Rolle | Hex | RGB | Einsatz |
|-------|-----|-----|---------|
| **Primär (Tiefe)** | `#0A0A0A` | rgb(10,10,10) | Hintergrund, Basis |
| **Sekundär (Wärme)** | `#1A1A2E` | rgb(26,26,46) | Cards, Container |
| **Akzent (Gold)** | `#D4AF37` | rgb(212,175,55) | CTA, Hover, Highlights |
| **Akzent Hell** | `#F5E6C8` | rgb(245,230,200) | Text, Subtile Elemente |
| **Weiß** | `#FAFAFA` | rgb(250,250,250) | Primärtext |
| **Glow** | `#FFD700` | rgb(255,215,0) | Bloom/Glow Effekte |

**Shader Tipp:** Chromatic Aberration mit Gold-Cyan-Verschiebung an Kanten.

---

## 2. TECH FUTURISTISCH — "Neon Dämmerung"
*Für: Tech Brands, Startups, innovative Produkte*

| Rolle | Hex | RGB | Einsatz |
|-------|-----|-----|---------|
| **Primär (Tiefe)** | `#0A1128` | rgb(10,17,40) | Hintergrund |
| **Sekundär** | `#1A1A3E` | rgb(26,26,62) | Cards, UI-Elemente |
| **Akzent (Cyan)** | `#00F0FF` | rgb(0,240,255) | CTA, Highlights, Glow |
| **Akzent (Magenta)** | `#FF00FF` | rgb(255,0,255) | Secondary Akzente |
| **Text** | `#E0E0FF` | rgb(224,224,255) | Primärtext |
| **Subtext** | `#8888AA` | rgb(136,136,170) | Sekundärtext |

**Shader Tipp:** Bloom + Scanlines + Grid-Overlays. Particle-Systeme in Cyan.

---

## 3. ORGANIC NATURE — "Warme Erde"
*Für: Wellness, Food, Sustainable Brands*

| Rolle | Hex | RGB | Einsatz |
|-------|-----|-----|---------|
| **Primär** | `#F5E6D3` | rgb(245,230,211) | Hintergrund (warm) |
| **Sekundär** | `#E8D5C0` | rgb(232,213,192) | Cards, Container |
| **Akzent (Grün)** | `#2D5A27` | rgb(45,90,39) | CTA, Natur-Elemente |
| **Akzent (Gold)** | `#C9A96E` | rgb(201,169,110) | Highlights, Details |
| **Text** | `#2C1810` | rgb(44,24,16) | Primärtext |
| **Subtext** | `#8B7355` | rgb(139,115,85) | Sekundärtext |

**Shader Tipp:** Subsurface Scattering, organische Wellen, Blatt-Texturen.

---

## 4. DARK HYPNOTIC — "Violetter Nebel"
*Für: Entertainment, Music, Gaming, Creative Portfolio*

| Rolle | Hex | RGB | Einsatz |
|-------|-----|-----|---------|
| **Primär (Tiefe)** | `#050505` | rgb(5,5,5) | Hintergrund |
| **Sekundär** | `#0D0D1A` | rgb(13,13,26) | Cards, UI |
| **Akzent (Violett)** | `#6C3BC8` | rgb(108,59,200) | CTA, Glow |
| **Akzent (Bernstein)** | `#FFB347` | rgb(255,179,71) | Highlights, Wärme |
| **Text** | `#E0D0FF` | rgb(224,208,255) | Primärtext |
| **Glow** | `#8B5CF6` | rgb(139,92,246) | Bloom, Particle |

**Shader Tipp:** Nebel/Volumetrics in Violett, Particle Swarms, Curl Noise.

---

## 5. GRADIENTS — Unsere Signature-Übergänge

```
// Luxury: Schwarz → Gold
linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 40%, #D4AF37 100%)

// Tech: Dark Blue → Cyan
linear-gradient(135deg, #0A1128 0%, #001F3F 50%, #00F0FF 100%)

// Organic: Beige → Grün
linear-gradient(135deg, #F5E6D3 0%, #E8D5C0 50%, #2D5A27 100%)

// Hypnotic: Schwarz → Violett
linear-gradient(135deg, #050505 0%, #1A0A2E 50%, #6C3BC8 100%)
```

---

## Farbregeln

1. **60-30-10 Regel:** 60% Primär, 30% Sekundär, 10% Akzent
2. **Kontrast:** Text auf Hintergrund muss WCAG AA bestehen (mind. 4.5:1)
3. **Glow ist kein Ersatz für Kontrast** — Glow wird zusätzlich eingesetzt
4. **Maximal 2 Akzentfarben** pro Projekt (sonst wird es chaotisch)
5. **Dunkle Modi** sind Standard — Light Mode ist optional und aufwändiger
6. **Farben müssen interagieren** — sie sollen sich im Shader beeinflussen können

---

> **Regel:** Wähle eine Palette und bleibe bei ihr.  
> Jede Abweichung braucht eine bewusste Design-Entscheidung.