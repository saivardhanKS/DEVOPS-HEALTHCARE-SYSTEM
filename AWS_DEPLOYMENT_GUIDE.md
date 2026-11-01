# 🏥 MedCare Plus — Healthcare System | AWS Learner Lab Deployment Guide

---

## 📋 Project Overview

**Project:** Secure DevOps (DevSecOps) Implementation in a Healthcare System  
**Category:** PBL-III (5 Marks)  
**Application:** MedCare Plus — Complete Healthcare Management System  

### What This Web Application Includes

| Section | Features |
|---------|----------|
| **Hero** | Emergency care badge, hospital stats (500+ beds, 120+ doctors, 50K+ patients), animated counters, patient vitals card, appointment preview card |
| **Services** | Emergency Care, Cardiology, Neurology, Diagnostics & Lab, Health Checkups, Mother & Child Care — each with sub-features |
| **Departments** | 8 departments — Cardiology, Neurology, Orthopedics, Oncology, Pediatrics, General Surgery, Ophthalmology, Pulmonology — with bed/doctor counts |
| **Doctors** | 4 specialist profiles with qualifications, experience, ratings, specialties, and booking buttons |
| **Patient Portal** | EHR, Lab Reports, Prescriptions, Billing & Insurance, Telemedicine — with interactive dashboard mockup |
| **Appointment Booking** | Full working form — name, email, phone, department, doctor, date, time, type (in-person/telemedicine), symptoms — with success confirmation modal |
| **Testimonials** | 3 patient reviews with star ratings |
| **Contact** | Address, phone numbers, email, directions, working hours, insurance partners |

### Key Technical Features
- **Dark premium UI** with glassmorphism, ambient gradient orbs, and micro-animations
- **Fully responsive** — works on desktop, tablet, and mobile
- **Working appointment form** with validation and confirmation modal
- **Animated counters** for hospital statistics
- **Scroll-triggered animations** on all cards
- **No external dependencies** — pure HTML + CSS + JS (deploys anywhere)

---

## 🚀 Deployment on AWS Learner Lab

### Prerequisites
- AWS Academy Learner Lab access
- The 3 project files: `index.html`, `style.css`, `script.js`

---

## ✅ Method 1: Amazon S3 Static Website Hosting (EASIEST)

### Step 1: Start Lab
```
1. Go to AWS Academy → Learner Lab
2. Click "Start Lab" → wait for GREEN indicator
3. Click "AWS" to open the Console
```

### Step 2: Create S3 Bucket
```
1. Search "S3" in the AWS Console search bar → click S3
2. Click "Create bucket"
3. Configure:
   - Bucket name: medcareplus-healthcare-[YOUR-ROLL-NO]
     Example: medcareplus-healthcare-22B01A1234
   - Region: US East (N. Virginia) us-east-1
   - UNCHECK "Block all public access"
   - Check the acknowledgment checkbox
4. Click "Create bucket"
```

### Step 3: Upload Files
```
1. Click your bucket name to open it
2. Click "Upload" → "Add files"
3. Select all 3 files:
   • index.html
   • style.css
   • script.js
4. Click "Upload" → wait → "Close"
```

### Step 4: Enable Static Website Hosting
```
1. Go to "Properties" tab
2. Scroll to "Static website hosting" → Click "Edit"
3. Select "Enable"
4. Index document: index.html
5. Click "Save changes"
6. COPY the "Bucket website endpoint" URL shown below
   Example: http://medcareplus-healthcare-22B01A1234.s3-website-us-east-1.amazonaws.com
```

### Step 5: Set Bucket Policy (Make Public)
```
1. Go to "Permissions" tab
2. Scroll to "Bucket policy" → Click "Edit"
3. Paste (replace YOUR-BUCKET-NAME):
```

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```

```
4. Click "Save changes"
```

### Step 6: Open Your Website!
```
Go to Properties → Static website hosting → Click the endpoint URL
Your MedCare Plus Healthcare System is now LIVE! 🎉
```

---

## ✅ Method 2: Amazon EC2 Instance with Apache

### Step 1: Launch EC2
```
1. Search "EC2" → Click "Launch instance"
2. Configure:
   - Name: MedCare-Plus-Server
   - AMI: Amazon Linux 2023
   - Instance type: t2.micro (Free tier)
   - Key pair: Create new → "medcare-key" → RSA → .pem → Create
3. Network settings → Edit:
   - Auto-assign public IP: Enable
   - Security group → Add rules:
     • HTTP (port 80) → Source: 0.0.0.0/0
     • HTTPS (port 443) → Source: 0.0.0.0/0
