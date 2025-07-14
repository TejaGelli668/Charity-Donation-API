# Charity Donation Platform - Backend API

A robust Node.js backend API for the Charity Donation Platform that handles user authentication, campaign management, donation processing, and administrative functions. Built with MongoDB for data persistence and designed for scalability on AWS infrastructure.

## 🌟 Features

### Core API Features
- **User Authentication**: JWT-based authentication and authorization
- **Campaign Management**: CRUD operations for fundraising campaigns
- **Donation Processing**: Secure donation handling and tracking
- **Admin Panel**: Administrative controls and monitoring
- **Payment Integration**: Multiple payment gateway support
- **Real-time Updates**: Campaign progress tracking
- **Security**: Input validation, rate limiting, and data protection

### Business Logic
- **Campaign Approval Workflow**: Admin review and approval process
- **Donation Tracking**: Comprehensive donation history and analytics
- **User Management**: Registration, profile management, and access control
- **Financial Operations**: Payment processing, refunds, and reporting

## 🛠️ Technologies Used

- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **bcrypt**: Password hashing
- **multer**: File upload handling
- **cors**: Cross-origin resource sharing
- **helmet**: Security middleware
- **express-rate-limit**: Rate limiting

## 📊 Database Schema

### Collections

#### Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  password: String,
  created_on: Date,
  updated_on: Date
}
```

#### Admins
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  created_on: Date,
  updated_on: Date
}
```

#### Campaigns
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  title: String,
  cause: String,
  description: String,
  category_id: ObjectId,
  goal: Number,
  status_id: ObjectId,
  amount_raised: Number,
  created_on: Date,
  updated_on: Date
}
```

#### Donations
```javascript
{
  _id: ObjectId,
  campaign_id: ObjectId,
  user_id: ObjectId,
  user_name: String,
  amount: Number,
  donation_status: String,
  refund_amount: Number,
  refund_status: String,
  created_on: Date,
  updated_on: Date
}
```

#### Categories
```javascript
{
  _id: ObjectId,
  category: String
}
```

#### Campaign_Status
```javascript
{
  _id: ObjectId,
  status: String
}
```

#### Payment_details
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  payments: [{
    _id: ObjectId,
    donation_id: ObjectId,
    payment_type: String,
    card_number: String,
    card_name: String,
    expiry_month: String,
    expiry_year: String,
    cvv: String,
    status: String,
    total_amount: Number,
    created_on: Date,
    updated_on: Date
  }]
}
```

## 🚀 API Endpoints

### Authentication
```
POST /api/auth/register          # User registration
POST /api/auth/login            # User login
POST /api/auth/logout           # User logout
POST /api/admin/login           # Admin login
GET  /api/auth/profile          # Get user profile
PUT  /api/auth/profile          # Update user profile
```

### Campaigns
```
GET    /api/campaigns           # Get all campaigns
GET    /api/campaigns/:id       # Get campaign by ID
POST   /api/campaigns          # Create new campaign
PUT    /api/campaigns/:id      # Update campaign
DELETE /api/campaigns/:id      # Delete campaign
GET    /api/campaigns/user/:userId  # Get user's campaigns
GET    /api/campaigns/status/:status # Get campaigns by status
```

### Donations
```
GET    /api/donations           # Get all donations
GET    /api/donations/:id       # Get donation by ID
POST   /api/donations          # Create new donation
GET    /api/donations/campaign/:campaignId # Get campaign donations
GET    /api/donations/user/:userId # Get user donations
PUT    /api/donations/:id/refund # Process refund
```

### Admin
```
GET    /api/admin/campaigns     # Get all campaigns for review
PUT    /api/admin/campaigns/:id/approve # Approve campaign
PUT    /api/admin/campaigns/:id/reject  # Reject campaign
GET    /api/admin/users         # Get all users
GET    /api/admin/donations     # Get all donations
GET    /api/admin/analytics     # Get platform analytics
```

### Categories
```
GET    /api/categories          # Get all categories
POST   /api/categories         # Create new category
PUT    /api/categories/:id     # Update category
DELETE /api/categories/:id     # Delete category
```

