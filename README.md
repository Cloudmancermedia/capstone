# D2C Food Platform

A direct-to-consumer ordering and logistics customization platform for a medium-sized food distributor. This monorepo contains AWS infrastructure, backend handlers, and a basic React frontend.

## Project Structure

```
root/
  apps/
    web/              React frontend (Vite)
  packages/
    api-handlers/     Lambda handler sources
    shared/           Shared types and constants
  infra/              AWS CDK infrastructure
  platform/           AWS CDK pipeline (CI/CD)
  docs/               Architecture notes
```

## Prerequisites

- Node.js 18+
- PNPM 8+ (`npm install -g pnpm`)
- AWS CLI configured
- AWS CDK CLI (`pnpm add -g aws-cdk`)

## Setup

```bash
pnpm install
```

## Common Commands

```bash
pnpm build                 # Build all packages
pnpm lint                  # Lint all packages
pnpm test                  # Run all tests (placeholder in some packages)

# Infrastructure
pnpm cdk synth             # Synthesize infra stack
pnpm cdk diff              # Compare with deployed infra
pnpm cdk deploy            # Deploy infra stack

# Pipeline
pnpm platform synth        # Synthesize pipeline stack
pnpm platform deploy       # Deploy pipeline stack
```

## Deploy Infrastructure

```bash
pnpm build
pnpm --filter @d2c-platform/infra cdk deploy \
  --parameters CustomerGatewayIp=YOUR_PUBLIC_IP \
  --parameters CustomerGatewayAsn=65000 \
  --parameters OnPremCidr=10.10.0.0/16
```

Notes:
- CloudFront WAF resources must be deployed in us-east-1.
- The stack outputs the frontend bucket name and distribution ID for manual deploys.

## Deploy CI/CD Pipeline

```bash
pnpm build
pnpm --filter @d2c-platform/platform cdk deploy \
  --parameters CodeStarConnectionArn=arn:aws:codestar-connections:REGION:ACCOUNT:connection/ID \
  --parameters GitHubOwner=Cloudmancermedia \
  --parameters GitHubRepo=capstone \
  --parameters GitHubBranch=main
```

The pipeline:
- Runs `pnpm -r build` and `pnpm -r test`.
- Deploys the infra stack.
- Builds and publishes `apps/web` to S3 and invalidates CloudFront.

## Documentation

See `docs/architecture.md` for the current architecture summary.
