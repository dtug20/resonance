import { FormApi } from "@tanstack/react-form";

const form = new FormApi({
  defaultValues: { text: "" }
});

console.log("isValid exists:", "isValid" in form.state);
console.log("canSubmit exists:", "canSubmit" in form.state);
