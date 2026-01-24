import {
  GatewayVpcEndpointAwsService,
  InterfaceVpcEndpointAwsService,
  SecurityGroup,
  SubnetType,
  Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface NetworkingProps {
  readonly maxAzs?: number;
  readonly natGateways?: number;
}

export class Networking extends Construct {
  public readonly vpc: Vpc;
  public readonly lambdaSecurityGroup: SecurityGroup;
  public readonly databaseSecurityGroup: SecurityGroup;
  public readonly opensearchSecurityGroup: SecurityGroup;

  constructor(scope: Construct, id: string, props: NetworkingProps = {}) {
    super(scope, id);

    this.vpc = new Vpc(this, 'Vpc', {
      maxAzs: props.maxAzs ?? 2,
      natGateways: props.natGateways ?? 1,
      subnetConfiguration: [
        { name: 'public', subnetType: SubnetType.PUBLIC },
        { name: 'private', subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      ],
    });

    this.addVpcEndpoints();
    this.lambdaSecurityGroup = new SecurityGroup(this, 'LambdaSg', {
      vpc: this.vpc,
      description: 'Lambda access to backend services.',
      allowAllOutbound: true,
    });
    this.databaseSecurityGroup = new SecurityGroup(this, 'DatabaseSg', {
      vpc: this.vpc,
      description: 'Inventory database security group.',
      allowAllOutbound: false,
    });
    this.opensearchSecurityGroup = new SecurityGroup(this, 'OpenSearchSg', {
      vpc: this.vpc,
      description: 'OpenSearch security group.',
      allowAllOutbound: false,
    });
  }

  private addVpcEndpoints(): void {
    this.vpc.addGatewayEndpoint('DynamoDbEndpoint', {
      service: GatewayVpcEndpointAwsService.DYNAMODB,
    });
    this.vpc.addGatewayEndpoint('S3Endpoint', {
      service: GatewayVpcEndpointAwsService.S3,
    });
    this.vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
      service: InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
    });
  }
}