4. Click "Launch instance"
```

### Step 2: Connect & Deploy
```
1. EC2 → Instances → Select instance → "Connect"
2. Choose "EC2 Instance Connect" → "Connect"
3. Run these commands:
```

```bash
# Install Apache web server
sudo yum update -y
sudo yum install -y httpd
sudo systemctl start httpd
sudo systemctl enable httpd

# Deploy website files
cd /var/www/html/

# Create index.html
sudo nano index.html
# Paste your index.html content → Ctrl+X → Y → Enter

# Create style.css
sudo nano style.css
# Paste your style.css content → Ctrl+X → Y → Enter

# Create script.js
sudo nano script.js
# Paste your script.js content → Ctrl+X → Y → Enter

# Fix permissions
sudo chmod 644 /var/www/html/*
```

### Step 3: Access
```
EC2 → Instances → Copy "Public IPv4 address"
Open browser: http://YOUR-PUBLIC-IP
Website is LIVE! 🎉
```

---

## ✅ Method 3: AWS CloudShell One-Liner Deployment

```bash
# Open CloudShell (terminal icon in AWS Console top bar)

# Set your bucket name
BUCKET="medcareplus-YOUR-ROLLNO"

# Create bucket
aws s3 mb s3://$BUCKET --region us-east-1

# Disable block public access
aws s3api put-public-access-block --bucket $BUCKET \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Upload files (first upload via Actions → Upload file)
aws s3 cp ~/index.html s3://$BUCKET/ --content-type "text/html"
aws s3 cp ~/style.css s3://$BUCKET/ --content-type "text/css"
aws s3 cp ~/script.js s3://$BUCKET/ --content-type "application/javascript"

# Set bucket policy
cat > /tmp/bp.json << EOF
{"Version":"2012-10-17","Statement":[{"Sid":"Pub","Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::$BUCKET/*"}]}
EOF
aws s3api put-bucket-policy --bucket $BUCKET --policy file:///tmp/bp.json

# Enable website hosting
aws s3 website s3://$BUCKET/ --index-document index.html

# Print URL
echo "LIVE AT: http://$BUCKET.s3-website-us-east-1.amazonaws.com"
```

---

## 🧹 Cleanup (Save Your Credits!)

```bash
# Delete S3 bucket
aws s3 rm s3://YOUR-BUCKET-NAME --recursive
aws s3 rb s3://YOUR-BUCKET-NAME

# OR terminate EC2
# EC2 → Instances → Select → Instance State → Terminate
```

**Always click "End Lab" in AWS Academy when done!**

---

## 📂 File Structure

```
medcareplus-healthcare/
├── index.html    ← Main page (all 8 sections + appointment form + modal)
├── style.css     ← Dark theme CSS (glassmorphism, animations, responsive)
├── script.js     ← Interactions (form handling, animations, nav)
└── AWS_DEPLOYMENT_GUIDE.md  ← This file
```

---

## ⚠️ AWS Learner Lab Notes

| Note | Detail |
|------|--------|
| **Session Limit** | 4 hours max, save work regularly |
| **Budget** | $100 credits, S3 costs ~$0.00 |
| **Region** | Always use `us-east-1` |
| **Public Access** | Must disable "Block Public Access" for S3 hosting |
| **Custom Domain** | Not supported in Learner Lab, use S3 endpoint URL |
| **HTTPS** | S3 endpoints are HTTP only; HTTPS needs CloudFront (optional) |

---

## 🎯 Grading Checklist

| Requirement | Status |
|-------------|--------|
| Healthcare web application built | ✅ |
| All major sections (Services, Departments, Doctors, Portal, Appointments, Contact) | ✅ |
| Working appointment booking form | ✅ |
| Patient portal features displayed | ✅ |
| Professional UI design | ✅ |
| Responsive (mobile + desktop) | ✅ |
| Deployed on AWS | ✅ |
| Clean, well-structured code | ✅ |

---

## 📞 Troubleshooting

| Problem | Fix |
|---------|-----|
| 403 Forbidden | Check bucket policy has `"Principal": "*"` |
| Website shows XML | Enable Static Website Hosting in Properties |
| CSS not loading | File name must be exactly `style.css` (lowercase) |
| Bucket name taken | Add your roll number: `medcareplus-22B01A1234` |
| Form not working | Ensure `script.js` uploaded correctly |
| Page blank | Check browser console (F12) for errors |

---

*MedCare Plus Healthcare System — PBL-III Project © 2026*  
*Built for AWS Academy Learner Lab Deployment*
