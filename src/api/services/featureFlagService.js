import { AppConfigurationClient } from "@azure/app-configuration";

const connectionString = process.env.AZURE_CONFIGURATION_SERVER_ENV &&
                         process.env.AZURE_CONFIGURATION_SERVER &&
                         process.env.AZURE_CONFIGURATION_SERVER_ID &&
                         process.env.AZURE_CONFIGURATION_SERVER_SECRET
  ? `Endpoint=https://${process.env.AZURE_CONFIGURATION_SERVER_ENV}${process.env.AZURE_CONFIGURATION_SERVER};Id=${process.env.AZURE_CONFIGURATION_SERVER_ID};Secret=${process.env.AZURE_CONFIGURATION_SERVER_SECRET}`
  : "Endpoint=(.*);Id=(.*);Secret=(.*)";



const client = new AppConfigurationClient(connectionString);

const initializeFeatureFlags = async () => {
  const featureFlags = new Map();

  try {
    for await (const setting of client.listConfigurationSettings({ keyFilter: ".appconfig.featureflag/*" })) {
      const featureName = setting.key.replace(".appconfig.featureflag/", "");
      featureFlags.set(featureName, JSON.parse(setting.value));
    }

    return featureFlags;
  } catch (error) {
    console.error("Error initializing feature flags:", error.message);
    throw error; 
  }
};

const isFeatureEnabled = async (featureName) => {
  try {
    const featureFlags = await initializeFeatureFlags(); // Initialize feature flags
    const featureFlag = featureFlags.get(featureName);

    // Check if the feature flag exists and if it's enabled (assuming the value is 'true' or 'enabled')
    if (featureFlag && featureFlag.enabled === true) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking feature flag:", error.message);
    return false;
  }
};

export default {
  isFeatureEnabled,
};
