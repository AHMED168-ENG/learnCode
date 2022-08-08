export const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Sahlan App Express API with Swagger",
        version: "0.0.2",
        description: "This is a simple CRUD Mobile APIs made with Express and documented with Swagger",
        license: { name: "MIT", url: "https://spdx.org/licenses/MIT.html" },
        contact: { name: "SahlanApp", url: "https://internal-release.website" },
      },
      servers: [{ url: "https://internal-release.website" }, { url: "http://localhost:40000" }],
    },
    apis: ["../routes/index.ts"],
};
