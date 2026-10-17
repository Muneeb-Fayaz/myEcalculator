# 🧮 Muneeb's Scientific Calculator

### 🔗 Live demo: **[muneeb-fayaz.github.io/myEcalculator](https://muneeb-fayaz.github.io/myEcalculator/)**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![No Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen?style=for-the-badge)
![Hosted on GitHub Pages](https://img.shields.io/badge/hosted%20on-GitHub%20Pages-181717?style=for-the-badge&logo=github)

> *A scientific calculator with a retro green LCD, chunky 3D keys and a special purple button for the most famous number in maths: **e ≈ 2.71828**.*

```
 ┌──────────────────────────────┐
 │ DEG                        M │
 │            ln(e^3) =         │
 │                            3 │
 ├──────────────────────────────┤
 │ [sin] [cos] [tan] [ ! ] [DEG]│
 │ [ e ] [e^x] [ ln] [log] [ π ]│
 │  7     8     9     ÷    Ans  │
 │  4     5     6     ×    M+   │
 │  1     2     3     −    MR   │
 │  0     .    EXP    +     =   │
 └──────────────────────────────┘
```

---

## ✨ What it can do

| Feature | Details |
|---|---|
| **Basic maths** | `+  −  ×  ÷` with proper order of operations |
| **The star of the show** | A dedicated **e** key and an **eˣ** key |
| **Powers & roots** | `x²`, `xʸ`, `√`, `1/x` |
| **Logs** | `ln` (natural log) and `log` (base 10) |
| **Trigonometry** | `sin`, `cos`, `tan` with a **DEG / RAD** switch |
| **Extras** | `π`, `n!`, `%`, `±`, `EXP` (scientific notation) |
| **Memory** | `Ans`, `M+`, `MR` |
| **Live preview** | See the answer while you type, before pressing `=` |
| **Smart typing** | Write `2e` or `3(4+1)` and it knows you mean multiply |
| **Forgiving** | Forgot a closing bracket? It closes it for you |
| **Friendly errors** | `Divide by 0`, `Math ERROR`, `Syntax ERROR` instead of crashing |

---

## 🎮 Try these

| Type this | You get |
|---|---|
| `e` | 2.71828182846 |
| `ln(e^3)` | 3 |
| `2e` | 5.43656365692 |
| `sin(30)` *(in DEG mode)* | 0.5 |
| `5!` | 120 |
| `√(144)` | 12 |
| `50%` | 0.5 |
| `1÷0` | Divide by 0 |

---

## ⌨️ Keyboard shortcuts

| Key | Action |
|---|---|
| `0-9` `.` `( )` | Type numbers and brackets |
| `+` `-` `*` `/` `^` | Operators |
| `e` | Euler's number |
| `p` | π |
| `Enter` or `=` | Calculate |
| `Backspace` | Delete last |
| `Esc` or `Delete` | Clear everything |

---

## 🚀 Run it yourself

No installs, no build step, no `npm`. Just:

```bash
git clone https://github.com/muneeb-fayaz/myEcalculator.git
cd myEcalculator
```

Then open **`index.html`** in your browser. That's it. 🎉

---

## 📁 Project structure

```
myEcalculator/
├── index.html    ← the layout and all the buttons
├── style.css     ← the LCD screen, 3D keys and colours
├── script.js     ← the brain: reads your typing and does the maths
└── README.md     ← you are here
```

---

## 🧠 How the brain works

I didn't use `eval()`. Instead, `script.js` has a small hand-written parser that works in two steps:

1. **Tokenize:** chop the typed text into pieces (numbers, operators, functions like `sin(`).
2. **Calculate:** walk through the pieces following the real maths rules: brackets first, then powers, then `× ÷`, then `+ −`.

It's safer than `eval()`, easier to extend, and a good way to learn how calculators really think.

---

## 🔮 Ideas for later

- [ ] History panel of past calculations
- [ ] Light and dark themes
- [ ] Inverse trig (`sin⁻¹`, `cos⁻¹`, `tan⁻¹`)
- [ ] Installable as a PWA so it works offline

---

## 👨‍💻 About me

**Muneeb Fayaz**

| | |
|---|---|
| 🌐 **Live project** | [muneeb-fayaz.github.io/myEcalculator](https://muneeb-fayaz.github.io/myEcalculator/) |
| 💻 **GitHub** | [github.com/muneeb-fayaz](https://github.com/muneeb-fayaz) |
| 💼 **LinkedIn** | [linkedin.com/in/muneeb-fayaz-0440823a4](https://www.linkedin.com/in/muneeb-fayaz-0440823a4/) |
| 📧 **Email** | [muneebfayaz439@gmail.com](mailto:muneebfayaz439@gmail.com) |

---

## 📄 License

Free to use, learn from and remix. If you build something cool with it, I'd love to see it!

<p align="center">
  Made with ☕, curiosity and a lot of button presses by <b>Muneeb</b><br>
  ⭐ If you liked it, drop a star on the repo!
</p>
