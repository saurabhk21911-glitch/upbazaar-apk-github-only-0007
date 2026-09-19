const {
  withProjectBuildGradle,
  withSettingsGradle,
} = require("@expo/config-plugins");

const KOTLIN_VERSION = "1.9.24";

const withKotlinVersion = (config) => {
  // Root android/build.gradle
  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      let contents = config.modResults.contents;

      // Any direct kotlinVersion assignment
      contents = contents.replace(
        /kotlinVersion\s*=\s*[^;\n]+/g,
        `kotlinVersion = "${KOTLIN_VERSION}"`
      );

      // Kotlin Gradle Plugin versions
      contents = contents.replace(
        /org\.jetbrains\.kotlin:kotlin-gradle-plugin:[^'"\n]+/g,
        `org.jetbrains.kotlin:kotlin-gradle-plugin:${KOTLIN_VERSION}`
      );

      // plugins DSL Kotlin version
      contents = contents.replace(
        /(id\s+['"]org\.jetbrains\.kotlin[^'"]*['"]\s+version\s+['"])[^'"]+(['"])/g,
        `$1${KOTLIN_VERSION}$2`
      );

      // Force ext.kotlinVersion if it doesn't exist
      if (!contents.includes(`ext.kotlinVersion = "${KOTLIN_VERSION}"`)) {
        contents =
          `ext.kotlinVersion = "${KOTLIN_VERSION}"\n` + contents;
      }

      config.modResults.contents = contents;
    }

    return config;
  });

  // android/settings.gradle
  config = withSettingsGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      let contents = config.modResults.contents;

      // Kotlin plugin version in settings.gradle
      contents = contents.replace(
        /(org\.jetbrains\.kotlin[^'"]*['"]\s+version\s+['"])[^'"]+(['"])/g,
        `$1${KOTLIN_VERSION}$2`
      );

      contents = contents.replace(
        /(id\s+['"]org\.jetbrains\.kotlin[^'"]*['"]\s+version\s+['"])[^'"]+(['"])/g,
        `$1${KOTLIN_VERSION}$2`
      );

      config.modResults.contents = contents;
    }

    return config;
  });

  return config;
};

module.exports = withKotlinVersion;
