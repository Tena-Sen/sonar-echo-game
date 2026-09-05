# 《回声》· Sonar

**Language:** English | [简体中文](README_ZH.md)

> **Where sound arrives, safety may not follow.**

![Sonar title screen: a lost signal and broken sonar ring in the dark](docs/images/sonar-cover.png)

*Sonar* is a single-file Canvas atmospheric horror maze built around sound. In near-total darkness, players rely on brief sonar echoes to read the space; every signal reveals information while giving away their position. Across four chapters—observation and patrols, external lures, the silent chamber, and the final pursuit and extraction—the game steadily turns “speaking is a cost” into escalating survival pressure.

The visual language follows **blind-space minimalism**: cool white marks verifiable evidence, ember red signals exposure and threat, and antique gold is reserved for distant exits and the way out. The complete white sonar ring is the only stable geometry on screen; everything else falls back into darkness.

## Live Demo

Play *Sonar* online: [sonarecho-zc2skcxf.manus.space](https://sonarecho-zc2skcxf.manus.space)

## Core Experience

| System | Description |
| --- | --- |
| Sonar navigation | The primary sonar briefly reveals walls, creatures, records, silent chambers, and exits. |
| Risk loop | Every ping raises alertness and draws investigation, forcing a choice between information and silence. |
| Four-chapter arc | Each chapter reuses and reverses the rules established before it. |
| Audio storytelling | Web Audio synthesizes the ambience, creature signatures, log cues, and threat mixes—without synthetic speech. |
| Archives and replay | Signal integrity unlocks AR-01–AR-05 fragments, while replay tracks the best integrity, no-hit, and low-ping records. |
| Multiple endings | Solo endings depend on archive integrity; Chapter IV co-op leads to CR-00, CR-01, or CR-02 based on coordination. |

---

## Local Co-op: Coordination Trials

When the game starts, choose **Solo Listening** or the **Dual-Channel Protocol** on the title screen. Use `← / →` and press `Enter` to connect, press `1 / 2` to select directly, or click the left or right half of the screen. After confirmation, a roughly one-second broken-loop verification plays before the game enters solo awakening or two-player role calibration. Local co-op requires no network connection or additional service.

| Role | Responsibility | Input |
| --- | --- | --- |
| Scout Circuit / P1 | Move, emit the primary sonar, draw danger away, and confirm the space for the team. | `WASD` to move; `E` or left click to emit the primary sonar. |
| Decode Circuit / P2 | Move, emit short-range analysis pulses, and recover chapter records. | Arrow keys to move; `/` to emit an analysis pulse. |

Co-op extraction requires both players to reach the exit at the same time. If either player falls, the partner can approach and press the default `R` within 6.8 seconds to reconnect. After a chapter record is recovered, the extraction gate changes its verification rule by chapter: synchronized presence in Chapter I, P1 leading in Chapter II, P2 leading in Chapter III, and release-then-synchronize in Chapter IV. When separated, distant false echoes may appear without any visual marker; the team must communicate to decide whether they are trustworthy. Each chapter result saves the next chapter to play independently. Re-entering the dual channel resumes the sequence automatically; after Chapter IV, the sequence returns to Chapter I and increments the completion count.

> **Coordination record:** Across all four chapters, the accumulated “no disconnect” and “low alert” medals determine CR-00 *Mismatch Record*, CR-01 *Dual-Voice Resonance*, or CR-02 *In Phase, Offshore*. The thresholds are intentionally not shown as a progress bar.

## Visuals

![Coordination trial: P2 taking the lead station, dual-channel array readings, and a complete sonar ring](docs/images/sonar-coop-trial.png)

*Chapter III trial: the Decode Circuit locks in first, and the Scout Circuit must respond within a short window. The screen provides only brief evidence; the real judgment belongs to the two players.*

![CR-02 In Phase, Offshore: the antique-gold finale for the highest co-op coordination record](docs/images/sonar-coop-ending-cr02.png)

*CR-02 “In Phase, Offshore”: the dual channels remain in phase before departure, and the antique-gold trail becomes the only distant direction.*

## Controls and Listening

| Input | Function |
| --- | --- |
| `← / →`, `1 / 2`, `Enter` | Select and connect to the solo or local co-op channel on the title screen. |
| Left click / `E` | P1 primary sonar. |
| `/` | P2 analysis pulse. |
| `Space` | Deploy an authorized external echo decoy. |
| `R` | Reconnect when nearby; reload the chapter after failure. |
| `F` | Open the device archive. |
| `C` | Open chapter replay. |
| `Esc` | Open listening calibration and volume / low-frequency settings. |
| `M` | Toggle persistent mute. |

In the listening settings opened with `Esc`, switch between “Single Circuit // 01” and “Dual Channel // 02”, then press a new key after selecting an action. If a binding conflicts with an existing action in the same circuit, the two bindings are exchanged. `Esc`, `M`, `F`, `C`, and the mode-selection keys remain reserved for the system. The settings also allow you to clear the co-op resume record.

To leave the current chapter, press `Esc`, open listening settings, and choose “Abort Listening // Return to Channel Select”. On the confirmation screen, press `Enter` to return to the solo / co-op connection choice, or `Esc` to cancel and continue the current chapter. Aborting does not delete archives, volume settings, key bindings, or the co-op resume record.

Headphones are recommended: creature and teammate cues change their panning, filtering, and volume based on distance and left-right position. The browser unlocks audio output after the first interaction.

## Local Development

This repository is a Vite static frontend shell. The game itself lives in `client/public/echo.html` and does not require a backend service.

```bash
pnpm install
pnpm dev
```

Open the development server address to start playing. You can also open `client/public/echo.html` directly in a browser; the core Canvas, input, and Web Audio logic are contained in this standalone HTML file.

## Session Integrity

The production entry point passes through only known development-validation parameters, preventing stale URL state from unexpectedly changing the player entry flow. After entering, closing listening settings, cancelling an abort, or regaining page focus, the game actively restores keyboard focus. When the browser tab or iframe loses focus, movement and captured-key state are cleared. Co-op resume data, key mappings, archives, and solo replay data are isolated from one another; replay is always locked to the solo circuit.

## Demo Entrypoints

The following query parameters are for development and visual validation only; they are not formal player features.

| URL parameter | Preview |
| --- | --- |
| `?demo&coop&trial=2` | Chapter II P1-first station sequence. |
| `?demo&coop&trial=3` | Chapter III P2-first station sequence. |
| `?demo&coop&decoy` | Separated state with a distant false echo. |
| `?demo&ending=CR-00` | Mismatch Record ending. |
| `?demo&ending=CR-01` | Dual-Voice Resonance ending. |
| `?demo&ending=CR-02` | In Phase, Offshore ending. |
| `?link=solo` / `?link=coop` | Solo or co-op connection signal animation. |
| `?demo&settings&remap` | Preview of custom bindings and the co-op resume record. |
| `?demo&coop&abort` | Abort Listening confirmation after a frozen co-op chapter. |

## Project Documentation

| Document | Contents |
| --- | --- |
| [`CHAPTERS.md`](CHAPTERS.md) | Four-chapter strategy, narrative, and rule reversals. |
| [`COOP.md`](COOP.md) | Local co-op roles, rescue, and extraction protocol. |
| [`COOP_CHALLENGES.md`](COOP_CHALLENGES.md) | Co-op medals, stations, and partner-position feedback. |
| [`COOP_TRIALS.md`](COOP_TRIALS.md) | Coordination endings, timing combinations, and false-echo rules. |
| [`AUDIO.md`](AUDIO.md) | Web Audio ambience, threat, and spatial sound design. |
| [`ARCHIVES.md`](ARCHIVES.md) | Archives, integrity, and the solo final record. |
| [`STRUCTURE.md`](STRUCTURE.md) | Project structure and runtime module index. |

## Technology

`Canvas 2D` · `Vanilla JavaScript` · `Web Audio API` · `React 19` · `Vite`

The game does not depend on a game engine. All critical mechanics are concentrated in a standalone HTML file for continuous iteration and direct distribution.
