# JobPortal - Angular Job Portal Application

A modern, user-friendly job portal built with Angular that provides separate interfaces for administrators and students to manage job postings and applications.

## Features

### 🏠 Dashboard
- **Welcome Page**: Beautiful landing page with admin and student login options
- **Modern UI**: Responsive design with gradient backgrounds and smooth animations
- **Feature Highlights**: Showcases key benefits of the platform

### 👨‍💼 Admin Portal
- **Admin Login**: Secure authentication with form validation
- **Admin Dashboard**: Comprehensive overview with statistics
  - Total jobs posted
  - Total applications received
  - Pending reviews
  - Accepted applications
- **Job Management**: 
  - View all job postings
  - Add new job postings
  - Track application statuses
- **Quick Actions**: Easy access to common admin tasks

### 👨‍🎓 Student Portal
- **Student Login**: Secure authentication with form validation
- **Student Dashboard**: Personalized overview with:
  - Available jobs count
  - My applications tracking
  - Pending reviews
  - Accepted applications
- **Job Search**: Real-time search functionality
- **Application Tracking**: Monitor application statuses
- **Quick Actions**: Profile updates, resume builder, job alerts

### 🔐 Authentication
- **User Types**: Separate admin and student accounts
- **Form Validation**: Comprehensive input validation
- **Session Management**: Persistent login state
- **Demo Credentials**: Pre-configured test accounts

## Demo Credentials

### Admin Account
- **Email**: admin@jobportal.com
- **Password**: password123

### Student Account
- **Email**: student@example.com
- **Password**: password123

## Technology Stack

- **Frontend**: Angular 19
- **Styling**: CSS3 with modern design patterns
- **Icons**: Font Awesome 6
- **State Management**: Angular Services with BehaviorSubject
- **Routing**: Angular Router with lazy loading support

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/              # Main landing page
│   │   ├── admin-login/           # Admin authentication
│   │   ├── student-login/         # Student authentication
│   │   ├── admin-register/        # Admin registration
│   │   ├── student-register/      # Student registration
│   │   ├── admin-dashboard/       # Admin main interface
│   │   ├── student-dashboard/     # Student main interface
│   │   ├── job-list/             # Job listings
│   │   └── add-job/              # Job creation form
│   ├── services/
│   │   ├── auth.service.ts       # Authentication logic
│   │   └── job.service.ts        # Job management logic
│   ├── app.routes.ts             # Application routing
│   └── app.config.ts             # App configuration
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Angular CLI (v19)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jobportal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
ng build --configuration production
```

## Key Features Implementation

### Authentication Service
- User management with different roles (admin/student)
- Session persistence using localStorage
- Mock authentication for demonstration

### Job Management Service
- CRUD operations for job postings
- Application tracking and status management
- Search functionality with multiple criteria

### Responsive Design
- Mobile-first approach
- CSS Grid and Flexbox layouts
- Smooth animations and transitions
- Modern gradient backgrounds

### Form Validation
- Reactive forms with comprehensive validation
- Real-time error feedback
- User-friendly error messages

## User Flow

### Admin Flow
1. **Login** → Admin login page
2. **Dashboard** → Overview of all job postings and applications
3. **Add Jobs** → Create new job postings
4. **Review Applications** → Manage student applications
5. **Analytics** → View performance metrics

### Student Flow
1. **Login** → Student login page
2. **Dashboard** → View available jobs and application status
3. **Search Jobs** → Find relevant opportunities
4. **Apply** → Submit job applications
5. **Track** → Monitor application progress

## Customization

### Styling
- Modify CSS variables in component stylesheets
- Update color schemes in gradient backgrounds
- Adjust responsive breakpoints

### Data
- Update mock data in services
- Add new job categories
- Modify user roles and permissions

### Features
- Add new dashboard widgets
- Implement real backend integration
- Add file upload functionality
- Implement email notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ using Angular**
