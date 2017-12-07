var chalk = require('chalk');

module.exports = {
  "helpers": {
    "if_or": function (v1, v2, options) {
      if (v1 || v2) {
        return options.fn(this);
      }

      return options.inverse(this);
    },
    "if_and": function (v1, v2, options) {
      if (v1 && v2) {
        return options.fn(this);
      }

      return options.inverse(this);
    },
    "if_eq_or": function (k, v1, v2, options) {
      if (k === v1 || k === v2) {
        return options.fn(this);
      }

      return options.inverse(this);
    },
  },
  "prompts": {
    "beforeStart": {
      "type": "confirm",
      "message": function () {
        var stdout = "\n";
        var strTmpx = "";

        strTmpx = "   ----------------- Boilerplate Introduction -----------------   \n";
        stdout += chalk.bgWhite(chalk.magenta(strTmpx));
        stdout += " 1. 本配置引导程序所用样板文件基于 vuejs-templates/webpack 二次开发\n";
        stdout += " 2. 项目通过 ESLint 采用 Airbnb Specification 规范代码风格\n";
        strTmpx = "    请自行查阅规范说明：https://github.com/airbnb/javascript\n"
        stdout += chalk.gray(strTmpx);
        stdout += " 3. 项目 CSS 预处理器采用 Less(兼容原生 CSS)\n";
        stdout += "   ------------------------------------------------------------\n\n";
        stdout += chalk.green(">") + " 按回车开始配置项目\n";
        strTmpx = "  若想终止项目配置引导程序，请按 ctrl/cmd + c\n ";
        stdout += chalk.gray(strTmpx);

        return stdout;
      },
    },
    "name": {
      "type": "string",
      "required": true,
      "message": "项目名称:",
    },
    "description": {
      "type": "string",
      "required": false,
      "message": "项目描述:",
      "default": "A Vue.js project"
    },
    "sysName": {
      "type": "string",
      "required": true,
      "message": "系统名称:",
      "validate": function (val) {
        if (!val) return '(✘) 请输入系统名称，该名称将设为 index.html 的 title';
        return true;
      },
    },
    "author": {
      "type": "string",
      "message": "作者:"
    },
    // 安装 vue-router 依赖、初始化 router 结构、最后注入到全局
    "router": {
      "type": "confirm",
      "message": "是否安装 vue-router?"
    },
    // 安装 Vuex 依赖、初始化 store 结构、最后注入到全局
    "vuex": {
      "type": "confirm",
      "message": "是否使用 Vuex 进行状态管理?"
    },
    // 非后台系统也可能使用到 Element，单独询问
    "projType": {
      "type": "list",
      "message": "请选择系统类型:",
      "choices": [
        {
          "name": "● Homed 后台管理系统",
          "value": "homedAdmin",
          "short": "homedAdmin",
        },
        {
          "name": "● Homed 前台站点",
          "value": "homedSite",
          "short": "homedSite",
        },
        {
          "name": "● 其他后台管理系统",
          "value": "otherAdmin",
          "short": "otherAdmin",
        },
        {
          "name": "● 其他前台站点",
          "value": "otherSite",
          "short": "otherSite",
        },
      ]
    },
    // 非后台系统也可能使用到 Element，单独询问
    "element": {
      "when": "projType === 'homedSite' || projType === 'otherSite'",
      "type": "confirm",
      "message": "是否安装 Element UI 库?"
    },
    // 询问用户设置开发 TOKEN
    "token": {
      "when": "projType !== 'homedSite' && projType !== 'otherSite'",
      "type": "string",
      "message": "请输入开发模式下使用的 TOKEN:",
      "default": "TOKEN3090"
    },
    // 当项目为 Homed 后台系统时，
    // 尝试让用户设置系统 ID
    "sysId": {
      "when": "projType === 'homedAdmin'",
      "type": "string",
      "message": "请输入 Homed 后台 System ID:",
      "validate": function (val) {
        if (val === "" || /^\d+$/.test(val)) return true;
        return `(✘) 系统 ID 应为一个整数，如暂未分配请留空`;
      },
      "default": "",
    },
    "mock": {
      "type": "confirm",
      "message": "是否 mock 【开发模式】下的接口数据?"
    },
    "unit": {
      "type": "confirm",
      "message": "是否安装 Karma + Mocha 单元测试工具?"
    },
    "e2e": {
      "type": "confirm",
      "message": "是否安装端对端测试工具 Nightwatch?"
    }
  },
  "filters": {
    "project/config/test.env.js": "unit || e2e",
    "project/test/unit/**/*": "unit",
    "project/build/webpack.test.conf.js": "unit",
    "project/test/e2e/**/*": "e2e",
    "project/src/store/**/*": "vuex",
    "project/plugin/logger.js": "vuex",
    "project/src/router/**/*": "router"
  },
  "completeMessage": `${chalk.bgWhite(chalk.magenta('------------------- Configuration Summary ------------------'))}
● 项目名称    ${chalk.green('{{name}}')}
● 项目描述    ${chalk.green('{{description}}')}
● 系统名称    ${chalk.green('{{sysName}}')}
● 系统类型    ${chalk.green('{{projType}}')}
● 作　　者    ${chalk.green('{{author}}')}{{#if_eq_or projType 'homedAdmin' 'ohterAdmin'}}
● TOKEN      ${chalk.green('{{token}}')}{{else}}{{#requireAuth}}
● TOKEN      ${chalk.green('{{token}}')}{{/requireAuth}}{{/if_eq_or}}{{#if_eq projType 'homedAdmin'}}
● System ID  {{#if_eq sysId ''}}${chalk.red('✘')} ${chalk.gray('暂未分配, 配置文件: project/src/config/sys.js')}{{else}}${chalk.green('{{sysId}}')}{{/if_eq}}{{/if_eq}}{{#if_eq_or projType 'homedSite' 'otherSite'}}
● Element UI {{#element}}${chalk.green('✔')} ${chalk.gray('已启用 Element UI')}{{else}}${chalk.red('✘')} ${chalk.gray('未启用 Element UI')}{{/element}}{{/if_eq_or}}
● vue-router {{#router}}${chalk.green('✔')} ${chalk.gray('已启用前端路由, 配置目录: project/src/router/')}{{else}}${chalk.red('✘')} ${chalk.gray('未启用前端路由')}{{/router}}
● vuex       {{#vuex}}${chalk.green('✔')} ${chalk.gray('已启用状态管理, 配置目录: project/src/store/')}{{else}}${chalk.red('✘')} ${chalk.gray('未启用状态管理')}{{/vuex}}
● mock       {{#mock}}${chalk.green('✔')} ${chalk.gray('已启用数据拦截模拟, 配置目录: project/src/mock/')}{{else}}${chalk.red('✘')} ${chalk.gray('未启用数据拦截模拟')}{{/mock}}
● unit       {{#unit}}${chalk.green('✔')} ${chalk.gray('已启用单元测试, 配置目录: project/test/unit/')}{{else}}${chalk.red('✘')} ${chalk.gray('未启用单元测试')}{{/unit}}
● e2e        {{#e2e}}${chalk.green('✔')} ${chalk.gray('已启用端到端测试, 配置目录: project/test/e2e/')}{{else}}${chalk.red('✘')} ${chalk.gray('未启用端到端测试')}{{/e2e}}
------------------------------------------------------------

请运行以下命令开始项目:
  {{^inPlace}}${chalk.yellow('cd')} {{destDirName}}/project
  {{/inPlace}}${chalk.yellow('npm')} install
  ${chalk.yellow('npm')} run dev`,
};
