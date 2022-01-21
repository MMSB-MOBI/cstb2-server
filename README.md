<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).


# Deploy local version 

## Client and server

Download and init CSTB client and server
```
git clone https://github.com/MMSB-MOBI/cstb2-server
cd cstb2-server
npm i
cd ..
git clone https://github.com/MMSB-MOBI/cstb-client
npm i
```

## Job manager

Clone and init ms-jobmanager
```
git clone https://github.com/MMSB-MOBI/ms-jobmanager.git
cd ms-jobmanager
npm i
```

Launch ms-jobmanager for local computation 
```
node bin/startServer.js -e emulate -p 6000 -k 6001 -c <cache directory> --force
```

Change adress and listening port in config_local.yaml 
```
job-manager:
  address: "localhost"
  port: 6001
```

## Motif-broker
Clone and init motif-broker
```
git clone https://github.com/MMSB-MOBI/motif-broker
cd motif-broker
npm i
```

You need to have a local version of couch database (How to construct it ? https://github.com/MMSB-MOBI/CSTB_database_manager) or redirect the server version : 
```
# Redirect arwen-cdb.ibcp.fr:5984 to localhost:1234
ssh arwen -L 1234:arwen-cdb.ibcp.fr:5984
```

Launch motif-broker
```
node build/index.js -f prefix_rules.json -d http://<user>:<password>@localhost -p 1234 -l 6003
```

Update config_local.yaml 
```
db:
  couchDB:
    connect:
      user: <user>
      password: <password>
      host: 'localhost'
      port: 1234
  
  motif-broker:
    host: 'localhost'
    port: 6003
```


## Environments and tools

### crispr-set

Install crispr-set 
```
git clone https://github.com/glaunay/crispr-set
python setup.py build
ln -s build/lib.linux-x86_64-3.7/*so twobits.so
gcc -Wall -std=c99 main.c custom_*.c two_bits_encoding.c -I./include -o setCompare -pedantic -lm
```

Change $PATH variable to include setCompare binary in crispr_workflow_local.sh and crispr_workflow_specific_local.sh
```bash
export PATH=$PATH:<crispr-set path>
```

### CSTB scripts 

Create python3 venv to install pip dependencies
```
python -m venv cstb_env
source cstb/bin/activate
cd cstb_env
git clone https://github.com/MMSB-MOBI/CSTB
cd CSTB
pip install -r requirements.txt
```

Load env and include CSTB module in PYTHONPATH in crispr_workflow_local.sh and crispr_workflow_specific_local.sh
```vasg
source <csbt_env_path>/bin/activate
CRISPR_TOOLS_SCRIPT_PATH=<csbt_env_path>/CSTB/bin
export PYTHONPATH=<csbt_env_path>/CSTB/lib
```

### Blast
Blast is only used for specific gene part. 

If you already have blast installed or if you want a global version you can install it on your computer and be sure the binaries are in your PATH or include them through `export PATH` in crispr_workflow_specific_local.sh

As an alternative you can also create a conda environment and install blast inside it :
```
conda create -n blast
conda activate blast
conda install -c bioconda blast
```

Then load env in crispr_workflow_specific_local.sh : 
```bash
source <miniconda/anaconda path>/etc/profile.d/conda.sh #needed to call conda activate inside bash script
conda activate blast
```

You may need to change other parameters such as filesystem database in config_local.yaml

## Start the dev server
Be sure config_local.yaml is load in src/config/configuration.ts 
```ts
const YAML_CONFIG_FILENAME = 'config_local.yaml';
```

Launch server in watch mode: 
```
cd <cstb2-server path>
npm run start:dev
```

Launch client
```
cd <cstb-client path>
npm run serve
```





