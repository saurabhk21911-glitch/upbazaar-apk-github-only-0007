const { withProjectBuildGradle } = require("@expo/config-plugins");

const withKotlinVersion = (config) => {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      let contents = config.modResults.contents;

      contents = contents.replace(
        /kotlinVersion\s*=\s*["'][^"']+["']/g,
        'kotlinVersion = "1.9.24"'
      );

      if (!contents.includes('kotlinVersion = "1.9.24"')) {
        contents = `ext.kotlinVersion = "1.9.24"\n${contents}`;
      }

      config.modResults.contents = contents;
    }

    return config;
  });
};

module.exports = withKotlinVersion;
