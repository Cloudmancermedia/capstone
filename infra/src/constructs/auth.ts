import { RemovalPolicy } from 'aws-cdk-lib';
import { AccountRecovery, Mfa, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class Auth extends Construct {
  public readonly userPool: UserPool;
  public readonly userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.userPool = new UserPool(this, 'CustomerUserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      mfa: Mfa.OPTIONAL,
      passwordPolicy: {
        minLength: 12,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    this.userPoolClient = this.userPool.addClient('CustomerAppClient', {
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      preventUserExistenceErrors: true,
    });
  }
}
