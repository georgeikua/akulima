# Akulima – A Women-First Agricultural Trade Platform

![MIT License](https://img.shields.io/github/license/freshxchange/akulima)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen)
![Built with Supabase](https://img.shields.io/badge/Built%20With-Supabase-3ECF8E)
![Status](https://img.shields.io/badge/status-Prototype-yellow)

[![View Demo](https://img.shields.io/badge/Demo-akulima.africa-blue)](https://akulima.africa)


Akulima is an open-source agricultural marketplace that empowers women-led farming groups in Africa to trade fresh produce directly with institutional buyers. The platform reduces intermediaries, increases transparency, and integrates logistics, finance, quality control, and traceability into one easy-to-use system accessible via SMS, WhatsApp, and low-data web tools.

## 🌍 Why Akulima

In traditional African value chains, women do the bulk of agricultural labor but earn the least. Akulima changes this by using technology to ensure women:
- Earn 2–3× more per kilo
- Retain control over payments and savings
- Access pre-financing, fair pricing, and digital trade infrastructure

## 💻 Features

- **Multi-role dashboards**: Farmers, buyer aggregators, admins, transporters, graders, and finance partners
- **SMS & WhatsApp access**: No smartphone needed for farmers
- **Real-time bidding**: Verified buyer RFQs + transparent price breakdowns
- **Traceability ledger**: Blockchain-inspired record of produce contributions and payments
- **Savings + loan engine**: Auto-deductions invested in MMFs, with trade-backed microloans
- **M-PESA integration**: Direct payments to verified farmer phone numbers

## 🚀 Tech Stack

- **Frontend**: Next.js (React) + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Integrations**: M-PESA, WhatsApp (360dialog or Twilio), TextSMS.co.ke, Africa Alliance MMF
- **Deployment**: Vercel + Supabase

## 📦 Getting Started

\`\`\`bash
git clone https://github.com/georgeikua/akulima.git
cd akulima-platform
cp .env.example .env.local  # set your Supabase + M-PESA keys
npm install
npm run dev
