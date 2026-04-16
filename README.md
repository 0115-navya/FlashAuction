# ⚡ FlashAuction

A real-time auction platform where users can list items and place bids in fast-paced, time-limited auctions.

🔗 **Live Demo:** [flash-auction-seven.vercel.app](https://flash-auction-seven.vercel.app/)

---

## 🚀 Features

- 🔨 **Live Bidding** — Place bids in real-time with instant updates
- ⏱️ **Timed Auctions** — Each auction runs on a countdown timer
- 🧾 **Item Listings** — Sellers can post items with descriptions and starting prices
- 👤 **User Authentication** — Secure sign-up and login
- 📊 **Bid History** — Track all bids placed on an auction
- 🏆 **Winner Declaration** — Highest bidder at time expiry wins

---

## 🛠️ Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React.js, CSS           |
| Backend   | Node.js, Express.js     |
| Database  | MongoDB                 |
| Deployment| Vercel (client), Render/Railway (server) |

---

## 📁 Project Structure

```
FlashAuction/
├── client/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
└── server/         # Node/Express backend
    ├── models/
    ├── routes/
    ├── controllers/
    └── index.js
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/0115-navya/FlashAuction.git
   cd FlashAuction
   ```

2. **Setup the server**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
   ```bash
   npm start
   ```

3. **Setup the client**
   ```bash
   cd ../client
   npm install
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

- **Frontend** deployed on [Vercel](https://vercel.com)
- **Backend** hosted on a cloud server (e.g., Render, Railway)

---

## 📬 Contact

Made with ❤️ by [Navya](https://github.com/0115-navya)