### Payment
```
POST   /api/payment/process    # Process payment
GET    /api/payment/methods    # Get payment methods
POST   /api/payment/refund     # Process refund
GET    /api/payment/history/:userId # Get payment history
```

## 🏗️ Project Structure

```
src/
├── controllers/            # Request handlers
│   ├── authController.js
│   ├── campaignController.js
│   ├── donationController.js
│   ├── adminController.js
│   └── paymentController.js
├── models/                # Database models
│   ├── User.js
│   ├── Campaign.js
│   ├── Donation.js
│   ├── Category.js
│   └── Admin.js
├── routes/                # API routes
│   ├── auth.js
│   ├── campaigns.js
│   ├── donations.js
│   ├── admin.js
│   └── payment.js
├── middleware/            # Custom middleware
│   ├── auth.js
│   ├── validation.js
│   ├── rateLimiting.js
│   └── errorHandler.js
├── config/               # Configuration files
│   ├── database.js
│   ├── config.js
│   └── passport.js
├── utils/                # Utility functions
│   ├── helpers.js
│   ├── validators.js
│   └── emailService.js
├── uploads/              # File uploads directory
└── app.js               # Main application file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/charity-donation-api.git
   cd charity-donation-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3001
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/charity_platform
   DB_NAME=charity_platform
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=24h
   
   # Payment Gateway
   STRIPE_SECRET_KEY=your_stripe_secret_key
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   
   # Email Service
   EMAIL_SERVICE=gmail
   EMAIL_USERNAME=your_email@gmail.com
   EMAIL_PASSWORD=your_email_password
   
   # AWS Configuration (for deployment)
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

   The API will be available at `http://localhost:3001`

## 📜 Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon
- `npm test`: Run test suite
- `npm run lint`: Run ESLint
- `npm run build`: Build for production

## 🌐 AWS Deployment

### Step 1: Amazon DocumentDB Setup
1. Create DocumentDB cluster in AWS Console
2. Configure cluster with appropriate instance type
3. Set up security groups for VPC access
4. Note connection string for application configuration

### Step 2: EC2 Instance Setup
1. Launch EC2 instance with appropriate AMI
2. Configure security groups:
   - Port 22 (SSH)
   - Port 3001 (API)
   - Port 27017 (MongoDB)
3. Connect to instance and install Node.js

### Step 3: Deploy Application
```bash
# Connect to EC2 instance
ssh -i "your-key.pem" ec2-user@your-ec2-ip

# Copy files to EC2
scp -i "your-key.pem" -r ./project-folder ec2-user@your-ec2-ip:/home/ec2-user/

# Install dependencies and start application
cd project-folder
npm install
npm start
```

### Step 4: API Gateway Configuration
1. Create HTTP API in API Gateway
2. Configure routes and integrations
3. Set up CORS and authentication
4. Deploy API and note endpoint URL

### Step 5: CloudWatch & IAM Setup
1. Create IAM role with CloudWatch permissions
2. Attach role to API Gateway for logging
3. Configure log groups in CloudWatch
4. Set up monitoring and alerts

## 🔐 Security Features

- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Configured cross-origin resource sharing
- **Helmet**: Security headers protection
- **Password Hashing**: bcrypt for secure password storage
- **Data Sanitization**: Input sanitization and validation

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test auth
npm test campaigns
npm test donations

# Run tests with coverage
npm run test:coverage
```

## 📊 Monitoring & Logging

### CloudWatch Integration
- API request/response logging
- Error tracking and alerting
- Performance metrics monitoring
- Custom dashboards for analytics

### Health Checks
- Database connectivity monitoring
- API endpoint health checks
- System resource monitoring
- Automated failure notifications

## 🔧 Configuration

### Database Connection
```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
```

### Middleware Setup
```javascript
// app.js
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiting);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check API documentation for endpoint details
- Review error logs in CloudWatch
- Contact the development team

## 🔮 Future Enhancements

- GraphQL API implementation
- Real-time notifications with WebSockets
- Advanced analytics and reporting
- Microservices architecture
- Enhanced security features
- Performance optimization
- API versioning

---

**Built with 🚀 for scalable and secure charitable giving**
