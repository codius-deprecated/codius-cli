# Codius Command-Line Interface (CLI)

## Prerequisites

To use the Codius command-line interface (CLI), you need a recent version of Linux.

### Linux

For the example commands below, we assume you're on Ubuntu 14.04 or later. But most up-to-date Linux distributions should work. We definitely recommend being on the latest stable release though.

If you're on Windows/Mac try installing [Vagrant](https://docs.vagrantup.com/v2/installation/index.html) and then run:

```sh
vagrant init ubuntu/trusty32
vagrant up
vagrant ssh
```

Congratulations, you are running Ubuntu/Linux! Proceed.

### 32-bit libc/libstdc++ (Skip if you're using Vagrant or a 32-bit installation)

On 64-bit systems you need to have the 32-bit versions of libc, libstdc++ and libseccomp installed.

On Ubuntu, run:

``` sh
sudo dpkg --add-architecture i386
sudo apt-get update
sudo apt-get install libc6-i386 lib32stdc++6 libseccomp2:i386
```

### git

Install git by running:

``` sh
sudo apt-get install git
```

### Node.js

Next, you need a recent version of Node.js. All versions of 0.10.x or higher should work.

On Ubuntu, you can install Node.js simply by:

```sh
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
sudo ln -s /usr/bin/nodejs /usr/local/bin/node
```

## Installation

To install Codius command line tools, run:

``` sh
sudo npm install -g codius
```

## Verification

Now let's verify everything installed ok.

``` sh
codius selftest
```

## Getting started

### Hello world

Let's check out an application and run it!

``` sh
git clone https://github.com/codius/example-helloworld codius-example-helloworld
cd codius-example-helloworld
codius run
```

You should see something like:

![](http://i.imgur.com/rXaQMFU.png)


### Applications as servers

Codius applications can expose HTTP APIs, check it out:

``` sh
git clone https://github.com/codius/example-webserver codius-example-webserver
cd codius-example-webserver
codius serve
```

You should see an message like `Localhost server listening on port: 8000` meaning your application is now running at `localhost:8000`. Go ahead and open it in a browser!

### Uploading applications

You can upload contracts to Codius hosts. 

NOTE: Before attempting to upload an application, it is important to first test it with Node and then with Codius using:

``` sh
codius run
```

If your application runs with issues, you are ready to upload!

#### Localhost

First, set yourself up with a local [Codius host](https://www.npmjs.com/package/codius-host) and run:

``` sh
codius-host start
```

Now you can go back to the `codius-example-webserver` folder from the previous example and run `codius upload`:

``` sh
cd codius-example-webserver
codius upload --hosts https://localhost:2633
```

Now your application is running on the Codius host! Go ahead and open its URL in the browser and watch its output in the host's log!

#### Remote hosts

To upload your application to one or more remote Codius hosts, specify the hosts using `--hosts`. Multiple hosts can be listed using commas without spaces:

``` sh
codius upload --hosts https://remote-host-1.com,https://remote-host-2.com
```

#### Using Self-Signed SSL Certificates

If your Codius host is using a self-signed SSL certificate (potentially for development) you will need to
enable tls connections with self-signed certs by setting the `CODIUS_UNAUTHORIZED_SSL` environment variable to true

``` sh
CODIUS_UNAUTHORIZED_SSL=true codius upload --hosts https://self-signed-host.com
```
