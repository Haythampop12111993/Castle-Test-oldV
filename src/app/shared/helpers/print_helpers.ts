import { environment } from "../../../environments/environment";

export const generate_template = (template, ...args) => {
  return template({ base: environment.baseHREF }, ...args);
};

export const print_template = (template, ...args) => {
  const pageContent = generate_template(template, ...args);

  const newWindow = window.open(
    "#",
    "_blank",
    "top=0,lef=0,height=600,width=1200"
  );
  newWindow.document.open();
  newWindow.document.write(pageContent);
  newWindow.document.close();
  newWindow.addEventListener("load", () => {
    newWindow.print();
    newWindow.close();
  });
  return pageContent;
};
