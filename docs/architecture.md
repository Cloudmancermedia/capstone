# Architecture Overview

This repository uses a modular CDK layout. The infra stack is composed of constructs for networking, data, search, auth, API, and frontend hosting.

## Network Layer

- VPC with public and private subnets (NAT enabled)
- VPC endpoints for DynamoDB, S3, and Secrets Manager
- VPN gateway, customer gateway, and static routes for on-prem connectivity

## Data Layer

- DynamoDB tables for logistics preferences and clickstream
- RDS PostgreSQL (multi-AZ) for inventory
- OpenSearch domain for product search

## Application Layer

- Lambda handlers for products and health
- API Gateway with Cognito authorization
- WAF protections for API and CloudFront

## Frontend

- S3 bucket with CloudFront distribution
- CloudFront WAF ACL attached

## Security

- Storage encryption enabled
- SSL/TLS enforced
- Least privilege IAM policies for Lambda access

## CI/CD

- Separate CDK app (`platform/`) builds and deploys infra
- Post-deploy step publishes the web frontend and invalidates CloudFront
