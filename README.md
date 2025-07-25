# Cashier Queue Management System (Frontend-Only)

A modern, real-time web-based queuing system designed specifically for cashier environments. This system ensures proper customer flow, prevents queue overtaking, and provides professional audio notifications - all without requiring any backend infrastructure or database.

## 🚀 Features

### Core Queue Management
- **Real-time Queue Processing**: Add customers, call next customer, complete service
- **Strict Queue Order**: FIFO (First In, First Out) enforcement prevents overtaking
- **Multi-Window Support**: Support for up to 5 cashier windows simultaneously
- **Daily Queue Reset**: Reset queue numbering at the start of each day/shift
- **Professional UI**: Clean, modern interface suitable for business environments

### Sound Notifications
- **Audio Feedback**: Pleasant two-tone chime when calling next customer
- **Cross-Browser Compatibility**: Uses Web Audio API with fallback support
- **Professional Sound Design**: Non-intrusive notification sounds
- **Accessibility Enhancement**: Helps customers with visual impairments

### Dual Interface System
- **Cashier Interface** (`/cashier`): Complete queue management for staff
- **Public Display** (`/display`): Customer-facing queue status display
- **Home Page** (`/`): Interface selection and navigation

### Real-time Synchronization
- **Cross-Tab Sync**: Perfect synchronization across multiple browser tabs/windows
- **localStorage Integration**: Persistent data storage in browser
- **BroadcastChannel API**: Enhanced real-time communication
- **No Backend Required**: Completely frontend-only solution

## 🎯 Perfect For

- Retail stores and service centers
- Clinics and medical facilities
- Banks and financial institutions
- Government service offices
- Any business requiring organized customer queuing

## 🛠️ Technical Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: localStorage + BroadcastChannel API
- **Audio**: Web Audio API with fallback support
- **Icons**: Lucide React
- **Deployment**: Static files (no server required)

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or pnpm package manager

### Quick Start

1. **Extract the project files**
   ```bash
   git clone https://github.com/januaraliosada/cashier-queue-system.git
   cd cashier-queue-system
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - Choose between Cashier Interface or Public Display

## 🖥️ Usage Guide

### For Cashiers

1. **Access Cashier Interface**: Go to `/cashier` or click "Cashier Interface" from home
2. **Select Your Window**: Choose your window number (1-5) from the dropdown
3. **Add Customers**: Click "Add New Customer" to add people to the queue
4. **Call Next Customer**: Click "Call Next Customer" to serve the next person
   - Plays audio notification automatically
   - Customer is assigned to your window
5. **Complete Service**: Click "Complete Service" when finished with a customer
6. **Reset Queue**: Use "Reset Queue" to start fresh (requires confirmation)

### For Public Display

1. **Access Public Display**: Go to `/display` or click "Public Display" from home
2. **View Current Status**: See who's being served at which window
3. **Check Queue Position**: View waiting customers and estimated times
4. **Monitor All Windows**: See status of all 5 service windows

## 🔧 Configuration

### Window Management
- Default: 5 windows (Window 1-5)
- Easily configurable in `src/utils/queueStorage.js`
- Each window operates independently

### Sound Settings
- Default: Two-tone chime (880Hz + 660Hz)
- Customizable in `src/utils/soundNotification.js`
- Volume and duration adjustable

### Queue Numbering
- Format: A001, A002, A003, etc.
- Resets to A001 when queue is reset
- Configurable prefix in queue storage

## 🌐 Deployment Options

### Static Hosting
Deploy to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

### Build for Production
```bash
pnpm run build
# or
npm run build
```

The `dist/` folder contains all files needed for deployment.

### Local Network Deployment
1. Build the project
2. Serve the `dist/` folder on your local network
3. Access from multiple devices using the server IP

## 🔄 How Synchronization Works

The system uses advanced browser APIs for real-time synchronization:

1. **localStorage**: Persistent data storage
2. **StorageEvent**: Cross-tab communication
3. **BroadcastChannel**: Enhanced messaging
4. **Event Listeners**: Real-time UI updates

This ensures all cashier stations and public displays stay perfectly synchronized without any server infrastructure.

## 🎵 Sound System

### Audio Features
- **Web Audio API**: High-quality sound generation
- **Two-tone Chime**: Professional notification sound
- **Browser Compliance**: Respects autoplay policies
- **Fallback Support**: Works across all modern browsers

### Sound Triggers
- Customer called to service window
- Plays on both cashier and public interfaces
- Automatic volume and timing optimization

## 🚀 Advanced Features

### Multi-Station Setup
- Run cashier interface on multiple computers
- Display public interface on large screens
- All stations stay synchronized automatically

### Offline Capability
- Works without internet connection
- Data persists in browser storage
- Synchronization resumes when connection restored

### Mobile Responsive
- Works on tablets and mobile devices
- Touch-friendly interface
- Responsive design for all screen sizes

## 🔧 Troubleshooting

### Common Issues

**Sound not playing?**
- Ensure user has interacted with the page first
- Check browser audio permissions
- Verify volume settings

**Synchronization not working?**
- Ensure all tabs are from the same domain
- Check if localStorage is enabled
- Refresh all browser tabs

**Queue reset not working?**
- Confirm the reset action in the dialog
- Check if multiple cashiers are trying to reset simultaneously

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## 🤝 Support

For support, feature requests, or bug reports, please refer to the project documentation or contact your system administrator.

---

**Built with ❤️ for efficient customer service management**

---

