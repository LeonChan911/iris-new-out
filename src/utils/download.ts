/*
 * @Author: your name
 * @Date: 2022-04-26 09:25:40
 * @LastEditTime: 2022-04-26 16:25:38
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /iris-new/src/utils/download.ts
 */
// import originDownload from 'download-git-repo';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
// import { promisify } from 'util';
import { runCommand } from '../utils';

// const download = promisify(originDownload);

/**
 * 下载远程模板
 * @param templateSourceURL 模板源 npm地址
 * @param target  存放模板临时文件夹的地方
 * @param useTemplateBranch   从模板分支下载
 */
export default function (templateName: string, target: string = '.') {
  const downloadTempPath = path.join(target, '.download-temp');
  fs.mkdir(downloadTempPath);
  fs.writeFileSync(
    path.join(downloadTempPath, 'package.json'),
    Buffer.from(
      JSON.stringify({
        name: 'temp',
        version: '1.0.0',
        main: 'index.js',
        license: 'MIT',
        dependencies: {
        }
      })
    )
  );

  const spinner = ora(`正在下载项目模板：${templateName}`);
  spinner.start();
  return runCommand(`yarn`, ['add', `${templateName}@latest`], { cwd: downloadTempPath })
    .then(() => {
      spinner.succeed();
      return path.join(downloadTempPath, `/node_modules/${templateName}`);
    })
    .catch((error: Error) => {
      spinner.fail();
      return Promise.reject(error);
    });
  // return download(
  //   `direct:${templateSourceURL}${useTemplateBranch ? '#template' : ''}`,
  //   downloadTempPath,
  //   { clone: true }
  // )
  //   .then(() => {
  //     spinner.succeed();
  //     return downloadTempPath;
  //   })
  //   .catch((error: Error) => {
  //     spinner.fail();
  //     return Promise.reject(error);
  //   });
}
