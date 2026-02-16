# User Management Application

A professional user management web application built with .NET 8, React, and PostgreSQL. This application provides secure user authentication, registration with email verification, and a comprehensive admin panel for managing users.

##  Features

### Authentication & Authorization
- **User Registration** with email verification
- **Secure Login** with session management
- **Email Verification** (asynchronous confirmation emails)
- **Session Validation** - All requests validate user existence and blocked status

### User Management (Admin Panel)
- **Comprehensive User Table** displaying:
  - Email address
  - Full name
  - Last login time
  - Account status (Unverified/Active/Blocked)
  - Registration time
- **Bulk Operations** via toolbar:
  - Block selected users
  - Unblock selected users
  - Delete selected users
  - Delete all unverified users
- **Multi-Selection** with checkboxes (including Select All/Deselect All)
- **Automatic Sorting** by last login time
- **Self-Management** - Users can manage their own accounts

### Security Features
- **Database-Level Email Uniqueness** (unique index constraint)
- **Automatic Session Validation** - Blocked/deleted users are redirected to login
- **No Client-Side Uniqueness Checks** - Database handles all constraints
- **Secure Password Storage** with hashing
- **Protected Routes** - Non-authenticated users cannot access admin panel

### User Experience
- **Responsive Design** - Works on desktop and mobile devices
- **Professional UI** using modern CSS framework
- **Error Handling** with meaningful messages
- **Status Messages** for operation feedback
- **Tooltips** for better usability
- **No Unnecessary Animations** - Clean, business-oriented interface

##  Prerequisites

Before running this application, ensure you have:

- **.NET 8.0 SDK** or later
- **Node.js** (v18 or later) and npm
- **PostgreSQL** (v12 or later)
- **SMTP Server Access** (for sending verification emails)

##  Technology Stack

### Backend
- .NET 8 / ASP.NET Core
- Entity Framework Core
- PostgreSQL with Npgsql
- JWT Authentication

### Frontend
- React 18
- TypeScript/JavaScript
- CSS Framework (Bootstrap or equivalent)
- Axios for API requests

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Locas1000/User-Management-Application.git
cd User-Management-Application
```

### 2. Database Configuration

#### Create PostgreSQL Database

```sql
CREATE DATABASE UserManagementDb;
```

#### Configure Connection String

**Option A: User Secrets (Recommended for Local Development)**

```bash
cd Task4.Server
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Database=UserManagementDb;Username=YOUR_USERNAME;Password=YOUR_PASSWORD"
```

**Option B: Environment Variables (Production)**

Linux/macOS:
```bash
export ConnectionStrings__DefaultConnection="Host=your-server;Database=UserManagementDb;Username=YOUR_USERNAME;Password=YOUR_PASSWORD"
```

Windows (PowerShell):
```powershell
$env:ConnectionStrings__DefaultConnection="Host=your-server;Database=UserManagementDb;Username=YOUR_USERNAME;Password=YOUR_PASSWORD"
```

**Option C: appsettings.Development.json (Local Development)**

Create or modify `Task4.Server/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=UserManagementDb;Username=YOUR_USERNAME;Password=YOUR_PASSWORD"
  }
}
```

>  **Security Note**: This file is in `.gitignore` and will not be committed. Never commit credentials to source control.

### 3. Email Configuration

Configure SMTP settings in `appsettings.json` or User Secrets:

```json
{
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "your-email@gmail.com",
    "SenderPassword": "your-app-password",
    "EnableSsl": true
  }
}
```

For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833).

### 4. Run Database Migrations

```bash
cd Task4.Server
dotnet ef database update
```

This will create all necessary tables with proper indexes, including:
- **Unique index on email** (ensuring database-level uniqueness)
- Users table with status tracking
- Audit fields for timestamps

### 5. Start the Backend Server

```bash
cd Task4.Server
dotnet run
```

The API will be available at `https://localhost:7221` (or as configured).

### 6. Start the Frontend Client

```bash
cd task4.client
npm install
npm run dev
```

The client will be available at `http://localhost:5174` (or as configured).

### 7. Update CORS Configuration

Ensure `appsettings.json` has the correct client URL:

```json
{
  "AppSettings": {
    "ClientUrl": "http://localhost:5174"
  }
}
```

##  Usage

### First Time Setup

