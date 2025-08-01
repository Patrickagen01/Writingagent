#!/bin/bash

# Decentralized Job Application Agent - Deployment Script
# This script automates deployment to different platforms with cost optimization

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="decentralized-job-agent"
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"

echo -e "${BLUE}🚀 Decentralized Job Application Agent - Deployment Script${NC}"
echo -e "${YELLOW}This script will help you deploy to your chosen platform${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install dependencies
install_dependencies() {
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    
    if command_exists npm; then
        npm run install:all
    else
        echo -e "${RED}❌ npm is not installed. Please install Node.js first.${NC}"
        exit 1
    fi
}

# Function to build the project
build_project() {
    echo -e "${BLUE}🔨 Building project...${NC}"
    
    # Build frontend
    cd $FRONTEND_DIR
    npm run build
    cd ..
    
    # Build backend
    cd $BACKEND_DIR
    npm run build
    cd ..
    
    echo -e "${GREEN}✅ Build completed successfully${NC}"
}

# Function to deploy to Vercel (Frontend)
deploy_vercel() {
    echo -e "${BLUE}🌐 Deploying frontend to Vercel...${NC}"
    
    if ! command_exists vercel; then
        echo -e "${YELLOW}Installing Vercel CLI...${NC}"
        npm install -g vercel
    fi
    
    cd $FRONTEND_DIR
    
    # Check if already logged in
    if ! vercel whoami >/dev/null 2>&1; then
        echo -e "${YELLOW}Please login to Vercel...${NC}"
        vercel login
    fi
    
    # Deploy
    vercel --prod --yes
    
    cd ..
    
    echo -e "${GREEN}✅ Frontend deployed to Vercel${NC}"
}

# Function to deploy to Railway (Backend)
deploy_railway() {
    echo -e "${BLUE}🚂 Deploying backend to Railway...${NC}"
    
    if ! command_exists railway; then
        echo -e "${YELLOW}Installing Railway CLI...${NC}"
        npm install -g @railway/cli
    fi
    
    cd $BACKEND_DIR
    
    # Check if already logged in
    if ! railway whoami >/dev/null 2>&1; then
        echo -e "${YELLOW}Please login to Railway...${NC}"
        railway login
    fi
    
    # Deploy
    railway up
    
    cd ..
    
    echo -e "${GREEN}✅ Backend deployed to Railway${NC}"
}

# Function to deploy to DigitalOcean
deploy_digitalocean() {
    echo -e "${BLUE}🌊 Deploying to DigitalOcean...${NC}"
    
    if ! command_exists doctl; then
        echo -e "${YELLOW}Installing DigitalOcean CLI...${NC}"
        # Installation instructions for different OS
        echo "Please install doctl from: https://docs.digitalocean.com/reference/doctl/how-to/install/"
        exit 1
    fi
    
    # Create app
    doctl apps create --spec deployment/digitalocean-app.yaml
    
    echo -e "${GREEN}✅ Deployed to DigitalOcean${NC}"
}

# Function to deploy to AWS
deploy_aws() {
    echo -e "${BLUE}☁️ Deploying to AWS...${NC}"
    
    if ! command_exists aws; then
        echo -e "${YELLOW}Installing AWS CLI...${NC}"
        echo "Please install AWS CLI from: https://aws.amazon.com/cli/"
        exit 1
    fi
    
    # Deploy using AWS CDK or CloudFormation
    echo -e "${YELLOW}AWS deployment requires additional setup.${NC}"
    echo "Please refer to deployment/aws/README.md for detailed instructions."
}

# Function to show cost estimate
show_cost_estimate() {
    echo -e "${BLUE}💰 Cost Estimate${NC}"
    echo ""
    echo -e "${YELLOW}MVP Deployment (Recommended):${NC}"
    echo "  • Frontend (Vercel): Free"
    echo "  • Backend (Railway): $5/month"
    echo "  • Database (Railway): $5/month"
    echo "  • IPFS (Infura): Free"
    echo "  • Total: $10/month"
    echo ""
    echo -e "${YELLOW}Production Deployment:${NC}"
    echo "  • Frontend (Vercel Pro): $20/month"
    echo "  • Backend (DigitalOcean): $12/month"
    echo "  • Database (Managed): $15/month"
    echo "  • IPFS (Pinata): $20/month"
    echo "  • Total: $67/month"
    echo ""
}

# Function to show deployment options
show_deployment_options() {
    echo -e "${BLUE}🎯 Choose your deployment option:${NC}"
    echo ""
    echo "1) MVP (Vercel + Railway) - $10/month"
    echo "2) Production (DigitalOcean) - $67/month"
    echo "3) Enterprise (AWS) - $100+/month"
    echo "4) Self-hosted - $5-50/month"
    echo "5) Show cost breakdown"
    echo "6) Exit"
    echo ""
}

# Main deployment function
main() {
    echo -e "${GREEN}Welcome to the Decentralized Job Application Agent deployment!${NC}"
    echo ""
    
    # Install dependencies
    install_dependencies
    
    # Build project
    build_project
    
    # Show deployment options
    while true; do
        show_deployment_options
        read -p "Enter your choice (1-6): " choice
        
        case $choice in
            1)
                echo -e "${BLUE}🚀 Deploying MVP version...${NC}"
                deploy_vercel
                deploy_railway
                echo -e "${GREEN}✅ MVP deployment completed!${NC}"
                break
                ;;
            2)
                echo -e "${BLUE}🚀 Deploying Production version...${NC}"
                deploy_vercel
                deploy_digitalocean
                echo -e "${GREEN}✅ Production deployment completed!${NC}"
                break
                ;;
            3)
                echo -e "${BLUE}🚀 Deploying Enterprise version...${NC}"
                deploy_aws
                break
                ;;
            4)
                echo -e "${BLUE}🚀 Self-hosted deployment...${NC}"
                echo "Please refer to deployment/self-hosted/README.md"
                break
                ;;
            5)
                show_cost_estimate
                ;;
            6)
                echo -e "${GREEN}Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid choice. Please try again.${NC}"
                ;;
        esac
    done
    
    echo ""
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Configure environment variables"
    echo "2. Set up your domain"
    echo "3. Configure SSL certificates"
    echo "4. Set up monitoring"
    echo ""
    echo -e "${YELLOW}For detailed instructions, see: deployment/README.md${NC}"
}

# Run main function
main "$@"