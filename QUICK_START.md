# ⚡ Quick Start Guide - Task Linker

Get up and running in 5 minutes!

## 🚀 Fastest Way to Start

```bash
cd /home/engine/project
./start.sh
```

That's it! The script will:
1. Start Docker containers
2. Set up the database
3. Create default user
4. Launch all services

## 🌐 Access the Application

After running `start.sh`, open your browser:

**Web Application**: http://localhost:3000

**Login Credentials**:
- Username: `admin`
- Password: `admin123`

## 📱 Testing Mobile App

```bash
cd frontend-mobile
npm install

# Update API URL in App.tsx (line 14)
# Change to your machine's IP: http://192.168.1.XXX:5000/api

npm start

# Scan QR code with Expo Go app
```

## ✅ What You Can Do

1. **Dashboard** - View statistics of all items
2. **Shop Drawings** - Upload and manage drawings (PDF, DWG, etc.)
3. **RFIs** - Create and track requests for information
4. **Meetings** - Record meeting minutes with attachments
5. **Engineers** - Manage outsourced engineer information
6. **Tasks** - Link all items together

## 🎯 Quick Demo Workflow

1. Login at http://localhost:3000
2. Go to "Shop Drawings" → Click "+ Add New"
3. Fill form: Title, Drawing Number, upload a PDF
4. Go to "Engineers" → Add an engineer
5. Go to "Tasks" → Create a task linking the drawing and engineer
6. Check Dashboard to see statistics update

## 🐳 Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart a service
docker-compose restart backend

# View running containers
docker-compose ps
```

## 🔧 Troubleshooting

**Port already in use?**
```bash
# Stop conflicting services
docker ps  # Find container using port
docker stop <container-id>
```

**Database not connecting?**
```bash
# Restart PostgreSQL
docker-compose restart postgres
sleep 10
docker-compose exec backend npm run migrate
```

**Frontend can't reach backend?**
- Check backend is running: http://localhost:5000/health
- Should return: `{"status":"ok","timestamp":"..."}`

## 📚 Documentation

- **Full Documentation**: [README_TASKLINKER.md](README_TASKLINKER.md)
- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Project Summary**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## 🆘 Need Help?

1. Check logs: `docker-compose logs backend`
2. Verify containers: `docker-compose ps`
3. Review deployment guide for detailed troubleshooting

---

**Enjoy building with Task Linker!** 🎉