1. Navigate to `http://localhost:5174`
2. Click **Register** to create a new account
3. Fill in your name, email, and password (minimum 1 character)
4. After registration, you'll be logged in automatically
5. Check your email for the verification link (sent asynchronously)
6. Click the verification link to change status from "Unverified" to "Active"

### User Management

1. **Login** with your credentials
2. Access the **User Management Table** (admin panel)
3. View all registered users with their details
4. Use checkboxes to select users for bulk operations:
   - **Select All** - Check the header checkbox
   - **Individual Selection** - Check specific user rows
5. Use toolbar buttons to:
   - **Block** - Prevent selected users from logging in
   - **Unblock** - Restore access for blocked users
   - **Delete** - Permanently remove selected users (they can re-register)
   - **Delete Unverified** - Remove all users with unverified emails

### Important Behaviors

- **Blocked users** cannot log in
- **Deleted users** are permanently removed (not marked)
- **All users** can manage other users (including themselves)
- **Session validation** occurs before every request (except login/register)
- If your account is blocked/deleted, you'll be redirected to login
- **Email uniqueness** is enforced by the database (unique index)

##  Architecture

### Database Schema

**Users Table:**
- `Id` (Primary Key)
- `Email` (Unique Index - **Database-level constraint**)
- `Name`
- `PasswordHash`
- `Status` (Unverified/Active/Blocked)
- `RegistrationTime`
- `LastLoginTime`
- `CreatedAt`
- `UpdatedAt`

### Key Implementation Details

1. **Unique Index**: Database guarantees email uniqueness independently of application code
2. **No Client-Side Checks**: Application doesn't check for duplicate emails; database handles this
3. **Session Validation Middleware**: Validates user status before each authenticated request
4. **Asynchronous Email**: Verification emails are sent without blocking registration flow
5. **Proper HTTP Status Codes**: Meaningful error responses for all operations

##  Security Considerations

### Production Deployment

- **Never use default superuser accounts** (like 'postgres') for application connections
- **Use dedicated database users** with minimal required permissions
- **Store secrets securely**:
  - Azure App Service: Use Application Settings
  - Docker: Use Docker Secrets or environment variables
  - Kubernetes: Use Secrets management
- **Enable HTTPS** in production
- **Use strong JWT secrets**
- **Implement rate limiting** for login attempts
- **Set secure cookie options**

### Development Security

- Use User Secrets for local development
- Never commit `appsettings.Development.json` with credentials
- Be cautious of shell history when setting environment variables
- Use a password manager for secure credential storage

##  Responsive Design

The application is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablet devices
- Mobile phones
- Various screen resolutions

The UI maintains professional appearance and usability across all devices.

## Troubleshooting

### Database Connection Issues

```
Error: Connection refused
```
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check connection string credentials
- Ensure database exists: `psql -U postgres -c "\l"`

### Email Sending Fails

```
Error: SMTP authentication failed
```
- For Gmail, use an App Password instead of your regular password
- Check SMTP settings (host, port, SSL)
- Verify sender email credentials

### Migration Errors

```
Error: Npgsql.PostgresException: 42P07: relation "Users" already exists
```
- Drop and recreate database: `dropdb UserManagementDb && createdb UserManagementDb`
- Run migrations again: `dotnet ef database update`

### Port Already in Use

```
Error: EADDRINUSE: address already in use :::5174
```
- Change port in `vite.config.js` or kill the process using the port

##  Project Requirements Met

✅ Unique index on email in database  
✅ Professional table with toolbar layout  
✅ Data sorted by last login time  
✅ Multi-selection with checkboxes (including Select All)  
✅ Session validation before each request  
✅ Non-authenticated users cannot access admin panel  
✅ Email verification system (unverified → active)  
✅ Block/Unblock/Delete operations via toolbar  
✅ No buttons in data rows (toolbar only)  
✅ Users can manage themselves and others  
✅ Deleted users are permanently removed  
✅ Blocked users cannot login  
✅ Responsive design with CSS framework  
✅ Error messages, tooltips, and status messages  
✅ No wallpapers, no animations, no browser alerts  

##  Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the LICENSE file for details.

##  Author

**Locas1000**
- GitHub: [@Locas1000](https://github.com/Locas1000)

##  Acknowledgments

- Built as part of Task #5 course project
- Uses .NET 8, React, and PostgreSQL
- Implements industry-standard security practices
- Follows professional web application design patterns

---

**Note**: This is a learning project demonstrating user management, authentication, and database operations. For production use, consider additional security hardening, comprehensive testing, and monitoring.
