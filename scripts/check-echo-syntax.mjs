import fs from "node:fs";
import { parse, tokenizer, tokTypes } from "../node_modules/.pnpm/acorn@8.15.0/node_modules/acorn/dist/acorn.mjs";
import { parse as babelParse } from "../node_modules/.pnpm/@babel+parser@7.28.4/node_modules/@babel/parser/lib/index.js";

const html = fs.readFileSync("client/public/echo.html", "utf8");
const match = html.match(/<script>\s*([\s\S]*?)\s*<\/script>/);

if (!match) throw new Error("未找到内联游戏脚本");

try {
  parse(match[1], { ecmaVersion: "latest", locations: true });
  console.log("echo.html 内联脚本语法有效");
} catch (error) {
  console.error(error.stack || error.message);
  try {
    babelParse(match[1], { sourceType: "script" });
  } catch (babelError) {
    console.error("Babel 诊断:", babelError.message, babelError.loc);
    const errorLine = match[1].split("\n")[babelError.loc.line - 1] || "";
    console.error("错误行片段:", JSON.stringify(errorLine.slice(Math.max(0, babelError.loc.column - 130), babelError.loc.column + 24)));
  }
  const bodyOnly = match[1]
    .replace(/^\s*\(\(\)\s*=>\s*\{/, "")
    .replace(/\}\)\(\);\s*$/, "");
  console.error("主体尾部:", JSON.stringify(bodyOnly.slice(-90)));
  try {
    parse(bodyOnly, { ecmaVersion: "latest", locations: true });
    console.error("IIFE 主体可独立解析：错误位于外层包装。 ");
  } catch (bodyError) {
    console.error("IIFE 主体解析错误:", bodyError.message);
  }
  const functionWrapped = match[1]
    .replace(/^\s*\(\(\)\s*=>\s*\{/, "function echoRuntime() {")
    .replace(/\}\)\(\);\s*$/, "}");
  console.error("函数包装首尾:", JSON.stringify(functionWrapped.slice(0, 34)), JSON.stringify(functionWrapped.slice(-34)));
  try {
    parse(functionWrapped, { ecmaVersion: "latest", locations: true });
    console.error("普通函数包装可解析：错误位于 IIFE 闭合。 ");
  } catch (functionError) {
    console.error("普通函数包装解析错误:", functionError.message);
  }
  const stack = [];
  for (const token of tokenizer(match[1], { ecmaVersion: "latest", locations: true })) {
    if (token.type.label === "${") {
      stack.push({ type: "template-expression", loc: token.loc });
      continue;
    }
    if ([tokTypes.parenL, tokTypes.braceL, tokTypes.bracketL].includes(token.type)) stack.push(token);
    if ([tokTypes.parenR, tokTypes.braceR, tokTypes.bracketR].includes(token.type)) {
      const open = stack.pop();
      if (token.type === tokTypes.braceR && token.loc.start.line >= 658) console.error("结尾花括号闭合:", open && { label: open.type.label, line: open.loc.start.line, column: open.loc.start.column });
      if (token.type === tokTypes.braceR && open?.type === "template-expression") {
        if (token.loc.start.line >= 650) {
          const templateLine = match[1].split("\n")[open.loc.start.line - 1] || "";
          console.error("末尾花括号闭合了模板插值:", open.loc.start, JSON.stringify(templateLine.slice(open.loc.start.column - 12, open.loc.start.column + 80)));
        }
        continue;
      }
      const expected = token.type === tokTypes.parenR ? tokTypes.parenL : token.type === tokTypes.braceR ? tokTypes.braceL : tokTypes.bracketL;
      if (!open || open.type !== expected) {
        console.error("括号类型失配:", { close: token.type.label, line: token.loc.start.line, column: token.loc.start.column, open: open && { label: open.type.label, line: open.loc.start.line, column: open.loc.start.column } });
        break;
      }
    }
  }
  console.error("未闭合栈:", stack.map(token => ({ label: token.type.label, line: token.loc.start.line, column: token.loc.start.column })));
  process.exitCode = 1;
}
