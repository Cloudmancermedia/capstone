import { CfnParameter, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { LinuxBuildImage } from 'aws-cdk-lib/aws-codebuild';
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

export class D2cPlatformPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const connectionArn = new CfnParameter(this, 'CodeStarConnectionArn', {
      type: 'String',
      description: 'CodeStar connection ARN for GitHub.',
    });

    const repoOwner = this.node.tryGetContext('githubOwner') || 'Cloudmancermedia';
    const repoName = this.node.tryGetContext('githubRepo') || 'capstone';
    const repoBranch = this.node.tryGetContext('githubBranch') || 'main';

    const source = CodePipelineSource.connection(
      `${repoOwner}/${repoName}`,
      repoBranch,
      { connectionArn: connectionArn.valueAsString },
    );

    const artifactBucket = new Bucket(this, 'PipelineArtifactsBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new CodePipeline(this, 'Pipeline', {
      pipelineName: 'D2cPlatformPipeline',
      artifactBucket,
      synth: new ShellStep('Synth', {
        input: source,
        commands: [
          'corepack enable',
          'corepack prepare pnpm@9.15.0 --activate',
          'if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi',
          'pnpm -r build',
          'pnpm -r test',
          'pnpm --filter @d2c-platform/platform cdk synth',
        ],
      }),
      codeBuildDefaults: {
        buildEnvironment: {
          buildImage: LinuxBuildImage.STANDARD_7_0,
        },
      },
    });

    // TODO: Add deployment stages when CodeStar connection is configured
  }
}
