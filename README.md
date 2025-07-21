# international-patient-monitoring
Web application for tracking patients domestically and internationally.


![App Banner](https://via.placeholder.com/1200x400/2D3748/FFFFFF?text=CNAM+Patient+Tracking+System)

A secure, full-stack application for managing patient records across national borders, developed for CNAM with Spring Boot and React.

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/nextry2025/international-patient-monitoring.git
cd international-patient-monitoring

# 2. Initialize database (MySQL required)
mysql -u root -p -e "CREATE DATABASE cnam_patient; CREATE USER 'cnam_admin'@'localhost' IDENTIFIED BY 'SecurePass123!'; GRANT ALL PRIVILEGES ON cnam_patient.* TO 'cnam_admin'@'localhost';"

# 3. Start backend
cd backend && ./mvnw spring-boot:run

# 4. Start frontend (new terminal)
cd ../frontend && npm install && npm start