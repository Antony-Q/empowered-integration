# Web2Campaign API Integration

This project facilitates a custom lead delivery pipeline that routes lead data from Meta (Facebook/Instagram) forms to the Five9 Web2Campaign API. It is designed to replace GoHighLevel for lead management and integrate seamlessly with the Empowered lead ecosystem.

## 🔧 Overview

The system listens for incoming lead data from Meta's webhook system, formats and authenticates it, and submits it to the appropriate campaign and list in Five9 using a `POST` request. It uses Basic Auth headers to securely authenticate each request with the Five9 Web2Campaign API.

The backend is built with Node.js + Express and is structured to be easily extensible as new campaigns, sources, and lists are added.

---

## ✅ Current Status

- **Phase 1: Meta Webhook Parsing** — ✅ Complete  
- **Phase 2: Five9 Integration** — ✅ Complete (pending final webhook from Meta)  
- **Current Functionality:**  
  - Handles webhook payload from Meta
  - Parses and maps relevant fields
  - Sends formatted lead data to Five9 via Web2Campaign API
  - Logs activity and errors

---

## 🔜 Planned Features

- **Multiple Campaign/List Support**  
  Logic for dynamically routing leads to multiple campaigns and dialing lists based on campaign ID or source.

- **GoHighLevel Migration Handling**  
  Pulling or translating data from GoHighLevel (where applicable) into the new Five9-based system.

- **Expanded Error Logging & Reporting**  
  More granular logging with status codes, retries, and internal alerts for failed posts.

---

## 💡 Optional Additions (Under Consideration)

- **Internal Admin Dashboard**  
  Web UI to:
  - View recent leads
  - Monitor API success/failure logs
  - Search/filter by campaign/list/source
  - Manually retry or test submissions

- **Google Ads Integration**  
  Parsing lead data from Google Ads forms and sending to Five9 using the same pipeline.

- **Webhook Management Interface**  
  GUI to manage active webhook endpoints, secrets, and logs.

- **Auth System Upgrade**  
  Replace shared auth with OAuth2 or token-based API key system for internal tools.

---

## 📄 Five9 Web2Campaign Docs

Reference:  
[Five9 Web2Campaign Developer Guide (PDF)](https://documentation.five9.com/bundle/w2c-developers-guide)

---

## 🧑‍💻 Tech Stack

- Node.js  
- Express.js  
- dotenv  
- body-parser  
- Axios (optional for external requests)

---

## 🔐 Authentication

This project uses Basic Authentication via encoded credentials in the `Authorization` header when communicating with Five9. These credentials must be stored securely in `.env`.

---

## 🚧 Setup & Environment

1. Clone this repo.
2. Create a `.env` file using the provided `.env.example`.
3. Start the server:
   ```bash
   npm install
   npm run dev

---

## 🗃 Example Webhook Payload (Meta)

{
  "first_name": "Tony",
  "last_name": "Montana",
  "email": "tony@example.com",
  "number1": "2813308004",
  "F9domain": "Empowered Aesthetic Solutions",
  "F9list": "Island ENT-Exomind",
  "F9key": "number1",
  "F9updateCRM": "true",
  "F9retResults": "true",
  "F9CallASAP": "true"
}

---

## 📬 Contact
Project lead: Antony Q
Contact details: Request from appropriate parties within Empowered Aesthetic Solutions
Internal roles involved: CEO, Caitlin (Operations & PM), Five9 Support, Empowered Marketing Team
