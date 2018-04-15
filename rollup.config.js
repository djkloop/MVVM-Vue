/*
 * @moduleName: GoodVue
 * @Desc: 纯粹是为了学习VueJS
 * @Author: djkloop
 * @Date: 2018-04-15 14:22:14
 * @Last Modified by: djkloop
 * @Last Modified time: 2018-04-15 15:50:05
 */
// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import pkg from './package.json';
import moment from 'moment';
import babel from 'rollup-plugin-babel';

const now = moment().format("YYYY-MM-DD HH:mm:ss");
const banner = `/*
  ${pkg.name}.js v${pkg.version}
  Created Date ${`2018-04-15 14:22:14`}
  Last Modified ${now}
  当前DEMO - 纯粹是为了学习VueJS.
  Released under the MIT License.
*/`;

function resolveTypescript() {
  return {
    name: 'resolve-typescript',
    resolveId(importee, importer) {
      if(importer && (importer.startsWith(src) || importer.startsWith(bin)) && importee[0] === '.' && path.extname(importee) === '') {
        return path.resolve(path.dirname(importer), `${importee}.ts`);
      }
    }
  };
}
export default {
  input: 'src/js-vue/index.js',
  output: [{
    file: 'dist/vue.browser.js',
    format: 'umd',
    name: 'GoodVue',
    sourcemap: false,
    banner
  }],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    resolve({ browser: true }),
    commonjs()
  ]
};