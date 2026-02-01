// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  // api_base_url: "https://new.systemapi.cred-eg.com/public/api/",
  // api_raw_base_url: "https://new.systemapi.cred-eg.com/public/",

  api_base_url: "https://new-cred-api.st.fabrica.com.eg/api/",
  api_raw_base_url: "https://new-cred-api.st.fabrica.com.eg/",
  baseHREF: "/",
  firebase: {
    apiKey: "AIzaSyCxcYMHon01CkcZeQSsLdWVng1ADNi_MRc",
    projectId: "castle-development-d01d2",
    messagingSenderId: "970099379750",
    appId: "1:970099379750:web:eadede5f331488a95ae0e7",
    vapidKey:
      "BEhMLR7VL14B0mDP71EXRW3V1AbzQZ6u8srrgkovE-X-so_2HwhslEOKYBLP6mXWNBXRaqIkBGFoF7osyBTSnII",
  },

  statics: {
    system: "Cred Development CRM",
    projectName: "Cred Development",
    title: "Cred Development CRM",
    support_mail: "fabricasupport@castle.com",
    whiteLogoBg: true,
  },
};
