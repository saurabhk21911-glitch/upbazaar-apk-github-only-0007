const { withProjectBuildGradle } = require("@expo/config-plugins");

module.exports = function withKotlinVersion(config) {
  return withProjectBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    // Force Kotlin 1.9.24 for Expo SDK 52 / Compose Compiler 1.5.14
    contents = contents.replace(
      /kotlinVersion\s*=\s*findProperty\(['"]android\.kotlinVersion['"]\)\s*\?:\s*['"][^'"]+['"]/g,
      'kotlinVersion = "1.9.24"'
    );

    contents = contents.replace(
      /kotlinVersion\s*=\s*['"][^'"]+['"]/g,
      'kotlinVersion = "1.9.24"'
    );

    contents = contents.replace(
      /kotlin_version\s*=\s*['"][^'"]+['"]/g,
      'kotlin_version = "1.9.24"'
    );

    return config;
  });
};
