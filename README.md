# Prompt-to-3D Template Generator

Dieses Modul generiert aus einem Prompt eine parametrisierte 3D-Landingpage (HTML) auf Basis des bestehenden Three.js + GSAP-Prototyps.

## Dateien

- `base-template.html` – Parametrisierter Basis-Template (Three.js, GSAP, ScrollTrigger)
- `prompt-mapping.js` – Keyword-Mapping → visuelle Parameter (Farben, Intro, Scroll, Mouse-Easing, Partikel)
- `template-generator.js` – CLI, die aus Prompt + Mapping fertige HTML/JSON-Dateien erzeugt
- `generated/` – Ausgabeordner für generierte Varianten

## Nutzung

```bash
node /home/team/shared/platform/template-generator.js \
  --prompt "luxury neon skincare with 40000 particles" \
  --brand "Luma Skin" \
  --title "Luma Ether"
```

Optional:

- `--subtitle "..."`
- `--slug custom-name`
- `--output /absolute/path/to/file.html`

## Prompt-Mapping (Beispiele)

Unterstützte Keyword-Gruppen in `prompt-mapping.js`:

- `luxury`, `premium`, `elegant` → ruhigere, hochwertigere Motion
- `energetic`, `fast`, `dynamic` → schnellere Animationen, mehr Intensität
- `calm`, `ambient`, `zen` → langsamere Reaktion, softere Bewegungen
- `neon`, `cyber`, `synthwave` → neonartige Farbpalette
- `ocean`, `aqua`, `liquid` → kühle Aqua-Farben, stärkere Wellen
- `sunset`, `warm`, `gold` → warme Farbtöne
- `minimal`, `clean` → reduzierte Partikeldichte
- `cinematic`, `dramatic`, `epic` → längere Scroll-Reise, filmischer Intro

Direkte Prompt-Direktiven:

- Hex-Farben, z. B. `#00ffcc #ff00aa`
- Partikelanzahl, z. B. `45000 particles`
- Intro-Dauer, z. B. `intro 3.2s`

## Output

Pro Generation entstehen:

- `<slug>.html` – sofort testbare Seite
- `<slug>.json` – aufgelöste Konfiguration inkl. `metadata.appliedRules`

