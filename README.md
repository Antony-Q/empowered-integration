# Empowered Lead Integration: Meta → Five9 (Web2Campaign API)

This system delivers a scalable and modular pipeline for routing leads from Meta (Facebook/Instagram) lead forms directly into Five9’s Web2Campaign API. It was built as a functional proof of concept (PoC) to demonstrate lead automation across Empowered’s client base.

---

## 🚀 Project Highlights

- Simulates and parses Meta leadgen payloads
- Automatically maps clients based on form ID
- Dynamically assigns Five9 campaign lists and rep skill sets
- Sends formatted data to Five9 using authenticated API POST
- Config-driven system for handling ANIs, business hours, promotions, and calendars

> Even without live Meta payloads (pending platform verification), this PoC proves the end-to-end routing logic and Five9 integration works and is production-ready.

---

## ✅ Current Functionality

- 🧠 **Meta Payload Parser**
  - Handles GET verification and POST webhook logic
  - Includes test route to simulate leadgen payloads without live ad data

- 📨 **Five9 Integration**
  - Authenticates with Web2Campaign using Basic Auth
  - Dynamically builds POST payloads from per-client config
  - Parses and logs Five9 response codes for transparency

- 🔄 **Client Mapping & Automation**
  - Matches incoming leads to client campaigns using `form_id`
  - Each client has defined: ANI, timezone, business hours, calendar URL, connectors, assigned rep (skill set)

- 🛠️ **Extensible Config Structure**
  - Config file structure supports up to 150+ clients
  - Future integration with Google Sheets or GHL API possible

---

## 🧭 Key Discoveries

- Only ~30 out of 150+ clients currently meet the criteria for automated lead routing:
  - Require active ad campaigns
  - Require full access to page, form, and ad account
  - Require leadgen permissions to be correctly configured
- The system is ready to expand as more campaigns go live

---

## 🛣️ Future Work

- [ ] Enable dynamic GHL calendar pulling via API
- [ ] Build a lightweight UI to manage campaign config
- [ ] Add Google Ads webhook support
- [ ] Store inbound lead records to CSV or DB for auditing
- [ ] Integrate retry queue for failed API submissions

---

## ⚙️ Tech Stack

- Node.js + Express
- dotenv for secrets management
- Axios for outbound requests
- JSON config for routing logic
- LocalTunnel for webhook testing

---

## 🧪 Test Locally

--bash
npm install
npm run dev
Then trigger a simulated lead:
curl -X POST http://localhost:3000/simulate-meta-lead
This will send a lead payload to the Five9 API using test data and log the full processing path.

---

## 🧾 Sample Payload Output

{
  "first_name": "Tony",
  "last_name": "Montana",
  "email": "tony@example.com",
  "phone_number": "2813308004",
  "F9domain": "Empowered Aesthetic Solutions",
  "F9list": "Island ENT-Exomind",
  "F9key": "number1",
  "F9updateCRM": "true",
  "F9retResults": "true",
  "F9CallASAP": "true"
}

---

## 👥 Internal Stakeholders

Project Lead: Antony Q

CEO: Ryan

Ops Lead / PM: Caitlin

Platform: Empowered Aesthetic Solutions