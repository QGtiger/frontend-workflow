import type { FlowNodeType } from "@flowgram.ai/fixed-layout-editor";
import type { SchemaFormItemType } from "@server/shared/schemaFormType";

export function getBuiltInRegistryInputsSchema(
  type: FlowNodeType,
): SchemaFormItemType[] {
  // TODO
  if (type === "end") {
    return [
      {
        code: "response",
        name: "返回结果",
        description: "配置数据，将作为工作流运行结果返回",
        type: "string",
        editor: {
          kind: "input",
          config: {
            placeholder: "请输入返回结果",
          },
        },
        editorType: "expression",
      },
    ];
  } else if (type === "case" || type === "catchBlock" || type === "if") {
    return [
      {
        code: "condition",
        name: "条件",
        description: "请输入条件表达式",
        type: "string",
        required: true,
        editor: {
          kind: "input",
          config: {
            placeholder: "请输入条件",
          },
        },
        editorType: "expression",
      },
    ];
    // 太麻烦了，就简单点一个表达式就好了
    // return [
    //   {
    //     code: "condition",
    //     name: "条件",
    //     description: "条件判断，外层为或，内层为且",
    //     type: "array",
    //     editor: {
    //       kind: "arrayEditor",
    //       config: {
    //         item: {
    //           code: "or",
    //           name: "或条件",
    //           type: "array",
    //           editor: {
    //             kind: "arrayEditor",
    //             config: {
    //               item: {
    //                 code: "and",
    //                 name: "",
    //                 type: "object",
    //                 editor: {
    //                   kind: "objectEditor",
    //                   config: {
    //                     isDynamic: false,
    //                     depItems: [],
    //                     properties: [
    //                       {
    //                         code: "lexp",
    //                         name: "左表达式",
    //                         type: "string",
    //                         editor: {
    //                           kind: "input",
    //                           config: {
    //                             placeholder: "请输入左表达式",
    //                           },
    //                         },
    //                       },
    //                       {
    //                         code: "operator",
    //                         name: "运算符",
    //                         type: "string",
    //                         editor: {
    //                           kind: "select",
    //                           config: {
    //                             isDynamic: false,
    //                             depItems: [],
    //                             options: [
    //                               {
    //                                 value: "==",
    //                                 label: "等于",
    //                               },
    //                               {
    //                                 value: "!=",
    //                                 label: "不等于",
    //                               },
    //                               {
    //                                 value: ">",
    //                                 label: "大于",
    //                               },
    //                             ],
    //                           },
    //                         },
    //                       },
    //                       {
    //                         code: "rexp",
    //                         name: "右表达式",
    //                         type: "string",
    //                         editor: {
    //                           kind: "input",
    //                           config: {
    //                             placeholder: "请输入右表达式",
    //                           },
    //                         },
    //                       },
    //                     ],
    //                   },
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // ];
  } else if (type === "loop") {
    return [
      {
        code: "loopItems",
        name: "循环项",
        description: "请输入循环项,必须是一个可迭代对象",
        type: "string",
        editor: {
          kind: "input",
          config: {
            placeholder: "请输入循环项",
          },
        },
        editorType: "expression",
      },
    ];
  }
  return [];
}
