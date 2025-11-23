# Paredros App - Dokumentation

Willkommen zur Dokumentation der Paredros App!

## 📚 Dokumentations-Übersicht

### [ARCHITECTURE.md](./ARCHITECTURE.md)
**Vollständige Architektur-Dokumentation**

Detaillierte Beschreibung der App-Architektur nach dem Refactoring:
- Projektstruktur und Module-Übersicht
- State Management und Datenfluss
- Komponenten-Hierarchie
- Hooks, Components und Utils im Detail
- Best Practices und Guidelines
- Testing und Performance
- Troubleshooting

👉 **Für**: Entwickler, die die Architektur verstehen möchten

---

### [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
**Schnelle API-Referenz**

Kompakte Referenz für den täglichen Gebrauch:
- Hooks API
- Component Props
- Utils Functions
- State Structure
- Common Patterns
- Debugging & Performance Tips
- TypeScript Types

👉 **Für**: Entwickler, die schnell etwas nachschlagen möchten

---

## 🎯 Schnelleinstieg

### Für neue Entwickler

1. **Start**: Lies [ARCHITECTURE.md](./ARCHITECTURE.md) - Abschnitt "Übersicht"
2. **Verstehen**: Lies "Module-Übersicht" und "State Management"
3. **Referenz**: Nutze [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) beim Entwickeln

### Für erfahrene React-Entwickler

1. **Schnellstart**: Lies [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
2. **Architektur**: Überblicke [ARCHITECTURE.md](./ARCHITECTURE.md) - "Projektstruktur"
3. **Entwickeln**: Nutze "Common Patterns" als Vorlage

---

## 🔍 Was finde ich wo?

### Ich möchte...

#### ...verstehen wie die App strukturiert ist
→ [ARCHITECTURE.md](./ARCHITECTURE.md) - "Projektstruktur"

#### ...wissen wie State Management funktioniert
→ [ARCHITECTURE.md](./ARCHITECTURE.md) - "State Management"

#### ...einen neuen Hook erstellen
→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - "Common Patterns" #1

#### ...eine neue Component erstellen
→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - "Common Patterns" #2

#### ...Monaco Decorations hinzufügen
→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - "Common Patterns" #3

#### ...verstehen wie Grammar Loading funktioniert
→ [ARCHITECTURE.md](./ARCHITECTURE.md) - "Datenfluss" → "Grammar Loading Flow"

#### ...verstehen wie Parsing funktioniert
→ [ARCHITECTURE.md](./ARCHITECTURE.md) - "Datenfluss" → "Parsing Flow"

#### ...die Hook APIs kennenlernen
→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - "Hooks API"

#### ...Component Props nachschlagen
→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - "Components Props"

#### ...Utils Functions nutzen
→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - "Utils Functions"

#### ...Best Practices lernen
→ [ARCHITECTURE.md](./ARCHITECTURE.md) - "Best Practices"

#### ...Probleme debuggen
→ [ARCHITECTURE.md](./ARCHITECTURE.md) - "Troubleshooting"
→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - "Debugging Tips"

#### ...Performance optimieren
→ [ARCHITECTURE.md](./ARCHITECTURE.md) - "Performance Considerations"
→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - "Performance Tips"

---

## 📖 Dokumentations-Prinzipien

### 1. **Aktualität**
Die Dokumentation wird bei jedem größeren Refactoring aktualisiert.

### 2. **Praxisbezug**
Alle Beispiele sind echte Use Cases aus dem Projekt.

### 3. **Zweistufig**
- **ARCHITECTURE.md**: Detailliert, erklärt das "Warum"
- **QUICK_REFERENCE.md**: Kompakt, zeigt das "Wie"

### 4. **Codebeispiele**
Alle Patterns haben funktionierende Code-Beispiele.

---

## 🛠 Projekt-Technologien

### Core
- **React** 18+ - UI Framework
- **TypeScript** - Type Safety
- **Tauri** - Desktop App Framework

### UI Components
- **Monaco Editor** - Code Editor
- **React Flow** - Parse Tree Visualization
- **Allotment** - Resizable Panels
- **React Complex Tree** - File Tree

### State Management
- **React Hooks** - Local State
- **Custom Hooks** - Shared Logic

---

## 📊 Projekt-Statistiken

### Nach Refactoring

| Metrik | Wert |
|--------|------|
| **Module** | 13 |
| **Custom Hooks** | 6 |
| **UI Components** | 4 |
| **Utils** | 2 |
| **App.tsx Zeilen** | ~140 (vorher ~950) |
| **Durchschnittliche Dateigröße** | ~100 Zeilen |
| **Test Coverage** | TBD |

---

## 🎓 Lernressourcen

### React Hooks
- [Official React Hooks Docs](https://react.dev/reference/react/hooks)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Monaco Editor
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/api/index.html)
- [Decorations Guide](https://microsoft.github.io/monaco-editor/playground.html#interacting-with-the-editor-line-and-inline-decorations)

### Tauri
- [Tauri Docs](https://tauri.app/v1/guides/)
- [Tauri API Reference](https://tauri.app/v1/api/js/)

---

## 🤝 Beitragen

### Dokumentation verbessern

1. **Fehler gefunden?**
   - Erstelle ein Issue mit Label "documentation"
   
2. **Etwas unklar?**
   - Erstelle ein Issue mit Frage
   - Wir verbessern die Doku

3. **Beispiel hinzufügen?**
   - Füge es zu QUICK_REFERENCE.md hinzu
   - Pull Request erstellen

### Dokumentations-Style Guide

#### DO ✅
- Klare, kurze Sätze
- Praxisnahe Beispiele
- TypeScript Type Annotations
- Kommentare in Code-Beispielen

#### DON'T ❌
- Lange, verschachtelte Sätze
- Theoretische Beispiele ohne Kontext
- JavaScript statt TypeScript
- Code ohne Erklärung

---

## 📝 Changelog

### 2025-11-23
- ✅ Initiale Dokumentation erstellt
- ✅ ARCHITECTURE.md komplett
- ✅ QUICK_REFERENCE.md komplett
- ✅ README.md erstellt

---

## 📞 Support

### Fragen zur Dokumentation?
Erstelle ein Issue auf GitHub mit Label "documentation"

### Fragen zur Implementierung?
1. Prüfe QUICK_REFERENCE.md
2. Prüfe ARCHITECTURE.md → "Troubleshooting"
3. Erstelle ein Issue mit Label "question"

---

*Happy Coding! 🚀*

