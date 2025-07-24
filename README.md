# Cashier Queue Management System

A real-time web-based queuing system designed for cashier environments to ensure proper customer flow and prevent overtaking.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project provides a robust and intuitive web application for managing customer queues in a cashier environment. Its primary goal is to enforce a strict First-In, First-Out (FIFO) order, eliminating the possibility of customers being served out of turn or 'overtaking' others. Designed with real-time updates in mind, it ensures that all cashier stations have a synchronized view of the queue, enhancing efficiency and customer satisfaction.

## Features

- **Real-time Queue Display:** A clear, dynamic display of the current queue status, visible to both cashiers and, potentially, customers.
- **Strict FIFO Order:** Ensures customers are served in the exact order they joined the queue, preventing any form of overtaking.
- **Customer Check-in/Queue Entry:** Functionality to add new customers to the queue, either manually by staff or via an automated process (e.g., a self-service kiosk, which can be integrated).
- **Cashier Queue Management:** Intuitive controls for cashiers to:
  - **Call Next Customer:** Move the next customer from the waiting queue to the 'currently serving' status.
  - **Complete Service:** Mark a customer as served, removing them from the 'currently serving' status and making way for the next customer.
  - **Queue Overview:** At-a-glance statistics including total customers in queue, currently serving customer, average wait time, and the next available queue number.
- **Responsive Design:** The application is built to be accessible and functional across various devices, from desktop monitors at cashier stations to tablets or mobile phones for management oversight.
- **Scalability:** Designed to support multiple cashier stations accessing the same centralized queue data simultaneously.

## Technologies Used

### Frontend
- **React:** A JavaScript library for building user interfaces.
- **Vite:** A fast build tool that provides an instant development server.
- **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
- **shadcn/ui:** A collection of re-usable components built with Radix UI and Tailwind CSS.
- **Lucide Icons:** A beautiful, open-source icon library.

### Backend
*(To be implemented - future phases will detail the backend technologies, likely Node.js/Express or Python/Flask with WebSockets for real-time communication and a suitable database like PostgreSQL or MongoDB.)*

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (LTS version recommended)
- npm or pnpm (pnpm is used in this project)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cashier-queue-system.git
   cd cashier-queue-system
   ```

2. Install frontend dependencies:
   ```bash
   pnpm install
   ```

### Running the Application

To start the development server for the frontend:

```bash
pnpm run dev
```

The application will typically be available at `http://localhost:5173`. Open this URL in your web browser.

## Usage

Once the application is running, cashiers can use the interface to:

- **Add New Customer:** Click the "Add New Customer" button to generate a new queue number and add it to the waiting list.
- **Call Next Customer:** Click the "Call Next Customer" button to move the first person in the waiting queue to the "Currently Serving" section. This button will be disabled if no one is in the queue or if a customer is already being served.
- **Complete Service:** Once a customer has been served, click the "Complete Service" button to clear the "Currently Serving" section, making it ready for the next customer.

## Project Structure

```
cashier-queue-system/
├── public/
├── src/
│   ├── assets/             # Static assets like images
│   ├── components/         # Reusable React components (including shadcn/ui)
│   │   └── ui/
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and libraries
│   ├── App.css             # App-specific styles (Tailwind CSS imports)
│   ├── App.jsx             # Main application component
│   ├── index.css           # Global styles
│   └── main.jsx            # Entry point for the React application
├── components.json         # shadcn/ui configuration
├── eslint.config.js        # ESLint configuration
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── pnpm-lock.yaml          # Lock file for dependencies
└── vite.config.js          # Vite bundler configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue if you find a bug or have a feature request.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details. (Note: A `LICENSE` file will need to be added to the repository.)


