#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { D2cPlatformPipelineStack } from '../src/stacks';

const app = new App();

new D2cPlatformPipelineStack(app, 'D2cPlatformPipelineStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
