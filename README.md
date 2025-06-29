#  Online Shopper Purchase Intention (OSPI)

A full-stack machine learning web app that predicts whether an online shopper will make a purchase, using real-time session data and multiple ML models. Built with React, Flask, and scikit-learn/XGBoost, this project demonstrates robust ML deployment, live metrics, and a modern user experience.

---

## 🚀 Features

- **Live ML Prediction:** Predict purchase intent based on user browsing/session data.
- **Model Selection:** Choose from Gradient Boosting, Random Forest, XGBoost, Adaboost, or Logistic Regression.
- **Dynamic Metrics:** See ROC curve, test accuracy, and feature importance for each model.
- **Session Analytics:** Visualize your session data and how it drives predictions.
- **Secure & Validated:** Input validation, model whitelisting, and safe API design.
- **Modern UI:** Clean, responsive React frontend.

---

## 🖼️ Screenshots

![Screenshot 2025-06-29 195930](https://github.com/user-attachments/assets/474012a5-229d-4b0e-9d8b-f962d2cd7bf4)
![Screenshot 2025-06-29 195949](https://github.com/user-attachments/assets/2f5ad308-5be6-4c81-bcf9-23a122379a58)
![Screenshot 2025-06-29 200032](https://github.com/user-attachments/assets/184b1224-548f-4ab3-aa1d-8cd09b151e67)
![Screenshot 2025-06-29 200050](https://github.com/user-attachments/assets/b4343f9b-3c4c-4165-a72c-ecdd9c59a003)
![Screenshot 2025-06-29 200127](https://github.com/user-attachments/assets/cbe5cb4c-c4b1-49ff-893b-6367df3e7d08)





---

## 🏗️ Tech Stack

- **Frontend:** React (TypeScript), CSS
- **Backend:** Flask (Python 3), scikit-learn, XGBoost, joblib
- **ML Models:** Gradient Boosting, Random Forest, XGBoost, Adaboost, Logistic Regression
- **Data:** UCI Online Shoppers Intention Dataset

---

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/kaustubh7916/ospi.git
cd ospi
```

### 2. Create a Virtual Environment (Backend)
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
# or
source venv/bin/activate  # On macOS/Linux
```

### 3. Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### 4. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 5. Run the Backend
```bash
cd deployment
python app.py
```

### 6. Run the Frontend
```bash
cd ../frontend
npm start
```

---

## 🧠 How It Works

- The frontend tracks your browsing session (pages visited, products viewed, etc.).
- On checkout, your session data is sent to the backend.
- The backend preprocesses the data, runs the selected ML model, and returns:
  - Prediction (purchase likely or not)
  - Confidence score
  - Test accuracy
  - ROC curve (as an image)
  - Feature importance
- The frontend displays all results in a user-friendly dashboard.



---

## 🛡️ Security & Best Practices
- Only whitelisted models can be selected.
- All session data is validated before prediction.
- CORS is enabled for development; restrict it in production.
- No user data is stored—stateless, privacy-friendly design.


**Developed by [Kaustubh Pukale]**  
GitHub: [kaustubh7916/ospi](https://github.com/kaustubh7916/ospi)

- ML models and data processing inspired by the UCI Online Shoppers Intention dataset.
- Frontend and backend designed for clarity, security, and educational value.

