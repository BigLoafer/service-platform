process.env.NODE_ENV = 'production';
const chalk = require('chalk');
const fs = require('fs');
const fetch = require('isomorphic-fetch');
const path = require('path');
// Ensure environment variables are read.
require('dotenv').config({
  // 记得，指定.env文件的目录
  path: '.env',
})

process.on('unhandledRejection', err => {
  throw err;
});

const pid = process.env.SP_ICONFONT_PID;
const remoteServer = process.env.SP_REMOTESERVER;

// 静态资源配置
async function resolveInput() {
  const args = [`${remoteServer}/iconfont-genorator?pid=${pid}`, {
    method: 'GET'
  }];
  const svgJS = await fetch(...args).then(res => res.text());
  console.log(svgJS);
  const svgContent = await fetch(svgJS).then(res => res.text());
  const prodPath = process.env.SP_ICONFONT_PROD_PATH;
  fs.writeFileSync(`${path.resolve(prodPath)}`, svgContent);
  console.log(chalk.green('iconfont-svg.js genorated!'));
}

resolveInput();