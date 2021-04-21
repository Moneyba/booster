## Booster examples

You can find some example apps in the [examples directory](https://github.com/boostercloud/booster/tree/main/docs/examples) and in this [repository](https://github.com/boostercloud/examples).

## Framework Core

The `framework-core` package includes the most important components of the framework abstraction. It can be seen as skeleton or the main architecture of the framework.

The package defines the specification of how should a Booster application work without taking into account the specific providers that could be used. Every Booster provider package is based on the components that the framework core needs in order to work on the platform.

## Framework Types

The `framework-types` packages includes the types that define the domain of the Booster framework. It defines domain concepts like an `Event`, a `Command` or a `Role`.

## Framework integration tests

Booster framework integration tests package is used to test the Booster project itself, but it is also an example of how a Booster application could be tested. We encourage developers to have a look at our [Booster project repository](https://github.com/boostercloud/booster/tree/main/packages/framework-integration-tests).

Some integration tests highly depend on the provider chosen for the project, and the infrastructure is normally deployed locally or in the cloud right before the tests run. Once tests are completed, the application is teared down.

There are several types of integration tests in this package:

- Tests to ensure that different packages integrate as expected with each other.
- Tests to ensure that a Booster application behaves as expected when it is hit by a client (a GraphQL client).
- Tests to ensure that the application behaves in the same way no matter what provider is selected.

If you are curious about the framework providers, you will be able to read more about them in the following section.

## Providers

The providers are different implementations of the Booster runtime to allow Booster applications run on different cloud providers or services. They all implement the same interface, and the main idea behind the providers is that no matter what the developer chooses as backend, they won't need to know anything about the underlying infrastructure.

Currently, the Booster framework provides a fully working provider package:

-  **framework-provider-aws-\***

Other providers packages are currently under development. Some of the features might be missing:

-  **framework-provider-local-\***. The Booster framework local provider combines in-memory databases with a GraphQL API served through a Node.js Express Server. The local runtime is a convenient and fast way to deploy and test your code in a local development environment. From the API and semantic perspectives, there are no differences from using a real cloud provider, it just runs locally!
- **framework-provider-kubernetes-\***
- **framework-provider-azure-\***

## Configuration and environments

Booster uses sensible defaults, convention over configuration, and code inference to reduce dramatically the amount of configuration needed. However, there are some aspects that can't be inferred (like the application name) or the provider library used for each [environment](#environments).

### Booster configuration

You configure your application by calling the `Booster.configure()` method. There are no restrictions about where you should do this call, but the convention is to do it in your configuration files located in the `src/config` folder. This folder will get automatically generated for you after running the `boost new:project <project-name>` CLI command.

This is an example of a possible configuration:

```typescript
import { Booster } from '@boostercloud/framework-core'
import { BoosterConfig } from '@boostercloud/framework-types'
import * as AWS from '@boostercloud/framework-provider-aws'

Booster.configure('pre-production', (config: BoosterConfig): void => {
  config.appName = 'my-app-name'
  config.provider = AWS.Provider
})
```

The following is the list of the fields you can configure:

- **appName:** This is the name that identifies your application. It will be used for many things, such us prefixing the resources created by the provider. There are certain restrictions regarding the characters you can use: all of them must be lower-cased and can't contain spaces. Two apps with different names are completely independent.

- **provider:** This field contains the provider library instance that Booster will use when deploying or running your application.

> **Note:** So far, there is only one provider fully supported in Booster yet, @boostercloud/framework-provider-aws, and it is probably the one you have already set if you used the generator to create your project. The team is currently working on providers for local development, Azure, and Kubernetes._

- **assets**: This is an array of _relative_ paths from the root of the project pointing to files and folders with static assets. They will be included among the deployed files to the cloud provider.
  For example, imagine you are using the `dotenv` module so that all the environment variables you have in your `.env` files are loaded into memory in runtime. In order for this to work, you need to include your `.env` files as assets of your project, so that they are included when deploying. Assuming you only have a `.env` file in the root of your project, you should add the following to your configuration:
  ```typescript
  config.assets = ['.env']
  ```

### Environments

You can create multiple environments calling the `Booster.configure` function several times using different environment names as the first argument. You can create one file for each environment, but it is not required. In this example we set all environments in a single file:

```typescript
// Here we use a single file called src/config.ts, but you can use separate files for each environment too.
import { Booster } from '@boostercloud/framework-core'
import { BoosterConfig } from '@boostercloud/framework-types'
// A provider that deploys your app to AWS:
import * as AWS from '@boostercloud/framework-provider-aws'
// A provider that deploys your app locally:
import * as Local from '@boostercloud/framework-provider-local'

Booster.configure('dev', (config: BoosterConfig): void => {
  config.appName = 'fruit-store-dev'
  config.provider = Local.Provider
})

Booster.configure('stage', (config: BoosterConfig): void => {
  config.appName = 'fruit-store-stage'
  config.provider = AWS.Provider
})

Booster.configure('prod', (config: BoosterConfig): void => {
  config.appName = 'fruit-store-prod'
  config.provider = AWS.Provider
})
```

It is also possible to place an environment configuration in a separated file. Let's say that a developer called "John" created its own configuration file `src/config/john.ts`. The content would be the following:

```typescript
import { Booster } from '@boostercloud/framework-core'
import { BoosterConfig } from '@boostercloud/framework-types'
import * as AWS from '@boostercloud/framework-provider-aws'

Booster.configure('john', (config: BoosterConfig): void => {
  config.appName = 'john-fruit-store'
  config.provider = AWS.Provider
})
```

The environment name will be required by any command from the Booster CLI that depends on the provider. For instance, when you deploy your application, you'll need to specify on which environment you want to deploy it:

```sh
boost deploy -e prod
```

This way, you can have different configurations depending on your needs.

Booster environments are extremely flexible. As shown in the first example, your 'fruit-store' app can have three team-wide environments: 'dev', 'stage', and 'prod', each of them with different app names or providers, that are deployed by your CI/CD processes. Developers, like "John" in the second example, can create their own private environments in separate config files to test their changes in realistic environments before committing them. Likewise, CI/CD processes could generate separate production-like environments to test different branches to perform QA in separate environments without interferences from other features under test.

The only thing you need to do to deploy a whole new completely-independent copy of your application is to use a different name. Also, Booster uses the credentials available in the machine (`~/.aws/credentials` in AWS) that performs the deployment process, so developers can even work on separate accounts than production or staging environments.

## Extending Booster with Rockets!

You can extend Booster by creating rockets. A rocket is just a node package that implements the public Booster rocket interfaces. You can use them for many things:

1. Extend your infrastructure (Currently, only in AWS): You can write a rocket that adds provider resources to your application stack.
2. Runtime extensions (Not yet implemented): Add new annotations and interfaces, which combined with infrastructure extensions, could implement new abstractions on top of highly requested use cases.
3. Deploy and init hooks (Not yet implemented): Run custom scripts before or after deployment, or before a Booster application is loaded.

This extension mechanism is very new, but we're planning to port most of the functionality as rockets. This has two benefits:

- Composability: You can use the default rockets or configure your application to suit your needs without adding anything extra.
- Easier to manage feature sets in different providers: It would be really hard for the core team and contributors to implement and test every new feature in every supported provider, so by providing functionality like rockets, you'll have access to the most advanced features for your provider faster, and the rockets library can be built on-demand for each provider.

### Create your own Rocket

> Currently, only available to extend your Booster infrastructure with AWS

To create a rocket that adds new functionality to your Booster app, you just need to create a npm package and add the characteristics your provider needs. For AWS, that's just a main class that contains two functions, `mountStack` and `unmountStack`. *Don't worry about them for now, we'll get to this shortly.*

*Infrastructure Rocket* interfaces are provider-dependant, so *Infrastructure Rockets* must import the corresponding booster infrastructure package for their chosen provider. For AWS, that's `@boostercloud/framework-provider-aws-infrastructure`. Notice that, as the only thing we use of that package is the `InfrastructureRocket` interface, you can import it as a dev dependency to avoid including that big package in your deployed lambdas.

So let's start by creating a new package and adding this dependency:

```sh
mkdir rocket-your-rocket-name-aws-infrastructure
cd rocket-your-rocket-name-aws-infrastructure
npm init
...
npm install --save @boostercloud/framework-provider-aws-infrastructure
```

The schema of an *Infrastructure Rocket* project should look something like this:

```text
rocket-your-rocket-name-aws-infrastructure
├── package.json
├── src
    ├── lambdas
    ├── index.ts
    └── your-main-class.ts

```

In `<your-main-class>.ts` is where you define the two functions that AWS requires:

```typescript
export class YourMainClass {
  public static mountStack(params: YourRocketParams, stack: Stack, config: BoosterConfig): void {
    /* CDK code to expand your Booster infrastructure */
  }
  public static unmountStack?(params: YourRocketParams, utils: RocketUtils): void {
    /* Optional code that runs before removing the stack */
  }
}
```

Let's look in more detail these two special functions:

- **mountStack**: This function will run when you deploy your Booster application. Here you can use the [CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html) code you need to extend the Booster functionality as you like. As we can see, it receives three params:
    - `params`: The parameters required by your *Infrastructure Rocket* initializator, you will receive them from your Booster app's `config.ts` file.
    - `stack`: An initialized AWS CDK stack that you can use to add new resources. Check out [the Stack API in the official CDK documentation](https://docs.aws.amazon.com/cdk/latest/guide/stacks.html#stack_api). This is the same stack instance that Booster uses to deploy its resources, so your resources will automatically be deployed along with the Booster's ones on the same stack.
    - `config`: It includes properties of the Booster project that is about to be deployed.


- **unmountStack**: It will run when you run the `boost nuke` command. When you nuke your Booster application, all the resources added by your rocket are automatically destroyed along with the application stack, but there are some situations on which it's convenient to delete or move the contents of the resources created by your Rocket. In the `unmountStack` function you'll have the opportunity to run any code before deleting the stack. This function receives an utils object with the same tools that Booster uses to perform common actions like emptying the contents of an S3 bucket (Non-empty buckets are kept by default when a stack is deleted).

Going back to the schema, as you can guess, we can use the `lambdas` file to storage all the lambdas your Rocket needs, and we can use `index.ts` to export these two AWS functions:

```typescript
export interface InfrastructureRocket {
  mountStack: (stack: Stack, config: BoosterConfig) => void
  unmountStack?: (utils: RocketUtils) => void
}
```

You'll have to implement a default exported function that accepts a parameters object and returns an initialized `InfrastructureRocket` object:

```typescript
const YourRocketInitializator = (params: YourRocketParams): InfrastructureRocket => ({
  mountStack: SomePrivateObject.mountStack.bind(null, params),
  unmountStack: SomePrivateObject.unmountStack.bind(null, params),
})

export default YourRocketInitializator
```

Notice that *Infrastructure Rockets* should not be included in the Booster application code to avoid including the CDK and other unused dependencies in the lambdas, as there are some strict restrictions on code size on most platforms. That's why *Infrastructure Rockets* are dynamically loaded by Booster passing the package names as strings in the application config file:

_src/config/production.ts:_

```typescript
Booster.configure('development', (config: BoosterConfig): void => {
  config.appName = 'my-store'
  config.provider = AWSProvider([
    {
      packageName: 'rocket-your-rocket-name-aws-infrastructure', // The name of your infrastructure rocket package
      parameters: {
        // An arbitrary object with the parameters required by your infrastructure rocket initializator
        hello: 'world',
      },
    },
  ])
})
```

### Naming recommendations

There are no restrictions on how you name your rocket packages, but we propose the following naming convention to make it easier to find your extensions in the vast npm library and find related packages (code and infrastructure extensions cannot be distributed in the same package).

- `rocket-{rocket-name}-{provider}`: A rocket that adds runtime functionality or init scripts. This code will be deployed along with your application code to the lambdas.
- `rocket-{rocket-name}-{provider}-infrastructure`: A rocket that provides infrastructure extensions or implements deploy hooks. This code will only be used on developer's or CI/CD systems machines and won't be deployed to lambda with the rest of the application code.

Notice that some functionalities, for instance an S3 uploader, might require both runtime and infrastructure extensions. In these cases, the convention is to use the same name `rocket-name` and add the suffix `-infrastructure` to the infrastructure rocket. It's recommended, but not required, to manage these dependent packages in a monorepo and ensure that the versions match on each release.

If you want to support the same functionality in several providers, it could be handy to also have a package named `rocket-{rocket-name}-{provider}-core` where you can have cross-provider code that you can use from all the provider-specific implementations. For instance, a file uploader rocket that supports both AWS and Azure could have an structure like this:

- `rocket-file-uploader-core`: Defines abstract decorators and interfaces to handle uploaded files.
- `rocket-file-uploader-aws`: Implements the API calls to S3 to get the uploaded files.
- `rocket-file-uploader-aws-infrastructure`: Adds a dedicated S3 bucket.
- `rocket-file-uploader-azure`: Implements the API calls to Azure Storage to get the uploaded files.
- `rocket-file-uploader-azure-infrastructure`: Configures file storage.

### Booster Rockets list

Here you can check out the official Booster Rockets developed at this time:

- [Authentication Booster Rocket for AWS](https://github.com/boostercloud/rocket-auth-aws-infrastructure)
- [Backup Booster Rocket for AWS](https://github.com/boostercloud/rocket-backup-aws-infrastructure)
- [Static Sites Booster Rocket for AWS](https://github.com/boostercloud/rocket-static-sites-aws-infrastructure)

## Frequently Asked Questions

**1.- When deploying my application in AWS for the first time, I got an error saying _"StagingBucket <your app name>-toolkit-bucket already exists"_**

When you deploy a Booster application to AWS, an S3 bucket needs to be created to upload the application code. Booster names that bucket using your application name as a prefix. In AWS, bucket names must be unique _globally_, so if there is another bucket in the world with exactly the same name as the one generated for your application, you will get this error.

The solution is to **change your application name in the configuration file so that the bucket name is unique.**

