import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { Auth, Frontend } from '../constructs';
import { DevApi } from '../constructs/dev-api';

export class D2cPlatformDevStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const logisticsTable = new Table(this, 'LogisticsTable', {
      partitionKey: { name: 'customerId', type: AttributeType.STRING },
      sortKey: { name: 'preferenceType', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const clickstreamTable = new Table(this, 'ClickstreamTable', {
      partitionKey: { name: 'sessionId', type: AttributeType.STRING },
      sortKey: { name: 'eventTimestamp', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED,
      timeToLiveAttribute: 'expiresAt',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const auth = new Auth(this, 'Auth');

    const frontend = new Frontend(this, 'Frontend');

    const api = new DevApi(this, 'Api', {
      userPool: auth.userPool,
      logisticsTable,
      clickstreamTable,
    });

    new CfnOutput(this, 'FrontendUrl', {
      value: `https://${frontend.distribution.domainName}`,
    });

    new CfnOutput(this, 'FrontendBucketName', {
      value: frontend.bucket.bucketName,
    });

    new CfnOutput(this, 'FrontendDistributionId', {
      value: frontend.distribution.distributionId,
    });

    new CfnOutput(this, 'ApiUrl', {
      value: api.restApi.url,
    });

    new CfnOutput(this, 'UserPoolId', {
      value: auth.userPool.userPoolId,
    });

    new CfnOutput(this, 'UserPoolClientId', {
      value: auth.userPoolClient.userPoolClientId,
    });
  }
}
