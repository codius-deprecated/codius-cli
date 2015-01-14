# Codius Command-Line Interface (CLI)

## Installation

On 64-bit systems you need to have 32-bit libc, libstdc++ and libseccomp installed. On Ubuntu, run:

``` sh
sudo dpkg --add-architecture i386
sudo apt-get install libc6-i386 lib32stdc++6 libseccomp2:i386
```

To install Codius command line tools, run:

``` sh
sudo npm install -g codius
```

## Getting started

### Hello world

Let's check out a contract and run it!

``` sh
git clone https://github.com/codius/example-helloworld codius-example-helloworld
cd codius-example-helloworld
codius run
```

You should see something like:

![](http://i.imgur.com/rXaQMFU.png)


### Contracts are servers

Contracts can expose HTTP APIs, check it out:

``` sh
git clone https://github.com/codius/example-webserver codius-example-webserver
cd codius-example-webserver
codius serve
```

Your contract is now running at `localhost:2634`. Go ahead and open it in a browser!

### Uploading contracts

**Warning, this functionality is still heavily under development.**

You can upload contracts to Codius hosts. First, let's set up a local Codius host:

``` sh
git clone https://github.com/codius/codius-host
cd codius-host
npm install
node app
```

Now you can go back to the `codius-example-webserver` folder from the previous example.

To upload your contract, run `codius upload`.

``` sh
cd codius-example-webserver
codius upload
```

Now your contract is running on the Codius host! Go ahead and open its URL in the browser and watch its output in the host's log!

**Using Self-Signed SSL Certificates**

If your Codius Host is using a self-signed SSL certificate (potentially for development) you will need to
enable tls connections with self-signed certs by setting the `CODIUS_UNAUTHORIZED_SSL` environment variable to true

``` sh
CODIUS_UNAUTHORIZED_SSL=true codius upload
```
