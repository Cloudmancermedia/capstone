import { CfnWebACL } from 'aws-cdk-lib/aws-wafv2';
import { Construct } from 'constructs';

export class Waf extends Construct {
  public readonly cloudfrontWebAclArn: string;
  public readonly apiWebAclArn: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const cloudfrontWebAcl = new CfnWebACL(this, 'CloudFrontWebAcl', {
      scope: 'CLOUDFRONT',
      defaultAction: { allow: {} },
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: 'CloudFrontWebAcl',
        sampledRequestsEnabled: true,
      },
      rules: this.managedWafRules('CloudFront'),
    });

    const apiWebAcl = new CfnWebACL(this, 'ApiWebAcl', {
      scope: 'REGIONAL',
      defaultAction: { allow: {} },
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: 'ApiWebAcl',
        sampledRequestsEnabled: true,
      },
      rules: this.managedWafRules('Api'),
    });

    this.cloudfrontWebAclArn = cloudfrontWebAcl.attrArn;
    this.apiWebAclArn = apiWebAcl.attrArn;
  }

  private managedWafRules(prefix: string): CfnWebACL.RuleProperty[] {
    return [
      {
        name: 'AWSManagedRulesCommonRuleSet',
        priority: 0,
        statement: {
          managedRuleGroupStatement: {
            vendorName: 'AWS',
            name: 'AWSManagedRulesCommonRuleSet',
          },
        },
        overrideAction: { none: {} },
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: `${prefix}CommonRuleSet`,
          sampledRequestsEnabled: true,
        },
      },
      {
        name: 'AWSManagedRulesKnownBadInputsRuleSet',
        priority: 1,
        statement: {
          managedRuleGroupStatement: {
            vendorName: 'AWS',
            name: 'AWSManagedRulesKnownBadInputsRuleSet',
          },
        },
        overrideAction: { none: {} },
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: `${prefix}KnownBadInputs`,
          sampledRequestsEnabled: true,
        },
      },
      {
        name: 'AWSManagedRulesAmazonIpReputationList',
        priority: 2,
        statement: {
          managedRuleGroupStatement: {
            vendorName: 'AWS',
            name: 'AWSManagedRulesAmazonIpReputationList',
          },
        },
        overrideAction: { none: {} },
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: `${prefix}IpReputation`,
          sampledRequestsEnabled: true,
        },
      },
      {
        name: 'AWSManagedRulesSQLiRuleSet',
        priority: 3,
        statement: {
          managedRuleGroupStatement: {
            vendorName: 'AWS',
            name: 'AWSManagedRulesSQLiRuleSet',
          },
        },
        overrideAction: { none: {} },
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: `${prefix}SqlInjection`,
          sampledRequestsEnabled: true,
        },
      },
    ];
  }
}
