import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { D2cPlatformDevStack } from '@d2c-platform/infra';

export interface D2cPlatformStageProps extends StageProps {
  readonly stackName?: string;
}

export class D2cPlatformStage extends Stage {
  public readonly platformStack: D2cPlatformDevStack;

  constructor(scope: Construct, id: string, props: D2cPlatformStageProps = {}) {
    super(scope, id, props);

    this.platformStack = new D2cPlatformDevStack(this, props.stackName ?? 'D2cPlatformDevStack', {
      env: props.env,
    });
  }
}
