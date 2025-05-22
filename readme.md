
# 🛡️ Hybrid Threat Detection System – Design 2

A modern, full-stack web-based system to detect and classify online threats such as phishing, malware, and HTML injection attacks using a hybrid machine learning pipeline. The platform supports multiple input types like URLs, HTML files, `.eml` emails, and chat logs in `.json`.

---

## 🌐 Live Demo

> Coming soon... *(or add your deployed link here)*

---

## 📁 Project Structure

```
Design 2 - Concept/
├── public/                  # Static assets like images and icons
├── src/                     # Frontend source code (React, TypeScript)
├── package.json             # Project dependencies
├── vite.config.ts           # Vite configuration for fast development
├── tsconfig*.json           # TypeScript configs
├── README.md                # You're reading it
└── ...                      # Other config files
```

---

## 🛠️ Tech Stack

| Layer       | Tools & Frameworks                     |
|------------|------------------------------------------|
| Frontend   | React 19, Vite, TailwindCSS, shadcn/ui  |
| Charts     | ApexCharts, Swiper                      |
| File Upload| Dropzone                                 |
| Maps       | React Vector Maps                        |
| Calendar   | FullCalendar                             |
| Backend    | *Not included* in this repo (Python/ML)  |

> ⚠️ **Note**: This repo currently includes only the frontend. Ensure your ML/REST API backend is running separately.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/hybrid-threat-detector.git
cd "Design 2 - Concept"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

The app will now be available at [http://localhost:5173](http://localhost:5173)

---

## 📂 Admin Panel – Upload & Merge

You can upload multiple `.eml` or `.txt` files via a dedicated admin feature that merges them into a clean `.json` structure for use in training or analysis.

---

## 🧠 Machine Learning Integration (Expected Setup)

To connect this UI with a backend hybrid model pipeline:

### Binary Classifier

- **Model**: `distilbert-base-uncased`
- **Purpose**: Detect whether input is safe or suspicious

### Multi-Class Classifier

- **Model**: `facebook/bart-large-mnli`
- **Purpose**: Classify as phishing, malware, or HTML injection

### Fusion Logic (NLP Rule Layer)

- Applies logical conditions to resolve the final class based on both models’ outputs

---

## ✨ Features

- ✅ Multi-input support (URL, HTML, Email, Chat Logs)
- ✅ Drag-and-drop file uploads
- ✅ Model prediction popups with clear labels
- ✅ Chart and map widgets for visual analytics
- ✅ Tailwind-based dark mode UI
- ✅ Modular React components (cards, dialogs, tabs)
- ✅ Admin upload utility for `.eml`/`.txt` files

---

## 📊 Screenshots

> *(Insert screenshots of UI, upload interface, results popup)*

---

## 🧪 Sample JSON Output (Expected from Backend)

```json
{
  "input_type": "url",
  "binary_result": "suspicious",
  "multi_class_result": "malware",
  "final_decision": "malware"
}
```

---

## 📋 To-Do / Improvements

- [ ] Integrate backend API endpoints
- [ ] Add user authentication (optional)
- [ ] Add logging/error boundary components
- [ ] Improve mobile responsiveness

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add feature"`
4. Push and open a pull request

---

## 🪪 License

MIT License — Free to use, modify, and distribute

---

## 🙋‍♂️ Author

**Osama Butt**  
💼 *Full-Stack Engineer & ML Developer*  
🌐 [GitHub](https://github.com/osamabuttdev) | [LinkedIn](#)

---

> Need the backend README too? Upload the Python side if it's separate, and I’ll prepare it next.
