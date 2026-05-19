import path from "path";
import { parseTemplate } from "./templates/parser/template.parser.js";
import { validateTemplate } from "./templates/validator/template.validator.js";

const templatePath = path.resolve(
  process.cwd(),
  "src/templates/test-template.yml"
);

const template = parseTemplate(templatePath);

console.log("Parsed template:", JSON.stringify(template, null, 2));

validateTemplate(template);

console.log("Template is valid ✔");